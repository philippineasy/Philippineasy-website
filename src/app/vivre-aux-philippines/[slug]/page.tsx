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
    .eq('main_category', 'vivre');

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

  const canonicalUrl = `https://philippineasy.com/vivre-aux-philippines/${slug}`;
  const description = category.description || `Articles et informations sur ${category.name} pour vivre aux Philippines.`;

  return {
    title: `${category.name} | Vivre aux Philippines | Philippin'Easy`,
    description,
    keywords: ['Philippines', 'vivre aux Philippines', category.name, 'expatriation', 's\'installer Philippines'],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${category.name} | Vivre aux Philippines`,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Vivre aux Philippines`,
      description,
      site: '@philippineasy',
    },
  };
}

export default async function VivreCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPage slug={slug} basePath="vivre-aux-philippines" pageTitle="Y Vivre" />;
}
