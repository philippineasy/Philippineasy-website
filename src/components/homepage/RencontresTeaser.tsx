import Link from 'next/link';

type Profile = {
  name: string;
  age: number;
  city: string;
  distance: string;
  tags: string[];
  avatarColor: string;
  initial: string;
  portraitGradient: [string, string];
};

// TODO: brancher sur GET /api/rencontres/teaser-profiles
// (4 profils verified=true AND show_in_teaser=true) une fois la migration
// dating_profiles.show_in_teaser appliquee. Fallback statique en attendant.
const profiles: Profile[] = [
  {
    name: 'Maria',
    age: 26,
    city: 'Cebu',
    distance: '2 km',
    tags: ['Café', 'Plage'],
    avatarColor: '#F59E0B',
    initial: 'M',
    portraitGradient: ['#fbcfe8', '#ec4899'],
  },
  {
    name: 'Andrea',
    age: 29,
    city: 'Manille',
    distance: '12 km',
    tags: ['Voyage', 'Musique'],
    avatarColor: '#EC4899',
    initial: 'A',
    portraitGradient: ['#bfdbfe', '#3b5bdb'],
  },
  {
    name: 'Sofia',
    age: 24,
    city: 'Palawan',
    distance: 'En ligne',
    tags: ['Nature', 'Photo'],
    avatarColor: '#10B981',
    initial: 'S',
    portraitGradient: ['#bbf7d0', '#10b981'],
  },
  {
    name: 'Gabriela',
    age: 31,
    city: 'Davao',
    distance: '8 km',
    tags: ['Yoga', 'Arts'],
    avatarColor: '#3B5BDB',
    initial: 'G',
    portraitGradient: ['#fde68a', '#ea580c'],
  },
];

// Position presets per card index (proto exact)
const cardPositions = [
  { top: '0', leftPct: 50, translateX: '-50%', rotate: -5, z: 1 },
  { top: '30px', left: '0', rotate: -2, z: 2 },
  { top: '60px', right: '0', rotate: 4, z: 3 },
  { top: '200px', leftPct: 50, translateX: '-50%', rotate: 2, z: 4 },
];

const PinIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="flex-shrink-0"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CheckSmall = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// SVG portrait placeholder (gradient + soft silhouette) per profile
const PortraitSVG = ({ from, to, name }: { from: string; to: string; name: string }) => (
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    role="img"
    aria-label={`Portrait stylise de ${name}`}
  >
    <defs>
      <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
    </defs>
    <rect width="240" height="160" fill={`url(#grad-${name})`} />
    {/* Stylized silhouette */}
    <g fill="#ffffff" opacity="0.18">
      <circle cx="120" cy="60" r="28" />
      <path d="M 60 160 Q 60 110, 120 105 Q 180 110, 180 160 Z" />
    </g>
    {/* Decorative sparkles */}
    <g fill="#ffffff" opacity="0.4">
      <circle cx="40" cy="30" r="2" />
      <circle cx="200" cy="40" r="2.5" />
      <circle cx="180" cy="120" r="1.5" />
      <circle cx="50" cy="135" r="2" />
    </g>
  </svg>
);

