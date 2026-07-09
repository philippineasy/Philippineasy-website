import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/chat/admin';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** GET /api/admin/chat/messages?conversationId=..[&after=ISO] — marque lu. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId') ?? '';
  const after = searchParams.get('after');
  if (!UUID_RE.test(conversationId)) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const db = createServiceRoleClient();
  let query = db
    .from('chat_messages')
    .select('id, conversation_id, sender, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(300);
  if (after) {
    const afterDate = new Date(after);
    if (!Number.isNaN(afterDate.getTime())) query = query.gt('created_at', afterDate.toISOString());
  }

  const { data, error } = await query;
  if (error) {
    console.error('Admin chat messages error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }

  // Ouvrir le fil = marquer lu (best-effort).
  db.from('chat_conversations')
    .update({ admin_unread_count: 0 })
    .eq('id', conversationId)
    .then(() => {});

  return NextResponse.json({ messages: data ?? [] });
}
