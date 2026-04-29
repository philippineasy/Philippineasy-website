import Image from 'next/image';
import Link from 'next/link';

interface ItineraryHeroProps {
  name: string;
  recommendedDays: number | null;
  budgetMidrange: number | null;
  heroImage: string | null;
  heroImageAlt: string | null;
}

export function ItineraryHero({
  name,
  recommendedDays,
  budgetMidrange,
  heroImage,
  heroImageAlt,
}: ItineraryHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[480px] w-full overflow-hidden">
      {heroImage ? (
        <Image
          src={heroImage}
          alt={heroImageAlt || `Itinéraire ${name}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-cyan-500" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-12 pt-24 text-white sm:px-6">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Itinéraire {name}&nbsp;: Guide Jour par Jour
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-base">
          {recommendedDays && (
            <span className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
              {recommendedDays} jour{recommendedDays > 1 ? 's' : ''} recommandés
            </span>
          )}
          {budgetMidrange && (
            <span className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
              ~{budgetMidrange} €/jour (mid-range)
            </span>
          )}
          <span className="rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
            Mis à jour {new Date().getFullYear()}
          </span>
        </div>
        <div className="mt-6">
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600"
          >
            Créer mon itinéraire personnalisé avec l&apos;IA
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
