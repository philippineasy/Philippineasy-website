import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Building, FileText, Users, Globe, CheckCircle, AlertTriangle, Briefcase, ExternalLink, Building2, User, Clock, Wallet, Banknote, BadgeCheck } from 'lucide-react';
import { PageHero, StatRow, CardGrid, LinkCard, SplitSection, FaqAccordion } from '@/components/sections';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "Créer son Entreprise aux Philippines en 2026 : Guide Complet",
  description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : SEC, structures juridiques, capital minimum, PEZA, FINL, coûts et démarches 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/travailler/creer-entreprise',
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
    title: "Créer son Entreprise aux Philippines en 2026 : Guide Complet",
    description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : SEC, structures juridiques, capital minimum, PEZA, FINL, coûts et démarches 2026.",
    url: 'https://philippineasy.com/vivre-aux-philippines/travailler/creer-entreprise',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Créer son Entreprise aux Philippines en 2026",
    description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : structures, capital, démarches.",
    site: '@philippineasy',
  },
};

/* -------------------------------------------------------------------------- */
/* Petits blocs éditoriaux locaux (server components), repris du pattern      */
/* validé sur /vivre-aux-philippines/visas-et-formalites. Variante centrée :  */
/* cette page reste très "card grid", le header épouse ce rythme.            */
/* -------------------------------------------------------------------------- */

// En-tête de section centré : eyebrow uppercase + h2 avec UN mot en amber vif
// + description optionnelle. Reprend la géométrie du header interne de CardGrid
// pour rester cohérent avec les sections en grille de cette page.
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
  <div className="mx-auto mb-10 max-w-[720px] text-center">
    <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
      {eyebrow}
    </span>
    <h2
      className="mt-3 text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground"
      style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
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
      <p className="mt-4 text-[17px] leading-[1.6] text-muted-foreground">{description}</p>
    )}
  </div>
);

// Liste "cochée" (conseils, avantages). Div-based pour ne pas hériter des
// puces disc du rich-text de SplitSection.
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

// Lien-action (portails officiels), rendu à l'intérieur du rich-text de
// SplitSection. Même pattern que la page visas.
const inlineLinkClass =
  'group mt-4 inline-flex items-center gap-2 text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm';
const inlineLinkStyle = {
  color: 'hsl(var(--accent-strong))',
  textDecoration: 'none',
} as const;

const InlineLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={inlineLinkClass} style={inlineLinkStyle}>
    <ExternalLink className="h-4 w-4" aria-hidden="true" />
    {children}
  </a>
);

// FAQ 100 % factuelle — reformulée à partir du contenu de la page ci-dessous
// (capital minimum, délais eSPARC, FINL, coûts hors capital, PEZA/BOI).
const CREER_ENTREPRISE_FAQS = [
  {
    q: "Quel capital minimum pour créer une entreprise aux Philippines ?",
    a: "En règle générale, US$200 000 pour une Corporation majoritairement étrangère, réduit à US$100 000 si l'activité est exportatrice, technologique ou emploie plus de 50 salariés locaux. Une Representative Office (sans revenus locaux) ne demande que US$30 000, et une Partnership n'a pas de minimum, sous réserve des règles FINL si la part étrangère dépasse 40 %.",
  },
  {
    q: "Combien de temps prend la création d'une entreprise ?",
    a: "Comptez 4 à 12 semaines via la plateforme eSPARC de la SEC : réservation du nom (1-3 jours), enregistrement SEC (7-20 jours), puis Barangay Clearance, Mayor's Permit et enregistrement BIR, chaque étape se déclenchant une fois la précédente validée.",
  },
  {
    q: "Quels secteurs sont fermés ou limités aux étrangers ?",
    a: "La Foreign Investment Negative List (12ème édition, Executive Order 175) restreint plusieurs secteurs : médias interdits aux étrangers, retail avec un capital minimum de ₱25M si la part étrangère dépasse 40 %, utilities plafonnées à 40 %, et certaines professions réservées aux citoyens philippins.",
  },
  {
    q: "Combien coûte la création hors capital social ?",
    a: "Entre ₱19 000 et ₱62 000 si vous gérez le dossier vous-même (SEC, Barangay, Mayor's Permit, BIR), et entre ₱70 000 et ₱200 000 avec un avocat ou un consultant local. Ce budget n'inclut pas le capital social requis, US$100 000 à 200 000 pour les étrangers.",
  },
  {
    q: "Existe-t-il des avantages fiscaux pour les entreprises exportatrices ou tech ?",
    a: "Oui, via la PEZA pour les 422 zones économiques du pays (export, tech, BPO) : jusqu'à 8 ans d'Income Tax Holiday puis 5 % de SCIT au lieu de 25 % de CIT, plus des importations en franchise de droits. Hors zones, le BOI offre un ITH de 4 à 7 ans pour les secteurs prioritaires. Le CREATE MORE Act de 2024 porte ces avantages jusqu'à 27 ans pour les projets à fort impact.",
  },
];

