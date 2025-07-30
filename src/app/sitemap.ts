import { MetadataRoute } from 'next';
import { createBuildClient } from '@/utils/supabase/build-client';

const supabase = createBuildClient();
const BASE_URL = 'https://philippineasy.com';

// Extended sitemap type to support images
type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: string[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static pages with their associated images
  const staticPages: SitemapEntry[] = [
    { 
      url: `${BASE_URL}/`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly', 
      priority: 1,
      images: [
        `${BASE_URL}/logo-philippineasy.png`,
        `${BASE_URL}/imagesHero/comment-voyager-aux-philippines.webp`
      ]
    },
    { 
      url: `${BASE_URL}/actualites-sur-les-philippines`, 
      lastModified: currentDate, 
      changeFrequency: 'weekly', 
      priority: 0.8 
    },
    { 
      url: `${BASE_URL}/meilleurs-plans-aux-philippines`, 
      lastModified: currentDate, 
      changeFrequency: 'weekly', 
      priority: 0.8 
    },
    { 
      url: `${BASE_URL}/vivre-aux-philippines`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.8,
      images: [`${BASE_URL}/imagesHero/nouveau-depart-aux-philippines.webp`]
    },
    { 
      url: `${BASE_URL}/voyager-aux-philippines`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.8,
      images: [`${BASE_URL}/imagesHero/comment-voyager-aux-philippines.webp`]
    },
    { 
      url: `${BASE_URL}/forum-sur-les-philippines`, 
      lastModified: currentDate, 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${BASE_URL}/marketplace-aux-philippines`, 
      lastModified: currentDate, 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${BASE_URL}/rencontre-philippines`, 
      lastModified: currentDate, 
      changeFrequency: 'daily', 
      priority: 0.9,
      images: [`${BASE_URL}/imagesHero/couple-rencontre-aux-philippines.webp`]
    },
    { 
      url: `${BASE_URL}/application-mobile`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly', 
      priority: 0.5 
    },
    { 
      url: `${BASE_URL}/cgu`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
    { 
      url: `${BASE_URL}/confidentialite`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
    { 
      url: `${BASE_URL}/mentions-legales`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
    { 
      url: `${BASE_URL}/connexion`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly', 
      priority: 0.5 
    },
    { 
      url: `${BASE_URL}/itineraire-personnalise-pour-les-philippines`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.7 
    },
  ];

  // Get all local images for static content
  const getLocalImages = () => {
    return [
      // Budget images
      `${BASE_URL}/images/budget/apparthotel-coquet.webp`,
      `${BASE_URL}/images/budget/chambre-vue-mer.webp`,
      `${BASE_URL}/images/budget/dortoir-auberge-jeunesse.webp`,
      `${BASE_URL}/images/budget/marche-fruits-locaux.webp`,
      `${BASE_URL}/images/budget/resort-de-luxe-philippines.webp`,
      
      // Communication images
      `${BASE_URL}/images/communication/dialogue-interculturel.webp`,
      `${BASE_URL}/images/communication/personne-avec-telephone.webp`,
      
      // Family images
      `${BASE_URL}/images/famille/famille-condominium-philippines.webp`,
      
      // Investment images
      `${BASE_URL}/images/investir/vue-condominium-philippines.webp`,
      
      // Weather images
      `${BASE_URL}/images/meteo/plage-tropicale-philippines.webp`,
      `${BASE_URL}/images/meteo/rizieres-philippines-nuageuses.webp`,
      
      // Food images
      `${BASE_URL}/images/nourriture/balut-des-philippines.webp`,
      `${BASE_URL}/images/nourriture/banana-cue-philippines.webp`,
      `${BASE_URL}/images/nourriture/carinderia-locale-animee.webp`,
      `${BASE_URL}/images/nourriture/kwek-kwek-delicieux.webp`,
      `${BASE_URL}/images/nourriture/plat-betamax-philippines.webp`,
      `${BASE_URL}/images/nourriture/plat-philippin-isaw.webp`,
      `${BASE_URL}/images/nourriture/plat-philippines-taho.webp`,
      `${BASE_URL}/images/nourriture/street-food-philippine.webp`,
      
      // Palawan images
      `${BASE_URL}/images/palawan/bateau-bangka-el-nido.webp`,
      `${BASE_URL}/images/palawan/vue-aerienne-coron.webp`,
      
      // Health images
      `${BASE_URL}/images/sante/controle-police-philippines.webp`,
      `${BASE_URL}/images/sante/vaccins-voyage-philippines.webp`,
      
      // Siargao images
      `${BASE_URL}/images/siargao/piscines-naturelles-magpupungko.webp`,
      `${BASE_URL}/images/siargao/surf-a-siargao.webp`,
      
      // Transport images
      `${BASE_URL}/images/transport/ferry-sur-mer-calme.webp`,
      `${BASE_URL}/images/transport/jeepney-aux-philippines.webp`,
      `${BASE_URL}/images/transport/vue-aerienne-nuageuse.webp`,
      
      // Travel images
      `${BASE_URL}/images/voyager/iles-philippines-aeriennes.webp`,
      
      // Hero images
      `${BASE_URL}/imagesHero/antennes-reseaux-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/banque-assurance-philippines.webp`,
      `${BASE_URL}/imagesHero/comment-investir-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/comment-voyager-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/couple-rencontre-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/hutte-philippines.webp`,
      `${BASE_URL}/imagesHero/maitriser-son-budget-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/meteo-contrastee-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/nouveau-depart-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/ou-et-comment-etudier-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/securite-et-sante-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/travailleur-etranger-aux-philippines.webp`,
      `${BASE_URL}/imagesHero/visa-philippines-processus.webp`
    ];
  };

  // Dynamic pages
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at, category:categories(slug, main_category), image')
    .eq('status', 'published');

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

  const articlePages: SitemapEntry[] = articles?.map(({ slug, published_at, category, image }) => {
    const categoryObject = Array.isArray(category) ? category[0] : category;

    if (!categoryObject || !categoryObject.slug || !categoryObject.main_category) return null;
    
    const mainCategoryPath = getMainCategoryPath(categoryObject.main_category);
    const url = `${BASE_URL}/${mainCategoryPath}/${categoryObject.slug}/${slug}`;

    return {
      url,
      lastModified: new Date(published_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      images: image ? [image] : undefined,
    };
  }).filter(Boolean) as SitemapEntry[] ?? [];

  // Get pages with hero images
  const { data: pages } = await supabase
    .from('pages')
    .select('slug, updated_at, hero_image_url');

  const pageImages: SitemapEntry[] = pages?.map(({ slug, updated_at, hero_image_url }) => {
    if (!hero_image_url) return null;
    
    return {
      url: `${BASE_URL}/${slug}`, // Adjust path as needed
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      images: [hero_image_url],
    };
  }).filter(Boolean) as SitemapEntry[] ?? [];

  const { data: allCategories } = await supabase.from('categories').select('slug, updated_at, main_category');
  
  const categoryPages: SitemapEntry[] = allCategories?.map(({ slug, updated_at, main_category }) => {
    if (!main_category) return null;
    const mainCategoryPath = getMainCategoryPath(main_category);
    return {
      url: `${BASE_URL}/${mainCategoryPath}/${slug}`,
      lastModified: new Date(updated_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  }).filter(Boolean) as SitemapEntry[] ?? [];

  const { data: forumTopics } = await supabase.from('forum_topics').select('slug, updated_at');
  const forumTopicPages: SitemapEntry[] = forumTopics?.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/forum-sur-les-philippines/sujet/${slug}`,
    lastModified: new Date(updated_at).toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) ?? [];

  const { data: forumCategories } = await supabase.from('forum_categories').select('slug, updated_at');
  const forumCategoryPages: SitemapEntry[] = forumCategories?.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/forum-sur-les-philippines/${slug}`,
    lastModified: new Date(updated_at).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) ?? [];

  const { data: products } = await supabase.from('products').select('slug, updated_at, image_urls');
  const productPages: SitemapEntry[] = products?.map(({ slug, updated_at, image_urls }) => ({
    url: `${BASE_URL}/marketplace-aux-philippines/produit/${slug}`,
    lastModified: new Date(updated_at).toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
    images: image_urls && Array.isArray(image_urls) ? image_urls : undefined,
  })) ?? [];

  const { data: productCategories } = await supabase.from('product_categories').select('slug, updated_at');
  const productCategoryPages: SitemapEntry[] = productCategories?.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/marketplace-aux-philippines/categorie/${slug}`,
    lastModified: new Date(updated_at).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) ?? [];

  // Add a special sitemap entry for all local images
  const localImages = getLocalImages();
  const imagesSitemapEntry: SitemapEntry = {
    url: `${BASE_URL}/images`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.5,
    images: localImages,
  };

  // Convert to MetadataRoute.Sitemap format (removes images property for compatibility)
  const allPages = [
    ...staticPages,
    ...articlePages,
    ...pageImages,
    ...categoryPages,
    ...forumTopicPages,
    ...forumCategoryPages,
    ...productPages,
    ...productCategoryPages,
    imagesSitemapEntry,
  ];

  // Transform to the expected format, keeping the images information in a way that Next.js can handle
  return allPages.map(({ images, ...rest }) => ({
    ...rest,
    // Note: Next.js doesn't natively support images in sitemap, but this structure prepares for XML sitemap generation
    ...(images && images.length > 0 ? { alternates: { media: images.map(img => ({ url: img })) } } : {}),
  })) as MetadataRoute.Sitemap;
}
