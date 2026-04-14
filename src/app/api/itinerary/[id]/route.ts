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

// Reference coordinates for major Philippine destinations
// coords + radius in km (small islands get small radius to avoid cross-island errors)
const LOCATION_DB: Record<string, { lat: number; lng: number; radius: number }> = {
  'davao': { lat: 7.1907, lng: 125.4553, radius: 30 },
  'davao city': { lat: 7.1907, lng: 125.4553, radius: 30 },
  'samal': { lat: 7.1000, lng: 125.7200, radius: 15 },
  'samal island': { lat: 7.1000, lng: 125.7200, radius: 15 },
  'talikud': { lat: 6.9500, lng: 125.7300, radius: 8 },
  'talikud island': { lat: 6.9500, lng: 125.7300, radius: 8 },
  'ligid': { lat: 6.9200, lng: 125.7500, radius: 5 },
  'ligid island': { lat: 6.9200, lng: 125.7500, radius: 5 },
  'el nido': { lat: 11.1784, lng: 119.3930, radius: 25 },
  'coron': { lat: 11.9986, lng: 120.2043, radius: 25 },
  'cebu': { lat: 10.3157, lng: 123.8854, radius: 40 },
  'cebu city': { lat: 10.3157, lng: 123.8854, radius: 20 },
  'bohol': { lat: 9.8500, lng: 124.1435, radius: 40 },
  'siargao': { lat: 9.8489, lng: 126.0458, radius: 25 },
  'boracay': { lat: 11.9674, lng: 121.9248, radius: 8 },
  'manila': { lat: 14.5995, lng: 120.9842, radius: 30 },
  'palawan': { lat: 9.8349, lng: 118.7384, radius: 80 },
  'panglao': { lat: 9.5742, lng: 123.7621, radius: 10 },
  'general luna': { lat: 9.7900, lng: 126.1170, radius: 15 },
  'dumaguete': { lat: 9.3068, lng: 123.3054, radius: 20 },
  'moalboal': { lat: 9.9422, lng: 123.3952, radius: 15 },
  'puerto princesa': { lat: 9.7392, lng: 118.7353, radius: 30 },
  'oslob': { lat: 9.4692, lng: 123.3803, radius: 15 },
  'camiguin': { lat: 9.1733, lng: 124.7292, radius: 15 },
  'batanes': { lat: 20.4487, lng: 121.9710, radius: 20 },
};

function haversine(c1: Coordinates, c2: Coordinates): number {
  const R = 6371;
  const dLat = (c2.lat - c1.lat) * Math.PI / 180;
  const dLng = (c2.lng - c1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getLocationRef(location: string): { lat: number; lng: number; radius: number } | null {
  const key = location.toLowerCase().trim();
  return LOCATION_DB[key] || null;
}

async function searchPlace(name: string, locationHint?: string, locationRef?: { lat: number; lng: number; radius: number } | null): Promise<{
  coordinates: Coordinates; rating: number | null; google_maps_url: string;
} | null> {
  if (!PLACES_API_KEY || !name || name === 'N/A') return null;

  try {
    const textBody: Record<string, unknown> = {
      textQuery: `${name} ${locationHint || ''} Philippines`,
      maxResultCount: 1,
    };

    // Bias toward the day's location if known
    if (locationRef) {
      textBody.locationBias = {
        circle: { center: { latitude: locationRef.lat, longitude: locationRef.lng }, radius: locationRef.radius * 1000 },
      };
    }

    const res = await fetch(`${PLACES_API_BASE}/places:searchText`, {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.location,places.rating,places.googleMapsUri,places.formattedAddress',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(textBody),
    });
    const data = await res.json();
    const place = data.places?.[0];
    if (!place?.location) return null;

    const lat = place.location.latitude;
    const lng = place.location.longitude;
    if (lat < 4.5 || lat > 21.5 || lng < 116 || lng > 127) return null;

    // Validate: reject results outside the destination's radius
    if (locationRef) {
      const dist = haversine({ lat, lng }, locationRef);
      if (dist > locationRef.radius) return null;
    }

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
  const MAX = 50; // Enough for 10 days × 5 places

  for (const day of days) {
    const loc = day.location || '';
    const locRef = getLocationRef(loc);

    // Enrich activities
    for (const act of (day.activities || [])) {
      if (count >= MAX) break;
      if (act.coordinates?.lat) {
        // Validate existing coords against location
        if (locRef && haversine(act.coordinates, locRef) > locRef.radius) {
          // Bad coords — re-search
          const result = await searchPlace(act.name, loc, locRef);
          if (result) { act.coordinates = result.coordinates; act.google_maps_url = result.google_maps_url; act.google_rating = result.rating ?? undefined; count++; }
        }
        continue;
      }
      const result = await searchPlace(act.name, loc, locRef);
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
      if (!meal?.restaurant) continue;
      if (meal.coordinates?.lat) {
        if (locRef && haversine(meal.coordinates, locRef) > locRef.radius) {
          const result = await searchPlace(meal.restaurant, loc, locRef);
          if (result) { meal.coordinates = result.coordinates; meal.google_maps_url = result.google_maps_url; meal.google_rating = result.rating ?? undefined; count++; }
        }
        continue;
      }
      const result = await searchPlace(meal.restaurant, loc, locRef);
      if (result) {
        meal.coordinates = result.coordinates;
        meal.google_maps_url = result.google_maps_url;
        meal.google_rating = result.rating ?? undefined;
        count++;
      }
    }

    // Enrich accommodation
    if (count < MAX && day.accommodation?.name && day.accommodation.name !== 'N/A') {
      if (!day.accommodation.coordinates?.lat) {
        const result = await searchPlace(day.accommodation.name, loc, locRef);
        if (result) {
          day.accommodation.coordinates = result.coordinates;
          day.accommodation.google_maps_url = result.google_maps_url;
          day.accommodation.google_rating = result.rating ?? undefined;
          count++;
        }
      } else if (locRef && haversine(day.accommodation.coordinates, locRef) > locRef.radius) {
        const result = await searchPlace(day.accommodation.name, loc, locRef);
        if (result) {
          day.accommodation.coordinates = result.coordinates;
          day.accommodation.google_maps_url = result.google_maps_url;
          day.accommodation.google_rating = result.rating ?? undefined;
          count++;
        }
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
