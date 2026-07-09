import Image from 'next/image';
import Link from 'next/link';
import type { DestinationItinerarySummary } from '@/types/destinationItineraries';

interface RelatedItinerariesProps {
  related: DestinationItinerarySummary[];
}

export function RelatedItineraries({ related }: RelatedItinerariesProps) {
  if (!related.length) return null;

  return (
    <section aria-labelledby="related-heading">
      <span
        className="block text-[12px] font-bold uppercase text-primary mb-2"
        style={{ letterSpacing: '0.10em' }}
      >
        ✦ Continuer le voyage
      </span>
      <h2
        id="related-heading"
        className="text-ink font-semibold mb-2"
        style={{
          fontSize: 'clamp(1.625rem, 3vw, 2.125rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        D&apos;autres itinéraires qui pourraient compléter
      </h2>
      <p className="text-[15px] text-muted-foreground mb-7 max-w-2xl">
        Des destinations qui combinent parfaitement avec celle-ci pour un
        voyage plus long ou plus complet.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((item) => (
          <Link
            key={item.slug}
            href={`/itineraire-${item.slug}`}
            className="group relative block rounded-2xl overflow-hidden bg-card border-[0.5px] border-border shadow-card-rest transition-all duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-soft-blue">
              {item.hero_image ? (
                <Image
                  src={item.hero_image}
                  alt={`Itinéraire ${item.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
              )}

              {/* Overlay gradient pour lisibilite des pills */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(to top, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.10) 50%, transparent 100%)',
                }}
                aria-hidden="true"
              />

              {/* Badge duree en overlay haut-droite */}
              {item.recommended_days && (
                <span
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[11.5px] font-semibold backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.72)' }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 8v4l3 2M12 22a10 10 0 110-20 10 10 0 010 20z" />
                  </svg>
                  {item.recommended_days} j.
                </span>
              )}

              {/* Nom destination overlay bottom — comme RegionCards */}
              <div className="absolute bottom-3 left-3 right-3">
                <span
                  className="block text-white font-semibold"
                  style={{
                    fontSize: '20px',
                    letterSpacing: '-0.015em',
                    lineHeight: 1.15,
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  {item.name}
                </span>
              </div>
            </div>

            <div className="px-4 pt-3.5 pb-4">
              <p
                className="text-[13.5px] text-muted-foreground line-clamp-2 mb-2.5"
                style={{ lineHeight: 1.55 }}
              >
                {item.meta_description}
              </p>
              <span
                className="inline-flex items-center gap-1 text-primary text-[13px] font-semibold"
              >
                Voir l&apos;itinéraire
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
