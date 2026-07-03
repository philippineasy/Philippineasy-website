'use client';

import Link from 'next/link';

type Props = {
  className?: string;
  source?: string;
  children: React.ReactNode;
};

// Client trigger link — used inside server components like ItineraireIABlock
// or ArticleFooter. Navigates to the canonical itinerary funnel page instead
// of opening the (now unused) IA overlay — unifies the two "Créer itinéraire"
// entry points onto a single page for SEO/tracking/resume-payment (audit
// 2026-07-03). The `ia_overlay_opened` event name is kept as-is on click to
// preserve continuity of existing analytics signals/dashboards.
export function IATriggerButton({ className, source, children }: Props) {
  return (
    <Link
      href="/itineraire-personnalise-pour-les-philippines"
      onClick={() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'ia_overlay_opened', source ? { source } : {});
        }
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
