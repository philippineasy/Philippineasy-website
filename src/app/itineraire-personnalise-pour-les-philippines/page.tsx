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
import { OfferConfirmationModal } from '@/components/itinerary/OfferConfirmationModal';
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

  // Modal de confirmation/consentement de l'offre — s'ouvre AVANT
  // PaymentAuthModal pour expliquer ce que l'utilisateur achete
  const [offerConfirmationModalOpen, setOfferConfirmationModalOpen] = useState(false);

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
  // depuis handlePayment ET depuis le useEffect de resume_payment.
  // variant passe en argument explicite : au resume post-magic-link, le
  // state selectedVariant est null (page rechargee) donc on le reconstruit
  // depuis l'URL ou la generation DB et on le passe ici.
  const triggerPayment = useCallback(async (offer: OfferType, genId: string, dur: Duration, variant: string) => {
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
          selected_variant: variant,
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
  }, []);

  // Etape 1 — clic "Debloquer" : on ouvre la modal de confirmation/consentement
  // (recap + positionnement guide vs agence + checkbox d'accord) AVANT toute
  // capture email ou redirection Stripe. Reduit les disputes refunds dues a
  // une mauvaise comprehension de ce qui est inclus.
  const handlePayment = async (offer: OfferType) => {
    if (!generationId || !selectedVariant || !duration) return;

    const pricing = PRICING_GRID[offer][duration as Duration];
    if (!pricing || pricing.price === 0) {
      window.location.href = '/contact?subject=conciergerie-voyage';
      return;
    }

    setPendingOffer(offer);
    setOfferConfirmationModalOpen(true);

    // GA4 tracking : on log l'ouverture de la modal recap (intent fort)
    if (typeof window !== 'undefined' && (window as { gtag?: (...a: unknown[]) => void }).gtag) {
      (window as { gtag: (...a: unknown[]) => void }).gtag('event', 'ia_offer_review_opened', {
        offer_type: offer,
        duration,
        value: pricing.price,
        currency: 'EUR',
      });
    }
  };

  // Etape 2 — l'utilisateur a coche le consentement et clique "Continuer".
  // On reprend le flow paiement : auth modal pour les anonymes, Stripe direct
  // pour les utilisateurs deja connectes.
  const handleConfirmOffer = async () => {
    setOfferConfirmationModalOpen(false);
    if (!pendingOffer || !generationId || !duration || !selectedVariant) return;

    const pricing = PRICING_GRID[pendingOffer][duration as Duration];
    if (!pricing || pricing.price === 0) return;

    // GA4 — l'event "checkout_started" historique reste declenche ici (pas a
    // l'ouverture de la modal recap) pour rester aligne avec la definition GA4
    // (intention reelle de payer apres consentement)
    if (typeof window !== 'undefined' && (window as { gtag?: (...a: unknown[]) => void }).gtag) {
      (window as { gtag: (...a: unknown[]) => void }).gtag('event', 'ia_checkout_started', {
        offer_type: pendingOffer,
        duration,
        value: pricing.price,
        currency: 'EUR',
      });
    }

    if (!user) {
      setPaymentAuthModalOpen(true);
      return;
    }

    await triggerPayment(pendingOffer, generationId, duration as Duration, selectedVariant);
  };

  // ─── Resume payment après retour du magic link ─────────────────────────────
  // Quand l'utilisateur revient depuis le lien email avec resume_payment + offer,
  // et qu'il est maintenant connecté, on déclenche le paiement automatiquement.
  useEffect(() => {
    const resumeGenerationId = searchParams.get('resume_payment');
    const resumeOffer = searchParams.get('offer') as OfferType | null;
    // variant transmis dans l'URL par PaymentAuthModal (state perdu au reload post-magic-link)
    const resumeVariant = searchParams.get('variant');

    if (!resumeGenerationId || !resumeOffer || authLoading) return;

    // Attendre que l'utilisateur soit authentifié (le magic link peut prendre
    // quelques ms pour être reconnu par onAuthStateChange)
    if (!user) return;

    // Vérifier que l'offre est valide
    const validOffers: OfferType[] = ['express', 'premium', 'conciergerie'];
    if (!validOffers.includes(resumeOffer)) return;

    // Charger la génération depuis l'API pour récupérer la durée + variant si besoin
    const resumePayment = async () => {
      try {
        const response = await fetch(`/api/itinerary/generation/${resumeGenerationId}`);
        if (!response.ok) {
          setError('Impossible de reprendre le paiement. Veuillez réessayer depuis le début.');
          return;
        }
        const data = await response.json();
        const genDuration: Duration = data.duration || (duration as Duration);
        // Priorite : URL > DB > fallback 'balanced' (variant le plus universel)
        const finalVariant: string = resumeVariant || data.selected_variant || 'balanced';
        if (!genDuration) {
          setError('Impossible de reprendre le paiement. Veuillez réessayer depuis le début.');
          return;
        }
        setGenerationId(resumeGenerationId);
        setSelectedVariant(finalVariant);
        await triggerPayment(resumeOffer, resumeGenerationId, genDuration, finalVariant);
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

      {/* Modal de confirmation/consentement de l'offre — etape 1 du checkout */}
      {pendingOffer && duration && (
        <OfferConfirmationModal
          isOpen={offerConfirmationModalOpen}
          onClose={() => {
            setOfferConfirmationModalOpen(false);
            setPendingOffer(null);
          }}
          offer={pendingOffer}
          duration={duration as Duration}
          onConfirm={handleConfirmOffer}
          onSelectOtherOffer={(newOffer) => {
            // Switch d'offre depuis l'upsell : on met a jour l'offre selectionnee
            // dans la grille ET dans pendingOffer, puis on rouvre la modal sur
            // la nouvelle offre (le user reconfirme avec les nouveaux details)
            setSelectedOffer(newOffer);
            setPendingOffer(newOffer);
          }}
        />
      )}

      {/* Modal d'authentification avant paiement (anonymes uniquement) — etape 2 */}
      {pendingOffer && generationId && selectedVariant && (
        <PaymentAuthModal
          isOpen={paymentAuthModalOpen}
          onClose={() => {
            setPaymentAuthModalOpen(false);
            setPendingOffer(null);
          }}
          email={capturedEmail}
          generationId={generationId}
          offer={pendingOffer}
          variant={selectedVariant}
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
