'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Lazy-load — composants jamais affichés à l'initial render. Sortis du bundle
// initial pour améliorer le TTI sur 100% des pages.
const IAOverlay = dynamic(() => import('@/components/iaoverlay/IAOverlay').then((m) => m.IAOverlay), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/homepage/ExitIntentPopup').then((m) => m.ExitIntentPopup), { ssr: false });

export default function ClientOverlays() {
  const pathname = usePathname();
  // Exit-intent restreint a la home : il cannibalisait les pages de
  // vente/funnel (itineraire, rencontre, etc.) en interceptant la sortie
  // avant l'offre payante (audit conversion 2026-07-03).
  const isHome = pathname === '/';

  return (
    <>
      <IAOverlay />
      {isHome && <ExitIntentPopup />}
    </>
  );
}
