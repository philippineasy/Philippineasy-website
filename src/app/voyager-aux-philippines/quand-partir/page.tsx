import { Metadata } from 'next';
import { HeroThematic } from '@/components/ui/HeroThematic';
import { AlternatingContent } from '@/components/ui/AlternatingContent';
import { KeyStatCard } from '@/components/ui/KeyStatCard';
import { faSun, faCloudShowersHeavy, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 'quand-partir');

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

const QuandPartirPage = async () => {
  const supabase = createClient();
  const { data: page } = await getPageBySlug(supabase, 'quand-partir');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <HeroThematic
        titlePart1="Quand Partir aux"
        titlePart2="Philippines"
        titlePart2Color="accent"
        subtitle={page.subtitle || "Le guide ultime pour choisir la période idéale en fonction de la météo, de l'affluence et de vos envies."}
        imageUrl={page.hero_image_url || "/imagesHero/meteo-contrastee-aux-philippines.webp"}
      />

      <div className="bg-muted py-20 -mt-20 relative z-20 rounded-t-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Saisons en un Clin d'Œil</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyStatCard icon={faSun} value="Nov - Mai" label="Saison Sèche (High Season)" color="accent" />
            <KeyStatCard icon={faCloudShowersHeavy} value="Juin - Oct" label="Saison des Pluies (Low Season)" color="primary" />
            <KeyStatCard icon={faTemperatureHigh} value="28°C" label="Température moyenne annuelle" color="accent" />
          </div>
        </div>
      </div>

      <AlternatingContent
        imageUrl="/images/meteo/plage-tropicale-philippines.webp"
        imageAlt="Plage de sable blanc avec des palmiers"
      >
        <h2>La Saison Sèche : <span className="text-accent">Le Moment Idéal</span></h2>
        <p>De novembre à mai, c'est la période parfaite pour profiter des plages, de la plongée et des activités en plein air. Le ciel est généralement dégagé et les risques de typhons sont faibles.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Avantages :</b> Météo idéale, toutes les îles accessibles.</li>
          <li><b>Inconvénients :</b> Plus de touristes, prix légèrement plus élevés.</li>
          <li><b>Idéal pour :</b> Plages, island hopping, festivals.</li>
        </ul>
        <Link href="/voyager-aux-philippines/palawan" className="text-accent font-bold hover:underline mt-4 inline-block">Découvrir Palawan en saison sèche →</Link>
      </AlternatingContent>

      <div className="bg-muted">
        <AlternatingContent
          imageUrl="/images/meteo/rizieres-philippines-nuageuses.webp"
          imageAlt="Rizières en terrasses verdoyantes sous un ciel nuageux"
          reverse
        >
          <h2>La Saison des Pluies : <span className="text-accent">Une Autre Facette</span></h2>
          <p>De juin à octobre, les pluies sont plus fréquentes, souvent sous forme d'averses intenses mais courtes. C'est une période où la nature est luxuriante et les paysages d'un vert éclatant.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Avantages :</b> Moins de monde, prix plus bas, paysages verdoyants.</li>
            <li><b>Inconvénients :</b> Risque de typhons, certaines liaisons maritimes peuvent être annulées.</li>
            <li><b>Idéal pour :</b> Rizières de Banaue, surf à Siargao, cascades.</li>
        </ul>
          <Link href="/voyager-aux-philippines/siargao" className="text-accent font-bold hover:underline mt-4 inline-block">Explorer Siargao pendant la saison verte →</Link>
        </AlternatingContent>
      </div>

    </div>
  );
};

export default QuandPartirPage;
