import { Metadata } from 'next';
import { PageHero, SplitSection, FaqAccordion } from '@/components/sections';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import { KlookCarousel } from '@/components/affiliate/KlookCarousel';
import { siargaoActivities } from '@/components/affiliate/klook-activities-data';

export const metadata: Metadata = {
  title: 'Siargao : La Capitale du Surf aux Philippines',
  description: 'Découvrez Siargao, l\'île de rêve pour les surfeurs et les amoureux de la nature. Ce guide vous aidera à planifier votre voyage pendant la saison verte, avec des informations sur les meilleurs spots de surf, les lagons et les piscines naturelles.',
  alternates: {
    canonical: 'https://philippineasy.com/voyager-aux-philippines/siargao',
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
    title: 'Siargao : La Capitale du Surf aux Philippines',
    description: 'Découvrez Siargao, l\'île de rêve pour les surfeurs et les amoureux de la nature.',
    url: 'https://philippineasy.com/voyager-aux-philippines/siargao',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siargao : La Capitale du Surf aux Philippines',
    description: 'Découvrez Siargao, l\'île de rêve pour les surfeurs et les amoureux de la nature.',
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

const siargaoFaqs = [
  {
    q: "Quelle est la meilleure période pour surfer à Siargao ?",
    a: "La haute saison de surf tombe pendant la saison des pluies, de juin à octobre — contre-intuitif, mais c'est la réalité de l'île. C'est la période où les vagues sont les plus impressionnantes.",
  },
  {
    q: "La saison des pluies est-elle un bon moment pour visiter Siargao ?",
    a: "Oui : de juin à octobre, les averses sont courtes et généreuses, suivies de belles éclaircies, et la végétation devient particulièrement luxuriante avec des cascades abondantes. C'est aussi la période où l'île se fait plus calme, avec moins de monde et des prix plus doux.",
  },
  {
    q: "Que faire à Siargao en dehors du surf ?",
    a: "L'île se prête à l'island hopping vers Naked Island, Daku et Guyam, à la baignade et au paddle dans le Sugba Lagoon aux eaux turquoise, ou encore aux piscines naturelles creusées dans la roche de Magpupungko Rock Pools.",
  },
  {
    q: "Qu'est-ce que le Sugba Lagoon ?",
    a: "Le Sugba Lagoon est un lagon aux eaux turquoise où l'on peut nager et faire du paddle, l'un des trésors de Siargao à découvrir une fois la planche de surf reposée.",
  },
  {
    q: "Faut-il prévoir de l'argent liquide pour visiter Siargao ?",
    a: "Oui, c'est un conseil à anticiper avant de partir : les distributeurs ne courent pas les rues une fois loin des zones touristiques de l'île.",
  },
];

const SiargaoPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'siargao');

  if (error) {
    console.error(error);
    // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Siargao"
        titleAccent="Capitale du Surf"
        subtitle="Explorez une île authentique, ses vagues de renommée mondiale et ses paysages à couper le souffle."
        imageUrl="/images/meteo/rizieres-philippines-nuageuses.webp"
        imageAlt="Siargao Capitale du Surf"
      />

      {/* Intro éditoriale — remplace l'ancienne bande de "stats" textuelles. */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Siargao en un coup d'œil"
            title="Surf, lagons et"
            accent="îles secrètes"
          />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Siargao doit sa réputation à ses vagues, mais l&apos;île ne s&apos;arrête pas à
              Cloud 9. Entre le surf, les lagons turquoise et les piscines naturelles creusées
              dans la roche, il y a largement de quoi remplir un séjour sans jamais s&apos;éloigner
              beaucoup de la côte.
            </p>
            <p>
              La haute saison de surf tombe pendant la saison des pluies, de juin à octobre —
              contre-intuitif, mais c&apos;est la réalité de l&apos;île. Un conseil avant de
              partir : prévoyez du liquide, les distributeurs ne courent pas les rues une fois
              loin des zones touristiques.
            </p>
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow="Quand partir"
        imageUrl="/images/siargao/surf-a-siargao.webp"
        imageAlt="Surfeur sur une vague à Siargao"
        title="La saison verte :"
        titleAccent="une nature luxuriante"
      >
        <p>
          De juin à octobre, les pluies transforment Siargao en île du vert le plus intense —
          averses courtes et généreuses, suivies de belles éclaircies. C&apos;est aussi la
          période où l&apos;île se fait plus calme, avec moins de monde et des prix plus doux.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Paysages :</b> Une végétation luxuriante et des cascades abondantes.</li>
          <li><b>Surf :</b> C&apos;est la meilleure période pour le surf, avec les vagues les plus impressionnantes.</li>
          <li><b>Ambiance :</b> Une atmosphère plus calme et authentique.</li>
        </ul>
        <p className="!mt-5">
          Le mauvais temps n&apos;empêche donc rien — il redessine juste le programme. Reste à
          savoir où aller une fois les vagues dominées.
        </p>
        <Link href="/voyager-aux-philippines/quand-partir" className="text-accent font-bold hover:underline mt-4 inline-block">En savoir plus sur le climat →</Link>
      </SplitSection>

      <SplitSection
        eyebrow="Au-delà du surf"
        imageUrl="/images/siargao/piscines-naturelles-magpupungko.webp"
        imageAlt="Piscines naturelles de Magpupungko"
        reverse
        tone="muted"
        title="Les trésors de"
        titleAccent="Siargao"
      >
        <p>
          Posez la planche, et Siargao a encore beaucoup à montrer : des îles désertes à
          quelques minutes de bateau jusqu&apos;aux piscines creusées à même la roche.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Island Hopping :</b> Découvrez les îles de Naked Island, Daku et Guyam.</li>
          <li><b>Sugba Lagoon :</b> Nagez et faites du paddle dans un lagon aux eaux turquoise.</li>
          <li><b>Magpupungko Rock Pools :</b> Baignez-vous dans des piscines naturelles creusées dans la roche.</li>
        </ul>
        <p className="!mt-5">
          De quoi construire un programme complet, sans jamais s&apos;éloigner beaucoup de la
          côte.
        </p>
        <Link href="/voyager-aux-philippines/transport" className="text-accent font-bold hover:underline mt-4 inline-block">Comment se déplacer à Siargao →</Link>
      </SplitSection>

      <div className="container mx-auto px-4">
        <KlookCarousel
          activities={siargaoActivities}
          destination="siargao"
          title="Activites incontournables a Siargao"
          subtitle="Surf a Cloud 9, island hopping et lagons secrets"
        />
      </div>

      {/* FAQ */}
      <section className="bg-background py-16 md:py-20">
        <FaqAccordion
          withSchema
          eyebrow="Questions fréquentes"
          title="Partir à Siargao,"
          titleAccent="vos questions"
          faqs={siargaoFaqs}
        />
      </section>

      {articles && articles.length > 0 && (
        <section className="bg-background pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="border-t border-border pt-14">
              <SectionHeader eyebrow="À lire aussi" title="Nos articles sur" accent="Siargao" />
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

export default SiargaoPage;
