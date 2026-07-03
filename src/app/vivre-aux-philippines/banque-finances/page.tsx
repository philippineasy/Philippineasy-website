import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Landmark, Clock, Smartphone, FileText, CheckCircle, ExternalLink, AlertTriangle, HeartPulse } from 'lucide-react';
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, FaqAccordion } from '@/components/sections';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "Banque et Finances aux Philippines 2026 : Guide Expatrié",
  description: "Guide complet pour ouvrir un compte bancaire aux Philippines (BDO, BPI, Metrobank), transférer de l'argent et gérer vos finances au quotidien. Documents requis, wallets digitaux, alternatives.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/banque-finances',
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
    title: "Banque et Finances aux Philippines 2026 : Guide Expatrié",
    description: "Ouvrir un compte bancaire, transférer de l'argent et gérer son quotidien aux Philippines. Guide pratique pour expatriés avec documents requis et comparatif.",
    url: 'https://philippineasy.com/vivre-aux-philippines/banque-finances',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Banque et Finances aux Philippines 2026",
    description: "Guide complet pour expatriés : compte bancaire, transferts et argent au quotidien aux Philippines.",
  },
};

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux (server components), repris du gabarit      */
/* visas-et-formalites : eyebrow + h2 à mot accentué, check-list, encadré.    */
/* -------------------------------------------------------------------------- */

