import Image from 'next/image';
import type { ItineraryDay } from '@/types/destinationItineraries';

interface ItineraryDayCardProps {
  day: ItineraryDay;
  /** Si false, masque la ligne de timeline qui descend (pour le dernier jour) */
  isLast?: boolean;
}

const ClockIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 8v4l3 2M12 22a10 10 0 110-20 10 10 0 010 20z" />
  </svg>
);

const EuroIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 10h12M4 14h12M18 6a6 6 0 100 12" />
  </svg>
);

const TransportIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M5 17H3V8a2 2 0 012-2h11l4 5v6h-2M9 17h6" />
  </svg>
);

const BedIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 18h18M3 18v3M21 18v3M7 11V9a2 2 0 012-2h2a2 2 0 012 2v2" />
  </svg>
);

const MealIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 3v8a4 4 0 008 0V3M7 3v18M17 3v8h4l-1 10h-3" />
  </svg>
);

export function ItineraryDayCard({ day, isLast = false }: ItineraryDayCardProps) {
  const hasFooter = day.transport || day.accommodation || day.meals;

  return (
    <div className="relative">
      {/* Timeline verticale dashed — connecte les jours, signature pattern home */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[27px] top-[68px] bottom-[-32px] w-px hidden sm:block"
          style={{
            borderLeft: '2px dashed rgba(59, 91, 219, 0.25)',
          }}
        />
      )}

      <article
        id={`jour-${day.day}`}
        className="relative bg-card rounded-2xl overflow-hidden border-[0.5px] border-border shadow-card-rest hover:shadow-card transition-shadow duration-300"
      >
        {/* Header — gros chiffre cercle accent + titre */}
        <header className="flex items-start gap-4 px-5 sm:px-7 pt-6 sm:pt-7 pb-5">
          <span
            className="inline-flex items-center justify-center rounded-2xl shrink-0 font-bold tabular-nums shadow-cta"
            style={{
              width: '54px',
              height: '54px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #EA8A0A 100%)',
              color: '#1a1a00',
              fontSize: '22px',
              letterSpacing: '-0.02em',
              boxShadow: '0 6px 18px rgba(245, 158, 11, 0.30)',
            }}
            aria-hidden="true"
          >
            J{day.day}
          </span>
          <div className="flex-1 min-w-0 pt-1">
            <span
              className="block text-[11px] font-bold uppercase mb-1.5 text-primary"
              style={{ letterSpacing: '0.10em' }}
            >
              Jour {day.day}
            </span>
            <h3
              className="font-semibold text-ink"
              style={{
                fontSize: 'clamp(1.25rem, 2.4vw, 1.5rem)',
                letterSpacing: '-0.015em',
                lineHeight: 1.2,
              }}
            >
              {day.title}
            </h3>
          </div>
        </header>

        {/* Activities — chaque activite = mini-card distincte avec image facultative */}
        {day.activities.length > 0 && (
          <div className="px-5 sm:px-7 pb-1">
            <ul className="space-y-3">
              {day.activities.map((activity, idx) => (
                <li
                  key={idx}
                  className="group relative flex gap-4 p-3.5 sm:p-4 rounded-xl bg-soft-blue/60 border-[0.5px] border-border/60 transition-all duration-200 hover:bg-soft-blue hover:border-primary/30"
                >
                  {/* Numero d'activite — petit indice visuel pour ancrer le rythme */}
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center rounded-lg w-7 h-7 text-[12px] font-bold tabular-nums bg-primary/10 text-primary mt-0.5"
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>

                  {activity.image && (
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl border-[0.5px] border-border/60">
                      <Image
                        src={activity.image}
                        alt={activity.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-semibold text-ink mb-1"
                      style={{
                        fontSize: '15px',
                        letterSpacing: '-0.005em',
                        lineHeight: 1.35,
                      }}
                    >
                      {activity.name}
                    </h4>
                    <p
                      className="text-[13.5px] text-muted-foreground"
                      style={{ lineHeight: 1.55 }}
                    >
                      {activity.description}
                    </p>
                    {(activity.duration || activity.cost) && (
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        {activity.duration && (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium text-primary bg-primary/10"
                          >
                            <ClockIcon />
                            {activity.duration}
                          </span>
                        )}
                        {activity.cost && (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium tabular-nums"
                            style={{
                              backgroundColor: 'rgba(245, 158, 11, 0.12)',
                              color: '#92400E',
                            }}
                          >
                            <EuroIcon />
                            {activity.cost}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer — transport / hebergement / repas en pills 3 cols */}
        {hasFooter && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-5 sm:px-7 py-4 mt-3 border-t border-border/60"
            style={{ background: 'linear-gradient(180deg, #FAFBFD 0%, #F4F7FE 100%)' }}
          >
            {day.transport && (
              <div className="flex items-start gap-2.5">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(59, 91, 219, 0.10)', color: '#3B5BDB' }}
                  aria-hidden="true"
                >
                  <TransportIcon />
                </span>
                <div className="min-w-0">
                  <span
                    className="block text-[10.5px] font-bold uppercase text-muted-foreground mb-0.5"
                    style={{ letterSpacing: '0.10em' }}
                  >
                    Transport
                  </span>
                  <p className="text-[13px] text-ink leading-[1.45]">{day.transport}</p>
                </div>
              </div>
            )}
            {day.accommodation && (
              <div className="flex items-start gap-2.5">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(59, 91, 219, 0.10)', color: '#3B5BDB' }}
                  aria-hidden="true"
                >
                  <BedIcon />
                </span>
                <div className="min-w-0">
                  <span
                    className="block text-[10.5px] font-bold uppercase text-muted-foreground mb-0.5"
                    style={{ letterSpacing: '0.10em' }}
                  >
                    Hébergement
                  </span>
                  <p className="text-[13px] text-ink leading-[1.45]">{day.accommodation}</p>
                </div>
              </div>
            )}
            {day.meals && (
              <div className="flex items-start gap-2.5">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#B45309' }}
                  aria-hidden="true"
                >
                  <MealIcon />
                </span>
                <div className="min-w-0">
                  <span
                    className="block text-[10.5px] font-bold uppercase text-muted-foreground mb-0.5"
                    style={{ letterSpacing: '0.10em' }}
                  >
                    Repas
                  </span>
                  <p className="text-[13px] text-ink leading-[1.45]">{day.meals}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
