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
import ViewTracker from '@/components/shared/ViewTracker';
import { ArticleHero } from '@/components/articles/ArticleHero';
import { ArticleTOC } from '@/components/articles/ArticleTOC';
import { ArticleAside } from '@/components/articles/ArticleAside';
import { EditorialRenderer } from '@/components/articles/EditorialRenderer';
import { ArticleFooter } from '@/components/articles/ArticleFooter';

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
    stripTitleAccent(article.title),
    article.content,
    article.category?.name,
    { maxLength: 155, addEllipsis: true }
  );

  const canonicalUrl = `https://philippineasy.com/${main_category}/${category_slug}/${article_slug}`;

  return {
    title: `${stripTitleAccent(article.title)} | Philippin'Easy`,
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
      title: stripTitleAccent(article.title),
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: stripTitleAccent(article.title),
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
      title: stripTitleAccent(article.title),
      description,
      images: [article.image],
      creator: '@philippineasy',
      site: '@philippineasy',
    },
  };
}

export const revalidate = 3600;

// Strip the **accent** convention from titles when used as plain text
// (meta tags, OG, Twitter, alt). The H1 itself preserves the markup
// for renderTitleWithAccent in ArticleHero.
function stripTitleAccent(title: string): string {
  return title.replace(/\*\*([^*]+)\*\*/g, '$1');
}

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
      <a
        href="#article-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-ink focus:rounded-lg focus:shadow-lg focus:font-semibold"
      >
        Aller au contenu de l'article
      </a>
      <main className="container mx-auto px-4 py-12 md:py-16 pt-32" id="article-content">
        <ArticleHero
          article={typedArticle}
          mainCategoryPath={main_category}
          categorySlug={category_slug}
          excerpt={excerpt}
          canonicalUrl={canonicalUrl}
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-8 lg:gap-12">
          {parsedContent && <ArticleTOC blocks={parsedContent.blocks || []} />}

          <article className="min-w-0">
            <EditorialRenderer content={parsedContent || { blocks: [], time: 0, version: '' }} />

            <ArticleFooter
              article={typedArticle}
              relatedArticles={relatedArticles || []}
              canonicalUrl={canonicalUrl}
            />
          </article>

          <ArticleAside relatedArticles={relatedArticles || []} />
        </div>
      </main>
    </>
  );
}
