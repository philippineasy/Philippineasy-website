'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';

export async function handleAddProduct(formData: FormData) {
  const supabase = await createClient();

  // 1. Get user and vendor info
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Utilisateur non authentifié.' };
  }

  const vendorId = formData.get('vendorId') as string;
  if (!vendorId) {
    return { success: false, error: 'ID du vendeur manquant.' };
  }

  // 2. Get form data
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const categoryId = formData.get('categoryId') as string;
  const imageFile = formData.get('image') as File;

  if (!name || !price || !categoryId || !imageFile || imageFile.size === 0) {
    return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' };
  }

  // 3. Upload image to Supabase Storage
  const fileName = `${Date.now()}-${slugify(imageFile.name, { lower: true })}`;
  const filePath = `${vendorId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return { success: false, error: `Erreur lors de l'upload de l'image: ${uploadError.message}` };
  }

  // 4. Get public URL of the uploaded image
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  // 5. Insert product into the database
  const productSlug = slugify(name, { lower: true, strict: true });
  
  const { error: insertError } = await supabase.from('products').insert({
    vendor_id: parseInt(vendorId),
    category_id: parseInt(categoryId),
    name,
    slug: productSlug,
    description,
    price: parseFloat(price),
    image_urls: [publicUrl],
    status: 'published', // Or 'draft' by default
  });

  if (insertError) {
    console.error('Error inserting product:', insertError);
    // Optional: delete the uploaded image if the DB insert fails
    await supabase.storage.from('product-images').remove([filePath]);
    return { success: false, error: `Erreur lors de la création du produit: ${insertError.message}` };
  }

  // 6. Revalidate path and return success
  revalidatePath('/profil/boutique');
  return { success: true };
}
