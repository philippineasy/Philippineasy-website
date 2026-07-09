'use server';

import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { requireAdmin } from '@/utils/auth/requireAdmin';
import { sendDatingProfileApproved, sendDatingProfileRejected } from '@/emails/senders/dating';
import { revalidatePath } from 'next/cache';

export async function validateProfile(userId: string, isValidated: boolean, rejectionReason?: string) {
  await requireAdmin();
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('dating_profiles')
    .update({ is_validated: isValidated })
    .eq('user_id', userId);

  if (error) {
    return { error: error.message };
  }

  // Synchronise la file de modération photos : valider un profil = approuver ses
  // photos en attente (elles sont déjà publiques dès la validation, elles ne
  // doivent plus apparaître comme « en attente »). Refuser = rejeter les photos
  // + retirer la photo de profil publique. (Désync des 2 files, audit 07/09.)
  if (isValidated) {
    await supabase
      .from('dating_photos')
      .update({ status: 'approved' })
      .eq('user_id', userId)
      .eq('status', 'pending');
    sendDatingProfileApproved(userId).catch((e) =>
      console.error('sendDatingProfileApproved:', e instanceof Error ? e.message : e)
    );
  } else {
    await supabase
      .from('dating_photos')
      .update({ status: 'rejected' })
      .eq('user_id', userId)
      .neq('status', 'rejected');
    await supabase
      .from('dating_profiles')
      .update({ profile_picture_url: null })
      .eq('user_id', userId);
    sendDatingProfileRejected(userId, rejectionReason).catch((e) =>
      console.error('sendDatingProfileRejected:', e instanceof Error ? e.message : e)
    );
  }

  revalidatePath('/admin/dating/profiles');
  revalidatePath('/admin/dating/photos');
  return { success: true };
}

export async function grantPremium(userId: string, plan: 'premium' | 'free') {
  await requireAdmin();
  const supabase = createServiceRoleClient();

  // We write BOTH legacy column (premium_expires_at, read by admin/dating UI)
  // AND the canonical column (rencontre_premium_expires_at, read by crons +
  // activationService). Don't drop one without migrating the other.
  const updateData: {
    plan: 'premium' | 'free';
    premium_expires_at?: string | null;
    rencontre_premium_expires_at?: string | null;
    stripe_subscription_id?: null;
  } = { plan };

  if (plan === 'premium') {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    updateData.premium_expires_at = expiryDate.toISOString();
    updateData.rencontre_premium_expires_at = expiryDate.toISOString();
    updateData.stripe_subscription_id = null;
  } else {
    updateData.premium_expires_at = null;
    updateData.rencontre_premium_expires_at = null;
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dating/profiles');
  return { success: true };
}

export async function banUser(userId: string, isBanned: boolean) {
    await requireAdmin();
    const supabase = createServiceRoleClient();
    const { error } = await supabase
        .from('profiles')
        .update({ is_banned: isBanned })
        .eq('id', userId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/dating/profiles');
    return { success: true };
}
