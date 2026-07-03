// Prix de vol EN DIRECT pour le bandeau (Paris → Manille), via l'API Data de
// Travelpayouts / Aviasales (get_latest_prices) : vraies données issues des
// recherches Aviasales, gratuites avec le compte affilié. Aucune donnée codée
// en dur : si le token manque ou que l'API échoue, on renvoie null et le
// bandeau masque simplement l'item (jamais de prix figé/mensonger).
//
// Config (Vercel env) — depuis le dashboard Travelpayouts → section API/Token :
//   TRAVELPAYOUTS_TOKEN   (obligatoire — le token API, secret)
//   TRAVELPAYOUTS_MARKER  (optionnel — l'ID partenaire public, ex. 545868)

const ORIGIN = 'PAR'; // Paris (tous aéroports)
const DESTINATION = 'MNL'; // Manille

/**
 * Prix le moins cher (aller simple indicatif) Paris → Manille en euros
 * arrondis. null si indisponible (token absent, API en échec, aucun prix).
 */
export async function getCheapestFlightPrice(): Promise<number | null> {
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
  if (process.env.TRAVELPAYOUTS_MARKER) {
    params.set('marker', process.env.TRAVELPAYOUTS_MARKER);
  }

  try {
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/get_latest_prices?${params}`,
      {
        headers: { 'X-Access-Token': token },
        next: { revalidate: 21600 }, // 6 h — ~4 appels/jour
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.success || !Array.isArray(data.data)) return null;

    const prices = data.data
      .map((o: unknown) => {
        const v = (o as { value?: number; price?: number })?.value ?? (o as { price?: number })?.price;
        return typeof v === 'number' && Number.isFinite(v) ? v : null;
      })
      .filter((n: number | null): n is number => n !== null);

    if (prices.length === 0) return null;
    return Math.round(Math.min(...prices));
  } catch {
    return null;
  }
}
