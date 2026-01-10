'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { DatingProfile } from '@/types';

export async function reportUser(reporterId: string, reportedId: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('reported_messages').insert({
    reporter_id: reporterId,
    reported_user_id: reportedId,
    reason: reason,
    status: 'pending',
  });

  if (error) {
    console.error('Error reporting user:', error);
    return { error: error.message };
  }

  return { success: true };
}

// Define a specific type for the update payload
export type UpdateDatingProfilePayload = Partial<Omit<DatingProfile, 'interests' | 'answers'>> & {
  interests?: string[];
  answers?: { question_key: string; answer: string }[];
};

export async function updateDatingProfile(formData: UpdateDatingProfilePayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { interests, answers, ...profileData } = formData;

  // Update the main profile data
  const { error: profileError } = await supabase
    .from('dating_profiles')
    .update(profileData)
    .eq('user_id', user.id);

  if (profileError) {
    console.error('Error updating dating profile:', profileError);
    return { error: profileError.message };
  }

  // Handle interests update
  if (interests) {
    // 1. Delete existing interests for the user
    const { error: deleteError } = await supabase
      .from('dating_profile_interests')
      .delete()
      .eq('profile_id', user.id);

    if (deleteError) {
      console.error('Error deleting old interests:', deleteError);
      return { error: deleteError.message };
    }

    // 2. Insert new interests
    const newInterests = interests.map((interestId: any) => ({
      profile_id: user.id,
      interest_id: parseInt(interestId, 10), // Ensure it's an integer
    }));

    const { error: insertError } = await supabase
      .from('dating_profile_interests')
      .insert(newInterests);

    if (insertError) {
      console.error('Error inserting new interests:', insertError);
      return { error: insertError.message };
    }
  }

  // Handle answers update
  if (answers) {
    // 1. Delete existing answers
    const { error: deleteError } = await supabase
      .from('dating_question_answers')
      .delete()
      .eq('profile_id', user.id);

    if (deleteError) {
      console.error('Error deleting old answers:', deleteError);
      return { error: deleteError.message };
    }

    // 2. Insert new answers
    const newAnswers = answers
      .filter(a => a.question_key && a.answer)
      .map(a => ({
        profile_id: user.id,
        question_key: a.question_key,
        answer: a.answer,
      }));

    if (newAnswers.length > 0) {
      const { error: insertError } = await supabase
        .from('dating_question_answers')
        .insert(newAnswers);

      if (insertError) {
        console.error('Error inserting new answers:', insertError);
        return { error: insertError.message };
      }
    }
  }

  revalidatePath(`/rencontre-philippines/profil/${user.id}`);
  revalidatePath(`/rencontre-philippines/profil/modifier`);
  return { success: true };
}

export async function uploadNewPhoto(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const photo = formData.get('photo') as File;
  if (!photo || photo.size === 0) {
    return { error: 'No photo provided' };
  }

  // Upload photo to Storage
  const photoPath = `${user.id}/${Date.now()}_${photo.name}`;
  const { error: uploadError } = await supabase.storage
    .from('dating-photos')
    .upload(photoPath, photo);

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    return { error: 'Failed to upload photo' };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('dating-photos')
    .getPublicUrl(photoPath);

  // Get the highest current sort_order for the user's photos
  const { data: lastPhoto, error: sortError } = await supabase
    .from('dating_photos')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const newSortOrder = sortError ? 1 : (lastPhoto?.sort_order || 0) + 1;

  // Insert the uploaded photo into our dating_photos table
  const { data: newPhoto, error: photoInsertError } = await supabase
    .from('dating_photos')
    .insert({
      user_id: user.id,
      image_url: publicUrl,
      status: 'pending',
      sort_order: newSortOrder,
    })
    .select()
    .single();

  if (photoInsertError) {
      console.error('Error inserting photo metadata:', photoInsertError);
      return { error: 'Failed to save photo metadata.' };
  }

  revalidatePath('/rencontre-philippines/profil/modifier');
  return { success: true, photo: newPhoto };
}

