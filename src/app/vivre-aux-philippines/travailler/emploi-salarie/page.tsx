import { Metadata } from 'next';
import { Briefcase, Search, Building, DollarSign, Users, AlertTriangle, CheckCircle, ExternalLink, TrendingUp, Globe, FileText, Clock, ChevronRight, GraduationCap, Heart, Factory, Award, Target, Zap, MapPin, Calendar, CreditCard, Plane, Home, Shield, Star } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
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

const EmploiSalariePage = () => {
  return (
    <div className="bg-background">
      <HeroThematic
        titlePart1="Trouver un"
        titlePart2="Emploi Salarié"
        subtitle="Le marché du travail philippin pour les expatriés : opportunités, démarches et conseils pour décrocher un poste."
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Les Philippines offrent de réelles opportunités professionnelles aux étrangers qualifiés,
            notamment dans les secteurs en forte croissance. L'anglais étant la langue des affaires,
            les francophones bilingues y trouvent souvent leur place.
          </p>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-1">6</div>
              <div className="text-sm text-blue-600">Secteurs porteurs</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-1">1.5M</div>
              <div className="text-sm text-green-600">Emplois BPO</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 text-center border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-1">2-4</div>
              <div className="text-sm text-purple-600">Mois visa 9G</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 text-center border border-amber-200">
              <div className="text-3xl font-bold text-amber-700 mb-1">13</div>
              <div className="text-sm text-amber-600">Mois de salaire</div>
            </div>
          </div>
        </section>

        {/* Prérequis légaux */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-amber-900">Prérequis légal : AEP + Visa 9G</h3>
                <p className="text-amber-800 mb-4">
                  Pour travailler légalement aux Philippines, vous devez obtenir un <strong>Alien Employment Permit (AEP)</strong>
                  délivré par le DOLE, suivi d'un <strong>visa de travail 9(G)</strong> du Bureau of Immigration.
                  Ces démarches sont généralement initiées par votre employeur.
                </p>
                <Link
                  href="/vivre-aux-philippines/visas-et-formalites"
                  className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold transition-colors"
                >
                  Voir notre guide complet sur les visas
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Secteurs qui recrutent */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Secteurs qui recrutent des expatriés</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Certains secteurs sont particulièrement ouverts aux talents étrangers,
            que ce soit pour leur expertise technique ou leurs compétences linguistiques.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* BPO */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-blue-900">BPO / Call Centers</h3>
              </div>
              <p className="text-sm text-blue-800 mb-4">
                Les Philippines sont le leader mondial du BPO. Les postes de management
                et de formation sont accessibles aux expatriés.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Service client</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Support tech</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Finance</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">RH</span>
              </div>
              <div className="pt-3 border-t border-blue-200">
                <span className="text-sm font-semibold text-blue-700">
                  💰 80k - 200k PHP/mois (managers)
                </span>
              </div>
            </div>

            {/* IT & Tech */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-green-900">IT & Tech</h3>
              </div>
              <p className="text-sm text-green-800 mb-4">
                Fort développement du secteur tech avec une demande croissante
                pour les profils seniors et spécialisés.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Dev logiciel</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Cyber</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Data/IA</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Cloud</span>
              </div>
              <div className="pt-3 border-t border-green-200">
                <span className="text-sm font-semibold text-green-700">
                  💰 100k - 300k+ PHP/mois (seniors)
                </span>
              </div>
            </div>

            {/* Enseignement */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-purple-900">Enseignement</h3>
              </div>
              <p className="text-sm text-purple-800 mb-4">
                Forte demande pour les professeurs natifs de langues étrangères
                et les enseignants dans les écoles internationales.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Français FLE</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Anglais</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Écoles int.</span>
              </div>
              <div className="pt-3 border-t border-purple-200">
                <span className="text-sm font-semibold text-purple-700">
                  💰 50k - 150k PHP/mois
                </span>
              </div>
            </div>

            {/* Finance & Consulting */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg text-orange-900">Finance & Consulting</h3>
              </div>
              <p className="text-sm text-orange-800 mb-4">
                Les multinationales recherchent des profils expérimentés
                pour leurs opérations régionales.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Audit</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Conseil</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Analyse fin.</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Risk</span>
              </div>
              <div className="pt-3 border-t border-orange-200">
                <span className="text-sm font-semibold text-orange-700">
                  💰 150k - 400k+ PHP/mois (seniors)
                </span>
              </div>
            </div>

            {/* Hôtellerie & Tourisme */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-bold text-lg text-red-900">Hôtellerie & Tourisme</h3>
              </div>
              <p className="text-sm text-red-800 mb-4">
                Secteur en plein essor avec de nombreux resorts
                et hôtels de luxe recherchant des managers internationaux.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Direction</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">F&B</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Chef</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Events</span>
              </div>
              <div className="pt-3 border-t border-red-200">
                <span className="text-sm font-semibold text-red-700">
                  💰 70k - 200k PHP/mois (managers)
                </span>
              </div>
            </div>

            {/* Industrie */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Factory className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="font-bold text-lg text-cyan-900">Industrie & Manufacturing</h3>
              </div>
              <p className="text-sm text-cyan-800 mb-4">
                Les zones économiques spéciales (PEZA) attirent
                de nombreuses entreprises manufacturières.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">Production</span>
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">Qualité</span>
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">Supply</span>
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">Direction</span>
              </div>
              <div className="pt-3 border-t border-cyan-200">
                <span className="text-sm font-semibold text-cyan-700">
                  💰 100k - 300k PHP/mois
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Où chercher */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Où trouver des offres d'emploi ?</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plateformes en ligne */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Search className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg text-indigo-900">Plateformes en ligne</h3>
              </div>

              <div className="space-y-4">
                <a href="https://www.jobstreet.com.ph" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-indigo-900 group-hover:text-indigo-700">JobStreet Philippines</div>
                    <div className="text-xs text-indigo-600">Leader local • Filtrer "expat-friendly"</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600" />
                </a>

                <a href="https://www.linkedin.com/jobs" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-indigo-900 group-hover:text-indigo-700">LinkedIn Jobs</div>
                    <div className="text-xs text-indigo-600">Postes qualifiés • Networking</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600" />
                </a>

                <a href="https://www.kalibrr.com" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-indigo-900 group-hover:text-indigo-700">Kalibrr</div>
                    <div className="text-xs text-indigo-600">Startups & Tech</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600" />
                </a>

                <a href="https://www.indeed.com.ph" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-indigo-900 group-hover:text-indigo-700">Indeed Philippines</div>
                    <div className="text-xs text-indigo-600">Agrégateur • Large choix</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600" />
                </a>
              </div>
            </div>

            {/* Autres canaux */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-emerald-900">Autres canaux efficaces</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">Pages carrière multinationales</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    Accenture, Concentrix, Telus, JPMorgan, Google, Meta... postulez directement.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">Cabinets de recrutement</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    Michael Page, Robert Walters, Hays - actifs pour les profils seniors.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">Groupes Facebook</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    "Jobs in Manila for Foreigners", "Expat Jobs Philippines" - offres exclusives.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">Chambre de Commerce</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    La CCI Franco-Philippine facilite les mises en relation professionnelles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Salaires */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Salaires et packages</h2>

          <div className="max-w-5xl mx-auto space-y-8">
            {/* Tableau salaires */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <h3 className="font-bold text-lg">Fourchettes salariales indicatives (2025)</h3>
                <p className="text-sm text-blue-100">Taux de change : 1 EUR ≈ 61 PHP</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Junior */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="sm:w-40">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Junior (0-3 ans)</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">40 000 - 70 000 PHP/mois</span>
                        <span className="text-sm font-medium text-green-600">~650 - 1 150€</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{width: '15%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Intermédiaire */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="sm:w-40">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Mid (3-7 ans)</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">70 000 - 150 000 PHP/mois</span>
                        <span className="text-sm font-medium text-blue-600">~1 150 - 2 450€</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{width: '35%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Senior */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="sm:w-40">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Senior (7-15 ans)</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">150 000 - 300 000 PHP/mois</span>
                        <span className="text-sm font-medium text-purple-600">~2 450 - 4 900€</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Direction */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="sm:w-40">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Direction</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">300 000 - 600 000+ PHP/mois</span>
                        <span className="text-sm font-medium text-amber-600">~4 900 - 10 000€+</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Avantages */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Avantages courants
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-green-900">13ème mois</div>
                      <div className="text-xs text-green-600">Obligatoire par la loi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-green-900">Assurance santé HMO</div>
                      <div className="text-xs text-green-600">Couverture médicale complète</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-green-900">Congés payés</div>
                      <div className="text-xs text-green-600">5-15 jours selon ancienneté</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-green-900">Prime de performance</div>
                      <div className="text-xs text-green-600">Variable selon résultats</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                <h4 className="font-bold text-lg text-amber-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  Packages expatriés (seniors)
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Home className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-amber-900">Logement</div>
                      <div className="text-xs text-amber-600">Fourni ou allocation mensuelle</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Plane className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-amber-900">Billets d'avion annuels</div>
                      <div className="text-xs text-amber-600">Home leave pour la famille</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-amber-900">Visa et AEP</div>
                      <div className="text-xs text-amber-600">Prise en charge totale</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-amber-900">Scolarité enfants</div>
                      <div className="text-xs text-amber-600">Parfois inclus (écoles int.)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culture du travail */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Culture du travail aux Philippines</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Ce qui fonctionne */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Ce qui fonctionne
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-l-green-500 pl-4 py-2 bg-white rounded-r-lg">
                  <p className="font-semibold text-green-900">Respect de la hiérarchie</p>
                  <p className="text-sm text-green-700">Les Philippins valorisent le respect des aînés et supérieurs</p>
                </div>
                <div className="border-l-4 border-l-green-500 pl-4 py-2 bg-white rounded-r-lg">
                  <p className="font-semibold text-green-900">Communication indirecte</p>
                  <p className="text-sm text-green-700">Privilégiez la diplomatie, évitez la confrontation directe</p>
                </div>
                <div className="border-l-4 border-l-green-500 pl-4 py-2 bg-white rounded-r-lg">
                  <p className="font-semibold text-green-900">Relations personnelles</p>
                  <p className="text-sm text-green-700">Prenez le temps de construire des liens avec vos collègues</p>
                </div>
                <div className="border-l-4 border-l-green-500 pl-4 py-2 bg-white rounded-r-lg">
                  <p className="font-semibold text-green-900">Patience</p>
                  <p className="text-sm text-green-700">Les processus peuvent prendre plus de temps qu'en Europe</p>
                </div>
              </div>
            </div>

            {/* À éviter */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
              <h3 className="font-bold text-lg text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                À éviter
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-l-red-500 pl-4 py-2 bg-white rounded-r-lg">
                  <p className="font-semibold text-red-900">Critiques publiques</p>
                  <p className="text-sm text-red-700">Ne jamais embarrasser quelqu'un devant les autres</p>
                </div>
                <div className="border-l-4 border-l-red-500 pl-4 py-2 bg-white rounded-r-lg">
                  <p className="font-semibold text-red-900">Impatience visible</p>
                  <p className="text-sm text-red-700">La colère fait perdre la face à tout le monde</p>
                </div>
                <div className="border-l-4 border-l-red-500 pl-4 py-2 bg-white rounded-r-lg">
                  <p className="font-semibold text-red-900">Arrogance</p>
                  <p className="text-sm text-red-700">Évitez de vous positionner comme "supérieur"</p>
                </div>
                <div className="border-l-4 border-l-red-500 pl-4 py-2 bg-white rounded-r-lg">
                  <p className="font-semibold text-red-900">Ignorer les fêtes</p>
                  <p className="text-sm text-red-700">Les événements d'entreprise sont importants pour la cohésion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Démarches Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Démarches pour être embauché</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Le processus complet prend généralement 2 à 4 mois. Votre employeur gère la plupart des démarches.
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
                    <h4 className="font-bold text-blue-900 mb-2">Offre d'emploi</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Trouvez un employeur prêt à vous sponsoriser. L'entreprise doit avoir les moyens
                      et l'autorisation d'embaucher des étrangers.
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-blue-600 font-medium">Variable (1-3 mois de recherche)</span>
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
                    <h4 className="font-bold text-green-900 mb-2">Demande AEP (DOLE)</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Votre employeur dépose la demande d'Alien Employment Permit auprès du Department of Labor
                      and Employment (DOLE).
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">2-3 semaines</span>
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
                  <div className="w-0.5 h-full bg-gradient-to-b from-purple-500 to-amber-500 my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-2">Visa de travail 9(G)</h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Une fois l'AEP obtenu, demande du visa de travail 9(G) au Bureau of Immigration.
                      Validité : 1 à 3 ans, renouvelable.
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="text-xs text-purple-600 font-medium">4-8 semaines</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-2">ACR I-Card</h4>
                    <p className="text-sm text-amber-700 mb-3">
                      Obtention de votre carte de résident étranger, nécessaire pour ouvrir un compte bancaire
                      et autres démarches administratives.
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-xs text-amber-600 font-medium">1-2 semaines</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PWP Info Box */}
            <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-100 rounded-full">
                  <Zap className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <h4 className="font-bold text-cyan-900 mb-1">Option express : PWP (Provisional Work Permit)</h4>
                  <p className="text-sm text-cyan-700">
                    Si vous devez commencer à travailler avant l'obtention du 9(G), un permis provisoire (PWP)
                    peut être obtenu plus rapidement. Validité : 3 mois, renouvelable une fois.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Entreprises qui recrutent */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Entreprises qui recrutent des expatriés</h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-900">BPO / Services</h3>
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200">Accenture</span>
                <span className="inline-block px-3 py-1 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200 ml-2">Concentrix</span>
                <span className="inline-block px-3 py-1 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200">Telus Int.</span>
                <span className="inline-block px-3 py-1 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200 ml-2">TaskUs</span>
                <span className="inline-block px-3 py-1 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200">Alorica</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-green-900">Tech / Digital</h3>
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-white text-green-700 rounded-lg text-sm font-medium border border-green-200">Google</span>
                <span className="inline-block px-3 py-1 bg-white text-green-700 rounded-lg text-sm font-medium border border-green-200 ml-2">Meta</span>
                <span className="inline-block px-3 py-1 bg-white text-green-700 rounded-lg text-sm font-medium border border-green-200">Grab</span>
                <span className="inline-block px-3 py-1 bg-white text-green-700 rounded-lg text-sm font-medium border border-green-200 ml-2">Maya</span>
                <span className="inline-block px-3 py-1 bg-white text-green-700 rounded-lg text-sm font-medium border border-green-200">Canva PH</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-purple-900">Finance / Conseil</h3>
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-white text-purple-700 rounded-lg text-sm font-medium border border-purple-200">JPMorgan</span>
                <span className="inline-block px-3 py-1 bg-white text-purple-700 rounded-lg text-sm font-medium border border-purple-200 ml-2">HSBC</span>
                <span className="inline-block px-3 py-1 bg-white text-purple-700 rounded-lg text-sm font-medium border border-purple-200">McKinsey</span>
                <span className="inline-block px-3 py-1 bg-white text-purple-700 rounded-lg text-sm font-medium border border-purple-200 ml-2">Deloitte</span>
                <span className="inline-block px-3 py-1 bg-white text-purple-700 rounded-lg text-sm font-medium border border-purple-200">EY / PwC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h3 className="text-xl font-semibold text-center mb-6">Continuer votre exploration</h3>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link
              href="/vivre-aux-philippines/travailler/creer-entreprise"
              className="group flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-orange-900">Créer son entreprise</div>
                <div className="text-sm text-orange-600">Entrepreneuriat aux Philippines</div>
              </div>
              <ChevronRight className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors" />
            </Link>

            <Link
              href="/vivre-aux-philippines/visas-et-formalites"
              className="group flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-blue-900">Guide des visas</div>
                <div className="text-sm text-blue-600">Toutes les options légales</div>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default EmploiSalariePage;
