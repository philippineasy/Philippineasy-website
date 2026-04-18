import Link from 'next/link';
import Image from 'next/image';

type Activity = {
  time: string;
  title: string;
  thumb: string;
  rating: string;
};

type UpcomingDay = { n: number; location: string; title: string };

const day1Activities: Activity[] = [
  {
    time: '11:00',
    title: 'Check-in Crimson Resort & Spa',
    thumb: '/imagesHero/hero-home.webp',
    rating: '4.6',
  },
  {
    time: '15:00',
    title: 'Azure Beach Club',
    thumb: '/images/voyager/iles-philippines-aeriennes.webp',
    rating: '4.4',
  },
];

const upcomingDays: UpcomingDay[] = [
  { n: 3, location: 'Mactan', title: 'Plongée & aventure marine' },
  { n: 5, location: 'Bohol', title: 'Chocolate Hills & tarsiers' },
  { n: 7, location: 'Cebu', title: 'Kawasan Falls & départ' },
];

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const BusIcon = ({ className }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="4" y="5" width="16" height="12" rx="2" />
    <path d="M4 11h16M8 17v2M16 17v2" />
    <circle cx="8.5" cy="14" r="0.6" fill="currentColor" />
    <circle cx="15.5" cy="14" r="0.6" fill="currentColor" />
  </svg>
);

const DecorRings = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 800 500"
    preserveAspectRatio="xMaxYMid slice"
    aria-hidden="true"
  >
    <g
      fill="none"
      stroke="#ffffff"
      strokeWidth="1"
      strokeDasharray="4 6"
      style={{ opacity: 0.13 }}
    >
      <circle cx="720" cy="110" r="60" />
      <circle cx="720" cy="110" r="110" />
      <circle cx="720" cy="110" r="170" />
      <circle cx="720" cy="110" r="240" />
    </g>
    <g
      fill="none"
      stroke="#ffffff"
      strokeWidth="1"
      strokeDasharray="2 8"
      style={{ opacity: 0.09 }}
    >
      <circle cx="80" cy="420" r="90" />
      <circle cx="80" cy="420" r="150" />
    </g>
  </svg>
);

