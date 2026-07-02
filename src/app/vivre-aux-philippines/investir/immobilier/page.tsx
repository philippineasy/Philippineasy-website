import { Metadata } from 'next';
import { Home, Building, DollarSign, Landmark, Info, AlertTriangle, CheckCircle, ExternalLink, ChevronRight, MapPin, TrendingUp, Calculator, FileText, Shield, Scale, Building2, Key, Search, Wallet } from 'lucide-react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faUsers, faCalculator, faClock } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, CardGrid, LinkCard } from '@/components/sections';

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

      <div className="container mx-auto px-4 py-12 max-w-6xl">

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

        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-muted-foreground text-center leading-relaxed">
            Avec une économie en croissance, une classe moyenne en expansion et des rendements locatifs attractifs,
            les Philippines attirent de nombreux investisseurs étrangers. Cependant, la législation impose des
            restrictions importantes qu'il est essentiel de comprendre avant d'investir.
          </p>
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
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Ce que Vous Pouvez Acheter</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Les options légales pour les investisseurs étrangers aux Philippines.
          </p>

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

        {/* Prix par zone */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Prix de l'Immobilier à Metro Manila</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Prix indicatifs par mètre carré dans les principales zones (2026).
          </p>

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
                    <span className="font-semibold text-foreground">€5,600 - 8,800/m²</span>
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
                    <span className="font-semibold text-foreground">€4,500 - 8,000/m²</span>
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
                    <span className="font-semibold text-foreground">€4,000 - 7,200/m²</span>
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
                    <span className="font-semibold text-foreground">€2,400 - 4,500/m²</span>
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
                    <span className="font-semibold text-foreground">€1,900 - 3,200/m²</span>
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
                    <span className="font-semibold text-foreground">€1,600 - 2,900/m²</span>
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
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Exemples de Prix (BGC/Makati)</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-6 text-center border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-2">Studio (25-35 m²)</p>
              <p className="text-3xl font-bold text-foreground mb-1">₱6-12M</p>
              <p className="text-sm text-muted-foreground">€96,000 - €192,000</p>
            </div>

            <div className="bg-card rounded-2xl p-6 text-center border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-2">1 chambre (40-55 m²)</p>
              <p className="text-3xl font-bold text-foreground mb-1">₱12-22M</p>
              <p className="text-sm text-muted-foreground">€192,000 - €352,000</p>
            </div>

            <div className="bg-card rounded-2xl p-6 text-center border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-2">2-3 chambres (80-120 m²)</p>
              <p className="text-3xl font-bold text-foreground mb-1">₱20-45M</p>
              <p className="text-sm text-muted-foreground">€320,000 - €720,000</p>
            </div>
          </div>
        </section>

        {/* Hors Manila */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Hors Metro Manila</h2>
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
                <p className="text-xs text-muted-foreground">€1,280 - €2,880/m²</p>
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
                <p className="text-xs text-muted-foreground">€960 - €2,080/m²</p>
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
                <p className="text-xs text-muted-foreground">€800 - €1,600/m²</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fiscalité */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Fiscalité Immobilière</h2>

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
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6 text-foreground">Rendements Locatifs Indicatifs (2026)</h3>
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
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Processus d'Achat</h2>

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
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Documents Requis</h2>
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
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Conseils Pratiques</h2>
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
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Ressources Utiles</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
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
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t border-border pt-12">
          <h3 className="text-xl font-semibold text-center mb-6 text-foreground">Continuer votre exploration</h3>
          <CardGrid columns={3}>
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