export const RencontresTeaser = () => {
  return (
    <section
      className="py-20 md:py-24"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #FDF4FF 100%)',
      }}
    >
      <div className="container mx-auto px-4">
        <div
          className="max-w-6xl mx-auto grid items-center gap-10 md:gap-[60px]"
          style={{ gridTemplateColumns: '1fr' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-[60px]">
            {/* Left — copy */}
            <div>
              <span
                className="inline-block text-[13px] font-medium uppercase tracking-[0.08em] mb-2.5"
                style={{ color: '#BE185D' }}
              >
                <span className="mr-1.5" aria-hidden="true">✦</span>
                Rencontres · +40 000 membres
              </span>

              <h2
                className="text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground mb-4"
                style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
              >
                Trouvez{' '}
                <span style={{ color: '#EC4899' }}>l&apos;amour</span> aux
                Philippines
              </h2>

              <p className="text-[17px] text-muted-foreground leading-[1.6]">
                La première communauté francophone pour faire des rencontres
                sérieuses avec des Philippines et Philippins. Profils vérifiés,
                modération humaine, matchs basés sur la compatibilité culturelle.
              </p>

              <ul className="flex flex-col gap-2.5 mt-5" role="list">
                {[
                  'Profils vérifiés manuellement (ID + selfie)',
                  'Traduction automatique FR ↔ EN ↔ Tagalog',
                  'Conseils culturels pour les premières conversations',
                ].map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2.5 text-[15px]"
                    style={{ color: '#334155' }}
                  >
                    <span
                      className="inline-flex w-[22px] h-[22px] items-center justify-center rounded-full text-emerald-700 flex-shrink-0"
                      style={{ backgroundColor: '#D1FAE5' }}
                      aria-hidden="true"
                    >
                      <CheckSmall />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2.5 mt-5">
                <Link
                  href="/rencontre-philippines/inscription"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-base shadow-sm transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Créer mon profil gratuit
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/rencontre-philippines"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-card text-foreground border border-border rounded-lg font-medium text-base transition-all duration-200 hover:bg-accent/10 hover:border-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Voir les profils
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8 pt-6 border-t border-border/60">
                {[
                  { value: '40k+', label: 'membres actifs' },
                  { value: '1 800', label: 'couples formés' },
                  { value: '4,8 ★', label: 'App Store' },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <strong
                      className="text-[26px] font-bold text-foreground tabular-nums"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {s.value}
                    </strong>
                    <span
                      className="text-[12px] text-muted-foreground uppercase"
                      style={{ letterSpacing: '0.06em' }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual stack */}
            <div className="relative min-h-[520px] md:min-h-[520px]">
              {/* Mobile: grid 2×2 fallback (no rotation per a11y) */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                {profiles.map((p) => (
                  <ProfileCard key={p.name} profile={p} />
                ))}
              </div>

              {/* Desktop: fanned absolute stack */}
              <div
                className="hidden md:block relative w-full max-w-[460px] mx-auto h-[480px]"
                role="presentation"
              >
                {profiles.map((p, i) => {
                  const pos = cardPositions[i];
                  const transformParts = [];
                  if (pos.translateX) transformParts.push(`translateX(${pos.translateX})`);
                  transformParts.push(`rotate(${pos.rotate}deg)`);

                  return (
                    <div
                      key={p.name}
                      className="absolute w-[240px] motion-reduce:!rotate-0 motion-reduce:!translate-x-0 motion-reduce:relative motion-reduce:!top-0 motion-reduce:!left-0 motion-reduce:!right-0 hover:[&]:!rotate-0 hover:!-translate-y-1.5 hover:z-30 transition-transform duration-300 ease-out motion-reduce:transition-none"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        right: pos.right,
                        zIndex: pos.z,
                        transform: transformParts.join(' '),
                      }}
                    >
                      <ProfileCard profile={p} />
                    </div>
                  );
                })}
              </div>

              {/* Floating "matches" badge */}
              <div
                className="absolute bottom-2 left-0 md:-left-2 z-20 max-w-[220px] flex items-center gap-2.5 bg-card rounded-[14px] px-4 py-3 shadow-hero"
              >
                <span className="text-[22px]" aria-hidden="true">💬</span>
                <div className="min-w-0">
                  <strong className="block text-[13px] font-bold text-foreground">
                    23 nouveaux matchs
                  </strong>
                  <span className="text-[11px] text-muted-foreground leading-[1.4] block">
                    aujourd&apos;hui dans votre région
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

const ProfileCard = ({ profile }: { profile: Profile }) => {
  const [from, to] = profile.portraitGradient;
  const isOnline = profile.distance === 'En ligne';

  return (
    <div className="bg-card rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(236,72,153,0.18),0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer">
      <div className="relative h-[160px] flex items-end justify-between p-2.5">
        <PortraitSVG from={from} to={to} name={profile.name} />
        {/* Avatar overlay bottom-left */}
        <span
          className="relative z-10 inline-flex w-[42px] h-[42px] rounded-full items-center justify-center text-white font-bold text-[18px] flex-shrink-0"
          style={{
            background: profile.avatarColor,
            border: '3px solid #fff',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          }}
          aria-hidden="true"
        >
          {profile.initial}
        </span>
        {/* Distance/online pill bottom-right */}
        <span
          className="relative z-10 inline-flex items-center gap-1.5 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-1 rounded-full"
          style={{ background: 'rgba(0, 0, 0, 0.78)' }}
        >
          {isOnline && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#10B981',
                boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)',
              }}
              aria-hidden="true"
            />
          )}
          {profile.distance}
        </span>
      </div>
      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-center gap-1.5">
          <strong
            className="text-[15px] font-bold text-foreground"
            style={{ letterSpacing: '-0.01em' }}
          >
            {profile.name}, {profile.age}
          </strong>
          <span
            className="inline-flex w-4 h-4 rounded-full items-center justify-center bg-primary text-white text-[10px] font-bold"
            title="Profil vérifié"
            aria-label="Profil vérifié"
          >
            ✓
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1 mb-2">
          <PinIcon />
          {profile.city}
        </div>
        <div className="flex flex-wrap gap-1">
          {profile.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: '#FDF4FF', color: '#9F1239' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
