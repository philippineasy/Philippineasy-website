import type { SupabaseClient } from '@supabase/supabase-js';

export const getPageBySlug = async (supabase: SupabaseClient, slug: string) => {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching page by slug: ${slug}`, error);
        return { data: null, error };
    }

    return { data, error: null };
};

export const getAllPages = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .not('slug', 'eq', 'preparer-son-itineraire')
        .order('section');

    if (error) {
        console.error('Error fetching all pages:', error);
        return { data: null, error };
    }

    const groupedPages = data.reduce((acc, page) => {
        const section = page.section || 'uncategorized';
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(page);
        return acc;
    }, {} as Record<string, any[]>);

    return { data: groupedPages, error: null };
};

export const updatePageHeroImage = async (supabase: SupabaseClient, slug: string, hero_image_url: string) => {
    const { data, error } = await supabase
        .from('pages')
        .update({ hero_image_url })
        .eq('slug', slug)
        .select()
        .single();

    if (error) {
        console.error(`Error updating page hero image: ${slug}`, error);
        return { data: null, error };
    }

    return { data, error: null };
};
