import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ArrowRight, CheckCircle, ExternalLink, TrendingUp, Home } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBuilding, faCalendarDays, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, FaqAccordion } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import ArticleList from '@/components/shared/ArticleList';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Travailler et Entreprendre aux Philippines',
  description:
    "Du salariat à la création d'entreprise : guide complet pour trouver un emploi, monter votre société et investir aux Philippines (bourse, immobilier).",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/travail-entreprise',
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
    title: 'Travailler et Entreprendre aux Philippines',
    description:
      "Emploi salarié, création d'entreprise et investissement : le guide complet pour construire votre vie professionnelle aux Philippines.",
    url: 'https://philippineasy.com/vivre-aux-philippines/travail-entreprise',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travailler et Entreprendre aux Philippines',
    description: "Emploi salarié, création d'entreprise et investissement aux Philippines : le guide complet.",
    site: '@philippineasy',
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
  { label: 'Travail & Entreprise' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
  { name: 'Travail & Entreprise', item: '/vivre-aux-philippines/travail-entreprise' },
];

const INVESTIR_GUIDE =
  '/vivre-aux-philippines/travail-entreprise/investir-aux-philippines-guide-francais-2025';

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

// Liste "cochée" (postes, avantages, démarches). Div-based pour ne pas hériter
// des puces disc du rich-text de SplitSection. Accepte du JSX (liens inline).
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

// Lien-action (guides internes, portails officiels). Rendu à l'intérieur du
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

const travailFaqs = [
  {
    q: 'Quel secteur recrute le plus de profils internationaux aux Philippines ?',
    a: "Le secteur du BPO (Business Process Outsourcing) reste le plus gros pourvoyeur d'emplois pour les profils internationaux : centres d'appel, support client, comptabilité délocalisée. Les recruteurs y cherchent surtout des bilingues capables de gérer une clientèle francophone, un vrai atout pour un candidat français.",
  },
  {
    q: 'Quelles démarches pour travailler légalement en tant que salarié aux Philippines ?',
    a: "Les démarches sont encadrées par le visa de travail 9(G) et le permis AEP, à initier avec votre employeur. Les postes les plus recherchés concernent les développeurs, les spécialistes support et les analystes financiers, avec des salaires qui varient selon l'expérience et le secteur.",
  },
  {
    q: 'Comment créer son entreprise aux Philippines en tant qu\'étranger ?',
    a: "La plateforme eSPARC facilite l'enregistrement en ligne auprès de la SEC, et les zones PEZA offrent des avantages fiscaux appréciables pour les activités exportatrices ou technologiques. La structure juridique se choisit selon le projet — Corporation, Sole Proprietorship ou Branch Office — et le capital requis varie selon l'activité et la part de capital détenue par des étrangers. La FINL encadre encore la participation étrangère dans certains secteurs.",
  },
  {
    q: "Peut-on investir aux Philippines sans y travailler ?",
    a: "Oui : si vous disposez déjà d'un capital, deux voies méritent d'être creusées, la bourse via le Philippine Stock Exchange (PSE) et l'immobilier locatif, soumis à la règle des 40 % pour les acquéreurs étrangers. Ce ne sont pas les seules façons de construire son avenir sur l'archipel, mais elles complètent le salariat et l'entrepreneuriat.",
  },
];

