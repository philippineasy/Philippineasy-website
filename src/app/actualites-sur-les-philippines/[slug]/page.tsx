import CategoryPage from '@/components/shared/CategoryPage';
import { getArticleCategoryBySlug } from '@/services/categoryService';
import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const supabase = createBuildClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .eq('main_category', 'actualites');

  if (!categories) {
    return [];
  }

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// ✅ params est un Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await getArticleCategoryBySlug(supabase, slug);

  if (!category) {
    return {
      title: 'Catégorie non trouvée',
    };
  }

  return {
    title: `${category.name} | Philippin'Easy`,
    description: category.description || `Articles et informations sur ${category.name}.`,
    alternates: {
      canonical: `/actualites-sur-les-philippines/${slug}`,
    },
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
