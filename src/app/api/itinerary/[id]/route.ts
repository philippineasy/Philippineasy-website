import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

// Types pour les données brutes de la DB
interface RawActivity {
  time?: string;
  name: string;
  description?: string;
  coordinates?: { lat: number; lng: number };
}

interface RawMeal {
  restaurant?: string;
  dish?: string;
  cost?: string;
  coordinates?: { lat: number; lng: number };
}

interface RawAccommodation {
  name?: string;
  type?: string;
  cost?: string;
  coordinates?: { lat: number; lng: number };
}

interface RawTransport {
  method?: string;
  duration?: string;
  cost?: string;
  times?: string;
  from?: string;
  to?: string;
  coordinates?: { lat: number; lng: number };
}

interface RawDay {
  day: number;
  title?: string;
  location?: string;
  activities?: RawActivity[];
  meals?: {
    breakfast?: RawMeal | string;
    lunch?: RawMeal | string;
    dinner?: RawMeal | string;
  };
  accommodation?: RawAccommodation | string;
  transport?: RawTransport;
  // Structure alternative avec périodes (legacy)
  morning?: RawActivity;
  lunch?: RawActivity;
  afternoon?: RawActivity;
  dinner?: RawActivity;
}

interface RawVariant {
  variant: string;
  preview: {
    title: string;
    description: string;
    budget_estimate?: string;
    highlights?: string[];
  };
  full: {
    days: RawDay[];
    total_budget?: { total: string };
    tips?: string[];
  };
}

// Normalise un repas (string -> objet)
function normalizeMeal(meal: RawMeal | string | null | undefined): RawMeal | undefined {
  if (!meal) return undefined;
  if (typeof meal === 'string') {
    return { restaurant: meal };
  }
  return meal;
}

// Normalise un hébergement (string -> objet)
function normalizeAccommodation(accommodation: RawAccommodation | string | null | undefined): RawAccommodation | undefined {
  if (!accommodation) return undefined;
  if (typeof accommodation === 'string') {
    return { name: accommodation };
  }
  return accommodation;
}

// Interface pour les jours normalisés
interface NormalizedDay {
  day: number;
  title?: string;
  location?: string;
  activities?: RawActivity[];
  meals?: {
    breakfast?: RawMeal;
    lunch?: RawMeal;
    dinner?: RawMeal;
  };
  accommodation?: RawAccommodation;
  transport?: RawTransport;
}

// Normalise les jours pour avoir une structure uniforme
function normalizeDays(days: RawDay[]): NormalizedDay[] {
  return days.map(day => ({
    day: day.day,
    title: day.title,
    location: day.location,
    activities: day.activities,
    transport: day.transport,
    meals: day.meals ? {
      breakfast: normalizeMeal(day.meals.breakfast),
      lunch: normalizeMeal(day.meals.lunch),
      dinner: normalizeMeal(day.meals.dinner),
    } : undefined,
    accommodation: normalizeAccommodation(day.accommodation),
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    const supabase = await createClientForRouteHandler();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'itinéraire
    const { data: rawItinerary, error } = await supabase
      .from('itinerary_generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !rawItinerary) {
      return NextResponse.json(
        { error: 'Itinéraire non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est propriétaire
    if (rawItinerary.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier que le paiement est effectué
    if (rawItinerary.payment_status !== 'completed') {
      return NextResponse.json(
        { error: 'Paiement requis' },
        { status: 403 }
      );
    }

    // Vérifier si on a des données enrichies (delivered_itinerary)
    let deliveredData = null;
    if (rawItinerary.delivered_itinerary) {
      try {
        deliveredData = typeof rawItinerary.delivered_itinerary === 'string'
          ? JSON.parse(rawItinerary.delivered_itinerary)
          : rawItinerary.delivered_itinerary;
      } catch (e) {
        console.error('Error parsing delivered_itinerary:', e);
      }
    }

    // Si on a des données enrichies, les utiliser (avec normalisation)
    if (deliveredData && deliveredData.days && deliveredData.days.length > 0) {
      const itinerary = {
        id: rawItinerary.id,
        user_id: rawItinerary.user_id,
        preferences: rawItinerary.preferences,
        offer_type: rawItinerary.offer_type || 'express',
        modifications_remaining: rawItinerary.modifications_remaining ?? 0,
        payment_status: rawItinerary.payment_status,
        created_at: rawItinerary.created_at,
        delivered_at: rawItinerary.delivered_at,
        selected_variant: {
          name: rawItinerary.selected_variant || 'balanced',
          title: deliveredData.title || 'Mon Itinéraire',
          description: deliveredData.description || '',
          days: normalizeDays(deliveredData.days || []),
          tips: deliveredData.tips || [],
          total_budget: deliveredData.total_budget || 'N/A',
        },
      };
      return NextResponse.json({ itinerary });
    }

    // Sinon, parser les itinéraires de base (fallback)
    let variants: RawVariant[] = [];
    try {
      if (typeof rawItinerary.itineraries === 'string') {
        variants = JSON.parse(rawItinerary.itineraries);
      } else if (Array.isArray(rawItinerary.itineraries)) {
        variants = rawItinerary.itineraries;
      }
    } catch (e) {
      console.error('Error parsing itineraries:', e);
    }

    // Trouver la variante sélectionnée
    const selectedVariantName = rawItinerary.selected_variant || 'balanced';
    const selectedVariantData = variants.find(v => v.variant === selectedVariantName) || variants[0];

    // Construire l'objet itinéraire formaté (avec normalisation des données)
    const rawDays = selectedVariantData?.full?.days || [];
    const itinerary = {
      id: rawItinerary.id,
      user_id: rawItinerary.user_id,
      preferences: rawItinerary.preferences,
      offer_type: rawItinerary.offer_type || 'express',
      modifications_remaining: rawItinerary.modifications_remaining ?? 0,
      payment_status: rawItinerary.payment_status,
      created_at: rawItinerary.created_at,
      delivered_at: rawItinerary.delivered_at,
      // Données de la variante sélectionnée (normalisées)
      selected_variant: {
        name: selectedVariantName,
        title: selectedVariantData?.preview?.title || 'Mon Itinéraire',
        description: selectedVariantData?.preview?.description || '',
        days: normalizeDays(rawDays),
        tips: selectedVariantData?.full?.tips || [],
        total_budget: selectedVariantData?.full?.total_budget?.total || 'N/A',
      },
    };

    return NextResponse.json({ itinerary });

  } catch (error) {
    console.error('Get itinerary error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
