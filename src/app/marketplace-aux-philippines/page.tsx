import { createClient } from '@/utils/supabase/server';
import { MarketplaceClientPage } from './MarketplaceClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace | Philippin\'Easy',
  description: 'Achetez et vendez des produits et services en lien avec les Philippines.',
};

async function getProducts(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      image_urls,
      vendors (
        name
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data.map(p => ({ ...p, vendors: Array.isArray(p.vendors) ? p.vendors[0] : p.vendors }));
}

async function getCategories(supabase: ReturnType<typeof createClient>) {
    const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, slug');
    
    if (error) {
        console.error('Error fetching product categories:', error);
        return [];
    }
    return data;
}

export default async function MarketplacePage() {
  const supabase = createClient();
  const products = await getProducts(supabase);
  const categories = await getCategories(supabase);

  return <MarketplaceClientPage initialProducts={products} categories={categories} />;
}
