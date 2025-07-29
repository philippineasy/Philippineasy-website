import { Article, EditorJSContent } from '@/types';

interface JsonLdProps {
  article: Article;
  basePath: string; // e.g., 'voyager-aux-philippines'
}

const JsonLd = ({ article, basePath }: JsonLdProps) => {
  const extractText = (content: string | EditorJSContent): string => {
    if (typeof content === 'string') {
      return content.substring(0, 160) + '...';
    }
    let text = '';
    for (const block of content?.blocks || []) {
      if (block.type === 'paragraph' && block.data?.text) {
        text += block.data.text.replace(/<[^>]+>/g, '') + ' ';
      }
    }
    return text.trim().substring(0, 160) + '...';
  };

  const description = extractText(article.content);

  const jsonLd = {
    '@context': 'https://schema.org',
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
        url: 'https://philippineasy.com/logo.webp', // Replace with your actual logo URL
      },
    },
    description: description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://philippineasy.com/${basePath}/${article.category?.slug}/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default JsonLd;
