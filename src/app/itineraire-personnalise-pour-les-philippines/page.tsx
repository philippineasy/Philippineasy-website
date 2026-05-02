'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { HowItWorks } from '@/components/itinerary/HowItWorks';
import { PreferencesForm } from '@/components/itinerary/PreferencesForm';
import { ProposalCards } from '@/components/itinerary/ProposalCards';
import { OfferSelection } from '@/components/itinerary/OfferSelection';
import { PaymentAuthModal } from '@/components/itinerary/PaymentAuthModal';
import { fadeInUp } from '@/components/itinerary/animations';
import {
  PRICING_GRID,
  type Duration,
  type OfferType,
} from '@/config/itinerary-pricing';

interface ItineraryPreview {
  variant: 'relax' | 'balanced' | 'adventure';
  title: string;
  description: string;
  budget_estimate: string;
  highlights: string[];
  teaser_days: { day: number; summary: string }[];
}

const getRecommendedVariant = (style: string): 'relax' | 'balanced' | 'adventure' => {
  switch (style) {
    case 'relax':
      return 'relax';
    case 'adventure':
    case 'diving':
      return 'adventure';
    case 'culture':
    case 'mix':
    default:
      return 'balanced';
  }
};

// ─── Contenu principal séparé pour useSearchParams (doit être dans Suspense) ─

function ItineraireContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const [showResult, setShowResult] = useState(false);
  const [duration, setDuration] = useState<Duration | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<ItineraryPreview[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [recommendedVariant, setRecommendedVariant] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferType>('express');
  const [error, setError] = useState<string | null>(null);

  // Email capturé depuis PreferencesForm (pour pré-remplir la modal auth)
  const [capturedEmail, setCapturedEmail] = useState('');

  // État de la modal d'authentification avant paiement
  const [paymentAuthModalOpen, setPaymentAuthModalOpen] = useState(false);
  const [pendingOffer, setPendingOffer] = useState<OfferType | null>(null);

  const handleGenerate = async (data: {
    travelType: string;
    duration: Duration;
    budget: string;
    tripStyle: string;
    interests: string[];
    additionalInfo: string;
    email: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setShowResult(false);
    setPreviews([]);
    setSelectedVariant(null);
    setDuration(data.duration);

    // Mémoriser l'email pour la modal de paiement auth
    if (data.email) {
      setCapturedEmail(data.email);
    }

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la generation');
      }

      setGenerationId(result.generation_id);
      setPreviews(result.previews);

      const recommended = getRecommendedVariant(data.tripStyle);
      setRecommendedVariant(recommended);
      setSelectedVariant(recommended);
      setShowResult(true);

      setTimeout(() => {
        document.getElementById('itinerary-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Logique de paiement extraite en callback stable pour être appelée
  // depuis handlePayment ET depuis le useEffect de resume_payment
  const triggerPayment = useCallback(async (offer: OfferType, genId: string, dur: Duration) => {
    const pricing = PRICING_GRID[offer][dur];
    if (!pricing || pricing.price === 0) {
      window.location.href = '/contact?subject=conciergerie-voyage';
      return;
    }

    setError(null);

    try {
      const response = await fetch('/api/itinerary/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_id: genId,
          selected_variant: selectedVariant,
          offer_type: offer,
          duration: dur,
          price_id: pricing.priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors du paiement');
      }

      window.location.href = `/checkout/itinerary?client_secret=${data.clientSecret}&generation_id=${genId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement');
    }
  }, [selectedVariant]);

  const handlePayment = async (offer: OfferType) => {
    if (!generationId || !selectedVariant || !duration) return;

    const pricing = PRICING_GRID[offer][duration as Duration];
    if (!pricing || pricing.price === 0) {
      window.location.href = '/contact?subject=conciergerie-voyage';
      return;
    }

    // Tracker GA4
    if (typeof window !== 'undefined' && (window as { gtag?: (...a: unknown[]) => void }).gtag) {
      (window as { gtag: (...a: unknown[]) => void }).gtag('event', 'ia_checkout_started', {
        offer_type: offer,
        duration,
        value: pricing.price,
        currency: 'EUR',
      });
    }

    // Si l'utilisateur n'est pas authentifié, ouvrir la modal auth
    if (!user) {
      setPendingOffer(offer);
      setPaymentAuthModalOpen(true);
      return;
    }

    // Utilisateur connecté → flux Stripe direct (comportement inchangé)
    await triggerPayment(offer, generationId, duration as Duration);
  };

  // ─── Resume payment après retour du magic link ─────────────────────────────
  // Quand l'utilisateur revient depuis le lien email avec resume_payment + offer,
  // et qu'il est maintenant connecté, on déclenche le paiement automatiquement.
  useEffect(() => {
    const resumeGenerationId = searchParams.get('resume_payment');
    const resumeOffer = searchParams.get('offer') as OfferType | null;

    if (!resumeGenerationId || !resumeOffer || authLoading) return;

    // Attendre que l'utilisateur soit authentifié (le magic link peut prendre
    // quelques ms pour être reconnu par onAuthStateChange)
    if (!user) return;

    // Vérifier que l'offre est valide
    const validOffers: OfferType[] = ['express', 'premium', 'conciergerie'];
    if (!validOffers.includes(resumeOffer)) return;

    // Charger la génération depuis l'API pour récupérer la durée si besoin
    // (on n'a pas duration en state si la page a été rechargée)
    const resumePayment = async () => {
      try {
        // Récupérer les infos de la génération pour obtenir la durée
        const response = await fetch(`/api/itinerary/generation/${resumeGenerationId}`);
        if (!response.ok) {
          // Si l'API n'existe pas encore, utiliser la durée en state
          // (cas où l'user n'a pas rechargé la page)
          if (duration) {
            await triggerPayment(resumeOffer, resumeGenerationId, duration as Duration);
          } else {
            setError('Impossible de reprendre le paiement. Veuillez réessayer depuis le début.');
          }
          return;
        }
        const data = await response.json();
        const genDuration: Duration = data.duration || duration as Duration;
        if (!genDuration) {
          setError('Impossible de reprendre le paiement. Veuillez réessayer depuis le début.');
          return;
        }
        setGenerationId(resumeGenerationId);
        await triggerPayment(resumeOffer, resumeGenerationId, genDuration);
      } catch {
        setError('Impossible de reprendre le paiement. Veuillez réessayer depuis le début.');
      }
    };

    resumePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, searchParams]);

  const currentPricing = duration ? {
    express: PRICING_GRID.express[duration as Duration],
    premium: PRICING_GRID.premium[duration as Duration],
    conciergerie: PRICING_GRID.conciergerie[duration as Duration],
  } : null;

  return (
    <main className="min-h-screen bg-[hsl(var(--warm-bg))]">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            Creez Votre <span className="text-primary">Itineraire Ideal</span> aux Philippines
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Notre assistant IA concoit le voyage de vos reves en quelques minutes. Indiquez vos preferences, choisissez votre formule, partez serein !
          </p>
        </motion.div>

        {/* Comment ca marche */}
        <HowItWorks />

        {/* Formulaire */}
        <PreferencesForm
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          isAuthenticated={!!user}
          authLoading={authLoading}
        />

        {/* Resultats */}
        <AnimatePresence mode="wait">
          {showResult && previews.length > 0 && (
            <motion.div
              id="itinerary-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-10 max-w-4xl mx-auto"
            >
              <ProposalCards
                previews={previews}
                selectedVariant={selectedVariant}
                recommendedVariant={recommendedVariant}
                onSelect={setSelectedVariant}
              />

              {selectedVariant && currentPricing && (
                <OfferSelection
                  selectedOffer={selectedOffer}
                  onSelectOffer={setSelectedOffer}
                  currentPricing={currentPricing}
                  duration={duration as Duration}
                  onPayment={handlePayment}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal d'authentification avant paiement (anonymes uniquement) */}
      {pendingOffer && generationId && (
        <PaymentAuthModal
          isOpen={paymentAuthModalOpen}
          onClose={() => {
            setPaymentAuthModalOpen(false);
            setPendingOffer(null);
          }}
          email={capturedEmail}
          generationId={generationId}
          offer={pendingOffer}
        />
      )}
    </main>
  );
}

// ─── Page avec Suspense (requis par useSearchParams en Next.js 15) ────────────

const ItinerairePage = () => {
  return (
    <Suspense fallback={null}>
      <ItineraireContent />
    </Suspense>
  );
};

export default ItinerairePage;
