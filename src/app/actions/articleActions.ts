'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { 
    getArticleBySlug as getArticleBySlugFromService,
    createArticle as createArticleInService,
    updateArticle as updateArticleInService
} from '@/services/articleService';
import type { ArticleCreate, ArticleUpdate } from '@/types';

/**
 * A Server Action to safely call the cached getArticleBySlug function from the client.
 * @param slug The slug of the article to fetch.
 * @returns The article data or null.
 */
export async function getArticleBySlugAction(slug: string) {
  const supabase = await createClient();
  const { data, error } = await getArticleBySlugFromService(supabase, slug);

  if (error) {
    return { success: false, error: error.message, data: null };
  }

  return { success: true, data, error: null };
}

type ArticleStatus = 'published' | 'draft' | 'archived';

function isValidStatus(status: any): status is ArticleStatus {
  return ['published', 'draft', 'archived'].includes(status);
}

export async function createArticleAction(articleData: ArticleCreate, imageFile: File) {
  const supabase = await createClient();

  if (!imageFile || imageFile.size === 0) {
    return { success: false, error: "L'image à la une est obligatoire." };
  }

  const dataToCreate: ArticleCreate = {
    ...articleData,
    published_at: articleData.status === 'published' ? new Date().toISOString() : undefined,
  };

  const { data, error } = await createArticleInService(supabase, dataToCreate, imageFile);

  if (error) {
    return { success: false, error: error.message };
  }

  // Revalidate paths to show the new article
  revalidatePath('/admin/articles');
  revalidatePath('/actualites'); // Or wherever articles are listed

  // Si l'article est publié, soumettre à IndexNow ET Google pour indexation rapide
  if (data && articleData.status === 'published') {
    try {
      // Récupérer les infos de catégorie pour construire l'URL
      const { data: article } = await supabase
        .from('articles')
        .select('slug, category:categories(slug, main_category)')
        .eq('id', data.id)
        .single();

      if (article && article.category) {
        const categoryObj = Array.isArray(article.category) ? article.category[0] : article.category;
        const mainCategory = categoryObj.main_category || 'actualites-sur-les-philippines';
        const fullUrl = `https://philippineasy.com/${mainCategory}/${categoryObj.slug}/${article.slug}`;

        // 1. Soumettre à IndexNow (Bing, Yandex)
        const { submitNewArticle } = await import('@/utils/seo/indexnow');
        await submitNewArticle(article.slug, mainCategory, categoryObj.slug);
        console.log('✅ Article soumis à IndexNow (Bing/Yandex)');

        // 2. Soumettre à Google Indexing API (nouveau !)
        const { submitToGoogleIndexing } = await import('@/utils/seo/google-indexing');
        const googleResult = await submitToGoogleIndexing(fullUrl);
        if (googleResult.success) {
          console.log('✅ Article soumis à Google Indexing API (indexation en 2-5 min)');
        } else {
          console.warn('⚠️ Google Indexing API a échoué:', googleResult.message);
        }
      }
    } catch (indexError) {
      console.error('⚠️ Erreur lors de la soumission (article créé quand même):', indexError);
    }
  }

  return { success: true, data };
}

import { OutputData } from '@editorjs/editorjs';

type ArticleUpdates = {
  title?: string;
  content?: OutputData; // Editor.js data
  imageFile?: File | null;
  // Keep other potential fields from the form if necessary
  slug?: string;
  category_id?: number;
  status?: ArticleStatus;
  published_at?: string;
};

