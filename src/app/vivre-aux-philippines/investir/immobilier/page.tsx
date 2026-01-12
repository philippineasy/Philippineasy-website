import { Metadata } from 'next';
import { Home, Building, DollarSign, Landmark, Info, Users, AlertTriangle, CheckCircle, ExternalLink, ChevronRight, MapPin, TrendingUp, Calculator, FileText, Shield, Scale, Building2, Percent, Clock, Banknote, Key, BadgeCheck, Search, Wallet } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Investir dans l'Immobilier aux Philippines en 2026 : Guide Complet | Philippineasy",
  description: "Guide complet pour acheter un bien immobilier aux Philippines en tant qu'étranger : condos, règle des 40%, prix par zone, fiscalité et démarches 2026.",
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
    title: "Investir dans l'Immobilier aux Philippines en 2026 : Guide Complet",
    description: "Guide complet pour acheter un bien immobilier aux Philippines en tant qu'étranger : condos, règle des 40%, prix par zone, fiscalité et démarches 2026.",
    url: 'https://philippineasy.com/vivre-aux-philippines/investir/immobilier',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Investir dans l'Immobilier aux Philippines en 2026",
    description: "Guide pour acheter un bien immobilier aux Philippines : condos, prix, fiscalité.",
    site: '@philippineasy',
  },
};

