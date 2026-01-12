import { Metadata } from 'next';
import { Briefcase, TrendingUp, Building, Info, AlertTriangle, CheckCircle, ExternalLink, ChevronRight, DollarSign, LineChart, PieChart, Users, Globe, Shield, Calculator, FileText, BarChart3, Wallet, ArrowRight, Building2, Landmark, Zap, Phone, ShoppingBag } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Investir en Bourse aux Philippines en 2026 : PSE, Actions, Entreprises | Philippineasy",
  description: "Guide complet pour investir à la bourse philippine (PSE) et dans les entreprises locales : ouverture de compte, fiscalité, secteurs porteurs, SIRV 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/investir/bourse-et-entreprises',
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
    title: "Investir en Bourse aux Philippines en 2026 : PSE, Actions, Entreprises",
    description: "Guide complet pour investir à la bourse philippine (PSE) et dans les entreprises locales : ouverture de compte, fiscalité, secteurs porteurs.",
    url: 'https://philippineasy.com/vivre-aux-philippines/investir/bourse-et-entreprises',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Investir en Bourse aux Philippines en 2026",
    description: "Guide pour investir à la bourse philippine (PSE) : compte, fiscalité, entreprises.",
    site: '@philippineasy',
  },
};

const BourseEntreprisesPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Investir en Bourse"
        titlePart2="et Entreprises"
        subtitle="Guide complet pour investir à la bourse philippine et dans les entreprises locales : PSE, secteurs porteurs, fiscalité et visa investisseur."
        imageUrl="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-muted-foreground mb-8">
            Au-delà de l'immobilier, les Philippines offrent des opportunités d'investissement diversifiées via
            le marché boursier local (PSE) et l'investissement direct dans les entreprises. Avec une économie
            parmi les plus dynamiques d'Asie du Sud-Est, le pays attire les investisseurs en quête de croissance
            à long terme.
          </p>

          {/* Stats boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <LineChart className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-700">~6,200</p>
              <p className="text-sm text-green-600">PSEi Index</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Building className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-700">280+</p>
              <p className="text-sm text-blue-600">Sociétés cotées</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-purple-700">$75K</p>
              <p className="text-sm text-purple-600">Min. visa SIRV</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center border border-amber-200">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-amber-700">6,500</p>
              <p className="text-sm text-amber-600">Objectif 2026</p>
            </div>
          </div>
        </section>

        {/* Actions A et B - Info box coloré */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-blue-900">Actions de Classe A et Classe B</h3>
                <p className="text-blue-800 mb-4">
                  De nombreuses sociétés philippines émettent deux classes d'actions :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">Classe A</span>
                    <p className="text-blue-700 mt-2">Réservées aux citoyens philippins uniquement</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 border border-indigo-200">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">Classe B</span>
                    <p className="text-indigo-700 mt-2">Ouvertes aux étrangers ET aux Philippins (mêmes droits)</p>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mt-4 bg-white/50 p-3 rounded-lg">
                  <strong>Note :</strong> La participation étrangère totale dans une société ne peut généralement pas dépasser 40% du capital,
                  sauf dans certains secteurs non restreints.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comment investir */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Comment Investir à la PSE</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Deux options principales selon votre statut de résidence
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Broker International */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900">Broker International</h3>
                  <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">Recommandé</span>
                </div>
              </div>
              <p className="text-green-800 mb-4">
                La solution la plus simple pour les non-résidents. Ouverture 100% en ligne.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm"><strong>Interactive Brokers</strong> - Frais bas, multi-marchés</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm"><strong>Boom Securities</strong> - Spécialisé Asie</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm"><strong>XTB</strong> - CFD sur actions PH</span>
                </div>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  <strong>Documents :</strong> Passeport, justificatif de domicile, W-8BEN si broker US
                </p>
              </div>
            </div>

            {/* Broker Local */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 border-2 border-blue-300 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900">Broker Local</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Si résident</span>
                </div>
              </div>
              <p className="text-blue-800 mb-4">
                Pour résidents ou détenteurs de visa long séjour. Visite en agence souvent requise.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm"><strong>COL Financial</strong> - Le plus populaire, app mobile</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm"><strong>First Metro Securities</strong> - Filiale Metrobank</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm"><strong>BDO / BPI Securities</strong> - Grandes banques</span>
                </div>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Documents :</strong> Passeport + visa résident, ACR I-Card, TIN, preuve d'adresse locale
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fiscalité */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Fiscalité des Investissements</h2>
          <div className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl border-2 border-gray-200 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                    <th className="p-4 text-left font-semibold">Type de Revenu</th>
                    <th className="p-4 text-center font-semibold">Taux</th>
                    <th className="p-4 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-red-50 border-b border-red-100">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-red-600" />
                        <span className="font-medium">Dividendes (personne physique)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full font-bold">25%</span>
                    </td>
                    <td className="p-4 text-sm text-red-700">Retenue à la source</td>
                  </tr>
                  <tr className="bg-red-100/50 border-b border-red-100">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-red-700" />
                        <span className="font-medium">Dividendes (société étrangère)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full font-bold">30%</span>
                    </td>
                    <td className="p-4 text-sm text-red-700">Réductible par convention fiscale</td>
                  </tr>
                  <tr className="bg-amber-50 border-b border-amber-100">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-amber-600" />
                        <span className="font-medium">Taxe sur transaction (vente)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-amber-500 text-white rounded-full font-bold">0.6%</span>
                    </td>
                    <td className="p-4 text-sm text-amber-700">Stock Transaction Tax</td>
                  </tr>
                  <tr className="bg-green-50 border-b border-green-100">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Frais PSE (achat/vente)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full font-bold">0.005%</span>
                    </td>
                    <td className="p-4 text-sm text-green-700">Sur le montant brut</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">TVA sur frais courtage</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-full font-bold">12%</span>
                    </td>
                    <td className="p-4 text-sm text-blue-700">Sur les commissions du broker</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              💡 La France a une convention fiscale avec les Philippines. Consultez un conseiller fiscal.
            </p>
          </div>
        </section>

        {/* Secteurs porteurs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Secteurs Porteurs en 2026</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Les secteurs les plus dynamiques de l'économie philippine
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Immobilier */}
            <div className="bg-white rounded-xl border-l-4 border-l-blue-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg">Immobilier</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Promoteurs avec portefeuilles diversifiés (malls, bureaux, résidentiel).
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">SMPH</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">ALI</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">MEG</span>
              </div>
            </div>

            {/* Services Financiers */}
            <div className="bg-white rounded-xl border-l-4 border-l-green-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Landmark className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-lg">Banques & Finance</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Bancarisation croissante, fintech en expansion.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">BDO</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">BPI</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">MBT</span>
              </div>
            </div>

            {/* Consommation */}
            <div className="bg-white rounded-xl border-l-4 border-l-orange-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg">Consommation</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Classe moyenne en expansion, F&B et retail.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">JFC</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">URC</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">PGOLD</span>
              </div>
            </div>

            {/* Télécoms */}
            <div className="bg-white rounded-xl border-l-4 border-l-purple-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg">Télécoms & Tech</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Internet, data centers, 5G, services cloud.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">PLDT</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">GLO</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">CNVRG</span>
              </div>
            </div>

            {/* Utilities */}
            <div className="bg-white rounded-xl border-l-4 border-l-amber-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg">Utilities & Énergie</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Demande croissante, renouvelables en hausse.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">MER</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">AP</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">FGEN</span>
              </div>
            </div>

            {/* Conglomérats */}
            <div className="bg-white rounded-xl border-l-4 border-l-slate-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-slate-600" />
                </div>
                <h3 className="font-bold text-lg">Conglomérats</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Holdings diversifiées, exposition multi-secteur.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full">SM</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full">AC</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full">GTCAP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Investir dans une entreprise non cotée */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Investir dans une Entreprise Non Cotée</h2>
          <div className="max-w-4xl mx-auto">
            {/* Alerte 40% */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-amber-900">Règle des 40%</h3>
                  <p className="text-amber-800">
                    La participation étrangère dans une entreprise philippine non cotée est généralement limitée à <strong>40%</strong>.
                    Certains secteurs (export, tech) permettent 100% de propriété étrangère. Vérifiez toujours la <strong>FINL</strong> (Foreign Investment Negative List).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Avantages */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  Avantages
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-green-800">Potentiel de rendement élevé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-green-800">Accès à des secteurs non cotés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-green-800">Influence directe sur la gestion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-green-800">Peut donner accès au visa SIRV</span>
                  </li>
                </ul>
              </div>

              {/* Risques */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-800">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  Risques
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-red-600 mt-0.5" />
                    <span className="text-red-800">Liquidité faible ou nulle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-red-600 mt-0.5" />
                    <span className="text-red-800">Due diligence complexe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-red-600 mt-0.5" />
                    <span className="text-red-800">Risque de fraude plus élevé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-red-600 mt-0.5" />
                    <span className="text-red-800">Sortie difficile à négocier</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SIRV */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Visa Investisseur : SIRV</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-300 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-900">Special Investor's Resident Visa</h3>
                  <p className="text-purple-700">Résidence permanente pour investisseurs</p>
                </div>
              </div>

              <p className="text-purple-800 mb-6">
                Le SIRV permet de résider indéfiniment aux Philippines en échange d'un investissement qualifié.
                Alternative intéressante aux visas de retraite pour les investisseurs actifs.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/70 rounded-xl p-5 border border-purple-200">
                  <h4 className="font-semibold mb-4 text-purple-900">Conditions Principales</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>Investissement minimum : <strong>US$75,000</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>Âge minimum : <strong>21 ans</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>Casier judiciaire vierge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>Frais de dossier : ~US$300</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/70 rounded-xl p-5 border border-indigo-200">
                  <h4 className="font-semibold mb-4 text-indigo-900">Investissements Éligibles</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>Actions de sociétés cotées (PSE)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>Entreprises secteurs prioritaires (IPP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-red-700"><strong>Immobilier NON éligible</strong></span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Timeline SIRV */}
              <div className="bg-white/70 rounded-xl p-5 border border-purple-200">
                <h4 className="font-semibold mb-4 text-purple-900">Processus d'obtention</h4>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                    <span>Dépôt $75K+ (DBP/Land Bank)</span>
                  </div>
                  <ArrowRight className="hidden md:block h-4 w-4 text-purple-400 mx-2" />
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                    <span>Visa probatoire</span>
                  </div>
                  <ArrowRight className="hidden md:block h-4 w-4 text-purple-400 mx-2" />
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                    <span>Conversion (180j)</span>
                  </div>
                  <ArrowRight className="hidden md:block h-4 w-4 text-purple-400 mx-2" />
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                    <span>Visa permanent</span>
                  </div>
                </div>
              </div>

              <a
                href="https://boi.gov.ph/wp-content/uploads/2019/11/SIRV-FAQ.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                FAQ officielle SIRV (BOI)
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Conseils */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils Pratiques</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Diversifiez</h3>
              <p className="text-muted-foreground">
                Ne concentrez pas tout sur un seul secteur.
                Combinez actions, immobilier et peut-être une participation dans une PME locale.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Anticipez la Fiscalité</h3>
              <p className="text-muted-foreground">
                Retenues à la source élevées (25-30%). Vérifiez les conventions
                fiscales France-Philippines et consultez un expert.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Documentez Tout</h3>
              <p className="text-muted-foreground">
                Conservez tous les justificatifs de transferts et achats d'actions.
                Nécessaires pour le rapatriement des dividendes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Méfiez-vous des Arnaques</h3>
              <p className="text-muted-foreground">
                N'investissez que via des courtiers licenciés SEC Philippines.
                Vérifiez toujours les registres officiels.
              </p>
            </div>
          </div>
        </section>

        {/* Ressources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources Officielles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="https://www.pse.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <LineChart className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">Philippine Stock Exchange</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://edge.pse.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <BarChart3 className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">PSE Edge (données)</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://www.sec.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                  <Shield className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">SEC Philippines</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://boi.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                  <Briefcase className="h-5 w-5 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">Board of Investments</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://www.colfinancial.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                  <TrendingUp className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">COL Financial</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a
              href="https://www.firstmetrosec.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-cyan-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                  <Building2 className="h-5 w-5 text-cyan-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">First Metro Securities</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/vivre-aux-philippines/investir/immobilier"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Investir en Immobilier</span>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </Link>
            <Link
              href="/vivre-aux-philippines/travailler/creer-entreprise"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Créer une Entreprise</span>
              </div>
              <ChevronRight className="h-5 w-5 text-green-600" />
            </Link>
            <Link
              href="/vivre-aux-philippines/s-installer/visas"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">Visas et Permis</span>
              </div>
              <ChevronRight className="h-5 w-5 text-purple-600" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BourseEntreprisesPage;
