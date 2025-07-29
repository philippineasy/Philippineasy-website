import type { SupabaseClient } from '@supabase/supabase-js';
import { uploadArticleThumbnail } from './uploadService'; // Re-using for simplicity

export const updateCategory = async (
  supabase: SupabaseClient,
  categoryId: number, 
  updates: { name?: string; description?: string; imageFile?: File }
) => {
  try {
    let imageUrl = undefined;
    if (updates.imageFile) {
      // We can reuse the thumbnail uploader, but ideally, we'd have a dedicated one for category images.
      imageUrl = await uploadArticleThumbnail(supabase, updates.imageFile);
      if (!imageUrl) {
        const err = new Error("Échec du téléversement de l'image de la catégorie.");
        console.error(err.message);
        return { data: null, error: err };
      }
    }

    const dbUpdates: { name?: string; description?: string; heroImage?: string } = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.description) dbUpdates.description = updates.description;
    if (imageUrl) dbUpdates.heroImage = imageUrl; // Assuming the column is named heroImage

    if (Object.keys(dbUpdates).length === 0) {
      return { data: null, error: null }; // Nothing to update
    }

    const { data, error } = await supabase
      .from('categories')
      .update(dbUpdates)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating category in DB:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateCategory:', error);
    return { data: null, error: error as Error };
  }
};

export const getCategoriesByMainCategory = async (supabase: SupabaseClient, mainCategory: string) => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('main_category', mainCategory);

    if (error) {
        console.error(`Error fetching categories for ${mainCategory}:`, error);
        return { data: null, error };
    }
    return { data, error: null };
}

export const getAllCategories = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name');

    if (error) {
        console.error('Error fetching all categories:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getAllArticleCategories = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('categories')
        .select('slug, main_category, updated_at');

    if (error) {
        console.error('Error fetching all article categories:', error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getArticleCategoryBySlug = async (supabase: SupabaseClient, slug: string) => {
    const { data, error } = await supabase
        .from('categories')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching article category by slug ${slug}:`, error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getCategoryBySlug = async (supabase: SupabaseClient, slug: string) => {
    const { data, error } = await supabase
        .from('forum_categories')
        .select('id, name, slug')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching category by slug ${slug}:`, error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getProductCategoryBySlug = async (supabase: SupabaseClient, slug: string) => {
    const { data, error } = await supabase
        .from('product_categories')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching product category by slug ${slug}:`, error);
        return { data: null, error };
    }
    return { data, error: null };
};

export const getProductCategories = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, slug')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching product categories:', error);
        return { data: null, error };
    }
    return { data, error: null };
};
