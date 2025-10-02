import { createClient } from '@/utils/supabase/server';
import { MarketplaceClientPage } from './MarketplaceClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace Philippines : Achat & Vente de Produits | Philippin\'Easy',
  description: 'Marketplace française pour les Philippines : achetez et vendez des produits, services, souvenirs et articles pour votre voyage ou expatriation. Livraison internationale.',
  keywords: [
    'marketplace Philippines',
    'acheter Philippines',
    'vendre Philippines',
    'e-commerce Philippines',
    'produits philippins',
    'souvenirs Philippines',
    'boutique en ligne Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/marketplace-aux-philippines',
  },
  openGraph: {
    title: 'Marketplace Philippines : Achat & Vente',
    description: 'Marketplace française pour acheter et vendre des produits en lien avec les Philippines.',
    url: 'https://philippineasy.com/marketplace-aux-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketplace Philippines',
    description: 'Achat et vente de produits Philippines',
    site: '@philippineasy',
  },
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
