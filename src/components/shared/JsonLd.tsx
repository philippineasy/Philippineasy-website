import { Article, EditorJSContent } from '@/types';
import BreadcrumbJsonLd from './BreadcrumbJsonLd';

interface JsonLdProps {
  article: Article;
  basePath: string; // e.g., 'voyager-aux-philippines'
}

const JsonLd = ({ article, basePath }: JsonLdProps) => {
  const extractText = (content: string | EditorJSContent): string => {
    if (typeof content === 'string') {
      return content;
    }
    let text = '';
    for (const block of content?.blocks || []) {
      if (block.type === 'paragraph' && block.data?.text) {
        text += block.data.text.replace(/<[^>]+>/g, '') + ' ';
      }
    }
    return text.trim();
  };

  const description = extractText(article.content);
  const siteUrl = 'https://philippineasy.com';

  // Breadcrumb items pour le JSON-LD
  const breadcrumbItems = [
    {
      name: 'Accueil',
      item: '/',
    },
    {
      name: article.category?.name || 'Catégorie',
      item: `/${basePath}/${article.category?.slug}`,
    },
    {
      name: article.title,
      item: `/${basePath}/${article.category?.slug}/${article.slug}`,
    },
  ];

  const wordCount = description.split(' ').length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  const newsArticle = {
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.image],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: [
      {
        '@type': 'Person',
        name: article.author?.username || "Philippin'Easy",
        url: siteUrl,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: "Philippin'Easy",
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo-philippineasy.png`,
        width: 250,
        height: 60,
      },
      url: siteUrl,
    },
    description: description.substring(0, 200),
    articleBody: description,
    wordCount: wordCount,
    timeRequired: `PT${readingTime}M`,
    inLanguage: 'fr-FR',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${basePath}/${article.category?.slug}/${article.slug}`,
    },
    articleSection: article.category?.name,
    keywords: ['Philippines', article.category?.name, article.title].filter(Boolean).join(', '),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    ...newsArticle,
  };

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default JsonLd;
