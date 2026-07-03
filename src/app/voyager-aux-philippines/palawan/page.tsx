import { Metadata } from 'next';
import { PageHero, SplitSection, FaqAccordion } from '@/components/sections';
import Link from 'next/link';
import { KlookCarousel } from '@/components/affiliate/KlookCarousel';
import { palawanActivities } from '@/components/affiliate/klook-activities-data';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';

export const metadata: Metadata = {
  title: 'Palawan : Le Joyau des Philippines',
  description: 'Découvrez Palawan, un paradis tropical aux Philippines. Ce guide complet vous aidera à planifier votre voyage pendant la saison sèche, avec des informations sur les meilleures plages, les activités incontournables et des conseils pratiques.',
  alternates: {
    canonical: 'https://philippineasy.com/voyager-aux-philippines/palawan',
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
    title: 'Palawan : Le Joyau des Philippines',
    description: 'Découvrez Palawan, un paradis tropical aux Philippines. Ce guide complet vous aidera à planifier votre voyage pendant la saison sèche.',
    url: 'https://philippineasy.com/voyager-aux-philippines/palawan',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palawan : Le Joyau des Philippines',
    description: 'Découvrez Palawan, un paradis tropical aux Philippines.',
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

const palawanFaqs = [
  {
    q: "Quelle est la meilleure période pour partir à Palawan ?",
    a: "La saison sèche, de novembre à mai, est la fenêtre à viser : le ciel se dégage et la mer devient praticable presque partout autour de l'île. C'est le meilleur moment pour enchaîner sorties en bateau, plongée et balades sans mauvaise surprise côté météo.",
  },
  {
    q: "Que faire à El Nido ?",
    a: "El Nido est célèbre pour ses falaises de calcaire, ses lagons cachés et ses plages idylliques comme Nacpan Beach. C'est l'une des trois adresses qui donnent à Palawan sa réputation.",
  },
  {
    q: "Que faire à Coron ?",
    a: "Coron est un paradis pour les plongeurs, avec ses épaves de navires japonais de la Seconde Guerre mondiale et ses lacs cristallins comme le lac Kayangan.",
  },
  {
    q: "Que voir à Puerto Princesa ?",
    a: "Puerto Princesa abrite une rivière souterraine, classée parmi les sept nouvelles merveilles de la nature. C'est la troisième adresse incontournable de Palawan, aux côtés d'El Nido et de Coron.",
  },
  {
    q: "Quelles activités pratiquer à Palawan pendant la saison sèche ?",
    a: "La saison sèche se prête à l'island hopping, à la plongée, au kayak et à l'exploration des grottes, avec un ciel dégagé et des températures agréables. C'est aussi l'occasion de profiter des festivals locaux qui animent les villes et les villages.",
  },
];

const PalawanPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'palawan');

  if (error) {
    console.error(error);
    // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Palawan"
        titleAccent="Le Joyau des Philippines"
        subtitle="Le guide ultime pour découvrir un paradis tropical, ses plages de rêve et ses eaux cristallines."
        imageUrl="/images/meteo/plage-tropicale-philippines.webp"
        imageAlt="Palawan Le Joyau des Philippines"
      />

      {/* Intro éditoriale — remplace l'ancienne bande de "stats" textuelles. */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Palawan en un coup d'œil"
            title="El Nido, Coron, Puerto Princesa :"
            accent="trois visages"
          />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Palawan tient sa réputation de trois adresses qui n&apos;ont presque rien en
              commun : les falaises de calcaire et les lagons cachés d&apos;El Nido, les épaves
              de plongée et le lac Kayangan de Coron, et la rivière souterraine de Puerto
              Princesa, classée parmi les sept nouvelles merveilles de la nature.
            </p>
            <p>
              Le bon calage compte autant que la destination : de novembre à mai, la saison
              sèche ouvre l&apos;archipel presque en totalité, ciel dégagé et mer praticable. Les
              deux chapitres qui suivent détaillent d&apos;abord cette fenêtre météo, puis les
              trois visages de l&apos;île à explorer une fois sur place.
            </p>
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow="Quand partir"
        imageUrl="/images/palawan/bateau-bangka-el-nido.webp"
        imageAlt="Bateau traditionnel Bangka dans un lagon d'El Nido"
        title="La saison sèche,"
        titleAccent="le bon moment"
      >
        <p>
          De novembre à mai, le ciel se dégage et la mer devient praticable presque partout
          autour de l&apos;île. C&apos;est la fenêtre à viser pour enchaîner sorties en bateau,
          plongée et balades, sans mauvaise surprise côté météo.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Météo :</b> Ciel dégagé et températures agréables.</li>
          <li><b>Activités :</b> Island hopping, plongée, kayak, et exploration des grottes.</li>
          <li><b>Festivals :</b> Profitez des festivals locaux qui animent les villes et les villages.</li>
        </ul>
        <p className="!mt-5">
          Cette fenêtre refermée, place aux trois adresses qui font la réputation de
          l&apos;île — le sujet du chapitre suivant.
        </p>
        <Link href="/voyager-aux-philippines/quand-partir" className="text-accent font-bold hover:underline mt-4 inline-block">En savoir plus sur le climat →</Link>
      </SplitSection>

      <SplitSection
        eyebrow="Trois étapes clés"
        imageUrl="/images/palawan/vue-aerienne-coron.webp"
        imageAlt="Vue aérienne de Coron, Palawan"
        reverse
        tone="muted"
        title="Les incontournables de"
        titleAccent="Palawan"
      >
        <p>
          Après la météo, la géographie : voici les trois adresses qui donnent à Palawan sa
          réputation, chacune avec sa propre personnalité.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>El Nido :</b> Célèbre pour ses falaises de calcaire, ses lagons cachés et ses plages idylliques comme Nacpan Beach.</li>
          <li><b>Coron :</b> Un paradis pour les plongeurs avec ses épaves de navires japonais de la Seconde Guerre mondiale et ses lacs cristallins comme le lac Kayangan.</li>
          <li><b>Puerto Princesa :</b> Explorez la rivière souterraine, l&apos;une des sept nouvelles merveilles de la nature.</li>
        </ul>
        <p className="!mt-5">
          Reste à organiser concrètement ces excursions — c&apos;est l&apos;objet des activités
          sélectionnées ci-dessous.
        </p>
        <Link href="/voyager-aux-philippines/transport" className="text-accent font-bold hover:underline mt-4 inline-block">Comment se déplacer à Palawan →</Link>
      </SplitSection>

      <div className="container mx-auto px-4">
        <KlookCarousel
          activities={palawanActivities}
          destination="palawan"
          title="Activites incontournables a Palawan"
          subtitle="Island hopping, plongee, et excursions aux meilleurs prix"
        />
      </div>

      {/* FAQ */}
      <section className="bg-background py-16 md:py-20">
        <FaqAccordion
          withSchema
          eyebrow="Questions fréquentes"
          title="Partir à Palawan,"
          titleAccent="vos questions"
          faqs={palawanFaqs}
        />
      </section>

      {articles && articles.length > 0 && (
        <section className="bg-background pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="border-t border-border pt-14">
              <SectionHeader eyebrow="À lire aussi" title="Nos articles sur" accent="Palawan" />
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

export default PalawanPage;
