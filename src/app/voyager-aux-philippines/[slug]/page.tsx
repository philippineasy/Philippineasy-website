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
    .eq('main_category', 'voyager');

  if (!categories) {
    return [];
  }

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

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

  const canonicalUrl = `https://philippineasy.com/voyager-aux-philippines/${slug}`;
  const description = category.description || `Découvrez nos articles et conseils sur ${category.name} pour voyager aux Philippines.`;

  return {
    title: `${category.name} | Voyager aux Philippines | Philippin'Easy`,
    description,
    keywords: ['Philippines', 'voyage Philippines', category.name, 'guide voyage', 'tourisme Philippines'],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${category.name} | Voyager aux Philippines`,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Voyager aux Philippines`,
      description,
      site: '@philippineasy',
    },
  };
}

export default async function VoyagerCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPage slug={slug} basePath="voyager-aux-philippines" pageTitle="Voyager" />;
}
