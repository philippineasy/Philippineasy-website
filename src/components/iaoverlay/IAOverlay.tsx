'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useIAOverlay } from '@/contexts/IAOverlayContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  PRICING_GRID,
  DURATION_LABELS,
  OFFER_LABELS,
  formatPrice,
  type Duration,
  type OfferType,
} from '@/config/itinerary-pricing';

// Validation email (alignee sur PreferencesForm.tsx — meme regex)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =============================================================
// Mapping helpers — must match n8n workflow "Valider les Entrees" exactly
// (workflow id beo6SrTfO1sUS9Sp — Philippineasy - Itinerary Generator V3)
// =============================================================

type StyleKey = 'Détente' | 'Aventure' | 'Culture' | 'Plongée' | 'Équilibré';
type TravelType = 'solo' | 'couple' | 'famille' | 'amis';
type Budget = 'eco' | 'standard' | 'comfort' | 'luxury';
type Interest =
  | 'beaches' | 'snorkeling' | 'hiking' | 'culture' | 'food'
  | 'nightlife' | 'surfing' | 'offbeaten' | 'local';
type Variant = 'relax' | 'balanced' | 'adventure';

const STYLE_TO_TRIP: Record<StyleKey, 'relax' | 'adventure' | 'culture' | 'diving' | 'mix'> = {
  Détente: 'relax',
  Aventure: 'adventure',
  Culture: 'culture',
  Plongée: 'diving',
  Équilibré: 'mix',
};

function recommendedVariant(tripStyle: string): Variant {
  if (tripStyle === 'relax') return 'relax';
  if (tripStyle === 'adventure' || tripStyle === 'diving') return 'adventure';
  return 'balanced';
}

const STYLE_OPTIONS: { key: StyleKey; emoji: string; desc: string }[] = [
  { key: 'Détente', emoji: '🏖️', desc: 'Plages, lagons, hamac.' },
  { key: 'Aventure', emoji: '🏔️', desc: 'Volcan, plongée, trek.' },
  { key: 'Culture', emoji: '🎭', desc: 'Villages, histoire, cuisine.' },
  { key: 'Plongée', emoji: '🤿', desc: 'Sites, épaves, requins-baleines.' },
  { key: 'Équilibré', emoji: '🌈', desc: 'Un peu de tout.' },
];

const TRAVEL_TYPES: { key: TravelType; label: string; emoji: string }[] = [
  { key: 'solo', label: 'Solo', emoji: '🧳' },
  { key: 'couple', label: 'Couple', emoji: '💑' },
  { key: 'famille', label: 'Famille', emoji: '👨‍👩‍👧' },
  { key: 'amis', label: 'Amis', emoji: '👫' },
];

const INTEREST_OPTIONS: { key: Interest; label: string; emoji: string }[] = [
  { key: 'beaches', label: 'Plages', emoji: '🏖️' },
  { key: 'snorkeling', label: 'Snorkeling', emoji: '🐠' },
  { key: 'hiking', label: 'Randonnée', emoji: '🥾' },
  { key: 'surfing', label: 'Surf', emoji: '🏄' },
  { key: 'culture', label: 'Culture', emoji: '🏛️' },
  { key: 'food', label: 'Gastronomie', emoji: '🍜' },
  { key: 'nightlife', label: 'Vie nocturne', emoji: '🍸' },
  { key: 'offbeaten', label: 'Hors sentiers', emoji: '🗺️' },
  { key: 'local', label: 'Authentique local', emoji: '🏘️' },
];

const VARIANT_CONFIG: Record<Variant, { label: string; dot: string; bg: string; text: string }> = {
  relax: { label: 'Relax', dot: '#14B8A6', bg: '#F0FDFA', text: '#0F766E' },
  balanced: { label: 'Équilibré', dot: '#10B981', bg: '#ECFDF5', text: '#047857' },
  adventure: { label: 'Aventure', dot: '#F59E0B', bg: '#FEF3C7', text: '#B45309' },
};

