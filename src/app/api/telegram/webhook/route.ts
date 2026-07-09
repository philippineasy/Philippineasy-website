import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { deriveWebhookSecret } from '@/lib/chat/telegram';

// ---------------------------------------------------------------------------
// Webhook Telegram — permet à Hugo de répondre aux visiteurs du chat du site
// directement depuis Telegram, en utilisant "Répondre" sur une notification.
//
// Sécurité : le secret_token passé à setWebhook est dérivé du bot token
// (sha256 → 48 hex). Telegram le renvoie dans le header
// X-Telegram-Bot-Api-Secret-Token ; toute requête sans ce header est rejetée.
// Aucune nouvelle variable d'environnement nécessaire.
// ---------------------------------------------------------------------------

async function telegramSend(token: string, chatId: string | number, text: string, replyTo?: number) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...(replyTo ? { reply_parameters: { message_id: replyTo } } : {}),
    }),
  }).catch((err) => console.error('Telegram send error:', err));
}

const HELP_TEXT =
  'ℹ️ Pour répondre à un visiteur du chat philippineasy.com : utilise la fonction ' +
  '"Répondre" de Telegram sur le message de notification (💬 Chat site …). ' +
  'Ta réponse apparaîtra instantanément dans son fil sur le site.';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerChatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !ownerChatId) {
    return NextResponse.json({ ok: true }); // pas configuré : ignorer silencieusement
  }

  // Fail-closed : header secret obligatoire et exact.
  const secret = request.headers.get('x-telegram-bot-api-secret-token');
  if (secret !== deriveWebhookSecret(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Toujours répondre 200 à Telegram (sinon il retente en boucle).
  try {
    const update = (await request.json().catch(() => null)) as {
      message?: {
        message_id: number;
        text?: string;
        chat: { id: number };
        reply_to_message?: { message_id: number };
      };
    } | null;

    const message = update?.message;
    if (!message?.text) return NextResponse.json({ ok: true });

    // N'accepter que les messages venant du chat de Hugo.
    if (String(message.chat.id) !== String(ownerChatId)) {
      return NextResponse.json({ ok: true });
    }

    const replyToId = message.reply_to_message?.message_id;
    if (!replyToId) {
      await telegramSend(token, ownerChatId, HELP_TEXT);
      return NextResponse.json({ ok: true });
    }

    const db = createServiceRoleClient();
    const { data: mapping } = await db
      .from('chat_telegram_notifications')
      .select('conversation_id')
      .eq('telegram_message_id', replyToId)
      .single();

    if (!mapping) {
      await telegramSend(
        token,
        ownerChatId,
        '⚠️ Je ne retrouve pas la conversation liée à ce message. Réponds directement à une notification "💬 Chat site", ou passe par philippineasy.com/admin/chat.',
        message.message_id
      );
      return NextResponse.json({ ok: true });
    }

    const content = message.text.trim().slice(0, 4000);
    const { error } = await db.from('chat_messages').insert({
      conversation_id: mapping.conversation_id,
      sender: 'admin',
      content,
    });
    if (error) {
      console.error('Telegram webhook insert error:', error.message);
      await telegramSend(token, ownerChatId, '❌ Erreur : réponse non enregistrée. Réessaie ou passe par /admin/chat.', message.message_id);
      return NextResponse.json({ ok: true });
    }

    await db
      .from('chat_conversations')
      .update({
        status: 'open',
        last_message_at: new Date().toISOString(),
        last_message_preview: `Hugo: ${content.slice(0, 130)}`,
        admin_unread_count: 0,
      })
      .eq('id', mapping.conversation_id);

    await telegramSend(
      token,
      ownerChatId,
      `✅ Envoyé au visiteur (#${String(mapping.conversation_id).slice(0, 8)})`,
      message.message_id
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ ok: true });
  }
}
