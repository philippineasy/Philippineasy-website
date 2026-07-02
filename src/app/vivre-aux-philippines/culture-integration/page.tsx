import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { PageHero, SplitSection, CardGrid, LinkCard, CTABand } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import ArticleList from '@/components/shared/ArticleList';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Culture & Intégration aux Philippines',
  description:
    "Comprendre la culture philippine, les coutumes locales, et des conseils pour une intégration réussie : en solo, en famille, ou pendant vos études aux Philippines.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/culture-integration',
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
    title: 'Culture & Intégration aux Philippines',
    description:
      "Comprendre la culture philippine, les coutumes locales, et des conseils pour une intégration réussie aux Philippines.",
    url: 'https://philippineasy.com/vivre-aux-philippines/culture-integration',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Culture & Intégration aux Philippines',
    description:
      "Comprendre la culture philippine, les coutumes locales, et une intégration réussie aux Philippines.",
    site: '@philippineasy',
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
  { label: 'Culture & Intégration' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
  { name: 'Culture & Intégration', item: '/vivre-aux-philippines/culture-integration' },
];

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux (server components), repris à l'identique   */
/* de la page exemplaire visas-et-formalites : eyebrow + h2 à mot accentué,   */
/* checklist cochée, table de données compacte, lien-action inline.           */
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

// Liste "cochée". Div-based pour ne pas hériter des puces disc du rich-text.
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
        <span
          className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
          aria-hidden="true"
        />
        <span>{item}</span>
      </div>
    ))}
  </div>
);

// Table de données compacte (budget). Libellé + montant aligné à droite.
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

// Lien-action rendu dans le rich-text de SplitSection : couleur accent-strong
// forcée (AA) et no-underline via `style`, qui prime sur la règle `[&_a]`.
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

const budgetRows = [
  { label: 'Logement', value: '600 € – 1 500 €' },
  { label: 'Nourriture', value: '350 € – 600 €' },
  { label: 'Scolarité', value: '800 € – 2 100 €' },
  { label: 'Santé & loisirs', value: '250 € – 500 €' },
];

const CultureIntegrationPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'culture-integration');

  if (error) {
    console.error(error);
  }

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Culture & Intégration"
        titleAccent="aux Philippines"
        subtitle="Comprendre la culture philippine, les coutumes locales, et des conseils pour une intégration réussie — en solo, en famille, ou le temps de vos études."
        imageUrl="/imagesHero/nouveau-depart-aux-philippines.webp"
        imageAlt="Culture & Intégration aux Philippines"
      />

      {/* Intro éditoriale */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <SectionHeader
              eyebrow="Trois volets, une même installation"
              title="Comprendre avant de"
              accent="s'installer"
            />
            <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Réussir son installation aux Philippines dépend moins de la paperasse que de la
                capacité à comprendre les gens : les valeurs familiales, la vie communautaire, les
                usages qui structurent le quotidien. L&apos;anglais, langue d&apos;enseignement
                officielle, est parlé pratiquement partout dans l&apos;archipel — un vrai confort,
                mais qui ne remplace pas cette compréhension sociale et familiale, seule vraie clé
                d&apos;une intégration réussie.
              </p>
              <p>
                Cette page rassemble trois entrées pour aborder le sujet : les codes à connaître
                pour s&apos;intégrer, ce que change une installation en famille — logement, santé,
                budget — et le parcours pour étudier sur place, de l&apos;université aux écoles
                internationales. Nos articles plus bas creusent chaque thème en détail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapitre 1 — S'intégrer (photo dialogue interculturel, à gauche) */}
      <SplitSection
        eyebrow="Vie sociale et familiale"
        title="Comprendre les"
        titleAccent="codes culturels"
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Dialogue interculturel entre voyageurs et habitants aux Philippines"
      >
        <p>
          Les valeurs familiales pèsent lourd aux Philippines, tout comme la vie communautaire et
          l&apos;entraide de voisinage. Ce sont ces usages-là, plus que la langue, qui structurent
          le quotidien — l&apos;anglais, lui, ne pose pas de problème : c&apos;est la langue
          d&apos;enseignement officielle, parlée pratiquement partout dans l&apos;archipel.
        </p>
        <p>
          Que vous arriviez seul, en couple ou en famille, c&apos;est la compréhension de ces
          dynamiques sociales qui fait la différence entre une installation qui patine et une
          intégration réussie.
        </p>
        <h4>À approfondir dans nos guides</h4>
        <CheckList
          items={[
            'Vie de couple et codes culturels',
            'Rencontres et vie sociale sur place',
            'Coopération et associations franco-philippines',
          ]}
        />
      </SplitSection>

      {/* Chapitre 2 — En famille (photo condominium familial, à droite) */}
      <SplitSection
        reverse
        eyebrow="S'installer avec ses enfants"
        title="Un nouveau chapitre"
        titleAccent="familial"
        imageUrl="/images/famille/famille-condominium-philippines.webp"
        imageAlt="Copropriété avec piscine, logement familial aux Philippines"
      >
        <p>
          S&apos;expatrier en famille aux Philippines reste une aventure excitante : coût de la
          vie attractif, population accueillante, nature luxuriante. Le logement donne le ton —
          comptez 700 à 1200€ pour un condominium sécurisé à Manille, ou 400 à 600€ pour une
          maison à Cebu ou Davao.
        </p>
        <p>
          Côté santé, les hôpitaux privés sont de bon niveau, mais une assurance santé
          internationale reste indispensable pour couvrir les frais. Au global, un budget familial
          mensuel se situe entre 1 500 € et 3 000 €, toutes dépenses courantes incluses.
        </p>
        <DataTable caption="Budget familial mensuel estimé" rows={budgetRows} />
        <p className="!mt-5">
          Pour la scolarité justement, direction notre chapitre dédié aux écoles et universités,
          juste plus bas.
        </p>
      </SplitSection>

      {/* Pause (fond muté) — repères administratifs et pratiques du quotidien */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Une fois sur place"
            title="Les repères du"
            accent="quotidien"
          />
          <div className="mt-8 max-w-4xl">
            <CheckList
              columns={2}
              items={[
                'Les visas 13(a) (mariage), 9(G) (travail) ou SRRV (retraite) couvrent la majorité des situations',
                <>
                  L&apos;ACR Card, ou <em>Alien Certificate of Registration</em>, reste
                  obligatoire pour les résidents
                </>,
                "L'anglais est parlé partout, ce qui simplifie les démarches de tous les jours",
                'Grab facilite les déplacements en ville',
                "Les groupes Facebook d'expatriés sont une mine de conseils pratiques",
              ]}
            />
          </div>
          <InlineLink href="/vivre-aux-philippines/visas-et-formalites">
            Le guide complet des visas et formalités
          </InlineLink>
        </div>
      </section>

      {/* Chapitre 3 — Étudier (photo campus, à gauche) */}
      <SplitSection
        eyebrow="Université et écoles internationales"
        title="Étudier aux"
        titleAccent="Philippines"
        imageUrl="/imagesHero/ou-et-comment-etudier-aux-philippines.webp"
        imageAlt="Campus universitaire animé aux Philippines"
      >
        <h4>Les universités philippines</h4>
        <p>
          Les Philippines comptent plusieurs universités de premier plan : l&apos;Université des
          Philippines (UP), Ateneo de Manila (ADMU), De La Salle University (DLSU) ou University
          of Santo Tomas (UST). Programmes en anglais, frais de scolarité très abordables comparés
          à l&apos;Europe ou l&apos;Amérique du Nord, domaines d&apos;excellence en commerce,
          ingénierie et médecine — de quoi attirer des étudiants de toute l&apos;Asie. En 2026, 35
          universités philippines figurent dans le classement QS Asia, l&apos;Université des
          Philippines en tête.
        </p>
        <InlineLink href="/vivre-aux-philippines/etudier/universites">
          Découvrir les universités philippines
        </InlineLink>
        <h4 className="!mt-8">Pour les enfants d&apos;expatriés</h4>
        <p>
          Pour les familles installées avec des enfants, les écoles internationales de Manille et
          de Cebu proposent des cursus américain, britannique ou IB, dans un environnement
          multiculturel taillé pour préparer aux meilleures universités du monde. Comptez
          10k-25k€/an pour des établissements comme l&apos;International School Manila (ISM) ou la
          British School Manila (BSM).
        </p>
        <InlineLink href="/vivre-aux-philippines/etudier/ecoles-internationales">
          Trouver une école internationale
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
                title="Trouver un logement"
                href="/vivre-aux-philippines/logement"
                desc="Condos, maisons et quartiers où poser ses valises."
                cta="En savoir plus"
              />
              <LinkCard
                title="Protéger sa santé"
                href="/vivre-aux-philippines/sante-assurances"
                desc="PhilHealth, HMO locales et assurances internationales."
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
                title="Nos articles culture &"
                accent="intégration"
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
        title="Prêt à préparer"
        titleAccent="votre installation ?"
        subtitle="Retrouvez tous nos guides pratiques pour vivre aux Philippines, ou posez vos questions à la communauté d'expatriés sur le forum."
        primary={{ label: 'Explorer nos guides Vivre aux Philippines', href: '/vivre-aux-philippines' }}
        secondary={{ label: 'Rejoindre le forum', href: '/forum-sur-les-philippines' }}
      />
    </div>
  );
};

export default CultureIntegrationPage;
