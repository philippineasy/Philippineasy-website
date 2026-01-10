'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approvePhoto(photoId: number) {
  const supabase = await createClient();
  
  // First, update the photo status to 'approved'
  const { data: updatedPhoto, error: updateError } = await supabase
    .from('dating_photos')
    .update({ status: 'approved' })
    .eq('id', photoId)
    .select()
    .single();

  if (updateError) {
    console.error('Error approving photo:', updateError);
    return { error: updateError.message };
  }

  if (!updatedPhoto) {
    return { error: 'Photo not found after update.' };
  }

  const userId = updatedPhoto.user_id;

  // Next, check if the user's main profile picture is already set.
  const { data: userDatingProfile, error: profileError } = await supabase
    .from('dating_profiles')
    .select('profile_picture_url, gender')
    .eq('user_id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching user dating profile:', profileError);
    // Continue without setting profile picture, as the main goal (approval) is done.
  }

  // If the user has no main profile picture, set this one as the default.
  if (userDatingProfile && !userDatingProfile.profile_picture_url) {
    const { error: setProfilePicError } = await supabase
      .from('dating_profiles')
      .update({ profile_picture_url: updatedPhoto.image_url })
      .eq('user_id', userId);

    if (setProfilePicError) {
      console.error('Error setting default profile picture:', setProfilePicError);
      // Non-critical error
    }
  }

  // Grant premium for women upon first photo approval
  if (userDatingProfile && userDatingProfile.gender === 'Femme') {
    const { data: mainProfile, error: mainProfileError } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single();

    if (mainProfile && mainProfile.plan !== 'premium') {
        const { error: premiumError } = await supabase
            .from('profiles')
            .update({ plan: 'premium' })
            .eq('id', userId);

        if (premiumError) {
            console.error('Error granting premium status:', premiumError);
        }
    }
  }

  revalidatePath('/admin/dating/photos');
  revalidatePath(`/rencontre/profil/${userId}`);
  return { success: true };
}

export async function rejectPhoto(photoId: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('dating_photos')
    .update({ status: 'rejected' })
    .eq('id', photoId);

  if (error) {
    console.error('Error rejecting photo:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/dating/photos');
  return { success: true };
}
