import { Article, EditorJSContent } from '@/types';

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

  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.category?.name || 'Catégorie',
        item: `${siteUrl}/${basePath}/${article.category?.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${siteUrl}/${basePath}/${article.category?.slug}/${article.slug}`,
      },
    ],
  };

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
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: "Philippin'Easy",
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo-philippineasy.png`,
      },
    },
    description: description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${basePath}/${article.category?.slug}/${article.slug}`,
    },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      newsArticle,
      breadcrumbList
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default JsonLd;
