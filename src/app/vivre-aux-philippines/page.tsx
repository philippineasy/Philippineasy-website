import { createClient } from '@/utils/supabase/server';
import { getCategoriesByMainCategory } from '@/services/categoryService';
import { VivreClientPage } from './VivreClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vivre aux Philippines | Philippin\'Easy',
  description: 'Conseils et informations pour s\'installer et vivre aux Philippines.',
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
