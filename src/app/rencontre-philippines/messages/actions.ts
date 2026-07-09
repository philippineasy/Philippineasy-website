'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// ---------------------------------------------------------------------------
// Actions conversation dating — passent par les RPC transactionnelles
// SECURITY DEFINER (auth.uid() = source de vérité, pas de paramètre spoofable).
// ---------------------------------------------------------------------------

export async function blockUserAction(otherUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Non autorisé.' };

  const { error } = await supabase.rpc('block_user', { p_blocked_id: otherUserId });
  if (error) {
    console.error('Error blocking user:', error);
    return { error: 'Le blocage a échoué. Réessayez.' };
  }

  revalidatePath('/rencontre-philippines/messages');
  revalidatePath('/rencontre-philippines/swipe');
  return { success: true };
}

export async function unmatchUserAction(otherUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Non autorisé.' };

  const { error } = await supabase.rpc('unmatch_user', { p_other_id: otherUserId });
  if (error) {
    console.error('Error unmatching user:', error);
    return { error: 'La suppression du match a échoué. Réessayez.' };
  }

  revalidatePath('/rencontre-philippines/messages');
  return { success: true };
}

export async function reportUserAction(
  reportedUserId: string,
  reason: string,
  messageId?: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Non autorisé.' };

  const safeReason = reason.trim().slice(0, 500);
  if (safeReason.length < 5) {
    return { error: 'Merci de préciser la raison (5 caractères minimum).' };
  }

  const { error } = await supabase.from('reported_messages').insert({
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    message_id: messageId ?? null,
    reason: safeReason,
    status: 'pending',
  });

  if (error) {
    console.error('Error reporting user:', error);
    return { error: 'Le signalement a échoué. Réessayez.' };
  }

  return { success: true };
}
