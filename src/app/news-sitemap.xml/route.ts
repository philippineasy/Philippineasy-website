/**
 * Google News Sitemap
 * Sitemap spécial pour Google News avec balises <news:news>
 * Google crawle ce sitemap toutes les 5-15 minutes
 * Limite : 1000 articles maximum, 48h de fraîcheur recommandée
 * Docs: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */

import { NextResponse } from 'next/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import { getMainCategoryPath } from '@/lib/utils';
import { escapeXml, toSeoImage } from '@/lib/sitemap-helpers';

const BASE_URL = 'https://philippineasy.com';
const HOURS_LIMIT = 48;
const FALLBACK_DAYS = 7;

export async function GET() {
  try {
    const supabase = createBuildClient();
    if (!supabase) return new NextResponse('Supabase not configured', { status: 503 });

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
