import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import { notFound } from 'next/navigation';
import ArticleList from '@/components/shared/ArticleList';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { PageHero } from '@/components/sections';

interface CategoryPageProps {
  slug: string;
  basePath: 'vivre-aux-philippines' | 'voyager-aux-philippines' | 'meilleurs-plans-aux-philippines' | 'actualites-sur-les-philippines';
  pageTitle: string;
}

export const revalidate = 3600;

// Image de secours par section quand la catégorie n'a pas de heroImage en DB.
const HERO_FALLBACKS: Record<CategoryPageProps['basePath'], string> = {
  'vivre-aux-philippines': '/imagesHero/nouveau-depart-aux-philippines.webp',
  'voyager-aux-philippines': '/imagesHero/comment-voyager-aux-philippines.webp',
  'meilleurs-plans-aux-philippines': '/imagesHero/maitriser-son-budget-aux-philippines.webp',
  'actualites-sur-les-philippines': '/imagesHero/antennes-reseaux-aux-philippines.webp',
};

const CategoryPage = async ({ slug, basePath, pageTitle }: CategoryPageProps) => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, slug);

  if (error || !articles || articles.length === 0) {
    notFound();
  }

  // Ensure category exists before trying to use it
  const category = articles[0]?.category;
  if (!category) {
    // This can happen if an article exists but its category was deleted.
    console.error(`Category not found for articles under slug: ${slug}`);
    notFound();
  }

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: `/${basePath}`, label: pageTitle },
    { label: category.name },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: pageTitle, item: `/${basePath}` },
    { name: category.name, item: `/${basePath}/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHero
        eyebrow={pageTitle}
        title={category.name}
        subtitle={category.description || undefined}
        imageUrl={category.heroImage || HERO_FALLBACKS[basePath]}
        imageAlt={category.name}
      />
      <main className="container mx-auto px-4 py-12 md:py-16">
        <Breadcrumb items={breadcrumbItems} />

        <section className="mt-10">
          <h2 className="mb-8 text-3xl font-bold tracking-[-0.01em] text-foreground">
            Nos articles <span className="text-accent-strong">{category.name}</span>
          </h2>
          <ArticleList articles={articles} basePath={basePath} />
        </section>
      </main>
    </>
  );
};

export default CategoryPage;
