import { Metadata } from 'next';
import { PageHero, SplitSection } from '@/components/sections';
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

/* -------------------------------------------------------------------------- */
/* Pattern d'en-tête maison : eyebrow uppercase + h2 à mot(s) accentué(s).      */
/* Repris tel quel de la page visas-et-formalites (page de référence).         */
/* -------------------------------------------------------------------------- */
const SectionHeader = ({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
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
  </div>
);

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

      {/* Intro éditoriale — remplace l'ancienne bande de "stats" textuelles. */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Les saisons en un coup d'œil"
            title="Saison sèche ou saison des pluies :"
            accent="le vrai choix"
          />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Aux Philippines, la météo se résume à deux grandes saisons. De novembre à mai, la
              saison sèche (high season) offre un ciel dégagé et un risque de typhon faible. De
              juin à octobre, la saison des pluies (low season) apporte des averses plus
              fréquentes, mais aussi de la verdure et des prix plus doux. Toute l&apos;année, le
              thermomètre tourne autour de 28°C.
            </p>
            <p>
              Chaque saison a ses forces et ses compromis, détaillés dans les deux chapitres qui
              suivent — de quoi choisir la fenêtre qui colle à votre itinéraire.
            </p>
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow="Haute saison"
        imageUrl="/images/meteo/plage-tropicale-philippines.webp"
        imageAlt="Plage de sable blanc avec des palmiers"
        title="La saison sèche :"
        titleAccent="le moment idéal"
      >
        <p>
          De novembre à mai, le ciel reste généralement dégagé et le risque de typhon retombe
          au plus bas. La fenêtre classique pour les plages, la plongée et tout ce qui se fait
          dehors.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Avantages :</b> Météo idéale, toutes les îles accessibles.</li>
          <li><b>Inconvénients :</b> Plus de touristes, prix légèrement plus élevés.</li>
          <li><b>Idéal pour :</b> Plages, island hopping, festivals.</li>
        </ul>
        <p className="!mt-5">
          À l&apos;inverse, la saison des pluies redistribue les cartes — moins de monde, mais
          une autre météo à apprivoiser.
        </p>
        <Link href="/voyager-aux-philippines/palawan" className="text-accent font-bold hover:underline mt-4 inline-block">Découvrir Palawan en saison sèche →</Link>
      </SplitSection>

      <SplitSection
        eyebrow="Basse saison"
        imageUrl="/images/meteo/rizieres-philippines-nuageuses.webp"
        imageAlt="Rizières en terrasses verdoyantes sous un ciel nuageux"
        reverse
        tone="muted"
        title="La saison des pluies :"
        titleAccent="une autre facette"
      >
        <p>
          De juin à octobre, les averses reviennent plus souvent — intenses, mais rarement
          longues. En échange, la nature vire au vert éclatant et l&apos;archipel se vide d&apos;une
          partie de ses visiteurs.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Avantages :</b> Moins de monde, prix plus bas, paysages verdoyants.</li>
          <li><b>Inconvénients :</b> Risque de typhons, certaines liaisons maritimes peuvent être annulées.</li>
          <li><b>Idéal pour :</b> Rizières de Banaue, surf à Siargao, cascades.</li>
        </ul>
        <p className="!mt-5">
          De quoi transformer la contrainte météo en argument : rizières de Banaue, vagues de
          Siargao, et des prix qui respirent.
        </p>
        <Link href="/voyager-aux-philippines/siargao" className="text-accent font-bold hover:underline mt-4 inline-block">Explorer Siargao pendant la saison verte →</Link>
      </SplitSection>

    </div>
  );
};

export default QuandPartirPage;
