import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { callOpenAIJson } from '@/lib/itinerary/openai';
import { buildChatSystemPrompt } from '@/lib/chat/knowledge';
import { notifyHugo } from '@/lib/chat/notify';
import {
  CHAT_CATEGORIES,
  DIRECT_ACK,
  isChatCategory,
  type ChatCategory,
  type ChatConversation,
  type ChatMessage,
} from '@/lib/chat/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_CONTENT_LENGTH = 2000;

// ---------------------------------------------------------------------------
// Rate limiter en mémoire — même approche que /api/contact (par instance).
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 8; // messages
const RATE_WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (rateLimitMap.size > 1000) {
      for (const [k, v] of rateLimitMap) if (now > v.resetAt) rateLimitMap.delete(k);
    }
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count += 1;
  return false;
}

// ---------------------------------------------------------------------------
// Réponse IA (catégories informationnelles)
// ---------------------------------------------------------------------------
interface AIChatResult {
  reply: string;
  needs_human: boolean;
}

const AI_FALLBACK =
  "Je n'arrive pas à te répondre automatiquement là tout de suite, mais Hugo vient d'être notifié " +
  'de ton message — il te répond ici même dès que possible.';

async function generateAIReply(
  transcript: ChatMessage[],
  newMessage: string
): Promise<AIChatResult> {
  const history = transcript
    .slice(-12)
    .map((m) => `${m.sender === 'visitor' ? 'Visiteur' : m.sender === 'ai' ? 'Assistant' : 'Hugo'}: ${m.content}`)
    .join('\n');

  try {
    const { data } = await callOpenAIJson<AIChatResult>({
      system: buildChatSystemPrompt(),
      user: `${history ? `Historique de la conversation:\n${history}\n\n` : ''}Nouveau message du visiteur:\n${newMessage}`,
      model: 'gpt-4.1-mini',
      temperature: 0.4,
      maxTokens: 500,
      timeoutMs: 20_000,
    });
    if (typeof data.reply !== 'string' || !data.reply.trim()) {
      return { reply: AI_FALLBACK, needs_human: true };
    }
    return { reply: data.reply.trim(), needs_human: data.needs_human === true };
  } catch (err) {
    console.error('Chat AI error:', err instanceof Error ? err.message : err);
    return { reply: AI_FALLBACK, needs_human: true };
  }
}

// ---------------------------------------------------------------------------
// POST /api/chat/message
// Body: { visitorKey, content, conversationId?, category?, name?, email? }
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Doucement 🙂 Réessaie dans quelques minutes.' },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });

    const { visitorKey, content, conversationId, category, name, email } = body;

    if (typeof visitorKey !== 'string' || !UUID_RE.test(visitorKey)) {
      return NextResponse.json({ error: 'Identifiant visiteur invalide.' }, { status: 400 });
    }
    if (typeof content !== 'string' || !content.trim() || content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Le message doit faire entre 1 et ${MAX_CONTENT_LENGTH} caractères.` },
        { status: 400 }
      );
    }
    const safeContent = content.trim();

    // Session éventuelle (visiteur connecté) — jamais obligatoire.
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    const db = createServiceRoleClient();
    let conversation: ChatConversation | null = null;
    let isNewConversation = false;

    if (typeof conversationId === 'string' && UUID_RE.test(conversationId)) {
      const { data } = await db
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      const owned =
        data && (data.visitor_key === visitorKey || (user && data.user_id === user.id));
      if (!owned) {
        return NextResponse.json({ error: 'Conversation introuvable.' }, { status: 404 });
      }
      conversation = data as ChatConversation;
    } else {
      if (!isChatCategory(category)) {
        return NextResponse.json({ error: 'Catégorie invalide.' }, { status: 400 });
      }
      const visitorName =
        typeof name === 'string' && name.trim() ? name.trim().slice(0, 80) : null;
      const visitorEmail =
        typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
          ? email.trim().toLowerCase()
          : null;

      const { data, error } = await db
        .from('chat_conversations')
        .insert({
          visitor_key: visitorKey,
          user_id: user?.id ?? null,
          category,
          visitor_name: visitorName,
          visitor_email: visitorEmail ?? user?.email ?? null,
        })
        .select('*')
        .single();
      if (error || !data) {
        console.error('Chat conversation insert error:', error?.message);
        return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
      }
      conversation = data as ChatConversation;
      isNewConversation = true;
    }

    // Historique (pour l'IA) AVANT d'insérer le nouveau message.
    const { data: history } = await db
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(30);

    const { data: visitorMsg, error: msgError } = await db
      .from('chat_messages')
      .insert({ conversation_id: conversation.id, sender: 'visitor', content: safeContent })
      .select('*')
      .single();
    if (msgError || !visitorMsg) {
      console.error('Chat message insert error:', msgError?.message);
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
    }

    // Réponse automatique : IA pour aide/offres, accusé de réception à la
    // création pour les catégories relayées directement à Hugo.
    const cat = conversation.category as ChatCategory;
    let autoReply: string | null = null;
    let needsHuman = !CHAT_CATEGORIES[cat].ai;

    if (CHAT_CATEGORIES[cat].ai) {
      const ai = await generateAIReply((history ?? []) as ChatMessage[], safeContent);
      autoReply = ai.reply;
      needsHuman = ai.needs_human;
    } else if (isNewConversation) {
      autoReply = DIRECT_ACK[cat as keyof typeof DIRECT_ACK];
    }

    let aiMsg: ChatMessage | null = null;
    if (autoReply) {
      const { data } = await db
        .from('chat_messages')
        .insert({ conversation_id: conversation.id, sender: 'ai', content: autoReply })
        .select('*')
        .single();
      aiMsg = (data as ChatMessage) ?? null;
    }

    await db
      .from('chat_conversations')
      .update({
        status: 'open',
        last_message_at: new Date().toISOString(),
        last_message_preview: safeContent.slice(0, 140),
        admin_unread_count: conversation.admin_unread_count + 1,
      })
      .eq('id', conversation.id);

    // Notifications (Telegram + email) — les échecs sont loggés, jamais bloquants.
    await notifyHugo({
      conversation,
      visitorMessage: safeContent,
      aiReply: CHAT_CATEGORIES[cat].ai ? autoReply : null,
      needsHuman,
    });

    return NextResponse.json({
      conversationId: conversation.id,
      messages: [visitorMsg, ...(aiMsg ? [aiMsg] : [])],
    });
  } catch (err) {
    console.error('Chat message route error:', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
