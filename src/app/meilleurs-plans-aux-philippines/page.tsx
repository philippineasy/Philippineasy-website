import { faHotel, faPlane, faSwimmer, faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/utils/supabase/server';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { getCategoriesByMainCategory } from '@/services/categoryService';
import { MeilleursPlansClientPage } from './MeilleursPlansClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meilleurs Plans Philippines : Hébergements, Activités & Bons Plans | Philippin\'Easy',
  description: 'Les meilleurs bons plans pour les Philippines : hébergements pas chers, activités incontournables, excursions, transports et services pour expatriés.',
  keywords: [
    'bons plans Philippines',
    'hébergement Philippines',
    'activités Philippines',
    'excursions Philippines',
    'transport Philippines',
    'hôtels Philippines pas cher',
    'meilleures plages Philippines',
    'services expatriés Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/meilleurs-plans-aux-philippines',
  },
  openGraph: {
    title: 'Meilleurs Plans Philippines : Bons Plans & Activités',
    description: 'Découvrez les meilleurs bons plans pour les Philippines : hébergements, activités, excursions et services.',
    url: 'https://philippineasy.com/meilleurs-plans-aux-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meilleurs Plans Philippines',
    description: 'Les meilleurs bons plans pour les Philippines',
    site: '@philippineasy',
  },
};

export const revalidate = 3600; // Revalidate every hour

const MeilleursPlansPage = async () => {
  const supabase = createClient();
  const { data: categories, error } = await getCategoriesByMainCategory(supabase, 'meilleurs-plans-aux-philippines');

  if (error) {
    return <p className="text-center text-destructive">Impossible de charger les catégories.</p>;
  }

  const icons: { [key: string]: IconDefinition } = {
    hebergements: faHotel,
    transports: faPlane,
    'activites-excursions': faSwimmer,
    'services-expatries': faConciergeBell,
  };

  return (
    <MeilleursPlansClientPage initialCategories={categories || []} icons={icons} />
  );
};

export default MeilleursPlansPage;
