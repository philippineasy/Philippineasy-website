'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { trackPurchase } from '@/lib/analytics';
import { metaTrackPurchase } from '@/lib/meta-pixel';

function CompletionContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'succeeded' | 'processing' | 'failed'>('loading');
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent running multiple times
    if (hasProcessed.current) return;

    const paymentStatus = searchParams.get('redirect_status');
    if (paymentStatus === 'succeeded') {
      hasProcessed.current = true;
      setStatus('succeeded');
      clearCart();
      const piId = searchParams.get('payment_intent') || '';

      // Verify amount via API (webhook needs ~1-2s to create the order row)
      const verifyAndTrack = async () => {
        let value = 0;
        let currency = 'EUR';
        if (piId) {
          // Retry once after a short delay if the webhook is still processing
          const tryFetch = async () => {
            const res = await fetch('/api/orders/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ payment_intent_id: piId }),
            });
            return res.ok ? res.json() : null;
          };
          let data = await tryFetch();
          if (!data?.success) {
            await new Promise((r) => setTimeout(r, 1500));
            data = await tryFetch();
          }
          if (data?.success) {
            value = Number(data.amount) || 0;
            currency = data.currency || 'EUR';
          }
        }
        trackPurchase({
          transaction_id: piId,
          value,
          currency,
          items: [{ item_id: piId, item_name: 'Marketplace', item_category: 'marketplace' }],
        });
        metaTrackPurchase({ value, currency, content_name: 'Marketplace', content_ids: piId ? [piId] : undefined });
      };
      void verifyAndTrack();
    } else if (paymentStatus === 'processing') {
      hasProcessed.current = true;
      setStatus('processing');
    } else if (paymentStatus) {
      hasProcessed.current = true;
      setStatus('failed');
    }
  }, [searchParams, clearCart]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-16 text-muted-foreground">
        Chargement...
      </div>
    );
  }

  const primaryBtn =
    'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  const ghostBtn =
    'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-lg rounded-2xl border-[0.5px] border-border bg-card p-8 text-center shadow-card-rest md:p-10">
        {status === 'succeeded' && (
          <>
            <span className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckIcon />
            </span>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Commande confirmée</h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Merci pour votre achat ! Votre paiement a bien été reçu. Un e-mail de confirmation
              avec le détail de votre commande vous a été envoyé.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/profil/commandes" className={primaryBtn}>
                Voir mes commandes
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/marketplace-aux-philippines" className={ghostBtn}>
                Retour à la marketplace
              </Link>
            </div>
          </>
        )}

        {status === 'processing' && (
          <>
            <span className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent-strong">
              <ClockIcon />
            </span>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Paiement en cours de traitement</h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Votre paiement est en cours de validation. Dès qu&apos;il sera confirmé, vous
              recevrez un e-mail et votre commande apparaîtra dans votre espace.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/profil/commandes" className={primaryBtn}>
                Voir mes commandes
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/marketplace-aux-philippines" className={ghostBtn}>
                Retour à la marketplace
              </Link>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <span className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <CrossIcon />
            </span>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Le paiement n&apos;a pas abouti</h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Votre paiement n&apos;a pas pu être traité. Aucun montant n&apos;a été débité.
              Vous pouvez réessayer ou contacter notre support si le problème persiste.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/checkout" className={primaryBtn}>
                Réessayer le paiement
              </Link>
              <Link href="/contact" className={ghostBtn}>
                Contacter le support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ClockIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const CrossIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default function CompletionPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-16 text-muted-foreground">
          Chargement...
        </div>
      }
    >
      <CompletionContent />
    </Suspense>
  );
}
