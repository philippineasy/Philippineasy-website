'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function trackProductView(productId: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('product_views').insert({
    product_id: productId,
    user_id: user?.id, // Can be null for anonymous users
  });

  if (error) {
    console.error('Error tracking product view:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function handleAddReview(productId: number, rating: number, comment: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Vous devez être connecté pour laisser un avis.' };
  }

  // Check if the user has purchased the product
  const { data: purchase, error: purchaseError } = await supabase
    .from('orders')
    .select('id, order_items!inner(product_id)')
    .eq('user_id', user.id)
    .eq('status', 'succeeded')
    .eq('order_items.product_id', productId)
    .limit(1)
    .single();

  if (purchaseError || !purchase) {
     return { success: false, error: "Vous devez avoir acheté ce produit pour laisser un avis." };
  }

  const { data, error } = await supabase
    .from('product_reviews')
    .insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    })
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `);

  if (error) {
    console.error('Error adding review:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/marketplace-aux-philippines/produit/${productId}`);
  return { success: true, data };
}
