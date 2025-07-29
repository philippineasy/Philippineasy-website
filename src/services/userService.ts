import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export const getProfileById = async (userId: string) => {
  const supabase = createClient();
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

export const updateUserRole = async (supabase: SupabaseClient, userId: number, newRole: string) => {
    const { error } = await supabase.rpc('update_user_role', { user_id_to_update: userId, new_role: newRole });
    if (error) {
        console.error('Error updating role:', error);
    }
    return { error };
};

export const banUser = async (supabase: SupabaseClient, userId: number, reason: string, durationDays: number | null) => {
    const { error } = await supabase.rpc('ban_user', { user_id_to_ban: userId, ban_reason_text: reason, ban_duration_days: durationDays });
    if (error) {
        console.error('Error banning user:', error);
    }
    return { error };
};

export const unbanUser = async (supabase: SupabaseClient, userId: number) => {
    const { error } = await supabase.rpc('unban_user', { user_id_to_unban: userId });
    if (error) {
        console.error('Error unbanning user:', error);
    }
    return { error };
};
