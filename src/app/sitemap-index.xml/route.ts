import { NextResponse } from 'next/server';

const BASE_URL = 'https://philippineasy.com';

export async function GET() {
  const currentDate = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/news-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 hour cache
    },
  });
}

/**
 * Configuration Next.js pour le revalidation
 * Le sitemap index sera regénéré toutes les heures (3600 secondes)
 */
export const revalidate = 3600;
