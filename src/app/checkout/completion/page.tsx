'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CompletionPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const paymentStatus = searchParams.get('redirect_status');
    if (paymentStatus === 'succeeded') {
      setStatus('succeeded');
      clearCart();
    } else if (paymentStatus === 'processing') {
        setStatus('processing');
    } else {
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
          <Link href="/marketplace" className="text-primary hover:underline">Continuer vos achats</Link>
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
          <p className="text-lg mb-8">Votre paiement n'a pas pu être traité. Veuillez réessayer ou contacter le support.</p>
          <Link href="/checkout" className="text-primary hover:underline">Réessayer le paiement</Link>
        </div>
      )}
    </div>
  );
}