export async function updateArticleAndRevalidate(
  articleId: number,
  updates: ArticleUpdates
) {
  const supabase = await createClient();

  if (updates.status && !isValidStatus(updates.status)) {
    return { success: false, error: "Statut invalide fourni." };
  }

  const imageFile = updates.imageFile || null;
  const updatesForService: ArticleUpdate = { ...updates };
  delete (updatesForService as any).imageFile;

  // The client-side logic now handles the published_at date.
  // This server-side check is no longer needed.

  const { data, error } = await updateArticleInService(supabase, articleId, updatesForService, imageFile);

  if (error) {
    console.error('Error updating article:', error);
    return { success: false, error: error.message };
  }

  // Revalidate paths to show the updated article
  revalidatePath('/admin/articles');
  if (data?.slug) {
    // Revalidate all possible article paths to be safe
    const articleSlug = data.slug;
    revalidatePath(`/actualites-sur-les-philippines/${articleSlug}`);
    revalidatePath(`/meilleurs-plans-aux-philippines/${articleSlug}`);
    revalidatePath(`/vivre-aux-philippines/${articleSlug}`);
    revalidatePath(`/voyager-aux-philippines/${articleSlug}`);

    // Revalidate main listing pages
    revalidatePath('/actualites-sur-les-philippines');
    revalidatePath('/meilleurs-plans-aux-philippines');
    revalidatePath('/vivre-aux-philippines');
    revalidatePath('/voyager-aux-philippines');

    // Revalidate generic article structure if category data is available
    if (data.category && typeof data.category === 'object' && 'main_category' in data.category && 'slug' in data.category) {
        const mainCategory = (data.category as any).main_category;
        const categorySlug = (data.category as any).slug;
        if (mainCategory && categorySlug) {
            revalidatePath(`/${mainCategory}/${categorySlug}/${articleSlug}`);
        }
    }

    // Si l'article vient d'être publié (status changed to published), soumettre à IndexNow ET Google
    if (updates.status === 'published') {
      try {
        // Récupérer les infos complètes
        const { data: article } = await supabase
          .from('articles')
          .select('slug, category:categories(slug, main_category)')
          .eq('id', articleId)
          .single();

        if (article && article.category) {
          const categoryObj = Array.isArray(article.category) ? article.category[0] : article.category;
          const mainCategory = categoryObj.main_category || 'actualites-sur-les-philippines';
          const fullUrl = `https://philippineasy.com/${mainCategory}/${categoryObj.slug}/${article.slug}`;

          // 1. Soumettre à IndexNow
          const { submitNewArticle } = await import('@/utils/seo/indexnow');
          await submitNewArticle(article.slug, mainCategory, categoryObj.slug);
          console.log('✅ Article mis à jour soumis à IndexNow');

          // 2. Soumettre à Google
          const { submitToGoogleIndexing } = await import('@/utils/seo/google-indexing');
          const googleResult = await submitToGoogleIndexing(fullUrl);
          if (googleResult.success) {
            console.log('✅ Article mis à jour soumis à Google Indexing API');
          }
        }
      } catch (indexError) {
        console.error('⚠️ Erreur lors de la mise à jour:', indexError);
      }
    }
  }
  revalidatePath('/'); // Revalidate homepage


  return { success: true, data };
}

import type { Article } from '@/types';

export async function searchArticles(searchTerm: string): Promise<{ articles: Article[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, image, published_at, content, category:categories(id, name, slug)')
    .ilike('title', `%${searchTerm}%`)
    .limit(10);

  if (error) {
    console.error('Error searching articles:', error);
    return { articles: [] };
  }

  // Ensure the returned data matches the Article type structure
  const articles: Article[] = data.map(article => ({
    ...article,
    category: Array.isArray(article.category) ? article.category[0] : article.category,
    type: 'article',
  }));

  return { articles };
}

export async function getArticlesByCategory(categoryId: number): Promise<{ articles: Article[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, image, published_at, content, category:categories(id, name, slug)')
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error fetching articles by category:', error);
    return { articles: [] };
  }

  const articles: Article[] = data.map(article => ({
    ...article,
    category: Array.isArray(article.category) ? article.category[0] : article.category,
    type: 'article',
  }));

  return { articles };
}

export async function updateArticleAction(articleId: number, updates: ArticleUpdate, imageFile: File | null) {
  const supabase = await createClient();

  const { data, error } = await updateArticleInService(supabase, articleId, updates, imageFile);

  if (error) {
    return { success: false, error: error.message };
  }

  // Revalidate paths to show the updated article
  revalidatePath('/admin/articles');
  if (data?.slug) {
    revalidatePath(`/actualites/${data.slug}`);
  }

  return { success: true, data };
}
