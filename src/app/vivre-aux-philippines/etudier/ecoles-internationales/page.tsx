import { Metadata } from 'next';
import { School, BookOpen, DollarSign, MapPin, Globe, Users, Award, FileCheck, GraduationCap, Languages, Shield, Building2, ExternalLink, ChevronRight, CheckCircle, Star, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faGlobe, faUsers, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow } from '@/components/sections';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Écoles Internationales aux Philippines en 2026 : Guide Complet",
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
    <>
      <PageHero
        eyebrow="Guide pratique"
        title="Les Écoles"
        titleAccent="Internationales"
        subtitle="Offrez à vos enfants une éducation de classe mondiale dans un environnement multiculturel aux Philippines."
        imageUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
        imageAlt="Les Écoles Internationales"
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
          <StatRow
            stats={[
              { value: '20+', label: 'Écoles accréditées', icon: <FontAwesomeIcon icon={faSchool} className="text-[18px]" /> },
              { value: '50+', label: 'Nationalités', icon: <FontAwesomeIcon icon={faGlobe} className="text-[18px]" /> },
              { value: '15-22', label: 'Élèves/classe', icon: <FontAwesomeIcon icon={faUsers} className="text-[18px]" /> },
              { value: '6-24K€', label: 'Scolarité/an', icon: <FontAwesomeIcon icon={faSackDollar} className="text-[18px]" /> },
            ]}
          />
        </section>

        {/* Avantages clés */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Pourquoi Choisir une École Internationale ?</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Une éducation de qualité mondiale pour préparer vos enfants aux meilleures universités
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Curricula Internationaux</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">IB</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">AP</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">IGCSE</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Français</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Programmes IB (PYP, MYP, DP), américain (AP), britannique (IGCSE, A-Levels) et français (AEFE).
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Environnement Multiculturel</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                40 à 60 nationalités par école. À ISM, plus de 50 nationalités parmi 2 200 élèves.
                Ouverture d'esprit et maîtrise de plusieurs langues.
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Classes Réduites</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                15 à 22 élèves maximum par classe. Enseignants internationaux hautement qualifiés.
                Suivi personnalisé garanti.
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Accréditations</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="px-2 py-0.5 bg-accent/15 text-accent-strong text-xs rounded-full">CIS</span>
                <span className="px-2 py-0.5 bg-accent/15 text-accent-strong text-xs rounded-full">WASC</span>
                <span className="px-2 py-0.5 bg-accent/15 text-accent-strong text-xs rounded-full">IBO</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Seules 22% des écoles internationales dans le monde obtiennent ces accréditations prestigieuses.
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Localisation</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Majoritairement à Metro Manila : BGC, Makati, Parañaque, Alabang.
                Accès facile depuis les quartiers d'expatriés.
              </p>
            </div>

            <div className="bg-card rounded-xl border-l-4 border-l-primary p-5 shadow-card-rest hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
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
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">International School Manila (ISM)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">Plus ancienne d'Asie SE</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Depuis 1920</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Première école en Asie à proposer le programme IB Diploma. Située à BGC,
                    elle accueille plus de 2 200 élèves de 50+ nationalités.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> IB + AP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Langues:</strong> 7 langues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Accréditations:</strong> WASC, CIS, IBO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> BGC, Taguig</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Candidature</span>
                      <span className="font-semibold">$600</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Matriculation</span>
                      <span className="font-semibold">$4,500</span>
                    </li>
                    <li className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-medium">Scolarité/an</span>
                      <span className="font-bold text-primary">~24,000€</span>
                    </li>
                  </ul>
                  <a href="https://www.ismanila.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* BSM */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">British School Manila (BSM)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">Curriculum UK</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Depuis 1976</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Éducation britannique de premier plan à BGC. Plus de 1 000 élèves de 40+ nationalités.
                    Excellence académique et responsabilité sociale.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> British + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Âges:</strong> 3 à 18 ans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Accréditations:</strong> CIS, COBIS, IBO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> BGC, Taguig</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Nursery-Y2</span>
                      <span className="font-semibold">10-15K€</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Y3-Y9</span>
                      <span className="font-semibold">~17K€</span>
                    </li>
                    <li className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-medium">Y10-Y13</span>
                      <span className="font-bold text-primary">~22,500€</span>
                    </li>
                  </ul>
                  <a href="https://www.britishschoolmanila.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Nord Anglia */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Nord Anglia (NAIS Manila)</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">Réseau mondial</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">MIT + Juilliard</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Partie du réseau mondial Nord Anglia (80+ écoles). Collaborations exclusives
                    avec le MIT (STEAM) et la Juilliard School (arts).
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> British + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Âges:</strong> 2 à 18 ans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Spécialité:</strong> STEAM, Arts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> Parañaque</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">1ère année (2 ans)</span>
                      <span className="font-semibold">~16,400€</span>
                    </li>
                    <li className="text-xs text-muted-foreground mt-2">
                      Frais progressifs selon niveau. Inclut inscription et matériel.
                    </li>
                  </ul>
                  <a href="https://www.nordangliaeducation.com/nais-manila" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Brent */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Brent International School</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">American</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Internat dispo</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Trois campus aux Philippines : Manila (Laguna), Subic et Baguio.
                    Excellentes infrastructures sportives. Option d'internat disponible.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> American + IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Élèves:</strong> 1000+ de 30+ pays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Spécialité:</strong> Sports, Boarding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> Biñan, Laguna</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Scolarité/an</span>
                      <span className="font-semibold">10-21K€</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">1ère année (3 ans)</span>
                      <span className="font-semibold">~11,100€</span>
                    </li>
                  </ul>
                  <a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
                    Voir le site <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* EIS/GESM */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <School className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">European International School / GESM</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">Français</span>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">Allemand</span>
                        <span className="px-2 py-0.5 bg-muted text-foreground border border-border text-xs rounded-full">Eurocampus</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Eurocampus" unique regroupant le GESM et le Lycée Français de Manille.
                    Premier des sept Eurocampus dans le monde. Idéal pour familles européennes.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Curricula:</strong> FR, DE, IB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Langues:</strong> FR, DE, EN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Accréditations:</strong> AEFE, ZfA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span><strong>Lieu:</strong> Parañaque</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 bg-muted rounded-xl p-4 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Frais 2025-2026
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Kindergarten</span>
                      <span className="font-semibold">~6,500€</span>
                    </li>
                    <li className="text-xs text-muted-foreground mt-2">
                      Paiement mixte EUR + PHP. Plus abordable que les écoles anglo-saxonnes.
                    </li>
                  </ul>
                  <a href="https://www.gesm.org/" target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80">
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
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/40 hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Cebu International School</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Fondée en 1924 à Cebu City. IB World School (PYP, MYP, DP).
                Accréditée CIS, WASC et PAASCU.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">14,200 - 25,000€/an</span>
                <a href="https://cis.edu.ph/" target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:text-primary/80 flex items-center gap-1">
                  Site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/40 hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Singapore School Cebu</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                Unique école à Cebu offrant Cambridge IGCSE + IB Diploma.
                Curriculum singapourien avec emphase STEM.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">Preschool → Pre-University</span>
                <a href="https://www.singaporeschoolcebu.com/" target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:text-primary/80 flex items-center gap-1">
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
            <div className="overflow-hidden rounded-2xl border border-border shadow-card-rest">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="p-4 text-left font-semibold">École</th>
                    <th className="p-4 text-left font-semibold">Localisation</th>
                    <th className="p-4 text-center font-semibold">Curricula</th>
                    <th className="p-4 text-right font-semibold">Scolarité/an</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-card border-b border-border">
                    <td className="p-4 font-semibold">ISM</td>
                    <td className="p-4 text-muted-foreground">BGC, Taguig</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">IB</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">AP</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">~24,000€</td>
                  </tr>
                  <tr className="bg-muted border-b border-border">
                    <td className="p-4 font-semibold">BSM</td>
                    <td className="p-4 text-muted-foreground">BGC, Taguig</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">British</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">10-22,500€</td>
                  </tr>
                  <tr className="bg-card border-b border-border">
                    <td className="p-4 font-semibold">NAIS Manila</td>
                    <td className="p-4 text-muted-foreground">Parañaque</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">British</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">~16,400€+</td>
                  </tr>
                  <tr className="bg-muted border-b border-border">
                    <td className="p-4 font-semibold">Brent Manila</td>
                    <td className="p-4 text-muted-foreground">Biñan, Laguna</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">American</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">10-20,700€</td>
                  </tr>
                  <tr className="bg-card border-b border-border">
                    <td className="p-4 font-semibold">EIS/GESM</td>
                    <td className="p-4 text-muted-foreground">Parañaque</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">FR</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">DE</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-1">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">~6,500€+</td>
                  </tr>
                  <tr className="bg-muted">
                    <td className="p-4 font-semibold">CIS Cebu</td>
                    <td className="p-4 text-muted-foreground">Cebu City</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">IB</span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">14-25,000€</td>
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
            <div className="bg-primary/10 border border-primary/25 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Bonne nouvelle pour les expatriés</h3>
                  <p className="text-muted-foreground">
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
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-primary-foreground" />
                </div>
                Enfants exemptés du visa étudiant
              </h3>
              <p className="text-sm text-muted-foreground mb-3">Enfants des titulaires de ces visas :</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm"><strong>9(g)</strong> - Visa de travail</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm"><strong>9(d)</strong> - Diplomatique/consulaire</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm"><strong>SIRV</strong> - Special Investor's Visa</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm"><strong>SRRV</strong> - Special Retiree's Visa</span>
                </li>
              </ul>
            </div>

            {/* Visa 9(f) */}
            <div className="bg-accent/10 rounded-xl p-6 border border-accent/25">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-accent-foreground" />
                </div>
                Visa étudiant 9(f) - Si nécessaire
              </h3>
              <p className="text-sm text-muted-foreground mb-3">Pour étudiants 18+ ans ou sans visa parent éligible :</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-accent-strong" />
                  <span className="text-sm">Lettre d'admission de l'école</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-accent-strong" />
                  <span className="text-sm">Passeport valide 6+ mois</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-accent-strong" />
                  <span className="text-sm">Preuve de moyens financiers</span>
                </li>
                <li className="flex items-center gap-2 bg-card/70 rounded-lg p-2">
                  <ArrowRight className="h-4 w-4 text-accent-strong" />
                  <span className="text-sm">Frais : ~₱3,000-5,000</span>
                </li>
              </ul>
            </div>
          </div>

          {/* WEG Warning */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Enfants de moins de 15 ans voyageant seuls</h4>
                  <p className="text-sm text-muted-foreground">
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
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">1</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Recherche et visite (6-12 mois avant)
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Contactez les écoles pour visites et portes ouvertes.
                      ISM et BSM ont des listes d'attente pour les niveaux 6-10.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">2</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Constitution du dossier
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
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
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">3</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Évaluations et entretien
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Tests d'admission (anglais, maths), évaluation du niveau scolaire,
                      entretien avec l'équipe pédagogique. Évaluations à distance possibles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">4</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Décision et inscription (2-4 semaines)
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      En cas d'acceptation : versement du dépôt et frais de matriculation.
                      Signature du contrat d'inscription.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 z-10">5</div>
                  <div className="flex-1 bg-muted rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Préparation de la rentrée (août)
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Uniformes, fournitures, transport scolaire, journées d'orientation.
                      L'année scolaire commence généralement en août.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* EAL Support */}
            <div className="mt-8 bg-muted rounded-xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Languages className="h-6 w-6 text-primary-foreground" />
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
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <School className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">ISM</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.britishschoolmanila.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <School className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">British School Manila</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.nordangliaeducation.com/nais-manila" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <School className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">Nord Anglia</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <School className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">Brent International</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.gesm.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <School className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">GESM (Eurocampus)</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://cis.edu.ph/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <School className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">CIS Cebu</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://immigration.gov.ph/student-visa-9f/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <FileCheck className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">Visa 9(f) - BI</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.cois.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Award className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">Council of Int'l Schools</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>

            <a href="https://www.ibo.org/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Star className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-medium">IB Organization</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t border-border pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/vivre-aux-philippines/etudier/universites"
                  className="flex items-center justify-between p-4 bg-muted border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="font-medium">Universités aux Philippines</span>
              </div>
              <ChevronRight className="h-5 w-5 text-primary" />
            </Link>
            <Link href="/vivre-aux-philippines/culture-integration"
                  className="flex items-center justify-between p-4 bg-muted border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Guide Familles Expatriées</span>
              </div>
              <ChevronRight className="h-5 w-5 text-primary" />
            </Link>
            <Link href="/vivre-aux-philippines/visas-et-formalites"
                  className="flex items-center justify-between p-4 bg-muted border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all">
              <div className="flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-primary" />
                <span className="font-medium">Visas et Permis</span>
              </div>
              <ChevronRight className="h-5 w-5 text-primary" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default EcolesInternationalesPage;
