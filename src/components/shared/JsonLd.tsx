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

/**
 * Detecte si l'article est un tutoriel "Comment faire..." et extrait les
 * etapes pour generer un HowTo schema. Trigger :
 * - Au moins 1 H2 commencant par "Comment ", "Etapes ", "Tutoriel "
 * - OU une `list` ordered (style: "ordered") avec >= 3 items
 *
 * Retourne null si pas un tuto. Sinon retourne {name, totalTime, steps[]}
 * pour HowTo schema. Eligible Google rich result "How-to" (carrousel
 * d'etapes dans SERP, gros gain CTR).
 */
const extractHowToSteps = (
  content: string | EditorJSContent,
  fallbackName: string,
): { name: string; steps: { name: string; text: string }[] } | null => {
  if (typeof content === 'string') return null;
  const blocks = content?.blocks || [];

  // Trouve une H2 "Comment ..." pour devenir le nom du HowTo
  let howtoName: string | null = null;
  let howtoStartIdx = -1;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'header' && b.data?.level === 2 && typeof b.data?.text === 'string') {
      const text = b.data.text.replace(/<[^>]+>/g, '').trim();
      if (/^(comment|etapes|tutoriel|how to)\s/i.test(text)) {
        howtoName = text;
        howtoStartIdx = i;
        break;
      }
    }
  }

  if (howtoName === null) return null;

  // Cherche la liste ordered qui suit le H2 (jusqu'au prochain H2)
  let orderedList: Array<{ content?: string; text?: string }> | null = null;
  for (let i = howtoStartIdx + 1; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'header' && b.data?.level === 2) break;
    if (b.type === 'list' && b.data?.style === 'ordered' && Array.isArray(b.data.items) && b.data.items.length >= 3) {
      orderedList = b.data.items;
      break;
    }
  }

  if (!orderedList) return null;

  const steps = orderedList.map((item, idx) => {
    const raw = (typeof item === 'string' ? item : (item.content || item.text || '')).toString();
    const clean = raw.replace(/<[^>]+>/g, '').trim();
    // Premiere phrase = name, le reste = text
    const firstSentence = clean.split(/[.:]/, 1)[0].trim().substring(0, 80);
    return {
      name: firstSentence || `Etape ${idx + 1}`,
      text: clean,
    };
  });

  return {
    name: howtoName || fallbackName,
    steps,
  };
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

  // Breadcrumb items pour le JSON-LD — chaîne complète Accueil → Section →
  // Catégorie → Article (le niveau section manquait, les pages catégories
  // l'émettent : les deux doivent raconter la même hiérarchie).
  const sectionLabels: Record<string, string> = {
    'vivre-aux-philippines': 'Vivre aux Philippines',
    'voyager-aux-philippines': 'Voyager aux Philippines',
    'actualites-sur-les-philippines': 'Actualités',
    'meilleurs-plans-aux-philippines': 'Meilleurs Plans',
  };
  const breadcrumbItems = [
    {
      name: 'Accueil',
      item: '/',
    },
    ...(sectionLabels[basePath]
      ? [{ name: sectionLabels[basePath], item: `/${basePath}` }]
      : []),
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
  const howto = extractHowToSteps(article.content, article.title);

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
        url: `${siteUrl}/logo-512.png`,
        width: 512,
        height: 512,
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

  // Les videos sont emises UNIQUEMENT via les scripts VideoObject standalone
  // ci-dessous (version plus riche : publisher + double thumbnail). Ne pas les
  // dupliquer dans articleSchema.video — GSC detectait chaque video 2 fois.

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
      {howto && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: howto.name,
              description: description.substring(0, 200),
              inLanguage: 'fr-FR',
              step: howto.steps.map((s, idx) => ({
                '@type': 'HowToStep',
                position: idx + 1,
                name: s.name,
                text: s.text,
                url: `${articleUrl}#step-${idx + 1}`,
              })),
            }),
          }}
        />
      )}
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
                  url: `${siteUrl}/logo-512.png`,
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
