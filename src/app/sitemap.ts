import { MetadataRoute } from 'next';
import { createBuildClient } from '@/utils/supabase/build-client';

const supabase = createBuildClient();
const BASE_URL = 'https://philippineasy.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${BASE_URL}/actualites-sur-les-philippines`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/meilleurs-plans-aux-philippines`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/vivre-aux-philippines`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/voyager-aux-philippines`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/forum-sur-les-philippines`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/marketplace-aux-philippines`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/rencontre-philippines`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/application-mobile`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/cgu`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/connexion`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/itineraire-personnalise-pour-les-philippines`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Dynamic pages
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at, category:categories(slug, main_category)')
    .eq('status', 'published');

  const getMainCategoryPath = (mainCategorySlug: string | null) => {
    if (!mainCategorySlug) return 'actualites-sur-les-philippines'; // Fallback
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
        return 'actualites-sur-les-philippines'; // Fallback for any other case
    }
  };

  const articlePages = articles?.map(({ slug, published_at, category }) => {
    const categoryObject = Array.isArray(category) ? category[0] : category;

    if (!categoryObject || !categoryObject.slug || !categoryObject.main_category) return null;
    
    const mainCategoryPath = getMainCategoryPath(categoryObject.main_category);
    const url = `${BASE_URL}/${mainCategoryPath}/${categoryObject.slug}/${slug}`;

    return {
      url,
      lastModified: new Date(published_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  }).filter(Boolean) as MetadataRoute.Sitemap ?? [];

  const { data: allCategories } = await supabase.from('categories').select('slug, updated_at, main_category');
  
  const categoryPages = allCategories?.map(({ slug, updated_at, main_category }) => {
    if (!main_category) return null;
    const mainCategoryPath = getMainCategoryPath(main_category);
    return {
      url: `${BASE_URL}/${mainCategoryPath}/${slug}`,
      lastModified: new Date(updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  }).filter(Boolean) as MetadataRoute.Sitemap ?? [];

  const { data: forumTopics } = await supabase.from('forum_topics').select('slug, updated_at');
  const forumTopicPages = forumTopics?.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/forum-sur-les-philippines/sujet/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) ?? [];

  const { data: forumCategories } = await supabase.from('forum_categories').select('slug, updated_at');
  const forumCategoryPages = forumCategories?.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/forum-sur-les-philippines/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) ?? [];

  const { data: products } = await supabase.from('products').select('slug, updated_at');
  const productPages = products?.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/marketplace-aux-philippines/produit/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) ?? [];

  const { data: productCategories } = await supabase.from('product_categories').select('slug, updated_at');
  const productCategoryPages = productCategories?.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/marketplace-aux-philippines/categorie/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) ?? [];

  // We exclude dating profiles from the sitemap for SEO and privacy reasons.
  // These pages often contain user-generated content that can be considered "thin content"
  // and may not be ideal for search engine indexing. A noindex tag on the pages themselves is also recommended.
  const datingProfilePages: MetadataRoute.Sitemap = [];

  return [
    ...staticPages,
    ...articlePages,
    ...categoryPages,
    ...forumTopicPages,
    ...forumCategoryPages,
    ...productPages,
    ...productCategoryPages,
    // ...datingProfilePages, // Temporarily disabled as per SEO review
  ];
}
