import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Cache photos in memory to avoid repeated API calls (resets on deploy)
const photoCache = new Map<string, { url: string; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const name = searchParams.get('name');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 500 });
  }

  const cacheKey = `${lat},${lng},${name || ''}`;
  const cached = photoCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json({ photoUrl: cached.url });
  }

  try {
    // Find nearby place using coordinates + optional name
    const query = name ? encodeURIComponent(name) : '';
    const findUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&keyword=${query}&key=${GOOGLE_PLACES_API_KEY}`;

    const findRes = await fetch(findUrl);
    const findData = await findRes.json();

    if (!findData.results?.length) {
      // Fallback: try text search with name
      if (name) {
        const textUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(name + ' Philippines')}&location=${lat},${lng}&radius=5000&key=${GOOGLE_PLACES_API_KEY}`;
        const textRes = await fetch(textUrl);
        const textData = await textRes.json();

        if (!textData.results?.length || !textData.results[0].photos?.length) {
          return NextResponse.json({ photoUrl: null });
        }

        const photoRef = textData.results[0].photos[0].photo_reference;
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_PLACES_API_KEY}`;

        photoCache.set(cacheKey, { url: photoUrl, expiry: Date.now() + CACHE_TTL });
        return NextResponse.json({ photoUrl });
      }
      return NextResponse.json({ photoUrl: null });
    }

    // Get photo from first result that has photos
    const placeWithPhoto = findData.results.find((r: { photos?: { photo_reference: string }[] }) => r.photos?.length);
    if (!placeWithPhoto) {
      return NextResponse.json({ photoUrl: null });
    }

    const photoRef = placeWithPhoto.photos[0].photo_reference;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_PLACES_API_KEY}`;

    photoCache.set(cacheKey, { url: photoUrl, expiry: Date.now() + CACHE_TTL });
    return NextResponse.json({ photoUrl });
  } catch (error) {
    console.error('Google Places API error:', error);
    return NextResponse.json({ photoUrl: null });
  }
}
