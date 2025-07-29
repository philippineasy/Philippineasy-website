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
  
  let updateData: { plan: 'premium' | 'free'; premium_expires_at?: string | null; stripe_subscription_id?: null } = { plan };

  if (plan === 'premium') {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    updateData.premium_expires_at = expiryDate.toISOString();
    // Ensure no conflicting subscription ID
    updateData.stripe_subscription_id = null;
  } else {
    updateData.premium_expires_at = null;
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
