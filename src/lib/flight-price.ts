// Prix de vol EN DIRECT pour le bandeau (Paris → Manille).
// Deux sources possibles, dans l'ordre de préférence :
//   1. Amadeus (API de pure donnée — RECOMMANDÉ : gratuit sans carte, aucun
//      script ni lien réécrit, zéro impact sur les affiliations du site).
//        AMADEUS_API_KEY, AMADEUS_API_SECRET
//        AMADEUS_HOSTNAME (optionnel : 'test.api.amadeus.com' défaut / 'api.amadeus.com')
//   2. Travelpayouts / Aviasales (get_latest_prices).
//        TRAVELPAYOUTS_TOKEN (+ TRAVELPAYOUTS_MARKER optionnel)
//
// Aucune donnée codée en dur : si aucune source n'est configurée ou qu'elles
// échouent, on renvoie null et le bandeau masque l'item (jamais de prix figé).

const ORIGIN = 'PAR'; // Paris (tous aéroports)
const DESTINATION = 'MNL'; // Manille

function departureDatePlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function fromAmadeus(): Promise<number | null> {
  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;
  if (!key || !secret) return null;
  const host = process.env.AMADEUS_HOSTNAME || 'test.api.amadeus.com';

  try {
    const tokenRes = await fetch(`https://${host}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: key,
        client_secret: secret,
      }),
      next: { revalidate: 1500 },
    });
    if (!tokenRes.ok) return null;
    const token = (await tokenRes.json())?.access_token;
    if (typeof token !== 'string') return null;

    const params = new URLSearchParams({
      originLocationCode: ORIGIN,
      destinationLocationCode: DESTINATION,
      departureDate: departureDatePlus(35),
      adults: '1',
      currencyCode: 'EUR',
      max: '5',
      nonStop: 'false',
    });
    const res = await fetch(`https://${host}/v2/shopping/flight-offers?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return null;
    const offers: unknown[] = (await res.json())?.data ?? [];
    const prices = offers
      .map((o) => Number((o as { price?: { grandTotal?: string } })?.price?.grandTotal))
      .filter((n) => Number.isFinite(n));
    return prices.length ? Math.round(Math.min(...prices)) : null;
  } catch {
    return null;
  }
}

async function fromTravelpayouts(): Promise<number | null> {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) return null;

  const params = new URLSearchParams({
    origin: ORIGIN,
    destination: DESTINATION,
    currency: 'eur',
    one_way: 'true',
    sorting: 'price',
    limit: '5',
    page: '1',
    period_type: 'year',
  });
  if (process.env.TRAVELPAYOUTS_MARKER) params.set('marker', process.env.TRAVELPAYOUTS_MARKER);

  try {
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/get_latest_prices?${params}`,
      { headers: { 'X-Access-Token': token }, next: { revalidate: 21600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.success || !Array.isArray(data.data)) return null;
    const prices = data.data
      .map((o: { value?: number; price?: number }) => o?.value ?? o?.price)
      .filter((n: unknown): n is number => typeof n === 'number' && Number.isFinite(n));
    return prices.length ? Math.round(Math.min(...prices)) : null;
  } catch {
    return null;
  }
}

/**
 * Prix le moins cher (aller simple indicatif) Paris → Manille en euros
 * arrondis. null si aucune source configurée/disponible.
 */
export async function getCheapestFlightPrice(): Promise<number | null> {
  return (await fromAmadeus()) ?? (await fromTravelpayouts());
}
