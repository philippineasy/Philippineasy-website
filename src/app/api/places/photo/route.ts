import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_BASE = 'https://places.googleapis.com/v1';

// Cache photos in memory (resets on deploy)
const photoCache = new Map<string, { url: string | null; expiry: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Cache CDN Vercel : le cache mémoire ne survit pas aux cold starts serverless.
// 24h + SWR (les photoUri Google expirent au bout de quelques jours — ne pas
// mettre s-maxage=7j sous peine de servir des URLs mortes).
const CDN_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
};

async function getPhotoName(query: string, lat?: string, lng?: string): Promise<string | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;

  // Use text search with the specific place name — this finds the actual place,
  // not just the most popular thing nearby (which causes duplicate photos)
  const textBody: Record<string, unknown> = {
    textQuery: query,
    maxResultCount: 1,
  };

  // Bias results toward the coordinates if available
  if (lat && lng) {
    textBody.locationBias = {
      circle: {
        center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        radius: 5000.0,
      },
    };
  }

  const res = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.photos',
    },
    body: JSON.stringify(textBody),
  });

  const data = await res.json();
  if (data.places?.[0]?.photos?.length) {
    return data.places[0].photos[0].name;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const name = searchParams.get('name');

  if (!lat && !lng && !name) {
    return NextResponse.json({ error: 'lat/lng or name required' }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ photoUrl: null });
  }

  const cacheKey = lat ? `${lat},${lng},${name || ''}` : `name:${name}`;
  const cached = photoCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json({ photoUrl: cached.url }, { headers: CDN_CACHE_HEADERS });
  }

  try {
    let photoName: string | null = null;

    // Strategy 1: Text search with exact name + location bias (best for specific places)
    if (name) {
      photoName = await getPhotoName(name, lat || undefined, lng || undefined);
    }

    // Strategy 2: If no name or no result, try coordinates-only nearby search (needs lat/lng)
    if (!photoName && lat && lng) {
      const searchBody = {
        locationRestriction: {
          circle: {
            center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
            radius: 200.0,
          },
        },
        maxResultCount: 1,
      };

      const searchRes = await fetch(`${PLACES_API_BASE}/places:searchNearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.photos',
        },
        body: JSON.stringify(searchBody),
      });

      const searchData = await searchRes.json();
      if (searchData.places?.[0]?.photos?.length) {
        photoName = searchData.places[0].photos[0].name;
      }
    }

    if (!photoName) {
      photoCache.set(cacheKey, { url: null, expiry: Date.now() + CACHE_TTL });
      return NextResponse.json({ photoUrl: null }, { headers: CDN_CACHE_HEADERS });
    }

    // Get photo URL
    const mediaRes = await fetch(
      `${PLACES_API_BASE}/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true&key=${GOOGLE_PLACES_API_KEY}`
    );
    const mediaData = await mediaRes.json();

    const photoUrl = mediaData.photoUri || null;
    photoCache.set(cacheKey, { url: photoUrl, expiry: Date.now() + CACHE_TTL });

    return NextResponse.json({ photoUrl }, { headers: CDN_CACHE_HEADERS });
  } catch (error) {
    console.error('Google Places API error:', error);
    photoCache.set(cacheKey, { url: null, expiry: Date.now() + 60000 });
    return NextResponse.json({ photoUrl: null });
  }
}
