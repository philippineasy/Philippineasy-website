import { Metadata } from 'next';
import { Building, FileText, Users, Landmark, DollarSign, Shield, Globe, CheckCircle, AlertTriangle, Briefcase, Calculator, ExternalLink, ChevronRight, Building2, User, Clock, Scale, TrendingUp, Zap, Target, Award, Percent, MapPin, Wallet, Banknote, BadgeCheck, Factory, Leaf } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Créer son Entreprise aux Philippines en 2026 : Guide Complet | Philippineasy",
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

const CreerEntreprisePage = () => {
  return (
    <div className="bg-background">
      <HeroThematic
        titlePart1="Créer son"
        titlePart2="Entreprise"
        subtitle="Guide complet pour lancer votre activité aux Philippines : structures juridiques, capital requis, démarches administratives et opportunités fiscales."
        imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-1">+6%</div>
              <div className="text-sm text-green-600">Croissance/an</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-1">115M</div>
              <div className="text-sm text-blue-600">Habitants</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 text-center border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-1">4-12</div>
              <div className="text-sm text-purple-600">Semaines création</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 text-center border border-amber-200">
              <div className="text-3xl font-bold text-amber-700 mb-1">422</div>
              <div className="text-sm text-amber-600">Zones PEZA</div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            Avec une croissance économique soutenue, une population jeune de 115 millions d'habitants
            et un taux d'anglophonie parmi les plus élevés d'Asie, les Philippines représentent un terrain fertile pour
            l'entrepreneuriat. La plateforme <strong>eSPARC de la SEC</strong> permet désormais de créer
            une entreprise en 4 à 12 semaines.
          </p>
        </section>

        {/* Alerte FINL */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-amber-900">Foreign Investment Negative List (FINL)</h3>
                <p className="text-amber-800 mb-4">
                  Avant tout projet, consultez la <strong>12ème FINL</strong> (Executive Order 175) qui définit les secteurs
                  où la participation étrangère est limitée ou interdite :
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-amber-900">Médias : interdits</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-amber-900">Retail : ₱25M min si &gt;40%</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-amber-900">Utilities : max 40%</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-amber-900">Professions : Philippins</span>
                  </div>
                </div>
                <a
                  href="https://emerhub.com/philippines/foreign-investment-negative-list-in-the-philippines/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold transition-colors"
                >
                  Consulter la FINL complète
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Structures juridiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Structures Juridiques Disponibles</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Le choix de la structure dépend de votre activité, du nombre d'associés et du niveau de contrôle souhaité.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Corporation - Recommandé */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-300 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 right-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">Recommandé</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-blue-900">Corporation</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Structure la plus courante pour les investisseurs étrangers. Responsabilité limitée aux apports.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-blue-800">2-15 actionnaires</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-blue-800">100% étranger possible</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">US$200k (US$100k tech)</span>
                </div>
              </div>
            </div>

            {/* OPC */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-purple-900">One Person Corp. (OPC)</h3>
              </div>
              <p className="text-sm text-purple-700 mb-4">
                Structure simplifiée pour un entrepreneur seul. Créée par le Revised Corporation Code de 2019.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-800">Un seul actionnaire</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-800">Ouvert aux étrangers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-purple-800">Secrétaire PH requis</span>
                </div>
              </div>
            </div>

            {/* Branch Office */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-green-900">Branch Office</h3>
              </div>
              <p className="text-sm text-green-700 mb-4">
                Extension d'une société étrangère. La maison-mère reste responsable des dettes.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">100% contrôle maison-mère</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Génère des revenus locaux</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">US$200k rapatrié</span>
                </div>
              </div>
            </div>

            {/* Representative Office */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Globe className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="font-bold text-lg text-cyan-900">Representative Office</h3>
              </div>
              <p className="text-sm text-cyan-700 mb-4">
                Bureau de liaison sans activité commerciale. Idéal pour prospecter le marché.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-cyan-800">Capital réduit : US$30k</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-cyan-800">Promotion, étude marché</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-cyan-800">Pas de revenus locaux</span>
                </div>
              </div>
            </div>

            {/* Partnership */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg text-orange-900">Partnership</h3>
              </div>
              <p className="text-sm text-orange-700 mb-4">
                Association de 2+ personnes. Peut être générale ou limitée.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-orange-800">Formalités simplifiées</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-orange-800">Pas de capital minimum</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-orange-800">Rare pour étrangers</span>
                </div>
              </div>
            </div>

            {/* Sole Proprietorship - Non disponible */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-300 opacity-75">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="font-bold text-lg text-gray-700">Sole Proprietorship</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Entreprise individuelle. Réservée aux citoyens philippins uniquement.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-gray-700 font-medium">Non accessible aux étrangers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Enregistrement DTI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capital minimum */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Capital Minimum Requis</h2>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
              <h3 className="font-bold text-lg">Comparatif par structure</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Corporation/OPC */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-900">Corporation / OPC</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">US$200,000</span>
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">US$100,000 (tech/50+ employés)</span>
                  </div>
                </div>
              </div>

              {/* Branch Office */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-green-900">Branch Office</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">US$200,000</span>
                    <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm font-medium">₱5,000 (export PEZA)</span>
                  </div>
                </div>
              </div>

              {/* Representative Office */}
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 border border-cyan-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Globe className="h-5 w-5 text-cyan-600" />
                    </div>
                    <span className="font-semibold text-cyan-900">Representative Office</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-cyan-200 text-cyan-800 rounded-full text-sm font-medium">US$30,000</span>
                  </div>
                </div>
              </div>

              {/* Partnership */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-semibold text-orange-900">Partnership</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-medium">Pas de minimum (règles FINL si &gt;40%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Étapes de création - Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Les Étapes de Création</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Processus complet de 30 à 45 jours ouvrés en moyenne via la plateforme eSPARC.
          </p>

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
                    <h4 className="font-bold text-blue-900 mb-2">Réservation du Nom (SEC)</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Vérifiez la disponibilité via <a href="https://esparc.sec.gov.ph" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-900">eSPARC</a>.
                      Réservation valable 90 jours (renouvelable 1x).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 1-3 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱100-500
                      </span>
                    </div>
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
                    <h4 className="font-bold text-green-900 mb-2">Enregistrement SEC</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Soumettez les Articles of Incorporation, By-laws et documents notariés.
                      Pour les étrangers : formulaire FIA + certificat bancaire capital.
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-green-800 mb-2">Documents requis :</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Articles Inc.</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">By-laws</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">FIA (₱3k)</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Certif. bancaire</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">TIN/Passeport</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 7-20 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱10k-30k
                      </span>
                    </div>
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
                    <h4 className="font-bold text-purple-900 mb-2">Barangay Clearance</h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Obtenez l'autorisation du barangay (quartier) où sera situé votre bureau.
                      Indispensable pour le Mayor's Permit.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 1-3 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱300-1,800
                      </span>
                    </div>
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
                    <h4 className="font-bold text-orange-900 mb-2">Mayor's Permit (Business Permit)</h4>
                    <p className="text-sm text-orange-700 mb-3">
                      Permis d'exploitation par la mairie. Inclut inspections sanitaire, incendie et zonage.
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-orange-800 mb-2">Documents requis :</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Certif. SEC</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Barangay</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Bail</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">CTC</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Zoning</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-15 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱5k-20k/an
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    5
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-cyan-500 to-pink-500 my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-5 border border-cyan-200">
                    <h4 className="font-bold text-cyan-900 mb-2">Enregistrement BIR</h4>
                    <p className="text-sm text-cyan-700 mb-3">
                      Bureau of Internal Revenue : TIN entreprise, autorisation factures (ATP),
                      enregistrement livres comptables.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-10 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                        <Banknote className="h-3 w-3" /> ₱500-4,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    6
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-200">
                    <h4 className="font-bold text-pink-900 mb-2">Enregistrement Employeurs</h4>
                    <p className="text-sm text-pink-700 mb-3">
                      Si vous embauchez : SSS (sécurité sociale), PhilHealth (santé), Pag-IBIG (logement).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> 5-7 jours
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <BadgeCheck className="h-3 w-3" /> Gratuit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estimation des coûts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Estimation des Coûts Totaux</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
                <h3 className="font-bold text-lg">Budget prévisionnel (hors capital social)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Enregistrement SEC</span>
                  <span className="font-semibold">₱10,000 - ₱30,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg">
                  <span className="text-sm">Barangay Clearance + CTC</span>
                  <span className="font-semibold">₱500 - ₱2,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Mayor's Permit (1ère année)</span>
                  <span className="font-semibold">₱5,000 - ₱20,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg">
                  <span className="text-sm">Fire Safety + Zoning</span>
                  <span className="font-semibold">₱1,500 - ₱5,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Enregistrement BIR + ATP</span>
                  <span className="font-semibold">₱2,000 - ₱5,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border-l-4 border-l-amber-500">
                  <span className="text-sm">Honoraires avocat/consultant (optionnel)</span>
                  <span className="font-semibold text-amber-600">₱50,000 - ₱150,000</span>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <span className="font-semibold text-green-900">TOTAL (sans consultant)</span>
                    <span className="font-bold text-xl text-green-700">₱19,000 - ₱62,000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mt-3">
                    <span className="font-semibold text-blue-900">TOTAL (avec consultant)</span>
                    <span className="font-bold text-xl text-blue-700">₱70,000 - ₱200,000</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  * N'inclut pas le capital social requis (US$100,000-200,000 pour les étrangers)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PEZA et incitations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Incitations Fiscales : PEZA et BOI</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Le CREATE MORE Act de 2024 offre jusqu'à 27 ans d'avantages fiscaux pour les projets à fort impact.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* PEZA */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Factory className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-green-900">PEZA</h3>
                  <p className="text-sm text-green-600">Philippine Economic Zone Authority</p>
                </div>
              </div>
              <p className="text-sm text-green-700 mb-4">
                422 zones économiques. Idéal pour l'export, la tech et le BPO.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <Percent className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">Income Tax Holiday</div>
                    <div className="text-xs text-green-600">4-8 ans (8 pour green tech)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">5% SCIT après ITH</div>
                    <div className="text-xs text-green-600">Au lieu de 25% CIT</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <BadgeCheck className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">Duty-free imports</div>
                    <div className="text-xs text-green-600">Équipements et matières premières</div>
                  </div>
                </div>
              </div>
              <a
                href="https://www.peza.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-green-700 hover:text-green-900 font-semibold"
              >
                Site officiel PEZA <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* BOI */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-blue-900">BOI</h3>
                  <p className="text-sm text-blue-600">Board of Investments</p>
                </div>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Pour les projets hors zones économiques dans les secteurs prioritaires.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <Percent className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Income Tax Holiday</div>
                    <div className="text-xs text-blue-600">4-7 ans selon le projet</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Déductions additionnelles</div>
                    <div className="text-xs text-blue-600">Formation et R&D</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Réductions douanières</div>
                    <div className="text-xs text-blue-600">Sur équipements importés</div>
                  </div>
                </div>
              </div>
              <a
                href="https://boi.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-blue-700 hover:text-blue-900 font-semibold"
              >
                Site officiel BOI <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils Pratiques</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <div className="p-3 bg-indigo-100 rounded-xl w-fit mb-4">
                <Scale className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg text-indigo-900 mb-2">Engagez un Avocat Local</h3>
              <p className="text-sm text-indigo-700">
                Un avocat philippin spécialisé en droit des affaires vous évitera des erreurs coûteuses,
                surtout concernant la FINL et les structures à capitaux étrangers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
              <div className="p-3 bg-emerald-100 rounded-xl w-fit mb-4">
                <Landmark className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-emerald-900 mb-2">Ouvrez un Compte Corporate</h3>
              <p className="text-sm text-emerald-700">
                Préparez votre capital avant de démarrer. Les banques exigent une preuve de rapatriement
                de fonds pour les sociétés à capitaux étrangers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
              <div className="p-3 bg-amber-100 rounded-xl w-fit mb-4">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg text-amber-900 mb-2">Nommez un Agent Résident</h3>
              <p className="text-sm text-amber-700">
                Obligatoire pour les branches et corporations à capitaux étrangers. Peut être un citoyen
                philippin ou un étranger avec visa de travail.
              </p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
              <div className="p-3 bg-rose-100 rounded-xl w-fit mb-4">
                <Calculator className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-lg text-rose-900 mb-2">Anticipez les Obligations Fiscales</h3>
              <p className="text-sm text-rose-700">
                Déclarations mensuelles (TVA, retenues), trimestrielles et annuelles.
                Un comptable local est quasi indispensable.
              </p>
            </div>
          </div>
        </section>

        {/* Ressources officielles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources Officielles</h2>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="https://esparc.sec.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-blue-900">SEC eSPARC</span>
              <ExternalLink className="h-4 w-4 text-blue-400 group-hover:text-blue-600" />
            </a>
            <a
              href="https://www.bir.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-green-900">Bureau of Internal Revenue</span>
              <ExternalLink className="h-4 w-4 text-green-400 group-hover:text-green-600" />
            </a>
            <a
              href="https://www.dti.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-purple-900">Dept. of Trade</span>
              <ExternalLink className="h-4 w-4 text-purple-400 group-hover:text-purple-600" />
            </a>
            <a
              href="https://www.peza.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-200 hover:border-cyan-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-cyan-900">PEZA</span>
              <ExternalLink className="h-4 w-4 text-cyan-400 group-hover:text-cyan-600" />
            </a>
            <a
              href="https://boi.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-orange-900">Board of Investments</span>
              <ExternalLink className="h-4 w-4 text-orange-400 group-hover:text-orange-600" />
            </a>
            <a
              href="https://www.philembassy.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200 hover:border-pink-400 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-pink-900">Ambassade PH (FR)</span>
              <ExternalLink className="h-4 w-4 text-pink-400 group-hover:text-pink-600" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h3 className="text-xl font-semibold text-center mb-6">Continuer votre exploration</h3>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link
              href="/vivre-aux-philippines/travailler/emploi-salarie"
              className="group flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-blue-900 text-sm">Emploi Salarié</div>
              </div>
              <ChevronRight className="h-4 w-4 text-blue-400" />
            </Link>

            <Link
              href="/vivre-aux-philippines/investir/immobilier"
              className="group flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-green-900 text-sm">Immobilier</div>
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

export default CreerEntreprisePage;
