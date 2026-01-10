'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export async function handleAddCategory(name: string) {
  const supabase = await createClient();
  const slug = slugify(name, { lower: true, strict: true });

  const { data, error } = await supabase
    .from('product_categories')
    .insert({ name, slug })
    .select();

  if (error) {
    return { success: false, error: error.message, data: null };
  }

  revalidatePath('/admin/marketplace/categories');
  revalidatePath('/layout'); // Revalidate layout to update header dropdown
  return { success: true, error: null, data };
}

export async function handleDeleteCategory(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('product_categories')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/marketplace/categories');
  revalidatePath('/layout'); // Revalidate layout to update header dropdown
  return { success: true };
}
