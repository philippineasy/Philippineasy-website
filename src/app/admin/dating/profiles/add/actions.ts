'use server';

import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { revalidatePath } from 'next/cache';

export async function createManualProfile(formData: FormData) {
  const supabase = createServiceRoleClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  if (!email || !password || !username) {
    return { error: 'Email, mot de passe et nom d\'utilisateur sont requis.' };
  }

  // 1. Create auth user (skip email verification)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (authError) {
    return { error: `Erreur création compte: ${authError.message}` };
  }

  const userId = authData.user.id;

  // 2. Update profiles entry (created by trigger) with username
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', userId);

  if (profileUpdateError) {
    console.error('Error updating username:', profileUpdateError);
  }

  // 3. Upload photos to storage
  const photos = formData.getAll('photos') as File[];
  const validPhotos = photos.filter(f => f.size > 0);
  let profilePictureUrl: string | null = null;
  const uploadedPhotos: { url: string; sortOrder: number }[] = [];

  for (let i = 0; i < validPhotos.length; i++) {
    const photo = validPhotos[i];
    const photoPath = `${userId}/${Date.now()}_${i}_${photo.name}`;
    const { error: uploadError } = await supabase.storage
      .from('dating_profile_pictures')
      .upload(photoPath, photo);

    if (uploadError) {
      console.error(`Error uploading photo ${i}:`, uploadError);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('dating_profile_pictures')
      .getPublicUrl(photoPath);

    uploadedPhotos.push({ url: publicUrl, sortOrder: i });
    if (i === 0) profilePictureUrl = publicUrl;
  }

  // 4. Build birth date
  const year = Number(formData.get('year'));
  const month = Number(formData.get('month'));
  const day = Number(formData.get('day'));
  const birthDate = new Date(year, month - 1, day).toISOString().split('T')[0];

  const autoValidate = formData.get('auto_validate') === 'true';

  // 5. Insert dating profile
  const { error: datingError } = await supabase
    .from('dating_profiles')
    .insert({
      user_id: userId,
      gender: formData.get('gender') as string,
      orientation: formData.get('orientation') as string,
      birth_date: birthDate,
      city: formData.get('city') as string,
      description: formData.get('description') as string,
      profile_picture_url: profilePictureUrl,
      height: Number(formData.get('height')) || null,
      religion: formData.get('religion') as string || null,
      education: formData.get('education') as string || null,
      occupation: formData.get('occupation') as string || null,
      dating_intent: formData.get('dating_intent') as string || null,
      is_validated: autoValidate,
      charter_signed_at: new Date().toISOString(),
      message_daily_count: 0,
    });

  if (datingError) {
    // Cleanup: delete the auth user
    await supabase.auth.admin.deleteUser(userId);
    return { error: `Erreur création profil dating: ${datingError.message}` };
  }

  // 6. Insert photos into dating_photos table
  if (uploadedPhotos.length > 0) {
    const photoRows = uploadedPhotos.map(p => ({
      user_id: userId,
      image_url: p.url,
      sort_order: p.sortOrder,
      status: autoValidate ? 'approved' : 'pending',
    }));
    const { error: photosDbError } = await supabase
      .from('dating_photos')
      .insert(photoRows);

    if (photosDbError) {
      console.error('Error inserting photo records:', photosDbError);
    }
  }

  // 7. Insert interests
  const interests = formData.getAll('interests')
    .map(i => parseInt(String(i), 10))
    .filter(n => !isNaN(n));

  if (interests.length > 0) {
    const interestRows = interests.map(interestId => ({
      profile_id: userId,
      interest_id: interestId,
    }));
    const { error: interestsError } = await supabase
      .from('dating_profile_interests')
      .insert(interestRows);

    if (interestsError) {
      console.error('Error inserting interests:', interestsError);
    }
  }

  // 8. Insert question answers
  const answers: { profile_id: string; question_key: string; answer: string }[] = [];
  for (let i = 0; i < 3; i++) {
    const key = formData.get(`answers.${i}.question_key`) as string;
    const answer = formData.get(`answers.${i}.answer`) as string;
    if (key && answer) {
      answers.push({ profile_id: userId, question_key: key, answer });
    }
  }

  if (answers.length > 0) {
    const { error: answersError } = await supabase
      .from('dating_question_answers')
      .insert(answers);

    if (answersError) {
      console.error('Error inserting answers:', answersError);
    }
  }

  // 9. Grant premium if requested
  const grantPremium = formData.get('grant_premium') === 'true';
  if (grantPremium) {
    const premiumDuration = formData.get('premium_duration') as string;
    let premiumExpiry: Date;

    switch (premiumDuration) {
      case '30': premiumExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); break;
      case '90': premiumExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); break;
      case '180': premiumExpiry = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); break;
      case '365': premiumExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); break;
      case 'permanent': premiumExpiry = new Date('2099-12-31'); break;
      default: premiumExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }

    await supabase
      .from('profiles')
      .update({
        plan: 'premium',
        premium_expires_at: premiumExpiry.toISOString(),
        rencontre_premium_expires_at: premiumExpiry.toISOString(),
      })
      .eq('id', userId);
  }

  revalidatePath('/admin/dating/profiles');
  return { success: true, userId, email, password };
}
