import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ArticleList from '@/components/shared/ArticleList';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

interface CategoryPageProps {
  slug: string;
  basePath: 'vivre-aux-philippines' | 'voyager-aux-philippines' | 'meilleurs-plans-aux-philippines' | 'actualites-sur-les-philippines';
  pageTitle: string;
}

export const revalidate = 3600;

const CategoryPage = async ({ slug, basePath, pageTitle }: CategoryPageProps) => {
  const supabase = createClient();
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${typeof window !== 'undefined' ? window.location.origin : ''}${item.href || ''}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {category.heroImage && (
        <section className="relative h-64 md:h-80">
          <Image src={category.heroImage} alt={category.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-card-foreground">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.name}</h1>
              <p className="text-lg md:text-xl">{category.description}</p>
            </div>
          </div>
        </section>
      )}
      <main className="container mx-auto px-4 py-16">
        <Breadcrumb items={breadcrumbItems} />

        {!category.heroImage && (
           <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
            )}
          </div>
        )}

        <section>
          <h2 className="section-title">Les <span className="highlight">Incontournables</span></h2>
          <ArticleList articles={articles} basePath={basePath} />
        </section>
      </main>
    </>
  );
}

export default CategoryPage;
