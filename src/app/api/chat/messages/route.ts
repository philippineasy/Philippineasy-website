import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import type { ChatConversation } from '@/lib/chat/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/chat/messages
 * - ?visitorKey=..&conversationId=..[&after=ISO] → messages de la conversation
 * - ?visitorKey=..                               → reprise : dernière conversation
 *   du visiteur (par compte si connecté — retrouvée même depuis un autre
 *   appareil —, sinon par clé anonyme localStorage).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const visitorKey = searchParams.get('visitorKey') ?? '';
    const conversationId = searchParams.get('conversationId');
    const after = searchParams.get('after');

    if (!UUID_RE.test(visitorKey)) {
      return NextResponse.json({ error: 'Identifiant visiteur invalide.' }, { status: 400 });
    }

    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    const db = createServiceRoleClient();
    let conversation: ChatConversation | null = null;

    if (conversationId && UUID_RE.test(conversationId)) {
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
      // Reprise : priorité au compte connecté, sinon clé anonyme.
      const query = db
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false })
        .limit(1);
      const { data } = user
        ? await query.or(`user_id.eq.${user.id},visitor_key.eq.${visitorKey}`)
        : await query.eq('visitor_key', visitorKey);
      conversation = (data?.[0] as ChatConversation) ?? null;
      if (!conversation) {
        return NextResponse.json({ conversation: null, messages: [] });
      }
    }

    let messagesQuery = db
      .from('chat_messages')
      .select('id, conversation_id, sender, content, created_at')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(200);
    if (after) {
      const afterDate = new Date(after);
      if (!Number.isNaN(afterDate.getTime())) {
        messagesQuery = messagesQuery.gt('created_at', afterDate.toISOString());
      }
    }
    const { data: messages } = await messagesQuery;

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        category: conversation.category,
        status: conversation.status,
        visitor_name: conversation.visitor_name,
        visitor_email: conversation.visitor_email,
      },
      messages: messages ?? [],
    });
  } catch (err) {
    console.error('Chat messages route error:', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
