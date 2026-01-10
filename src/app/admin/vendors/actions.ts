'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function handleVendorApproval(vendorId: number, userId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient();

  // 1. Update the vendor status
  const { error: vendorError } = await supabase
    .from('vendors')
    .update({ status })
    .eq('id', vendorId);

  if (vendorError) {
    console.error('Error updating vendor status:', vendorError);
    return { success: false, error: vendorError.message };
  }

  // 2. If approved, update the user's role, but only if they are not already a super_admin
  if (status === 'approved') {
    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileFetchError) {
      console.error('Error fetching profile:', profileFetchError);
      return { success: false, error: profileFetchError.message };
    }

    if (profile.role !== 'super_admin') {
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ role: 'vendor' })
        .eq('id', userId);

      if (profileUpdateError) {
        console.error('Error updating user role:', profileUpdateError);
        // Optional: handle rollback of vendor status update here
        return { success: false, error: profileUpdateError.message };
      }
    }
  }

  // 3. Revalidate the path to refresh the data on the admin page
  revalidatePath('/admin/vendors');

  return { success: true };
}
