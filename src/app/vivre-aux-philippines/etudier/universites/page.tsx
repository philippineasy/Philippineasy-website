import { Metadata } from 'next';
import { GraduationCap, FileText, Award, CheckCircle, ExternalLink, ChevronRight, Clock, DollarSign, BookOpen, Info, Home, Utensils, Bus, Smartphone, Building2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faGlobe, faSackDollar, faLandmark } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow } from '@/components/sections';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Étudier aux Philippines en 2026 : Universités, Programmes et Visa 9F",
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
    <>
      <PageHero
        eyebrow="Guide pratique"
        title="Étudier aux"
        titleAccent="Philippines"
        subtitle="Un enseignement de qualité en anglais, des frais abordables et une expérience culturelle unique pour les étudiants internationaux."
        imageUrl="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
        imageAlt="Étudier aux Philippines"
      />

      <div className="container mx-auto px-4 py-12">

        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-16">
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Les Philippines sont une destination de plus en plus prisée par les étudiants internationaux,
            grâce à des programmes enseignés en anglais, des frais de scolarité compétitifs et un coût
            de la vie abordable. En 2026, <strong>35 universités philippines</strong> figurent dans le classement QS Asia,
            avec l'Université des Philippines en tête.
          </p>

          {/* Stats rapides */}
          <StatRow
            stats={[
              { value: '35', label: 'Universités classées QS Asia', icon: <FontAwesomeIcon icon={faGraduationCap} className="text-[18px]" /> },
              { value: '3ème', label: 'Pays anglophone mondial', icon: <FontAwesomeIcon icon={faGlobe} className="text-[18px]" /> },
              { value: '€320', label: 'Budget mensuel min.', icon: <FontAwesomeIcon icon={faSackDollar} className="text-[18px]" /> },
              { value: '1908', label: 'Fondation UP Diliman', icon: <FontAwesomeIcon icon={faLandmark} className="text-[18px]" /> },
            ]}
          />
        </section>

        {/* Info box - Programmes en anglais */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="flex items-start gap-4 bg-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="p-2 bg-primary/15 rounded-full">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Programmes en Anglais</h3>
              <p className="text-muted-foreground">
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Position des principales universités philippines dans les rankings QS et Times Higher Education.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {/* UP */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">1</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">University of the Philippines</h3>
                <p className="text-sm text-muted-foreground">Publique • 8 campus nationaux</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">QS #362</span>
                <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Asia #104</span>
              </div>
            </div>

            {/* Ateneo */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">2</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">Ateneo de Manila University</h3>
                <p className="text-sm text-muted-foreground">Privée Jésuite • Quezon City</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">QS #511</span>
                <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Asia #141</span>
              </div>
            </div>

            {/* DLSU */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">3</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">De La Salle University</h3>
                <p className="text-sm text-muted-foreground">Privée Lasallienne • Manila</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">QS #654</span>
                <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Asia #178</span>
              </div>
            </div>

            {/* UST */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">4</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">University of Santo Tomas</h3>
                <p className="text-sm text-muted-foreground">Plus ancienne d'Asie (1611) • Manila</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">QS 851-900</span>
                <span className="px-3 py-1 bg-accent/15 text-accent-strong rounded-full text-sm font-medium">Asia #184</span>
              </div>
            </div>
          </div>
        </section>

        {/* Big Three */}
        <section className="mb-16 bg-muted -mx-4 px-4 py-12 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Le "Big Three" des Universités</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les trois universités les plus prestigieuses des Philippines, chacune avec son identité et ses forces distinctes.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* UP */}
            <div className="bg-card rounded-xl border-l-4 border-l-primary shadow-card-rest overflow-hidden">
              <div className="p-5 border-b border-border bg-background">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">University of the Philippines</h3>
                </div>
                <p className="text-sm text-muted-foreground">Publique • Fondée en 1908</p>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground mb-4">
                  Le système universitaire national avec 8 campus à travers le pays. UP Diliman (Quezon City)
                  est le plus prestigieux et le plus grand.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Sciences, Droit, Arts, Médecine</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Frais les plus bas du Big Three</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Réseau alumni très influent</span>
                  </li>
                </ul>
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ₱1,000-2,000/unité (internationaux paient plus)</p>
                </div>
                <a
                  href="https://www.up.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm font-medium"
                >
                  up.edu.ph <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* Ateneo */}
            <div className="bg-card rounded-xl border-l-4 border-l-primary shadow-card-rest overflow-hidden">
              <div className="p-5 border-b border-border bg-background">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Ateneo de Manila University</h3>
                </div>
                <p className="text-sm text-muted-foreground">Privée Jésuite • Fondée en 1859</p>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground mb-4">
                  Université privée jésuite à Quezon City, connue pour son excellence en sciences humaines,
                  business et son campus verdoyant et moderne.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Business, Droit, Sciences Sociales</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>#1 THE Rankings Philippines</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Communauté étudiante active</span>
                  </li>
                </ul>
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ~₱5,200/unité (~₱104,000/semestre)</p>
                </div>
                <a
                  href="https://www.ateneo.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm font-medium"
                >
                  ateneo.edu <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* DLSU */}
            <div className="bg-card rounded-xl border-l-4 border-l-primary shadow-card-rest overflow-hidden">
              <div className="p-5 border-b border-border bg-background">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">De La Salle University</h3>
                </div>
                <p className="text-sm text-muted-foreground">Privée Lasallienne • Fondée en 1911</p>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground mb-4">
                  Université catholique au cœur de Manille (Taft Avenue), leader en ingénierie,
                  informatique et commerce.
                </p>
                <p className="text-sm font-semibold mb-2">Forces :</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Ingénierie, IT, Commerce</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Recherche et publications</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Liens forts avec l'industrie</span>
                  </li>
                </ul>
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <p className="text-sm"><strong>Frais :</strong> ₱160,000-200,000/an</p>
                </div>
                <a
                  href="https://www.dlsu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm font-medium"
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des alternatives de qualité avec des spécialités variées et des frais plus accessibles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">University of Santo Tomas</h3>
                <p className="text-sm text-muted-foreground mb-2">Plus ancienne université d'Asie (1611). Excellence en Médecine et Architecture.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">₱100,000-150,000/an</span>
                  <span className="text-xs text-muted-foreground">Manila</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Mapua University</h3>
                <p className="text-sm text-muted-foreground mb-2">Leader en ingénierie et technologie. Campus moderne à Makati et Intramuros.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">₱80,000-120,000/an</span>
                  <span className="text-xs text-muted-foreground">Manila/Makati</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Silliman University</h3>
                <p className="text-sm text-muted-foreground mb-2">Environnement paisible à Dumaguete, excellent pour les sciences marines.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">₱60,000-120,000/an</span>
                  <span className="text-xs text-muted-foreground">Dumaguete</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-card transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">University of San Carlos</h3>
                <p className="text-sm text-muted-foreground mb-2">Bonne réputation en commerce et sciences. Cadre de vie agréable à Cebu.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">₱50,000-100,000/an</span>
                  <span className="text-xs text-muted-foreground">Cebu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Frais de scolarité */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Frais de Scolarité par Catégorie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comparatif des coûts selon le type d'établissement. Les étudiants internationaux paient généralement 20-50% de plus.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* Public */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-primary/35 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Universités Publiques</h3>
                    <p className="text-sm text-muted-foreground">UP System, PUP, etc.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₱20,000-60,000</p>
                    <p className="text-sm text-muted-foreground">€320-960/an</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-primary/35"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mid-range */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-primary/55 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Privées Mid-Range</h3>
                    <p className="text-sm text-muted-foreground">Silliman, San Carlos, Mapua</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₱60,000-120,000</p>
                    <p className="text-sm text-muted-foreground">€960-1,920/an</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-primary/55"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-primary/75 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Privées Premium</h3>
                    <p className="text-sm text-muted-foreground">Ateneo, DLSU, UST</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₱150,000-250,000</p>
                    <p className="text-sm text-muted-foreground">€2,400-4,000/an</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-primary/75"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medicine */}
            <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Programmes Médecine/Dentaire</h3>
                    <p className="text-sm text-muted-foreground">UST, UP, DLSU</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₱200,000-400,000</p>
                    <p className="text-sm text-muted-foreground">€3,200-6,400/an</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-full h-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            * Conversion : 1€ ≈ ₱62.5
          </p>
        </section>

        {/* Visa étudiant */}
        <section className="mb-16 bg-muted -mx-4 px-4 py-12 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Visa Étudiant 9(F)</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Le visa 9(F) est obligatoire pour les études supérieures de plus de 30 jours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
            {/* Conditions */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-background flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Conditions d'Éligibilité</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>18 ans minimum à l'inscription</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Acceptation d'une université accréditée CHED</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Preuve de moyens financiers suffisants</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Casier judiciaire vierge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Certificat médical</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-background flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Documents Requis</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Lettre d'acceptation de l'université</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Passeport valide 6+ mois</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Formulaire FA-2 + Personal History Statement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Relevés bancaires / affidavit de support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Transcripts authentifiés par l'ambassade</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats visa */}
          <div className="bg-card rounded-xl border border-border p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="text-center px-4">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Délai</p>
                <p className="text-primary font-bold">2-8 semaines</p>
                <p className="text-xs text-muted-foreground">Commencer 3 mois avant</p>
              </div>
              <div className="text-center px-4">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Frais</p>
                <p className="text-primary font-bold">US$250-400</p>
                <p className="text-xs text-muted-foreground">Selon nationalité</p>
              </div>
              <div className="text-center px-4">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Validité</p>
                <p className="text-primary font-bold">1 an renouvelable</p>
                <p className="text-xs text-muted-foreground">ACR I-Card requis après arrivée</p>
              </div>
            </div>
          </div>
        </section>

        {/* Processus admission - Timeline */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Processus d'Admission</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les étapes clés pour intégrer une université philippine en tant qu'étudiant international.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5"></div>

              {/* Step 1 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  1
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Recherche et Candidature</h3>
                  <p className="text-muted-foreground text-sm">
                    Identifiez les programmes qui vous intéressent et vérifiez les dates limites.
                    Soumettez votre dossier en ligne avec transcripts, lettre de motivation et recommandations.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center md:flex-row-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  2
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:mr-0 md:ml-auto">
                  <h3 className="font-semibold text-lg mb-2">Tests et Entretien</h3>
                  <p className="text-muted-foreground text-sm">
                    Certaines universités exigent un test d'entrée (ACET pour Ateneo, DCAT pour DLSU, UPCAT pour UP).
                    Un test d'anglais peut être requis.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  3
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Lettre d'Acceptation</h3>
                  <p className="text-muted-foreground text-sm">
                    Une fois accepté, vous recevez une lettre officielle. L'université initie ensuite
                    votre demande de visa auprès de la CHED et du DFA.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-6 pb-10 md:justify-center md:flex-row-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  4
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:mr-0 md:ml-auto">
                  <h3 className="font-semibold text-lg mb-2">Demande de Visa 9(F)</h3>
                  <p className="text-muted-foreground text-sm">
                    Déposez votre demande à l'ambassade des Philippines avec tous les documents.
                    Vous pouvez aussi entrer avec un visa touriste et convertir sur place.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start gap-6 md:justify-center">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  5
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-card-rest flex-grow md:w-[calc(50%-40px)] md:ml-0 md:mr-auto">
                  <h3 className="font-semibold text-lg mb-2">Arrivée et Enregistrement</h3>
                  <p className="text-muted-foreground text-sm">
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estimation du coût de la vie pour un étudiant à Metro Manila (hors frais de scolarité).
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                <div className="flex items-center justify-between p-4 hover:bg-muted">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Logement</p>
                      <p className="text-sm text-muted-foreground">Chambre ou studio près du campus</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱8,000-20,000</p>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-muted">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Utensils className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Nourriture</p>
                      <p className="text-sm text-muted-foreground">Cantine, restaurants, courses</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱6,000-12,000</p>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-muted">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Transport</p>
                      <p className="text-sm text-muted-foreground">Jeepney, MRT, Grab</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱2,000-5,000</p>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-muted">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Téléphone et Internet</p>
                      <p className="text-sm text-muted-foreground">Forfait data + WiFi</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱1,000-2,000</p>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-muted">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Livres et fournitures</p>
                      <p className="text-sm text-muted-foreground">Par semestre (lissé/mois)</p>
                    </div>
                  </div>
                  <p className="font-semibold">₱500-1,000</p>
                </div>
              </div>

              <div className="bg-primary/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Budget mensuel total</p>
                    <p className="text-sm text-muted-foreground">Hors frais de scolarité</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₱20,000-40,000</p>
                    <p className="text-sm text-muted-foreground">≈ €320-640/mois</p>
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
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all"
            >
              <span className="font-medium">CHED (Commission on Higher Ed)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://immigration.gov.ph/student-visa-9f/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all"
            >
              <span className="font-medium">Bureau of Immigration</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.topuniversities.com/asia-university-rankings?countries=ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all"
            >
              <span className="font-medium">QS Rankings Philippines</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.up.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all"
            >
              <span className="font-medium">University of the Philippines</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.ateneo.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all"
            >
              <span className="font-medium">Ateneo de Manila</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.dlsu.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all"
            >
              <span className="font-medium">De La Salle University</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t border-border pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/vivre-aux-philippines/etudier/ecoles-internationales"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all group"
            >
              <span className="font-medium">Écoles Internationales</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/vivre-aux-philippines/visas-et-formalites"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all group"
            >
              <span className="font-medium">Visas et Permis</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/vivre-aux-philippines/logement"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-card transition-all group"
            >
              <span className="font-medium">Trouver un Logement</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default UniversitesPage;
