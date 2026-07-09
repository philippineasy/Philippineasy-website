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
        <span className="text-[12px] font-bold uppercase tracking-[0.10em] text-primary">
          ✦ Budget terrain
        </span>
        <span className="text-[12.5px] text-muted-foreground tabular-nums">
          Estimations en €/personne · base {days} jours
        </span>
      </div>
      <h2
        id="budget-heading"
        className="text-ink font-semibold mb-6 tracking-[-0.02em] leading-[1.15] text-[clamp(1.625rem,3vw,2.125rem)]"
      >
        Combien prévoir pour ce voyage&nbsp;?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleTiers.map((tier) => {
          const total = (tier.perDay ?? 0) * days;
          const widthPct = ((tier.perDay ?? 0) / maxPerDay) * 100;
          const isHighlight = tier.highlight;

          // La carte "recommandée" est une surface colorée CONSTANTE (dégradé
          // primary, ne bascule pas avec le thème) : texte clair fixe dessus,
          // comme un bouton. Les autres cartes suivent les tokens (dark-ready).
          return (
            <article
              key={tier.key}
              className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 motion-reduce:hover:transform-none ${
                isHighlight
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-cta'
                  : 'bg-card border border-border shadow-card-rest'
              }`}
            >
              {isHighlight && (
                <span className="absolute -top-2.5 right-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tabular-nums tracking-[0.06em] shadow-cta bg-accent text-accent-foreground">
                  ★ Recommandé
                </span>
              )}

              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center justify-center rounded-xl w-11 h-11 ${
                    isHighlight ? 'bg-white/[0.13] text-amber-300' : 'bg-soft-blue text-primary'
                  }`}
                  aria-hidden="true"
                >
                  <tier.Icon />
                </span>
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.10em] ${
                    isHighlight ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}
                >
                  {tier.label}
                </span>
              </div>

              <div className="mb-1.5">
                <span
                  className={`font-bold tabular-nums tracking-[-0.025em] leading-[1.05] text-[clamp(1.875rem,4vw,2.25rem)] ${
                    isHighlight ? 'text-amber-300' : 'text-ink'
                  }`}
                >
                  {tier.perDay} €
                </span>
                <span
                  className={`text-[13.5px] ml-1.5 ${
                    isHighlight ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}
                >
                  / jour
                </span>
              </div>

              <p
                className={`text-[13.5px] mb-4 leading-normal ${
                  isHighlight ? 'text-primary-foreground/85' : 'text-muted-foreground'
                }`}
              >
                {tier.desc}
              </p>

              {/* Barre visuelle proportionnelle — pas de chart lib, CSS pur */}
              <div
                className={`relative h-1.5 rounded-full overflow-hidden mb-3 ${
                  isHighlight ? 'bg-white/[0.15]' : 'bg-foreground/[0.08]'
                }`}
                aria-hidden="true"
              >
                <span
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${
                    isHighlight ? 'from-amber-300 to-accent' : 'from-primary to-primary/60'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              <div
                className={`pt-3 border-t flex items-baseline justify-between ${
                  isHighlight ? 'border-white/20' : 'border-border'
                }`}
              >
                <span
                  className={`text-[11.5px] font-bold uppercase tracking-[0.08em] ${
                    isHighlight ? 'text-primary-foreground/65' : 'text-muted-foreground'
                  }`}
                >
                  Total {days} j.
                </span>
                <span
                  className={`font-bold tabular-nums tracking-[-0.01em] text-[17px] ${
                    isHighlight ? 'text-primary-foreground' : 'text-ink'
                  }`}
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