export const ItineraireIABlock = () => {
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-3xl mx-auto max-w-6xl"
          style={{
            background:
              'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
            padding: 'clamp(2rem, 5vw, 3rem)',
          }}
        >
          <DecorRings />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Colonne gauche */}
            <div>
              <span
                className="inline-flex items-center gap-2 mb-5 text-[13px] font-medium uppercase"
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.08em',
                }}
              >
                <span className="text-accent" aria-hidden="true">✨</span>
                Création IA gratuite
              </span>

              <h2
                className="text-white font-bold mb-5"
                style={{
                  fontSize: 'clamp(1.75rem, 3.8vw, 2.25rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Votre itinéraire sur&nbsp;mesure,{' '}
                <br className="hidden md:inline" />
                prêt en 30&nbsp;secondes.
              </h2>

              <p
                className="mb-7 leading-relaxed"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '15px',
                  maxWidth: '32rem',
                }}
              >
                Activités avec horaires et notes Google, restaurants
                sélectionnés, hôtels, transports entre îles, carte interactive —
                notre IA assemble tout pour vous en quelques instants.
              </p>

              <Link
                href="/itineraire-personnalise-pour-les-philippines"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-accent-foreground rounded-lg font-semibold text-base shadow-lg transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] hover:shadow-xl"
              >
                Je crée mon itinéraire
                <span aria-hidden="true">→</span>
              </Link>

              <p
                className="mt-6 text-[13px] leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '30rem' }}
              >
                <span className="text-accent" aria-hidden="true">★</span>{' '}
                <span className="text-white font-semibold">Easy+</span> —
                recevez-le sur WhatsApp ou Telegram, avec support pendant le
                voyage.
              </p>
            </div>

            {/* Colonne droite — mockup riche */}
            <div
              className="bg-card rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
            >
              {/* Header */}
              <div
                className="flex items-start justify-between gap-3 px-5 pt-5 pb-4"
                style={{ borderBottom: '0.5px solid #e5e7eb' }}
              >
                <div className="min-w-0">
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      marginBottom: '3px',
                    }}
                  >
                    Itinéraire 7 jours
                  </p>
                  <p
                    className="text-foreground truncate"
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    Cebu &amp; Mactan — Luxe et découvertes
                  </p>
                </div>
                <span
                  className="flex-shrink-0 inline-flex items-center px-2 py-1 rounded-md text-[11px]"
                  style={{
                    backgroundColor: '#F4F7FE',
                    color: '#3B5BDB',
                    fontWeight: 600,
                  }}
                >
                  ≈ 1 900 €
                </span>
              </div>

              {/* Jour 1 expanded */}
              <div className="px-5 pt-4 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center rounded-full text-[11px]"
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#F4F7FE',
                      color: '#3B5BDB',
                      fontWeight: 700,
                    }}
                  >
                    1
                  </span>
                  <p
                    className="text-foreground"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    Mactan
                  </p>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: 400,
                    }}
                  >
                    · Arrivée &amp; détente au resort
                  </span>
                </div>

                {/* Transport bar */}
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-3"
                  style={{ backgroundColor: '#f8fafc' }}
                >
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center rounded-md"
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#eff6ff',
                      color: '#3B5BDB',
                    }}
                    aria-hidden="true"
                  >
                    <BusIcon />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-foreground truncate"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    >
                      Transfert privé · Aéroport → Crimson Resort
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0"
                    style={{
                      fontSize: '10px',
                      color: '#64748b',
                      fontWeight: 500,
                    }}
                  >
                    25 min · 1 200 ₱
                  </span>
                </div>

                {/* Activités */}
                <ul className="flex flex-col gap-2">
                  {day1Activities.map((act) => (
                    <li
                      key={act.time}
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ border: '0.5px solid #e5e7eb' }}
                    >
                      <div
                        className="relative flex-shrink-0 rounded-md overflow-hidden"
                        style={{ width: '44px', height: '44px' }}
                      >
                        <Image
                          src={act.thumb}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <ClockIcon className="text-muted-foreground" />
                          <span
                            className="tabular-nums"
                            style={{
                              fontSize: '10px',
                              color: '#64748b',
                              fontWeight: 500,
                            }}
                          >
                            {act.time}
                          </span>
                        </div>
                        <p
                          className="text-foreground truncate"
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            lineHeight: 1.25,
                          }}
                        >
                          {act.title}
                        </p>
                      </div>
                      <span
                        className="flex-shrink-0 inline-flex items-center gap-0.5 text-accent"
                        style={{ fontSize: '11px', fontWeight: 600 }}
                      >
                        {act.rating}
                        <span style={{ fontSize: '9px' }}>★</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Jours suivants collapsed */}
              <div
                className="px-5 py-3"
                style={{
                  borderTop: '0.5px solid #e5e7eb',
                  backgroundColor: '#fafbff',
                }}
              >
                <ul className="flex flex-col gap-1.5">
                  {upcomingDays.map((d) => (
                    <li key={d.n} className="flex items-center gap-2.5">
                      <span
                        className="flex-shrink-0 inline-flex items-center justify-center rounded-full text-[10px]"
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: '#F4F7FE',
                          color: '#3B5BDB',
                          fontWeight: 700,
                        }}
                      >
                        {d.n}
                      </span>
                      <span
                        className="text-foreground flex-shrink-0"
                        style={{ fontSize: '12px', fontWeight: 600 }}
                      >
                        {d.location}
                      </span>
                      <span
                        className="truncate"
                        style={{
                          fontSize: '11px',
                          color: '#64748b',
                        }}
                      >
                        {d.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
