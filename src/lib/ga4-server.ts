/**
 * GA4 Measurement Protocol — server-side event tracking.
 *
 * Bypass adblockers + iOS ITP qui bloquent ~30-50% des events client-side gtag().
 * Garantit que les conversions arrivent bien dans GA4 -> Google Ads bidding.
 *
 * Setup :
 * - GA4_API_SECRET : Mesurement Protocol secret cree via Admin API (Vercel env)
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID : G-9STRBLZQXW (deja en env)
 *
 * Doc : https://developers.google.com/analytics/devguides/collection/protocol/ga4
 */

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA4_API_SECRET = process.env.GA4_API_SECRET;
const GA4_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

interface GA4Event {
  name: string;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Extrait le client_id depuis le cookie _ga (set par gtag.js cote client).
 * Format cookie : "GA1.1.<client_id>.<timestamp>" ou "GA1.2.<client_id>.<timestamp>"
 *
 * Si pas de cookie, fallback sur UUID stable per session (server-side fingerprint).
 */
export function extractClientId(cookieHeader: string | null): string {
  if (cookieHeader) {
    const match = cookieHeader.match(/_ga=GA[12]\.[12]\.([^;]+)/);
    if (match && match[1]) {
      // Format : "<client_id>.<timestamp>" -> on prend juste le client_id
      const parts = match[1].split('.');
      if (parts.length >= 2) {
        return `${parts[0]}.${parts[1]}`;
      }
      return match[1];
    }
  }
  // Fallback : UUID v4 (pas ideal, mais mieux que rien — l'event arrive)
  return `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Envoie un event a GA4 via Measurement Protocol.
 * Non-bloquant : log en cas d'erreur mais ne throw pas.
 */
export async function trackServerEvent(
  clientId: string,
  event: GA4Event,
  userId?: string,
): Promise<void> {
  if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ga4-server] GA4_API_SECRET ou NEXT_PUBLIC_GA_MEASUREMENT_ID manquant — event skip:', event.name);
    }
    return;
  }

  const payload: Record<string, unknown> = {
    client_id: clientId,
    events: [
      {
        name: event.name,
        params: event.params || {},
      },
    ],
  };

  if (userId) {
    payload.user_id = userId;
  }

  const url = `${GA4_ENDPOINT}?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // GA4 MP retourne 204 si OK, 400/500 si payload invalide
      const text = await res.text().catch(() => '');
      console.error(`[ga4-server] event ${event.name} failed: ${res.status} ${text.slice(0, 200)}`);
    } else if (process.env.NODE_ENV !== 'production') {
      console.log(`[ga4-server] event ${event.name} sent (client_id=${clientId.slice(0, 12)}...)`);
    }
  } catch (err) {
    console.error(`[ga4-server] event ${event.name} threw:`, err);
  }
}

/**
 * Helper specifique purchase (event ecommerce GA4 standard).
 * Utilise le format ecommerce attendu par GA4 + Google Ads.
 */
export async function trackServerPurchase(params: {
  clientId: string;
  userId?: string;
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price?: number;
    quantity?: number;
  }>;
}): Promise<void> {
  return trackServerEvent(
    params.clientId,
    {
      name: 'purchase',
      params: {
        transaction_id: params.transactionId,
        value: params.value,
        currency: params.currency || 'EUR',
        ...(params.items ? ({ items: params.items as unknown as string }) : {}),
      },
    },
    params.userId,
  );
}
