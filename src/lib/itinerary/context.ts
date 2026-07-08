// ---------------------------------------------------------------------------
// Validation des entrées du formulaire + construction du contexte de voyage.
// Porté depuis le workflow n8n "Itinerary Generator V3" (nodes Valider les
// Entrees + Preparer le Contexte) lors du rapatriement de la génération
// dans Next.js (2026-07).
// ---------------------------------------------------------------------------
import type { TripContext, TripPreferences } from './types';

const TRAVEL_TYPES = ['solo', 'couple', 'famille', 'amis'] as const;
const DURATIONS = ['3-days', '1-week', '10-days', '2-weeks', '3-weeks', '1-month', 'more'] as const;
const BUDGETS = ['eco', 'standard', 'comfort', 'luxury'] as const;
const TRIP_STYLES = ['relax', 'adventure', 'culture', 'diving', 'mix'] as const;
const INTERESTS = ['beaches', 'snorkeling', 'hiking', 'culture', 'food', 'nightlife', 'surfing', 'offbeaten', 'local'] as const;

export const DAYS_BY_DURATION: Record<TripPreferences['duration'], number> = {
  '3-days': 4,
  '1-week': 7,
  '10-days': 10,
  '2-weeks': 14,
  '3-weeks': 21,
  '1-month': 30,
  'more': 35,
};

const TRAVEL_TYPE_LABELS: Record<TripPreferences['travelType'], string> = {
  solo: 'Voyageur solo',
  couple: 'En couple',
  famille: 'En famille',
  amis: 'Entre amis',
};

const BUDGET_LABELS: Record<TripPreferences['budget'], string> = {
  eco: 'Économique (moins de 800 EUR par personne hors vols internationaux)',
  standard: 'Standard (800 à 1500 EUR par personne hors vols internationaux)',
  comfort: 'Confort (1500 à 2500 EUR par personne hors vols internationaux)',
  luxury: 'Luxe (plus de 2500 EUR par personne hors vols internationaux)',
};

const BUDGET_PHP_PER_DAY: Record<TripPreferences['budget'], string> = {
  eco: '1500-3000 PHP par jour et par personne',
  standard: '3000-6000 PHP par jour et par personne',
  comfort: '6000-12000 PHP par jour et par personne',
  luxury: '12000+ PHP par jour et par personne',
};

const TRIP_STYLE_LABELS: Record<TripPreferences['tripStyle'], string> = {
  relax: 'Détente et plage',
  adventure: 'Aventure et nature',
  culture: 'Culture et histoire',
  diving: 'Plongée / Snorkeling',
  mix: 'Mix équilibré',
};

const INTEREST_LABELS: Record<string, string> = {
  beaches: 'Plages',
  snorkeling: 'Plongée / Snorkeling',
  hiking: 'Randonnée / Nature',
  culture: 'Culture / Histoire',
  food: 'Gastronomie',
  nightlife: 'Vie nocturne',
  surfing: 'Surf',
  offbeaten: 'Hors des sentiers battus',
  local: 'Rencontres locales',
};

// Destinations reconnues dans additionalInfo — multi-match (le n8n legacy
// s'arrêtait au premier match, « Cebu et Siargao » perdait Siargao).
const KNOWN_DESTINATIONS = [
  'palawan', 'el nido', 'coron', 'puerto princesa', 'port barton',
  'cebu', 'moalboal', 'oslob', 'malapascua', 'bantayan',
  'bohol', 'panglao', 'siargao', 'general luna', 'boracay',
  'manila', 'manille', 'davao', 'samal', 'talikud',
  'dumaguete', 'siquijor', 'apo island', 'camiguin', 'camotes',
  'la union', 'baler', 'vigan', 'banaue', 'sagada', 'batanes', 'batad',
  'donsol', 'legazpi', 'bicol', 'romblon', 'sibuyan', 'tablas',
];

export class InvalidPreferencesError extends Error {}

/** Valide et sanitize le body du formulaire. Throw InvalidPreferencesError si invalide. */
export function validatePreferences(body: Record<string, unknown>): TripPreferences {
  const travelType = String(body.travelType ?? '');
  const duration = String(body.duration ?? '');
  const budget = String(body.budget ?? '');
  const tripStyle = String(body.tripStyle ?? '');

  if (!(TRAVEL_TYPES as readonly string[]).includes(travelType)) {
    throw new InvalidPreferencesError('Type de voyage invalide');
  }
  if (!(DURATIONS as readonly string[]).includes(duration)) {
    throw new InvalidPreferencesError('Durée invalide');
  }
  if (!(BUDGETS as readonly string[]).includes(budget)) {
    throw new InvalidPreferencesError('Budget invalide');
  }
  if (!(TRIP_STYLES as readonly string[]).includes(tripStyle)) {
    throw new InvalidPreferencesError('Style de voyage invalide');
  }

  const interests = Array.isArray(body.interests)
    ? body.interests.filter((i): i is string => typeof i === 'string' && (INTERESTS as readonly string[]).includes(i)).slice(0, 3)
    : [];

  const additionalInfo = typeof body.additionalInfo === 'string'
    ? body.additionalInfo.trim().slice(0, 500)
    : '';

  return {
    travelType: travelType as TripPreferences['travelType'],
    duration: duration as TripPreferences['duration'],
    budget: budget as TripPreferences['budget'],
    tripStyle: tripStyle as TripPreferences['tripStyle'],
    interests,
    additionalInfo,
  };
}

export function buildTripContext(prefs: TripPreferences): TripContext {
  const infoLower = prefs.additionalInfo.toLowerCase();
  const destinations = KNOWN_DESTINATIONS.filter((d) => infoLower.includes(d));

  return {
    prefs,
    numberOfDays: DAYS_BY_DURATION[prefs.duration],
    travelTypeLabel: TRAVEL_TYPE_LABELS[prefs.travelType],
    budgetLabel: BUDGET_LABELS[prefs.budget],
    budgetPhpPerDay: BUDGET_PHP_PER_DAY[prefs.budget],
    tripStyleLabel: TRIP_STYLE_LABELS[prefs.tripStyle],
    interestsLabel: prefs.interests.map((i) => INTEREST_LABELS[i] || i).join(', ') || 'Non précisés',
    destinations,
  };
}

/** Reconstruit le contexte depuis les preferences stockées en DB (finalize). */
export function contextFromStoredPreferences(stored: Record<string, unknown>): TripContext {
  const prefs = validatePreferences(stored);
  return buildTripContext(prefs);
}
