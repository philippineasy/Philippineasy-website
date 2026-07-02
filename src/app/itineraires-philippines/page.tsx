import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getAllPublishedItineraries } from '@/services/destinationItinerariesService';
import type { DestinationItinerarySummary } from '@/types/destinationItineraries';
import { PageHero, CardGrid, LinkCard, CTABand } from '@/components/sections';

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
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Itinéraires"
        titleAccent="Philippines"
        subtitle="Tous nos guides jour par jour pour planifier votre voyage aux Philippines. Budgets terrain, hébergements testés, conseils d'un expatrié français basé sur place."
        imageUrl="/imagesHero/philippines-itineraire-multi-iles.webp"
        imageAlt="Itinéraires Philippines"
      />

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          {itineraries.length === 0 ? (
            <p className="mx-auto max-w-2xl rounded-2xl border-[0.5px] border-border bg-soft-blue p-6 text-center text-foreground shadow-card-rest">
              Les itinéraires arrivent prochainement. En attendant, créez le vôtre sur mesure avec{' '}
              <Link
                href="/itineraire-personnalise-pour-les-philippines"
                className="font-semibold text-primary underline"
              >
                notre générateur IA
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-col gap-16">
              {(Object.keys(grouped) as Array<keyof typeof CATEGORY_LABELS>).map((cat) => {
                const list = grouped[cat] || [];
                if (!list.length) return null;
                return (
                  <CardGrid key={cat} title={CATEGORY_LABELS[cat]} columns={3}>
                    {list.map((item) => (
                      <LinkCard
                        key={item.slug}
                        href={`/itineraire-${item.slug}`}
                        title={`Itinéraire ${item.name}`}
                        desc={
                          item.recommended_days
                            ? `${item.recommended_days} jour${item.recommended_days > 1 ? 's' : ''} · ${item.meta_description}`
                            : item.meta_description
                        }
                        cta="Voir l'itinéraire"
                        image={{
                          src: item.hero_image || '/imagesHero/philippines-itineraire-multi-iles.webp',
                          alt: `Itinéraire ${item.name}`,
                        }}
                      />
                    ))}
                  </CardGrid>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CTABand
        title="Envie d'un itinéraire"
        titleAccent="sur-mesure ?"
        subtitle="Notre IA crée votre parcours personnalisé en 30 secondes : dates, budget, régions, rythme de voyage."
        primary={{
          label: 'Créer mon itinéraire IA',
          href: '/itineraire-personnalise-pour-les-philippines',
        }}
      />
    </div>
  );
}
