import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_BASE = 'https://places.googleapis.com/v1';

// ========== Types ==========

interface Coordinates { lat: number; lng: number; }

interface RawActivity {
  time?: string; name: string; description?: string; cost?: string;
  coordinates?: Coordinates; google_maps_url?: string; google_rating?: number;
}

interface RawMeal {
  restaurant?: string; dish?: string; cost?: string;
  coordinates?: Coordinates; google_maps_url?: string; google_rating?: number;
}

interface RawAccommodation {
  name?: string; type?: string; cost?: string;
  coordinates?: Coordinates; google_maps_url?: string; google_rating?: number;
}

interface RawTransport {
  method?: string; duration?: string; cost?: string; times?: string;
  from?: string; to?: string; coordinates?: Coordinates;
}

interface RawDay {
  day: number; title?: string; location?: string;
  activities?: RawActivity[];
  meals?: { breakfast?: RawMeal | string; lunch?: RawMeal | string; dinner?: RawMeal | string; };
  accommodation?: RawAccommodation | string;
  transport?: RawTransport;
}

interface RawVariant {
  variant: string;
  preview: { title: string; description: string; budget_estimate?: string; highlights?: string[]; };
  full: { days: RawDay[]; total_budget?: { total: string }; tips?: string[]; title?: string; description?: string; };
}

// ========== Normalize ==========

function normalizeMeal(meal: RawMeal | string | null | undefined): RawMeal | undefined {
  if (!meal) return undefined;
  if (typeof meal === 'string') return { restaurant: meal };
  return meal;
}

function normalizeAccommodation(acc: RawAccommodation | string | null | undefined): RawAccommodation | undefined {
  if (!acc) return undefined;
  if (typeof acc === 'string') return { name: acc };
  return acc;
}

