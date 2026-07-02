/**
 * HowItWorks — the 3-step "Comment ça marche ?" band for the itinerary funnel.
 *
 * Redesigned away from the old pale rings: solid squircle number chips (primary
 * blue for the free steps, amber for the paid unlock), a dashed connector on
 * desktop, and semantic tag pills (success for GRATUIT, accent for the price).
 * CSS-only, token-driven — legible in light and dark. Copy is unchanged.
 */

type Step = {
  number: number;
  title: string;
  description: string;
  tag: string;
  paid?: boolean;
};

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Décrivez votre voyage',
    description: 'Remplissez le formulaire (2 min)',
    tag: 'GRATUIT',
  },
  {
    number: 2,
    title: 'Recevez 3 propositions',
    description: 'Notre IA crée 3 itinéraires adaptés',
    tag: 'GRATUIT',
  },
  {
    number: 3,
    title: 'Débloquez le complet',
    description: 'Programme détaillé, liens, conseils',
    tag: 'DÈS 9,99 €',
    paid: true,
  },
];

const InfoIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export function HowItWorks() {
  return (
    <section
      className="mx-auto mb-12 max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-card-rest md:p-8"
      aria-labelledby="how-it-works-title"
    >
      <h2
        id="how-it-works-title"
        className="mb-8 flex items-center gap-2 text-foreground"
        style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
      >
        <span className="text-primary" aria-hidden="true">
          <InfoIcon />
        </span>
        Comment ça marche ?
      </h2>

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        {/* Dashed connector aligned to the chip centres (desktop only). */}
        <div
          className="absolute hidden h-0.5 border-t-2 border-dashed border-primary/25 md:block"
          style={{ top: '1.75rem', left: 'calc(16.666% + 32px)', right: 'calc(16.666% + 32px)' }}
          aria-hidden="true"
        />

        {STEPS.map((step) => (
          <div key={step.number} className="relative flex flex-col items-center text-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold shadow-sm ${
                step.paid
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
              aria-hidden="true"
            >
              {step.number}
            </div>

            <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

            {step.paid ? (
              <span className="mt-3 inline-flex items-center rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-accent-strong">
                {step.tag}
              </span>
            ) : (
              <span
                className="mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em]"
                style={{ backgroundColor: 'hsl(var(--success) / 0.12)', color: 'hsl(var(--success))' }}
              >
                {step.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
