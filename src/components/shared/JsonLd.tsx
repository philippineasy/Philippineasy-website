import { Article, EditorJSContent } from '@/types';
import BreadcrumbJsonLd from './BreadcrumbJsonLd';

interface JsonLdProps {
  article: Article;
  basePath: string; // e.g., 'voyager-aux-philippines'
}

/** Extract YouTube video ID from various URL formats */
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/** Extract all YouTube embeds from EditorJS content */
const extractVideos = (content: string | EditorJSContent) => {
  if (typeof content === 'string') return [];
  const videos: { id: string; embedUrl: string; caption?: string }[] = [];
  for (const block of content?.blocks || []) {
    if (block.type === 'embed' && block.data?.embed) {
      const videoId = extractYouTubeId(block.data.embed);
      if (videoId) {
        videos.push({
          id: videoId,
          embedUrl: block.data.embed,
          caption: block.data.caption || undefined,
        });
      }
    }
  }
  return videos;
};

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
  const articleUrl = `${siteUrl}/${basePath}/${article.category?.slug}/${article.slug}`;

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
  const readingTime = Math.ceil(wordCount / 200);

  const videos = extractVideos(article.content);

  // CRITICAL : NewsArticle est reserve a l'info de presse (perissable, < 30j de
  // pertinence). Pour les guides evergreen (Sugba Lagoon, Buddy System, etc.)
  // qui restent valides des annees, Google attend BlogPosting. Mismatch =
  // contenu deprio dans les rich results / Google News indexing.
  const isNewsArticle = basePath === 'actualites-sur-les-philippines';
  const articleType = isNewsArticle ? 'NewsArticle' : 'BlogPosting';

  // Auteur enrichi (signal E-E-A-T) : url pointe vers son profil public si
  // disponible, sinon le siteUrl. Le Person.@id permet a Google de relier
  // tous les articles du meme auteur.
  const authorName = article.author?.username || "Philippin'Easy";
  const authorSlug = (article.author?.username || 'philippineasy').toLowerCase().replace(/[^a-z0-9]/g, '-');

  const articleSchema: Record<string, unknown> = {
    '@type': articleType,
    headline: article.title,
    image: article.image ? [article.image] : undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person-${authorSlug}`,
        name: authorName,
        url: siteUrl,
        jobTitle: 'Expat aux Philippines & Fondateur Philippin\'Easy',
        knowsAbout: ['Philippines', 'Expatriation', 'Voyage', 'Vie aux Philippines'],
      },
    ],
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
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
    wordCount,
    timeRequired: `PT${readingTime}M`,
    inLanguage: 'fr-FR',
    isAccessibleForFree: true,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category?.name,
    keywords: ['Philippines', article.category?.name, article.title].filter(Boolean).join(', '),
  };

  if (videos.length > 0) {
    articleSchema.video = videos.map((v) => ({
      '@type': 'VideoObject',
      name: v.caption || article.title,
      description: v.caption || description.substring(0, 200),
      thumbnailUrl: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
      uploadDate: article.published_at,
      embedUrl: v.embedUrl,
      contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    }));
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    ...articleSchema,
  };

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {videos.map((v) => (
        <script
          key={v.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              name: v.caption || article.title,
              description: v.caption || description.substring(0, 200),
              thumbnailUrl: [
                `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`,
                `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
              ],
              uploadDate: article.published_at,
              embedUrl: v.embedUrl,
              contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
              publisher: {
                '@type': 'Organization',
                name: "Philippin'Easy",
                logo: {
                  '@type': 'ImageObject',
                  url: `${siteUrl}/logo-philippineasy.png`,
                },
              },
            }),
          }}
        />
      ))}
    </>
  );
};

export default JsonLd;
