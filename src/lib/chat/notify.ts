// ---------------------------------------------------------------------------
// Notifications Hugo pour le chat du site : Telegram (avec routage des
// réponses via reply) + email Resend (throttlé par conversation).
// ---------------------------------------------------------------------------
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendEmail } from '@/emails/send';
import { buildEmailHtml } from '@/emails/templates/base';
import { emailInfoBox } from '@/emails/templates/components';
import { BRAND } from '@/emails/config';
import { CHAT_CATEGORIES, type ChatCategory, type ChatConversation } from './types';

const EMAIL_THROTTLE_MS = 10 * 60 * 1000; // 1 email max / 10 min / conversation

interface NotifyParams {
  conversation: ChatConversation;
  visitorMessage: string;
  aiReply?: string | null;
  needsHuman?: boolean;
}

function describeVisitor(conversation: ChatConversation): string {
  const parts: string[] = [];
  parts.push(conversation.visitor_name?.trim() || 'Visiteur anonyme');
  if (conversation.visitor_email) parts.push(conversation.visitor_email);
  if (conversation.user_id) parts.push('compte site ✓');
  return parts.join(' · ');
}

// ---------------------------------------------------------------------------
// Telegram
// ---------------------------------------------------------------------------
async function sendTelegram(params: NotifyParams): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('Chat notify: Telegram credentials not configured, skipping');
    return;
  }

  const { conversation, visitorMessage, aiReply, needsHuman } = params;
  const cat = CHAT_CATEGORIES[conversation.category as ChatCategory];
  const shortId = conversation.id.slice(0, 8);

  const lines = [
    `${cat.emoji} Chat site [${cat.label}]${needsHuman ? ' ⚠️ intervention demandée' : ''}`,
    describeVisitor(conversation),
    '',
    visitorMessage.length > 800 ? visitorMessage.slice(0, 800) + '…' : visitorMessage,
  ];
  if (aiReply) {
    lines.push('', `🤖 Réponse IA envoyée : ${aiReply.length > 400 ? aiReply.slice(0, 400) + '…' : aiReply}`);
  }
  lines.push('', `↩️ Réponds à CE message pour répondre au visiteur (#${shortId})`);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') }),
  });

  if (!res.ok) {
    console.error(`Chat notify: Telegram error ${res.status}: ${await res.text().catch(() => '')}`);
    return;
  }

  // Mémorise l'ID du message Telegram pour router la réponse de Hugo
  // (webhook /api/telegram/webhook lit reply_to_message.message_id).
  const json = await res.json().catch(() => null);
  const messageId = json?.result?.message_id;
  if (typeof messageId === 'number') {
    const supabase = createServiceRoleClient();
    await supabase.from('chat_telegram_notifications').insert({
      telegram_message_id: messageId,
      conversation_id: conversation.id,
    });
  }
}

// ---------------------------------------------------------------------------
// Email (throttlé)
// ---------------------------------------------------------------------------
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

async function sendEmailNotification(params: NotifyParams): Promise<void> {
  const { conversation, visitorMessage, aiReply } = params;

  const lastNotif = conversation.last_email_notif_at
    ? new Date(conversation.last_email_notif_at).getTime()
    : 0;
  if (Date.now() - lastNotif < EMAIL_THROTTLE_MS) return;

  const supabase = createServiceRoleClient();
  await supabase
    .from('chat_conversations')
    .update({ last_email_notif_at: new Date().toISOString() })
    .eq('id', conversation.id);

  const cat = CHAT_CATEGORIES[conversation.category as ChatCategory];
  const to = process.env.CONTACT_EMAIL || 'philippineasy@gmail.com';

  const bodyHtml = `
    ${emailInfoBox([
      { label: 'Catégorie', value: `${cat.emoji} ${cat.label}` },
      { label: 'Visiteur', value: escapeHtml(describeVisitor(conversation)) },
    ])}
    <p style="margin:16px 0 8px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;font-size:14px;color:#0f172a;line-height:1.7;">
      ${escapeHtml(visitorMessage)}
    </div>
    ${
      aiReply
        ? `<p style="margin:16px 0 8px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Réponse IA envoyée</p>
    <div style="background-color:#f0f7ff;border:1px solid #dbeafe;border-radius:10px;padding:16px 20px;font-size:14px;color:#0f172a;line-height:1.7;">
      ${escapeHtml(aiReply)}
    </div>`
        : ''
    }
  `;

  await sendEmail({
    to,
    from: 'contact',
    category: 'transactional',
    subject: `[Chat] ${cat.label} — ${conversation.visitor_name?.trim() || 'Visiteur'}`,
    html: buildEmailHtml({
      title: 'Nouveau message sur le chat du site',
      preheader: visitorMessage.slice(0, 120),
      bodyHtml,
      ctaText: 'Répondre dans l’admin',
      ctaUrl: `${BRAND.siteUrl}/admin/chat`,
      footerText: "Philippin'Easy — Chat du site",
    }),
  });
}

// ---------------------------------------------------------------------------
// Point d'entrée — fire-and-forget, ne bloque jamais la réponse au visiteur.
// ---------------------------------------------------------------------------
export async function notifyHugo(params: NotifyParams): Promise<void> {
  const results = await Promise.allSettled([sendTelegram(params), sendEmailNotification(params)]);
  for (const r of results) {
    if (r.status === 'rejected') {
      console.error('Chat notify error:', r.reason instanceof Error ? r.reason.message : r.reason);
    }
  }
}
