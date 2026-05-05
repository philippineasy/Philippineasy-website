import Image from 'next/image';
import Link from 'next/link';

interface ItineraryHeroProps {
  name: string;
  recommendedDays: number | null;
  budgetMidrange: number | null;
  bestSeason?: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
}

const PillIcon = ({ d }: { d: string }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="opacity-90"
  >
    <path d={d} />
  </svg>
);

export function ItineraryHero({
  name,
  recommendedDays,
  budgetMidrange,
  bestSeason,
  heroImage,
  heroImageAlt,
}: ItineraryHeroProps) {
  return (
    <section className="relative w-full overflow-hidden h-[78vh] min-h-[560px] md:min-h-[640px]">
      {heroImage ? (
        <Image
          src={heroImage}
          alt={heroImageAlt || `Itinéraire ${name} aux Philippines`}
          fill
          priority
          fetchPriority="high"
          className="object-cover z-0"
          sizes="100vw"
          quality={78}
        />
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
          }}
        />
      )}

      {/* Overlay gradient pour lisibilite — meme courbe que home (10,20,50) */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(10,20,50,0.25) 0%, rgba(10,20,50,0.40) 50%, rgba(10,20,50,0.78) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Cercles dashed decoratifs — signature pattern home */}
      <span
        className="absolute pointer-events-none rounded-full z-10 hidden md:block"
        style={{
          width: '440px',
          height: '440px',
          top: '-160px',
          right: '-140px',
          border: '2px dashed rgba(255, 255, 255, 0.18)',
        }}
        aria-hidden="true"
      />
      <span
        className="absolute pointer-events-none rounded-full z-10 hidden md:block"
        style={{
          width: '260px',
          height: '260px',
          bottom: '-90px',
          left: '-60px',
          border: '2px dashed rgba(255, 255, 255, 0.13)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 md:pb-20">
        {/* Eyebrow uppercase + etoile accent — exact pattern home */}
        <span
          className="inline-flex items-center gap-2 mb-5 text-[12px] sm:text-[13px] font-medium uppercase"
          style={{
            color: 'rgba(255, 255, 255, 0.78)',
            letterSpacing: '0.10em',
          }}
        >
          <span className="text-accent text-base" aria-hidden="true">★</span>
          Itinéraire {name}
          <span aria-hidden="true" className="opacity-50 mx-0.5">·</span>
          <span>Mis à jour {new Date().getFullYear()}</span>
        </span>

        <h1
          className="text-white font-semibold mb-5 max-w-3xl"
          style={{
            fontSize: 'clamp(2.25rem, 6vw, 3.75rem)',
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
          }}
        >
          {name},{' '}
          <span className="text-accent">jour par jour</span>
        </h1>

        <p
          className="text-base md:text-lg max-w-xl mb-7"
          style={{
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.55,
            letterSpacing: '0.005em',
          }}
        >
          Le guide francophone complet pour préparer votre voyage à {name} —
          activités, hébergements, budget et conseils terrain.
        </p>

        {/* Pills horizontaux — info clefs en visuel, pas en bloc texte */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {recommendedDays && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.13)',
                border: '0.5px solid rgba(255, 255, 255, 0.20)',
              }}
            >
              <PillIcon d="M12 8v4l3 2M12 22a10 10 0 110-20 10 10 0 010 20z" />
              {recommendedDays} jour{recommendedDays > 1 ? 's' : ''} recommandés
            </span>
          )}
          {budgetMidrange && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.13)',
                border: '0.5px solid rgba(255, 255, 255, 0.20)',
              }}
            >
              <PillIcon d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              ~{budgetMidrange} €/jour mid-range
            </span>
          )}
          {bestSeason && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.13)',
                border: '0.5px solid rgba(255, 255, 255, 0.20)',
              }}
            >
              <PillIcon d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 7a5 5 0 100 10 5 5 0 000-10z" />
              {bestSeason.length > 32 ? `${bestSeason.slice(0, 32)}…` : bestSeason}
            </span>
          )}
        </div>

        {/* CTAs — orange brand (CTA primaire) + secondaire ghost */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-ink rounded-lg font-semibold text-[15px] shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
            </svg>
            Personnaliser cet itinéraire
          </Link>
          <a
            href="#itineraire-jour-par-jour"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-[14px] text-white backdrop-blur-md transition-all duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.10)',
              border: '0.5px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            Voir l&apos;itinéraire
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
