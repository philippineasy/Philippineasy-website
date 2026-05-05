import type { ComponentType } from 'react';

interface BudgetTableProps {
  budgetBackpacker: number | null;
  budgetMidrange: number | null;
  budgetLuxury: number | null;
  recommendedDays: number | null;
}

const BackpackIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 7v13a2 2 0 002 2h8a2 2 0 002-2V7M9 7V5a3 3 0 016 0v2M6 12h12M9 17h6" />
  </svg>
);

const HotelIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 21V8a2 2 0 012-2h14a2 2 0 012 2v13M3 21h18M8 11h2M14 11h2M8 15h2M14 15h2M11 21v-4h2v4" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 14l1 2.5L22 18l-2 1-1 2-1-2-2-1 2-1zM5 14l1 2.5L8 18l-2 1-1 2-1-2-2-1 2-1z" />
  </svg>
);

type Tier = {
  key: 'backpacker' | 'midrange' | 'luxury';
  label: string;
  perDay: number | null;
  desc: string;
  Icon: ComponentType;
  highlight?: boolean;
};

export function BudgetTable({
  budgetBackpacker,
  budgetMidrange,
  budgetLuxury,
  recommendedDays,
}: BudgetTableProps) {
  if (!budgetBackpacker && !budgetMidrange && !budgetLuxury) return null;

  const days = recommendedDays ?? 7;

  const tiers: Tier[] = [
    {
      key: 'backpacker',
      label: 'Backpacker',
      perDay: budgetBackpacker,
      desc: 'Auberges, repas locaux, transport public',
      Icon: BackpackIcon,
    },
    {
      key: 'midrange',
      label: 'Mid-range',
      perDay: budgetMidrange,
      desc: 'Hôtels 3★, restaurants, transferts privés',
      Icon: HotelIcon,
      highlight: true,
    },
    {
      key: 'luxury',
      label: 'Luxury',
      perDay: budgetLuxury,
      desc: 'Resorts, fine dining, vols domestiques',
      Icon: SparkleIcon,
    },
  ];

  const visibleTiers = tiers.filter((t) => t.perDay !== null);
  // Pour barre proportionnelle visuelle : echelle relative au max visible
  const maxPerDay = Math.max(...visibleTiers.map((t) => t.perDay ?? 0), 1);

  return (
    <section aria-labelledby="budget-heading">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
        <span
          className="text-[12px] font-bold uppercase text-primary"
          style={{ letterSpacing: '0.10em' }}
        >
          ✦ Budget terrain
        </span>
        <span className="text-[12.5px] text-muted-foreground tabular-nums">
          Estimations en €/personne · base {days} jours
        </span>
      </div>
      <h2
        id="budget-heading"
        className="text-ink font-semibold mb-6"
        style={{
          fontSize: 'clamp(1.625rem, 3vw, 2.125rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        Combien prévoir pour ce voyage&nbsp;?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleTiers.map((tier) => {
          const total = (tier.perDay ?? 0) * days;
          const widthPct = ((tier.perDay ?? 0) / maxPerDay) * 100;
          const isHighlight = tier.highlight;

          return (
            <article
              key={tier.key}
              className="relative rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 motion-reduce:hover:transform-none"
              style={
                isHighlight
                  ? {
                      background:
                        'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
                      color: 'white',
                      boxShadow: '0 12px 32px rgba(59, 91, 219, 0.25)',
                    }
                  : {
                      backgroundColor: '#ffffff',
                      border: '0.5px solid hsl(var(--border))',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                    }
              }
            >
              {/* Badge "recommande" sur la card highlight */}
              {isHighlight && (
                <span
                  className="absolute -top-2.5 right-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tabular-nums shadow-cta"
                  style={{
                    backgroundColor: '#F59E0B',
                    color: '#1a1a00',
                    letterSpacing: '0.06em',
                  }}
                >
                  ★ Recommandé
                </span>
              )}

              <div className="flex items-center justify-between mb-4">
                <span
                  className="inline-flex items-center justify-center rounded-xl w-11 h-11"
                  style={
                    isHighlight
                      ? { backgroundColor: 'rgba(255, 255, 255, 0.13)', color: '#FCD34D' }
                      : { backgroundColor: '#F4F7FE', color: '#3B5BDB' }
                  }
                  aria-hidden="true"
                >
                  <tier.Icon />
                </span>
                <span
                  className="text-[11px] font-bold uppercase"
                  style={{
                    letterSpacing: '0.10em',
                    color: isHighlight ? 'rgba(255,255,255,0.78)' : '#64748B',
                  }}
                >
                  {tier.label}
                </span>
              </div>

              <div className="mb-1.5">
                <span
                  className="font-bold tabular-nums"
                  style={{
                    fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.05,
                    color: isHighlight ? '#FCD34D' : '#0F172A',
                  }}
                >
                  {tier.perDay} €
                </span>
                <span
                  className="text-[13.5px] ml-1.5"
                  style={{ color: isHighlight ? 'rgba(255,255,255,0.78)' : '#64748B' }}
                >
                  / jour
                </span>
              </div>

              <p
                className="text-[13.5px] mb-4"
                style={{
                  lineHeight: 1.5,
                  color: isHighlight ? 'rgba(255,255,255,0.85)' : '#64748B',
                }}
              >
                {tier.desc}
              </p>

              {/* Barre visuelle proportionnelle — pas de chart lib, CSS pur */}
              <div
                className="relative h-1.5 rounded-full overflow-hidden mb-3"
                style={{
                  backgroundColor: isHighlight
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(15, 23, 42, 0.06)',
                }}
                aria-hidden="true"
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${widthPct}%`,
                    background: isHighlight
                      ? 'linear-gradient(90deg, #FCD34D, #F59E0B)'
                      : 'linear-gradient(90deg, #3B5BDB, #6366F1)',
                  }}
                />
              </div>

              <div
                className="pt-3 border-t flex items-baseline justify-between"
                style={{
                  borderColor: isHighlight
                    ? 'rgba(255, 255, 255, 0.18)'
                    : 'rgba(15, 23, 42, 0.08)',
                }}
              >
                <span
                  className="text-[11.5px] font-bold uppercase"
                  style={{
                    letterSpacing: '0.08em',
                    color: isHighlight ? 'rgba(255,255,255,0.65)' : '#94a3b8',
                  }}
                >
                  Total {days} j.
                </span>
                <span
                  className="font-bold tabular-nums"
                  style={{
                    fontSize: '17px',
                    letterSpacing: '-0.01em',
                    color: isHighlight ? '#ffffff' : '#0F172A',
                  }}
                >
                  {total.toLocaleString('fr-FR')} €
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <p className="text-[12.5px] text-muted-foreground mt-5">
        Hors vol international. Estimations basées sur l&apos;expérience terrain
        de notre équipe — votre budget réel dépend de vos choix.
      </p>
    </section>
  );
}
