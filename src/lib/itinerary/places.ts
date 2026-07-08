// ---------------------------------------------------------------------------
// Enrichissement Google Places (coordonnées, notes, liens Maps) des jours
// d'itinéraire. Extrait de /api/itinerary/[id]/route.ts pour être partagé
// avec le pipeline finalize (enrichissement AVANT livraison désormais).
// ---------------------------------------------------------------------------
import type { Coordinates, ItineraryDay } from './types';

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_BASE = 'https://places.googleapis.com/v1';

// Coordonnées de référence des destinations majeures — rayon en km
// (petit rayon pour les petites îles, évite les erreurs inter-îles).
export const LOCATION_DB: Record<string, { lat: number; lng: number; radius: number }> = {
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

export function getLocationRef(location: string): { lat: number; lng: number; radius: number } | null {
  const key = location.toLowerCase().trim();
  return LOCATION_DB[key] || null;
}

export async function searchPlace(
  name: string,
  locationHint?: string,
  locationRef?: { lat: number; lng: number; radius: number } | null,
): Promise<{ coordinates: Coordinates; rating: number | null; google_maps_url: string } | null> {
  if (!PLACES_API_KEY || !name || name === 'N/A') return null;

  try {
    const textBody: Record<string, unknown> = {
      textQuery: `${name} ${locationHint || ''} Philippines`,
      maxResultCount: 1,
    };
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
    // Bounding box Philippines
    if (lat < 4.5 || lat > 21.5 || lng < 116 || lng > 127) return null;
    // Rejette les résultats hors du rayon de la destination du jour
    if (locationRef && haversine({ lat, lng }, locationRef) > locationRef.radius) return null;

    return {
      coordinates: { lat, lng },
      rating: place.rating || null,
      google_maps_url: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    };
  } catch {
    return null;
  }
}

/** Recherche la photo d'un lieu (URL directe) via Places API v1. */
export async function fetchPlacePhoto(
  name: string,
  location?: string,
  maxWidthPx = 800,
): Promise<string | null> {
  if (!PLACES_API_KEY || !name || name === 'N/A') return null;
  try {
    const searchRes = await fetch(`${PLACES_API_BASE}/places:searchText`, {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.photos',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textQuery: `${name} ${location || ''} Philippines`, maxResultCount: 1 }),
    });
    const searchData = await searchRes.json();
    const photoName = searchData.places?.[0]?.photos?.[0]?.name;
    if (!photoName) return null;

    const mediaRes = await fetch(
      `${PLACES_API_BASE}/${photoName}/media?maxWidthPx=${maxWidthPx}&skipHttpRedirect=true`,
      { headers: { 'X-Goog-Api-Key': PLACES_API_KEY } },
    );
    const mediaData = await mediaRes.json();
    return mediaData.photoUri || null;
  } catch {
    return null;
  }
}

/**
 * Enrichit les jours avec coordonnées/notes/liens Maps (mutation in place).
 * Valide aussi les coordonnées existantes contre la destination du jour.
 */
export async function enrichDays(
  days: ItineraryDay[],
  maxLookups = 60,
): Promise<{ enriched: ItineraryDay[]; count: number }> {
  let count = 0;

  for (const day of days) {
    const loc = day.location || '';
    const locRef = getLocationRef(loc);

    for (const act of (day.activities || [])) {
      if (count >= maxLookups) break;
      if (act.coordinates?.lat) {
        if (locRef && haversine(act.coordinates, locRef) > locRef.radius) {
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

    for (const mt of ['breakfast', 'lunch', 'dinner'] as const) {
      if (count >= maxLookups) break;
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

    if (count < maxLookups && day.accommodation?.name && day.accommodation.name !== 'N/A') {
      const acc = day.accommodation;
      const needsSearch = !acc.coordinates?.lat ||
        (locRef && acc.coordinates && haversine(acc.coordinates, locRef) > locRef.radius);
      if (needsSearch) {
        const result = await searchPlace(acc.name!, loc, locRef);
        if (result) {
          acc.coordinates = result.coordinates;
          acc.google_maps_url = result.google_maps_url;
          acc.google_rating = result.rating ?? undefined;
          count++;
        }
      }
    }
  }

  return { enriched: days, count };
}
