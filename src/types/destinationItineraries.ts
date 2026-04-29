export interface ItineraryActivity {
  name: string;
  description: string;
  duration?: string;
  cost?: string;
  image?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
  transport?: string;
  accommodation?: string;
  meals?: string;
}

export interface FAQEntry {
  question: string;
  answer: string;
}

export type DestinationCategory = 'destination' | 'duration' | 'profile';

export interface DestinationItinerary {
  id: string;
  slug: string;
  name: string;
  hero_image: string | null;
  hero_image_alt: string | null;
  meta_title: string;
  meta_description: string;
  intro_text: string;
  recommended_days: number | null;
  best_season: string | null;
  how_to_get_there: string | null;
  budget_backpacker: number | null;
  budget_midrange: number | null;
  budget_luxury: number | null;
  itinerary: ItineraryDay[];
  faq: FAQEntry[];
  related_destinations: string[];
  practical_tips: string[];
  category: DestinationCategory;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DestinationItinerarySummary {
  slug: string;
  name: string;
  hero_image: string | null;
  meta_description: string;
  recommended_days: number | null;
  category: DestinationCategory;
}
