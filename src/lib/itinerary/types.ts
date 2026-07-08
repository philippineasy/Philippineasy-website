// ---------------------------------------------------------------------------
// Types partagés du pipeline itinéraire IA (previews-first).
// Le flux : generate (3 previews) -> paiement -> finalize (full du variant
// choisi, vérifié contre sa preview) -> enrichissement Places -> livraison.
// ---------------------------------------------------------------------------

export type VariantName = 'relax' | 'balanced' | 'adventure';

export interface Coordinates { lat: number; lng: number }

export interface ItineraryActivity {
  time?: string;
  name: string;
  description?: string;
  cost?: string;
  coordinates?: Coordinates | null;
  google_maps_url?: string;
  google_rating?: number;
}

export interface ItineraryMeal {
  restaurant?: string;
  dish?: string;
  cost?: string;
  coordinates?: Coordinates | null;
  google_maps_url?: string;
  google_rating?: number;
}

export interface ItineraryAccommodation {
  name?: string;
  type?: string;
  cost?: string;
  coordinates?: Coordinates | null;
  google_maps_url?: string;
  google_rating?: number;
}

export interface ItineraryTransport {
  method?: string;
  from?: string;
  to?: string;
  cost?: string;
  duration?: string;
}

export interface ItineraryDay {
  day: number;
  title?: string;
  location?: string;
  transport?: ItineraryTransport;
  activities?: ItineraryActivity[];
  meals?: {
    breakfast?: ItineraryMeal;
    lunch?: ItineraryMeal;
    dinner?: ItineraryMeal;
  };
  accommodation?: ItineraryAccommodation;
}

export interface ItineraryFull {
  title: string;
  description: string;
  days: ItineraryDay[];
  total_budget?: {
    accommodation?: string;
    activities?: string;
    food?: string;
    transport?: string;
    total?: string;
  };
  tips: string[];
}

/** Étape du parcours affichée en teaser (résumé une ligne). */
export interface TeaserDay { day: number; summary: string }

/** Plan de route jour par jour — contrat géographique entre preview et full. */
export interface RoutePlanStep { day: number; location: string }

export interface ItineraryPreview {
  title: string;
  description: string;
  budget_estimate: string;
  highlights: string[];
  teaser_days: TeaserDay[];
  /** Jour 1 complet, montré en clair comme échantillon de qualité. */
  sample_day?: ItineraryDay;
  /** Localisation de chaque jour — sert d'aperçu verrouillé et de contrat pour le full. */
  route_plan?: RoutePlanStep[];
}

export interface ItineraryVariant {
  variant: VariantName;
  preview: ItineraryPreview;
  /** Rempli uniquement après finalisation (variant sélectionné). */
  full?: ItineraryFull;
}

/** Préférences validées/sanitizées du formulaire. */
export interface TripPreferences {
  travelType: 'solo' | 'couple' | 'famille' | 'amis';
  duration: '3-days' | '1-week' | '10-days' | '2-weeks' | '3-weeks' | '1-month' | 'more';
  budget: 'eco' | 'standard' | 'comfort' | 'luxury';
  tripStyle: 'relax' | 'adventure' | 'culture' | 'diving' | 'mix';
  interests: string[];
  additionalInfo: string;
}

/** Contexte dérivé des préférences, injecté dans les prompts. */
export interface TripContext {
  prefs: TripPreferences;
  numberOfDays: number;
  travelTypeLabel: string;
  budgetLabel: string;
  budgetPhpPerDay: string;
  tripStyleLabel: string;
  interestsLabel: string;
  destinations: string[];
}

export interface ConsistencyVerdict {
  consistent: boolean;
  issues: string[];
}
