import { headers } from 'next/headers';

/**
 * Récupère l'adresse IP réelle du client
 * Sur Vercel, l'ordre de priorité est:
 * 1. x-forwarded-for (premier IP de la liste = client original)
 * 2. x-real-ip (fallback)
 * 3. cf-connecting-ip (si Cloudflare est devant)
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();

  // Vercel: x-forwarded-for (premier = client)
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    if (ip) return ip;
  }

  // Fallbacks
  return h.get('x-real-ip') || h.get('cf-connecting-ip') || '127.0.0.1';
}

/**
 * Normalise une IP (pour gérer les cas spéciaux)
 * Par exemple: ::ffff:127.0.0.1 -> 127.0.0.1
 */
export function normalizeIp(ip: string): string {
  return ip.startsWith('::ffff:') ? ip.substring(7) : ip;
}
