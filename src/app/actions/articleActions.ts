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
  const supabase = createClient();
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
  const supabase = createClient();

  if (!imageFile || imageFile.size === 0) {
    return { success: false, error: "L'image à la une est obligatoire." };
  }

  const { data, error } = await createArticleInService(supabase, articleData, imageFile);

  if (error) {
    return { success: false, error: error.message };
  }

  // Revalidate paths to show the new article
  revalidatePath('/admin/articles');
  revalidatePath('/actualites'); // Or wherever articles are listed

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
  status?: string;
};

export async function updateArticleAndRevalidate(
  articleId: number,
  updates: ArticleUpdates
) {
  const supabase = createClient();

  if (updates.status && !isValidStatus(updates.status)) {
    return { success: false, error: "Statut invalide fourni." };
  }
  
  const imageFile = updates.imageFile || null;
  // Create a new object without the imageFile property to avoid passing it to the service
  const updatesForService = { ...updates };
  delete updatesForService.imageFile;

  const { data, error } = await updateArticleInService(supabase, articleId, updatesForService as ArticleUpdate, imageFile);

  if (error) {
    console.error('Error updating article:', error);
    return { success: false, error: error.message };
  }

  // Revalidate paths to show the updated article
  revalidatePath('/admin/articles');
  if (data && data.slug && data.category && typeof data.category === 'object' && 'slug' in data.category) {
    const categorySlug = (data.category as { slug: string }).slug;
    revalidatePath(`/actualites/${categorySlug}`);
    revalidatePath(`/actualites/${categorySlug}/${data.slug}`);
    revalidatePath(`/meilleurs-plans/${categorySlug}/${data.slug}`);
    revalidatePath(`/vivre-aux-philippines/${categorySlug}/${data.slug}`);
    revalidatePath(`/voyager-aux-philippines/${categorySlug}/${data.slug}`);
  }
  revalidatePath('/');


  return { success: true, data };
}

import type { Article } from '@/types';

export async function searchArticles(searchTerm: string): Promise<{ articles: Article[] }> {
  const supabase = createClient();
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
  const supabase = createClient();
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
  const supabase = createClient();

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
