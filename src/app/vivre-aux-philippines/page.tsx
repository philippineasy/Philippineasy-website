import { createClient } from '@/utils/supabase/server';
import { getCategoriesByMainCategory } from '@/services/categoryService';
import { VivreClientPage } from './VivreClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vivre aux Philippines : S\'installer, Travailler & Expatriation | Philippin\'Easy',
  description: 'Tout savoir pour vivre et s\'installer aux Philippines : visas, travail, immobilier, coût de la vie, expatriation, retraite. Guide complet pour expatriés.',
  keywords: [
    'vivre aux Philippines',
    's\'installer aux Philippines',
    'expatriation Philippines',
    'retraite Philippines',
    'travailler aux Philippines',
    'visa Philippines',
    'coût de la vie Philippines',
    'immobilier Philippines',
    'investir Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines',
  },
  openGraph: {
    title: 'Vivre aux Philippines : Guide Expatriation & Installation',
    description: 'Tout savoir pour vivre et s\'installer aux Philippines : visas, travail, immobilier, coût de la vie.',
    url: 'https://philippineasy.com/vivre-aux-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://philippineasy.com/imagesHero/nouveau-depart-aux-philippines.webp',
        width: 1200,
        height: 630,
        alt: 'Vivre aux Philippines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vivre aux Philippines : Guide Expatriation',
    description: 'Tout pour s\'installer et vivre aux Philippines',
    images: ['https://philippineasy.com/imagesHero/nouveau-depart-aux-philippines.webp'],
    site: '@philippineasy',
  },
};

export const revalidate = 3600; // Revalidate every hour

const VivrePage = async () => {
  const supabase = createClient();
  const { data: categories, error } = await getCategoriesByMainCategory(supabase, 'vivre-aux-philippines');

  if (error) {
    return <p className="text-center text-destructive">Impossible de charger les catégories.</p>;
  }

  return (
    <VivreClientPage initialCategories={categories || []} />
  );
};

export default VivrePage;
