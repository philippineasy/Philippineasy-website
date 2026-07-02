'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ItineraryHero } from '@/components/itinerary/ItineraryHero';
import { HowItWorks } from '@/components/itinerary/HowItWorks';
import { PreferencesForm } from '@/components/itinerary/PreferencesForm';
import { ProposalCards } from '@/components/itinerary/ProposalCards';
import { OfferSelection } from '@/components/itinerary/OfferSelection';
import { PaymentAuthModal } from '@/components/itinerary/PaymentAuthModal';
import { OfferConfirmationModal } from '@/components/itinerary/OfferConfirmationModal';
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
  // coupon optionnel : transmis via l'URL post-magic-link depuis l'email J+3
  // recovery (ex: `?coupon=RELANCE10`). Validation cote serveur, lenient
  // (echec coupon = paie plein prix sans bloquer l'utilisateur).
  const triggerPayment = useCallback(async (offer: OfferType, genId: string, dur: Duration, variant: string, coupon?: string | null) => {
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
          ...(coupon ? { coupon } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Distingue le rate limit IP des autres erreurs pour un message clair
        // (etait perdu dans 'Erreur lors du paiement' generique).
        if (response.status === 429 || data.code === 'RATE_LIMIT_EXCEEDED') {
          throw new Error(
            data.message ||
              'Vous avez atteint la limite de tentatives de paiement (2 par semaine). Reessayez plus tard ou contactez-nous.'
          );
        }
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

  // Vrai si on est dans un flow "resume_payment" (post-magic-link).
  // Sert a (1) afficher un splash plein ecran a la place du formulaire vide
  // pendant qu'on prepare le paiement, et (2) supprimer les erreurs transitoires
  // (ex: 401 auth pas encore propage cote serveur) qui flashent avant le retry.
  const isResuming = !!searchParams.get('resume_payment');

  // ─── Resume payment : ouvrir la modal magic-link si non-auth ───────────────
  // Audit 2026-05-09 : avant ce useEffect, un user non-auth qui cliquait le lien
  // recovery email voyait le splash "Preparation de votre paiement" tourner en
  // boucle (le useEffect ci-dessous return tot a `if (!user) return`). 4 leads
  // perdus en 28j. Fix : on auto-ouvre la modal magic-link avec les params URL,
  // user saisit son email, magic link, click, revient auth -> useEffect suivant
  // declenche triggerPayment.
  useEffect(() => {
    if (!isResuming || authLoading || user) return;

    const resumeGenerationId = searchParams.get('resume_payment');
    const resumeOffer = searchParams.get('offer') as OfferType | null;
    const resumeVariant = searchParams.get('variant');

    if (!resumeGenerationId || !resumeOffer) return;
    const validOffers: OfferType[] = ['express', 'premium', 'conciergerie'];
    if (!validOffers.includes(resumeOffer)) return;

    setGenerationId(resumeGenerationId);
    setSelectedVariant(resumeVariant || 'balanced');
    setPendingOffer(resumeOffer);
    setPaymentAuthModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResuming, user, authLoading]);

  // ─── Resume payment après retour du magic link ─────────────────────────────
  // Quand l'utilisateur revient depuis le lien email avec resume_payment + offer,
  // et qu'il est maintenant connecté, on déclenche le paiement automatiquement.
  // Retry silencieux jusqu'a 3 tentatives (avec backoff) car la session auth
  // post-magic-link peut prendre 200-500ms a se propager cote API. Sans retry,
  // un 401 transitoire affichait l'erreur rouge avant que le 2e render reussisse.
  useEffect(() => {
    const resumeGenerationId = searchParams.get('resume_payment');
    const resumeOffer = searchParams.get('offer') as OfferType | null;
    const resumeVariant = searchParams.get('variant');
    // Coupon optionnel transmis par l'email J+3 recovery — auto-applique au resume
    const resumeCoupon = searchParams.get('coupon');

    if (!resumeGenerationId || !resumeOffer || authLoading) return;
    if (!user) return;

    const validOffers: OfferType[] = ['express', 'premium', 'conciergerie'];
    if (!validOffers.includes(resumeOffer)) return;

    let cancelled = false;

    const resumePayment = async (attempt = 1) => {
      const MAX_ATTEMPTS = 3;
      try {
        const response = await fetch(`/api/itinerary/generation/${resumeGenerationId}`);

        // 401/403 = session pas encore propagee cote serveur (juste apres magic link).
        // On retry silencieusement avec backoff exponentiel (300ms, 700ms).
        if (response.status === 401 || response.status === 403) {
          if (attempt < MAX_ATTEMPTS && !cancelled) {
            const delay = attempt === 1 ? 300 : 700;
            setTimeout(() => { if (!cancelled) resumePayment(attempt + 1); }, delay);
            return;
          }
          if (!cancelled) setError('Session expirée. Veuillez vous reconnecter.');
          return;
        }

        if (!response.ok) {
          if (!cancelled) setError('Impossible de reprendre le paiement. Veuillez réessayer depuis le début.');
          return;
        }

        const data = await response.json();
        const genDuration: Duration = data.duration || (duration as Duration);
        const finalVariant: string = resumeVariant || data.selected_variant || 'balanced';
        if (!genDuration) {
          if (!cancelled) setError('Impossible de reprendre le paiement. Veuillez réessayer depuis le début.');
          return;
        }
        if (cancelled) return;
        setGenerationId(resumeGenerationId);
        setSelectedVariant(finalVariant);
        await triggerPayment(resumeOffer, resumeGenerationId, genDuration, finalVariant, resumeCoupon);
      } catch {
        if (attempt < MAX_ATTEMPTS && !cancelled) {
          const delay = attempt === 1 ? 300 : 700;
          setTimeout(() => { if (!cancelled) resumePayment(attempt + 1); }, delay);
          return;
        }
        if (!cancelled) setError('Impossible de reprendre le paiement. Veuillez réessayer depuis le début.');
      }
    };

    resumePayment();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, searchParams]);

  const currentPricing = duration ? {
    express: PRICING_GRID.express[duration as Duration],
    premium: PRICING_GRID.premium[duration as Duration],
    conciergerie: PRICING_GRID.conciergerie[duration as Duration],
  } : null;

  // Auto-scroll vers la banniere d'erreur quand elle apparait. Sinon les
  // erreurs (notamment rate limit 429 du resumePayment) sont enterrees sous le
  // formulaire et l'utilisateur ne les voit pas — on l'a vu en prod.
  useEffect(() => {
    if (error && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);

  // Splash plein ecran pendant le resume_payment post-magic-link.
  // Affiche aussi pendant authLoading=true (flow implicit : Supabase processe
  // le hash #access_token et set session, ~100-500ms apres redirect). Sans
  // ce cas, l'user verrait brievement le formulaire vide entre le redirect
  // magic-link et le moment ou user devient defini.
  // Si non-auth ET authLoading=false ET isResuming -> l'auto-open du
  // PaymentAuthModal prend le relais (cf. useEffect ci-dessus).
  if (isResuming && (user || authLoading) && !error) {
    return (
      <main className="min-h-screen bg-[hsl(var(--warm-bg))] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-7 h-7 border-[3px] border-primary border-t-transparent rounded-full"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-xl font-semibold text-ink mb-2">
            Préparation de votre paiement
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            On vérifie votre commande et on vous redirige vers le paiement sécurisé Stripe.
            Cela prend quelques secondes…
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--warm-bg))]">
      {/* Banniere d'erreur sticky en haut — visible immediatement, dismissible */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="sticky top-0 z-40 bg-destructive/95 text-destructive-foreground backdrop-blur-sm shadow-lg"
            role="alert"
            aria-live="assertive"
          >
            <div className="container mx-auto px-4 py-3 flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5 text-sm font-medium">
                <span className="text-base shrink-0 mt-0.5 sm:mt-0" aria-hidden="true">⚠️</span>
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0 text-destructive-foreground/80 hover:text-destructive-foreground text-xl leading-none px-2 -mr-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive-foreground/40 rounded"
                aria-label="Fermer le message d'erreur"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero signature — panneau bleu + fenêtre app, porte le H1 unique */}
      <ItineraryHero />

      <div className="container mx-auto px-4 pb-16 pt-10 md:pt-14">
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
          coupon={searchParams.get('coupon') || undefined}
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
