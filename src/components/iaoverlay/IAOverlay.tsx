'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIAOverlay } from '@/contexts/IAOverlayContext';
import type { Duration } from '@/config/itinerary-pricing';

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

const STYLE_TO_TRIP: Record<StyleKey, 'relax' | 'adventure' | 'culture' | 'diving' | 'mix'> = {
  Détente: 'relax',
  Aventure: 'adventure',
  Culture: 'culture',
  Plongée: 'diving',
  Équilibré: 'mix',
};

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
  variant: 'relax' | 'balanced' | 'adventure';
  title: string;
  description: string;
  budget_estimate: string;
  highlights: string[];
  teaser_days?: { day: number; summary: string }[];
};

type Step = 0 | 1 | 2;

export function IAOverlay() {
  const { isOpen, close } = useIAOverlay();
  const router = useRouter();

  const [step, setStep] = useState<Step>(0);
  const [style, setStyle] = useState<StyleKey>('Détente');
  const [travelType, setTravelType] = useState<TravelType>('couple');
  const [duration, setDuration] = useState(10);
  const [budget, setBudget] = useState(2000);
  const [interests, setInterests] = useState<Interest[]>(['beaches', 'culture']);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Preview[] | null>(null);

  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setError(null);
      setPreviews(null);
      setGenerationId(null);
      setLoading(false);
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
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
  }, [isOpen]);

  const toggleInterest = (k: Interest) => {
    setInterests((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ia_step_completed', { step: 1 });
    }
    try {
      const payload = {
        travelType,
        duration: daysToDuration(duration),
        budget: eurToBudget(budget),
        tripStyle: STYLE_TO_TRIP[style],
        interests: interests.length > 0 ? interests : ['beaches'],
        additionalInfo: additionalInfo.trim().slice(0, 500),
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
      setPreviews(Array.isArray(data.previews) ? data.previews : []);
      setGenerationId(data.generation_id || null);
      setStep(2);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ia_itinerary_generated');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [additionalInfo, budget, duration, interests, style, travelType]);

  const goToFullPage = useCallback(() => {
    const params = new URLSearchParams({
      style: STYLE_TO_TRIP[style],
      duration: daysToDuration(duration),
      budget: eurToBudget(budget),
      travelType,
    });
    if (interests.length > 0) params.set('interests', interests.join(','));
    if (generationId) params.set('gen', generationId);
    close();
    router.push(`/itineraire-personnalise-pour-les-philippines?${params.toString()}`);
  }, [budget, close, duration, generationId, interests, router, style, travelType]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8 bg-ink/72 backdrop-blur-sm motion-reduce:backdrop-blur-none"
      onClick={close}
      role="presentation"
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ia-overlay-title"
        className="relative w-full max-w-[960px] max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl px-6 py-8 sm:px-10 sm:py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Fermer le planificateur d'itinéraire"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8" aria-hidden="true">
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

        {/* Step 0 — Style (5 cartes) */}
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
                      selected
                        ? 'border-accent ring-2 ring-accent shadow-card'
                        : 'border-border hover:border-accent/50 hover:shadow-card-rest',
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
              <button type="button" onClick={close} className="text-[14px] text-muted-foreground hover:text-foreground font-medium px-3 py-2">
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'ia_step_completed', { step: 0 });
                  }
                  setStep(1);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent text-ink px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* Step 1 — Profil + paramètres */}
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
                          selected
                            ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent'
                            : 'border-border bg-card text-foreground hover:border-accent/40',
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
                <input
                  id="ia-duration"
                  type="range"
                  min={3}
                  max={30}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>3 j</span><span>30 j</span>
                </div>
              </div>

              {/* Budget slider */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="ia-budget" className="text-[14px] font-medium text-foreground">Budget par personne</label>
                  <strong className="text-[16px] font-bold text-accent tabular-nums">
                    {budget.toLocaleString('fr-FR')} € · {BUDGET_LABELS[eurToBudget(budget)]}
                  </strong>
                </div>
                <input
                  id="ia-budget"
                  type="range"
                  min={600}
                  max={6000}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>Éco</span><span>Standard</span><span>Confort</span><span>Luxe</span>
                </div>
              </div>

              {/* Interests */}
              <div>
                <span className="block text-[14px] font-medium text-foreground mb-2">
                  Centres d'intérêt <span className="text-muted-foreground font-normal">(plusieurs choix)</span>
                </span>
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
                          selected
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-card text-foreground hover:border-accent/40',
                        ].join(' ')}
                      >
                        <span aria-hidden="true">{it.emoji}</span>
                        {it.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional info */}
              <div>
                <label htmlFor="ia-notes" className="block text-[14px] font-medium text-foreground mb-2">
                  Note libre <span className="text-muted-foreground font-normal">(facultatif)</span>
                </label>
                <textarea
                  id="ia-notes"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value.slice(0, 500))}
                  rows={2}
                  placeholder="Ex : nous voulons absolument voir El Nido, et éviter Manille."
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60 resize-none"
                />
                <span className="block text-right text-[11px] text-muted-foreground mt-1">{additionalInfo.length}/500</span>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-6 text-[13px] text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={() => setStep(0)} className="text-[14px] text-muted-foreground hover:text-foreground font-medium px-3 py-2">
                ← Retour
              </button>
              <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-accent text-ink px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin motion-reduce:animate-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Notre IA cherche…
                  </>
                ) : (
                  <>Générer l'itinéraire →</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Result */}
        {step === 2 && (
          <div>
            <span className="block text-[12px] uppercase tracking-[0.1em] font-semibold text-accent mb-2">
              ✦ Votre itinéraire est prêt
            </span>
            <h2 id="ia-overlay-title" className="text-[clamp(1.375rem,3vw,1.875rem)] font-bold tracking-[-0.02em] text-ink mb-2">
              {duration} jours · {style} · {BUDGET_LABELS[eurToBudget(budget)]}
            </h2>
            <p className="text-[14px] text-muted-foreground mb-6">
              Notre IA a préparé {previews?.length || 3} variantes — choisissez celle qui vous parle.
            </p>

            {previews && previews.length > 0 ? (
              <div className="space-y-3">
                {previews.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] uppercase tracking-[0.05em] font-semibold bg-accent/10 text-accent">
                        {p.variant}
                      </span>
                      <strong className="text-[16px] font-semibold text-ink leading-tight">{p.title}</strong>
                    </div>
                    {p.description && (
                      <p className="text-[14px] text-muted-foreground leading-[1.55] mb-3">{p.description}</p>
                    )}
                    {p.highlights && p.highlights.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5 mb-3 list-none p-0">
                        {p.highlights.slice(0, 4).map((h, j) => (
                          <li key={j} className="text-[12px] px-2 py-1 rounded-full bg-muted text-foreground/80">
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    {p.budget_estimate && (
                      <span className="block text-[13px] font-semibold text-accent">{p.budget_estimate}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center">
                <p className="text-[14px] text-muted-foreground">
                  Vos préférences ont été enregistrées. Continuez sur la page complète pour finaliser.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { setStep(0); setPreviews(null); setGenerationId(null); }}
                className="text-[14px] text-muted-foreground hover:text-foreground font-medium px-3 py-2"
              >
                ← Recommencer
              </button>
              <button
                type="button"
                onClick={goToFullPage}
                className="inline-flex items-center gap-2 rounded-full bg-accent text-ink px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Voir l'itinéraire complet →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