const TravailEntreprisePage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'travail-entreprise');

  if (error) {
    console.error(error);
  }

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Travailler aux"
        titleAccent="Philippines"
        subtitle="Du salariat à l'entrepreneuriat, découvrez les opportunités professionnelles qui vous attendent dans l'archipel."
        imageUrl="/imagesHero/travailleur-etranger-aux-philippines.webp"
        imageAlt="Travailler aux Philippines"
      />

      {/* Intro éditoriale + chiffres clés ancrés */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <SectionHeader
              eyebrow="Emploi, entreprise, investissement"
              title="Construire votre vie"
              accent="professionnelle"
            />
            <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Poser ses valises aux Philippines, c&apos;est une chose ; en vivre sur la durée,
                c&apos;en est une autre. Trois chemins s&apos;offrent à vous : décrocher un poste
                salarié, notamment dans le secteur du BPO qui recrute massivement, monter votre
                propre structure sur place, ou faire fructifier un capital déjà constitué, en
                bourse ou dans l&apos;immobilier.
              </p>
              <p>
                Chaque option a ses démarches, ses délais et ses coûts propres. Nous détaillons
                les trois pistes ci-dessous, avec un lien vers le guide complet pour chacune ; les
                chiffres qui suivent vous donnent un premier aperçu du marché du travail
                philippin.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-4xl">
            <StatRow
              stats={[
                { value: '6', label: 'Secteurs porteurs', icon: <FontAwesomeIcon icon={faBriefcase} className="text-[18px]" /> },
                { value: '1.5M', label: 'Emplois BPO', icon: <FontAwesomeIcon icon={faBuilding} className="text-[18px]" /> },
                { value: '2-4', label: 'Mois visa 9G', icon: <FontAwesomeIcon icon={faCalendarDays} className="text-[18px]" /> },
                { value: '13', label: 'Mois de salaire', icon: <FontAwesomeIcon icon={faSackDollar} className="text-[18px]" /> },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Chapitre 1 — Emploi salarié (photo recherche d'emploi, à droite) */}
      <SplitSection
        eyebrow="Salariat"
        title="Trouver un"
        titleAccent="emploi salarié"
        imageUrl="/images/communication/personne-avec-telephone.webp"
        imageAlt="Jeune actif consultant des offres d'emploi sur son téléphone dans une rue philippine"
      >
        <p>
          Le secteur du BPO (<em>Business Process Outsourcing</em>) reste le plus gros pourvoyeur
          d&apos;emplois pour les profils internationaux : centres d&apos;appel, support client,
          comptabilité délocalisée... Les recruteurs y cherchent surtout des bilingues capables de
          gérer une clientèle francophone, un vrai atout si c&apos;est votre cas.
        </p>
        <CheckList
          items={[
            'Postes recherchés : développeurs, spécialistes support, analystes financiers',
            'Démarches encadrées : visa de travail 9(G) et permis AEP, à initier avec votre employeur',
            'Salaires : des fourchettes réelles, qui varient selon votre expérience et le secteur',
          ]}
        />
        <p className="!mt-5">
          Notre guide complet entre dans le détail : les plateformes qui fonctionnent vraiment,
          comme JobStreet et LinkedIn, les fourchettes de salaires observées sur le terrain, et
          les démarches administratives pas à pas.
        </p>
        <InlineLink href="/vivre-aux-philippines/travailler/emploi-salarie">
          Le guide complet de l&apos;emploi salarié
        </InlineLink>
      </SplitSection>

      {/* Chapitre 2 — Créer son entreprise (photo capital/monnaie locale, à gauche) */}
      <SplitSection
        reverse
        eyebrow="Entrepreneuriat"
        title="Créer son"
        titleAccent="entreprise"
        imageUrl="/imagesHero/comment-investir-aux-philippines.webp"
        imageAlt="Billet de 100 pesos philippins tenu devant un étal de street food, symbole de la monnaie locale"
      >
        <p>
          Les Philippines cultivent l&apos;entrepreneuriat étranger : la plateforme eSPARC
          facilite l&apos;enregistrement en ligne auprès de la SEC, les zones PEZA offrent des
          avantages fiscaux appréciables, et la FINL (<em>Foreign Investment Negative List</em>)
          encadre encore la participation étrangère dans certains secteurs.
        </p>
        <CheckList
          items={[
            'Structures juridiques : Corporation, Sole Proprietorship, Branch Office, selon votre projet',
            'Avantages PEZA : des incitations fiscales et non fiscales substantielles pour les activités exportatrices ou technologiques',
            "Capital requis : variable selon l'activité et la part de capital détenue par des étrangers",
          ]}
        />
        <p className="!mt-5">
          Notre guide complet détaille, étape par étape, comment lancer votre activité en 2026 :
          choix de la structure juridique, capital minimum et enregistrement en ligne.
        </p>
        <InlineLink href="/vivre-aux-philippines/travailler/creer-entreprise">
          Le guide complet de la création d&apos;entreprise
        </InlineLink>
      </SplitSection>

      {/* FAQ */}
      <section className="bg-background py-16 md:py-20">
        <FaqAccordion
          withSchema
          eyebrow="Questions fréquentes"
          title="Travailler et entreprendre,"
          titleAccent="en clair"
          faqs={travailFaqs}
        />
      </section>

      {/* Investir — section courte, anti-cannibalisation : la requête large   */}
      {/* appartient à l'article investir-aux-philippines-guide-francais-2025. */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Faire fructifier son capital"
            title="Investir aux"
            titleAccent="Philippines"
            subtitle="Le salariat et l'entrepreneuriat ne sont pas les seules façons de construire votre avenir sur l'archipel. Si vous disposez déjà d'un capital, deux voies méritent d'être creusées : la bourse et l'immobilier locatif."
            columns={2}
          >
            <LinkCard
              href="/vivre-aux-philippines/investir/bourse-et-entreprises"
              icon={<TrendingUp className="h-5 w-5" />}
              title="Bourse & Entreprises"
              desc="Ouverture de compte sur le Philippine Stock Exchange (PSE), fiscalité, secteurs porteurs et visa investisseur."
              cta="Voir le guide"
            />
            <LinkCard
              href="/vivre-aux-philippines/investir/immobilier"
              icon={<Home className="h-5 w-5" />}
              title="Immobilier Locatif"
              desc="Rendement par zone, fiscalité des loyers et règle des 40% pour les acquéreurs étrangers."
              cta="Voir le guide"
            />
          </CardGrid>
          <div className="mt-10 flex justify-center">
            <InlineLink href={INVESTIR_GUIDE}>
              Le guide complet de l&apos;investissement aux Philippines
            </InlineLink>
          </div>
        </div>
      </section>

      {/* Articles de la catégorie (pause tonale mutée, intouché) */}
      <div className="bg-muted">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nos articles Travail & Entreprise</h2>
          {articles && <ArticleList articles={articles} basePath="vivre-aux-philippines" />}
        </div>
      </div>
    </div>
  );
};

export default TravailEntreprisePage;
