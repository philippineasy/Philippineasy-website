import { Metadata } from 'next';
import { PageHero, StatRow, SplitSection } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudShowersHeavy, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'quand-partir');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  const canonicalUrl = 'https://philippineasy.com/voyager-aux-philippines/quand-partir';
  const description = page.subtitle || 'Guide complet sur la meilleure période pour visiter les Philippines selon la météo et vos envies.';

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

const QuandPartirPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'quand-partir');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Quand Partir aux"
        titleAccent="Philippines"
        subtitle={page.subtitle || "Le guide ultime pour choisir la période idéale en fonction de la météo, de l'affluence et de vos envies."}
        imageUrl={page.hero_image_url || "/imagesHero/meteo-contrastee-aux-philippines.webp"}
        imageAlt="Quand Partir aux Philippines"
      />

      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Saisons en un Clin d'Œil</h2>
          <StatRow
            tone="default"
            stats={[
              {
                icon: <FontAwesomeIcon icon={faSun} className="text-[18px]" />,
                value: 'Nov - Mai',
                label: 'Saison Sèche (High Season)',
              },
              {
                icon: <FontAwesomeIcon icon={faCloudShowersHeavy} className="text-[18px]" />,
                value: 'Juin - Oct',
                label: 'Saison des Pluies (Low Season)',
              },
              {
                icon: <FontAwesomeIcon icon={faTemperatureHigh} className="text-[18px]" />,
                value: '28°C',
                label: 'Température moyenne annuelle',
              },
            ]}
          />
        </div>
      </div>

      <SplitSection
        imageUrl="/images/meteo/plage-tropicale-philippines.webp"
        imageAlt="Plage de sable blanc avec des palmiers"
        title="La Saison Sèche :"
        titleAccent="Le Moment Idéal"
      >
        <p>De novembre à mai, c'est la période parfaite pour profiter des plages, de la plongée et des activités en plein air. Le ciel est généralement dégagé et les risques de typhons sont faibles.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Avantages :</b> Météo idéale, toutes les îles accessibles.</li>
          <li><b>Inconvénients :</b> Plus de touristes, prix légèrement plus élevés.</li>
          <li><b>Idéal pour :</b> Plages, island hopping, festivals.</li>
        </ul>
        <Link href="/voyager-aux-philippines/palawan" className="text-accent font-bold hover:underline mt-4 inline-block">Découvrir Palawan en saison sèche →</Link>
      </SplitSection>

      <SplitSection
        imageUrl="/images/meteo/rizieres-philippines-nuageuses.webp"
        imageAlt="Rizières en terrasses verdoyantes sous un ciel nuageux"
        reverse
        tone="muted"
        title="La Saison des Pluies :"
        titleAccent="Une Autre Facette"
      >
        <p>De juin à octobre, les pluies sont plus fréquentes, souvent sous forme d'averses intenses mais courtes. C'est une période où la nature est luxuriante et les paysages d'un vert éclatant.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Avantages :</b> Moins de monde, prix plus bas, paysages verdoyants.</li>
          <li><b>Inconvénients :</b> Risque de typhons, certaines liaisons maritimes peuvent être annulées.</li>
          <li><b>Idéal pour :</b> Rizières de Banaue, surf à Siargao, cascades.</li>
        </ul>
        <Link href="/voyager-aux-philippines/siargao" className="text-accent font-bold hover:underline mt-4 inline-block">Explorer Siargao pendant la saison verte →</Link>
      </SplitSection>

    </div>
  );
};

export default QuandPartirPage;
