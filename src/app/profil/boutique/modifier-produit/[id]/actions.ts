'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export async function handleUpdateProduct(formData: FormData) {
  const supabase = await createClient();
  const productId = parseInt(formData.get('productId') as string, 10);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Utilisateur non authentifié.' };
  }

  // Fetch the product to check ownership and get old image URL
  const { data: existingProduct } = await supabase.from('products').select('vendor_id, image_urls').eq('id', productId).single();
  if (!existingProduct) {
    return { success: false, error: 'Produit non trouvé.' };
  }

  const { data: vendor } = await supabase.from('vendors').select('id').eq('user_id', user.id).eq('id', existingProduct.vendor_id).single();
  if (!vendor) {
    return { success: false, error: 'Action non autorisée.' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const categoryId = formData.get('categoryId') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl = existingProduct.image_urls?.[0];

  // If a new image is uploaded, handle it
  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${slugify(imageFile.name, { lower: true })}`;
    const filePath = `${vendor.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
    if (uploadError) {
      return { success: false, error: `Erreur d'upload: ${uploadError.message}` };
    }

    // Get new public URL
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
    imageUrl = publicUrl;

    // Delete old image if it exists
    if (existingProduct.image_urls?.[0]) {
      const oldFilePath = existingProduct.image_urls[0].split('/').slice(-2).join('/');
      await supabase.storage.from('product-images').remove([oldFilePath]);
    }
  }

  const productSlug = slugify(name, { lower: true, strict: true });

  const { error: updateError } = await supabase
    .from('products')
    .update({
      name,
      slug: productSlug,
      description,
      price: parseFloat(price),
      category_id: parseInt(categoryId),
      image_urls: imageUrl ? [imageUrl] : [],
    })
    .eq('id', productId);

  if (updateError) {
    return { success: false, error: `Erreur de mise à jour: ${updateError.message}` };
  }

  revalidatePath('/profil/boutique');
  revalidatePath(`/marketplace-aux-philippines/produit/${productSlug}`);
  return { success: true };
}

export async function handleDeleteProduct(productId: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Utilisateur non authentifié.' };
  }

  // 1. Fetch product to check ownership and get image URLs
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('vendor_id, image_urls')
    .eq('id', productId)
    .single();

  if (fetchError || !product) {
    return { success: false, error: 'Produit non trouvé.' };
  }

  const { data: vendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', product.vendor_id)
    .single();

  if (!vendor) {
    return { success: false, error: 'Action non autorisée.' };
  }

  // 2. Delete images from storage
  if (product.image_urls && product.image_urls.length > 0) {
    const filePaths = product.image_urls.map((url: string) => {
      const parts = url.split('/');
      return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
    });
    await supabase.storage.from('product-images').remove(filePaths);
  }

  // 3. Delete product from database
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (deleteError) {
    return { success: false, error: `Erreur de suppression: ${deleteError.message}` };
  }

  revalidatePath('/profil/boutique');
  return { success: true, error: null };
}
