import type { SupabaseClient } from '@supabase/supabase-js';

export const getProfileById = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile by id:', error);
    return null;
  }

  return data;
};

export const getAllUsers = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.error('Error fetching users:', error);
    }
    return { data, error };
};

export const updateUserRole = async (supabase: SupabaseClient, userId: string, newRole: string) => {
    const { error } = await supabase.rpc('update_user_role', { user_id_to_update: userId, new_role: newRole });
    if (error) {
        console.error('Error updating role:', error);
    }
    return { error };
};

export const banUser = async (supabase: SupabaseClient, userId: string, reason: string, durationDays: number | null) => {
    const { error } = await supabase.rpc('ban_user', { user_id_to_ban: userId, ban_reason_text: reason, ban_duration_days: durationDays });
    if (error) {
        console.error('Error banning user:', error);
    }
    return { error };
};

export const unbanUser = async (supabase: SupabaseClient, userId: string) => {
    const { error } = await supabase.rpc('unban_user', { user_id_to_unban: userId });
    if (error) {
        console.error('Error unbanning user:', error);
    }
    return { error };
};

export type DatingGateStatus = 'no-profile' | 'pending' | 'validated';

/**
 * Server-side gate for the dating area: distinguishes users without a
 * `dating_profiles` row, users pending moderation, and validated members.
 * Used to redirect swipe/messages/likes/profil pages that previously only
 * checked for an authenticated session.
 */
export const getDatingGateStatus = async (
  supabase: SupabaseClient,
  userId: string
): Promise<DatingGateStatus> => {
  const { data, error } = await supabase
    .from('dating_profiles')
    .select('is_validated')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error checking dating profile gate status:', error);
    return 'no-profile';
  }

  if (!data) return 'no-profile';
  return data.is_validated ? 'validated' : 'pending';
};
