import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/chat/admin';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** GET /api/admin/chat/conversations?status=open|closed|all */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });

  const status = new URL(request.url).searchParams.get('status') ?? 'open';
  const db = createServiceRoleClient();

  let query = db
    .from('chat_conversations')
    .select(
      'id, category, visitor_name, visitor_email, user_id, status, admin_unread_count, last_message_at, last_message_preview, created_at'
    )
    .order('last_message_at', { ascending: false })
    .limit(100);
  if (status === 'open' || status === 'closed') query = query.eq('status', status);

  const { data, error } = await query;
  if (error) {
    console.error('Admin chat conversations error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
  return NextResponse.json({ conversations: data ?? [] });
}

/** PATCH /api/admin/chat/conversations — { conversationId, status } */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const conversationId = body?.conversationId;
  const status = body?.status;
  if (
    typeof conversationId !== 'string' ||
    !UUID_RE.test(conversationId) ||
    (status !== 'open' && status !== 'closed')
  ) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const db = createServiceRoleClient();
  const { error } = await db
    .from('chat_conversations')
    .update({ status })
    .eq('id', conversationId);
  if (error) {
    console.error('Admin chat status error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
