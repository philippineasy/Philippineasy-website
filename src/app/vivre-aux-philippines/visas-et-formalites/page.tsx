import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CheckCircle, ExternalLink, ArrowRight, AlertTriangle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faCalendarDays, faHouse, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, CTABand } from '@/components/sections';
import { VisaSimulator } from '@/components/visa/VisaSimulator';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import ArticleList from '@/components/shared/ArticleList';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Visas Philippines 2026 : Guide Complet pour s'installer",
  description: "Guide complet et à jour sur les visas pour vivre aux Philippines en 2026 : visa touriste 9A, visa retraite SRRV (nouvelles règles), visa travail 9G et AEP. Conditions, coûts et démarches.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/visas-et-formalites',
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
    title: "Visas Philippines 2026 : Guide Complet pour s'installer",
    description: "Tout savoir sur les visas pour vivre aux Philippines : touriste, retraite SRRV, travail 9G. Conditions actualisées, coûts et procédures officielles.",
    url: 'https://philippineasy.com/vivre-aux-philippines/visas-et-formalites',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Visas Philippines 2026 : Guide Complet",
    description: "Guide complet et à jour sur les visas pour vivre aux Philippines en 2026.",
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
  { label: 'Visas et Formalités' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
  { name: 'Visas et Formalités', item: '/vivre-aux-philippines/visas-et-formalites' },
];

const SRRV_ARTICLE =
  '/vivre-aux-philippines/visas-et-formalites/visa-longue-duree-srrv-13a-comparatif';

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux (server components).                         */
/* Le pattern d'en-tête reprend celui de la home : eyebrow + h2 à mot accentué.*/
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

// Liste "cochée" (documents, avantages). Div-based pour ne pas hériter des
// puces disc du rich-text de SplitSection. Accepte du JSX (liens inline).
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

