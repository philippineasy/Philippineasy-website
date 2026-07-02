import { Metadata } from 'next';
import { PageHero, SplitSection } from '@/components/sections';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import { KlookCarousel } from '@/components/affiliate/KlookCarousel';
import { cebuActivities } from '@/components/affiliate/klook-activities-data';

export const metadata: Metadata = {
  title: 'Cebu et les Visayas : Le Cœur des Philippines',
  description: 'Explorez Cebu et la région des Visayas, un archipel vibrant au cœur des Philippines. Découvrez des plages de sable blanc, une histoire riche et une culture unique.',
  alternates: {
    canonical: 'https://philippineasy.com/voyager-aux-philippines/cebu-visayas',
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
    title: 'Cebu et les Visayas : Le Cœur des Philippines',
    description: 'Explorez Cebu et la région des Visayas, un archipel vibrant au cœur des Philippines.',
    url: 'https://philippineasy.com/voyager-aux-philippines/cebu-visayas',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cebu et les Visayas : Le Cœur des Philippines',
    description: 'Explorez Cebu et la région des Visayas, un archipel vibrant au cœur des Philippines.',
    site: '@philippineasy',
  },
};

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

const CebuVisayasPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'cebu-visayas');

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Cebu et les Visayas"
        titleAccent="Le Cœur de l'Archipel"
        subtitle="Plongez au cœur de la culture philippine, entre plages paradisiaques et patrimoine historique."
        imageUrl="/images/voyager/iles-philippines-aeriennes.webp"
        imageAlt="Cebu et les Visayas Le Cœur de l'Archipel"
      />

      {/* Intro éditoriale — remplace l'ancienne bande de "stats" textuelles. */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Les Visayas en un coup d'œil"
            title="Cebu, Bohol, Siquijor :"
            accent="trois identités"
          />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Cebu, Bohol et Siquijor n&apos;ont pas grand-chose en commun. Cebu joue les
              carrefours économiques et culturels de la région, Bohol aligne Chocolate Hills et
              tarsiers minuscules, et Siquijor cultive sa réputation d&apos;île mystique, entre
              guérisseurs traditionnels et plages désertes.
            </p>
            <p>
              De la plongée à Malapascua et Moalboal aux chutes de Kawasan, en passant par la
              Croix de Magellan à Cebu, les Visayas cumulent les bonnes raisons de s&apos;attarder.
              Les deux chapitres qui suivent détaillent d&apos;abord ces trois îles, puis les
              expériences à ne pas manquer sur place.
            </p>
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow="Trois îles, trois ambiances"
        imageUrl="/images/palawan/bateau-bangka-el-nido.webp"
        imageAlt="Bateau traditionnel Bangka"
        title="Une mosaïque d'îles"
        titleAccent="inoubliables"
      >
        <p>
          La région des Visayas rassemble un ensemble d&apos;îles aux ambiances contrastées. De
          l&apos;effervescence de Cebu City aux plages tranquilles de Siquijor, chaque escale a
          son propre tempo.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Cebu :</b> Le carrefour économique et culturel de la région.</li>
          <li><b>Bohol :</b> Célèbre pour ses Chocolate Hills et ses minuscules tarsiers.</li>
          <li><b>Siquijor :</b> Une île mystique réputée pour ses guérisseurs et ses plages désertes.</li>
        </ul>
        <p className="!mt-5">
          Ces trois îles s&apos;enchaînent bien sur un même circuit — reste à savoir quoi y faire
          une fois sur place.
        </p>
        <Link href="/voyager-aux-philippines/transport" className="text-accent font-bold hover:underline mt-4 inline-block">Comment explorer les Visayas →</Link>
      </SplitSection>

      <SplitSection
        eyebrow="À ne pas manquer"
        imageUrl="/images/palawan/vue-aerienne-coron.webp"
        imageAlt="Vue aérienne d'une île des Visayas"
        reverse
        tone="muted"
        title="Aventures et découvertes"
        titleAccent="garanties"
      >
        <p>
          Au-delà des plages, les Visayas cumulent les prétextes à ralentir ou à bouger : sites
          de plongée réputés, vestiges historiques et cascades accessibles à la journée.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Plongée :</b> Explorez des sites de renommée mondiale comme Malapascua et Moalboal.</li>
          <li><b>Histoire :</b> Visitez la Croix de Magellan à Cebu, symbole de l&apos;arrivée du christianisme.</li>
          <li><b>Nature :</b> Randonnez jusqu&apos;aux chutes de Kawasan ou admirez les rizières en terrasses.</li>
        </ul>
        <p className="!mt-5">
          De quoi construire un itinéraire sur mesure, à condition de viser la bonne saison —
          c&apos;est le sujet du chapitre suivant.
        </p>
        <Link href="/voyager-aux-philippines/quand-partir" className="text-accent font-bold hover:underline mt-4 inline-block">Quelle est la meilleure saison ? →</Link>
      </SplitSection>

      <div className="container mx-auto px-4">
        <KlookCarousel
          activities={cebuActivities}
          destination="cebu"
          title="Activites incontournables a Cebu & Visayas"
          subtitle="Requins-baleines, canyoneering, plongee — les meilleures experiences"
        />
      </div>

      {articles && articles.length > 0 && (
        <section className="bg-background pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="border-t border-border pt-14">
              <SectionHeader eyebrow="À lire aussi" title="Nos articles sur" accent="Cebu et les Visayas" />
              <div className="mt-8">
                <ArticleList articles={articles} basePath="voyager-aux-philippines" />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CebuVisayasPage;
