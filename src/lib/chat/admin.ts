// ---------------------------------------------------------------------------
// Garde admin pour les routes API du chat — même règle que le layout /admin.
// ---------------------------------------------------------------------------
import { createClient } from '@/utils/supabase/server';

const ADMIN_ROLES = new Set(['super_admin', 'editor', 'moderator']);

export async function requireAdmin(): Promise<{ userId: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile?.role || !ADMIN_ROLES.has(profile.role)) return null;
  return { userId: user.id };
}
