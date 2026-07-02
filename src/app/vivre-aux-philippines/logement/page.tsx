import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CheckCircle, ExternalLink, ArrowRight, AlertTriangle, MessageSquare } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faSackDollar, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, CTABand } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import ArticleList from '@/components/shared/ArticleList';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Trouver un Logement aux Philippines en 2026 : Prix et Conseils",
  description: "Guide complet pour trouver un logement aux Philippines : prix des loyers à Manila, Cebu et BGC en 2026, meilleures plateformes (Lamudi, Carousell), conseils pour la location et pièges à éviter.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/logement',
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
    title: "Trouver un Logement aux Philippines en 2026 : Prix et Conseils",
    description: "Prix des loyers à Manila et Cebu, meilleures plateformes de recherche, conseils pratiques pour expatriés. Guide actualisé 2026.",
    url: 'https://philippineasy.com/vivre-aux-philippines/logement',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Logement aux Philippines 2026 : Guide Complet",
    description: "Prix des loyers, plateformes et conseils pour trouver un logement aux Philippines.",
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
  { label: 'Logement' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
  { name: 'Logement', item: '/vivre-aux-philippines/logement' },
];

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux (server components), repris de la recette   */
/* validée sur visas-et-formalites : eyebrow + h2 à mot accentué, listes      */
/* cochées, tables de données compactes, encadré d'avertissement, lien inline.*/
/* -------------------------------------------------------------------------- */

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

// Liste "cochée" (plateformes, pièces à réunir, bons réflexes). Div-based pour
// ne pas hériter des puces disc du rich-text de SplitSection.
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

// Table de données compacte (loyers, charges, contrats). Libellé + valeur
// alignée à droite ; chiffres en `text-foreground` pour un contraste AA net.
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

// Encadré d'avertissement (bord accent). Réservé aux réflexes anti-arnaque.
const CautionBox = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-4 rounded-r-lg border-l-4 border-accent bg-accent/5 py-4 pl-5 pr-4">
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

// Lien-action (plateformes, articles liés). Rendu dans le rich-text de
// SplitSection : couleur accent-strong (AA) et no-underline forcés via `style`,
// qui prime sur la règle `[&_a]` du conteneur.
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

const LogementPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'logement');

  if (error) {
    console.error(error);
  }

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Trouver un"
        titleAccent="Logement"
        subtitle="Le guide pratique pour dénicher votre appartement ou maison aux Philippines, avec les prix actuels et les meilleures stratégies de recherche."
        imageUrl="/images/investir/vue-condominium-philippines.webp"
        imageAlt="Trouver un Logement"
      />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <SectionHeader eyebrow="Où poser vos valises" title="Trouver le bon" accent="toit" />
            <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Un condo qui domine BGC, un appartement lumineux du côté de Cebu, une maison
                derrière les grilles d&apos;un village sécurisé : le marché locatif philippin
                couvre à peu près tous les budgets et tous les styles de vie. Reste à savoir où
                chercher, combien prévoir et ce qui se négocie vraiment.
              </p>
              <p>
                Ce guide réunit les prix constatés à Manille et à Cebu en 2026, les plateformes et
                les réseaux qui fonctionnent réellement sur place, ainsi que les pièges à éviter
                avant de signer un bail.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '3', label: 'types de logement', icon: <FontAwesomeIcon icon={faBuilding} className="text-[18px]" /> },
                { value: '14k', label: 'PHP minimum/mois', icon: <FontAwesomeIcon icon={faSackDollar} className="text-[18px]" /> },
                { value: '2', label: 'villes principales', icon: <FontAwesomeIcon icon={faLocationDot} className="text-[18px]" /> },
                { value: '12', label: 'mois de bail min.', icon: <FontAwesomeIcon icon={faClock} className="text-[18px]" /> },
              ]}
            />
          </div>

          <p className="mt-6 max-w-3xl text-[14px] leading-[1.6] text-muted-foreground">
            Ces fourchettes restent indicatives : le prix d&apos;un bien dépend de l&apos;étage, de
            la vue et de la saison, et il se négocie presque toujours aux Philippines.
          </p>
        </div>
      </section>

      {/* Chapitre 1 — Types de logement (photo famille/condo, à gauche) */}
      <SplitSection
        eyebrow="Ce qui existe sur le marché"
        title="Trois familles de"
        titleAccent="logement"
        imageUrl="/images/famille/famille-condominium-philippines.webp"
        imageAlt="Famille profitant de la piscine d'une résidence de condominiums aux Philippines"
      >
        <p>
          Trois formats se partagent l&apos;essentiel du marché : le condominium en tour avec ses
          services, la maison individuelle dans un lotissement fermé, et l&apos;appartement plus
          modeste dans un immeuble ancien. Le choix dépend surtout du budget et de la vie de
          quartier recherchée.
        </p>
        <p>
          Le condominium reste le réflexe numéro un des expatriés : sécurité active 24 h/24,
          piscine, salle de sport et souvent un générateur de secours qui prend le relais lors des
          coupures de courant. La maison, en <em>house and lot</em>, offre plus d&apos;espace et un
          jardin, dans des subdivisions surveillées par des gardiens — un format que privilégient
          les familles. L&apos;appartement, enfin, reste l&apos;option la plus économique, avec des
          baux souvent plus flexibles, même s&apos;il n&apos;inclut pas les commodités d&apos;un
          condo.
        </p>
        <DataTable
          caption="En un coup d'œil"
          rows={[
            { label: 'Condominium', sub: 'Sécurité, piscine, salle de sport', value: 'Le plus demandé' },
            { label: 'Maison (house and lot)', sub: 'Jardin, subdivision sécurisée', value: 'Pour les familles' },
            { label: 'Appartement', sub: 'Emplacements variés, bail flexible', value: 'Budget serré' },
          ]}
        />
      </SplitSection>

      {/* Chapitre 2 — Prix des loyers 2026 (photo studio meublé, à droite) */}
      <SplitSection
        reverse
        eyebrow="Le nerf de la guerre"
        title="Manila et Cebu,"
        titleAccent="deux marchés"
        imageUrl="/images/budget/apparthotel-coquet.webp"
        imageAlt="Studio meublé moderne avec kitchenette, exemple de location aux Philippines"
      >
        <p>
          Les loyers varient fortement selon la ville et le quartier, mais Metro Manila et Cebu
          City concentrent l&apos;essentiel de la demande expatriée. Voici les fourchettes
          observées en 2026, hors charges.
        </p>
        <DataTable
          caption="Loyers à Metro Manila · BGC, Makati, Rockwell, Ortigas"
          rows={[
            { label: 'Studio (20-30 m²)', value: '25 000 – 40 000 PHP' },
            { label: '1 chambre (35-50 m²)', value: '35 000 – 60 000 PHP' },
            { label: '2 chambres (60-80 m²)', value: '50 000 – 95 000 PHP' },
            { label: '3 chambres+ (100+ m²)', value: '80 000 – 150 000 PHP' },
          ]}
        />
        <p className="!mt-5">À Cebu, comptez sensiblement moins pour un espace équivalent.</p>
        <DataTable
          caption="Loyers à Cebu City · IT Park, Business Park, Lahug, Mactan"
          rows={[
            { label: 'Studio (20-30 m²)', value: '14 000 – 23 000 PHP' },
            { label: '1 chambre (35-50 m²)', value: '22 000 – 50 000 PHP' },
            { label: '2 chambres (60-80 m²)', value: '35 000 – 80 000 PHP' },
            { label: 'Maison 2-3 ch.', value: '40 000 – 70 000 PHP' },
          ]}
        />
        <p className="!mt-5">
          Le loyer affiché n&apos;est jamais le montant final. Comptez ces postes en plus, chaque
          mois :
        </p>
        <DataTable
          caption="Charges à prévoir en plus du loyer"
          rows={[
            { label: 'Électricité', value: '3 000 – 8 000 PHP/mois' },
            { label: 'Eau', value: '300 – 800 PHP/mois' },
            { label: 'Internet fibre', value: '1 500 – 3 000 PHP/mois' },
            { label: 'Charges de copropriété', sub: 'Entretien des parties communes du condo', value: '2 000 – 6 000 PHP/mois' },
            { label: 'Parking', value: '2 000 – 5 000 PHP/mois' },
          ]}
        />
      </SplitSection>

      {/* Chapitre 3 — Où chercher (photo jeepney/quartier, à gauche) */}
      <SplitSection
        eyebrow="La chasse au logement"
        title="Où chercher un"
        titleAccent="logement"
        imageUrl="/images/transport/jeepney-aux-philippines.webp"
        imageAlt="Jeepney coloré dans une rue résidentielle aux Philippines"
      >
        <p>
          La chasse démarre en ligne, sur les plateformes spécialisées et les réseaux sociaux,
          avant de se conclure la plupart du temps par une visite organisée par un agent local.
        </p>
        <h4>Les plateformes qui comptent</h4>
        <CheckList
          items={[
            <>
              <a href="https://www.lamudi.com.ph/" target="_blank" rel="noopener noreferrer">
                Lamudi.com.ph
              </a>
              , le leader du marché, avec le plus large choix d&apos;annonces
            </>,
            <>
              <a href="https://www.dotproperty.com.ph/" target="_blank" rel="noopener noreferrer">
                DotProperty.com.ph
              </a>
              , une interface plus soignée, pratique pour affiner sa recherche
            </>,
            <>
              <a
                href="https://www.carousell.ph/categories/property-102"
                target="_blank"
                rel="noopener noreferrer"
              >
                Carousell Property
              </a>
              , pour les annonces postées en direct par les propriétaires
            </>,
          ]}
        />
        <h4>Les groupes Facebook actifs</h4>
        <CheckList
          columns={2}
          items={[
            'Manila Expats Housing',
            'Cebu Apartments for Rent',
            'BGC Condo Rentals',
            'Makati Rentals – Direct Owners',
          ]}
        />
        <p className="!mt-5">
          Une recherche simple, du type « [ville] apartments for rent », suffit généralement à
          remonter les groupes les plus actifs.
        </p>
        <p>
          Les agents immobiliers (<em>brokers</em>) restent utiles pour les biens haut de gamme et
          la négociation. Leur commission — 1 mois de loyer, en général — est le plus souvent
          payée par le propriétaire. Vérifiez simplement que l&apos;agent est enregistré auprès de
          la PRC avant de vous engager.
        </p>
      </SplitSection>

      {/* Chapitre 4 — Conditions de location (photo emménagement, à droite) */}
      <SplitSection
        reverse
        eyebrow="Avant de signer"
        title="Dépôt, durée et"
        titleAccent="contrat"
        imageUrl="/imagesHero/nouveau-depart-aux-philippines.webp"
        imageAlt="Locataire arrivant avec ses valises devant sa nouvelle maison aux Philippines"
      >
        <p>
          Mieux vaut connaître les usages locaux avant de signer : ce qui se paie d&apos;avance, ce
          qui se négocie, et la durée d&apos;engagement standard.
        </p>
        <DataTable
          caption="À prévoir à l'entrée"
          rows={[
            { label: 'Dépôt de garantie', value: '2 mois de loyer' },
            { label: 'Avance de loyer', value: '1 à 2 mois' },
            { label: 'Total à la signature', value: '3 à 4 mois de loyer' },
          ]}
        />
        <p className="!mt-5">
          Le dépôt couvre les dommages éventuels et les loyers impayés ; il est normalement
          restitué en fin de bail, déduction faite des réparations. Les chèques post-datés
          (<em>post-dated checks</em>) sont parfois acceptés en garantie, et le chèque reste, plus
          généralement, un moyen de paiement courant pour le loyer mensuel.
        </p>
        <DataTable
          caption="Types de contrat courants"
          rows={[
            { label: 'Bail standard', sub: '12 mois, renouvelable — pénalité en cas de départ anticipé', value: 'Classique' },
            { label: 'Courte durée', sub: '6 mois possible, loyer majoré de 10 à 20 %', value: 'Flexible' },
            { label: 'Location meublée', sub: "Très répandue, électroménager souvent inclus", value: 'Pratique' },
          ]}
        />
      </SplitSection>

      {/* Pause tonale (fond muté) — bonnes pratiques avant de signer + contact */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Avant de signer"
            title="Ce qui fait la"
            accent="différence"
            description="Douze réflexes qui évitent les mauvaises surprises une fois les clés en main."
          />

          <div className="mt-8 max-w-4xl">
            <div className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-primary">
              <CheckCircle className="h-4 w-4" aria-hidden="true" />À faire
            </div>
            <CheckList
              columns={2}
              items={[
                'Visitez toujours en personne — les photos flattent plus que la réalité',
                "Vérifiez la pression de l'eau et l'état de la climatisation",
                "Testez la connexion internet réellement disponible dans l'immeuble",
                "Photographiez l'état des lieux avant d'emménager",
                'Demandez une copie du titre de propriété ou du contrat de gestion',
                'Négociez — les loyers affichés sont rarement figés',
              ]}
            />

            <div className="mb-2.5 mt-10 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-accent-strong">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />À éviter
            </div>
            <CautionBox
              title="Réflexes anti-arnaque"
              items={[
                "Payer avant même d'avoir vu le logement de vos propres yeux",
                'Se laisser tenter par une offre trop belle pour être vraie',
                "Un rez-de-chaussée (RDC) si vous pouvez l'éviter — inondations et sécurité",
                'Signer sans avoir lu le contrat dans son intégralité',
                'Ignorer les nuisances sonores ou olfactives du quartier',
                'Sous-estimer le temps de trajet aux heures de pointe',
              ]}
            />

            <h3 className="mb-3 mt-10 text-[20px] font-semibold tracking-[-0.01em] text-foreground">
              Contacter un propriétaire
            </h3>
            <p className="mb-4 text-[15px] leading-[1.6] text-muted-foreground">
              Les échanges se font presque toujours en anglais. Voici une trame qui couvre
              l&apos;essentiel :
            </p>
            <div className="overflow-hidden rounded-xl border-[0.5px] border-border bg-card">
              <div className="flex items-center gap-2.5 border-b border-border bg-background px-4 py-2.5 text-[13px] font-semibold text-muted-foreground">
                <MessageSquare className="h-4 w-4 text-primary" aria-hidden="true" />
                Exemple de message, en anglais
              </div>
              <div className="space-y-3 px-5 py-5 font-mono text-[13px] leading-[1.7] text-foreground">
                <p>Hello,</p>
                <p>
                  I saw your listing for the [1-bedroom condo] in [BGC/Makati] on
                  [Lamudi/Facebook].
                </p>
                <p>
                  I&apos;m a French expatriate looking for a long-term rental (12+ months). I&apos;m
                  interested in scheduling a viewing at your earliest convenience.
                </p>
                <p>Could you please confirm:</p>
                <p className="pl-4">- If the unit is still available</p>
                <p className="pl-4">- The monthly rent and what&apos;s included</p>
                <p className="pl-4">- The required deposit and advance</p>
                <p className="pl-4">- When we could arrange a visit</p>
                <p>Thank you for your time.</p>
                <p>
                  Best regards,
                  <br />
                  [Votre nom]
                  <br />
                  [Votre numéro]
                </p>
              </div>
            </div>

            <div className="mb-2.5 mt-6 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-primary">
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              Bons réflexes de communication
            </div>
            <CheckList
              columns={2}
              items={[
                'Les échanges se font principalement en anglais',
                'Viber et WhatsApp sont les messageries les plus utilisées',
                'Répondez vite : les bons logements partent en quelques heures',
                'Restez poli mais direct dans vos messages',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Chapitre 5 — Internet et connectivité (photo antennes, à gauche) */}
      <SplitSection
        eyebrow="Télétravail oblige"
        title="Internet et"
        titleAccent="connectivité"
        imageUrl="/imagesHero/antennes-reseaux-aux-philippines.webp"
        imageAlt="Antennes télécoms au-dessus d'un quartier résidentiel aux Philippines"
      >
        <p>
          Le télétravail rend la question incontournable : vérifiez la couverture fibre du
          quartier avant de signer, pas après.
        </p>
        <DataTable
          caption="Fournisseurs fibre les plus courants"
          rows={[
            { label: 'PLDT Fibr', sub: 'Leader du marché, bonne couverture', value: '1 699 PHP/mois' },
            { label: 'Globe Fiber', sub: 'Alternative solide, bon SAV', value: '1 499 PHP/mois' },
            { label: 'Converge', sub: 'Bon rapport qualité-prix', value: '1 500 PHP/mois' },
          ]}
        />
        <p className="!mt-5">
          Dans les immeubles récents, la fibre est en général déjà tirée jusqu&apos;au palier ;
          ailleurs, comptez quelques jours d&apos;installation après la signature du contrat.
        </p>
      </SplitSection>

      {/* Chapitre 6 — Investir dans l'immobilier locatif (acquis anti-cannibalisation, photo à droite) */}
      <SplitSection
        reverse
        eyebrow="Une autre logique"
        title="Investir dans"
        titleAccent="l'immobilier locatif"
        imageUrl="/images/investir/vue-condominium-philippines.webp"
        imageAlt="Villa avec piscine à débordement et vue sur la mer, exemple de bien locatif haut de gamme"
      >
        <p>
          Louer n&apos;est pas la seule option : certains lecteurs envisagent d&apos;acheter un
          bien aux Philippines pour le mettre en location plutôt que pour y vivre eux-mêmes. Cette
          logique d&apos;investissement obéit à des règles différentes de celles d&apos;une simple
          recherche de logement, avec un rendement locatif brut généralement compris entre 5 et
          8 % selon les zones.
        </p>
        <p>
          Les étrangers ne peuvent pas posséder de terrain aux Philippines, mais peuvent détenir un
          condominium à 100 % en nom propre, dans la limite d&apos;un quota de 40 % par immeuble.
          Une fiscalité spécifique s&apos;applique aux revenus locatifs.
        </p>
        <p>
          Si votre objectif est de générer un revenu locatif, notre guide dédié détaille le
          rendement par zone, la fiscalité et le processus d&apos;achat. Pour acheter un bien où
          vivre vous-même, sans recherche de rendement, l&apos;article sur l&apos;achat immobilier
          aux Philippines répond à cette question précise.
        </p>
        <InlineLink href="/vivre-aux-philippines/investir/immobilier">
          Investissement locatif : rendement, fiscalité, quota 40 %
        </InlineLink>
        <br />
        <InlineLink href="/vivre-aux-philippines/logement/acheter-immobilier-philippines">
          Acheter pour y vivre : résidence principale, pas d&apos;investissement
        </InlineLink>
      </SplitSection>

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
                title="Investir dans l'immobilier"
                href="/vivre-aux-philippines/investir/immobilier"
                desc="Acheter plutôt que louer."
                cta="En savoir plus"
              />
              <LinkCard
                title="Banques et assurances"
                href="/vivre-aux-philippines/banque-finances"
                desc="Ouvrir un compte bancaire sur place."
                cta="En savoir plus"
              />
              <LinkCard
                title="Forum des expatriés"
                href="/forum-sur-les-philippines"
                desc="Échangez avec la communauté."
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
              <SectionHeader eyebrow="À lire aussi" title="Nos articles" accent="logement" />
              <div className="mt-8">
                <ArticleList articles={articles} basePath="vivre-aux-philippines" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Panneau signature de clôture */}
      <CTABand
        title="Une question sur"
        titleAccent="votre logement ?"
        subtitle="Posez votre cas à la communauté d'expatriés sur le forum, ou creusez la question de l'achat si louer ne vous suffit plus."
        primary={{ label: 'Poser ma question sur le forum', href: '/forum-sur-les-philippines' }}
        secondary={{ label: 'Acheter plutôt que louer', href: '/vivre-aux-philippines/investir/immobilier' }}
      />
    </div>
  );
};

export default LogementPage;
