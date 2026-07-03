import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Briefcase, Search, Building, Users, AlertTriangle, CheckCircle, ExternalLink, TrendingUp, Globe, FileText, Clock, ChevronRight, GraduationCap, Heart, Factory, Award, Target, Zap, MapPin, Calendar, CreditCard, Plane, Home, Shield, Star } from 'lucide-react';
import { PageHero, StatRow, CardGrid, LinkCard, SplitSection, FaqAccordion } from '@/components/sections';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Trouver un Emploi Salarié aux Philippines en 2025",
  description: "Guide complet pour trouver un emploi aux Philippines en tant qu'expatrié : secteurs qui recrutent, plateformes d'emploi (JobStreet, LinkedIn), salaires, visa de travail 9G et permis AEP.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/travailler/emploi-salarie',
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
    title: "Trouver un Emploi Salarié aux Philippines en 2025",
    description: "Secteurs porteurs, plateformes de recherche d'emploi, salaires et démarches administratives pour travailler aux Philippines.",
    url: 'https://philippineasy.com/vivre-aux-philippines/travailler/emploi-salarie',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Emploi aux Philippines 2025 : Guide Expatrié",
    description: "Comment trouver un emploi salarié aux Philippines : secteurs, salaires et démarches.",
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

// Liste "cochée" (bonnes pratiques). Div-based pour ne pas hériter des puces
// disc du rich-text de SplitSection.
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

// Encadré d'avertissement honnête (bord accent), pour les points de vigilance
// culturelle. Même pattern que le CautionBox de la page visas.
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

// FAQ 100 % factuelle — reformulée à partir du contenu de la page ci-dessous
// (AEP + visa 9G, secteurs, salaires, avantages, PWP).
const EMPLOI_SALARIE_FAQS = [
  {
    q: "Quels documents sont nécessaires pour travailler légalement aux Philippines ?",
    a: "Un Alien Employment Permit (AEP) délivré par le DOLE, suivi d'un visa de travail 9(G) du Bureau of Immigration. Ces démarches sont généralement initiées par l'employeur, et le processus complet prend en moyenne 2 à 4 mois.",
  },
  {
    q: "Quels secteurs recrutent le plus d'expatriés ?",
    a: "Six familles de métiers concentrent l'essentiel des embauches : BPO/Call Centers (le pays compte environ 1,5 million d'emplois dans ce secteur), IT & Tech, Enseignement (professeurs de FLE ou d'anglais, écoles internationales), Finance & Consulting, Hôtellerie & Tourisme, et Industrie/Manufacturing dans les zones PEZA.",
  },
  {
    q: "À quel salaire un expatrié peut-il s'attendre ?",
    a: "Cela dépend surtout de l'ancienneté : 40 000-70 000 ₱/mois (≈650-1 150 €) en junior, 70 000-150 000 ₱ (≈1 150-2 450 €) en profil intermédiaire, 150 000-300 000 ₱ (≈2 450-4 900 €) en senior, et 300 000-600 000+ ₱ (≈4 900-10 000 €+) pour un poste de direction.",
  },
  {
    q: "Quels avantages sont généralement inclus dans un contrat ?",
    a: "Le 13ème mois est obligatoire par la loi, auquel s'ajoutent souvent une assurance santé HMO, 5 à 15 jours de congés payés selon l'ancienneté et une prime de performance. Les packages seniors pour expatriés peuvent aussi couvrir le logement, des billets d'avion annuels, la prise en charge du visa/AEP et parfois la scolarité des enfants.",
  },
  {
    q: "Existe-t-il un moyen de commencer à travailler plus rapidement ?",
    a: "Oui, le Provisional Work Permit (PWP) permet de démarrer avant l'obtention du visa 9(G) définitif. Il est valable 3 mois, renouvelable une fois, le temps que les démarches AEP et visa suivent leur cours normal.",
  },
];

