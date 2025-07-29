import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faPlane, faFerry, faBus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 'transport');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  return {
    title: page.title,
    description: page.subtitle,
  };
}

const TransportPage = async () => {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 'transport');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Se Déplacer aux"
        titlePart2="Philippines"
        titlePart2Color="accent"
        subtitle={page.subtitle || "Maîtrisez l'art de naviguer dans l'archipel, que ce soit par les airs, par la mer ou par la route."}
        imageUrl={page.hero_image_url || "/imagesHero/comment-voyager-aux-philippines.webp"}
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Options de Transport</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faPlane} value="Vols" label="Rapide et efficace pour les longues distances" color="accent" />
            <KeyStatCard icon={faFerry} value="Ferries" label="Économique et pittoresque pour l'inter-îles" color="primary" />
            <KeyStatCard icon={faBus} value="Bus & Vans" label="Idéal pour explorer une île en profondeur" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/transport/vue-aerienne-nuageuse.webp"
        imageAlt="Avion en vol au-dessus des nuages"
      >
        <h2>Les Vols <span className="text-accent">Intérieurs</span></h2>
        <p>Avec des compagnies comme Cebu Pacific, Philippine Airlines ou AirAsia, relier les îles principales est un jeu d'enfant. Les aéroports de Manille (MNL) et Cebu (CEB) sont les principaux hubs.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Conseil :</b> Réservez à l'avance pour les meilleurs tarifs.</li>
          <li><b>Bagages :</b> Attention aux franchises de bagages, souvent limitées.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport/vols" className="text-accent font-bold hover:underline mt-4 inline-block">Comparer les compagnies aériennes →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/transport/ferry-sur-mer-calme.webp"
          imageAlt="Ferry naviguant sur une mer calme"
          reverse
        >
          <h2>Les <span className="text-accent">Ferries</span> et Bateaux</h2>
          <p>Pour une expérience plus locale et économique, les ferries sont une excellente option. Des compagnies comme 2GO Travel desservent de nombreuses destinations. Pour les trajets plus courts, les "bangkas" (bateaux à balancier) sont omniprésentes.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Types :</b> Ferries rapides, RORO (Roll-on/Roll-off), bateaux lents.</li>
            <li><b>Sécurité :</b> Choisissez des compagnies réputées.</li>
        </ul>
          <Link href="/voyager-aux-philippines/transport/ferries" className="text-accent font-bold hover:underline mt-4 inline-block">Guide des voyages en ferry →</Link>
        </AlternatingContent>
      </div>

      <AlternatingContent
        imageUrl="/images/transport/jeepney-aux-philippines.webp"
        imageAlt="Bus de voyage sur une route de campagne"
      >
        <h2>Les Bus et <span className="text-accent">Vans</span></h2>
        <p>Pour explorer une île en profondeur, les bus et les vans sont incontournables. Les bus "Ceres" sont célèbres dans tout le pays. Pour plus de confort et de rapidité, les vans (V-Hire) sont une excellente alternative.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Types :</b> Bus climatisés ou non, vans partagés.</li>
          <li><b>Conseil :</b> Arrivez un peu en avance, les départs se font souvent quand le véhicule est plein.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport/bus" className="text-accent font-bold hover:underline mt-4 inline-block">Guide des voyages en bus →</Link>
      </AlternatingContent>
    </div>
  );
};

export default TransportPage;
