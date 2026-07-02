import { Metadata } from 'next';
import { PageHero, StatRow, SplitSection } from '../../../components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater, faChurch, faHippo } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '../../../utils/supabase/server';
import { getArticlesByCategorySlug } from '../../../services/articleService';
import ArticleList from '../../../components/shared/ArticleList';
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

      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Les Visayas en Bref</h2>
          <StatRow
            tone="default"
            stats={[
              {
                icon: <FontAwesomeIcon icon={faWater} className="text-[18px]" />,
                value: 'Plages & Plongée',
                label: 'Trésors Aquatiques',
              },
              {
                icon: <FontAwesomeIcon icon={faChurch} className="text-[18px]" />,
                value: 'Héritage Colonial',
                label: 'Histoire et Culture',
              },
              {
                icon: <FontAwesomeIcon icon={faHippo} className="text-[18px]" />,
                value: 'Tarsiers & Chocolate Hills',
                label: 'Merveilles de Bohol',
              },
            ]}
          />
        </div>
      </div>

      <SplitSection
        imageUrl="/images/palawan/bateau-bangka-el-nido.webp"
        imageAlt="Bateau traditionnel Bangka"
        title="Une Mosaïque d'Îles"
        titleAccent="Inoubliables"
      >
        <p>La région des Visayas est un ensemble d'îles offrant une diversité de paysages et d'expériences. De l'effervescence de Cebu City aux plages tranquilles de Siquijor, chaque île a sa propre identité.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Cebu :</b> Le carrefour économique et culturel de la région.</li>
          <li><b>Bohol :</b> Célèbre pour ses Chocolate Hills et ses minuscules tarsiers.</li>
          <li><b>Siquijor :</b> Une île mystique réputée pour ses guérisseurs et ses plages désertes.</li>
        </ul>
        <Link href="/voyager-aux-philippines/transport" className="text-accent font-bold hover:underline mt-4 inline-block">Comment explorer les Visayas →</Link>
      </SplitSection>

      <SplitSection
        imageUrl="/images/palawan/vue-aerienne-coron.webp"
        imageAlt="Vue aérienne d'une île des Visayas'"
        reverse
        tone="muted"
        title="Aventures et Découvertes"
        titleAccent="Garanties"
      >
        <p>Les Visayas sont un terrain de jeu idéal pour les aventuriers et les curieux :</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Plongée :</b> Explorez des sites de renommée mondiale comme Malapascua et Moalboal.</li>
          <li><b>Histoire :</b> Visitez la Croix de Magellan à Cebu, symbole de l'arrivée du christianisme.</li>
          <li><b>Nature :</b> Randonnez jusqu'aux chutes de Kawasan ou admirez les rizières en terrasses.</li>
        </ul>
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

      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold tracking-[-0.01em] text-foreground">Nos Articles sur Cebu et les Visayas</h2>
        {articles && <ArticleList articles={articles} basePath="voyager-aux-philippines" />}
      </div>
    </div>
  );
};

export default CebuVisayasPage;