const CreerEntreprisePage = () => {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Guide pratique"
        title="Créer son"
        titleAccent="Entreprise"
        subtitle="Guide complet pour lancer votre activité aux Philippines : structures juridiques, capital requis, démarches administratives et opportunités fiscales."
        imageUrl="/imagesHero/nouveau-depart-aux-philippines.webp"
        imageAlt="Créer son Entreprise"
      />

      {/* Introduction + alerte FINL */}
      <section className="bg-background pt-12 pb-16 md:pt-14 md:pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader eyebrow="Entreprendre sur l'archipel" title="Un terrain fertile pour" accent="l'entrepreneuriat" />

          <p className="max-w-4xl mx-auto text-lg text-muted-foreground leading-relaxed text-center">
            Avec une croissance économique soutenue, une population jeune de 115 millions d'habitants
            et un taux d'anglophonie parmi les plus élevés d'Asie, les Philippines représentent un terrain fertile pour
            l'entrepreneuriat. La plateforme <strong>eSPARC de la SEC</strong> permet désormais de créer
            une entreprise en 4 à 12 semaines.
          </p>

          <div className="mt-10 border-y border-border py-10">
            <StatRow
              stats={[
                { value: '+6%', label: 'Croissance/an' },
                { value: '115M', label: 'Habitants' },
                { value: '4-12', label: 'Semaines création' },
                { value: '422', label: 'Zones PEZA' },
              ]}
              className="mx-auto max-w-4xl justify-center"
            />
          </div>

          <div className="mt-10 max-w-4xl mx-auto rounded-2xl border border-accent/30 bg-accent/10 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/15 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-accent-strong" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Foreign Investment Negative List (FINL)</h3>
                <p className="text-foreground/80 mb-4">
                  Avant tout projet, consultez la <strong>12ème FINL</strong> (Executive Order 175) qui définit les secteurs
                  où la participation étrangère est limitée ou interdite :
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-card/70 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-foreground">Médias : interdits</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card/70 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-foreground">Retail : ₱25M min si &gt;40%</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card/70 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-foreground">Utilities : max 40%</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card/70 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-foreground">Professions : Philippins</span>
                  </div>
                </div>
                <a
                  href="https://emerhub.com/philippines/foreign-investment-negative-list-in-the-philippines/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-strong hover:text-accent-strong/80 font-semibold transition-colors"
                >
                  Consulter la FINL complète
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structures juridiques */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <CardGrid
            eyebrow="Première décision"
            title="Structures juridiques"
            titleAccent="disponibles"
            subtitle="Le choix de la structure dépend de votre activité, du nombre d'associés et du niveau de contrôle souhaité."
            columns={3}
          >
            {/* Corporation - Recommandé */}
            <div className="relative rounded-2xl border-2 border-primary bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">Recommandé</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Building className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Corporation</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Structure la plus courante pour les investisseurs étrangers. Responsabilité limitée aux apports.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">2-15 actionnaires</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">100% étranger possible</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-foreground">US$200k (US$100k tech)</span>
                </div>
              </div>
            </div>

            {/* OPC */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <User className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">One Person Corp. (OPC)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Structure simplifiée pour un entrepreneur seul. Créée par le Revised Corporation Code de 2019.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Un seul actionnaire</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Ouvert aux étrangers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Secrétaire PH requis</span>
                </div>
              </div>
            </div>

            {/* Branch Office */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Building2 className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Branch Office</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Extension d'une société étrangère. La maison-mère reste responsable des dettes.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">100% contrôle maison-mère</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Génère des revenus locaux</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-foreground">US$200k rapatrié</span>
                </div>
              </div>
            </div>

            {/* Representative Office */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Globe className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Representative Office</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Bureau de liaison sans activité commerciale. Idéal pour prospecter le marché.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Capital réduit : US$30k</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Promotion, étude marché</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Pas de revenus locaux</span>
                </div>
              </div>
            </div>

            {/* Partnership */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Users className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Partnership</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Association de 2+ personnes. Peut être générale ou limitée.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Formalités simplifiées</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Pas de capital minimum</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Rare pour étrangers</span>
                </div>
              </div>
            </div>

            {/* Sole Proprietorship - Non disponible */}
            <div className="rounded-2xl border border-border bg-muted p-6 opacity-75">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted-foreground/10 text-muted-foreground" aria-hidden="true">
                  <FileText className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-muted-foreground">Sole Proprietorship</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Entreprise individuelle. Réservée aux citoyens philippins uniquement.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-foreground font-medium">Non accessible aux étrangers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Enregistrement DTI</span>
                </div>
              </div>
            </div>
          </CardGrid>
        </div>
      </section>

      {/* Capital minimum */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            eyebrow="Le nerf de la guerre"
            title="Capital minimum"
            accent="requis"
            description="La règle générale pour un étranger reste 200 000 US$, mais elle tombe fortement dès que votre activité est exportatrice, technologique ou qu'elle emploie plus de 50 salariés locaux."
          />

          <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border shadow-card-rest overflow-hidden">
            <div className="bg-primary text-primary-foreground p-4">
              <h3 className="font-bold text-lg">Comparatif par structure</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Corporation/OPC */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-foreground">Corporation / OPC</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">US$200,000</span>
                    <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">US$100,000 (tech/50+ employés)</span>
                  </div>
                </div>
              </div>

              {/* Branch Office */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-foreground">Branch Office</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">US$200,000</span>
                    <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">₱5,000 (export PEZA)</span>
                  </div>
                </div>
              </div>

              {/* Representative Office */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Globe className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-foreground">Representative Office</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">US$30,000</span>
                  </div>
                </div>
              </div>

              {/* Partnership */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-foreground">Partnership</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Pas de minimum (règles FINL si &gt;40%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Étapes de création - Timeline */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            eyebrow="Sur le terrain"
            title="Les étapes de"
            accent="création"
            description="Processus complet de 30 à 45 jours ouvrés en moyenne via la plateforme eSPARC. Chaque étape se déclenche une fois la précédente validée : mieux vaut regrouper les documents à l'avance pour ne pas perdre de semaines en allers-retours."
          />

          <div className="max-w-4xl mx-auto">
            <div className="space-y-0">
              {/* Step 1 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Réservation du Nom (SEC)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Vérifiez la disponibilité via <a href="https://esparc.sec.gov.ph" target="_blank" rel="noopener noreferrer" className="underline font-medium text-primary hover:text-primary/80">eSPARC</a>.
                      Réservation valable 90 jours (renouvelable 1x).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 1-3 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱100-500
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Enregistrement SEC</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Soumettez les Articles of Incorporation, By-laws et documents notariés.
                      Pour les étrangers : formulaire FIA + certificat bancaire capital.
                    </p>
                    <div className="bg-card/70 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-foreground mb-2">Documents requis :</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Articles Inc.</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">By-laws</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">FIA (₱3k)</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Certif. bancaire</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">TIN/Passeport</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 7-20 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱10k-30k
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    3
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Barangay Clearance</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Obtenez l'autorisation du barangay (quartier) où sera situé votre bureau.
                      Indispensable pour le Mayor's Permit.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 1-3 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱300-1,800
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    4
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Mayor's Permit (Business Permit)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Permis d'exploitation par la mairie. Inclut inspections sanitaire, incendie et zonage.
                    </p>
                    <div className="bg-card/70 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-foreground mb-2">Documents requis :</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Certif. SEC</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Barangay</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Bail</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">CTC</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Zoning</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-15 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱5k-20k/an
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    5
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Enregistrement BIR</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Bureau of Internal Revenue : TIN entreprise, autorisation factures (ATP),
                      enregistrement livres comptables.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-10 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱500-4,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-card">
                    6
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">Enregistrement Employeurs</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Si vous embauchez : SSS (sécurité sociale), PhilHealth (santé), Pag-IBIG (logement).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-7 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-accent/15 text-accent-strong px-2 py-1 rounded-full">
                        <BadgeCheck className="h-3 w-3" /> Gratuit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estimation des coûts */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            eyebrow="Budgétiser le lancement"
            title="Estimation des"
            accent="coûts totaux"
            description="Hors capital social, la création coûte quelques dizaines de milliers de pesos si vous gérez le dossier vous-même. Faire appel à un avocat ou un consultant local accélère les démarches, mais alourdit sensiblement la facture."
          />

          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-card-rest overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4">
                <h3 className="font-bold text-lg">Budget prévisionnel (hors capital social)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <span className="text-sm text-foreground">Enregistrement SEC</span>
                  <span className="font-semibold text-foreground">₱10,000 - ₱30,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg">
                  <span className="text-sm text-foreground">Barangay Clearance + CTC</span>
                  <span className="font-semibold text-foreground">₱500 - ₱2,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <span className="text-sm text-foreground">Mayor's Permit (1ère année)</span>
                  <span className="font-semibold text-foreground">₱5,000 - ₱20,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg">
                  <span className="text-sm text-foreground">Fire Safety + Zoning</span>
                  <span className="font-semibold text-foreground">₱1,500 - ₱5,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <span className="text-sm text-foreground">Enregistrement BIR + ATP</span>
                  <span className="font-semibold text-foreground">₱2,000 - ₱5,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border-l-4 border-l-accent">
                  <span className="text-sm text-foreground">Honoraires avocat/consultant (optionnel)</span>
                  <span className="font-semibold text-accent-strong">₱50,000 - ₱150,000</span>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <span className="font-semibold text-foreground">TOTAL (sans consultant)</span>
                    <span className="font-bold text-xl text-primary">₱19,000 - ₱62,000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-accent/30 mt-3">
                    <span className="font-semibold text-foreground">TOTAL (avec consultant)</span>
                    <span className="font-bold text-xl text-accent-strong">₱70,000 - ₱200,000</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  * N'inclut pas le capital social requis (US$100,000-200,000 pour les étrangers)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PEZA et incitations fiscales (photo, casse la monotonie des cartes) */}
      <SplitSection
        eyebrow="Réduire la facture fiscale"
        title="PEZA et"
        titleAccent="BOI"
        imageUrl="/images/investir/vue-condominium-philippines.webp"
        imageAlt="Immeuble moderne aux Philippines, en bord de mer"
      >
        <p>
          Le CREATE MORE Act de 2024 offre jusqu'à 27 ans d'avantages fiscaux pour les projets à
          fort impact. Deux organismes distribuent ces incitations, selon que votre activité se
          situe dans une zone économique ou non.
        </p>
        <h4>PEZA — Philippine Economic Zone Authority</h4>
        <p>
          422 zones économiques couvrent le pays, idéales pour l'export, la tech et le BPO.
        </p>
        <CheckList
          items={[
            'Income Tax Holiday de 4 à 8 ans (8 ans pour les projets green tech)',
            '5% de SCIT après ITH, au lieu de 25% de CIT',
            'Importations en franchise de droits pour les équipements et matières premières',
          ]}
        />
        <InlineLink href="https://www.peza.gov.ph/">Site officiel PEZA</InlineLink>

        <h4 className="!mt-8">BOI — Board of Investments</h4>
        <p>
          Pour les projets hors zones économiques, dans les secteurs jugés prioritaires.
        </p>
        <CheckList
          items={[
            'Income Tax Holiday de 4 à 7 ans selon le projet',
            'Déductions additionnelles pour la formation et la R&D',
            'Réductions douanières sur les équipements importés',
          ]}
        />
        <InlineLink href="https://boi.gov.ph/">Site officiel BOI</InlineLink>
      </SplitSection>

      {/* Conseils pratiques (photo, casse la monotonie des cartes) */}
      <SplitSection
        reverse
        eyebrow="Avant de vous lancer"
        title="Nos conseils"
        titleAccent="pratiques"
        imageUrl="/imagesHero/banque-assurance-philippines.webp"
        imageAlt="Agence bancaire philippine avec distributeur et enseigne assurance"
      >
        <p>
          Créer une société aux Philippines se fait très bien seul via eSPARC, mais quatre points
          méritent une attention particulière avant de vous lancer. Ils reviennent systématiquement
          dans les dossiers des entrepreneurs étrangers.
        </p>
        <CheckList
          items={[
            <>
              <strong>Engagez un avocat local.</strong> Un avocat philippin spécialisé en droit des
              affaires vous évitera des erreurs coûteuses, surtout concernant la FINL et les
              structures à capitaux étrangers.
            </>,
            <>
              <strong>Ouvrez un compte corporate.</strong> Préparez votre capital avant de démarrer :
              les banques exigent une preuve de rapatriement de fonds pour les sociétés à capitaux
              étrangers.
            </>,
            <>
              <strong>Nommez un agent résident.</strong> Obligatoire pour les branches et corporations
              à capitaux étrangers. Il peut s'agir d'un citoyen philippin ou d'un étranger titulaire
              d'un visa de travail.
            </>,
            <>
              <strong>Anticipez les obligations fiscales.</strong> Déclarations mensuelles (TVA,
              retenues), trimestrielles et annuelles : un comptable local est quasi indispensable.
            </>,
          ]}
        />
      </SplitSection>

      {/* Ressources officielles */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <CardGrid eyebrow="À consulter" title="Ressources" titleAccent="officielles" columns={3}>
            <a
              href="https://esparc.sec.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">SEC eSPARC</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.bir.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">Bureau of Internal Revenue</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.dti.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">Dept. of Trade</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.peza.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">PEZA</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://boi.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">Board of Investments</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.philembassy.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="font-medium text-foreground">Ambassade PH (FR)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
          </CardGrid>
        </div>
      </section>

      {/* FAQ — questions fréquentes, dérivées du contenu de la page ci-dessus */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Créer son entreprise,"
            titleAccent="en clair"
            faqs={CREER_ENTREPRISE_FAQS}
            withSchema
          />
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="border-t border-border pt-14">
            <CardGrid eyebrow="Pour aller plus loin" title="Continuez votre" titleAccent="exploration" columns={3}>
              <LinkCard
                title="Emploi Salarié"
                href="/vivre-aux-philippines/travailler/emploi-salarie"
                icon={<Briefcase className="h-5 w-5" />}
              />
              <LinkCard
                title="Immobilier"
                href="/vivre-aux-philippines/investir/immobilier"
                icon={<Building className="h-5 w-5" />}
              />
              <LinkCard
                title="Visas et Permis"
                href="/vivre-aux-philippines/visas-et-formalites"
                icon={<FileText className="h-5 w-5" />}
              />
            </CardGrid>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreerEntreprisePage;
