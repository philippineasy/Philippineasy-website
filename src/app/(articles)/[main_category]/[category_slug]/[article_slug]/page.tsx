import { cache } from 'react';
import { getArticleBySlug, getRelatedArticles } from '@/services/articleService';
import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/shared/JsonLd';
import { Article, EditorJSContent } from '@/types';
import { generateArticleMetaDescription } from '@/utils/seo/metaDescriptionGenerator';
import { getMainCategoryPath } from '@/lib/utils';
import ArticleContentRenderer from '@/components/shared/ArticleContentRenderer';
import TableOfContents from '@/components/shared/TableOfContents';
import RelatedArticles from '@/components/shared/RelatedArticles';
import ViewTracker from '@/components/shared/ViewTracker';
import { ArticleHero } from '@/components/articles/ArticleHero';

// Deduplicate fetch between generateMetadata and page render
const getCachedArticle = cache(async (slug: string) => {
  const supabase = await createClient();
  return getArticleBySlug(supabase, slug);
});

export async function generateStaticParams() {
  const supabase = createBuildClient();
  if (!supabase) return [];
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, category:categories(slug, main_category)')
    .eq('status', 'published');

  if (!articles) {
    return [];
  }

  return articles.map(article => {
    const categoryObject = Array.isArray(article.category) ? article.category[0] : article.category;
    if (!categoryObject) return null;

    return {
      main_category: getMainCategoryPath(categoryObject.main_category),
      category_slug: categoryObject.slug,
      article_slug: article.slug,
    };
  }).filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ main_category: string; category_slug: string; article_slug: string }>;
}): Promise<Metadata> {
  const { main_category, category_slug, article_slug } = await params;
  const { data: article } = await getCachedArticle(article_slug);

  if (!article) {
    return {
      title: 'Article non trouve',
      description: "Cet article n'existe pas ou a ete deplace.",
    };
  }

  const description = generateArticleMetaDescription(
    article.title,
    article.content,
    article.category?.name,
    { maxLength: 155, addEllipsis: true }
  );

  const canonicalUrl = `https://philippineasy.com/${main_category}/${category_slug}/${article_slug}`;

  return {
    title: `${article.title} | Philippin'Easy`,
    description,
    authors: [
      {
        name: article.author?.username || "Philippin'Easy",
        url: 'https://philippineasy.com',
      },
    ],
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
      title: article.title,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at || article.published_at,
      authors: [article.author?.username || "Philippin'Easy"],
      section: article.category?.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [article.image],
      creator: '@philippineasy',
      site: '@philippineasy',
    },
  };
}

export const revalidate = 3600;

function parseContent(content: Article['content']): EditorJSContent | null {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content) as EditorJSContent;
    } catch {
      return null;
    }
  }
  return content as EditorJSContent;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ main_category: string; category_slug: string; article_slug: string }>;
}) {
  const { main_category, category_slug, article_slug } = await params;
  const { data: article } = await getCachedArticle(article_slug);

  if (!article) {
    notFound();
  }

  const typedArticle = article as Article;
  const canonicalUrl = `https://philippineasy.com/${main_category}/${category_slug}/${article_slug}`;

  // Fetch related articles server-side
  const supabase = await createClient();
  const { data: relatedArticles } = await getRelatedArticles(supabase, typedArticle.category.id, typedArticle.id);

  const parsedContent = parseContent(typedArticle.content);

  const excerpt = generateArticleMetaDescription(
    typedArticle.title,
    typedArticle.content,
    typedArticle.category?.name,
    { maxLength: 220, addEllipsis: true }
  );

  return (
    <>
      <JsonLd article={typedArticle} basePath={main_category} />
      <ViewTracker articleId={typedArticle.id} />
      <main className="container mx-auto px-4 py-12 md:py-16 pt-32">
        <ArticleHero
          article={typedArticle}
          mainCategoryPath={main_category}
          categorySlug={category_slug}
          excerpt={excerpt}
          canonicalUrl={canonicalUrl}
        />

        <div className="lg:flex lg:space-x-8">
          <aside className="w-full lg:w-1/4 hidden md:block mb-8 lg:mb-0">
            <div className="sticky top-28 p-4 bg-muted rounded-lg shadow-md border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-3 border-b pb-2">Sommaire</h2>
              {parsedContent && <TableOfContents blocks={parsedContent.blocks || []} />}
            </div>
          </aside>

          <article className="w-full lg:flex-grow">
            <div className="prose prose-lg max-w-none article-content">
              <ArticleContentRenderer content={parsedContent || { blocks: [], time: 0, version: '' }} />
            </div>

            {typedArticle.tags && typedArticle.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Mots-cles :</h3>
                <div className="flex flex-wrap gap-2">
                  {typedArticle.tags.map(tag => <span key={tag} className="bg-muted/80 text-foreground px-3 py-1 rounded-full text-xs font-medium">{tag}</span>)}
                </div>
              </div>
            )}

            <RelatedArticles articles={relatedArticles || []} />
          </article>
        </div>
      </main>
    </>
  );
}
