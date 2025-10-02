import { MetadataRoute } from 'next';
import { createBuildClient } from '@/utils/supabase/build-client';

const supabase = createBuildClient();
const BASE_URL = 'https://philippineasy.com';

/* ---------- Helpers ---------- */

// Echappement XML (évite le "EntityRef: expecting ';'")
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

// Retire querystring + récupère le nom de fichier
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
    .replace(/^thumbnail_\d+_/, '')     // supprime "thumbnail_1755_"
    .replace(/^\d+[-_]/, '');           // supprime "1755-" ou "1755_"
  const parts = withoutPrefix.split('.');
  const ext = parts.length > 1 ? '.' + parts.pop() : '';
  const base = parts.join('.');
  const slug = base
    .replace(/[^a-z0-9-_]+/g, '-')      // caractères propres
    .replace(/-+/g, '-')                // compresse les "-"
    .replace(/^-+|-+$/g, '');           // trim "-"
  return (slug || 'image') + (ext || '.webp');
};

// Construit une URL image canonique sur ton domaine
const toSeoImage = (sourceUrl: string, folder: 'articles' | 'products' | 'pages' | 'hero' | 'uploads' = 'uploads') => {
  const fileName = cleanFileName(getRawFileName(sourceUrl));
  return `${BASE_URL}/images/${folder}/${fileName}`;
};

/* ---------- Types ---------- */

// On étend localement pour conserver <image:image> dans l’XML
type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: string[];
};