const ImmobilierPage = () => {
  return (
    <div className="bg-background">
      <HeroThematic
        titlePart1="Investir dans"
        titlePart2="l'Immobilier"
        subtitle="Guide complet pour investir dans le marché immobilier philippin : réglementation, prix, fiscalité et opportunités pour les étrangers."
        imageUrl="/images/investir/vue-condominium-philippines.webp"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-1">5-8%</div>
              <div className="text-sm text-green-600">Rendement brut</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-1">40%</div>
              <div className="text-sm text-blue-600">Quota étrangers</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 text-center border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-1">4-5%</div>
              <div className="text-sm text-purple-600">Frais d'acquisition</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 text-center border border-amber-200">
              <div className="text-3xl font-bold text-amber-700 mb-1">25</div>
              <div className="text-sm text-amber-600">Ans bail terrain</div>
            </div>
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

        {/* Règle d'or */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full flex-shrink-0">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-amber-900">La Règle Fondamentale</h3>
                <p className="text-amber-800 mb-4">
                  <strong>Les étrangers ne peuvent pas posséder de terrain aux Philippines.</strong> C'est une restriction
                  constitutionnelle (Article XII, Section 7). Seuls les citoyens philippins ou les sociétés détenues à
                  60% minimum par des Philippins peuvent être propriétaires fonciers.
                </p>
                <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                  <p className="text-amber-900 font-medium flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Vous pouvez être propriétaire à 100% d'un condominium (Republic Act 4726)
                  </p>
                  <p className="text-sm text-amber-700 ml-7 mt-1">
                    Tant que la part étrangère dans l'immeuble ne dépasse pas 40% du total des unités.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ce que vous pouvez acheter */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Ce que Vous Pouvez Acheter</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Les options légales pour les investisseurs étrangers aux Philippines.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Condominium */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">Recommandé</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Building className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-green-900">Condominium</h3>
              </div>
              <p className="text-sm text-green-700 mb-4">
                L'option la plus simple et la plus sûre. Propriété en nom propre, titre CCT.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Propriété 100% en votre nom</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Quota 40% par projet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Transmissible par héritage</span>
                </div>
              </div>
            </div>

            {/* Maison */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Home className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-blue-900">Maison (bâtiment)</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Vous pouvez posséder le bâtiment mais pas le terrain sur lequel il est construit.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Bail terrain (25-75 ans max)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-blue-800">Plus complexe juridiquement</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-blue-800">Financement difficile</span>
                </div>
              </div>
            </div>

            {/* Corporation */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Landmark className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-purple-900">Via Corporation</h3>
              </div>
              <p className="text-sm text-purple-700 mb-4">
                Créer une société philippine pour acquérir un terrain (maison + terrain).
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-800">Accès propriété foncière</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-purple-800">60% min parts philippines</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-purple-800">Coûts structure élevés</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info quota 40% */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-blue-900">Attention au Quota des 40%</h3>
                <p className="text-blue-800 mb-3">
                  Le quota de 40% s'applique <strong>par projet</strong>, pas au niveau national. Un immeuble populaire
                  auprès des étrangers peut rapidement atteindre sa limite.
                </p>
                <p className="text-sm text-blue-700">
                  Vérifiez toujours la disponibilité auprès du développeur ou de la Condominium Corporation avant de verser un acompte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prix par zone */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Prix de l'Immobilier à Metro Manila</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Prix indicatifs par mètre carré dans les principales zones (2026).
          </p>

          <div className="max-w-5xl mx-auto space-y-4">
            {/* Ultra-luxe */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-bold text-amber-900">Rockwell (Makati)</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-amber-700">Ultra-luxe, plus cher de Manila</span>
                    <span className="font-semibold text-amber-900">€5,600 - 8,800/m²</span>
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BGC */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-bold text-blue-900">BGC (Taguig)</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blue-700">CBD moderne, expats, entreprises</span>
                    <span className="font-semibold text-blue-900">€4,500 - 8,000/m²</span>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Makati CBD */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-bold text-purple-900">Makati CBD</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-purple-700">Centre d'affaires historique</span>
                    <span className="font-semibold text-purple-900">€4,000 - 7,200/m²</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ortigas */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-bold text-green-900">Ortigas</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-green-700">Second CBD, BPO, bureaux</span>
                    <span className="font-semibold text-green-900">€2,400 - 4,500/m²</span>
                  </div>
                  <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{width: '50%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* QC */}
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 border border-cyan-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Home className="h-5 w-5 text-cyan-600" />
                  </div>
                  <span className="font-bold text-cyan-900">Quezon City</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-cyan-700">Plus grande ville, universités</span>
                    <span className="font-semibold text-cyan-900">€1,900 - 3,200/m²</span>
                  </div>
                  <div className="h-2 bg-cyan-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full" style={{width: '35%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mandaluyong */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Home className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="font-bold text-orange-900">Mandaluyong</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-orange-700">Connecté, bon rapport qualité/prix</span>
                    <span className="font-semibold text-orange-900">€1,600 - 2,900/m²</span>
                  </div>
                  <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exemples de prix */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Exemples de Prix (BGC/Makati)</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium mb-2">Studio (25-35 m²)</p>
              <p className="text-3xl font-bold text-blue-900 mb-1">₱6-12M</p>
              <p className="text-sm text-blue-700">€96,000 - €192,000</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-200">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 font-medium mb-2">1 chambre (40-55 m²)</p>
              <p className="text-3xl font-bold text-green-900 mb-1">₱12-22M</p>
              <p className="text-sm text-green-700">€192,000 - €352,000</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 text-center border border-purple-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-sm text-purple-600 font-medium mb-2">2-3 chambres (80-120 m²)</p>
              <p className="text-3xl font-bold text-purple-900 mb-1">₱20-45M</p>
              <p className="text-sm text-purple-700">€320,000 - €720,000</p>
            </div>
          </div>
        </section>

        {/* Hors Manila */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Hors Metro Manila</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="font-bold text-cyan-900">Cebu City</h3>
              </div>
              <p className="text-sm text-cyan-700 mb-4">
                Deuxième métropole, IT Park et Business Park en croissance.
              </p>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="font-bold text-cyan-900">₱80,000 - 180,000/m²</p>
                <p className="text-xs text-cyan-600">€1,280 - €2,880/m²</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-green-900">Davao</h3>
              </div>
              <p className="text-sm text-green-700 mb-4">
                Capitale de Mindanao, en développement rapide.
              </p>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="font-bold text-green-900">₱60,000 - 130,000/m²</p>
                <p className="text-xs text-green-600">€960 - €2,080/m²</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-orange-900">Iloilo</h3>
              </div>
              <p className="text-sm text-orange-700 mb-4">
                Ville émergente des Visayas, BPO en expansion.
              </p>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="font-bold text-orange-900">₱50,000 - 100,000/m²</p>
                <p className="text-xs text-orange-600">€800 - €1,600/m²</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fiscalité */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Fiscalité Immobilière</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Frais d'acquisition */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Frais d'Acquisition
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm">Documentary Stamp Tax (DST)</span>
                  <span className="font-semibold text-blue-700">1.5%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <span className="text-sm">Transfer Tax (Metro Manila)</span>
                  <span className="font-semibold text-blue-700">0.75%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm">Frais d'enregistrement (ROD)</span>
                  <span className="font-semibold text-blue-700">~0.5%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <span className="text-sm">Notaire</span>
                  <span className="font-semibold text-blue-700">1-2%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mt-4">
                  <span className="font-semibold text-blue-900">Total acquéreur</span>
                  <span className="font-bold text-xl text-blue-700">4-5%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Le Capital Gains Tax (6%) est normalement payé par le vendeur.
                </p>
              </div>
            </div>

            {/* Taxes annuelles */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Taxes Annuelles
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm">Real Property Tax (Manila)</span>
                  <span className="font-semibold text-green-700">2% val. fiscale</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <span className="text-sm">Real Property Tax (Provinces)</span>
                  <span className="font-semibold text-green-700">1% val. fiscale</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm">Charges copropriété</span>
                  <span className="font-semibold text-green-700">₱50-150/m²/mois</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <span className="text-sm">Assurance (optionnelle)</span>
                  <span className="font-semibold text-green-700">0.2-0.5%/an</span>
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
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6 text-emerald-900">Rendements Locatifs Indicatifs (2026)</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-emerald-800">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Rendements bruts par zone
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                    <span className="text-emerald-800">BGC/Makati Prime</span>
                    <span className="font-bold text-emerald-700">4-6%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                    <span className="text-emerald-800">Ortigas/Mandaluyong</span>
                    <span className="font-bold text-emerald-700">5-7%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                    <span className="text-emerald-800">Quezon City</span>
                    <span className="font-bold text-emerald-700">6-8%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                    <span className="text-emerald-800">Cebu IT Park</span>
                    <span className="font-bold text-emerald-700">5-7%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-emerald-800">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Imposition des loyers
                </h4>
                <div className="bg-white rounded-xl p-4 space-y-3">
                  <p className="text-sm text-emerald-700">
                    Les revenus locatifs sont imposés au taux progressif (jusqu'à 35%) pour les résidents.
                    Les non-résidents paient généralement <strong>25%</strong> sur les revenus bruts.
                  </p>
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <p className="text-sm text-amber-800">
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
          <h2 className="text-3xl font-bold text-center mb-10">Processus d'Achat</h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-0">
              {/* Step 1 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-green-500 my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      Vérification et Due Diligence
                    </h4>
                    <p className="text-sm text-blue-700">
                      Confirmez que le quota 40% n'est pas atteint. Vérifiez le titre (CCT), les charges impayées,
                      et l'historique du développeur. Engagez un avocat spécialisé.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-green-500 to-purple-500 my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      Réservation et Contrat
                    </h4>
                    <p className="text-sm text-green-700">
                      Versez un acompte de réservation (₱20,000-100,000). Signez le Contract to Sell
                      qui détaille le prix, l'échéancier et les conditions de transfert.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-purple-500 to-orange-500 my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-purple-600" />
                      Paiement
                    </h4>
                    <p className="text-sm text-purple-700">
                      Neuf : 10-30% d'acompte + paiements échelonnés, solde à la livraison.
                      Revente : paiement comptant ou négociation directe. Financement bancaire difficile pour les étrangers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    4
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-orange-500 to-cyan-500 my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200">
                    <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                      <Scale className="h-5 w-5 text-orange-600" />
                      Deed of Absolute Sale
                    </h4>
                    <p className="text-sm text-orange-700">
                      Signature de l'acte de vente notarié, paiement des taxes (DST, Transfer Tax, CGT),
                      puis enregistrement auprès du Registry of Deeds pour obtenir le CCT à votre nom.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    5
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-5 border border-cyan-200">
                    <h4 className="font-bold text-cyan-900 mb-2 flex items-center gap-2">
                      <Key className="h-5 w-5 text-cyan-600" />
                      Obtention du TIN et Remise des Clés
                    </h4>
                    <p className="text-sm text-cyan-700">
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
          <h2 className="text-3xl font-bold text-center mb-8">Documents Requis</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 max-w-3xl mx-auto border border-indigo-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <span className="font-medium text-indigo-900">Passeport valide</span>
                  <span className="text-sm text-indigo-600 ml-2">- copie certifiée</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <span className="font-medium text-indigo-900">Tax Identification Number (TIN)</span>
                  <span className="text-sm text-indigo-600 ml-2">- obligatoire pour les taxes</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <span className="font-medium text-indigo-900">Preuve de fonds</span>
                  <span className="text-sm text-indigo-600 ml-2">- relevés bancaires</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <span className="font-medium text-indigo-900">ACR I-Card</span>
                  <span className="text-sm text-indigo-600 ml-2">- si résident longue durée (optionnel)</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <span className="font-medium text-indigo-900">Procuration notariée</span>
                  <span className="text-sm text-indigo-600 ml-2">- si achat à distance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conseils */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils Pratiques</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-blue-900 mb-2">Engagez un Avocat</h3>
              <p className="text-sm text-blue-700">
                Un avocat spécialisé vérifiera le titre, les encumbrances, la conformité au quota 40%,
                et vous représentera pour le transfert. Comptez ₱30,000-100,000.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-green-900 mb-2">Broker PRC-Licensed</h3>
              <p className="text-sm text-green-700">
                La loi RESA (RA 9646) impose de passer par un broker licencié.
                Vérifiez la licence sur le site de la PRC. Commission : 3-5%.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
              <div className="p-3 bg-amber-100 rounded-xl w-fit mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg text-amber-900 mb-2">Évitez les Montages Illégaux</h3>
              <p className="text-sm text-amber-700">
                Les "dummy corporations" sont illégales et peuvent entraîner la perte du bien.
                Respectez toujours la règle des 60/40.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-purple-900 mb-2">Timing et Négociation</h3>
              <p className="text-sm text-purple-700">
                Les développeurs offrent souvent des rabais pour paiement comptant (5-10%).
                Le marché secondaire permet plus de négociation.
              </p>
            </div>
          </div>
        </section>

        {/* Ressources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources Utiles</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="https://www.prc.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-blue-900">PRC (Vérifier licences)</span>
              <ExternalLink className="h-4 w-4 text-blue-400 group-hover:text-blue-600" />
            </a>
            <a
              href="https://www.lamudi.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-green-900">Lamudi (Annonces)</span>
              <ExternalLink className="h-4 w-4 text-green-400 group-hover:text-green-600" />
            </a>
            <a
              href="https://www.dotproperty.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-purple-900">DotProperty</span>
              <ExternalLink className="h-4 w-4 text-purple-400 group-hover:text-purple-600" />
            </a>
            <a
              href="https://www.carousell.ph/property-for-sale/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-orange-900">Carousell Property</span>
              <ExternalLink className="h-4 w-4 text-orange-400 group-hover:text-orange-600" />
            </a>
            <a
              href="https://www.colliers.com/en-ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-200 hover:border-cyan-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-cyan-900">Colliers Philippines</span>
              <ExternalLink className="h-4 w-4 text-cyan-400 group-hover:text-cyan-600" />
            </a>
            <a
              href="https://www.bir.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200 hover:border-pink-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-pink-900">BIR (Taxes)</span>
              <ExternalLink className="h-4 w-4 text-pink-400 group-hover:text-pink-600" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h3 className="text-xl font-semibold text-center mb-6">Continuer votre exploration</h3>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link
              href="/vivre-aux-philippines/investir/bourse-et-entreprises"
              className="group flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-blue-900 text-sm">Bourse et Entreprises</div>
              </div>
              <ChevronRight className="h-4 w-4 text-blue-400" />
            </Link>

            <Link
              href="/vivre-aux-philippines/travailler/creer-entreprise"
              className="group flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-green-900 text-sm">Créer une Entreprise</div>
              </div>
              <ChevronRight className="h-4 w-4 text-green-400" />
            </Link>

            <Link
              href="/vivre-aux-philippines/s-installer/visas"
              className="group flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-purple-900 text-sm">Visas et Permis</div>
              </div>
              <ChevronRight className="h-4 w-4 text-purple-400" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ImmobilierPage;
