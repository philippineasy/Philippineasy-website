import Image from 'next/image';
import Link from 'next/link';
import type { DestinationItinerarySummary } from '@/types/destinationItineraries';

interface RelatedItinerariesProps {
  related: DestinationItinerarySummary[];
}

export function RelatedItineraries({ related }: RelatedItinerariesProps) {
  if (!related.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">Itinéraires liés</h2>
      <p className="mt-1 text-sm text-slate-600">
        D&apos;autres destinations qui pourraient compléter ce voyage.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <Link
            key={item.slug}
            href={`/itineraire-${item.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              {item.hero_image && (
                <Image
                  src={item.hero_image}
                  alt={`Itinéraire ${item.name}`}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-900">Itinéraire {item.name}</h3>
              {item.recommended_days && (
                <p className="mt-1 text-xs text-slate-500">
                  {item.recommended_days} jour{item.recommended_days > 1 ? 's' : ''}
                </p>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                {item.meta_description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
