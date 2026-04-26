'use server';

import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { revalidatePath } from 'next/cache';

export async function validateProfile(userId: string, isValidated: boolean) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('dating_profiles')
    .update({ is_validated: isValidated })
    .eq('user_id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dating/profiles');
  return { success: true };
}

export async function grantPremium(userId: string, plan: 'premium' | 'free') {
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