const EmploiSalariePage = () => {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Guide pratique"
        title="Trouver un"
        titleAccent="Emploi Salarié"
        subtitle="Le marché du travail philippin pour les expatriés : opportunités, démarches et conseils pour décrocher un poste."
        imageUrl="/imagesHero/travailleur-etranger-aux-philippines.webp"
        imageAlt="Trouver un Emploi Salarié"
      />

      {/* Introduction + prérequis légal */}
      <section className="bg-background pt-12 pb-16 md:pt-14 md:pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader eyebrow="Marché du travail" title="Où votre profil" accent="trouve sa place" />

          <div className="mx-auto max-w-3xl space-y-4 text-center text-lg leading-relaxed text-muted-foreground">
            <p>
              Les Philippines offrent de réelles opportunités professionnelles aux étrangers qualifiés,
              notamment dans les secteurs en forte croissance. L&apos;anglais étant la langue des affaires,
              les francophones bilingues y trouvent souvent leur place.
            </p>
            <p>
              Encore faut-il savoir où chercher. Ce guide réunit les secteurs qui recrutent, les
              plateformes qui fonctionnent vraiment, les fourchettes de salaires observées sur le terrain
              et les démarches administratives à anticiper avant de signer un contrat.
            </p>
          </div>

          <div className="mt-12 border-y border-border py-10">
            <StatRow
              stats={[
                { value: '6', label: 'Secteurs porteurs' },
                { value: '1.5M', label: 'Emplois BPO' },
                { value: '2-4', label: 'Mois visa 9G' },
                { value: '13', label: 'Mois de salaire' },
              ]}
              className="mx-auto max-w-4xl justify-center"
            />
          </div>

          <div className="mt-12 max-w-4xl mx-auto rounded-2xl border border-accent/30 bg-accent/10 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/15 rounded-full">
                <AlertTriangle className="h-6 w-6 text-accent-strong" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-foreground">Prérequis légal : AEP + Visa 9G</h3>
                <p className="text-foreground/80 mb-4">
                  Pour travailler légalement aux Philippines, vous devez obtenir un <strong>Alien Employment Permit (AEP)</strong>
                  délivré par le DOLE, suivi d&apos;un <strong>visa de travail 9(G)</strong> du Bureau of Immigration.
                  Ces démarches sont généralement initiées par votre employeur.
                </p>
                <Link
                  href="/vivre-aux-philippines/visas-et-formalites"
                  className="inline-flex items-center gap-2 text-accent-strong hover:text-accent-strong/80 font-semibold transition-colors"
                >
                  Voir notre guide complet sur les visas
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secteurs qui recrutent */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <CardGrid
            eyebrow="Où sont les postes"
            title="Secteurs qui recrutent des"
            titleAccent="expatriés"
            subtitle="Le pays compte à lui seul environ 1,5 million d'emplois dans le BPO, mais l'appétit pour les profils internationaux dépasse largement les centres d'appels. Six familles de métiers concentrent l'essentiel des embauches d'expatriés, avec des besoins et des salaires très différents d'un secteur à l'autre. Certains secteurs sont particulièrement ouverts aux talents étrangers, que ce soit pour leur expertise technique ou leurs compétences linguistiques."
            columns={3}
          >
            {/* BPO */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow duration-200 hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Building className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">BPO / Call Centers</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Les Philippines sont le leader mondial du BPO. Les postes de management
                et de formation sont accessibles aux expatriés.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Service client</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Support tech</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Finance</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">RH</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-sm font-semibold text-foreground">
                  💰 80k - 200k PHP/mois (managers)
                </span>
              </div>
            </div>

            {/* IT & Tech */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow duration-200 hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Globe className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">IT & Tech</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Fort développement du secteur tech avec une demande croissante
                pour les profils seniors et spécialisés.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Dev logiciel</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Cyber</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Data/IA</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Cloud</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-sm font-semibold text-foreground">
                  💰 100k - 300k+ PHP/mois (seniors)
                </span>
              </div>
            </div>

            {/* Enseignement */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow duration-200 hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Enseignement</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Forte demande pour les professeurs natifs de langues étrangères
                et les enseignants dans les écoles internationales.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Français FLE</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Anglais</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Écoles int.</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-sm font-semibold text-foreground">
                  💰 50k - 150k PHP/mois
                </span>
              </div>
            </div>

            {/* Finance & Consulting */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow duration-200 hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <TrendingUp className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Finance & Consulting</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Les multinationales recherchent des profils expérimentés
                pour leurs opérations régionales.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Audit</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Conseil</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Analyse fin.</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Risk</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-sm font-semibold text-foreground">
                  💰 150k - 400k+ PHP/mois (seniors)
                </span>
              </div>
            </div>

            {/* Hôtellerie & Tourisme */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow duration-200 hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Heart className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Hôtellerie & Tourisme</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Secteur en plein essor avec de nombreux resorts
                et hôtels de luxe recherchant des managers internationaux.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Direction</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">F&B</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Chef</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Events</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-sm font-semibold text-foreground">
                  💰 70k - 200k PHP/mois (managers)
                </span>
              </div>
            </div>

            {/* Industrie */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest transition-shadow duration-200 hover:shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Factory className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Industrie & Manufacturing</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Les zones économiques spéciales (PEZA) attirent
                de nombreuses entreprises manufacturières.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Production</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Qualité</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Supply</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Direction</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-sm font-semibold text-foreground">
                  💰 100k - 300k PHP/mois
                </span>
              </div>
            </div>
          </CardGrid>
        </div>
      </section>

      {/* Où chercher */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <CardGrid
            eyebrow="Candidater efficacement"
            title="Où trouver des"
            titleAccent="offres d'emploi"
            subtitle="Quatre plateformes concentrent l'essentiel des offres accessibles aux étrangers, des généralistes comme LinkedIn et Indeed aux spécialistes locaux comme JobStreet et Kalibrr. Les canaux plus informels ne sont pas en reste : pages carrière des multinationales, cabinets de recrutement et groupes Facebook diffusent souvent des postes qui n'apparaissent nulle part ailleurs."
            columns={2}
          >
            {/* Plateformes en ligne */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Search className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Plateformes en ligne</h3>
              </div>

              <div className="space-y-4">
                <a href="https://www.jobstreet.com.ph" target="_blank" rel="noopener noreferrer"
                   className="group flex items-center gap-3 p-3 rounded-xl border-[0.5px] border-border bg-card shadow-card-rest hover:border-primary/30 hover:shadow-card transition-all">
                  <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground group-hover:text-primary">JobStreet Philippines</div>
                    <div className="text-xs text-muted-foreground">Leader local • Filtrer "expat-friendly"</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </a>

                <a href="https://www.linkedin.com/jobs" target="_blank" rel="noopener noreferrer"
                   className="group flex items-center gap-3 p-3 rounded-xl border-[0.5px] border-border bg-card shadow-card-rest hover:border-primary/30 hover:shadow-card transition-all">
                  <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground group-hover:text-primary">LinkedIn Jobs</div>
                    <div className="text-xs text-muted-foreground">Postes qualifiés • Networking</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </a>

                <a href="https://www.kalibrr.com" target="_blank" rel="noopener noreferrer"
                   className="group flex items-center gap-3 p-3 rounded-xl border-[0.5px] border-border bg-card shadow-card-rest hover:border-primary/30 hover:shadow-card transition-all">
                  <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Zap className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground group-hover:text-primary">Kalibrr</div>
                    <div className="text-xs text-muted-foreground">Startups & Tech</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </a>

                <a href="https://www.indeed.com.ph" target="_blank" rel="noopener noreferrer"
                   className="group flex items-center gap-3 p-3 rounded-xl border-[0.5px] border-border bg-card shadow-card-rest hover:border-primary/30 hover:shadow-card transition-all">
                  <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Globe className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground group-hover:text-primary">Indeed Philippines</div>
                    <div className="text-xs text-muted-foreground">Agrégateur • Large choix</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </a>
              </div>
            </div>

            {/* Autres canaux */}
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <Target className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Autres canaux efficaces</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border bg-muted/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Pages carrière multinationales</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accenture, Concentrix, Telus, JPMorgan, Google, Meta... postulez directement.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Cabinets de recrutement</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Michael Page, Robert Walters, Hays - actifs pour les profils seniors.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Groupes Facebook</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Jobs in Manila for Foreigners", "Expat Jobs Philippines" - offres exclusives.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/40">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Chambre de Commerce</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    La CCI Franco-Philippine facilite les mises en relation professionnelles.
                  </p>
                </div>
              </div>
            </div>
          </CardGrid>
        </div>
      </section>

      {/* Salaires */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            eyebrow="Combien attendre"
            title="Salaires et"
            accent="packages"
            description="Les fourchettes ci-dessous correspondent à des salaires bruts mensuels, hors avantages complémentaires. Elles varient sensiblement selon le secteur, la taille de l'entreprise et le niveau d'anglais ou d'expertise technique recherché."
          />

          <div className="max-w-5xl mx-auto space-y-8">
            {/* Tableau salaires */}
            <div className="bg-card rounded-2xl border border-border shadow-card-rest overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4">
                <h3 className="font-bold text-lg">Fourchettes salariales indicatives (2025)</h3>
                <p className="text-sm text-primary-foreground/80">Taux de change : 1 EUR ≈ 61 PHP</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Junior */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="sm:w-40">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Junior (0-3 ans)</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">40 000 - 70 000 PHP/mois</span>
                        <span className="text-sm font-medium text-foreground">~650 - 1 150€</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{width: '15%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Intermédiaire */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="sm:w-40">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Mid (3-7 ans)</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">70 000 - 150 000 PHP/mois</span>
                        <span className="text-sm font-medium text-foreground">~1 150 - 2 450€</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{width: '35%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Senior */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="sm:w-40">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Senior (7-15 ans)</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">150 000 - 300 000 PHP/mois</span>
                        <span className="text-sm font-medium text-foreground">~2 450 - 4 900€</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Direction */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="sm:w-40">
                      <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Direction</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">300 000 - 600 000+ PHP/mois</span>
                        <span className="text-sm font-medium text-foreground">~4 900 - 10 000€+</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Avantages */}
            <CardGrid columns={2}>
              <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
                <h4 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Avantages courants
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-foreground">13ème mois</div>
                      <div className="text-xs text-muted-foreground">Obligatoire par la loi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Shield className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-foreground">Assurance santé HMO</div>
                      <div className="text-xs text-muted-foreground">Couverture médicale complète</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Calendar className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-foreground">Congés payés</div>
                      <div className="text-xs text-muted-foreground">5-15 jours selon ancienneté</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Star className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-foreground">Prime de performance</div>
                      <div className="text-xs text-muted-foreground">Variable selon résultats</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
                <h4 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent-strong" />
                  Packages expatriés (seniors)
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center text-accent-strong">
                      <Home className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-foreground">Logement</div>
                      <div className="text-xs text-muted-foreground">Fourni ou allocation mensuelle</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center text-accent-strong">
                      <Plane className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-foreground">Billets d'avion annuels</div>
                      <div className="text-xs text-muted-foreground">Home leave pour la famille</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center text-accent-strong">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-foreground">Visa et AEP</div>
                      <div className="text-xs text-muted-foreground">Prise en charge totale</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center text-accent-strong">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-foreground">Scolarité enfants</div>
                      <div className="text-xs text-muted-foreground">Parfois inclus (écoles int.)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardGrid>
          </div>
        </div>
      </section>

      {/* Culture du travail (photo, casse la monotonie des cartes) */}
      <SplitSection
        eyebrow="S'intégrer au bureau"
        title="La culture du"
        titleAccent="travail philippin"
        imageUrl="/images/communication/dialogue-interculturel.webp"
        imageAlt="Collègues de différentes origines échangeant et riant ensemble"
      >
        <p>
          Le monde du travail philippin obéit à des codes bien à lui, hérités d&apos;une culture où
          la face et le respect priment sur la confrontation directe. Les comprendre vous évitera
          bien des maladresses avec vos collègues et accélérera votre intégration dans l&apos;entreprise.
        </p>
        <h4>Ce qui fonctionne</h4>
        <CheckList
          items={[
            'Le respect de la hiérarchie : les Philippins valorisent particulièrement le respect des aînés et des supérieurs',
            'Une communication indirecte : privilégiez la diplomatie et évitez la confrontation directe',
            'Des relations personnelles : prenez le temps de construire des liens avec vos collègues',
            'De la patience : les processus peuvent prendre plus de temps qu’en Europe',
          ]}
        />
        <CautionBox
          title="À éviter"
          items={[
            "Les critiques publiques : on n'embarrasse jamais quelqu'un devant les autres",
            'L’impatience visible : la colère fait perdre la face à tout le monde',
            'L’arrogance : évitez de vous positionner en "supérieur"',
            "Ignorer les fêtes d'entreprise : les événements internes comptent pour la cohésion d'équipe",
          ]}
        />
      </SplitSection>

      {/* Démarches Timeline */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            eyebrow="Une fois l'offre en poche"
            title="Démarches pour"
            accent="être embauché"
            description="Le processus complet prend généralement 2 à 4 mois. Votre employeur gère la plupart des démarches, mais mieux vaut connaître chaque étape pour anticiper les délais et ne rien laisser traîner."
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
                    <h4 className="font-bold text-foreground mb-2">Offre d'emploi</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Trouvez un employeur prêt à vous sponsoriser. L'entreprise doit avoir les moyens
                      et l'autorisation d'embaucher des étrangers.
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs text-primary font-medium">Variable (1-3 mois de recherche)</span>
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
                    <h4 className="font-bold text-foreground mb-2">Demande AEP (DOLE)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Votre employeur dépose la demande d'Alien Employment Permit auprès du Department of Labor
                      and Employment (DOLE).
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs text-primary font-medium">2-3 semaines</span>
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
                    <h4 className="font-bold text-foreground mb-2">Visa de travail 9(G)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Une fois l'AEP obtenu, demande du visa de travail 9(G) au Bureau of Immigration.
                      Validité : 1 à 3 ans, renouvelable.
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs text-primary font-medium">4-8 semaines</span>
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
                </div>
                <div className="flex-1">
                  <div className="bg-muted/40 rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2">ACR I-Card</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Obtention de votre carte de résident étranger, nécessaire pour ouvrir un compte bancaire
                      et autres démarches administratives.
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs text-primary font-medium">1-2 semaines</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PWP Info Box */}
            <div className="mt-8 bg-primary/5 border border-primary/25 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Option express : PWP (Provisional Work Permit)</h4>
                  <p className="text-sm text-muted-foreground">
                    Si vous devez commencer à travailler avant l'obtention du 9(G), un permis provisoire (PWP)
                    peut être obtenu plus rapidement. Validité : 3 mois, renouvelable une fois.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entreprises qui recrutent */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <CardGrid
            eyebrow="Qui recrute"
            title="Entreprises qui recrutent des"
            titleAccent="expatriés"
            subtitle="Multinationales du BPO, géants de la tech ou cabinets financiers : ces entreprises embauchent régulièrement des profils étrangers à Manille, à Cebu et dans les grandes villes du pays. Voici un aperçu, non exhaustif, des employeurs les plus actifs par secteur."
            columns={3}
          >
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-foreground">BPO / Services</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Accenture</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Concentrix</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Telus Int.</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">TaskUs</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Alorica</span>
              </div>
            </div>

            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-foreground">Tech / Digital</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Google</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Meta</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Grab</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Maya</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Canva PH</span>
              </div>
            </div>

            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-foreground">Finance / Conseil</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">JPMorgan</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">HSBC</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">McKinsey</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">Deloitte</span>
                <span className="px-3 py-1 bg-card text-foreground rounded-lg text-sm font-medium border border-border">EY / PwC</span>
              </div>
            </div>
          </CardGrid>
        </div>
      </section>

      {/* FAQ — questions fréquentes, dérivées du contenu de la page ci-dessus */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Trouver un emploi,"
            titleAccent="en clair"
            faqs={EMPLOI_SALARIE_FAQS}
            withSchema
          />
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="border-t border-border pt-14">
            <CardGrid eyebrow="Pour aller plus loin" title="Continuez votre" titleAccent="exploration" columns={2}>
              <LinkCard
                title="Créer son entreprise"
                href="/vivre-aux-philippines/travailler/creer-entreprise"
                desc="Entrepreneuriat aux Philippines"
                icon={<Briefcase className="h-5 w-5" />}
              />
              <LinkCard
                title="Guide des visas"
                href="/vivre-aux-philippines/visas-et-formalites"
                desc="Toutes les options légales"
                icon={<FileText className="h-5 w-5" />}
              />
            </CardGrid>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EmploiSalariePage;
