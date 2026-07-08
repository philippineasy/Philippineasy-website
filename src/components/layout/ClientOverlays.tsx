'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Lazy-load — composant jamais affiché à l'initial render. Sorti du bundle
// initial pour améliorer le TTI sur 100% des pages.
const ExitIntentPopup = dynamic(() => import('@/components/homepage/ExitIntentPopup').then((m) => m.ExitIntentPopup), { ssr: false });

export default function ClientOverlays() {
  const pathname = usePathname();
  // Exit-intent restreint a la home : il cannibalisait les pages de
  // vente/funnel (itineraire, rencontre, etc.) en interceptant la sortie
  // avant l'offre payante (audit conversion 2026-07-03).
  const isHome = pathname === '/';

  return isHome ? <ExitIntentPopup /> : null;
}
