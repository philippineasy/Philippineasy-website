import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getAllPublishedItineraries } from '@/services/destinationItinerariesService';
import type { DestinationItinerarySummary } from '@/types/destinationItineraries';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Itinéraires Philippines : Tous nos guides jour par jour',
  description:
    'Découvrez tous nos itinéraires Philippines : Palawan, Cebu, Siargao, Boracay, Bohol. Guides complets jour par jour, budgets, conseils d\'expat français.',
  alternates: { canonical: 'https://philippineasy.com/itineraires-philippines' },
  openGraph: {
    title: 'Itinéraires Philippines : Tous nos guides jour par jour',
    description:
      'Tous nos itinéraires Philippines : Palawan, Cebu, Siargao, Boracay, Bohol. Guides détaillés et budgets terrain.',
    url: 'https://philippineasy.com/itineraires-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  destination: 'Par destination',
  duration: 'Par durée',
  profile: 'Par profil',
};

function groupByCategory(items: DestinationItinerarySummary[]) {
  const order: Array<keyof typeof CATEGORY_LABELS> = ['destination', 'duration', 'profile'];
  const groups: Record<string, DestinationItinerarySummary[]> = {};
  for (const cat of order) groups[cat] = [];
  for (const item of items) {
    const cat = (item.category as string) || 'destination';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }
  return groups;
}

export default async function ItinerairesHubPage() {
  const supabase = await createClient();
  const itineraries = await getAllPublishedItineraries(supabase);
  const grouped = groupByCategory(itineraries);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Itinéraires Philippines
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">
          Tous nos guides jour par jour pour planifier votre voyage aux Philippines. Budgets
          terrain, hébergements testés, conseils d&apos;un expatrié français basé sur place.
        </p>
        <div className="mt-6">
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600"
          >
            Créer mon itinéraire personnalisé avec l&apos;IA
            <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      {itineraries.length === 0 ? (
        <p className="rounded-xl bg-blue-50 p-6 text-blue-900">
          Les itinéraires arrivent prochainement. En attendant, créez le vôtre sur mesure avec{' '}
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="font-semibold underline"
          >
            notre générateur IA
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-12">
          {(Object.keys(grouped) as Array<keyof typeof CATEGORY_LABELS>).map((cat) => {
            const list = grouped[cat] || [];
            if (!list.length) return null;
            return (
              <section key={cat}>
                <h2 className="mb-5 text-2xl font-bold text-slate-900">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/itineraire-${item.slug}`}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
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
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Itinéraire {item.name}
                        </h3>
                        {item.recommended_days && (
                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                            {item.recommended_days} jour{item.recommended_days > 1 ? 's' : ''}
                          </p>
                        )}
                        <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                          {item.meta_description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
