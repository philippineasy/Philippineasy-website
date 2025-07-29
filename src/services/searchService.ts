import type { SupabaseClient } from '@supabase/supabase-js';

export const searchAll = async (supabase: SupabaseClient, query: string) => {
  if (!query) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase.rpc('search_all_content', {
    search_term: query,
  });

  if (error) {
    console.error('Error searching all content:', error);
    return { data: null, error };
  }

  return { data, error: null };
};
