import { IATriggerButton } from '@/components/iaoverlay/IATriggerButton';

type Day = {
  d: number;
  city: string;
  title: string;
  activities: string[];
};

const mockupDays: Day[] = [
  {
    d: 1,
    city: 'Manille',
    title: 'Arrivée & Intramuros',
    activities: ['Check-in hôtel Makati', 'Fort Santiago', 'Dîner Binondo'],
  },
  {
    d: 2,
    city: 'Palawan',
    title: 'Vol + El Nido',
    activities: ['Vol MNL → ENI', 'Transfert Nacpan Beach'],
  },
  {
    d: 3,
    city: 'El Nido',
    title: 'Tour A : lagons',
    activities: ['Big Lagoon · Small Lagoon', 'Secret Lagoon · Shimizu'],
  },
];

const features = [
  'Horaires réalistes, temps de trajet inclus',
  'Hôtels notés 4+ sur Google Maps',
  'Budget estimé par jour',
  'Export PDF et partage lien',
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

export const ItineraireIABlock = () => {
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-3xl mx-auto max-w-6xl text-white"
          style={{
            background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          {/* Decorative dashed circles (top-right + bottom-left) */}
          <span
            className="absolute pointer-events-none rounded-full"
            style={{
              width: '320px',
              height: '320px',
              top: '-120px',
              right: '-80px',
              border: '2px dashed rgba(255, 255, 255, 0.13)',
            }}
            aria-hidden="true"
          />
          <span
            className="absolute pointer-events-none rounded-full"
            style={{
              width: '200px',
              height: '200px',
              bottom: '-60px',
              left: '-40px',
              border: '2px dashed rgba(255, 255, 255, 0.13)',
              opacity: 0.9,
            }}
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Left column — copy */}
            <div>
              <span
                className="inline-block text-[13px] font-medium uppercase mb-4"
                style={{
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <span className="text-accent mr-1.5" aria-hidden="true">✦</span>
                Création IA gratuite
              </span>

              <h2
                className="font-bold mb-4 text-white"
                style={{
                  fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Votre itinéraire sur-mesure,{' '}
                <span className="text-accent">prêt en 30&nbsp;secondes</span>
              </h2>

              <p
                className="mb-6 text-[16px]"
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.6,
                }}
              >
                Dites-nous votre style (détente, aventure, culture), votre
                budget et la durée. Notre IA construit votre itinéraire jour par
                jour, avec hébergements et transports.
              </p>

              <ul className="flex flex-col gap-2.5 mb-7" role="list">
                {features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2.5 text-[14px]"
                    style={{ color: 'rgba(255, 255, 255, 0.92)' }}
                  >
                    <span
                      className="inline-flex w-[22px] h-[22px] items-center justify-center rounded-full text-accent flex-shrink-0"
                      style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
                      aria-hidden="true"
                    >
                      <CheckIcon />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <IATriggerButton
                source="homepage_block"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-ink rounded-lg font-semibold text-base shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Je crée mon itinéraire
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </IATriggerButton>
            </div>

            {/* Right column — mockup window */}
            <div
              className="bg-card rounded-2xl overflow-hidden text-foreground shadow-mockup"
              role="img"
              aria-label="Aperçu d'un itinéraire 10 jours généré par l'IA — Manille, Palawan, El Nido — budget 1 900 à 2 400 €"
            >
              {/* Mac-style title bar */}
              <div
                className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60"
                style={{ background: '#F8FAFC' }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} aria-hidden="true" />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} aria-hidden="true" />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} aria-hidden="true" />
                <span className="ml-3 text-[12px] font-semibold text-muted-foreground">
                  Mon voyage · 10 jours · Relax
                </span>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                {mockupDays.map((day, idx) => (
                  <div
                    key={day.d}
                    className={`flex gap-3.5 py-3 ${idx < mockupDays.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-primary text-[13px] font-bold"
                      style={{ backgroundColor: 'rgba(59, 91, 219, 0.1)' }}
                      aria-hidden="true"
                    >
                      J{day.d}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span
                          className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent-strong"
                        >
                          {day.city}
                        </span>
                        <span className="text-[14px] font-semibold text-foreground">
                          {day.title}
                        </span>
                      </div>
                      <ul className="text-[12px] text-muted-foreground leading-[1.6] space-y-0.5">
                        {day.activities.map((a) => (
                          <li key={a}>· {a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3.5 mt-2.5 border-t border-slate-100">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Budget estimé
                  </span>
                  <span className="text-[16px] font-bold text-accent-strong tabular-nums">
                    1&nbsp;900&nbsp;€ – 2&nbsp;400&nbsp;€
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