export async function deletePhoto(photoId: number, imageUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Security check: ensure the user owns the photo
  const { data: photo, error: fetchError } = await supabase
    .from('dating_photos')
    .select('id, user_id, image_url')
    .eq('id', photoId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !photo) {
    return { error: 'Photo not found or you do not have permission to delete it.' };
  }
  
  // 1. Delete from storage
  const path = new URL(imageUrl).pathname.split('/dating-photos/')[1];
  const { error: storageError } = await supabase.storage
    .from('dating-photos')
    .remove([path]);

  if (storageError) {
    console.error('Error deleting photo from storage:', storageError);
    // Don't block if storage deletion fails, but log it. The DB is the source of truth.
  }

  // 2. Delete from database
  const { error: dbError } = await supabase
    .from('dating_photos')
    .delete()
    .eq('id', photoId);

  if (dbError) {
    console.error('Error deleting photo from database:', dbError);
    return { error: 'Failed to delete photo from database.' };
  }

  // If the deleted photo was the profile picture, unset it
  const { data: userProfile } = await supabase
    .from('dating_profiles')
    .select('profile_picture_url')
    .eq('user_id', user.id)
    .single();

  if (userProfile?.profile_picture_url === imageUrl) {
    await supabase
      .from('dating_profiles')
      .update({ profile_picture_url: null })
      .eq('user_id', user.id);
  }

  revalidatePath('/rencontre-philippines/profil/modifier');
  revalidatePath(`/rencontre-philippines/profil/${user.id}`);
  return { success: true };
}

export async function getSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_subscription_id')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.stripe_subscription_id) {
    return null;
  }

  const stripe = new (require('stripe'))(process.env.STRIPE_SECRET_KEY);
  try {
    const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
    return subscription;
  } catch (error) {
    console.error('Error fetching Stripe subscription:', error);
    return null;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  const stripe = new (require('stripe'))(process.env.STRIPE_SECRET_KEY);
  try {
    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return { success: true, data: canceledSubscription };
  } catch (error: any) {
    console.error('Error canceling Stripe subscription:', error);
    return { error: error.message };
  }
}

export async function unmatchUser(matchId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // The RLS policy ensures the user is part of the match.
  const { error } = await supabase
    .from('matches')
    .update({ status: 'unmatched' })
    .eq('id', matchId);

  if (error) {
    console.error('Error unmatching user:', error);
    return { error: error.message };
  }

  revalidatePath('/rencontre-philippines/messages');
  return { success: true };
}

export async function blockUser(blockedUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const blockerId = user.id;

    // 1. Add to blocked_users table
    const { error: blockError } = await supabase
        .from('blocked_users')
        .insert({ blocker_id: blockerId, blocked_id: blockedUserId });

    if (blockError) {
        console.error('Error blocking user:', blockError);
        return { error: 'Failed to block user.' };
    }

    // 2. Find and update any existing match
    const { data: match } = await supabase
        .from('matches')
        .select('id')
        .or(`(user_id_1.eq.${blockerId},user_id_2.eq.${blockedUserId}),(user_id_1.eq.${blockedUserId},user_id_2.eq.${blockerId})`)
        .single();

    if (match) {
        await supabase.from('matches').update({ status: 'unmatched' }).eq('id', match.id);
    }

    // 3. Delete any likes between the two users
    await supabase
        .from('likes')
        .delete()
        .or(`(from_user_id.eq.${blockerId},to_user_id.eq.${blockedUserId}),(from_user_id.eq.${blockedUserId},to_user_id.eq.${blockerId})`);

  revalidatePath('/rencontre-philippines');
  return { success: true };
}

export async function likeUser(toUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase.rpc('process_like', {
    p_from_user_id: user.id,
    p_to_user_id: toUserId,
    p_is_super_like: false,
  });

  if (error) {
    console.error('Error liking user:', error);
    return { error: error.message };
  }

  revalidatePath(`/rencontre-philippines/profil/${toUserId}`);
  return { success: true };
}

export async function superLikeUser(toUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Check if user is premium
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (profile?.plan !== 'premium') {
    return { error: 'Super Likes are a premium feature.' };
  }

  const { error } = await supabase.rpc('process_like', {
    p_from_user_id: user.id,
    p_to_user_id: toUserId,
    p_is_super_like: true,
  });

  if (error) {
    console.error('Error super liking user:', error);
    return { error: error.message };
  }

  revalidatePath(`/rencontre-philippines/profil/${toUserId}`);
  return { success: true };
}
