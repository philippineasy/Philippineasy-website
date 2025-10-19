/**
 * Google News Sitemap
 * Sitemap spécial pour Google News avec balises <news:news>
 * Google crawle ce sitemap toutes les 5-15 minutes
 * Limite : 1000 articles maximum, 48h de fraîcheur recommandée
 * Docs: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */

import { NextResponse } from 'next/server';
import { createBuildClient } from '@/utils/supabase/build-client';

const BASE_URL = 'https://philippineasy.com';
const HOURS_LIMIT = 48; // Articles des 48 dernières heures pour Google News (recommandé)
const FALLBACK_DAYS = 7; // Si aucun article dans les 48h, on étend à 7 jours pour éviter sitemap vide

/* ---------- Helpers (réutilisés depuis sitemap.ts) ---------- */

// Helper: mappe les slugs de catégories principales à leurs chemins
// Accepte à la fois le format court ('actualites') et long ('actualites-sur-les-philippines')
const getMainCategoryPath = (mainCategorySlug: string | null) => {
  if (!mainCategorySlug) return 'actualites-sur-les-philippines';

  // Normaliser : si déjà au format long, le retourner tel quel
  const longFormats = [
    'actualites-sur-les-philippines',
    'meilleurs-plans-aux-philippines',
    'vivre-aux-philippines',
    'voyager-aux-philippines'
  ];
  if (longFormats.includes(mainCategorySlug)) {
    return mainCategorySlug;
  }

  // Sinon, mapper depuis le format court
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
      return 'actualites-sur-les-philippines';
  }
};

// Echappement XML
const escapeXml = (str: string) =>
  str.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return c;
    }
  });

// Récupère le nom de fichier d'une URL
const getRawFileName = (url: string) => {
  try {
    const u = new URL(url);
    const pathname = u.pathname || '';
    return decodeURIComponent(pathname.split('/').pop() || '');
  } catch {
    const noQuery = url.split('?')[0];
    return decodeURIComponent(noQuery.split('/').pop() || '');
  }
};

// Nettoie le nom de fichier pour le SEO
const cleanFileName = (name: string) => {
  const lower = name.toLowerCase();
  const withoutPrefix = lower
    .replace(/^thumbnail_\d+_/, '')
    .replace(/^\d+[-_]/, '');
  const parts = withoutPrefix.split('.');
  const ext = parts.length > 1 ? '.' + parts.pop() : '';
  const base = parts.join('.');
  const slug = base
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return (slug || 'image') + (ext || '.webp');
};

// Construit une URL image canonique sur le domaine
const toSeoImage = (sourceUrl: string, folder: 'articles' | 'products' | 'pages' | 'hero' | 'uploads' = 'uploads') => {
  const fileName = cleanFileName(getRawFileName(sourceUrl));
  return `${BASE_URL}/images/${folder}/${fileName}`;
};

export async function GET() {
  try {
    const supabase = createBuildClient();

    // Calculer la date limite (48h en arrière)
    let limitDate = new Date();
    limitDate.setHours(limitDate.getHours() - HOURS_LIMIT);

    // Récupérer les articles récents (publiés dans les 48 dernières heures)
    let { data: articles, error } = await supabase
      .from('articles')
      .select(`
        slug,
        title,
        published_at,
        image,
        category:categories(
          slug,
          main_category
        )
      `)
      .eq('status', 'published')
      .gte('published_at', limitDate.toISOString())
      .order('published_at', { ascending: false })
      .limit(1000); // Google News limite à 1000 URLs

    if (error) {
      console.error('Erreur lors de la récupération des articles pour news sitemap:', error);
      return new NextResponse('Error generating news sitemap', { status: 500 });
    }

    // Si aucun article dans les 48h, étendre à 7 jours pour éviter un sitemap vide
    // (Google Search Console génère une erreur "Balise XML manquante" avec un sitemap vide)
    if (!articles || articles.length === 0) {
      limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - FALLBACK_DAYS);

      const fallback = await supabase
        .from('articles')
        .select(`
          slug,
          title,
          published_at,
          image,
          category:categories(
            slug,
            main_category
          )
        `)
        .eq('status', 'published')
        .gte('published_at', limitDate.toISOString())
        .order('published_at', { ascending: false })
        .limit(10); // Limite à 10 articles pour le fallback

      articles = fallback.data;
    }

    // Construire le XML du sitemap
    const xmlEntries = articles
      ?.map((article) => {
        const categoryObj = Array.isArray(article.category)
          ? article.category[0]
          : article.category;

        if (!categoryObj) return null;

        const mainCategory = getMainCategoryPath(categoryObj.main_category);
        const url = `${BASE_URL}/${mainCategory}/${categoryObj.slug}/${article.slug}`;

        // Échapper les caractères spéciaux XML dans le titre et l'URL
        const escapedUrl = escapeXml(url);
        const escapedTitle = escapeXml(article.title);

        // Format ISO 8601 pour les dates
        const publicationDate = article.published_at;

        // Construire la balise image si elle existe
        const imageTag = article.image
          ? `
    <image:image>
      <image:loc>${escapeXml(toSeoImage(article.image, 'articles'))}</image:loc>
      <image:title>${escapedTitle}</image:title>
    </image:image>`
          : '';

        return `  <url>
    <loc>${escapedUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>Philippin'Easy</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${escapedTitle}</news:title>
    </news:news>${imageTag}
    <lastmod>${article.published_at}</lastmod>
  </url>`;
      })
      .filter(Boolean)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlEntries}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes cache
      },
    });

  } catch (error) {
    console.error('Erreur lors de la génération du news sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Configuration Next.js pour le revalidation
 * Le sitemap sera regénéré toutes les 5 minutes (300 secondes)
 */
export const revalidate = 300;
