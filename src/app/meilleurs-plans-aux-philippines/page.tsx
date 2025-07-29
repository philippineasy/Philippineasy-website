import { faHotel, faPlane, faSwimmer, faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/utils/supabase/server';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { getCategoriesByMainCategory } from '@/services/categoryService';
import { MeilleursPlansClientPage } from './MeilleursPlansClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meilleurs Plans aux Philippines | Philippin\'Easy',
  description: 'Découvrez les meilleurs plans pour votre voyage ou votre vie aux Philippines.',
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
