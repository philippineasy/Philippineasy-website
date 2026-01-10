'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export async function handleUpdateVendorProfile(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Utilisateur non authentifié.' };
  }

  const vendorId = parseInt(formData.get('vendorId') as string, 10);
  if (!vendorId) {
    return { success: false, error: 'ID du vendeur manquant.' };
  }

  // Security check: ensure the user owns this vendor profile
  const { data: vendor } = await supabase.from('vendors').select('id, logo_url').eq('user_id', user.id).eq('id', vendorId).single();
  if (!vendor) {
    return { success: false, error: 'Action non autorisée.' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const logoFile = formData.get('logo') as File;

  const updates: { name?: string; description?: string; logo_url?: string } = {};

  if (name) updates.name = name;
  if (description) updates.description = description;

  if (logoFile && logoFile.size > 0) {
    const fileName = `${vendor.id}/logo-${Date.now()}-${slugify(logoFile.name, { lower: true })}`;
    
    const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, logoFile, {
        cacheControl: '3600',
        upsert: true, // Overwrite if a logo already exists
    });

    if (uploadError) {
      return { success: false, error: `Erreur d'upload du logo: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
    updates.logo_url = publicUrl;
  }

  if (Object.keys(updates).length === 0) {
    return { success: true, message: 'Aucune modification détectée.' };
  }

  const { error: updateError } = await supabase
    .from('vendors')
    .update(updates)
    .eq('id', vendorId);

  if (updateError) {
    return { success: false, error: `Erreur de mise à jour: ${updateError.message}` };
  }

  revalidatePath('/profil/boutique');
  return { success: true };
}
