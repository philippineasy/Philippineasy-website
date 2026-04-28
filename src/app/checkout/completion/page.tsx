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
    return <div className="text-center py-16">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      {status === 'succeeded' && (
        <div>
          <h1 className="text-3xl font-bold text-green-500 mb-4">Paiement Réussi !</h1>
          <p className="text-lg mb-8">Merci pour votre commande. Vous recevrez bientôt une confirmation par e-mail.</p>
          <Link href="/marketplace-aux-philippines" className="text-primary hover:underline">
            Continuer vos achats
          </Link>
        </div>
      )}
      {status === 'processing' && (
        <div>
          <h1 className="text-3xl font-bold text-yellow-500 mb-4">Paiement en cours...</h1>
          <p className="text-lg mb-8">Votre paiement est en cours de traitement. Nous vous informerons de son statut.</p>
          <Link href="/" className="text-primary hover:underline">Retour à l'accueil</Link>
        </div>
      )}
      {status === 'failed' && (
        <div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">Échec du Paiement</h1>
          <p className="text-lg mb-8">Votre paiement n&apos;a pas pu être traité. Veuillez réessayer ou contacter le support.</p>
          <Link href="/checkout" className="text-primary hover:underline">Réessayer le paiement</Link>
        </div>
      )}
    </div>
  );
}

export default function CompletionPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Chargement...</div>}>
      <CompletionContent />
    </Suspense>
  );
}
