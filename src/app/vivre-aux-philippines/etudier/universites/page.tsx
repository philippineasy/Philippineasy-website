import { Metadata } from 'next';
import { GraduationCap, FileText, Globe, Award, CheckCircle, ExternalLink, ChevronRight, Clock, DollarSign, BookOpen, Info, TrendingUp, MapPin, Home, Utensils, Bus, Smartphone, Building2 } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Étudier aux Philippines en 2026 : Universités, Programmes et Visa 9F | Philippineasy",
  description: "Guide complet pour étudier aux Philippines : meilleures universités (UP, Ateneo, DLSU), frais de scolarité, visa étudiant 9F, programmes en anglais 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/etudier/universites',
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
    title: "Étudier aux Philippines en 2026 : Universités, Programmes et Visa 9F",
    description: "Guide complet pour étudier aux Philippines : meilleures universités, frais de scolarité, visa étudiant, programmes en anglais.",
    url: 'https://philippineasy.com/vivre-aux-philippines/etudier/universites',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Étudier aux Philippines en 2026",
    description: "Guide : universités philippines, frais, visa étudiant 9F.",
    site: '@philippineasy',
  },
};

const UniversitesPage = () => {
  return (
    <div className="bg-white">
      <HeroThematic
        titlePart1="Étudier aux"
        titlePart2="Philippines"
        subtitle="Un enseignement de qualité en anglais, des frais abordables et une expérience culturelle unique pour les étudiants internationaux."
        imageUrl="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12">

        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-16">
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Les Philippines sont une destination de plus en plus prisée par les étudiants internationaux,
            grâce à des programmes enseignés en anglais, des frais de scolarité compétitifs et un coût
            de la vie abordable. En 2026, <strong>35 universités philippines</strong> figurent dans le classement QS Asia,
            avec l'Université des Philippines en tête.
          </p>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">35</p>
              <p className="text-sm text-gray-600">Universités classées QS Asia</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-3xl font-bold text-green-600">3ème</p>
              <p className="text-sm text-gray-600">Pays anglophone mondial</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
              <p className="text-3xl font-bold text-amber-600">€320</p>
              <p className="text-sm text-gray-600">Budget mensuel min.</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p className="text-3xl font-bold text-purple-600">1908</p>
              <p className="text-sm text-gray-600">Fondation UP Diliman</p>
            </div>
          </div>
        </section>

        {/* Info box - Programmes en anglais */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="p-2 bg-blue-100 rounded-full">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Programmes en Anglais</h3>
              <p className="text-gray-600">
                La quasi-totalité des programmes universitaires aux Philippines sont enseignés en anglais.
                Le pays est le 3ème plus grand pays anglophone au monde. Aucun test d'anglais formel n'est
                généralement requis pour les étudiants venant de pays anglophones ou ayant suivi un cursus
                en anglais.
              </p>
            </div>
          </div>
        </section>

        {/* Rankings 2026 */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Classements Internationaux 2026</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Position des principales universités philippines dans les rankings QS et Times Higher Education.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {/* UP */}
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 font-bold text-lg">1</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">University of the Philippines</h3>
                <p className="text-sm text-gray-500">Publique • 8 campus nationaux</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">QS #362</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Asia #104</span>
              </div>
            </div>

            {/* Ateneo */}
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">2</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">Ateneo de Manila University</h3>
                <p className="text-sm text-gray-500">Privée Jésuite • Quezon City</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">QS #511</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Asia #141</span>
              </div>
            </div>

            {/* DLSU */}
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 font-bold text-lg">3</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">De La Salle University</h3>
                <p className="text-sm text-gray-500">Privée Lasallienne • Manila</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">QS #654</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Asia #178</span>
              </div>
            </div>

            {/* UST */}
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-700 font-bold text-lg">4</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">University of Santo Tomas</h3>
                <p className="text-sm text-gray-500">Plus ancienne d'Asie (1611) • Manila</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">QS 851-900</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Asia #184</span>
              </div>
            </div>
          </div>
        </section>

        {/* Big Three */}
        <section className="mb-16 bg-gray-50 -mx-4 px-4 py-12 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Le "Big Three" des Universités</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les trois universités les plus prestigieuses des Philippines, chacune avec son identité et ses forces distinctes.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* UP */}
            <div className="bg-white rounded-xl border-l-4 border-l-green-500 shadow-sm overflow-hidden">
              <div className="p-5 border-b bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold">University of the Philippines</h3>
                </div>
                <p className="text-sm text-gray-500">Publique • Fondée en 1908</p>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  Le système universitaire national avec 8 campus à travers le pays. UP Diliman (Quezon City)
                  est le plus prestigieux et le plus grand.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sciences, Droit, Arts, Médecine</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Frais les plus bas du Big Three</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Réseau alumni très influent</span>
                  </li>
                </ul>
                <div className="bg-gray-100 p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ₱1,000-2,000/unité (internationaux paient plus)</p>
                </div>
                <a
                  href="https://www.up.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-700 hover:underline text-sm font-medium"
                >
                  up.edu.ph <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* Ateneo */}
            <div className="bg-white rounded-xl border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
              <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold">Ateneo de Manila University</h3>
                </div>
                <p className="text-sm text-gray-500">Privée Jésuite • Fondée en 1859</p>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  Université privée jésuite à Quezon City, connue pour son excellence en sciences humaines,
                  business et son campus verdoyant et moderne.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Business, Droit, Sciences Sociales</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>#1 THE Rankings Philippines</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Communauté étudiante active</span>
                  </li>
                </ul>
                <div className="bg-gray-100 p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ~₱5,200/unité (~₱104,000/semestre)</p>
                </div>
                <a
                  href="https://www.ateneo.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-700 hover:underline text-sm font-medium"
                >
                  ateneo.edu <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* DLSU */}
            <div className="bg-white rounded-xl border-l-4 border-l-green-500 shadow-sm overflow-hidden">
              <div className="p-5 border-b bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold">De La Salle University</h3>
                </div>
                <p className="text-sm text-gray-500">Privée Lasallienne • Fondée en 1911</p>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  Université catholique au cœur de Manille (Taft Avenue), leader en ingénierie,
                  informatique et commerce.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Ingénierie, IT, Commerce</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Recherche et publications</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Liens forts avec l'industrie</span>
                  </li>
                </ul>
                <div className="bg-gray-100 p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ₱160,000-200,000/an</p>
                </div>
                <a
                  href="https://www.dlsu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-700 hover:underline text-sm font-medium"
                >
                  dlsu.edu.ph <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Autres universités */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Autres Universités Reconnues</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des alternatives de qualité avec des spécialités variées et des frais plus accessibles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">University of Santo Tomas</h3>
                <p className="text-sm text-gray-600 mb-2">Plus ancienne université d'Asie (1611). Excellence en Médecine et Architecture.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">₱100,000-150,000/an</span>
                  <span className="text-xs text-gray-500">Manila</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Mapua University</h3>
                <p className="text-sm text-gray-600 mb-2">Leader en ingénierie et technologie. Campus moderne à Makati et Intramuros.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">₱80,000-120,000/an</span>
                  <span className="text-xs text-gray-500">Manila/Makati</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Silliman University</h3>
                <p className="text-sm text-gray-600 mb-2">Environnement paisible à Dumaguete, excellent pour les sciences marines.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">₱60,000-120,000/an</span>
                  <span className="text-xs text-gray-500">Dumaguete</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">University of San Carlos</h3>
                <p className="text-sm text-gray-600 mb-2">Bonne réputation en commerce et sciences. Cadre de vie agréable à Cebu.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">₱50,000-100,000/an</span>
                  <span className="text-xs text-gray-500">Cebu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Frais de scolarité */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Frais de Scolarité par Catégorie</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comparatif des coûts selon le type d'établissement. Les étudiants internationaux paient généralement 20-50% de plus.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* Public */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-green-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Universités Publiques</h3>
                    <p className="text-sm text-gray-500">UP System, PUP, etc.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₱20,000-60,000</p>
                    <p className="text-sm text-gray-500">€320-960/an</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mid-range */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-blue-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Privées Mid-Range</h3>
                    <p className="text-sm text-gray-500">Silliman, San Carlos, Mapua</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">₱60,000-120,000</p>
                    <p className="text-sm text-gray-500">€960-1,920/an</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-purple-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Privées Premium</h3>
                    <p className="text-sm text-gray-500">Ateneo, DLSU, UST</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">₱150,000-250,000</p>
                    <p className="text-sm text-gray-500">€2,400-4,000/an</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-purple-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medicine */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-red-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Programmes Médecine/Dentaire</h3>
                    <p className="text-sm text-gray-500">UST, UP, DLSU</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">₱200,000-400,000</p>
                    <p className="text-sm text-gray-500">€3,200-6,400/an</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-red-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            * Conversion : 1€ ≈ ₱62.5
          </p>
        </section>

        {/* Visa étudiant */}
        <section className="mb-16 bg-gray-50 -mx-4 px-4 py-12 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Visa Étudiant 9(F)</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Le visa 9(F) est obligatoire pour les études supérieures de plus de 30 jours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
            {/* Conditions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Conditions d'Éligibilité</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>18 ans minimum à l'inscription</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Acceptation d'une université accréditée CHED</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Preuve de moyens financiers suffisants</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Casier judiciaire vierge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Certificat médical</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Documents Requis</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Lettre d'acceptation de l'université</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Passeport valide 6+ mois</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Formulaire FA-2 + Personal History Statement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Relevés bancaires / affidavit de support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Transcripts authentifiés par l'ambassade</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats visa */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-3 divide-x">
              <div className="text-center px-4">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Délai</p>
                <p className="text-primary font-bold">2-8 semaines</p>
                <p className="text-xs text-gray-500">Commencer 3 mois avant</p>
              </div>
              <div className="text-center px-4">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Frais</p>
                <p className="text-primary font-bold">US$250-400</p>
                <p className="text-xs text-gray-500">Selon nationalité</p>
              </div>
              <div className="text-center px-4">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Validité</p>
                <p className="text-primary font-bold">1 an renouvelable</p>
                <p className="text-xs text-gray-500">ACR I-Card requis après arrivée</p>
              </div>
            </div>
          </div>
        </section>

        {/* Processus admission - Timeline */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Processus d'Admission</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les étapes clés pour intégrer une université philippine en tant qu'étudiant international.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 md:left-1/2 md:-translate-x-0.5"></div>

              {/* Step 1 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  1
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Recherche et Candidature</h3>
                  <p className="text-gray-600 text-sm">
                    Identifiez les programmes qui vous intéressent et vérifiez les dates limites.
                    Soumettez votre dossier en ligne avec transcripts, lettre de motivation et recommandations.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center md:flex-row-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  2
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-grow md:w-[calc(50%-40px)] md:mr-0 md:ml-auto">
                  <h3 className="font-semibold text-lg mb-2">Tests et Entretien</h3>
                  <p className="text-gray-600 text-sm">
                    Certaines universités exigent un test d'entrée (ACET pour Ateneo, DCAT pour DLSU, UPCAT pour UP).
                    Un test d'anglais peut être requis.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  3
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Lettre d'Acceptation</h3>
                  <p className="text-gray-600 text-sm">
                    Une fois accepté, vous recevez une lettre officielle. L'université initie ensuite
                    votre demande de visa auprès de la CHED et du DFA.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center md:flex-row-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  4
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-grow md:w-[calc(50%-40px)] md:mr-0 md:ml-auto">
                  <h3 className="font-semibold text-lg mb-2">Demande de Visa 9(F)</h3>
                  <p className="text-gray-600 text-sm">
                    Déposez votre demande à l'ambassade des Philippines avec tous les documents.
                    Vous pouvez aussi entrer avec un visa touriste et convertir sur place.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start gap-6 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  5
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Arrivée et Enregistrement</h3>
                  <p className="text-gray-600 text-sm">
                    À votre arrivée, enregistrez-vous au Bureau of Immigration pour obtenir votre ACR I-Card.
                    Finalisez votre inscription à l'université.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coût de la vie */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Budget Étudiant Mensuel</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estimation du coût de la vie pour un étudiant à Metro Manila (hors frais de scolarité).
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="divide-y">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Logement</p>
                      <p className="text-sm text-gray-500">Chambre ou studio près du campus</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱8,000-20,000</p>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Utensils className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Nourriture</p>
                      <p className="text-sm text-gray-500">Cantine, restaurants, courses</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱6,000-12,000</p>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Bus className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Transport</p>
                      <p className="text-sm text-gray-500">Jeepney, MRT, Grab</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱2,000-5,000</p>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Téléphone et Internet</p>
                      <p className="text-sm text-gray-500">Forfait data + WiFi</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱1,000-2,000</p>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Livres et fournitures</p>
                      <p className="text-sm text-gray-500">Par semestre (lissé/mois)</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱500-1,000</p>
                </div>
              </div>

              <div className="bg-primary/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Budget mensuel total</p>
                    <p className="text-sm text-gray-600">Hors frais de scolarité</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₱20,000-40,000</p>
                    <p className="text-sm text-gray-600">≈ €320-640/mois</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ressources */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Ressources Officielles</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            <a
              href="https://ched.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <span className="font-medium">CHED (Commission on Higher Ed)</span>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
            <a
              href="https://immigration.gov.ph/student-visa-9f/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <span className="font-medium">Bureau of Immigration</span>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
            <a
              href="https://www.topuniversities.com/asia-university-rankings?countries=ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <span className="font-medium">QS Rankings Philippines</span>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
            <a
              href="https://www.up.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <span className="font-medium">University of the Philippines</span>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
            <a
              href="https://www.ateneo.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <span className="font-medium">Ateneo de Manila</span>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
            <a
              href="https://www.dlsu.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <span className="font-medium">De La Salle University</span>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/vivre-aux-philippines/etudier/ecoles-internationales"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all group"
            >
              <span className="font-medium">Écoles Internationales</span>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/vivre-aux-philippines/s-installer/visas"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all group"
            >
              <span className="font-medium">Visas et Permis</span>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/vivre-aux-philippines/s-installer/logement"
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all group"
            >
              <span className="font-medium">Trouver un Logement</span>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UniversitesPage;
