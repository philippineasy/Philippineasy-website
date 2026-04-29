import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DestinationItinerary,
  DestinationItinerarySummary,
} from '@/types/destinationItineraries';

export const getAllPublishedSlugs = async (
  supabase: SupabaseClient
): Promise<string[]> => {
  const { data, error } = await supabase
    .from('destination_itineraries')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching published itinerary slugs:', error);
    return [];
  }

  return data?.map((d) => d.slug) ?? [];
};

export const getItineraryBySlug = async (
  supabase: SupabaseClient,
  slug: string
): Promise<DestinationItinerary | null> => {
  const { data, error } = await supabase
    .from('destination_itineraries')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) {
    if (error && error.code !== 'PGRST116') {
      console.error(`Error fetching itinerary "${slug}":`, error);
    }
    return null;
  }

  return data as DestinationItinerary;
};

export const getRelatedItineraries = async (
  supabase: SupabaseClient,
  slugs: string[]
): Promise<DestinationItinerarySummary[]> => {
  if (!slugs.length) return [];

  const { data, error } = await supabase
    .from('destination_itineraries')
    .select('slug, name, hero_image, meta_description, recommended_days, category')
    .in('slug', slugs)
    .eq('published', true);

  if (error || !data) {
    console.error('Error fetching related itineraries:', error);
    return [];
  }

  return data as DestinationItinerarySummary[];
};

export const getAllPublishedItineraries = async (
  supabase: SupabaseClient
): Promise<DestinationItinerarySummary[]> => {
  const { data, error } = await supabase
    .from('destination_itineraries')
    .select('slug, name, hero_image, meta_description, recommended_days, category')
    .eq('published', true)
    .order('name');

  if (error || !data) {
    console.error('Error fetching all itineraries:', error);
    return [];
  }

  return data as DestinationItinerarySummary[];
};
