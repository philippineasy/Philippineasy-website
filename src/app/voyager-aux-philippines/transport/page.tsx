import { Metadata } from 'next';
import { PageHero, SplitSection, StatRow } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faFerry, faBus } from '@fortawesome/free-solid-svg-icons';
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

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Options de Transport</h2>
          <div className="flex justify-center">
            <StatRow
              stats={[
                { value: 'Vols', label: 'Rapide et efficace pour les longues distances', icon: <FontAwesomeIcon icon={faPlane} className="text-[18px]" /> },
                { value: 'Ferries', label: "Économique et pittoresque pour l'inter-îles", icon: <FontAwesomeIcon icon={faFerry} className="text-[18px]" /> },
                { value: 'Bus & Vans', label: 'Idéal pour explorer une île en profondeur', icon: <FontAwesomeIcon icon={faBus} className="text-[18px]" /> },
              ]}
            />
          </div>
        </div>
      </section>

      <SplitSection
        title="Les Vols"
        titleAccent="Intérieurs"
        imageUrl="/images/transport/vue-aerienne-nuageuse.webp"
        imageAlt="Avion en vol au-dessus des nuages"
      >
        <p>Avec des compagnies comme Cebu Pacific, Philippine Airlines ou AirAsia, relier les îles principales est un jeu d'enfant. Les aéroports de Manille (MNL) et Cebu (CEB) sont les principaux hubs.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Conseil :</b> Réservez à l'avance pour les meilleurs tarifs.</li>
          <li><b>Bagages :</b> Attention aux franchises de bagages, souvent limitées.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport/vols" className="text-accent font-bold hover:underline mt-4 inline-block">Comparer les compagnies aériennes →</Link>
      </SplitSection>

      <SplitSection
        title="Les Ferries et Bateaux"
        imageUrl="/images/transport/ferry-sur-mer-calme.webp"
        imageAlt="Ferry naviguant sur une mer calme"
        reverse
        tone="muted"
      >
        <p>Pour une expérience plus locale et économique, les ferries sont une excellente option. Des compagnies comme 2GO Travel desservent de nombreuses destinations. Pour les trajets plus courts, les "bangkas" (bateaux à balancier) sont omniprésentes.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Types :</b> Ferries rapides, RORO (Roll-on/Roll-off), bateaux lents.</li>
          <li><b>Sécurité :</b> Choisissez des compagnies réputées.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport/ferries" className="text-accent font-bold hover:underline mt-4 inline-block">Guide des voyages en ferry →</Link>
      </SplitSection>

      <SplitSection
        title="Les Bus et"
        titleAccent="Vans"
        imageUrl="/images/transport/jeepney-aux-philippines.webp"
        imageAlt="Bus de voyage sur une route de campagne"
      >
        <p>Pour explorer une île en profondeur, les bus et les vans sont incontournables. Les bus "Ceres" sont célèbres dans tout le pays. Pour plus de confort et de rapidité, les vans (V-Hire) sont une excellente alternative.</p>
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
