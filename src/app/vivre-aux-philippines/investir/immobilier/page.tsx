import { Metadata } from 'next';
import { Home, Building, DollarSign, Landmark, Info, AlertTriangle, CheckCircle, ExternalLink, ChevronRight, MapPin, TrendingUp, Calculator, FileText, Shield, Scale, Building2, Key, Search, Wallet } from 'lucide-react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faUsers, faCalculator, faClock } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, FaqAccordion } from '@/components/sections';

export const metadata: Metadata = {
  title: "Investissement Locatif aux Philippines en 2026 : Rendement et Fiscalité",
  description: "Guide de l'investissement locatif aux Philippines : rendement par zone, fiscalité des loyers, règle des 40% pour les étrangers et stratégie d'achat en 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/investir/immobilier',
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
    title: "Investissement Locatif aux Philippines en 2026 : Rendement et Fiscalité",
    description: "Guide de l'investissement locatif aux Philippines : rendement par zone, fiscalité des loyers, règle des 40% pour les étrangers et stratégie d'achat en 2026.",
    url: 'https://philippineasy.com/vivre-aux-philippines/investir/immobilier',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Investissement Locatif aux Philippines en 2026",
    description: "Guide de l'investissement locatif aux Philippines : rendement, fiscalité, stratégie d'achat.",
    site: '@philippineasy',
  },
};

/* -------------------------------------------------------------------------- */
/* En-tête de section maison : eyebrow uppercase + h2 à un mot accentué.       */
/* Variante centrée : la page garde sa mise en page symétrique existante.      */
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
  <div className="mx-auto mb-10 max-w-2xl text-center">
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

// FAQ 100 % factuelle — reformulée à partir du contenu de la page ci-dessous
// (règle des 40%, restriction terrain, rendements, fiscalité, frais d'acquisition).
const IMMOBILIER_FAQS = [
  {
    q: "Un étranger peut-il posséder un terrain aux Philippines ?",
    a: "Non : c'est une restriction constitutionnelle (Article XII, Section 7), réservée aux citoyens philippins ou aux sociétés détenues à 60 % minimum par des Philippins. Vous pouvez en revanche être propriétaire à 100 % d'un condominium (Republic Act 4726), tant que la part étrangère de l'immeuble ne dépasse pas 40 % des unités.",
  },
  {
    q: "Qu'est-ce que le quota de 40 % pour les condominiums ?",
    a: "C'est la part maximale d'unités qu'un immeuble peut vendre à des étrangers, propriétaire de sa condominium corporation. Ce quota s'applique par projet, pas au niveau national : un immeuble populaire auprès des étrangers peut donc l'atteindre rapidement, d'où l'intérêt de vérifier sa disponibilité avant de verser un acompte.",
  },
  {
    q: "Quel rendement locatif espérer selon la zone ?",
    a: "Le rendement brut varie du simple au double : autour de 4-6 % à BGC ou Makati Prime, très demandés mais chers au m², contre 6-8 % à Quezon City ou 5-7 % à Cebu IT Park, où les loyers sont plus accessibles pour une demande locale en croissance.",
  },
  {
    q: "Comment sont imposés les loyers pour un non-résident ?",
    a: "Les non-résidents sont taxés à 25 % sur leurs revenus locatifs bruts, contre un barème progressif pouvant aller jusqu'à 35 % pour les résidents. Une TVA de 12 % s'applique en plus si le revenu locatif annuel dépasse ₱3 000 000. Le Capital Gains Tax (6 %), lui, reste à la charge du vendeur, pas de l'acheteur.",
  },
  {
    q: "Quels frais d'acquisition prévoir en plus du prix d'achat ?",
    a: "Comptez environ 4 à 5 % du prix : Documentary Stamp Tax (1,5 %), Transfer Tax à Metro Manila (0,75 %), frais d'enregistrement au Registry of Deeds (~0,5 %) et notaire (1-2 %). À cela s'ajoutent chaque année la taxe foncière (1-2 % de la valeur fiscale) et les charges de copropriété.",
  },
];

