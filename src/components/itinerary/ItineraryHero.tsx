/**
 * ItineraryHero — signature intro panel for the paid AI-itinerary funnel.
 *
 * Mirrors the homepage ItineraireIABlock ADN (constant blue gradient, editorial
 * left column with eyebrow + amber accent, and a white "app window" mockup on
 * the right) so this page reads as its big sister. Carries the page's UNIQUE
 * <h1>. No framer-motion — CSS-only. The blue gradient is a deliberate brand
 * constant across themes; everything inside the app window is token-driven so it
 * holds up in both light and dark.
 */

type MockDay = { d: number; city: string; title: string; activities: string[] };

const MOCK_DAYS: MockDay[] = [
  {
    d: 1,
    city: 'Cebu',
    title: 'Arrivée & sud de l’île',
    activities: ['Transfert Moalboal', 'Coucher de soleil à Panagsama'],
  },
  {
    d: 3,
    city: 'Bohol',
    title: 'Chocolate Hills & tarsiers',
    activities: ['Rivière Loboc', 'Plage d’Alona'],
  },
  {
    d: 6,
    city: 'Siquijor',
    title: 'Cascades & snorkeling',
    activities: ['Cambugahay Falls', 'Île de Sombrero'],
  },
];

const BULLETS = [
  'Aperçu gratuit en 30 secondes, sans engagement',
  '3 itinéraires jour par jour adaptés à vos envies',
  'Hébergements, transports et budget estimé',
  'Itinéraire complet dès 9,99 €',
];

const STATS = [
  { value: '30 s', label: 'aperçu gratuit' },
  { value: '3', label: 'propositions' },
  { value: 'dès 9,99 €', label: 'itinéraire complet' },
];

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const ItineraryHero = () => {
  return (
    <section className="pt-6 md:pt-10">
      <div className="container mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-3xl text-white"
          style={{
            /* Signature brand gradient — intentionally constant across themes. */
            background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
            padding: 'clamp(2.25rem, 5vw, 3.75rem)',
          }}
        >
          {/* Decorative dashed circles (top-right + bottom-left). */}
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '320px',
              height: '320px',
              top: '-120px',
              right: '-80px',
              border: '2px dashed rgba(255,255,255,0.13)',
            }}
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '200px',
              height: '200px',
              bottom: '-60px',
              left: '-40px',
              border: '2px dashed rgba(255,255,255,0.13)',
              opacity: 0.9,
            }}
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            {/* Left column — editorial copy + the page H1 */}
            <div>
              <span
                className="mb-4 inline-block text-[13px] font-medium uppercase"
                style={{ letterSpacing: '0.08em', color: 'rgba(255,255,255,0.95)' }}
              >
                <span className="mr-1.5 text-accent" aria-hidden="true">
                  ✦
                </span>
                Itinéraire IA sur-mesure
              </span>

              <h1
                className="font-bold text-white"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.08,
                }}
              >
                Créez votre itinéraire idéal aux{' '}
                <span className="text-accent">Philippines</span>
              </h1>

              <p
                className="mt-4 text-[16px]"
                style={{ color: 'rgba(255,255,255,0.95)', lineHeight: 1.6 }}
              >
                Notre assistant IA conçoit votre voyage en quelques minutes.
                Indiquez vos préférences, comparez 3 propositions, choisissez
                votre formule — et partez serein.
              </p>

              <ul className="mt-6 flex flex-col gap-2.5" role="list">
                {BULLETS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-[14px]"
                    style={{ color: 'rgba(255,255,255,0.92)' }}
                  >
                    <span
                      className="inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent"
                      aria-hidden="true"
                    >
                      <CheckIcon />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#itinerary-form"
                  className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  Créer mon itinéraire
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
                <span className="text-[13px] text-white/75">
                  Aucune carte requise pour l’aperçu.
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6">
                {STATS.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <strong
                      className="text-[24px] font-bold tabular-nums text-white"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {s.value}
                    </strong>
                    <span
                      className="text-[12px] uppercase"
                      style={{ letterSpacing: '0.06em', color: 'rgba(255,255,255,0.7)' }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — white "app" window mockup (token-driven) */}
            <div
              className="overflow-hidden rounded-2xl bg-card text-foreground shadow-mockup"
              role="img"
              aria-label="Aperçu d’un itinéraire de 10 jours généré par l’IA — Cebu, Bohol, Siquijor — budget estimé 1 300 à 1 800 €"
            >
              {/* macOS-style title bar */}
              <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} aria-hidden="true" />
                <span className="ml-3 truncate text-[12px] font-semibold text-muted-foreground">
                  Votre aperçu · 10 jours · Équilibré
                </span>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                {MOCK_DAYS.map((day, idx) => (
                  <div
                    key={day.d}
                    className={`flex gap-3.5 py-3 ${idx < MOCK_DAYS.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[13px] font-bold text-primary"
                      aria-hidden="true"
                    >
                      J{day.d}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-baseline gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent-strong">
                          {day.city}
                        </span>
                        <span className="text-[14px] font-semibold text-foreground">
                          {day.title}
                        </span>
                      </div>
                      <ul className="space-y-0.5 text-[12px] leading-[1.6] text-muted-foreground">
                        {day.activities.map((a) => (
                          <li key={a}>· {a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                {/* Locked-days hint — signals there is more behind the paywall */}
                <div className="flex items-center gap-2.5 py-3 text-[12px] text-muted-foreground">
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground"
                    aria-hidden="true"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <span>Jours 4, 5, 7 à 10 — débloqués après paiement</span>
                </div>

                {/* Footer — estimated budget */}
                <div className="mt-1 flex items-center justify-between border-t border-border pt-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Budget estimé
                  </span>
                  <span className="text-[16px] font-bold tabular-nums text-accent-strong">
                    1&nbsp;300&nbsp;€ – 1&nbsp;800&nbsp;€
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryHero;
