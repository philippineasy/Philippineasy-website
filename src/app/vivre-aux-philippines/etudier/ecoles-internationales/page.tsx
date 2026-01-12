import { Metadata } from 'next';
import { School, BookOpen, DollarSign, MapPin, Globe, Users, Award, FileCheck, GraduationCap, Languages, Shield, Building2, ExternalLink, ChevronRight, CheckCircle, Star, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Écoles Internationales aux Philippines en 2026 : Guide Complet | Philippineasy",
  description: "Guide complet des écoles internationales aux Philippines en 2026 : ISM, BSM, Brent, Nord Anglia. Frais de scolarité, curricula IB et britannique, admission et visas pour enfants d'expatriés.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/etudier/ecoles-internationales',
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
    title: "Écoles Internationales aux Philippines en 2026 : Guide Complet",
    description: "Guide complet des écoles internationales aux Philippines : ISM, BSM, Brent, Nord Anglia. Frais de scolarité, curricula et admission.",
    url: 'https://philippineasy.com/vivre-aux-philippines/etudier/ecoles-internationales',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Écoles Internationales aux Philippines en 2026",
    description: "Guide complet des écoles internationales aux Philippines : ISM, BSM, Brent, Nord Anglia, frais et admission.",
    site: '@philippineasy',
  },
};

const EcolesInternationalesPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Les Écoles"
        titlePart2="Internationales"
        subtitle="Offrez à vos enfants une éducation de classe mondiale dans un environnement multiculturel aux Philippines."
        imageUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Introduction avec stats */}
        <section className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-muted-foreground mb-8">
            Les Philippines comptent parmi les destinations asiatiques les plus attractives pour les familles expatriées
            en matière d'éducation. Avec une vingtaine d'écoles internationales accréditées, principalement à Metro Manila,
            les enfants bénéficient d'un enseignement de qualité mondiale préparant aux meilleures universités.
          </p>

          {/* Stats boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl p-4 text-center border border-violet-200">
              <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <School className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-violet-700">20+</p>
              <p className="text-sm text-violet-600">Écoles accréditées</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-700">50+</p>
              <p className="text-sm text-blue-600">Nationalités</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-700">15-22</p>
              <p className="text-sm text-green-600">Élèves/classe</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center border border-amber-200">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-amber-700">6-24K€</p>
              <p className="text-sm text-amber-600">Scolarité/an</p>
            </div>
          </div>
        </section>

        {/* Avantages clés */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Pourquoi Choisir une École Internationale ?</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Une éducation de qualité mondiale pour préparer vos enfants aux meilleures universités
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl border-l-4 border-l-violet-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="font-bold text-lg">Curricula Internationaux</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">IB</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">AP</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">IGCSE</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">Français</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Programmes IB (PYP, MYP, DP), américain (AP), britannique (IGCSE, A-Levels) et français (AEFE).
              </p>
            </div>

            <div className="bg-white rounded-xl border-l-4 border-l-blue-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg">Environnement Multiculturel</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                40 à 60 nationalités par école. À ISM, plus de 50 nationalités parmi 2 200 élèves.
                Ouverture d'esprit et maîtrise de plusieurs langues.
              </p>
            </div>

            <div className="bg-white rounded-xl border-l-4 border-l-green-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-lg">Classes Réduites</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                15 à 22 élèves maximum par classe. Enseignants internationaux hautement qualifiés.
                Suivi personnalisé garanti.
              </p>
            </div>

            <div className="bg-white rounded-xl border-l-4 border-l-amber-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg">Accréditations</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">CIS</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">WASC</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">IBO</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Seules 22% des écoles internationales dans le monde obtiennent ces accréditations prestigieuses.
              </p>
            </div>

            <div className="bg-white rounded-xl border-l-4 border-l-rose-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-rose-600" />
                </div>
                <h3 className="font-bold text-lg">Localisation</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Majoritairement à Metro Manila : BGC, Makati, Parañaque, Alabang.
                Accès facile depuis les quartiers d'expatriés.
              </p>
            </div>

            <div className="bg-white rounded-xl border-l-4 border-l-indigo-500 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg">Débouchés</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Accès aux meilleures universités mondiales. À ISM, 60% poursuivent aux USA,
                les autres en Europe, Australie et Asie.
              </p>
            </div>
          </div>
        </section>

        {/* Principales écoles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Principales Écoles à Metro Manila</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Les établissements les plus réputés pour l'éducation internationale
          </p>

          <div className="space-y-6 max-w-5xl mx-auto">
            {/* ISM */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-300 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">International School Manila (ISM)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">Plus ancienne d'Asie SE</span>
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">Depuis 1920</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-blue-800 mb-4">
                    Première école en Asie à proposer le programme IB Diploma. Située à BGC,
                    elle accueille plus de 2 200 élèves de 50+ nationalités.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span><strong>Curricula:</strong> IB + AP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span><strong>Langues:</strong> 7 langues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span><strong>Accréditations:</strong> WASC, CIS, IBO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span><strong>Lieu:</strong> BGC, Taguig</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-white/80 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-blue-700">Candidature</span>
                      <span className="font-semibold">$600</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-blue-700">Matriculation</span>
                      <span className="font-semibold">$4,500</span>
                    </li>
                    <li className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-blue-900 font-medium">Scolarité/an</span>
                      <span className="font-bold text-blue-600">~24,000€</span>
                    </li>
                  </ul>
                  <a href="https://www.ismanila.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* BSM */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-300 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-900">British School Manila (BSM)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">Curriculum UK</span>
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full">Depuis 1976</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-red-800 mb-4">
                    Éducation britannique de premier plan à BGC. Plus de 1 000 élèves de 40+ nationalités.
                    Excellence académique et responsabilité sociale.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span><strong>Curricula:</strong> British + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span><strong>Âges:</strong> 3 à 18 ans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span><strong>Accréditations:</strong> CIS, COBIS, IBO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span><strong>Lieu:</strong> BGC, Taguig</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-white/80 rounded-xl p-4 border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-red-700">Nursery-Y2</span>
                      <span className="font-semibold">10-15K€</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-red-700">Y3-Y9</span>
                      <span className="font-semibold">~17K€</span>
                    </li>
                    <li className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-red-900 font-medium">Y10-Y13</span>
                      <span className="font-bold text-red-600">~22,500€</span>
                    </li>
                  </ul>
                  <a href="https://www.britishschoolmanila.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-800">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Nord Anglia */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border-2 border-purple-300 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-900">Nord Anglia (NAIS Manila)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">Réseau mondial</span>
                        <span className="px-2 py-0.5 bg-violet-500 text-white text-xs rounded-full">MIT + Juilliard</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-purple-800 mb-4">
                    Partie du réseau mondial Nord Anglia (80+ écoles). Collaborations exclusives
                    avec le MIT (STEAM) et la Juilliard School (arts).
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span><strong>Curricula:</strong> British + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span><strong>Âges:</strong> 2 à 18 ans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span><strong>Spécialité:</strong> STEAM, Arts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span><strong>Lieu:</strong> Parañaque</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-white/80 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-purple-700">1ère année (2 ans)</span>
                      <span className="font-semibold">~16,400€</span>
                    </li>
                    <li className="text-xs text-purple-600 mt-2">
                      Frais progressifs selon niveau. Inclut inscription et matériel.
                    </li>
                  </ul>
                  <a href="https://www.nordangliaeducation.com/nais-manila" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-800">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Brent */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-900">Brent International School</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">American</span>
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">Internat dispo</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-green-800 mb-4">
                    Trois campus aux Philippines : Manila (Laguna), Subic et Baguio.
                    Excellentes infrastructures sportives. Option d'internat disponible.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>Curricula:</strong> American + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>Élèves:</strong> 1000+ de 30+ pays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>Spécialité:</strong> Sports, Boarding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>Lieu:</strong> Biñan, Laguna</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-white/80 rounded-xl p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-green-700">Scolarité/an</span>
                      <span className="font-semibold">10-21K€</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-green-700">1ère année (3 ans)</span>
                      <span className="font-semibold">~11,100€</span>
                    </li>
                  </ul>
                  <a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 hover:text-green-800">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* EIS/GESM */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-300 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-amber-900">European International School / GESM</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Français</span>
                        <span className="px-2 py-0.5 bg-amber-600 text-white text-xs rounded-full">Allemand</span>
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">Eurocampus</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-amber-800 mb-4">
                    "Eurocampus" unique regroupant le GESM et le Lycée Français de Manille.
                    Premier des sept Eurocampus dans le monde. Idéal pour familles européennes.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      <span><strong>Curricula:</strong> FR, DE, IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      <span><strong>Langues:</strong> FR, DE, EN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      <span><strong>Accréditations:</strong> AEFE, ZfA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      <span><strong>Lieu:</strong> Parañaque</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-white/80 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-amber-700">Kindergarten</span>
                      <span className="font-semibold">~6,500€</span>
                    </li>
                    <li className="text-xs text-amber-600 mt-2">
                      Paiement mixte EUR + PHP. Plus abordable que les écoles anglo-saxonnes.
                    </li>
                  </ul>
                  <a href="https://www.gesm.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-amber-600 hover:text-amber-800">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Écoles hors Manila */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Écoles Hors de Metro Manila</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-cyan-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="font-bold text-lg">Cebu International School</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Fondée en 1924 à Cebu City. IB World School (PYP, MYP, DP).
                Accréditée CIS, WASC et PAASCU.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-700 font-medium">14,200 - 25,000€/an</span>
                <a href="https://cis.edu.ph/" target="_blank" rel="noopener noreferrer"
                   className="text-cyan-600 hover:text-cyan-800 flex items-center gap-1">
                  Site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-teal-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-bold text-lg">Singapore School Cebu</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Unique école à Cebu offrant Cambridge IGCSE + IB Diploma.
                Curriculum singapourien avec emphase STEM.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-700 font-medium">Preschool → Pre-University</span>
                <a href="https://www.singaporeschoolcebu.com/" target="_blank" rel="noopener noreferrer"
                   className="text-teal-600 hover:text-teal-800 flex items-center gap-1">
                  Site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tableau comparatif */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Comparatif des Frais 2025-2026</h2>
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <div className="overflow-hidden rounded-2xl border-2 border-gray-200 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
                    <th className="p-4 text-left font-semibold">École</th>
                    <th className="p-4 text-left font-semibold">Localisation</th>
                    <th className="p-4 text-center font-semibold">Curricula</th>
                    <th className="p-4 text-right font-semibold">Scolarité/an</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50 border-b border-blue-100">
                    <td className="p-4 font-semibold text-blue-900">ISM</td>
                    <td className="p-4 text-blue-700">BGC, Taguig</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">IB</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full ml-1">AP</span>
                    </td>
                    <td className="p-4 text-right font-bold text-blue-600">~24,000€</td>
                  </tr>
                  <tr className="bg-red-50 border-b border-red-100">
                    <td className="p-4 font-semibold text-red-900">BSM</td>
                    <td className="p-4 text-red-700">BGC, Taguig</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">British</span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-red-600">10-22,500€</td>
                  </tr>
                  <tr className="bg-purple-50 border-b border-purple-100">
                    <td className="p-4 font-semibold text-purple-900">NAIS Manila</td>
                    <td className="p-4 text-purple-700">Parañaque</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">British</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-purple-600">~16,400€+</td>
                  </tr>
                  <tr className="bg-green-50 border-b border-green-100">
                    <td className="p-4 font-semibold text-green-900">Brent Manila</td>
                    <td className="p-4 text-green-700">Biñan, Laguna</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">American</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-green-600">10-20,700€</td>
                  </tr>
                  <tr className="bg-amber-50 border-b border-amber-100">
                    <td className="p-4 font-semibold text-amber-900">EIS/GESM</td>
                    <td className="p-4 text-amber-700">Parañaque</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">FR</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full ml-1">DE</span>
                      <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-amber-600">~6,500€+</td>
                  </tr>
                  <tr className="bg-cyan-50">
                    <td className="p-4 font-semibold text-cyan-900">CIS Cebu</td>
                    <td className="p-4 text-cyan-700">Cebu City</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-cyan-600">14-25,000€</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              * Tarifs indicatifs 2025-2026. Conversion : 1€ ≈ 58 PHP. Frais additionnels possibles.
            </p>
          </div>
        </section>

        {/* Visa pour enfants */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Visa pour les Enfants d'Expatriés</h2>

          {/* Bonne nouvelle */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-green-900">Bonne nouvelle pour les expatriés</h3>
                  <p className="text-green-800">
                    Les enfants mineurs (moins de 21 ans, non mariés) de titulaires de certains visas sont
                    <strong> exemptés</strong> du visa étudiant 9(f). Ils peuvent étudier avec un
                    <strong> visa de dépendant</strong> lié au visa principal du parent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Exemptés */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-white" />
                </div>
                Enfants exemptés du visa étudiant
              </h3>
              <p className="text-sm text-green-700 mb-3">Enfants des titulaires de ces visas :</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm"><strong>9(g)</strong> - Visa de travail</span>
                </li>
                <li className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm"><strong>9(d)</strong> - Diplomatique/consulaire</span>
                </li>
                <li className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm"><strong>SIRV</strong> - Special Investor's Visa</span>
                </li>
                <li className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm"><strong>SRRV</strong> - Special Retiree's Visa</span>
                </li>
              </ul>
            </div>

            {/* Visa 9(f) */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-800">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-white" />
                </div>
                Visa étudiant 9(f) - Si nécessaire
              </h3>
              <p className="text-sm text-amber-700 mb-3">Pour étudiants 18+ ans ou sans visa parent éligible :</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">Lettre d'admission de l'école</span>
                </li>
                <li className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">Passeport valide 6+ mois</span>
                </li>
                <li className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">Preuve de moyens financiers</span>
                </li>
                <li className="flex items-center gap-2 bg-white/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">Frais : ~₱3,000-5,000</span>
                </li>
              </ul>
            </div>
          </div>

          {/* WEG Warning */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Enfants de moins de 15 ans voyageant seuls</h4>
                  <p className="text-sm text-red-800">
                    Un <strong>Waiver of Exclusion Ground (WEG)</strong> est requis pour les enfants non accompagnés.
                    À obtenir auprès de l'ambassade des Philippines avant le voyage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Processus d'admission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Processus d'Admission</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-purple-500 to-indigo-500 hidden md:block"></div>

              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">1</div>
                  <div className="flex-1 bg-violet-50 rounded-xl p-5 border border-violet-200">
                    <h3 className="font-semibold text-lg text-violet-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Recherche et visite (6-12 mois avant)
                    </h3>
                    <p className="text-violet-700 mt-2">
                      Contactez les écoles pour visites et portes ouvertes.
                      ISM et BSM ont des listes d'attente pour les niveaux 6-10.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">2</div>
                  <div className="flex-1 bg-purple-50 rounded-xl p-5 border border-purple-200">
                    <h3 className="font-semibold text-lg text-purple-900 flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Constitution du dossier
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-purple-700">
                      <span>• Formulaire en ligne</span>
                      <span>• Bulletins (2-3 ans)</span>
                      <span>• Lettres de recommandation</span>
                      <span>• Passeports/visas parents</span>
                      <span>• Certificat de naissance</span>
                      <span>• Frais: $200-600</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">3</div>
                  <div className="flex-1 bg-indigo-50 rounded-xl p-5 border border-indigo-200">
                    <h3 className="font-semibold text-lg text-indigo-900 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Évaluations et entretien
                    </h3>
                    <p className="text-indigo-700 mt-2">
                      Tests d'admission (anglais, maths), évaluation du niveau scolaire,
                      entretien avec l'équipe pédagogique. Évaluations à distance possibles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">4</div>
                  <div className="flex-1 bg-blue-50 rounded-xl p-5 border border-blue-200">
                    <h3 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Décision et inscription (2-4 semaines)
                    </h3>
                    <p className="text-blue-700 mt-2">
                      En cas d'acceptation : versement du dépôt et frais de matriculation.
                      Signature du contrat d'inscription.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">5</div>
                  <div className="flex-1 bg-cyan-50 rounded-xl p-5 border border-cyan-200">
                    <h3 className="font-semibold text-lg text-cyan-900 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Préparation de la rentrée (août)
                    </h3>
                    <p className="text-cyan-700 mt-2">
                      Uniformes, fournitures, transport scolaire, journées d'orientation.
                      L'année scolaire commence généralement en août.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* EAL Support */}
            <div className="mt-8 bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center">
                  <Languages className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Support linguistique (EAL/ESL)</h3>
                  <p className="text-muted-foreground">
                    La plupart des écoles proposent des programmes <strong>English as an Additional Language</strong>.
                    À ISM : $1,625/semestre (1ère année), $1,100/semestre (2ème année).
                    Aide les enfants francophones à s'intégrer rapidement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ressources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources Officielles</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <a href="https://www.ismanila.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <School className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">ISM</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.britishschoolmanila.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
                  <School className="h-5 w-5 text-red-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">British School Manila</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.nordangliaeducation.com/nais-manila" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                  <School className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">Nord Anglia</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <School className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">Brent International</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.gesm.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                  <School className="h-5 w-5 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">GESM (Eurocampus)</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://cis.edu.ph/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-cyan-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                  <School className="h-5 w-5 text-cyan-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">CIS Cebu</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://immigration.gov.ph/student-visa-9f/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                  <FileCheck className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">Visa 9(f) - BI</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.cois.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-violet-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center group-hover:bg-violet-500 transition-colors">
                  <Award className="h-5 w-5 text-violet-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">Council of Int'l Schools</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.ibo.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-rose-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center group-hover:bg-rose-500 transition-colors">
                  <Star className="h-5 w-5 text-rose-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium">IB Organization</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/vivre-aux-philippines/etudier/universites"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-100 border-2 border-violet-200 rounded-xl hover:border-violet-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-violet-600" />
                <span className="font-medium text-violet-900">Universités aux Philippines</span>
              </div>
              <ChevronRight className="h-5 w-5 text-violet-600" />
            </Link>
            <Link href="/vivre-aux-philippines/famille"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-100 border-2 border-rose-200 rounded-xl hover:border-rose-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-rose-600" />
                <span className="font-medium text-rose-900">Guide Familles Expatriées</span>
              </div>
              <ChevronRight className="h-5 w-5 text-rose-600" />
            </Link>
            <Link href="/vivre-aux-philippines/s-installer/visas"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Visas et Permis</span>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EcolesInternationalesPage;
