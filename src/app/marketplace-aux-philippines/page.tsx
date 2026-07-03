import { createClient } from '@/utils/supabase/server';
import { MarketplaceClientPage } from './MarketplaceClientPage';
import { PageHero, CTABand } from '@/components/sections';
import type { StatItem } from '@/components/sections';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace Philippines : Achat & Vente de Produits',
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
    images: [
      {
        url: 'https://philippineasy.com/images/budget/marche-fruits-locaux.webp',
        width: 1536,
        height: 1024,
        alt: 'Étal coloré d’un marché local aux Philippines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketplace Philippines',
    description: 'Achat et vente de produits Philippines',
    site: '@philippineasy',
    images: ['https://philippineasy.com/images/budget/marche-fruits-locaux.webp'],
  },
};

async function getProducts(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      image_urls,
      category_id,
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

async function getCategories(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, slug');
    
    if (error) {
        console.error('Error fetching product categories:', error);
        return [];
    }
    return data;
}

const BoxIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 8v13H3V8" />
    <rect x="1" y="3" width="22" height="5" rx="1" />
    <path d="M10 12h4" />
  </svg>
);

const StoreIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
    <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
  </svg>
);

const TagsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 3H4a1 1 0 0 0-1 1v5l9 9 6-6-9-9z" />
    <circle cx="6.5" cy="6.5" r="1.2" />
    <path d="M15 6l6 6-6 6" />
  </svg>
);

export default async function MarketplacePage() {
  const supabase = await createClient();
  const products = await getProducts(supabase);
  const categories = await getCategories(supabase);

  const productCount = products.length;
  const vendorCount = new Set(
    products.map((p) => p.vendors?.name).filter(Boolean)
  ).size;

  const nf = (n: number) => n.toLocaleString('fr-FR');
  const heroStats: StatItem[] = [
    { value: nf(productCount), label: 'produits en ligne', icon: <BoxIcon /> },
    { value: nf(categories.length), label: 'catégories', icon: <TagsIcon /> },
    { value: nf(vendorCount), label: 'vendeurs actifs', icon: <StoreIcon /> },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Marketplace · Produits locaux"
        title="La boutique des"
        titleAccent="Philippines"
        subtitle="Artisanat, souvenirs et produits du quotidien, expédiés depuis l'archipel ou nos vendeurs partenaires. Paiement sécurisé, sélection vérifiée par notre équipe."
        imageUrl="/images/budget/marche-fruits-locaux.webp"
        imageAlt="Étal coloré d'un marché local aux Philippines"
        stats={productCount > 0 ? heroStats : undefined}
      />

      <MarketplaceClientPage initialProducts={products} categories={categories} />

      <CTABand
        title="Vous fabriquez ou vendez des produits"
        titleAccent="philippins ?"
        subtitle="Rejoignez notre marketplace francophone et vendez à une communauté de passionnés des Philippines. Inscription gratuite, commission équitable."
        primary={{ label: 'Devenir vendeur', href: '/marketplace-aux-philippines/devenir-vendeur' }}
        secondary={{ label: 'Comment ça marche', href: '/marketplace-aux-philippines/devenir-vendeur' }}
      />
    </div>
  );
}
