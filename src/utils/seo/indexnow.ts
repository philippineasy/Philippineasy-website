/**
 * Helper pour soumettre des URLs à IndexNow
 * Utilisé pour notifier les moteurs de recherche (Bing, Yandex) des nouveaux contenus
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const BASE_URL = 'https://philippineasy.com';

interface IndexNowResponse {
  success: boolean;
  message: string;
  statusCode?: number;
}

/**
 * Soumet une ou plusieurs URLs à IndexNow
 * @param urls - URL unique ou array d'URLs à soumettre
 * @returns Promise avec le résultat de la soumission
 */
export async function submitToIndexNow(urls: string | string[]): Promise<IndexNowResponse> {
  try {
    const urlList = Array.isArray(urls) ? urls : [urls];

    // Valider que toutes les URLs sont des URLs complètes
    const fullUrls = urlList.map(url => {
      if (url.startsWith('http')) {
        return url;
      }
      // Si c'est un chemin relatif, ajouter le domaine
      return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
    });

    const response = await fetch(`${BASE_URL}/api/seo/ping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: fullUrls,
      }),
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || 'Soumission effectuée',
      statusCode: response.status,
    };
  } catch (error) {
    console.error('❌ Erreur lors de la soumission IndexNow:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Soumet un nouvel article publié à IndexNow
 * @param articleSlug - Slug de l'article
 * @param mainCategory - Catégorie principale (ex: 'voyager-aux-philippines')
 * @param categorySlug - Slug de la catégorie
 */
export async function submitNewArticle(
  articleSlug: string,
  mainCategory: string,
  categorySlug: string
): Promise<IndexNowResponse> {
  const articleUrl = `${BASE_URL}/${mainCategory}/${categorySlug}/${articleSlug}`;

  console.log('📤 Soumission nouvel article à IndexNow:', articleUrl);

  return submitToIndexNow(articleUrl);
}

/**
 * Soumet le sitemap complet à IndexNow
 */
export async function submitSitemap(): Promise<IndexNowResponse> {
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;

  console.log('📤 Soumission sitemap à IndexNow:', sitemapUrl);

  return submitToIndexNow(sitemapUrl);
}
