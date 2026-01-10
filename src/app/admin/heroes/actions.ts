'use server';

import { createClient } from '@/utils/supabase/server';
import { uploadPageHero } from '@/services/uploadService';
import { revalidatePath } from 'next/cache';

export async function updateHeroImage(pageSlug: string, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Vous devez être connecté pour effectuer cette action.' };
  }

  const file = formData.get('heroImage') as File;

  if (!file) {
    return { error: 'Aucun fichier sélectionné.' };
  }

  const newImageUrl = await uploadPageHero(supabase, file);

  if (!newImageUrl) {
    return { error: "Erreur lors du téléversement de l'image." };
  }

  const { error } = await supabase
    .from('pages')
    .update({ hero_image_url: newImageUrl })
    .eq('slug', pageSlug);

  if (error) {
    return { error: "Erreur lors de la mise à jour de l'image." };
  }

  revalidatePath(`/vivre-aux-philippines/${pageSlug}`);
  revalidatePath(`/voyager-aux-philippines/${pageSlug}`);
  
  return { success: true };
}
