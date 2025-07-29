'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { updateCategory as updateCategoryInService } from '@/services/categoryService';

// This type should be properly defined and shared, but for now, we'll use 'any'
// to avoid creating a new types file in this step.
type CategoryUpdates = {
  name?: string;
  description?: string;
  imageFile?: File;
};

/**
 * A Server Action to update a category and revalidate the cache.
 * This should be called from client components to handle category updates.
 * @param categoryId The ID of the category to update.
 * @param updates The updates to apply.
 * @returns The result of the update operation.
 */
export async function updateCategoryAndRevalidate(
  categoryId: number,
  updates: CategoryUpdates
) {
  const supabase = await createClient();
  const { data, error } = await updateCategoryInService(supabase, categoryId, updates);

  // If the update was successful, revalidate the 'categories' tag.
  // This will purge the cache for getCategoriesByMainCategory.
  if (!error) {
    revalidateTag('categories');
    console.log(`Revalidated tag: categories`);
  }

  return { success: !error, data, error };
}

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase.from('categories').select('*');
  return { data, error };
}
