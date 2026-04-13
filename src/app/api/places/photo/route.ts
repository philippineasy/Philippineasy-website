import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_BASE = 'https://places.googleapis.com/v1';

// Cache photos in memory (resets on deploy)
const photoCache = new Map<string, { url: string | null; expiry: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const name = searchParams.get('name');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ photoUrl: null });
  }

  const cacheKey = `${lat},${lng},${name || ''}`;
  const cached = photoCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json({ photoUrl: cached.url });
  }

  try {
    // Step 1: Find nearby place using Places API (New) - Nearby Search
    const searchBody = {
      locationRestriction: {
        circle: {
          center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
          radius: 1000.0,
        },
      },
      maxResultCount: 5,
    };

    const searchRes = await fetch(`${PLACES_API_BASE}/places:searchNearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.photos',
      },
      body: JSON.stringify(searchBody),
    });

    const searchData = await searchRes.json();

    // Find first place with photos
    let photoName: string | null = null;

    if (searchData.places?.length) {
      for (const place of searchData.places) {
        if (place.photos?.length) {
          photoName = place.photos[0].name;
          break;
        }
      }
    }

    // Step 1b: Fallback — text search with name if no nearby results
    if (!photoName && name) {
      const textBody = { textQuery: `${name} Philippines` };
      const textRes = await fetch(`${PLACES_API_BASE}/places:searchText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.photos',
        },
        body: JSON.stringify(textBody),
      });
      const textData = await textRes.json();

      if (textData.places?.length) {
        for (const place of textData.places) {
          if (place.photos?.length) {
            photoName = place.photos[0].name;
            break;
          }
        }
      }
    }

    if (!photoName) {
      photoCache.set(cacheKey, { url: null, expiry: Date.now() + CACHE_TTL });
      return NextResponse.json({ photoUrl: null });
    }

    // Step 2: Get photo URL via media endpoint
    const mediaRes = await fetch(
      `${PLACES_API_BASE}/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true&key=${GOOGLE_PLACES_API_KEY}`
    );
    const mediaData = await mediaRes.json();

    const photoUrl = mediaData.photoUri || null;
    photoCache.set(cacheKey, { url: photoUrl, expiry: Date.now() + CACHE_TTL });

    return NextResponse.json({ photoUrl });
  } catch (error) {
    console.error('Google Places API error:', error);
    photoCache.set(cacheKey, { url: null, expiry: Date.now() + 60000 }); // cache errors 1min
    return NextResponse.json({ photoUrl: null });
  }
}