/* ---------- Route ---------- */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Pages statiques
  const staticPages: SitemapEntry[] = [
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 1,
      images: [
        toSeoImage(`${BASE_URL}/logo-philippineasy.png`, 'hero'),
        toSeoImage(`${BASE_URL}/imagesHero/comment-voyager-aux-philippines.webp`, 'hero'),
      ],
    },
    { url: `${BASE_URL}/actualites-sur-les-philippines`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/meilleurs-plans-aux-philippines`,   lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    {
      url: `${BASE_URL}/vivre-aux-philippines`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [toSeoImage(`${BASE_URL}/imagesHero/nouveau-depart-aux-philippines.webp`, 'hero')],
    },
    {
      url: `${BASE_URL}/voyager-aux-philippines`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [toSeoImage(`${BASE_URL}/imagesHero/comment-voyager-aux-philippines.webp`, 'hero')],
    },
    { url: `${BASE_URL}/forum-sur-les-philippines`,      lastModified: currentDate, changeFrequency: 'daily',  priority: 0.9 },
    { url: `${BASE_URL}/marketplace-aux-philippines`,     lastModified: currentDate, changeFrequency: 'daily',  priority: 0.9 },
    {
      url: `${BASE_URL}/rencontre-philippines`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
      images: [toSeoImage(`${BASE_URL}/imagesHero/couple-rencontre-aux-philippines.webp`, 'hero')],
    },
    { url: `${BASE_URL}/application-mobile`,              lastModified: currentDate, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/cgu`,                             lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`,                 lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/mentions-legales`,                lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/connexion`,                       lastModified: currentDate, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/itineraire-personnalise-pour-les-philippines`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Helper: mappe les slugs de catégories principales à leurs chemins
  const getMainCategoryPath = (mainCategorySlug: string | null) => {
    if (!mainCategorySlug) return 'actualites-sur-les-philippines';
    switch (mainCategorySlug) {
      case 'actualites':
        return 'actualites-sur-les-philippines';
      case 'meilleurs-plans-aux-philippines':
        return 'meilleurs-plans-aux-philippines';
      case 'vivre-aux-philippines':
        return 'vivre-aux-philippines';
      case 'voyager-aux-philippines':
        return 'voyager-aux-philippines';
      default:
        return 'actualites-sur-les-philippines';
    }
  };

  /* ---------- Dynamic: Articles ---------- */
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at, category:categories(slug, main_category), image')
    .eq('status', 'published');

  const articlePages: SitemapEntry[] =
    (articles?.map(({ slug, published_at, category, image }) => {
      const categoryObject = Array.isArray(category) ? category[0] : category;
      if (!categoryObject || !categoryObject.slug || !categoryObject.main_category) return null;

      const mainCategoryPath = getMainCategoryPath(categoryObject.main_category);
      const url = `${BASE_URL}/${mainCategoryPath}/${categoryObject.slug}/${slug}`;

      return {
        url,
        lastModified: new Date(published_at).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        images: image ? [toSeoImage(image, 'articles')] : undefined, // réécrit vers ton domaine
      };
    }) || [])
      .filter(Boolean) as SitemapEntry[];

  /* ---------- Dynamic: Pages avec hero images ---------- */
  const { data: pages } = await supabase
    .from('pages')
    .select('slug, updated_at, hero_image_url');

  const pageImages: SitemapEntry[] =
    (pages?.map(({ slug, updated_at, hero_image_url }) => {
      if (!hero_image_url) return null;
      return {
        url: `${BASE_URL}/${slug}`,
        lastModified: new Date(updated_at).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        images: [toSeoImage(hero_image_url, 'pages')],
      };
    }) || [])
      .filter(Boolean) as SitemapEntry[];

  /* ---------- Dynamic: Catégories ---------- */
  const { data: allCategories } = await supabase
    .from('categories')
    .select('slug, updated_at, main_category');

  const categoryPages: SitemapEntry[] =
    (allCategories?.map(({ slug, updated_at, main_category }) => {
      if (!main_category) return null;
      const mainCategoryPath = getMainCategoryPath(main_category);
      return {
        url: `${BASE_URL}/${mainCategoryPath}/${slug}`,
        lastModified: new Date(updated_at).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    }) || [])
      .filter(Boolean) as SitemapEntry[];

  /* ---------- Dynamic: Forum ---------- */
  const { data: forumTopics } = await supabase
    .from('forum_topics')
    .select('slug, updated_at');

  const forumTopicPages: SitemapEntry[] =
    (forumTopics?.map(({ slug, updated_at }) => ({
      url: `${BASE_URL}/forum-sur-les-philippines/sujet/${slug}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })) || []);

  const { data: forumCategories } = await supabase
    .from('forum_categories')
    .select('slug, updated_at');

  const forumCategoryPages: SitemapEntry[] =
    (forumCategories?.map(({ slug, updated_at }) => ({
      url: `${BASE_URL}/forum-sur-les-philippines/${slug}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []);

  /* ---------- Dynamic: Produits ---------- */
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at, image_urls');

  const productPages: SitemapEntry[] =
    (products?.map(({ slug, updated_at, image_urls }) => ({
      url: `${BASE_URL}/marketplace-aux-philippines/produit/${slug}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
      images: Array.isArray(image_urls) ? image_urls.map((u: string) => toSeoImage(u, 'products')) : undefined,
    })) || []);

  const { data: productCategories } = await supabase
    .from('product_categories')
    .select('slug, updated_at');

  const productCategoryPages: SitemapEntry[] =
    (productCategories?.map(({ slug, updated_at }) => ({
      url: `${BASE_URL}/marketplace-aux-philippines/categorie/${slug}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []);

  /* ---------- Dynamic: Vendeurs ---------- */
  const { data: vendors } = await supabase
    .from('vendors')
    .select('id, updated_at');

  const vendorPages: SitemapEntry[] =
    (vendors?.map(({ id, updated_at }) => ({
      url: `${BASE_URL}/marketplace-aux-philippines/vendeur/${id}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []);

  /* ---------- Dynamic: Profils Rencontre ---------- */
  const { data: profiles } = await supabase
    .from('dating_profiles')
    .select('id, updated_at');

  const profilePages: SitemapEntry[] =
    (profiles?.map(({ id, updated_at }) => ({
      url: `${BASE_URL}/rencontre-philippines/profil/${id}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })) || []);

  /* ---------- Merge + escape ---------- */
  const allPages = [
    ...staticPages,
    ...articlePages,
    ...pageImages,
    ...categoryPages,
    ...forumTopicPages,
    ...forumCategoryPages,
    ...productPages,
    ...productCategoryPages,
    ...vendorPages,
    ...profilePages,
  ];

  const escapedPages = allPages
    .filter(Boolean)
    .map((page) => ({
      ...page,
      url: escapeXml(page.url),
      images: page.images?.map(escapeXml),
    })) as SitemapEntry[];

  // Next acceptera le champ "images" et générera les balises <image:image>
  return escapedPages as MetadataRoute.Sitemap;
}
