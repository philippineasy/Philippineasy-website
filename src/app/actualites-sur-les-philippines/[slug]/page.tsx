import CategoryPage from '@/components/shared/CategoryPage';
import { getArticleCategoryBySlug } from '@/services/categoryService';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

// ✅ params est un Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient();
  const { data: category } = await getArticleCategoryBySlug(supabase, slug);

  if (!category) {
    return {
      title: 'Catégorie non trouvée',
    };
  }

  return {
    title: `${category.name} | Philippin'Easy`,
    description: category.description || `Articles et informations sur ${category.name}.`,
  };
}

// ✅ idem pour la page
export default async function ActualitesCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <CategoryPage
      slug={slug}
      basePath="actualites-sur-les-philippines"
      pageTitle="Actualités"
    />
  );
}