function daysToDuration(days: number): Duration {
  if (days <= 5) return '3-days';
  if (days <= 7) return '1-week';
  if (days <= 10) return '10-days';
  if (days <= 14) return '2-weeks';
  if (days <= 21) return '3-weeks';
  if (days <= 30) return '1-month';
  return 'more';
}

function eurToBudget(eur: number): Budget {
  if (eur < 1500) return 'eco';
  if (eur < 3000) return 'standard';
  if (eur < 4500) return 'comfort';
  return 'luxury';
}

const BUDGET_LABELS: Record<Budget, string> = {
  eco: 'Économique',
  standard: 'Standard',
  comfort: 'Confort',
  luxury: 'Luxe',
};

type Preview = {
  variant: Variant;
  title: string;
  description: string;
  budget_estimate: string;
  highlights: string[];
  teaser_days?: { day: number; summary: string }[];
};

type Step = 0 | 1 | 2;

export function IAOverlay() {
  const { isOpen, close } = useIAOverlay();
  // Email obligatoire pour anonymes : sans email, generation perdue (recovery
  // impossible, magic link checkout impossible). Audit 2026-05-09 — 3/4 leads
  // recents IAOverlay etaient anonymes sans email. Aligne sur PreferencesForm.
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState<Step>(0);
  const [style, setStyle] = useState<StyleKey>('Détente');
  const [travelType, setTravelType] = useState<TravelType>('couple');
  const [duration, setDuration] = useState(10);
  const [budget, setBudget] = useState(2000);
  const [interests, setInterests] = useState<Interest[]>(['beaches', 'culture']);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Preview[] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferType>('premium');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setError(null);
      setPreviews(null);
      setGenerationId(null);
      setLoading(false);
      setPaymentLoading(false);
      setSelectedVariant(null);
      // Email NON reset au setEmail() volontairement : si l'utilisateur ouvre
      // l'overlay 2x, on garde sa saisie precedente pour reduire la friction.
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Warn user if they try to leave during generation
  useEffect(() => {
    if (!loading) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "L'IA travaille encore — êtes-vous sûr de quitter ?";
      return e.returnValue;
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [loading]);

  // Focus trap + ESC close (when not loading/payment-loading)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading && !paymentLoading) {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusables = sheet.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, loading, paymentLoading, close]);

  const toggleInterest = (k: Interest) => {
    setInterests((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  const generate = useCallback(async () => {
    // Validation email pour les anonymes — bloque la generation sans email
    // pour eviter les leads fantomes irrecuperables (cf. audit 2026-05-09).
    const trimmedEmail = email.trim().toLowerCase();
    if (!user && !EMAIL_RE.test(trimmedEmail)) {
      setError('Veuillez saisir un email valide pour recevoir votre apercu.');
      return;
    }

    setLoading(true);
    setError(null);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ia_step_completed', { step: 1 });
    }
    try {
      const tripStyle = STYLE_TO_TRIP[style];
      const payload = {
        travelType,
        duration: daysToDuration(duration),
        budget: eurToBudget(budget),
        tripStyle,
        interests: interests.length > 0 ? interests : ['beaches'],
        additionalInfo: additionalInfo.trim().slice(0, 500),
        // Email persiste cote API (delivery_email) -> recovery cron + magic
        // link payment fonctionnent meme si l'utilisateur ferme l'overlay.
        ...(trimmedEmail ? { email: trimmedEmail } : {}),
      };
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erreur ${res.status}`);
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Génération échouée');
      const list: Preview[] = Array.isArray(data.previews) ? data.previews : [];
      if (list.length === 0) {
        throw new Error("L'IA n'a pas pu générer de proposition. Réessayez ou ajustez vos préférences.");
      }
      setPreviews(list);
      setGenerationId(data.generation_id || null);
      const reco = recommendedVariant(tripStyle);
      const exists = list.find((p) => p.variant === reco);
      setSelectedVariant(exists ? reco : list[0].variant);
      setStep(2);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ia_itinerary_generated');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [additionalInfo, budget, duration, interests, style, travelType, email, user]);

  const handlePayment = useCallback(async () => {
    if (!generationId || !selectedVariant) return;
    const dur = daysToDuration(duration);
    const pricing = PRICING_GRID[selectedOffer]?.[dur];
    if (!pricing || pricing.price === 0) {
      // Conciergerie 1-month+ = sur devis
      window.location.href = '/contact?subject=conciergerie-voyage';
      return;
    }
    setPaymentLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/itinerary/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_id: generationId,
          selected_variant: selectedVariant,
          offer_type: selectedOffer,
          duration: dur,
          price_id: pricing.priceId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Erreur ${res.status}`);
      }
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ia_checkout_started', {
          variant: selectedVariant, offer: selectedOffer, value: pricing.price,
        });
      }
      // Redirect Stripe checkout — encode params (client_secret may contain
      // characters that need URL-escaping in some Stripe environments)
      const checkoutParams = new URLSearchParams({
        client_secret: String(data.clientSecret),
        generation_id: String(generationId),
      });
      window.location.href = `/checkout/itinerary?${checkoutParams.toString()}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors du paiement');
      setPaymentLoading(false);
    }
  }, [duration, generationId, selectedOffer, selectedVariant]);

  if (!isOpen) return null;

  const dur = daysToDuration(duration);
  const currentPricing = PRICING_GRID[selectedOffer]?.[dur];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start sm:items-center justify-center p-0 sm:p-6 bg-night/72 backdrop-blur-sm motion-reduce:backdrop-blur-none overflow-y-auto"
      onClick={() => { if (!loading && !paymentLoading) close(); }}
      role="presentation"
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ia-overlay-title"
        className="relative w-full sm:max-w-[920px] min-h-screen sm:min-h-0 sm:my-6 bg-card sm:rounded-3xl shadow-2xl px-4 pt-6 pb-28 sm:px-9 sm:py-9 sm:pb-9"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => { if (!loading && !paymentLoading) close(); }}
          aria-label="Fermer le planificateur d'itinéraire"
          disabled={loading || paymentLoading}
          className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-7" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={[
                'h-1.5 rounded-full transition-all',
                i <= step ? 'w-8 bg-accent' : 'w-3 bg-border',
              ].join(' ')}
            />
          ))}
        </div>

        {/* ============================== STEP 0 — Style ============================== */}
        {step === 0 && (
          <div>
            <span className="block text-[12px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-2">
              Étape 1 · Votre style
            </span>
            <h2 id="ia-overlay-title" className="text-[clamp(1.375rem,3vw,1.875rem)] font-bold tracking-[-0.02em] text-ink mb-6">
              Quelle <span className="text-accent">ambiance</span> cherchez-vous ?
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {STYLE_OPTIONS.map((o) => {
                const selected = style === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setStyle(o.key)}
                    aria-pressed={selected}
                    className={[
                      'group flex flex-col items-start text-left rounded-2xl border bg-card p-5 transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                      selected ? 'border-accent ring-2 ring-accent shadow-card' : 'border-border hover:border-accent/50 hover:shadow-card-rest',
                    ].join(' ')}
                  >
                    <span className="text-2xl mb-2" aria-hidden="true">{o.emoji}</span>
                    <strong className="text-[15px] font-semibold text-ink">{o.key}</strong>
                    <span className="text-[12px] text-muted-foreground mt-1">{o.desc}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={close} className="text-[14px] text-muted-foreground hover:text-foreground font-medium px-3 py-2">Annuler</button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'ia_step_completed', { step: 0 });
                  }
                  setStep(1);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ============================== STEP 1 — Profile ============================== */}
        {step === 1 && (
          <div>
            <span className="block text-[12px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-2">
              Étape 2 · Profil &amp; préférences
            </span>
            <h2 id="ia-overlay-title" className="text-[clamp(1.375rem,3vw,1.875rem)] font-bold tracking-[-0.02em] text-ink mb-6">
              Cadrons votre <span className="text-accent">voyage</span>
            </h2>

            <div className="space-y-7">
              {/* Travel type */}
              <div>
                <span className="block text-[14px] font-medium text-foreground mb-2">Vous voyagez…</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TRAVEL_TYPES.map((t) => {
                    const selected = travelType === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setTravelType(t.key)}
                        aria-pressed={selected}
                        className={[
                          'rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all flex items-center justify-center gap-1.5',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                          selected ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent' : 'border-border bg-card text-foreground hover:border-accent/40',
                        ].join(' ')}
                      >
                        <span aria-hidden="true">{t.emoji}</span>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration slider */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="ia-duration" className="text-[14px] font-medium text-foreground">Durée du séjour</label>
                  <strong className="text-[16px] font-bold text-accent tabular-nums">{duration} jours</strong>
                </div>
                <input id="ia-duration" type="range" min={3} max={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-accent cursor-pointer" />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1"><span>3 j</span><span>30 j</span></div>
              </div>

              {/* Budget slider */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="ia-budget" className="text-[14px] font-medium text-foreground">Budget par personne</label>
                  <strong className="text-[16px] font-bold text-accent tabular-nums">{budget.toLocaleString('fr-FR')} € · {BUDGET_LABELS[eurToBudget(budget)]}</strong>
                </div>
                <input id="ia-budget" type="range" min={600} max={6000} step={100} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-accent cursor-pointer" />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1"><span>Éco</span><span>Standard</span><span>Confort</span><span>Luxe</span></div>
              </div>

              {/* Interests */}
              <div>
                <span className="block text-[14px] font-medium text-foreground mb-2">Centres d'intérêt <span className="text-muted-foreground font-normal">(plusieurs choix)</span></span>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((it) => {
                    const selected = interests.includes(it.key);
                    return (
                      <button
                        key={it.key}
                        type="button"
                        onClick={() => toggleInterest(it.key)}
                        aria-pressed={selected}
                        className={[
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                          selected ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-card text-foreground hover:border-accent/40',
                        ].join(' ')}
                      >
                        <span aria-hidden="true">{it.emoji}</span>
                        {it.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email — obligatoire pour anonymes (recovery + magic link checkout).
                  Sans ce champ, audit 2026-05-09 : 75% des leads IAOverlay perdus
                  car generation sans contact = recovery impossible. */}
              {!authLoading && !user && (
                <div>
                  <label htmlFor="ia-email" className="block text-[14px] font-medium text-foreground mb-2">
                    Votre email <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="ia-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    autoComplete="email"
                    inputMode="email"
                    required
                    className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60"
                  />
                  <span className="block text-[11px] text-muted-foreground mt-1">
                    On vous envoie l&apos;aperçu et on retient vos préférences si vous revenez plus tard.
                  </span>
                </div>
              )}

              {/* Additional info */}
              <div>
                <label htmlFor="ia-notes" className="block text-[14px] font-medium text-foreground mb-2">Note libre <span className="text-muted-foreground font-normal">(facultatif)</span></label>
                <textarea id="ia-notes" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value.slice(0, 500))} rows={2} placeholder="Ex : nous voulons absolument voir El Nido, et éviter Manille." className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60 resize-none" />
                <span className="block text-right text-[11px] text-muted-foreground mt-1">{additionalInfo.length}/500</span>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-6 text-[13px] text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{error}</p>
            )}

            {loading && (
              <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 flex items-start gap-3">
                <svg className="animate-spin motion-reduce:animate-none shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B5BDB" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <div>
                  <p className="text-[14px] font-semibold text-ink">Notre IA travaille pour vous (~60-80 secondes)</p>
                  <p className="text-[13px] text-muted-foreground mt-0.5">Merci de <strong>ne pas quitter cette page</strong> ni rafraîchir — vos 3 propositions arrivent.</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={() => setStep(0)} disabled={loading} className="text-[14px] text-muted-foreground hover:text-foreground font-medium px-3 py-2 disabled:opacity-50">← Retour</button>
              <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {loading ? (<><svg className="animate-spin motion-reduce:animate-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Notre IA cherche…</>) : (<>Générer l'itinéraire →</>)}
              </button>
            </div>
          </div>
        )}

        {/* ============================== STEP 2 — Result + Offers + Payment ============================== */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <span className="block text-[12px] uppercase tracking-[0.1em] font-semibold text-accent mb-2">✦ Vos 3 propositions</span>
              <h2 id="ia-overlay-title" className="text-[clamp(1.375rem,3vw,1.875rem)] font-bold tracking-[-0.02em] text-ink mb-1">
                Choisissez votre <span className="text-accent">itinéraire</span>
              </h2>
              <p className="text-[14px] text-muted-foreground">{duration} jours · {style} · {BUDGET_LABELS[eurToBudget(budget)]} · pour {travelType}</p>
            </div>

            {/* === Variant Cards === */}
            {previews && previews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10" role="radiogroup" aria-label="Choix de l'itinéraire">
                {previews.map((p) => {
                  const conf = VARIANT_CONFIG[p.variant];
                  const isSelected = selectedVariant === p.variant;
                  const isReco = recommendedVariant(STYLE_TO_TRIP[style]) === p.variant;
                  return (
                    <div
                      key={p.variant}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onClick={() => setSelectedVariant(p.variant)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedVariant(p.variant); }}}
                      className={[
                        'rounded-2xl bg-card cursor-pointer transition-all overflow-hidden flex flex-col',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                        isSelected ? 'border border-primary shadow-card -translate-y-0.5' : 'border border-border hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-card-rest',
                      ].join(' ')}
                    >
                      {isReco && (
                        <div className="text-center py-1.5 bg-gradient-to-br from-primary to-primary/85 text-white text-[10px] font-bold tracking-[0.08em] uppercase">
                          ✦ Recommandé pour vous
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.05em]" style={{ background: conf.bg, color: conf.text }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: conf.dot }} />
                            {conf.label}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white" aria-hidden="true">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            </span>
                          )}
                        </div>
                        <h3 className="text-[15px] font-semibold text-ink leading-tight mb-2">{p.title}</h3>
                        <p className="text-[12.5px] text-muted-foreground leading-[1.55] mb-4 line-clamp-3">{p.description}</p>

                        {p.highlights && p.highlights.length > 0 && (
                          <>
                            <span className="block text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.08em] mb-2">Points forts</span>
                            <ul className="space-y-1.5 mb-4 list-none p-0">
                              {p.highlights.slice(0, 3).map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-[12.5px] text-foreground/80 leading-snug">
                                  <span className="shrink-0 w-3.5 h-3.5 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5" aria-hidden="true">
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                  </span>
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {p.teaser_days && p.teaser_days.length > 0 && (
                          <div className="pt-3 border-t border-border/50 mb-3">
                            <span className="block text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.08em] mb-1.5">Aperçu</span>
                            <div className="space-y-1">
                              {p.teaser_days.slice(0, 2).map((d) => (
                                <p key={d.day} className="text-[12px] text-muted-foreground leading-snug">
                                  <strong className="text-ink">Jour {d.day} :</strong> {d.summary}
                                </p>
                              ))}
                            </div>
                            <p className="mt-1.5 text-[10.5px] italic text-muted-foreground/70">… et plus encore après déblocage</p>
                          </div>
                        )}

                        <div className="mt-auto pt-3 border-t border-border/50">
                          <span className="block text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.06em]">Budget estimé</span>
                          <span className="block text-[18px] font-bold text-primary tabular-nums leading-none mt-0.5">{p.budget_estimate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center mb-10">
                <p className="text-[14px] text-muted-foreground">Aucune proposition disponible. Réessayez avec d'autres préférences.</p>
              </div>
            )}

            {/* === Offer Selection === */}
            {previews && previews.length > 0 && selectedVariant && (
              <>
                <div className="mb-5">
                  <h3 className="text-[20px] font-bold text-ink mb-1">Choisissez votre <span className="text-accent">formule</span></h3>
                  <p className="text-[13px] text-muted-foreground">Pour un séjour de <strong className="text-foreground">{DURATION_LABELS[dur]}</strong></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  {(['express', 'premium', 'conciergerie'] as OfferType[]).map((key) => {
                    const offer = OFFER_LABELS[key];
                    const pricing = PRICING_GRID[key][dur];
                    const isSelected = selectedOffer === key;
                    const isPopular = key === 'premium';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedOffer(key)}
                        aria-pressed={isSelected}
                        className={[
                          'group text-left rounded-2xl bg-card overflow-hidden flex flex-col transition-all',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                          isSelected ? 'border border-primary shadow-card -translate-y-0.5' : 'border border-border hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-card-rest',
                        ].join(' ')}
                      >
                        {isPopular && (
                          <div className="text-center py-1.5 bg-gradient-to-br from-primary to-primary/85 text-white text-[10px] font-bold tracking-[0.08em] uppercase">
                            ✦ {offer.badge}
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-baseline justify-between mb-2">
                            <strong className="text-[15px] font-semibold text-ink">{offer.name}</strong>
                            {!isPopular && offer.badge && (
                              <span className="text-[10px] uppercase tracking-[0.05em] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{offer.badge}</span>
                            )}
                          </div>
                          <p className="text-[12.5px] text-muted-foreground leading-[1.5] mb-3">{offer.description}</p>
                          <div className="mb-3">
                            <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.06em]">Prix</span>
                            <span className="block text-[28px] font-bold text-primary tabular-nums leading-none mt-0.5">
                              {pricing && pricing.price > 0 ? formatPrice(pricing.price) : 'Sur devis'}
                            </span>
                          </div>
                          <ul className="space-y-1.5 list-none p-0 pt-3 border-t border-border/50 mt-auto">
                            {offer.features.slice(0, 4).map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/80 leading-snug">
                                <span className="shrink-0 w-3.5 h-3.5 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5" aria-hidden="true">
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {error && (
              <p role="alert" className="mb-4 text-[13px] text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{error}</p>
            )}

            {/* === Recommencer link (sticky CTA below handles payment) === */}
            {previews && previews.length > 0 && selectedVariant && (
              <div className="pt-4 mt-2 flex justify-start">
                <button type="button" onClick={() => { setStep(0); setPreviews(null); setGenerationId(null); setSelectedVariant(null); }} disabled={paymentLoading} className="text-[13px] text-muted-foreground hover:text-foreground font-medium px-3 py-2 disabled:opacity-50">
                  ← Recommencer
                </button>
              </div>
            )}
          </div>
        )}

        {/* === Sticky bottom payment CTA (only on step 2 when ready) === */}
        {step === 2 && previews && previews.length > 0 && selectedVariant && currentPricing && (
          <div className="fixed sm:absolute left-0 right-0 bottom-0 sm:bottom-0 sm:rounded-b-3xl bg-card/96 backdrop-blur-md border-t border-border/60 px-4 sm:px-9 py-3.5 sm:py-4 z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[11px] uppercase tracking-[0.06em] text-muted-foreground font-semibold">{OFFER_LABELS[selectedOffer].name}</span>
                <span className="text-[15px] font-bold text-ink">
                  {selectedVariant && VARIANT_CONFIG[selectedVariant].label} · {DURATION_LABELS[dur]}
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5 sm:flex-1 sm:items-end">
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-[15px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  {paymentLoading ? (
                    <><svg className="animate-spin motion-reduce:animate-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Préparation paiement…</>
                  ) : currentPricing.price > 0 ? (
                    <>🔒 Débloquer pour {formatPrice(currentPricing.price)} →</>
                  ) : (
                    <>Demander un devis →</>
                  )}
                </button>
                <span className="hidden sm:flex text-[10.5px] text-muted-foreground items-center gap-1 mt-0.5">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Stripe · Livraison instantanée par email
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
