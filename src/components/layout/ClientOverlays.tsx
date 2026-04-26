'use client';

import dynamic from 'next/dynamic';

// Lazy-load — composants jamais affichés à l'initial render. Sortis du bundle
// initial pour améliorer le TTI sur 100% des pages.
const IAOverlay = dynamic(() => import('@/components/iaoverlay/IAOverlay').then((m) => m.IAOverlay), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/homepage/ExitIntentPopup').then((m) => m.ExitIntentPopup), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <IAOverlay />
      <ExitIntentPopup />
    </>
  );
}
