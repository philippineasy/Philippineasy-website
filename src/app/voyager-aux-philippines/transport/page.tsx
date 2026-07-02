import { Metadata } from 'next';
import { PageHero, SplitSection } from '@/components/sections';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'transport');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  const canonicalUrl = 'https://philippineasy.com/voyager-aux-philippines/transport';
  const description = page.subtitle || 'Guide complet des transports aux Philippines : vols intérieurs, ferries, bus et vans.';

  return {
    title: page.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: page.title,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description,
      site: '@philippineasy',
    },
  };
}

/* -------------------------------------------------------------------------- */
/* En-tête de section : eyebrow uppercase + h2 avec UN mot en amber vif.       */
/* Repris à l'identique du pattern validé sur                                  */
/* /vivre-aux-philippines/visas-et-formalites.                                 */
/* -------------------------------------------------------------------------- */
const SectionHeader = ({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
}) => (
  <div className="max-w-2xl">
    <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
      {eyebrow}
    </span>
    <h2
      className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
      style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
    >
      {title}
      {accent && (
        <>
          {' '}
          <span className="text-accent">{accent}</span>
        </>
      )}
    </h2>
    {description && (
      <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">{description}</p>
    )}
  </div>
);

const TransportPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'transport');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Se Déplacer aux"
        titleAccent="Philippines"
        subtitle={page.subtitle || "Maîtrisez l'art de naviguer dans l'archipel, que ce soit par les airs, par la mer ou par la route."}
        imageUrl={page.hero_image_url || "/imagesHero/comment-voyager-aux-philippines.webp"}
        imageAlt="Se Déplacer aux Philippines"
      />

      {/* Vue d'ensemble — bande muette remplaçant l'ancien StatRow non numérique */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Vue d'ensemble" title="Trois façons de" accent="voyager" />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Se déplacer aux Philippines demande un peu de méthode : l'archipel s'étend sur des
              milliers d'îles, et aucun mode de transport ne les dessert toutes à lui seul. Pour
              les longues distances entre régions, l'avion reste le plus rapide.
            </p>
            <p>
              Sur l'eau, les ferries prennent le relais à un rythme plus lent mais plus
              pittoresque. Et une fois posé sur une île, place aux bus et aux vans pour
              l'explorer en profondeur.
            </p>
          </div>
        </div>
      </section>

      {/* Chapitre 1 — Vols intérieurs */}
      <SplitSection
        eyebrow="Par les airs"
        title="Les Vols"
        titleAccent="Intérieurs"
        imageUrl="/images/transport/vue-aerienne-nuageuse.webp"
        imageAlt="Avion en vol au-dessus des nuages"
      >
        <p>
          Pour couvrir de grandes distances entre les principales régions de l'archipel, l'avion
          reste la solution la plus rapide. Cebu Pacific, Philippine Airlines ou AirAsia
          multiplient les liaisons entre les îles, avec Manille (MNL) et Cebu (CEB) comme
          principaux hubs.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Conseil :</b> Réservez à l'avance pour les meilleurs tarifs.</li>
          <li><b>Bagages :</b> Attention aux franchises de bagages, souvent limitées.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport/vols" className="text-accent font-bold hover:underline mt-4 inline-block">Comparer les compagnies aériennes →</Link>
      </SplitSection>

      {/* Chapitre 2 — Ferries et bateaux */}
      <SplitSection
        eyebrow="Sur l'eau"
        title="Les Ferries et Bateaux"
        imageUrl="/images/transport/ferry-sur-mer-calme.webp"
        imageAlt="Ferry naviguant sur une mer calme"
        reverse
        tone="muted"
      >
        <p>
          Une fois redescendu sur terre, direction la mer : pour une expérience plus locale et
          économique, les ferries sont une excellente option. Des compagnies comme 2GO Travel
          desservent de nombreuses destinations, et pour les trajets plus courts, les "bangkas"
          (bateaux à balancier) sont omniprésentes.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Types :</b> Ferries rapides, RORO (Roll-on/Roll-off), bateaux lents.</li>
          <li><b>Sécurité :</b> Choisissez des compagnies réputées.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport/ferries" className="text-accent font-bold hover:underline mt-4 inline-block">Guide des voyages en ferry →</Link>
      </SplitSection>

      {/* Chapitre 3 — Bus et vans */}
      <SplitSection
        eyebrow="Sur la route"
        title="Les Bus et"
        titleAccent="Vans"
        imageUrl="/images/transport/jeepney-aux-philippines.webp"
        imageAlt="Bus de voyage sur une route de campagne"
      >
        <p>
          Dernière étape une fois sur une île : la route. Les bus et les vans sont incontournables
          pour l'explorer en profondeur. Les bus "Ceres" sont célèbres dans tout le pays ; pour
          plus de confort et de rapidité, les vans (V-Hire) sont une excellente alternative.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Types :</b> Bus climatisés ou non, vans partagés.</li>
          <li><b>Conseil :</b> Arrivez un peu en avance, les départs se font souvent quand le véhicule est plein.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport/bus" className="text-accent font-bold hover:underline mt-4 inline-block">Guide des voyages en bus →</Link>
      </SplitSection>
    </div>
  );
};

export default TransportPage;
