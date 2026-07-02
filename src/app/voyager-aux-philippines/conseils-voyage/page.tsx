import { Metadata } from 'next';
import { PageHero, SplitSection } from '@/components/sections';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';

export const metadata: Metadata = {
  title: 'Conseils Pratiques pour votre Voyage aux Philippines',
  description: 'Maximisez votre expérience aux Philippines avec nos conseils pratiques. De la préparation de votre voyage à la sécurité sur place, ce guide est votre allié.',
  alternates: {
    canonical: 'https://philippineasy.com/voyager-aux-philippines/conseils-voyage',
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
    title: 'Conseils Pratiques pour votre Voyage aux Philippines',
    description: 'Maximisez votre expérience aux Philippines avec nos conseils pratiques.',
    url: 'https://philippineasy.com/voyager-aux-philippines/conseils-voyage',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conseils Pratiques pour votre Voyage aux Philippines',
    description: 'Maximisez votre expérience aux Philippines avec nos conseils pratiques.',
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

const ConseilsPratiquesPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'conseils-voyage');

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Conseils Pratiques"
        titleAccent="pour les Philippines"
        subtitle="Toutes les clés pour un voyage réussi, de la planification à la vie sur place."
        imageUrl="/images/sante/controle-police-philippines.webp"
        imageAlt="Conseils Pratiques pour les Philippines"
      />

      {/* Intro éditoriale — remplace l'ancienne bande de "stats" textuelles. */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="L'essentiel avant de partir"
            title="Papiers, santé, budget :"
            accent="dans cet ordre"
          />
          <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Un voyage aux Philippines qui démarre bien tient à trois choses réglées avant le
              départ : les visas selon votre nationalité, les vaccins et la trousse de premiers
              secours, et un peu de liquide en poche pour les premiers jours.
            </p>
            <p>
              Une fois sur place, la donne change : il s&apos;agit surtout de comprendre les
              codes locaux, de la langue aux transports en passant par le marchandage sur les
              marchés. Les deux chapitres qui suivent couvrent d&apos;abord l&apos;avant-départ,
              puis le quotidien sur l&apos;archipel.
            </p>
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow="Avant de partir"
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
        imageAlt="Préparation de vaccins pour un voyage"
        title="Préparation au voyage :"
        titleAccent="ne rien oublier"
      >
        <p>
          Trois cases à cocher avant de boucler la valise : les papiers, la santé, et de quoi
          payer les premiers jours sans chercher un distributeur dès la sortie de
          l&apos;aéroport.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Visas :</b> Vérifiez les exigences de visa pour votre nationalité.</li>
          <li><b>Santé :</b> Consultez votre médecin pour les vaccins et une trousse de premiers secours.</li>
          <li><b>Argent :</b> Prévoyez un mélange de liquide et de cartes de crédit.</li>
        </ul>
        <p className="!mt-5">
          Ces trois cases cochées, le vrai voyage commence — et avec lui, une autre logique.
        </p>
        <Link href="/voyager-aux-philippines/sante-securite" className="text-accent font-bold hover:underline mt-4 inline-block">Plus de détails sur la santé et sécurité →</Link>
      </SplitSection>

      <SplitSection
        eyebrow="Sur place"
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Dialogue entre deux personnes de cultures différentes"
        reverse
        tone="muted"
        title="Sur place,"
        titleAccent="vivre à la philippine"
      >
        <p>
          S&apos;adapter au rythme local demande surtout de l&apos;observation : quelques mots
          de la langue, les bons réflexes dans les transports, et une négociation qui reste
          toujours bon enfant.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Communication :</b> Apprenez quelques mots de tagalog ou de bisaya.</li>
          <li><b>Transport :</b> Maîtrisez l&apos;art de voyager en jeepney ou en tricycle.</li>
          <li><b>Négociation :</b> Le marchandage est courant sur les marchés, mais restez respectueux.</li>
        </ul>
        <p className="!mt-5">
          Rien d&apos;insurmontable — juste des codes qui se prennent vite, surtout avec les
          bons mots pour commencer.
        </p>
        <Link href="/voyager-aux-philippines/communication" className="text-accent font-bold hover:underline mt-4 inline-block">Communiquer facilement aux Philippines →</Link>
      </SplitSection>

      {articles && articles.length > 0 && (
        <section className="bg-background pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="border-t border-border pt-14">
              <SectionHeader eyebrow="À lire aussi" title="Nos articles de" accent="conseils pratiques" />
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

export default ConseilsPratiquesPage;
