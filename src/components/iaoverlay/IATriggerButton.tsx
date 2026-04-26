'use client';

import { useIAOverlay } from '@/contexts/IAOverlayContext';

type Props = {
  className?: string;
  source?: string;
  children: React.ReactNode;
};

// Client trigger button — used inside server components like ItineraireIABlock
// or ArticleFooter to open the IA overlay without converting the parent to client.
export function IATriggerButton({ className, source, children }: Props) {
  const iaOverlay = useIAOverlay();
  return (
    <button
      type="button"
      onClick={() => {
        iaOverlay.open();
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'ia_overlay_opened', source ? { source } : {});
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}
