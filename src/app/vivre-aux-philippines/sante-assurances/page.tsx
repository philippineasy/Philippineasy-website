import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Shield, Hospital, Heart, Globe, CheckCircle, AlertTriangle, ExternalLink, ArrowRight, Landmark, Syringe } from 'lucide-react';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, FaqAccordion } from '@/components/sections';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import ArticleList from '@/components/shared/ArticleList';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "Santé et Assurances aux Philippines 2026 : Guide Expatrié",
  description: "Guide complet sur le système de santé philippin et les assurances pour expatriés : PhilHealth, HMO locales (Maxicare, Intellicare, MediCard), assurances internationales et hôpitaux de référence.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/sante-assurances',
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
    title: "Santé et Assurances aux Philippines 2026 : Guide Expatrié",
    description: "Choisir une assurance santé et comprendre le système de soins aux Philippines. Guide pratique pour expatriés avec comparatif PhilHealth, HMO et assurances internationales.",
    url: 'https://philippineasy.com/vivre-aux-philippines/sante-assurances',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Santé et Assurances aux Philippines 2026",
    description: "Guide complet pour expatriés : système de santé et assurances aux Philippines.",
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
  { label: 'Santé & Assurances' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
  { name: 'Santé & Assurances', item: '/vivre-aux-philippines/sante-assurances' },
];

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux (server components), repris à l'identique   */
/* du pattern validé sur /vivre-aux-philippines/visas-et-formalites.          */
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

// Liste "cochée" (garanties, assureurs). Div-based pour ne pas hériter des
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

// Étapes numérotées (la recommandation en 3 niveaux). Pastille bleue + titre + texte.
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

// Table de données compacte (cotisations, coûts). Le libellé + un montant aligné
// à droite ; les chiffres sont en `text-foreground` pour un contraste AA net.
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

// Encadré d'avertissement honnête (bord accent).
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

// Lien-action (portails officiels). Rendu à l'intérieur du rich-text de
// SplitSection : on force la couleur accent-strong (AA) et le no-underline
// via `style` inline, qui prime sur la règle `[&_a]` du conteneur.
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

const hopitauxRows = [
  { name: "St. Luke's Medical Center", location: 'BGC & Quezon City', desc: 'Standard international, soins complexes' },
  { name: 'Makati Medical Center', location: 'Makati CBD', desc: 'Excellence en cardiologie et oncologie' },
  { name: 'The Medical City', location: 'Pasig', desc: 'Équipe multilingue, département international' },
  { name: 'Asian Hospital', location: 'Alabang (Sud Manille)', desc: 'Excellentes infrastructures' },
  { name: "Cebu Doctors' University Hospital", location: 'Cebu City', desc: 'Référence pour les Visayas, tarifs accessibles' },
  { name: 'Chong Hua Hospital', location: 'Cebu City', desc: 'Accrédité JCI (standard international)' },
];

const santeFaqs = [
  {
    q: 'Qu\'est-ce que PhilHealth et que couvre-t-il ?',
    a: "PhilHealth est le système national d'assurance santé des Philippines, auquel un expatrié résident peut adhérer volontairement pour une couverture de base. Il prend en charge les hospitalisations sous forme de forfaits, les consultations dans le secteur public et les chirurgies non urgentes. Ces forfaits sont fixes et non un remboursement intégral : pour des soins complexes ou en hôpital privé, le reste à charge peut grimper jusqu'à 40 %.",
  },
  {
    q: "Combien coûte l'adhésion à PhilHealth ?",
    a: "Pour les salariés, la cotisation représente 5 % du salaire, partagée avec l'employeur. En adhésion volontaire, comptez de 2 400 à 5 000 PHP par an.",
  },
  {
    q: 'Qu\'est-ce qu\'une HMO et pourquoi en souscrire une aux Philippines ?',
    a: "Une HMO (Health Maintenance Organization) est une couverture complémentaire souscrite en plus de PhilHealth pour les soins courants : consultations, petits pépins, dentaire. Maxicare, le leader, propose des plans individuels et familiaux à partir d'environ 15 000 PHP par an ; Intellicare mise sur des formules personnalisables et une bonne couverture dentaire ; MediCard revendique plus de 500 hôpitaux partenaires. Ces couvertures suffisent au quotidien, mais pas pour un accident grave ou un rapatriement.",
  },
  {
    q: "Faut-il une assurance internationale en plus de PhilHealth et d'une HMO ?",
    a: "Pour une couverture complète avec rapatriement et soins à l'étranger, une assurance internationale comme Cigna Global, Allianz Care, AXA ou April International offre une meilleure prise en charge dans les hôpitaux premium. Les tarifs vont de 30 à 50 €/mois pour un plan de base à 200-400 €/mois pour une couverture premium avec rapatriement, selon l'âge et la franchise choisie. La recommandation consiste à empiler les trois niveaux : PhilHealth comme socle, une HMO locale pour le quotidien, une assurance internationale pour les événements majeurs.",
  },
  {
    q: 'Quels sont les hôpitaux de référence pour les expatriés aux Philippines ?',
    a: "Plusieurs établissements privés sont reconnus comme références : St. Luke's Medical Center (BGC et Quezon City) pour les soins complexes selon un standard international, Makati Medical Center pour la cardiologie et l'oncologie, ou The Medical City à Pasig pour son équipe multilingue. À Cebu, Chong Hua Hospital est accrédité JCI, et le Cebu Doctors' University Hospital reste la référence pour les Visayas, avec des tarifs plus accessibles.",
  },
];