function normalizeDays(days: RawDay[]) {
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

// ========== Google Places Enrichment ==========

async function searchPlace(name: string, locationHint?: string): Promise<{
  coordinates: Coordinates; rating: number | null; google_maps_url: string;
} | null> {
  if (!PLACES_API_KEY || !name || name === 'N/A') return null;

  try {
    const query = `${name} ${locationHint || ''} Philippines`;
    const res = await fetch(`${PLACES_API_BASE}/places:searchText`, {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.location,places.rating,places.googleMapsUri',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
    });
    const data = await res.json();
    const place = data.places?.[0];
    if (!place?.location) return null;

    const lat = place.location.latitude;
    const lng = place.location.longitude;
    if (lat < 4.5 || lat > 21.5 || lng < 116 || lng > 127) return null; // Not Philippines

    return {
      coordinates: { lat, lng },
      rating: place.rating || null,
      google_maps_url: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    };
  } catch {
    return null;
  }
}

async function enrichDays(days: ReturnType<typeof normalizeDays>): Promise<{ enriched: typeof days; count: number }> {
  let count = 0;
  const MAX = 25; // Max API calls per enrichment

  for (const day of days) {
    const loc = day.location || '';

    // Enrich activities
    for (const act of (day.activities || [])) {
      if (count >= MAX) break;
      if (act.coordinates?.lat) continue; // Already has coords
      const result = await searchPlace(act.name, loc);
      if (result) {
        act.coordinates = result.coordinates;
        act.google_maps_url = result.google_maps_url;
        act.google_rating = result.rating ?? undefined;
        count++;
      }
    }

    // Enrich meals
    for (const mt of ['breakfast', 'lunch', 'dinner'] as const) {
      if (count >= MAX) break;
      const meal = day.meals?.[mt];
      if (!meal?.restaurant || meal.coordinates?.lat) continue;
      const result = await searchPlace(meal.restaurant, loc);
      if (result) {
        meal.coordinates = result.coordinates;
        meal.google_maps_url = result.google_maps_url;
        meal.google_rating = result.rating ?? undefined;
        count++;
      }
    }

    // Enrich accommodation
    if (count < MAX && day.accommodation?.name && !day.accommodation.coordinates?.lat) {
      const result = await searchPlace(day.accommodation.name, loc);
      if (result) {
        day.accommodation.coordinates = result.coordinates;
        day.accommodation.google_maps_url = result.google_maps_url;
        day.accommodation.google_rating = result.rating ?? undefined;
        count++;
      }
    }
  }

  return { enriched: days, count };
}

// ========== Main Handler ==========

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    const supabase = await createClientForRouteHandler();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });

    const { data: rawItinerary, error } = await supabase
      .from('itinerary_generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !rawItinerary) return NextResponse.json({ error: 'Itineraire non trouve' }, { status: 404 });
    if (rawItinerary.user_id !== user.id) return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    if (rawItinerary.payment_status !== 'completed') return NextResponse.json({ error: 'Paiement requis' }, { status: 403 });

    // Try delivered_itinerary first (already enriched)
    let deliveredData = null;
    if (rawItinerary.delivered_itinerary) {
      try {
        deliveredData = typeof rawItinerary.delivered_itinerary === 'string'
          ? JSON.parse(rawItinerary.delivered_itinerary) : rawItinerary.delivered_itinerary;
      } catch { /* ignore */ }
    }

    if (deliveredData?.days?.length > 0) {
      return NextResponse.json({
        itinerary: {
          id: rawItinerary.id, user_id: rawItinerary.user_id,
          preferences: rawItinerary.preferences,
          offer_type: rawItinerary.offer_type || 'express',
          modifications_remaining: rawItinerary.modifications_remaining ?? 0,
          payment_status: rawItinerary.payment_status,
          created_at: rawItinerary.created_at, delivered_at: rawItinerary.delivered_at,
          selected_variant: {
            name: rawItinerary.selected_variant || 'balanced',
            title: deliveredData.title || 'Mon Itineraire',
            description: deliveredData.description || '',
            days: normalizeDays(deliveredData.days),
            tips: deliveredData.tips || [],
            total_budget: deliveredData.total_budget || 'N/A',
          },
        },
      });
    }

    // Parse itineraries
    let variants: RawVariant[] = [];
    try {
      variants = typeof rawItinerary.itineraries === 'string'
        ? JSON.parse(rawItinerary.itineraries) : (rawItinerary.itineraries || []);
    } catch { /* ignore */ }

    const selectedName = rawItinerary.selected_variant || 'balanced';
    const variant = variants.find(v => v.variant === selectedName) || variants[0];
    if (!variant) return NextResponse.json({ error: 'Variant non trouve' }, { status: 404 });

    let days = normalizeDays(variant.full?.days || []);

    // Check if enrichment is needed (no coordinates on any activity)
    const hasCoords = days.some(d =>
      d.activities?.some(a => a.coordinates?.lat) ||
      d.accommodation?.coordinates?.lat
    );

    if (!hasCoords && PLACES_API_KEY) {
      // Enrich with Google Places coordinates, ratings, URLs
      const { enriched, count } = await enrichDays(days);
      days = enriched;

      if (count > 0) {
        // Save enriched data back to Supabase (one-time enrichment)
        const enrichedVariant = {
          name: selectedName,
          title: variant.preview?.title || variant.full?.title || 'Mon Itineraire',
          description: variant.preview?.description || variant.full?.description || '',
          days,
          tips: variant.full?.tips || [],
          total_budget: variant.full?.total_budget?.total || variant.preview?.budget_estimate || 'N/A',
        };

        await supabase
          .from('itinerary_generations')
          .update({ delivered_itinerary: enrichedVariant })
          .eq('id', id);
      }
    }

    return NextResponse.json({
      itinerary: {
        id: rawItinerary.id, user_id: rawItinerary.user_id,
        preferences: rawItinerary.preferences,
        offer_type: rawItinerary.offer_type || 'express',
        modifications_remaining: rawItinerary.modifications_remaining ?? 0,
        payment_status: rawItinerary.payment_status,
        created_at: rawItinerary.created_at, delivered_at: rawItinerary.delivered_at,
        selected_variant: {
          name: selectedName,
          title: variant.preview?.title || variant.full?.title || 'Mon Itineraire',
          description: variant.preview?.description || variant.full?.description || '',
          days,
          tips: variant.full?.tips || [],
          total_budget: variant.full?.total_budget?.total || variant.preview?.budget_estimate || 'N/A',
        },
      },
    });

  } catch (error) {
    console.error('Get itinerary error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
