'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSpinner, faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  generationId: string;
}

function ItineraryPaymentForm({ generationId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/itinerary/completion?generation_id=${generationId}`,
      },
    });

    if (error) {
      setMessage(error.message || 'Une erreur est survenue lors du paiement');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        id="payment-element"
        options={{
          layout: 'tabs',
        }}
      />

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full py-4 bg-accent text-primary font-bold text-lg rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faLock} />
            Payer maintenant
          </>
        )}
      </button>

      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {message}
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        <FontAwesomeIcon icon={faLock} className="mr-1" />
        Paiement securise par Stripe
      </p>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const clientSecret = searchParams.get('client_secret');
  const generationId = searchParams.get('generation_id');

  // Redirection si non connecte
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?redirect=/itineraire-personnalise-pour-les-philippines');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!clientSecret || !generationId) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-card p-8 rounded-xl border-2 border-red-200 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-muted-foreground mb-6">
            Parametres de paiement manquants. Veuillez recommencer la procedure.
          </p>
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Retour au generateur
          </Link>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      borderRadius: '8px',
    },
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/itineraire-personnalise-pour-les-philippines"
          className="text-primary hover:underline flex items-center gap-2 text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Retour au generateur
        </Link>
      </div>

      <div className="bg-card p-8 rounded-xl border-2 border-primary shadow-lg">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Finaliser votre commande
        </h1>

        {/* Resume de l'achat */}
        <div className="bg-blue-50 p-4 rounded-lg mb-8">
          <h2 className="font-semibold text-primary mb-2">Votre achat :</h2>
          <div className="flex items-center gap-2 text-foreground">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
            <span>Itineraire personnalise aux Philippines</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Programme complet jour par jour, hebergements recommandes, liens Google Maps, budget detaille.
          </p>
        </div>

        {/* Formulaire de paiement Stripe */}
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance,
          }}
        >
          <ItineraryPaymentForm generationId={generationId} />
        </Elements>
      </div>
    </div>
  );
}

export default function ItineraryCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
