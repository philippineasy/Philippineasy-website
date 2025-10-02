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
const HOURS_LIMIT = 48; // Articles des 48 dernières heures pour Google News

export async function GET() {
  try {
    const supabase = createBuildClient();

    // Calculer la date limite (48h en arrière)
    const limitDate = new Date();
    limitDate.setHours(limitDate.getHours() - HOURS_LIMIT);

    // Récupérer les articles récents (publiés dans les 48 dernières heures)
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        slug,
        title,
        published_at,
        updated_at,
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

    // Construire le XML du sitemap
    const xmlEntries = articles
      ?.map((article) => {
        const categoryObj = Array.isArray(article.category)
          ? article.category[0]
          : article.category;

        if (!categoryObj) return null;

        const mainCategory = categoryObj.main_category || 'actualites-sur-les-philippines';
        const url = `${BASE_URL}/${mainCategory}/${categoryObj.slug}/${article.slug}`;

        // Échapper les caractères spéciaux XML dans le titre
        const escapedTitle = article.title
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');

        // Format ISO 8601 pour les dates
        const publicationDate = article.published_at;

        return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>Philippin'Easy</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${escapedTitle}</news:title>
    </news:news>
    <lastmod>${article.updated_at || article.published_at}</lastmod>
  </url>`;
      })
      .filter(Boolean)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
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
