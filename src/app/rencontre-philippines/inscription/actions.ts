'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendDatingWelcome } from '@/emails/senders/dating';

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 Mo
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

/** Âge en années à une date donnée. */
function ageFromBirthDate(birth: Date, ref: Date): number {
  let age = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) age--;
  return age;
}

export async function createDatingProfile(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Vous devez être connecté pour créer un profil.' };
  }

  const photo = formData.get('photo') as File;
  if (!photo || photo.size === 0) {
    return { error: 'Une photo de profil est requise.' };
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return { error: 'La photo est trop lourde (8 Mo maximum).' };
  }
  if (photo.type && !ALLOWED_PHOTO_TYPES.includes(photo.type)) {
    return { error: 'Format de photo non supporté (JPEG, PNG, WebP ou HEIC).' };
  }

  // ------------------------------------------------------------------
  // Revalidation serveur (le client valide déjà, mais une requête forgée
  // pourrait créer un profil incomplet — audit 07/09).
  // ------------------------------------------------------------------
  const gender = (formData.get('gender') as string | null)?.trim();
  const orientation = (formData.get('orientation') as string | null)?.trim();
  const city = (formData.get('city') as string | null)?.trim();
  const description = (formData.get('description') as string | null)?.trim() ?? '';
  const yearN = Number(formData.get('year'));
  const monthN = Number(formData.get('month'));
  const dayN = Number(formData.get('day'));

  if (!gender || !orientation || !city) {
    return { error: 'Genre, orientation et ville sont obligatoires.' };
  }
  if (description.length < 100) {
    return { error: 'La description doit faire au moins 100 caractères.' };
  }

  // Date de naissance valide (rejette 31 février qui déborderait) + âge ≥ 18.
  const birth = new Date(Date.UTC(yearN, monthN - 1, dayN));
  if (
    Number.isNaN(birth.getTime()) ||
    birth.getUTCFullYear() !== yearN ||
    birth.getUTCMonth() !== monthN - 1 ||
    birth.getUTCDate() !== dayN
  ) {
    return { error: 'Date de naissance invalide.' };
  }
  if (ageFromBirthDate(birth, new Date()) < 18) {
    return { error: 'Vous devez avoir au moins 18 ans pour vous inscrire.' };
  }

  // 1. Upload photo to Storage
  const photoPath = `${user.id}/${Date.now()}_${photo.name}`;
  const { error: uploadError } = await supabase.storage
    .from('dating-photos')
    .upload(photoPath, photo);

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    return { error: "L'envoi de la photo a échoué. Réessayez." };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('dating-photos')
    .getPublicUrl(photoPath);

  // 2. Prepare data for the transactional function
  const birthDate = birth.toISOString().split('T')[0]; // YYYY-MM-DD

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
    p_gender: gender,
    p_orientation: orientation,
    p_birth_date: birthDate,
    p_city: city,
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
    return { error: 'La création du profil a échoué. Réessayez.' };
  }

  // Email de bienvenue (non bloquant — un échec d'email ne doit pas casser
  // l'inscription). La page en-attente promet cet email.
  if (user.email) {
    const username = user.user_metadata?.username || user.email.split('@')[0];
    sendDatingWelcome(user.id, user.email, username).catch((e) =>
      console.error('sendDatingWelcome:', e instanceof Error ? e.message : e)
    );
  }

  revalidatePath('/rencontre-philippines');
  redirect('/rencontre-philippines/en-attente');
}
