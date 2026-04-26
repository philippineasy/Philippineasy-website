'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIAOverlay } from '@/contexts/IAOverlayContext';
import type { Duration } from '@/config/itinerary-pricing';

// Mapping helpers
type StyleKey = 'Détente' | 'Aventure' | 'Culture' | 'Équilibré';

const STYLE_TO_TRIP: Record<StyleKey, string> = {
  Détente: 'relax',
  Aventure: 'adventure',
  Culture: 'culture',
  Équilibré: 'mix',
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

const STYLE_OPTIONS: { key: StyleKey; emoji: string; desc: string }[] = [
  { key: 'Détente', emoji: '🏖️', desc: 'Plages, lagons, hamac.' },
  { key: 'Aventure', emoji: '🏔️', desc: 'Volcan, plongée, trek.' },
  { key: 'Culture', emoji: '🎭', desc: 'Villages, histoire, cuisine.' },
  { key: 'Équilibré', emoji: '🌈', desc: 'Un peu de tout.' },
];

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
  const [duration, setDuration] = useState(10);
  const [budget, setBudget] = useState(2000);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Preview[] | null>(null);

  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset state when overlay re-opens
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setError(null);
      setPreviews(null);
      setGenerationId(null);
      setLoading(false);
      // Move focus to close button on open (focus trap entry point)
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Simple focus trap inside the sheet
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusables = sheet.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
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

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ia_step_completed', { step: 2 });
    }
    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelType: 'couple',
          duration: daysToDuration(duration),
          budget: String(budget),
          tripStyle: STYLE_TO_TRIP[style],
          interests: ['plages', 'culture', 'nature'],
          additionalInfo: '',
        }),
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
  }, [budget, duration, style]);

  const goToFullPage = useCallback(() => {
    const params = new URLSearchParams({
      style: STYLE_TO_TRIP[style],
      days: String(duration),
      budget: String(budget),
    });
    if (generationId) params.set('gen', generationId);
    close();
    router.push(`/itineraire-personnalise-pour-les-philippines?${params.toString()}`);
  }, [budget, close, duration, generationId, router, style]);

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
        className="relative w-full max-w-[960px] max-h-[85vh] overflow-y-auto bg-card rounded-3xl shadow-2xl px-6 py-8 sm:px-10 sm:py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
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

        {/* Step indicator dots */}
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

        {/* Step 0 — Style */}
        {step === 0 && (
          <div>
            <span className="block text-[12px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-2">
              Étape 1 · Votre style
            </span>
            <h2 id="ia-overlay-title" className="text-[clamp(1.375rem,3vw,1.875rem)] font-bold tracking-[-0.02em] text-ink mb-6">
              Quelle <span className="text-accent">ambiance</span> cherchez-vous ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    <strong className="text-[16px] font-semibold text-ink">{o.key}</strong>
                    <span className="text-[13px] text-muted-foreground mt-1">{o.desc}</span>
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

        {/* Step 1 — Paramètres (durée + budget) */}
        {step === 1 && (
          <div>
            <span className="block text-[12px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-2">
              Étape 2 · Durée &amp; budget
            </span>
            <h2 id="ia-overlay-title" className="text-[clamp(1.375rem,3vw,1.875rem)] font-bold tracking-[-0.02em] text-ink mb-8">
              Cadrons votre <span className="text-accent">voyage</span>
            </h2>

            <div className="space-y-8">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="ia-duration" className="text-[15px] font-medium text-foreground">Durée</label>
                  <strong className="text-[18px] font-bold text-accent tabular-nums">{duration} jours</strong>
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

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="ia-budget" className="text-[15px] font-medium text-foreground">Budget par personne</label>
                  <strong className="text-[18px] font-bold text-accent tabular-nums">{budget.toLocaleString('fr-FR')} €</strong>
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
                  <span>600 €</span><span>6 000 €</span>
                </div>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-6 text-[13px] text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-10 flex items-center justify-between gap-3">
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

        {/* Step 2 — Result (previews from n8n) */}
        {step === 2 && (
          <div>
            <span className="block text-[12px] uppercase tracking-[0.1em] font-semibold text-accent mb-2">
              ✦ Votre itinéraire est prêt
            </span>
            <h2 id="ia-overlay-title" className="text-[clamp(1.375rem,3vw,1.875rem)] font-bold tracking-[-0.02em] text-ink mb-2">
              {duration} jours · {style} · {budget.toLocaleString('fr-FR')} €
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
