import { MetadataRoute } from 'next';
import { createBuildClient } from '@/utils/supabase/build-client';
import { getMainCategoryPath } from '@/lib/utils';
import { toSeoImage } from '@/lib/sitemap-helpers';

const BASE_URL = 'https://philippineasy.com';

/* ---------- Types ---------- */

// On étend localement pour conserver <image:image> dans l'XML
type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: string[];
};

/* ---------- Revalidation ---------- */

// 10 min : compromis entre performance (cache long) et fraicheur (nouveaux
// articles publies via /admin doivent apparaitre rapidement dans le sitemap
// sans attendre 1h, sinon Google rate les nouveautes au crawl suivant).
export const revalidate = 600;

/* ---------- Route ---------- */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createBuildClient();
  if (!supabase) return [];
  const currentDate = new Date().toISOString();

  // Pages de listing (contenu qui change régulièrement) → currentDate
  // Pages statiques fixes (CGU, mentions légales, etc.) → date fixe
  const staticPages: SitemapEntry[] = [
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        toSeoImage(`${BASE_URL}/logo-philippineasy.png`, 'hero'),
        toSeoImage(`${BASE_URL}/imagesHero/comment-voyager-aux-philippines.webp`, 'hero'),
      ],
    },
    { url: `${BASE_URL}/actualites-sur-les-philippines`, lastModified: currentDate,    changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/meilleurs-plans-aux-philippines`,lastModified: currentDate,    changeFrequency: 'weekly', priority: 0.8 },
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
    { url: `${BASE_URL}/forum-sur-les-philippines`,      lastModified: currentDate,    changeFrequency: 'daily',  priority: 0.9 },
    { url: `${BASE_URL}/marketplace-aux-philippines`,     lastModified: currentDate,    changeFrequency: 'daily',  priority: 0.9 },
    {
      url: `${BASE_URL}/rencontre-philippines`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
      images: [toSeoImage(`${BASE_URL}/imagesHero/couple-rencontre-aux-philippines.webp`, 'hero')],
    },
    { url: `${BASE_URL}/services`,                        lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`,                         lastModified: '2026-04-15', changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE_URL}/application-mobile`,              lastModified: '2026-02-01', changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/cgu`,                             lastModified: '2026-01-01', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`,                 lastModified: '2026-01-01', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/mentions-legales`,                lastModified: '2026-01-01', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/itineraire-personnalise-pour-les-philippines`, lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/partenaires`,                     lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.7 },
  ];

  /* ---------- Static: Sous-pages (non couvertes par la table `pages`) ---------- */
  const subPages: SitemapEntry[] = [
    // Vivre — S'installer (depth 3)
    { url: `${BASE_URL}/vivre-aux-philippines/s-installer/logement`,          lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/vivre-aux-philippines/s-installer/visas`,             lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/vivre-aux-philippines/s-installer/banque-assurance`,  lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    // Vivre — Travailler (depth 3)
    { url: `${BASE_URL}/vivre-aux-philippines/travailler/creer-entreprise`,   lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/vivre-aux-philippines/travailler/emploi-salarie`,     lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    // Vivre — Étudier (depth 3)
    { url: `${BASE_URL}/vivre-aux-philippines/etudier/universites`,             lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/vivre-aux-philippines/etudier/ecoles-internationales`,  lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    // Vivre — Investir (depth 3)
    { url: `${BASE_URL}/vivre-aux-philippines/investir/immobilier`,             lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/vivre-aux-philippines/investir/bourse-et-entreprises`,  lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },
    // Vivre — Famille
    { url: `${BASE_URL}/vivre-aux-philippines/famille`,  lastModified: '2026-02-01', changeFrequency: 'monthly', priority: 0.6 },

    // Voyager — Destinations principales (hubs catégorie, parents des articles)
    { url: `${BASE_URL}/voyager-aux-philippines/palawan`,         lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/voyager-aux-philippines/cebu-visayas`,    lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/voyager-aux-philippines/siargao`,         lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.7 },
    // Voyager — Guides pratiques (hubs catégorie, parents des articles)
    { url: `${BASE_URL}/voyager-aux-philippines/budget`,          lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/voyager-aux-philippines/conseils-voyage`, lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/voyager-aux-philippines/transport`,       lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/voyager-aux-philippines/sante-securite`,  lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/voyager-aux-philippines/communication`,   lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/voyager-aux-philippines/quand-partir`,    lastModified: '2026-04-15', changeFrequency: 'monthly', priority: 0.6 },
  ];

  /* ---------- Dynamic: Articles ---------- */
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('slug, published_at, category_id, category:categories(slug, main_category), image')
    .eq('status', 'published');

  if (articlesError) console.error('Sitemap: articles query failed', articlesError.message);

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
        images: image ? [toSeoImage(image, 'articles')] : undefined,
      };
    }) || [])
      .filter(Boolean) as SitemapEntry[];

  /* ---------- Dynamic: Pages avec hero images ---------- */
  const { data: pages, error: pagesError } = await supabase
    .from('pages')
    .select('slug, created_at, hero_image_url, section');

  if (pagesError) console.error('Sitemap: pages query failed', pagesError.message);

  const pageImages: SitemapEntry[] =
    (pages?.map(({ slug, created_at, hero_image_url, section }) => {
      if (!hero_image_url || !section) return null;
      const sectionPath = getMainCategoryPath(section);
      return {
        url: `${BASE_URL}/${sectionPath}/${slug}`,
        lastModified: new Date(created_at).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        images: [toSeoImage(hero_image_url, 'pages')],
      };
    }) || [])
      .filter(Boolean) as SitemapEntry[];

  /* ---------- Dynamic: Catégories (uniquement celles avec >=1 article publie) ---------- */
  // Une categorie vide = thin content -> Google la rejette ("Discovered, not indexed")
  // -> on attend qu'elle ait du contenu avant de la soumettre au sitemap.
  const publishedCategoryIds = new Set(
    (articles ?? []).map((a: { category_id?: number }) => a.category_id).filter(Boolean)
  );

  const { data: allCategories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, slug, main_category');

  if (categoriesError) console.error('Sitemap: categories query failed', categoriesError.message);

  const categoryPages: SitemapEntry[] =
    (allCategories?.map(({ id, slug, main_category }) => {
      if (!main_category) return null;
      if (!publishedCategoryIds.has(id)) return null; // skip categories vides
      const mainCategoryPath = getMainCategoryPath(main_category);
      return {
        url: `${BASE_URL}/${mainCategoryPath}/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    }) || [])
      .filter(Boolean) as SitemapEntry[];

  /* ---------- Dynamic: Forum ---------- */
  // Filtres qualite : on n'envoie a Google que les pages avec un signal
  // d'engagement minimum. Sujet vide / categorie au seed initial = thin
  // content -> Google les rejette en "Discovered, not indexed" et plombe
  // la qualite percue du domaine. On les retient jusqu'a engagement reel,
  // puis Vercel rebuild auto les inclut au prochain ISR (10 min).
  const { data: forumTopics, error: forumTopicsError } = await supabase
    .from('forum_topics_with_stats')
    .select('slug, last_activity_at, reply_count, view_count');

  if (forumTopicsError) console.error('Sitemap: forum_topics query failed', forumTopicsError.message);

  const forumTopicPages: SitemapEntry[] =
    (forumTopics?.filter(({ reply_count, view_count }: { reply_count: number; view_count: number }) =>
      // Seuil : >=2 posts (1 initial + 1 reponse minimum) OU >=20 vues
      // Note : la vue forum_topics_with_stats compte le post initial dans
      // reply_count, donc reply_count=1 = sujet seed sans aucune reponse.
      (reply_count ?? 0) >= 2 || (view_count ?? 0) >= 20
    ).map(({ slug, last_activity_at }) => ({
      url: `${BASE_URL}/forum-sur-les-philippines/sujet/${slug}`,
      lastModified: new Date(last_activity_at).toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })) || []);

  const { data: forumCategories, error: forumCategoriesError } = await supabase
    .from('forum_categories_with_stats')
    .select('slug, topic_count, last_post_timestamp');

  if (forumCategoriesError) console.error('Sitemap: forum_categories query failed', forumCategoriesError.message);

  const forumCategoryPages: SitemapEntry[] =
    (forumCategories?.filter(({ topic_count }: { topic_count: number }) =>
      // Seuil : >=2 sujets = categorie pas juste au seed initial
      (topic_count ?? 0) >= 2
    ).map(({ slug, last_post_timestamp }) => ({
      url: `${BASE_URL}/forum-sur-les-philippines/${slug}`,
      lastModified: last_post_timestamp ? new Date(last_post_timestamp).toISOString() : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []);

  /* ---------- Dynamic: Produits ---------- */
  // Seulement les produits 'published' (pas drafts/pending/sold)
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at, image_urls, category_id')
    .eq('status', 'published');

  const productPages: SitemapEntry[] =
    (products?.map(({ slug, updated_at, image_urls }) => ({
      url: `${BASE_URL}/marketplace-aux-philippines/produit/${slug}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
      images: Array.isArray(image_urls) ? image_urls.map((u: string) => toSeoImage(u, 'products')) : undefined,
    })) || []);

  // Set des category_ids ayant au moins un produit publie (pour filtrer les
  // categories vides — meme pattern que `publishedCategoryIds` pour articles)
  const publishedProductCategoryIds = new Set(
    (products ?? []).map((p: { category_id?: number }) => p.category_id).filter(Boolean)
  );

  const { data: productCategories, error: productCategoriesError } = await supabase
    .from('product_categories')
    .select('id, slug, created_at');

  if (productCategoriesError) console.error('Sitemap: product_categories query failed', productCategoriesError.message);

  const productCategoryPages: SitemapEntry[] =
    (productCategories?.map(({ id, slug, created_at }) => {
      // skip categories sans aucun produit publie
      if (!publishedProductCategoryIds.has(id)) return null;
      return {
        url: `${BASE_URL}/marketplace-aux-philippines/categorie/${slug}`,
        lastModified: new Date(created_at).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    }) || [])
      .filter(Boolean) as SitemapEntry[];

  // VOLONTAIREMENT EXCLUS DU SITEMAP :
  // - Profils dating (`/rencontre-philippines/profil/UUID`) : contenu UTILISATEUR
  //   prive, indexable seulement sous authentification. La page a deja `noindex`
  //   meta. Avoir ces UUIDs dans un sitemap public = fuite donnees + signal
  //   contradictoire pour Google = penalisation crawl budget.
  // - Vendeurs (`/marketplace-aux-philippines/vendeur/ID`) : tant que le slug
  //   reste un ID numerique (SEO-hostile, faible valeur). A reactiver quand
  //   les vendeurs auront un slug texte humain.

  /* ---------- Dynamic: Itineraires programmatiques (BLOC 6.2) ---------- */
  const { data: itineraries, error: itinerariesError } = await supabase
    .from('destination_itineraries')
    .select('slug, hero_image, updated_at')
    .eq('published', true);

  if (itinerariesError) console.error('Sitemap: itineraries query failed', itinerariesError.message);

  const itineraryPages: SitemapEntry[] =
    (itineraries?.map(({ slug, hero_image, updated_at }) => ({
      url: `${BASE_URL}/itineraire-${slug}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
      images: hero_image ? [toSeoImage(hero_image, 'pages')] : undefined,
    })) || []) as SitemapEntry[];

  // Hub page (uniquement si au moins 1 itineraire publie)
  const itineraryHubPage: SitemapEntry[] = itineraryPages.length
    ? [{
        url: `${BASE_URL}/itineraires-philippines`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }]
    : [];

  /* ---------- Merge ---------- */
  return [
    ...staticPages,
    ...subPages,
    ...articlePages,
    ...pageImages,
    ...categoryPages,
    ...forumTopicPages,
    ...forumCategoryPages,
    ...productPages,
    ...productCategoryPages,
    ...itineraryHubPage,
    ...itineraryPages,
  ] as MetadataRoute.Sitemap;
}
