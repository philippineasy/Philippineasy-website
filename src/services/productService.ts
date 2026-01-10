import { createClient } from '@/utils/supabase/server';

export async function getProductsByCategorySlug(supabase: Awaited<ReturnType<typeof createClient>>, slug: string) {
  return supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      image_urls,
      vendors (name),
      product_categories (name)
    `)
    .eq('status', 'published')
    .eq('product_categories.slug', slug);
}

export async function getAllProducts(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase
    .from('products')
    .select('slug, updated_at')
    .eq('status', 'published');
}

export async function getRelatedProducts(supabase: Awaited<ReturnType<typeof createClient>>, categoryId: number, currentProductId: number) {
  return supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      image_urls,
      category_id,
      vendors (name)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .neq('id', currentProductId)
    .limit(4);
}
