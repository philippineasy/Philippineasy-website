import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/chat/admin';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** POST /api/admin/chat/reply — { conversationId, content } */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const conversationId = body?.conversationId;
  const content = body?.content;
  if (
    typeof conversationId !== 'string' ||
    !UUID_RE.test(conversationId) ||
    typeof content !== 'string' ||
    !content.trim() ||
    content.length > 4000
  ) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  const safeContent = content.trim();

  const db = createServiceRoleClient();
  const { data: message, error } = await db
    .from('chat_messages')
    .insert({ conversation_id: conversationId, sender: 'admin', content: safeContent })
    .select('*')
    .single();
  if (error || !message) {
    console.error('Admin chat reply error:', error?.message);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }

  await db
    .from('chat_conversations')
    .update({
      status: 'open',
      last_message_at: new Date().toISOString(),
      last_message_preview: `Hugo: ${safeContent.slice(0, 130)}`,
      admin_unread_count: 0,
    })
    .eq('id', conversationId);

  return NextResponse.json({ message });
}
