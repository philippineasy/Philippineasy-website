'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect, Suspense } from 'react';
import { Lock, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { trackBeginCheckout } from '@/lib/analytics';
import { metaTrackInitiateCheckout } from '@/lib/meta-pixel';
import { TrustBadgeShield } from '@/components/shared/TrustBadge';

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
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-[16px] font-bold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Traitement en cours…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden="true" />
            Payer maintenant
          </>
        )}
      </button>

      {message && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-[14px] text-destructive">
          {message}
        </div>
      )}

      <p className="flex items-center justify-center gap-1.5 text-center text-[12px] text-muted-foreground">
        <Lock className="h-3 w-3" aria-hidden="true" />
        Paiement sécurisé par Stripe
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

  // Track begin checkout
  useEffect(() => {
    if (clientSecret && generationId) {
      trackBeginCheckout({ value: 0, items: [{ item_id: generationId, item_name: 'Itineraire IA', item_category: 'itinerary' }] });
      metaTrackInitiateCheckout({ content_name: 'Itineraire IA' });
    }
  }, [clientSecret, generationId]);

  // Redirection si non connecte
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?redirect=/itineraire-personnalise-pour-les-philippines');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!clientSecret || !generationId) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-card">
          <h1 className="mb-4 text-2xl font-bold text-destructive">Erreur</h1>
          <p className="mb-6 text-muted-foreground">
            Paramètres de paiement manquants. Veuillez recommencer la procédure.
          </p>
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour au générateur
          </Link>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3a6fed', // matches --primary token (Stripe Elements renders in an iframe, cannot read CSS custom properties)
      borderRadius: '8px',
    },
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8">
        <Link
          href="/itineraire-personnalise-pour-les-philippines"
          className="inline-flex items-center gap-2 rounded text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour au générateur
        </Link>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card sm:p-8">
        <span className="block text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
          Paiement sécurisé
        </span>
        <h1 className="mb-6 mt-1.5 text-center text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-ink">
          Finaliser votre commande
        </h1>

        {/* Resume de l'achat */}
        <div className="mb-8 rounded-xl border border-border/60 bg-muted/40 p-4">
          <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Votre achat
          </h2>
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" aria-hidden="true" />
            <span className="text-[15px] font-medium">Itinéraire personnalisé aux Philippines</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            Programme complet jour par jour, hébergements recommandés, liens Google Maps, budget détaillé.
          </p>
        </div>

        {/* Trust shield — derniere reassurance avant saisie carte.
            Stripe + SSL + garantie 7j en pill compact. */}
        <div className="mb-6">
          <TrustBadgeShield />
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
