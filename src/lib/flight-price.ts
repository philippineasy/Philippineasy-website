// Prix de vol EN DIRECT pour le bandeau (Paris → Manille), via l'API officielle
// Amadeus Self-Service (gratuite, ~2000 appels/mois — le ticker en consomme ~4/jour
// grâce au cache 6 h). Aucune donnée codée en dur : si les clés manquent ou que
// l'API échoue, on renvoie null et le bandeau masque simplement l'item (jamais de
// prix figé/mensonger).
//
// Config requise (Vercel env) — clé gratuite créée sur developers.amadeus.com :
//   AMADEUS_API_KEY, AMADEUS_API_SECRET
//   AMADEUS_HOSTNAME (optionnel) : 'test.api.amadeus.com' (défaut, clé gratuite)
//                                   ou 'api.amadeus.com' (clé production).

const ORIGIN = 'PAR'; // Paris (tous aéroports)
const DESTINATION = 'MNL'; // Manille

async function getAmadeusToken(host: string): Promise<string | null> {
  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;
  if (!key || !secret) return null;

  try {
    const res = await fetch(`https://${host}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: key,
        client_secret: secret,
      }),
      // Le token Amadeus vit ~30 min : on le met en cache 25 min.
      next: { revalidate: 1500 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.access_token === 'string' ? data.access_token : null;
  } catch {
    return null;
  }
}

/**
 * Prix le moins cher (aller simple indicatif) Paris → Manille pour un départ
 * ~5 semaines plus tard, en euros arrondis. null si indisponible.
 */
export async function getCheapestFlightPrice(): Promise<number | null> {
  const host = process.env.AMADEUS_HOSTNAME || 'test.api.amadeus.com';
  const token = await getAmadeusToken(host);
  if (!token) return null;

  // Départ à J+35 (une date future stable, recalculée à chaque revalidation).
  const departure = new Date();
  departure.setDate(departure.getDate() + 35);
  const departureDate = departure.toISOString().slice(0, 10);

  const params = new URLSearchParams({
    originLocationCode: ORIGIN,
    destinationLocationCode: DESTINATION,
    departureDate,
    adults: '1',
    currencyCode: 'EUR',
    max: '5',
    nonStop: 'false',
  });

  try {
    const res = await fetch(`https://${host}/v2/shopping/flight-offers?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 21600 }, // 6 h
    });
    if (!res.ok) return null;
    const data = await res.json();
    const offers: unknown[] = Array.isArray(data?.data) ? data.data : [];

    const prices = offers
      .map((o) => {
        const total = (o as { price?: { grandTotal?: string } })?.price?.grandTotal;
        const n = total ? Number(total) : NaN;
        return Number.isFinite(n) ? n : null;
      })
      .filter((n): n is number => n !== null);

    if (prices.length === 0) return null;
    return Math.round(Math.min(...prices));
  } catch {
    return null;
  }
}
