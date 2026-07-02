import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard } from '@/components/sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSimCard, faLanguage, faPhone, faWifi, faComments } from '@fortawesome/free-solid-svg-icons';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import ArticleList from '@/components/shared/ArticleList';
import { createClient } from '@/utils/supabase/server';
import { getPageBySlug } from '@/services/pageService';
import { getArticlesByCategorySlug } from '@/services/articleService';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/voyager-aux-philippines', label: 'Voyager aux Philippines' },
  { label: 'Communication' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Voyager aux Philippines', item: '/voyager-aux-philippines' },
  { name: 'Communication', item: '/voyager-aux-philippines/communication' },
];

// Articles de la catégorie conseils-voyage directement liés à la connexion et
// à la préparation du séjour (le reste de la catégorie vit sur sa propre page).
const COMMUNICATION_ARTICLE_SLUGS = [
  'guide-achat-activation-sim-philippines',
  'partir-aux-philippines-guide-complet-2026',
];

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux, repris de la recette validée sur           */
/* visas-et-formalites : eyebrow + h2 à mot accentué, table de lexique,       */
/* liste cochée et lien-action.                                               */
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

// Table de lexique / repères compacte (mot local → traduction), même recette
// que les tables de repères prix (visas-et-formalites / logement).
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

const CheckList = ({ items }: { items: ReactNode[] }) => (
  <div className="mt-4 grid gap-2.5" role="list">
    {items.map((item, i) => (
      <div
        key={i}
        role="listitem"
        className="flex items-start gap-2.5 text-[15px] leading-[1.55] text-foreground"
      >
        <CheckCircle
          className="mt-[3px] h-[18px] w-[18px] flex-shrink-0 text-primary"
          aria-hidden="true"
        />
        <span>{item}</span>
      </div>
    ))}
  </div>
);

// Lien-action interne (rendu dans le rich-text de SplitSection : couleur
// accent-strong AA + no-underline forcés en style inline).
const inlineLinkClass =
  'group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm';
const inlineLinkStyle = {
  color: 'hsl(var(--accent-strong))',
  textDecoration: 'none',
} as const;

const InlineLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className={inlineLinkClass} style={inlineLinkStyle}>
    {children}
    <ArrowRight
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
      aria-hidden="true"
    />
  </Link>
);

