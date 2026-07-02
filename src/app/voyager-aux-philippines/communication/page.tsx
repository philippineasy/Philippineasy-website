import { Metadata } from 'next';
import { PageHero, SplitSection, CardGrid, LinkCard } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSimCard, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'communication');

  if (!page) {
    return {
      title: "Page non trouvée",
    };
  }

  const canonicalUrl = 'https://philippineasy.com/voyager-aux-philippines/communication';
  const description = page.subtitle || 'Guide pour communiquer aux Philippines : carte SIM, internet et expressions utiles en Tagalog.';

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
/* Petits blocs éditoriaux locaux, repris de la recette validée sur           */
/* visas-et-formalites : eyebrow + h2 à mot accentué, table de lexique.       */
/* -------------------------------------------------------------------------- */

const SectionHeader = ({
  eyebrow,
  title,
  accent,
  center = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  center?: boolean;
}) => (
  <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
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

// Table de lexique compacte (mot local → traduction), même recette que les
// tables de repères prix (visas-et-formalites / logement).
const DataTable = ({
  caption,
  rows,
}: {
  caption: string;
  rows: { label: string; value: string }[];
}) => (
  <div className="mt-6 overflow-hidden rounded-xl border-[0.5px] border-border bg-card">
    <div className="border-b border-border bg-muted px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {caption}
    </div>
    <dl className="divide-y divide-border">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
          <dt className="text-[14px] font-semibold text-foreground">{r.label}</dt>
          <dd className="whitespace-nowrap text-[14px] text-muted-foreground">{r.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

const CommunicationPage = async () => {
  const supabase = await createClient();
  const { data: page } = await getPageBySlug(supabase, 'communication');

  if (!page) {
    notFound();
  }

  return (
    <div>
      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Communiquer aux"
        titleAccent="Philippines"
        subtitle={page.subtitle || "De la carte SIM locale aux bases du Tagalog, tous nos conseils pour échanger et rester connecté."}
        imageUrl={page.hero_image_url || "/imagesHero/antennes-reseaux-aux-philippines.webp"}
        imageAlt="Communiquer aux Philippines"
      />

      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader center eyebrow="Deux réflexes avant de partir" title="Rester" accent="connecté" />
          <div className="mx-auto mt-5 max-w-2xl space-y-4 text-center text-[16px] leading-[1.7] text-muted-foreground">
            <p>
              Deux opérateurs se partagent le marché mobile philippin, Globe et Smart, avec des
              stands installés dès la sortie de l&apos;aéroport. Impossible de les rater, et
              s&apos;équiper prend à peine quelques minutes.
            </p>
            <p>
              Côté langue, l&apos;anglais est parlé par la quasi-totalité de la population — c&apos;est
              l&apos;une des deux langues officielles du pays, aux côtés du tagalog. La qualité du
              Wi-Fi, elle, reste variable : excellente dans les hôtels et cafés urbains, plus
              aléatoire dans les zones reculées.
            </p>
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow="Dès l'arrivée"
        imageUrl="/images/communication/personne-avec-telephone.webp"
        imageAlt="Personne tenant un smartphone avec une carte SIM"
        title="Acheter une Carte"
        titleAccent="SIM Locale"
      >
        <p>
          C&apos;est la toute première chose à faire en arrivant : des stands Globe et Smart vous
          attendent directement à la sortie de l&apos;aéroport. Acheter une carte SIM prépayée
          avec un forfait data est simple, rapide et économique — la suite du séjour s&apos;en
          trouve nettement plus confortable, ne serait-ce que pour réserver un Grab ou retrouver
          son chemin.
        </p>
      </SplitSection>

      <SplitSection
        tone="muted"
        reverse
        eyebrow="Le tagalog ouvre des portes"
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Personnes de différentes cultures discutant"
        title="Langues et"
        titleAccent="Expressions Utiles"
      >
        <p>
          L&apos;anglais est parlé par la grande majorité de la population, ce qui facilite
          grandement la communication au quotidien. Apprendre quelques mots de Tagalog (ou de la
          langue locale de la région que vous visitez) sera cependant très apprécié — un petit
          effort qui ouvre souvent de grands sourires.
        </p>
        <DataTable
          caption="Trois mots pour commencer"
          rows={[
            { label: 'Salamat', value: 'Merci' },
            { label: 'Magkano', value: 'Combien ça coûte ?' },
            { label: 'Paalam', value: 'Au revoir' },
          ]}
        />
      </SplitSection>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid eyebrow="Pour aller plus loin" title="Deux guides pour" titleAccent="approfondir" columns={2}>
            <LinkCard
              title="Guide pour choisir son opérateur"
              href="/voyager-aux-philippines/communication/carte-sim"
              icon={<FontAwesomeIcon icon={faSimCard} className="text-[18px]" />}
            />
            <LinkCard
              title="Apprendre les bases du Tagalog"
              href="/voyager-aux-philippines/communication/expressions"
              icon={<FontAwesomeIcon icon={faLanguage} className="text-[18px]" />}
            />
          </CardGrid>
        </div>
      </section>

      <AffiliateRecommendation
        title="Rester connecte et en securite"
        icon={faSimCard}
        location="communication_page"
        items={[
          {
            name: 'Airalo',
            description:
              "eSIM data pour les Philippines. Achetez et activez AVANT de partir — internet disponible des l'atterrissage. Plus besoin de chercher un shop SIM a l'aeroport.",
            advantage: "A partir de 5 USD pour 1 GB — internet des l'atterrissage",
            url: 'https://www.airalo.com/philippines-esim',
            recommended: true,
          },
          {
            name: 'NordVPN',
            description:
              "Securisez votre connexion sur les Wi-Fi d'hotels et cafes aux Philippines. Accedez aussi a Netflix France, Canal+ et la TV francaise depuis l'etranger.",
            advantage: 'A partir de 3 EUR/mois — Netflix France depuis les Philippines',
            url: 'https://nordvpn.com/fr/',
            recommended: true,
          },
        ]}
      />

    </div>
  );
};

export default CommunicationPage;
