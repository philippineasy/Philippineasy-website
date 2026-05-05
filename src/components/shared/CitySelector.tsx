'use client';

import dynamic from 'next/dynamic';

/**
 * Wrapper dynamic — la lib `country-state-city` embarque 8 MB de JSON
 * (toutes les villes du monde). On la charge uniquement quand le selector
 * est rendu cote client, pas dans le First Load JS de la page.
 *
 * Audit bundle 2026-05-05 : sans ce wrapper, /rencontre/swipe et
 * /rencontre/profil/modifier pesaient 2.66 MB First Load. Avec le wrapper,
 * la page de base reste a ~180 KB et le chunk villes est charge en arriere-plan.
 */
const CitySelector = dynamic(() => import('./CitySelector.client'), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-full bg-muted/30 rounded-md border border-input animate-pulse" />
  ),
});

export type { CityOption } from './CitySelector.client';
export default CitySelector;