const ImmobilierPage = () => {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Guide pratique"
        title="Investir dans"
        titleAccent="l'Immobilier"
        subtitle="Rendement locatif, fiscalité des loyers et stratégie d'achat : le guide pour investir dans l'immobilier locatif aux Philippines, distinct de l'achat d'une résidence principale."
        imageUrl="/images/investir/vue-condominium-philippines.webp"
        imageAlt="Investir dans l'Immobilier"
      />

      <div className="container mx-auto px-4 pt-12 max-w-6xl">

        {/* Stats */}
        <section className="mb-16">
          <div className="mx-auto max-w-4xl">
            <StatRow
              className="justify-center gap-x-14"
              stats={[
                { icon: <FontAwesomeIcon icon={faArrowTrendUp} className="text-[18px]" />, value: '5-8%', label: 'Rendement brut' },
                { icon: <FontAwesomeIcon icon={faUsers} className="text-[18px]" />, value: '40%', label: 'Quota étrangers' },
                { icon: <FontAwesomeIcon icon={faCalculator} className="text-[18px]" />, value: '4-5%', label: "Frais d'acquisition" },
                { icon: <FontAwesomeIcon icon={faClock} className="text-[18px]" />, value: '25', label: 'Ans bail terrain' },
              ]}
            />
          </div>
        </section>

        {/* Introduction éditoriale */}
        <section className="max-w-3xl mx-auto mb-12">
          <SectionHeader eyebrow="Panorama du marché locatif" title="Investir dans la" accent="pierre philippine" />
          <div className="space-y-4 text-lg text-muted-foreground text-center leading-relaxed">
            <p>
              Avec une économie en croissance, une classe moyenne en expansion et des rendements locatifs
              attractifs, les Philippines attirent de nombreux investisseurs étrangers en quête d'un
              complément de revenu ou d'un placement diversifié hors zone euro.
            </p>
            <p>
              La législation impose cependant des restrictions importantes, à commencer par l'interdiction
              constitutionnelle de posséder un terrain. Ce guide fait le tri entre ce qui est réellement
              accessible, ce qui rapporte, et les pièges à éviter avant de signer.
            </p>
          </div>
        </section>

        {/* Callout - redirection résidence principale */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Vous cherchez avant tout à acheter votre résidence principale aux Philippines, sans objectif de rendement locatif ?
            </p>
            <Link
              href="/vivre-aux-philippines/logement/acheter-immobilier-philippines"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline whitespace-nowrap"
            >
              Voir le guide d'achat pour y vivre
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Règle d'or */}
        <section className="mb-16">
          <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/15 rounded-full flex-shrink-0">
                <AlertTriangle className="h-7 w-7 text-accent-strong" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-foreground">La Règle Fondamentale</h3>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Les étrangers ne peuvent pas posséder de terrain aux Philippines.</strong> C'est une restriction
                  constitutionnelle (Article XII, Section 7). Seuls les citoyens philippins ou les sociétés détenues à
                  60% minimum par des Philippins peuvent être propriétaires fonciers.
                </p>
                <div className="bg-card rounded-xl p-4 border border-accent/20">
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Vous pouvez être propriétaire à 100% d'un condominium (Republic Act 4726)
                  </p>
                  <p className="text-sm text-muted-foreground ml-7 mt-1">
                    Tant que la part étrangère dans l'immeuble ne dépasse pas 40% du total des unités.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ce que vous pouvez acheter */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Cadre légal"
            title="Ce que vous pouvez"
            accent="acheter"
            description="La règle est stricte, mais elle laisse trois portes ouvertes. Le condominium reste l'option la plus simple : propriété à 100 % en nom propre, tant que le quota de 40 % d'unités étrangères par immeuble n'est pas atteint. Les deux autres voies — maison sur bail de terrain, ou société locale détenue à 60 % par des Philippins — restent accessibles, mais nettement plus complexes à sécuriser."
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Condominium */}
            <div className="bg-primary/5 rounded-2xl p-6 border-2 border-primary/30 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">Recommandé</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Building className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Condominium</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                L'option la plus simple et la plus sûre. Propriété en nom propre, titre CCT.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Propriété 100% en votre nom</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Quota 40% par projet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Transmissible par héritage</span>
                </div>
              </div>
            </div>

            {/* Maison */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Home className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Maison (bâtiment)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Vous pouvez posséder le bâtiment mais pas le terrain sur lequel il est construit.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Bail terrain (25-75 ans max)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Plus complexe juridiquement</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Financement difficile</span>
                </div>
              </div>
            </div>

            {/* Corporation */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Landmark className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Via Corporation</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Créer une société philippine pour acquérir un terrain (maison + terrain).
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Accès propriété foncière</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">60% min parts philippines</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-accent-strong" />
                  <span className="text-foreground">Coûts structure élevés</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info quota 40% */}
        <section className="mb-16">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full flex-shrink-0">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-foreground">Attention au Quota des 40%</h3>
                <p className="text-muted-foreground mb-3">
                  Le quota de 40% s'applique <strong className="text-foreground">par projet</strong>, pas au niveau national. Un immeuble populaire
                  auprès des étrangers peut rapidement atteindre sa limite.
                </p>
                <p className="text-sm text-muted-foreground">
                  Vérifiez toujours la disponibilité auprès du développeur ou de la Condominium Corporation avant de verser un acompte.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Repère éditorial — la localisation prime sur le prix affiché */}
      <SplitSection
        eyebrow="Le paramètre qui change tout"
        title="La localisation,"
        titleAccent="avant le prix"
        imageUrl="/images/famille/famille-condominium-philippines.webp"
        imageAlt="Résidence avec piscine et jardin tropical, exemple de condominium locatif aux Philippines"
      >
        <p>
          Un même budget ne produit pas le même rendement selon le quartier. À BGC ou Makati, le ticket
          d'entrée au mètre carré est le plus élevé de la capitale, porté par une demande d'expatriés et
          de cadres d'entreprise — mais le rendement brut plafonne autour de 4 à 6 %.
        </p>
        <p>
          À l'inverse, Quezon City ou Cebu IT Park affichent des rendements plus généreux, 6 à 8 %, portés
          par des loyers plus accessibles et une demande locale en croissance constante.
        </p>
        <p className="!mt-5">
          Avant d'acheter, le bon réflexe consiste donc à comparer le prix au mètre carré, zone par zone,
          au rendement locatif réel qu'elle affiche.
        </p>
      </SplitSection>

      <div className="container mx-auto px-4 pb-12 max-w-6xl">

        {/* Prix par zone */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Grille tarifaire 2026"
            title="Prix par"
            accent="quartier"
            description="Six zones, six profils d'investissement. Rockwell et BGC concentrent la clientèle d'expatriés et de cadres, avec les tickets d'entrée les plus élevés de la capitale ; Quezon City et Mandaluyong restent nettement plus accessibles, avec une marge de progression que le marché n'a pas encore totalement absorbée."
          />

          <div className="max-w-5xl mx-auto space-y-4">
            {/* Ultra-luxe */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Rockwell (Makati)</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Ultra-luxe, plus cher de Manila</span>
                    <span className="font-semibold text-foreground">5 600 – 8 800 €/m²</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BGC */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">BGC (Taguig)</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">CBD moderne, expats, entreprises</span>
                    <span className="font-semibold text-foreground">4 500 – 8 000 €/m²</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Makati CBD */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Makati CBD</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Centre d'affaires historique</span>
                    <span className="font-semibold text-foreground">4 000 – 7 200 €/m²</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ortigas */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Ortigas</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Second CBD, BPO, bureaux</span>
                    <span className="font-semibold text-foreground">2 400 – 4 500 €/m²</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '50%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* QC */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Quezon City</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Plus grande ville, universités</span>
                    <span className="font-semibold text-foreground">1 900 – 3 200 €/m²</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '35%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mandaluyong */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Mandaluyong</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Connecté, bon rapport qualité/prix</span>
                    <span className="font-semibold text-foreground">1 600 – 2 900 €/m²</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exemples de prix */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Budget type"
            title="Exemples de prix"
            accent="BGC / Makati"
            description="De quoi budgétiser un premier achat. Un studio de 25 à 35 m² se négocie sur la fourchette basse du marché, quand un deux ou trois chambres de 80 à 120 m² correspond plutôt à un profil familial."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-6 text-center border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-2">Studio (25-35 m²)</p>
              <p className="text-3xl font-bold text-foreground mb-1">₱6-12M</p>
              <p className="text-sm text-muted-foreground">96 000 – 192 000 €</p>
            </div>

            <div className="bg-card rounded-2xl p-6 text-center border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-2">1 chambre (40-55 m²)</p>
              <p className="text-3xl font-bold text-foreground mb-1">₱12-22M</p>
              <p className="text-sm text-muted-foreground">192 000 – 352 000 €</p>
            </div>

            <div className="bg-card rounded-2xl p-6 text-center border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-2">2-3 chambres (80-120 m²)</p>
              <p className="text-3xl font-bold text-foreground mb-1">₱20-45M</p>
              <p className="text-sm text-muted-foreground">320 000 – 720 000 €</p>
            </div>
          </div>
        </section>

        {/* Hors Manila */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Alternatives régionales"
            title="Au-delà de"
            accent="Manille"
            description="Cebu, Davao et Iloilo affichent des prix au mètre carré très inférieurs à ceux de la capitale, portés par une économie régionale en plein essor — IT Park, BPO, développement urbain. De quoi diversifier un portefeuille locatif sans les tickets d'entrée de Manille."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Cebu City</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Deuxième métropole, IT Park et Business Park en croissance.
              </p>
              <div className="bg-muted rounded-lg p-3">
                <p className="font-bold text-foreground">₱80,000 - 180,000/m²</p>
                <p className="text-xs text-muted-foreground">1 280 – 2 880 €/m²</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Davao</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Capitale de Mindanao, en développement rapide.
              </p>
              <div className="bg-muted rounded-lg p-3">
                <p className="font-bold text-foreground">₱60,000 - 130,000/m²</p>
                <p className="text-xs text-muted-foreground">960 – 2 080 €/m²</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Iloilo</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ville émergente des Visayas, BPO en expansion.
              </p>
              <div className="bg-muted rounded-lg p-3">
                <p className="font-bold text-foreground">₱50,000 - 100,000/m²</p>
                <p className="text-xs text-muted-foreground">800 – 1 600 €/m²</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fiscalité */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Les coûts à anticiper"
            title="Fiscalité"
            accent="immobilière"
            description="Au prix d'achat s'ajoutent des frais d'acquisition incontournables — DST, Transfer Tax, enregistrement, notaire — puis une fiscalité annuelle à intégrer dans le calcul de rendement, entre taxe foncière et charges de copropriété. Le Capital Gains Tax, lui, reste à la charge du vendeur."
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Frais d'acquisition */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Frais d'Acquisition
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">Documentary Stamp Tax (DST)</span>
                  <span className="font-semibold text-primary">1.5%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <span className="text-sm text-foreground">Transfer Tax (Metro Manila)</span>
                  <span className="font-semibold text-primary">0.75%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">Frais d'enregistrement (ROD)</span>
                  <span className="font-semibold text-primary">~0.5%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <span className="text-sm text-foreground">Notaire</span>
                  <span className="font-semibold text-primary">1-2%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-xl border border-primary/20 mt-4">
                  <span className="font-semibold text-foreground">Total acquéreur</span>
                  <span className="font-bold text-xl text-primary">4-5%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Le Capital Gains Tax (6%) est normalement payé par le vendeur.
                </p>
              </div>
            </div>

            {/* Taxes annuelles */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Taxes Annuelles
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">Real Property Tax (Manila)</span>
                  <span className="font-semibold text-primary">2% val. fiscale</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <span className="text-sm text-foreground">Real Property Tax (Provinces)</span>
                  <span className="font-semibold text-primary">1% val. fiscale</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">Charges copropriété</span>
                  <span className="font-semibold text-primary">₱50-150/m²/mois</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <span className="text-sm text-foreground">Assurance (optionnelle)</span>
                  <span className="font-semibold text-primary">0.2-0.5%/an</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  La valeur fiscale est généralement 20-40% de la valeur de marché.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rendements locatifs */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Combien ça rapporte"
            title="Rendements locatifs indicatifs"
            accent="2026"
            description="Le rendement brut varie du simple au double selon la zone, et vient nourrir le calcul net une fois la fiscalité des loyers déduite. Les non-résidents sont taxés à 25 % sur leurs revenus locatifs bruts — une donnée à intégrer avant de comparer un bien à un placement en France."
          />
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Rendements bruts par zone
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-card rounded-xl">
                    <span className="text-foreground">BGC/Makati Prime</span>
                    <span className="font-bold text-primary">4-6%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card rounded-xl">
                    <span className="text-foreground">Ortigas/Mandaluyong</span>
                    <span className="font-bold text-primary">5-7%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card rounded-xl">
                    <span className="text-foreground">Quezon City</span>
                    <span className="font-bold text-primary">6-8%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card rounded-xl">
                    <span className="text-foreground">Cebu IT Park</span>
                    <span className="font-bold text-primary">5-7%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Imposition des loyers
                </h4>
                <div className="bg-card rounded-xl p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Les revenus locatifs sont imposés au taux progressif (jusqu'à 35%) pour les résidents.
                    Les non-résidents paient généralement <strong className="text-foreground">25%</strong> sur les revenus bruts.
                  </p>
                  <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                    <p className="text-sm text-accent-strong">
                      <strong>TVA 12%</strong> applicable si le revenu locatif annuel dépasse ₱3,000,000.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Processus d'achat Timeline */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Étape par étape"
            title="Le processus"
            accent="d'achat"
            description="Cinq étapes séparent la première visite de la remise des clés, de la vérification du titre CCT jusqu'à l'enregistrement au Registry of Deeds. Un acompte de réservation s'engage dès le deuxième rendez-vous, suivi d'un échéancier classique pour un achat sur plan."
          />

          <div className="max-w-4xl mx-auto">
            <div className="space-y-0">
              {/* Step 1 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Vérification et Due Diligence
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Confirmez que le quota 40% n'est pas atteint. Vérifiez le titre (CCT), les charges impayées,
                      et l'historique du développeur. Engagez un avocat spécialisé.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Réservation et Contrat
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Versez un acompte de réservation (₱20,000-100,000). Signez le Contract to Sell
                      qui détaille le prix, l'échéancier et les conditions de transfert.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      Paiement
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Neuf : 10-30% d'acompte + paiements échelonnés, solde à la livraison.
                      Revente : paiement comptant ou négociation directe. Financement bancaire difficile pour les étrangers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                    4
                  </div>
                  <div className="w-0.5 h-full bg-border my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      Deed of Absolute Sale
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Signature de l'acte de vente notarié, paiement des taxes (DST, Transfer Tax, CGT),
                      puis enregistrement auprès du Registry of Deeds pour obtenir le CCT à votre nom.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                    5
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      Obtention du TIN et Remise des Clés
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Vous aurez besoin d'un Tax Identification Number (TIN) philippin pour les taxes
                      et l'enregistrement. Votre avocat peut vous aider à l'obtenir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documents requis */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="À préparer en amont"
            title="Documents"
            accent="requis"
            description="Réunissez ces pièces avant de vous engager : elles reviennent à chaque étape, de la due diligence à l'enregistrement du titre. Votre avocat ou votre broker peut vous aider à les rassembler à distance, via une procuration notariée."
          />
          <div className="bg-primary/5 rounded-2xl p-6 max-w-3xl mx-auto border border-primary/20">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Passeport valide</span>
                  <span className="text-sm text-muted-foreground ml-2">- copie certifiée</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Tax Identification Number (TIN)</span>
                  <span className="text-sm text-muted-foreground ml-2">- obligatoire pour les taxes</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Preuve de fonds</span>
                  <span className="text-sm text-muted-foreground ml-2">- relevés bancaires</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">ACR I-Card</span>
                  <span className="text-sm text-muted-foreground ml-2">- si résident longue durée (optionnel)</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Procuration notariée</span>
                  <span className="text-sm text-muted-foreground ml-2">- si achat à distance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conseils */}
        <section className="mb-16">
          <SectionHeader
            eyebrow="Pour sécuriser l'opération"
            title="Conseils"
            accent="pratiques"
            description="Un achat immobilier aux Philippines se sécurise avec les bons intermédiaires : avocat spécialisé, broker licencié PRC, et une vigilance constante sur les montages illégaux. Le timing compte aussi — développeurs et marché secondaire n'offrent pas les mêmes marges de négociation."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Engagez un Avocat</h3>
              <p className="text-sm text-muted-foreground">
                Un avocat spécialisé vérifiera le titre, les encumbrances, la conformité au quota 40%,
                et vous représentera pour le transfert. Comptez ₱30,000-100,000.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Broker PRC-Licensed</h3>
              <p className="text-sm text-muted-foreground">
                La loi RESA (RA 9646) impose de passer par un broker licencié.
                Vérifiez la licence sur le site de la PRC. Commission : 3-5%.
              </p>
            </div>

            <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
              <div className="p-3 bg-accent/15 rounded-xl w-fit mb-4">
                <AlertTriangle className="h-6 w-6 text-accent-strong" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Évitez les Montages Illégaux</h3>
              <p className="text-sm text-muted-foreground">
                Les "dummy corporations" sont illégales et peuvent entraîner la perte du bien.
                Respectez toujours la règle des 60/40.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Timing et Négociation</h3>
              <p className="text-sm text-muted-foreground">
                Les développeurs offrent souvent des rabais pour paiement comptant (5-10%).
                Le marché secondaire permet plus de négociation.
              </p>
            </div>
          </div>
        </section>

        {/* Callout - panorama général investissement */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Pour une vue d'ensemble de l'investissement aux Philippines (immobilier, bourse, création d'entreprise), consultez notre guide général.
            </p>
            <Link
              href="/vivre-aux-philippines/travail-entreprise/investir-aux-philippines-guide-francais-2025"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline whitespace-nowrap"
            >
              Lire le guide complet
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Ressources */}
        <section className="mb-16">
          <CardGrid eyebrow="À consulter" title="Ressources" titleAccent="utiles" columns={3}>
            <a
              href="https://www.prc.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all"
            >
              <span className="font-medium text-foreground">PRC (Vérifier licences)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.lamudi.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all"
            >
              <span className="font-medium text-foreground">Lamudi (Annonces)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.dotproperty.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all"
            >
              <span className="font-medium text-foreground">DotProperty</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.carousell.ph/property-for-sale/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all"
            >
              <span className="font-medium text-foreground">Carousell Property</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.colliers.com/en-ph"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all"
            >
              <span className="font-medium text-foreground">Colliers Philippines</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://www.bir.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all"
            >
              <span className="font-medium text-foreground">BIR (Taxes)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
          </CardGrid>
        </section>

        {/* FAQ — questions fréquentes, dérivées du contenu de la page ci-dessus */}
        <section className="mb-16">
          <FaqAccordion
            eyebrow="Questions fréquentes"
            title="Investir dans la pierre,"
            titleAccent="en clair"
            faqs={IMMOBILIER_FAQS}
            withSchema
          />
        </section>

        {/* Navigation */}
        <section className="border-t border-border pt-12">
          <CardGrid eyebrow="Pour aller plus loin" title="Continuez votre" titleAccent="exploration" columns={3}>
            <LinkCard
              title="Bourse et Entreprises"
              href="/vivre-aux-philippines/investir/bourse-et-entreprises"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <LinkCard
              title="Créer une Entreprise"
              href="/vivre-aux-philippines/travailler/creer-entreprise"
              icon={<Building className="h-5 w-5" />}
            />
            <LinkCard
              title="Visas et Permis"
              href="/vivre-aux-philippines/visas-et-formalites"
              icon={<FileText className="h-5 w-5" />}
            />
          </CardGrid>
        </section>
      </div>
    </div>
  );
};

export default ImmobilierPage;