const SanteAssurancesPage = async () => {
  const supabase = await createClient();
  const { data: articles } = await getArticlesByCategorySlug(supabase, 'sante-assurances');

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Santé &"
        titleAccent="Assurances"
        subtitle="Protégez votre santé aux Philippines : système de soins, PhilHealth, HMO locales et assurances internationales pour vivre l'esprit tranquille."
        imageUrl="/imagesHero/securite-et-sante-aux-philippines.webp"
        imageAlt="Santé & Assurances"
      />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <SectionHeader
              eyebrow="Une priorité dès l'installation"
              title="Se soigner aux"
              accent="Philippines"
            />
            <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Une fois vos valises posées, la santé grimpe vite en tête des priorités. Les
                grandes villes offrent des soins de bon niveau, mais dans le privé, la facture
                suit — une bonne couverture n&apos;est pas un luxe, c&apos;est une nécessité.
              </p>
              <p>
                Nous avons détaillé les trois niveaux de protection à votre disposition :
                PhilHealth, l&apos;assurance sociale nationale, les HMO locales pour le quotidien,
                et les assurances internationales pour les pépins plus lourds. Avec, en bout de
                chaîne, les hôpitaux où ces couvertures sont vraiment utiles.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '3', label: "types d'assurance", icon: <Shield className="text-[18px]" /> },
                { value: '6', label: 'hôpitaux de référence', icon: <Hospital className="text-[18px]" /> },
                { value: '3', label: 'HMO locales', icon: <Heart className="text-[18px]" /> },
                { value: '4', label: 'assureurs internationaux', icon: <Globe className="text-[18px]" /> },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Chapitre 1 — PhilHealth (photo agence assurance, à droite) */}
      <SplitSection
        eyebrow="L'assurance sociale"
        title="PhilHealth, le"
        titleAccent="socle national"
        imageUrl="/imagesHero/banque-assurance-philippines.webp"
        imageAlt="Agence bancaire affichant une enseigne assurance aux Philippines"
      >
        <p>
          PhilHealth est le système national d&apos;assurance santé des Philippines. En tant
          qu&apos;expatrié résident, vous pouvez y adhérer volontairement pour une couverture de
          base — utile en complément, mais rarement suffisante à elle seule.
        </p>
        <DataTable
          caption="Cotisations 2026"
          rows={[
            { label: 'Salariés', value: '5% du salaire (partagé)' },
            { label: 'Adhésion volontaire', value: '2 400 à 5 000 PHP/an' },
          ]}
        />
        <h4>Ce qui est couvert</h4>
        <CheckList
          items={[
            'Hospitalisations, sous forme de forfaits',
            'Consultations dans le secteur public',
            'Chirurgies non urgentes',
          ]}
        />
        <CautionBox
          title="La limite à connaître"
          items={[
            "Les forfaits sont fixes : ce n'est pas un remboursement intégral des frais réels.",
            'Pour les soins complexes ou en hôpital privé, le reste à charge grimpe jusqu\'à 40%.',
          ]}
        />
        <InlineLink href="https://www.philhealth.gov.ph/" external>
          Adhérer en ligne : le portail officiel de PhilHealth
        </InlineLink>
      </SplitSection>

      {/* Chapitre 2 — HMO locales (photo résidence, à gauche) */}
      <SplitSection
        reverse
        eyebrow="Le complément recommandé"
        title="Les HMO,"
        titleAccent="au quotidien"
        imageUrl="/images/famille/famille-condominium-philippines.webp"
        imageAlt="Résidence avec piscine et jardin tropical, cadre de vie d'un expatrié aux Philippines"
      >
        <p>
          Pour les soins courants — consultations, petits pépins, dentaire — la plupart des
          expatriés s&apos;appuient sur une HMO (<em>Health Maintenance Organization</em>), une
          couverture complémentaire souscrite en plus de PhilHealth.
        </p>
        <p>
          Trois acteurs se partagent ce marché. Maxicare, leader avec le plus large réseau
          d&apos;hôpitaux partenaires, propose des plans individuels et familiaux à partir
          d&apos;environ 15 000 PHP par an. Intellicare mise sur des formules personnalisables,
          une bonne couverture dentaire et des options maternité. MediCard, l&apos;un des plus
          anciens acteurs du secteur, revendique plus de 500 hôpitaux partenaires et une
          procédure de réclamation simplifiée, pour les particuliers comme pour les entreprises.
        </p>
        <p className="!mt-5">
          Ces couvertures suffisent au quotidien. Pour un accident grave, une hospitalisation
          lourde ou un rapatriement, mieux vaut regarder du côté des assurances internationales.
        </p>
      </SplitSection>

      {/* Chapitre 3 — Assurances internationales (photo voyage/aéroport, à droite) */}
      <SplitSection
        eyebrow="Pour les coups durs"
        title="Une couverture"
        titleAccent="mondiale"
        imageUrl="/images/sante/vaccins-voyage-philippines.webp"
        imageAlt="Voyageuse portant un masque et consultant son téléphone dans un aéroport"
      >
        <p>
          Pour une couverture complète avec rapatriement et soins à l&apos;étranger, les
          assurances internationales offrent une meilleure prise en charge dans les hôpitaux
          premium.
        </p>
        <h4>Quatre assureurs de référence</h4>
        <CheckList
          columns={2}
          items={[
            <>
              <a href="https://www.cigna.com/" target="_blank" rel="noopener noreferrer">
                Cigna Global
              </a>{' '}
              — couverture mondiale
            </>,
            <>
              <a href="https://www.allianzcare.com/" target="_blank" rel="noopener noreferrer">
                Allianz Care
              </a>{' '}
              — plans modulables
            </>,
            <>
              <a href="https://www.axa.com/" target="_blank" rel="noopener noreferrer">
                AXA
              </a>{' '}
              — présence locale
            </>,
            <>
              <a href="https://www.april-international.com/" target="_blank" rel="noopener noreferrer">
                April International
              </a>{' '}
              — spécialiste des expatriés français
            </>,
          ]}
        />
        <DataTable
          caption="Coûts indicatifs · 2026"
          rows={[
            { label: 'Plan de base', sub: 'Hospitalisation', value: '30 – 50 €/mois' },
            { label: 'Intermédiaire', sub: 'Consultations + hospitalisation', value: '80 – 150 €/mois' },
            { label: 'Premium', sub: 'Couverture complète + rapatriement', value: '200 – 400 €/mois' },
          ]}
        />
        <p className="!mt-5">
          Ces tarifs varient selon votre âge, le niveau de couverture et la franchise choisie.
        </p>
      </SplitSection>

      {/* Hôpitaux de référence (cartes sobres sur fond blanc) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Où se faire soigner" title="Hôpitaux de" accent="référence" />

          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[640px] overflow-hidden rounded-2xl border-[0.5px] border-border bg-card shadow-card-rest">
              <div className="grid grid-cols-[1.6fr_1fr_1.6fr] bg-primary text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-foreground">
                <div className="px-5 py-4">Hôpital</div>
                <div className="px-5 py-4">Localisation</div>
                <div className="px-5 py-4">Spécialité</div>
              </div>
              <div className="divide-y divide-border">
                {hopitauxRows.map((h, index) => (
                  <div
                    key={h.name}
                    className={cn(
                      'grid grid-cols-[1.6fr_1fr_1.6fr] items-center',
                      index % 2 === 1 && 'bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-3 px-5 py-4">
                      <span className="h-8 w-1.5 flex-shrink-0 rounded-full bg-primary/30" aria-hidden="true" />
                      <span className="text-[14px] font-semibold text-foreground">{h.name}</span>
                    </div>
                    <div className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[13px] font-medium text-primary">
                        {h.location}
                      </span>
                    </div>
                    <div className="px-5 py-4 text-[14px] text-muted-foreground">{h.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre recommandation (pause tonale mutée — bloc conclusif éditorial) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Notre avis"
            title="Comment combiner"
            accent="les trois"
            description="Pour une protection complète sans payer plus que nécessaire, on recommande d'empiler ces trois niveaux."
          />
          <div className="mt-2 max-w-2xl">
            <Steps
              steps={[
                {
                  title: 'PhilHealth',
                  text: 'La couverture de base : obligatoire si vous êtes salarié, recommandée dans tous les autres cas.',
                },
                {
                  title: 'Une HMO locale',
                  text: 'Maxicare ou Intellicare, par exemple, pour les soins courants et les consultations du quotidien.',
                },
                {
                  title: 'Une assurance internationale',
                  text: "Pour les événements majeurs et le rapatriement, si votre budget le permet.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-16 md:py-20">
        <FaqAccordion
          withSchema
          eyebrow="Questions fréquentes"
          title="Santé et assurances,"
          titleAccent="en clair"
          faqs={santeFaqs}
        />
      </section>

      {/* Avant l'installation : renvois vers les guides santé & sécurité voyage */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Avant même l'installation"
            title="Préparez aussi votre"
            titleAccent="départ"
            subtitle="Nos guides dédiés aux voyageurs restent utiles avant de poser vos valises : vaccins recommandés et conseils de sécurité au quotidien."
            columns={3}
          >
            <LinkCard
              href="/voyager-aux-philippines/sante-securite"
              icon={<Shield className="h-5 w-5" />}
              title="Santé & Sécurité en voyage"
              desc="Le guide complet avant le départ"
              cta="Lire le guide"
            />
            <LinkCard
              href="/voyager-aux-philippines/sante-securite/vaccins"
              icon={<Syringe className="h-5 w-5" />}
              title="Vaccins recommandés"
              desc="Quels vaccins prévoir avant de partir"
              cta="Voir les vaccins"
            />
            <LinkCard
              href="/voyager-aux-philippines/sante-securite/conseils"
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Conseils de sécurité"
              desc="Précautions au quotidien"
              cta="Lire les conseils"
            />
          </CardGrid>
        </div>
      </section>

      {/* Affiliate recommendations — position inchangée */}
      <section className="bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <AffiliateRecommendation
              title="Nos recommandations pour les expats"
              icon={faShieldHalved}
              location="sante_assurances_page"
              items={[
                {
                  name: 'Chapka',
                  description: "Pour les expats: Cap Expatrie couvre les frais medicaux, hospitalisation et rapatriement aux Philippines. Alternative aux HMO locales pour une couverture complete.",
                  advantage: 'Couverture monde entier — rapatriement inclus',
                  url: 'https://www.chapkadirect.fr/assurance-voyage.html',
                  recommended: true,
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Voir aussi */}
      <section className="bg-background pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <LinkCard
              href="/vivre-aux-philippines/banque-finances"
              icon={<Landmark className="h-5 w-5" />}
              title="Voir aussi : Banque & Finances"
              desc="Ouvrir un compte, transférer de l'argent et gérer son quotidien"
            />
          </div>
        </div>
      </section>

      {/* Articles de la catégorie (intouché) */}
      {articles && articles.length > 0 && (
        <section className="bg-background pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Articles sur la Santé & les Assurances</h2>
            <ArticleList articles={articles} basePath="vivre-aux-philippines" />
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
              columns={4}
            >
              <LinkCard href="/vivre-aux-philippines/banque-finances" title="Banque & Finances" desc="Comptes bancaires et transferts" />
              <LinkCard href="/vivre-aux-philippines/visas-et-formalites" title="Obtenir un visa" desc="Types de visas et procédures" />
              <LinkCard href="/vivre-aux-philippines/logement" title="Trouver un logement" desc="Prix et conseils location" />
              <LinkCard href="/forum-sur-les-philippines" title="Forum expatriés" desc="Échangez avec la communauté" />
            </CardGrid>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SanteAssurancesPage;