const CommunicationPage = async () => {
  const supabase = await createClient();
  const [{ data: page }, { data: articles, error: articlesError }] = await Promise.all([
    getPageBySlug(supabase, 'communication'),
    getArticlesByCategorySlug(supabase, 'conseils-voyage'),
  ]);

  if (!page) {
    notFound();
  }

  if (articlesError) {
    console.error(articlesError);
  }

  const communicationArticles = (articles ?? []).filter((article) =>
    COMMUNICATION_ARTICLE_SLUGS.includes(article.slug)
  );

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Voyager aux Philippines"
        title="Communiquer aux"
        titleAccent="Philippines"
        subtitle={page.subtitle || "De la carte SIM locale aux bases du Tagalog, tous nos conseils pour échanger et rester connecté."}
        imageUrl={page.hero_image_url || "/imagesHero/antennes-reseaux-aux-philippines.webp"}
        imageAlt="Communiquer aux Philippines"
      />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12 pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <SectionHeader eyebrow="Deux réflexes avant de partir" title="Rester" accent="connecté" />
            <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Globe et Smart se partagent l&apos;essentiel du marché mobile philippin —
                rejoints plus récemment par un troisième réseau, DITO — avec des stands
                installés dès la sortie de l&apos;aéroport. Impossible de les rater, et
                s&apos;équiper prend à peine quelques minutes.
              </p>
              <p>
                Côté langue, l&apos;anglais est parlé par la quasi-totalité de la population —
                c&apos;est l&apos;une des deux langues officielles du pays, aux côtés du
                tagalog. La qualité du Wi-Fi, elle, reste variable : excellente dans les hôtels
                et cafés urbains, plus aléatoire dans les zones reculées.
              </p>
              <p>
                Cette page fait le tour du sujet : la carte SIM et son enregistrement,
                l&apos;état réel du réseau île par île, les applications que les Philippins
                utilisent vraiment, et les premiers mots de tagalog qui font sourire. De quoi
                rester joignable du premier au dernier jour.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '+63', label: 'indicatif téléphonique', icon: <FontAwesomeIcon icon={faPhone} className="text-[18px]" /> },
                { value: '2', label: 'langues officielles', icon: <FontAwesomeIcon icon={faLanguage} className="text-[18px]" /> },
                { value: '35', label: 'Mbps médians sur mobile', icon: <FontAwesomeIcon icon={faWifi} className="text-[18px]" /> },
                { value: '8 h 52', label: 'passées en ligne par jour', icon: <FontAwesomeIcon icon={faComments} className="text-[18px]" /> },
              ]}
            />
          </div>

          <p className="mt-6 max-w-3xl text-[14px] leading-[1.6] text-muted-foreground">
            Débit et temps en ligne : mesures Ookla et rapport Digital 2025 (DataReportal),
            début 2025. Les moyennes nationales cachent de gros écarts d&apos;une île à
            l&apos;autre — on y revient plus bas.
          </p>
        </div>
      </section>

      {/* Chapitre 1 — Carte SIM (renvoi vers le guide dédié) */}
      <SplitSection
        tone="muted"
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
        <p>
          En ville, la carte elle-même coûte 40 à 50 ₱ (moins d&apos;un euro) chez 7-Eleven
          comme en boutique officielle, et une promo data hebdomadaire tourne autour de 99 ₱.
          Une formalité à anticiper tout de même : depuis le <em>SIM Registration Act</em> de
          2022, chaque SIM doit être enregistrée avec votre passeport, et le profil touriste
          n&apos;est valable que 30 jours.
        </p>
        <InlineLink href="/voyager-aux-philippines/communication/carte-sim">
          Notre guide complet : choisir et activer sa carte SIM
        </InlineLink>
      </SplitSection>

      {/* Chapitre 2 — Internet & Wi-Fi, île par île */}
      <SplitSection
        reverse
        eyebrow="Le réseau, île par île"
        imageUrl="/imagesHero/hutte-philippines.webp"
        imageAlt="Hutte isolée sur une île des Philippines, loin des antennes"
        title="Internet : bon en ville,"
        titleAccent="capricieux au large"
      >
        <p>
          Les moyennes nationales progressent vite — environ 94 Mbps en connexion fixe et
          35 Mbps sur mobile début 2025, d&apos;après les mesures Ookla compilées par
          DataReportal. À Manille ou Cebu, la fibre équipe la plupart des cafés et des condos ;
          dans les zones touristiques, le Wi-Fi d&apos;hôtel suffit pour les mails, moins pour
          la visioconférence aux heures de pointe.
        </p>
        <p>
          Sur les petites îles, la donne change. À Siargao, le haut débit stable se concentre
          autour de General Luna ; Boracay a connu des coupures de courant à répétition fin
          2025 ; à El Nido et Coron, de plus en plus d&apos;hébergements complètent la fibre par
          Starlink — arrivé aux Philippines en février 2023, une première en Asie du Sud-Est. Le
          bon réflexe reste le même partout : faire de la data mobile son plan A, et du Wi-Fi un
          bonus.
        </p>
        <CheckList
          items={[
            'Téléchargez cartes et itinéraires hors ligne avant chaque traversée en bateau.',
            'Télétravail prévu ? Ciblez un logement avec fibre ET générateur — les coupures de courant font partie du quotidien insulaire.',
            "Sur les Wi-Fi publics d'hôtels et de cafés, un VPN reste une précaution utile.",
          ]}
        />
      </SplitSection>

      {/* Chapitre 3 — Les apps du quotidien (colonne centrée, table kit) */}
      <SplitSection
        eyebrow="Le pays de Messenger"
        title="Les apps qui font tourner"
        titleAccent="le quotidien"
      >
        <p>
          Les Philippins comptent parmi les habitants les plus connectés de la planète — près de
          neuf heures par jour en ligne selon le rapport Digital 2025. Mais les usages ne sont
          pas les nôtres : ici, WhatsApp reste minoritaire. C&apos;est Messenger qui sert de
          canal par défaut — la page Facebook d&apos;un hôtel ou d&apos;un guide répond souvent
          plus vite que son adresse e-mail — et Viber, très implanté dans le pays, complète la
          panoplie pour les échanges plus formels.
        </p>
        <p>
          Ajoutez Grab pour les trajets et les livraisons à Manille, Cebu ou Davao, et un
          porte-monnaie mobile pour payer sans cash : GCash domine le marché, mais sa
          vérification exige des documents de résident — avec un simple passeport, Maya est en
          pratique plus accessible pour un visiteur de passage.
        </p>
        <DataTable
          caption="Le kit de survie numérique"
          rows={[
            { label: 'Messenger', value: 'Le canal par défaut' },
            { label: 'Viber', value: 'Résas & contacts pros' },
            { label: 'Grab', value: 'Trajets & livraison' },
            { label: 'Maya', value: 'Paiement mobile' },
            { label: 'Google Maps', value: 'À passer hors ligne' },
          ]}
        />
      </SplitSection>

      {/* Chapitre 4 — Langue & expressions */}
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
          langue locale de la région que vous visitez — le bisaya autour de Cebu, par exemple)
          sera cependant très apprécié — un petit effort qui ouvre souvent de grands sourires.
        </p>
        <DataTable
          caption="Cinq mots pour commencer"
          rows={[
            { label: 'Salamat', value: 'Merci' },
            { label: 'Magkano', value: 'Combien ça coûte ?' },
            { label: 'Kumusta', value: 'Comment ça va ?' },
            { label: 'Oo · Hindi', value: 'Oui · Non' },
            { label: 'Paalam', value: 'Au revoir' },
          ]}
        />
        <InlineLink href="/voyager-aux-philippines/communication/expressions">
          Apprendre les bases : notre guide d&apos;expressions
        </InlineLink>
      </SplitSection>

      {/* Nos guides */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid eyebrow="Pour aller plus loin" title="Deux guides pour" titleAccent="approfondir" columns={2}>
            <LinkCard
              title="Guide pour choisir son opérateur"
              href="/voyager-aux-philippines/communication/carte-sim"
              desc="Globe, Smart ou DITO, forfaits data en pesos, enregistrement passeport : le mode d'emploi complet."
              cta="Lire le guide"
              icon={<FontAwesomeIcon icon={faSimCard} className="text-[18px]" />}
            />
            <LinkCard
              title="Apprendre les bases du Tagalog"
              href="/voyager-aux-philippines/communication/expressions"
              desc="Salutations, chiffres, politesse : les mots qui déclenchent des sourires."
              cta="Lire le guide"
              icon={<FontAwesomeIcon icon={faLanguage} className="text-[18px]" />}
            />
          </CardGrid>
        </div>
      </section>

      {/* Articles liés (catégorie conseils-voyage, sélection connexion) */}
      {communicationArticles.length > 0 && (
        <section className="bg-background pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="border-t border-border pt-14">
              <SectionHeader eyebrow="À lire aussi" title="Nos articles pour rester" accent="connecté" />
              <div className="mt-8">
                <ArticleList articles={communicationArticles} basePath="voyager-aux-philippines" />
              </div>
            </div>
          </div>
        </section>
      )}

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
