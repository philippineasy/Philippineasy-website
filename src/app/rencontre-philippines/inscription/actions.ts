'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDatingProfile(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const photo = formData.get('photo') as File;
  if (!photo || photo.size === 0) {
    return { error: 'Profile picture is required' };
  }

  // 1. Upload photo to Storage
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

  // 2. Prepare data for the transactional function
  const birthDate = new Date(
    Number(formData.get('year')),
    Number(formData.get('month')) - 1,
    Number(formData.get('day'))
  ).toISOString().split('T')[0]; // Format as YYYY-MM-DD for 'date' type

  const submittedInterests = formData.getAll('interests');
  let interests: number[] = [];
  if (submittedInterests && submittedInterests.length > 0) {
    interests = submittedInterests
      .map(i => String(i)) // Ensure it's a string
      .filter(i => i.trim() !== '') // Ensure it's not an empty string
      .map(i => parseInt(i, 10)) // Parse as integer
      .filter(n => !isNaN(n)); // Filter out any that failed to parse
  }
  
  const answers = [
    { question_key: formData.get('answers.0.question_key'), answer: formData.get('answers.0.answer') },
    { question_key: formData.get('answers.1.question_key'), answer: formData.get('answers.1.answer') },
    { question_key: formData.get('answers.2.question_key'), answer: formData.get('answers.2.answer') },
  ]
  .map(a => ({ question_key: a.question_key || null, answer: a.answer || null }))
  .filter(a => a.question_key && a.answer);

  const questionKeys = answers.map(a => a.question_key as string);
  const answerValues = answers.map(a => a.answer as string);

  const profilePayload = {
    p_user_id: user.id,
    p_gender: formData.get('gender') as string,
    p_orientation: formData.get('orientation') as string,
    p_birth_date: birthDate,
    p_city: formData.get('city') as string,
    p_height: Number(formData.get('height')),
    p_religion: formData.get('religion') as string,
    p_education: formData.get('education') as string,
    p_occupation: formData.get('occupation') as string,
    p_dating_intent: formData.get('dating_intent') as string,
    p_description: formData.get('description') as string,
    p_photo_url: publicUrl,
    p_interests: interests,
    p_question_keys: questionKeys,
    p_answer_values: answerValues,
  };

  // 3. Call the single transactional function
  const { error: rpcError } = await supabase.rpc('create_full_dating_profile', profilePayload);

  if (rpcError) {
    console.error('Error creating full profile via RPC:', rpcError);
    // Attempt to delete the orphaned photo from storage
    await supabase.storage.from('dating-photos').remove([photoPath]);
    return { error: 'Failed to create profile. The operation was rolled back.' };
  }

  revalidatePath('/rencontre-philippines');
  redirect('/rencontre-philippines/en-attente');
}
