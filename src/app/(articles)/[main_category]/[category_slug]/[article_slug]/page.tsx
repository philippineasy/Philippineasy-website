import ArticlePageClient from '@/components/shared/ArticlePageClient';
import { getArticleBySlug } from '@/services/articleService';
import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/shared/JsonLd';
import { Article } from '@/types';

const getMainCategoryPath = (mainCategorySlug: string | null) => {
    if (!mainCategorySlug) return 'actualites-sur-les-philippines'; // Fallback
    switch (mainCategorySlug) {
      case 'actualites':
        return 'actualites-sur-les-philippines';
      case 'meilleurs-plans':
        return 'meilleurs-plans-aux-philippines';
      case 'vivre':
        return 'vivre-aux-philippines';
      case 'voyager':
        return 'voyager-aux-philippines';
      default:
        return 'actualites-sur-les-philippines'; // Fallback for any other case
    }
};

export async function generateStaticParams() {
  const supabase = createBuildClient();
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
    }
  }).filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ main_category: string; category_slug: string; article_slug: string }>;
}): Promise<Metadata> {
  const { article_slug } = await params;
  const supabase = createClient();
  const { data: article } = await getArticleBySlug(supabase, article_slug);

  if (!article) {
    return {
      title: 'Article non trouvé',
      description: "Cet article n'existe pas ou a été déplacé.",
    };
  }

  const extractText = (content: any): string => {
    let text = '';
    if (typeof content === 'string') {
      return content.substring(0, 160) + '...';
    }
    if (content?.blocks) {
      for (const block of content.blocks) {
        if (block.type === 'paragraph' && block.data?.text) {
          text += block.data.text.replace(/<[^>]+>/g, '') + ' ';
        }
      }
    }
    return text.trim().substring(0, 160) + '...';
  };

  const description = extractText(article.content);

  return {
    title: `${article.title} | Philippin'Easy`,
    description,
    openGraph: {
      title: article.title,
      description,
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
      authors: [article.author?.username || "Philippin'Easy"],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [article.image],
    },
  };
}

export const revalidate = 3600;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ main_category: string; category_slug: string; article_slug: string }>;
}) {
  const { main_category, article_slug } = await params;
  const supabase = createClient();
  const { data: article } = await getArticleBySlug(supabase, article_slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <JsonLd article={article as Article} basePath={main_category} />
      <ArticlePageClient article={article as Article} basePath={main_category} />
    </>
  );
}