// En-tête de section : eyebrow uppercase + h2 avec UN mot en amber vif.
const SectionHeader = ({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
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
    {description && (
      <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">{description}</p>
    )}
  </div>
);

// Liste "cochée" (documents, wallets). Div-based pour ne pas hériter des puces
// disc du rich-text de SplitSection. Accepte du JSX (mots en gras inline).
const CheckList = ({ items, columns = 1 }: { items: ReactNode[]; columns?: 1 | 2 }) => (
  <div
    className={cn('mt-4 grid gap-2.5', columns === 2 && 'sm:grid-cols-2 sm:gap-x-6')}
    role="list"
  >
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

// Encadré d'avertissement honnête (bord accent, façon "à vérifier avant de se déplacer").
const CautionBox = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-6 rounded-r-lg border-l-4 border-accent bg-accent/5 py-4 pl-5 pr-4">
    <div className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-accent-strong">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      {title}
    </div>
    <div className="flex flex-col gap-2" role="list">
      {items.map((it, i) => (
        <div
          key={i}
          role="listitem"
          className="flex gap-2.5 text-[14px] leading-[1.55] text-foreground/85"
        >
          <span
            className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-strong"
            aria-hidden="true"
          />
          <span>{it}</span>
        </div>
      ))}
    </div>
  </div>
);

// Carte "sobre" par banque : nom, description, points forts en pastilles et
// lien externe. Remplace les cartes multicolores d'origine par un rendu
// hairline cohérent avec le reste du design system (comme DataTable/Steps).
interface Bank {
  name: string;
  desc: string;
  features: string[];
  url: string;
  domain: string;
}

const BankList = ({ banks }: { banks: Bank[] }) => (
  <div className="mt-6 flex flex-col gap-4" role="list">
    {banks.map((bank) => (
      <div
        key={bank.name}
        role="listitem"
        className="rounded-xl border-[0.5px] border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h5 className="text-[15px] font-semibold text-foreground">{bank.name}</h5>
          <a
            href={bank.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-strong hover:text-accent-strong/80"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            {bank.domain}
          </a>
        </div>
        <p className="mt-1.5 text-[14px] leading-[1.55] text-muted-foreground">{bank.desc}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {bank.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[12.5px] font-medium text-primary"
            >
              <CheckCircle className="h-3 w-3" aria-hidden="true" />
              {feature}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const banks: Bank[] = [
  {
    name: 'BDO (Banco de Oro)',
    desc: 'La plus grande banque du pays, avec plus de 1 400 agences et 4 400 distributeurs.',
    features: ['Réseau ATM le plus étendu', 'Application mobile complète', 'Ouverture possible via Zoom'],
    url: 'https://www.bdo.com.ph/',
    domain: 'bdo.com.ph',
  },
  {
    name: 'BPI',
    desc: 'Banque historique réputée pour son service client et sa fiabilité.',
    features: ['Excellente application mobile', 'Bonne réputation auprès des expatriés', 'Services en ligne performants'],
    url: 'https://www.bpi.com.ph/',
    domain: 'bpi.com.ph',
  },
  {
    name: 'Metrobank',
    desc: 'Troisième plus grande banque, connue pour ses services aux entreprises et aux particuliers.',
    features: ["Large réseau d'agences", 'Comptes multi-devises', 'Service personnalisé'],
    url: 'https://www.metrobank.com.ph/',
    domain: 'metrobank.com.ph',
  },
];

const banqueFaqs = [
  {
    q: 'Un étranger peut-il ouvrir un compte bancaire aux Philippines ?',
    a: "Les grandes banques philippines ouvrent volontiers un compte aux étrangers, à condition d'être reconnu comme resident alien : il faut avoir séjourné au moins 59 à 60 jours aux Philippines et posséder une ACR I-Card. Sans ce statut, impossible d'ouvrir un compte en pesos ; les touristes peuvent parfois ouvrir un compte en devises, mais avec des restrictions.",
  },
  {
    q: 'Quelles pièces faut-il réunir pour ouvrir un compte en banque ?',
    a: "Il faut présenter un passeport valide, original et copie, votre ACR I-Card ou ICR, un visa en cours de validité, un justificatif de domicile, deux à trois photos d'identité et un dépôt initial compris entre 2 000 et 10 000 PHP. L'ouverture se fait généralement en agence, parfois avec une lettre de l'employeur en complément du dossier.",
  },
  {
    q: 'Quelles sont les banques les plus utilisées par les expatriés ?',
    a: "BDO, la plus grande banque du pays, se distingue par son réseau d'agences et de distributeurs le plus étendu, avec une ouverture de compte possible via Zoom. BPI est réputée pour son service client et son application mobile, tandis que Metrobank propose un large réseau d'agences et des comptes multi-devises. Comptez ensuite 1 à 2 semaines pour recevoir votre carte de débit, pour des frais de tenue de compte de 0 à 300 PHP par mois.",
  },
  {
    q: 'Quels sont les portefeuilles digitaux à utiliser aux Philippines ?',
    a: "GCash, le portefeuille électronique le plus populaire du pays, convient bien aux paiements du quotidien, aux transferts entre particuliers et aux achats en ligne. Maya (ex-PayMaya) est une alternative qui propose aussi des comptes d'épargne numériques à taux attractifs. Ces deux outils comblent les usages qu'un compte bancaire classique ne couvre pas toujours, comme payer un jeepney ou un vendeur de rue.",
  },
  {
    q: "Comment transférer de l'argent entre la France et les Philippines ?",
    a: "Pour recevoir un salaire depuis la France ou envoyer de l'argent vers les Philippines, les néobanques multi-devises comme Wise complètent utilement un compte bancaire local et les portefeuilles digitaux GCash ou Maya.",
  },
];

const BanqueFinancesPage = async () => {
  const supabase = await createClient();
  const { data: articles } = await getArticlesByCategorySlug(supabase, 'banque-finances');

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
    { label: 'Banque & Finances' },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
    { name: 'Banque & Finances', item: '/vivre-aux-philippines/banque-finances' },
  ];

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Banque &"
        titleAccent="Finances"
        subtitle="Ouvrez un compte, transférez votre argent et gérez votre quotidien financier aux Philippines : tout ce qu'il faut savoir pour s'organiser sereinement."
        imageUrl="/imagesHero/banque-assurance-philippines.webp"
        imageAlt="Banque & Finances"
      />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <SectionHeader
              eyebrow="Vivre aux Philippines au quotidien"
              title="Compte bancaire,"
              accent="simplifié"
            />
            <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Recevoir votre salaire, payer un loyer, régler les factures courantes : une
                fois installé aux Philippines, un compte en banque local simplifie nettement
                le quotidien. Les grandes banques du pays acceptent les clients étrangers, à
                condition de remplir quelques critères de résidence et de réunir les bons
                documents.
              </p>
              <p>
                Ce guide réunit les trois banques les plus utilisées par les expatriés, la
                liste des pièces à fournir pour ouvrir un compte, et les deux portefeuilles
                digitaux qui simplifient les paiements du quotidien : GCash et Maya.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '3', label: 'grandes banques', icon: <Landmark className="h-[18px] w-[18px]" /> },
                { value: '59', label: 'jours min. résidence', icon: <Clock className="h-[18px] w-[18px]" /> },
                { value: '2', label: 'portefeuilles digitaux', icon: <Smartphone className="h-[18px] w-[18px]" /> },
                { value: '6', label: 'documents requis', icon: <FileText className="h-[18px] w-[18px]" /> },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Chapitre 1 — Ouvrir un compte (BDO / BPI / Metrobank), photo d'échange entre expatriés */}
      <SplitSection
        eyebrow="À la banque"
        title="Ouvrir un compte chez"
        titleAccent="BDO, BPI ou Metrobank"
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Expatriés échangeant leurs conseils sur les démarches administratives aux Philippines"
      >
        <p>
          Les grandes banques philippines ouvrent volontiers un compte aux étrangers, à une
          condition près : être reconnu comme <strong>resident alien</strong>. Concrètement,
          il faut avoir séjourné au moins 59 à 60 jours aux Philippines et posséder une{' '}
          <strong>ACR I-Card</strong> (Alien Certificate of Registration).
        </p>
        <CautionBox
          title="Avant de vous déplacer en agence"
          items={[
            "Sans le statut de resident alien, impossible d'ouvrir un compte en pesos.",
            'Les touristes peuvent parfois ouvrir un compte en devises (USD, EUR), mais avec des restrictions.',
          ]}
        />
        <BankList banks={banks} />
        <h4>Les pièces à réunir</h4>
        <CheckList
          columns={2}
          items={[
            'Passeport valide, original et copie',
            'ACR I-Card ou ICR',
            'Visa en cours de validité',
            'Justificatif de domicile (facture, bail)',
            "Photos d'identité (2 à 3 exemplaires)",
            'Dépôt initial : 2 000 à 10 000 PHP',
          ]}
        />
        <p className="!mt-5">
          L&apos;ouverture se fait généralement en agence, parfois avec une lettre de
          l&apos;employeur en complément du dossier. Comptez ensuite 1 à 2 semaines pour
          recevoir votre carte de débit, pour des frais de tenue de compte qui restent
          limités : de 0 à 300 PHP par mois.
        </p>
      </SplitSection>

      {/* Chapitre 2 — Portefeuilles digitaux et transferts au quotidien (pause mutée), photo téléphone */}
      <SplitSection
        reverse
        tone="muted"
        eyebrow="Payer au quotidien"
        title="Vos paiements avec"
        titleAccent="GCash et Maya"
        imageUrl="/images/communication/personne-avec-telephone.webp"
        imageAlt="Utilisation d'un portefeuille digital sur smartphone aux Philippines"
      >
        <p>
          Un compte bancaire ne suffit pas toujours pour payer un jeepney, un vendeur de rue
          ou une facture en ligne. Deux portefeuilles digitaux comblent ce vide et se sont
          imposés dans le quotidien des Philippines.
        </p>
        <CheckList
          items={[
            <>
              <strong>GCash</strong> — le portefeuille électronique le plus populaire du
              pays, parfait pour les paiements, les transferts entre particuliers et les
              achats en ligne.
            </>,
            <>
              <strong>Maya</strong> (ex-PayMaya) — une alternative avec des comptes
              d&apos;épargne numériques qui offrent des taux d&apos;intérêt attractifs.
            </>,
          ]}
        />
        <p className="!mt-5">
          Pour les transferts internationaux — recevoir un salaire depuis la France ou
          envoyer de l&apos;argent vers les Philippines — les néobanques multi-devises comme
          Wise complètent utilement un compte bancaire local et ces deux portefeuilles
          digitaux.
        </p>
      </SplitSection>

      {/* Affiliation + Voir aussi */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Affiliate recommendations */}
          <AffiliateRecommendation
            title="Nos recommandations pour les expats"
            icon={faMoneyBillTransfer}
            location="banque_finances_page"
            items={[
              {
                name: 'Wise',
                description: 'Compte multi-devises EUR + PHP + USD. Recevez votre salaire en euros, convertissez au taux reel, et payez en PHP avec la carte Wise. 16 millions d\'utilisateurs.',
                advantage: 'Economisez 3-5% vs banques traditionnelles — 0 frais mensuels',
                url: 'https://wise.com/fr/send-money/send-money-to-philippines',
                recommended: true,
              },
            ]}
          />

          {/* Voir aussi */}
          <div className="mx-auto mt-12 max-w-4xl">
            <LinkCard
              href="/vivre-aux-philippines/sante-assurances"
              icon={<HeartPulse className="h-5 w-5" />}
              title="Voir aussi : Santé & Assurances"
              desc="PhilHealth, HMO locales, assurances internationales et hôpitaux de référence"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background pb-16 md:pb-20">
        <FaqAccordion
          withSchema
          eyebrow="Questions fréquentes"
          title="Banque et finances,"
          titleAccent="en clair"
          faqs={banqueFaqs}
        />
      </section>

      {/* Articles de la catégorie */}
      {articles && articles.length > 0 && (
        <section className="bg-background pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="border-t border-border pt-14">
              <SectionHeader
                eyebrow="À lire aussi"
                title="Nos articles banque &"
                accent="finances"
              />
              <div className="mt-8">
                <ArticleList articles={articles} basePath="vivre-aux-philippines" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navigation interne */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="border-t border-border pt-14">
            <CardGrid
              eyebrow="Pour aller plus loin"
              title="Continuez votre"
              titleAccent="exploration"
              columns={3}
            >
              <LinkCard
                title="Obtenir un visa"
                href="/vivre-aux-philippines/visas-et-formalites"
                desc="Types de visas, conditions et démarches pour s'installer."
                cta="En savoir plus"
              />
              <LinkCard
                title="Trouver un logement"
                href="/vivre-aux-philippines/logement"
                desc="Condos, maisons et quartiers où poser ses valises."
                cta="En savoir plus"
              />
              <LinkCard
                title="Forum des expatriés"
                href="/forum-sur-les-philippines"
                desc="Posez vos questions à ceux qui ont déjà fait le grand saut."
                cta="Rejoindre la discussion"
              />
            </CardGrid>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BanqueFinancesPage;