// Étapes numérotées (processus 9G / 9F). Pastille bleue + titre + méta + texte.
const Steps = ({
  steps,
}: {
  steps: { title?: string; meta?: string; text: string }[];
}) => (
  <div className="mt-5 flex flex-col gap-4" role="list">
    {steps.map((s, i) => (
      <div key={i} role="listitem" className="flex gap-3.5">
        <span
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground"
          aria-hidden="true"
        >
          {i + 1}
        </span>
        <div className="pt-0.5">
          {s.title && (
            <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-foreground">
              {s.title}
              {s.meta && (
                <span className="rounded bg-muted px-2 py-0.5 text-[12px] font-medium tabular-nums text-muted-foreground">
                  {s.meta}
                </span>
              )}
            </span>
          )}
          <span
            className={cn(
              'block text-[14px] leading-[1.55]',
              // With a title, the text is a supporting caption; on its own it
              // carries the step, so it stays at full foreground contrast.
              s.title ? 'mt-1 text-muted-foreground' : 'pt-1 text-foreground'
            )}
          >
            {s.text}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// Table de données compacte (coûts, dépôts). Le libellé + un montant aligné à
// droite ; les chiffres sont en `text-foreground` pour un contraste AA net.
const DataTable = ({
  caption,
  rows,
}: {
  caption: string;
  rows: { label: string; sub?: string; value: string }[];
}) => (
  <div className="mt-6 overflow-hidden rounded-xl border-[0.5px] border-border bg-card">
    <div className="border-b border-border bg-muted px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {caption}
    </div>
    <dl className="divide-y divide-border">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
          <dt className="text-[14px] text-foreground">
            {r.label}
            {r.sub && (
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted-foreground">
                {r.sub}
              </span>
            )}
          </dt>
          <dd className="whitespace-nowrap text-[14px] font-semibold tabular-nums text-foreground">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

// Encadré d'avertissement honnête (bord accent, façon "À vérifier" du simulateur).
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

// Lien-action (portails officiels, articles liés). Rendu à l'intérieur du
// rich-text de SplitSection : on force la couleur accent-strong (AA) et le
// no-underline via `style` inline, qui prime sur la règle `[&_a]` du conteneur.
const inlineLinkClass =
  'group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm';
const inlineLinkStyle = {
  color: 'hsl(var(--accent-strong))',
  textDecoration: 'none',
} as const;

const InlineLink = ({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) =>
  external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={inlineLinkClass}
      style={inlineLinkStyle}
    >
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
      {children}
    </a>
  ) : (
    <Link href={href} className={inlineLinkClass} style={inlineLinkStyle}>
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
        aria-hidden="true"
      />
    </Link>
  );

const comparatifRows = [
  { type: 'Exemption (tourisme)', duration: '30 jours', condition: 'Nationalité française', cost: 'Gratuit' },
  { type: '9(A) touriste', duration: '36 mois', condition: 'Extensions successives', cost: '3 000 – 13 900 PHP / ext.' },
  { type: 'SRRV (retraite)', duration: 'Permanent', condition: '40 ans et plus, dépôt bancaire', cost: '15 000 – 50 000 $US' },
  { type: '9(G) travail', duration: '1 à 3 ans', condition: 'Contrat + AEP', cost: "Pris en charge par l'employeur" },
  { type: '9(F) étudiant', duration: '1 an renouv.', condition: 'Admission université CHED', cost: 'Variable' },
];

const ressources = [
  { name: 'Bureau of Immigration', url: 'https://immigration.gov.ph/', domain: 'immigration.gov.ph' },
  { name: 'Philippine Retirement Authority', url: 'https://pra.gov.ph/', domain: 'pra.gov.ph' },
  { name: 'Ambassade des Philippines (Paris)', url: 'https://parispe.dfa.gov.ph/', domain: 'parispe.dfa.gov.ph' },
  { name: 'eTravel (enregistrement)', url: 'https://etravel.gov.ph/', domain: 'etravel.gov.ph' },
];

const VisasEtFormalitesPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'visas-et-formalites');

  if (error) {
    console.error(error);
  }

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Visas pour les"
        titleAccent="Philippines"
        subtitle="Le guide complet et actualisé pour comprendre chaque type de visa et choisir celui qui colle à votre projet d'expatriation."
        imageUrl="/imagesHero/visa-philippines-processus.webp"
        imageAlt="Formalités et visas pour s'installer aux Philippines"
      />

      {/* Simulateur (panneau signature) — reste en haut, intouché. */}
      <VisaSimulator />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <SectionHeader
              eyebrow="Votre installation commence ici"
              title="Le bon visa,"
              accent="première étape"
            />
            <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Avant les cartons et le billet d'avion, une question décide de tout : sous quel
                statut allez-vous entrer et rester aux Philippines ? Quelques semaines de vacances,
                une retraite au soleil ou un poste dans une entreprise locale ne passent pas par la
                même porte.
              </p>
              <p>
                Nous avons réuni les cinq voies principales, avec leurs conditions, leurs coûts et
                leurs durées à jour de 2026. Le simulateur ci-dessus vous donne déjà une piste ; les
                sections qui suivent entrent dans le détail, visa par visa.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '30', label: 'jours gratuits', icon: <FontAwesomeIcon icon={faPlane} className="text-[18px]" /> },
                { value: '36', label: 'mois max touriste', icon: <FontAwesomeIcon icon={faCalendarDays} className="text-[18px]" /> },
                { value: '40+', label: 'ans pour le SRRV', icon: <FontAwesomeIcon icon={faHouse} className="text-[18px]" /> },
                { value: '5', label: 'types de visas', icon: <FontAwesomeIcon icon={faShieldHalved} className="text-[18px]" /> },
              ]}
            />
          </div>

          <p className="mt-6 max-w-3xl text-[14px] leading-[1.6] text-muted-foreground">
            Les règles d'immigration changent souvent. Nous tenons cette page à jour, mais
            vérifiez toujours les détails auprès du{' '}
            <a
              href="https://immigration.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-strong underline underline-offset-2 hover:text-accent-strong/80"
            >
              Bureau of Immigration
            </a>{' '}
            et de l'
            <a
              href="https://parispe.dfa.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-strong underline underline-offset-2 hover:text-accent-strong/80"
            >
              Ambassade des Philippines en France
            </a>{' '}
            avant de vous engager.
          </p>
        </div>
      </section>

      {/* Chapitre 1 — Entrée sans visa (photo aéroport, à gauche) */}
      <SplitSection
        eyebrow="À l'arrivée"
        title="Trente jours"
        titleAccent="sans visa"
        imageUrl="/imagesHero/comment-voyager-aux-philippines.webp"
        imageAlt="Avion à la porte d'embarquement, départ vers les Philippines"
      >
        <p>
          Bonne nouvelle pour les Français : vous entrez aux Philippines sans aucun visa préalable,
          pour un séjour de 30 jours. Cette facilité concerne 157 nationalités, et elle suffit
          largement à de premières vacances ou à un repérage avant l'installation.
        </p>
        <h4>À présenter à l'arrivée</h4>
        <CheckList
          items={[
            'Un passeport valide au moins 6 mois après votre date de retour prévue',
            "Un billet d'avion prouvant votre sortie du territoire philippin",
            <>
              Votre enregistrement sur le portail{' '}
              <a href="https://etravel.gov.ph/" target="_blank" rel="noopener noreferrer">
                eTravel
              </a>
              , désormais obligatoire
            </>,
          ]}
        />
        <p className="!mt-5">
          Ces 30 jours ne se prolongent pas à la frontière. Pour rester plus longtemps, on bascule
          sur le visa touriste et ses extensions.
        </p>
      </SplitSection>

      {/* Chapitre 2 — Visa touriste 9A (photo Boracay, à droite) */}
      <SplitSection
        reverse
        eyebrow="Rester plus longtemps"
        title="Prolonger jusqu'à"
        titleAccent="36 mois"
        imageUrl="/imagesHero/boracay-white-beach.webp"
        imageAlt="Rue animée de Boracay le soir, voyageurs au long cours"
      >
        <p>
          Envie de prendre votre temps ? Une fois les 30 jours écoulés, le visa touriste 9(A) se
          prolonge directement sur place, auprès du Bureau of Immigration, jusqu'à 36 mois
          cumulés grâce au programme LSVVE.
        </p>
        <DataTable
          caption="Coût des extensions · 2026"
          rows={[
            { label: '1 mois', value: '3 000 – 4 000 PHP' },
            { label: '2 mois', value: '5 000 – 6 000 PHP' },
            { label: '6 mois (LSVVE)', value: '11 500 – 13 900 PHP' },
          ]}
        />
        <p className="!mt-5">
          Un point à ne pas oublier : passé 59 jours sur le sol philippin, l'ACR I-Card
          (<em>Alien Certificate of Registration</em>) devient obligatoire. Comptez environ 3 000 PHP.
        </p>
        <p>
          Vous partez sans billet retour ? Demandez plutôt un visa de 59 jours à l'ambassade
          avant de décoller : autour de 30 à 40 € de frais et 3 à 5 jours ouvrables, sur présentation
          d'un dossier classique (formulaire, deux photos, preuve de moyens, itinéraire).
        </p>
        <InlineLink href="https://e-services.immigration.gov.ph/" external>
          Prolonger en ligne : le portail eServices du Bureau of Immigration
        </InlineLink>
      </SplitSection>

      {/* Chapitre 3 — Visa retraite SRRV (photo résidence, à gauche) */}
      <SplitSection
        eyebrow="S'installer à la retraite"
        title="Le visa retraite"
        titleAccent="SRRV"
        imageUrl="/images/famille/famille-condominium-philippines.webp"
        imageAlt="Résidence avec piscine sous les palmiers aux Philippines"
      >
        <p>
          Le SRRV (<em>Special Resident Retiree's Visa</em>) s'adresse aux retraités qui
          veulent poser leurs valises pour de bon. En échange d'un dépôt bloqué dans une banque
          philippine, il ouvre une résidence permanente, sans renouvellement annuel à surveiller.
        </p>
        <p>
          Depuis 2025, les règles ont bougé. L'âge minimum descend à 40 ans et les montants de
          dépôt ont été revus. Ces nouvelles conditions valent pour tous les nouveaux dossiers.
        </p>
        <DataTable
          caption="Dépôt requis · SRRV Classic"
          rows={[
            { label: '50 ans et plus, avec pension', sub: "Pension d'au moins 800 $/mois", value: '15 000 $US' },
            { label: '50 ans et plus, sans pension', value: '30 000 $US' },
            { label: '40 à 49 ans, avec pension', value: '25 000 $US' },
            { label: '40 à 49 ans, sans pension', value: '50 000 $US' },
          ]}
        />
        <p className="!mt-5">
          S'y ajoutent 1 500 $US de frais de dossier pour le demandeur principal, plus 300 $US
          par personne à charge.
        </p>
        <p>
          Une variante existe, le SRRV Courtesy, réservée aux anciens citoyens philippins ayant
          renoncé à leur nationalité : le dépôt tombe à 1 500 $US dès 50 ans, ou 3 000 $US entre 40
          et 49 ans.
        </p>
        <InlineLink href={SRRV_ARTICLE}>Comparatif détaillé SRRV vs 13(a)</InlineLink>
      </SplitSection>

      {/* Bande "atouts du SRRV" (fond muté, texte foncé = contraste AA) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Ce que ça change"
            title="Les atouts du"
            accent="SRRV"
            description="Au-delà du droit de rester, le SRRV simplifie la vie quotidienne d'un retraité installé sur place."
          />
          <div className="mt-8 max-w-4xl">
            <CheckList
              columns={2}
              items={[
                'Une résidence permanente aux Philippines',
                'Des entrées et sorties du territoire sans limite',
                'Aucun renouvellement annuel à gérer',
                'Une exemption de certains droits de douane',
                "L'importation de vos biens en franchise, jusqu'à 7 000 $US",
                'Un dépôt que vous récupérez en cas de départ définitif',
              ]}
            />
          </div>
          <a
            href="https://pra.gov.ph/SRRVisa"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-accent-strong hover:text-accent-strong/80"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Site officiel de la Philippine Retirement Authority (PRA)
          </a>
        </div>
      </section>

      {/* Chapitre 4 — Visa de travail 9G (photo travailleur, à droite) */}
      <SplitSection
        reverse
        eyebrow="Travailler légalement"
        title="Visa de travail"
        titleAccent="9(G)"
        imageUrl="/imagesHero/travailleur-etranger-aux-philippines.webp"
        imageAlt="Travailleur étranger sur un chantier aux Philippines"
      >
        <p>
          Travailler légalement aux Philippines suppose deux documents qui vont de pair : un permis
          de travail, l'AEP (<em>Alien Employment Permit</em>) délivré par le DOLE, puis le visa
          9(G) lui-même. Et tout commence par l'employeur.
        </p>
        <Steps
          steps={[
            {
              title: 'AEP — permis de travail',
              meta: '2 à 3 semaines',
              text: "Délivré par le DOLE. Votre employeur doit démontrer qu'aucun Philippin qualifié n'est disponible pour le poste.",
            },
            {
              title: 'PWP — permis provisoire',
              meta: '3 mois, renouvelable',
              text: 'Facultatif. Il vous laisse travailler pendant que le 9(G) est instruit.',
            },
            {
              title: 'Visa 9(G)',
              meta: '1 à 3 ans',
              text: "Déposé après l'AEP auprès du Bureau of Immigration.",
            },
          ]}
        />
        <CautionBox
          title="À garder en tête"
          items={[
            "L'AEP est rattaché à un employeur précis : changer de poste, c'est refaire toute la démarche.",
            "L'entreprise qui vous parraine doit en général disposer d'un capital d'au moins 200 000 $US.",
            'Un renouvellement en retard peut coûter des pénalités, voire un blacklistage.',
            'Certaines professions en sont dispensées, comme les diplomates ou les résidents permanents.',
          ]}
        />
      </SplitSection>

      {/* Chapitre 5 — Visa étudiant 9F (photo université, à gauche) */}
      <SplitSection
        eyebrow="Étudier sur place"
        title="Visa étudiant"
        titleAccent="9(F)"
        imageUrl="/imagesHero/ou-et-comment-etudier-aux-philippines.webp"
        imageAlt="Université historique dans une rue animée des Philippines"
      >
        <p>
          Vous avez 18 ans ou plus et une place dans une université philippine accréditée par la CHED
          (<em>Commission on Higher Education</em>) ? Le visa étudiant 9(F) vous ouvre les portes de
          l'enseignement supérieur sur l'archipel.
        </p>
        <h4>Le parcours, étape par étape</h4>
        <Steps
          steps={[
            { text: 'Décrochez votre admission dans un établissement accrédité CHED.' },
            { text: "L'université transmet votre dossier à la CHED." },
            { text: 'Après validation, il part au Bureau of Immigration.' },
            { text: "Le DFA prévient l'ambassade, qui délivre votre visa." },
          ]}
        />
        <h4>Les pièces à réunir</h4>
        <CheckList
          columns={2}
          items={[
            "Lettre d'acceptation de l'université",
            'Relevés de notes authentifiés',
            'Certificat de bonne conduite',
            'Preuve de capacité financière',
            'Certificat médical',
            'Casier judiciaire vierge',
          ]}
        />
        <p className="!mt-5">
          Le visa 9(F) est valable un an, renouvelable, et compte 2 à 8 semaines de délai
          d'obtention.
        </p>
        <InlineLink href="/vivre-aux-philippines/etudier/universites">
          Découvrir les universités philippines
        </InlineLink>
      </SplitSection>

      {/* Comparatif (pause tonale mutée, tableau sur carte blanche) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="En un coup d'œil" title="Comparatif des" accent="visas" />

          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[720px] overflow-hidden rounded-2xl border-[0.5px] border-border bg-card shadow-card-rest">
              <div className="grid grid-cols-[1.4fr_0.8fr_1.4fr_1.1fr] bg-primary text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-foreground">
                <div className="px-5 py-4">Type de visa</div>
                <div className="px-5 py-4">Durée max.</div>
                <div className="px-5 py-4">Condition principale</div>
                <div className="px-5 py-4">Coût estimé</div>
              </div>
              <div className="divide-y divide-border">
                {comparatifRows.map((visa, index) => (
                  <div
                    key={visa.type}
                    className={cn(
                      'grid grid-cols-[1.4fr_0.8fr_1.4fr_1.1fr] items-center',
                      index % 2 === 1 && 'bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-3 px-5 py-4">
                      <span className="h-8 w-1.5 flex-shrink-0 rounded-full bg-primary/30" aria-hidden="true" />
                      <span className="text-[14px] font-semibold text-foreground">{visa.type}</span>
                    </div>
                    <div className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[13px] font-medium text-primary">
                        {visa.duration}
                      </span>
                    </div>
                    <div className="px-5 py-4 text-[14px] text-muted-foreground">{visa.condition}</div>
                    <div className="px-5 py-4 text-[14px] font-medium text-foreground">{visa.cost}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ressources officielles (cartes justifiées : liens externes) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid eyebrow="À consulter" title="Ressources" titleAccent="officielles" columns={4}>
            {ressources.map((resource) => (
              <a
                key={resource.domain}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <ExternalLink className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {resource.name}
                  </span>
                  <span className="block truncate text-[12px] text-muted-foreground">
                    {resource.domain}
                  </span>
                </span>
              </a>
            ))}
          </CardGrid>
        </div>
      </section>

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
                title="Trouver un logement"
                href="/vivre-aux-philippines/logement"
                desc="Condos, maisons et quartiers où poser ses valises."
                cta="En savoir plus"
              />
              <LinkCard
                title="Ouvrir un compte en banque"
                href="/vivre-aux-philippines/banque-finances"
                desc="Banques, assurances et gestion de votre argent sur place."
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

      {/* Articles de la catégorie */}
      {articles && articles.length > 0 && (
        <section className="bg-background pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="border-t border-border pt-14">
              <SectionHeader
                eyebrow="À lire aussi"
                title="Nos articles visas &"
                accent="formalités"
              />
              <div className="mt-8">
                <ArticleList articles={articles} basePath="vivre-aux-philippines" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Panneau signature de clôture */}
      <CTABand
        title="Un doute sur"
        titleAccent="votre situation ?"
        subtitle="Relancez le simulateur en haut de page pour une première orientation, ou exposez votre cas à la communauté d'expatriés sur le forum."
        primary={{ label: 'Poser ma question sur le forum', href: '/forum-sur-les-philippines' }}
        secondary={{ label: 'Comparatif SRRV vs 13(a)', href: SRRV_ARTICLE }}
      />
    </div>
  );
};

export default VisasEtFormalitesPage;
