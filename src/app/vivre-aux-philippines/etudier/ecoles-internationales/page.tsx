import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { School, BookOpen, DollarSign, MapPin, Globe, Users, Award, FileCheck, GraduationCap, Languages, Shield, Building2 } from 'lucide-react';
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
    <div className="bg-white text-gray-800">
      <HeroThematic
        titlePart1="Les Écoles"
        titlePart2="Internationales"
        subtitle="Offrez à vos enfants une éducation de classe mondiale dans un environnement multiculturel aux Philippines."
        imageUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-16">

        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-6 text-primary">Une Éducation de Qualité pour les Familles d'Expatriés</h2>
          <p className="text-lg max-w-4xl mx-auto mb-6">
            Les Philippines comptent parmi les destinations asiatiques les plus attractives pour les familles expatriées
            en matière d'éducation. Avec une vingtaine d'écoles internationales accréditées, principalement situées à Metro Manila,
            les enfants d'expatriés bénéficient d'un enseignement de qualité mondiale. Les établissements proposent des curricula
            reconnus internationalement (IB, américain, britannique, français, allemand) et préparent les élèves aux meilleures
            universités mondiales.
          </p>
          <p className="text-lg max-w-4xl mx-auto">
            L'<a href="https://www.ismanila.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">International School Manila</a>,
            fondée en 1920, est la plus ancienne école internationale d'Asie du Sud-Est et la première à avoir proposé le
            programme IB Diploma. En 2026, le réseau s'est considérablement développé avec des établissements comme la
            <a href="https://www.britishschoolmanila.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> British School Manila</a>,
            <a href="https://www.nordangliaeducation.com/nais-manila" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Nord Anglia</a> et
            <a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Brent International School</a>.
          </p>
        </section>

        {/* Avantages clés */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Pourquoi Choisir une École Internationale aux Philippines ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><BookOpen className="text-primary" />Curricula Internationaux</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Les meilleures écoles proposent des programmes reconnus mondialement :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Baccalauréat International (IB)</strong> - PYP, MYP, DP</li>
                  <li><strong>Cursus Américain (AP)</strong> - Advanced Placement</li>
                  <li><strong>Cursus Britannique</strong> - IGCSE, A-Levels</li>
                  <li><strong>Cursus Français</strong> - Lycée Français</li>
                  <li><strong>Cursus Allemand</strong> - Abitur</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Globe className="text-primary" />Environnement Multiculturel</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les écoles internationales accueillent des élèves de 40 à 60 nationalités différentes.
                  À ISM, plus de 50 nationalités sont représentées parmi les 2 200 élèves. Cette diversité
                  favorise l'ouverture d'esprit, la tolérance et la maîtrise de plusieurs langues.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Users className="text-primary" />Classes à Effectifs Réduits</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les classes comptent généralement entre 15 et 22 élèves maximum, permettant un suivi
                  personnalisé. Les enseignants, souvent recrutés internationalement, sont hautement
                  qualifiés et expérimentés dans l'éducation internationale.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Award className="text-primary" />Accréditations Prestigieuses</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Les meilleures écoles détiennent des accréditations reconnues :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>CIS</strong> - Council of International Schools</li>
                  <li><strong>WASC</strong> - Western Association of Schools and Colleges</li>
                  <li><strong>IBO</strong> - International Baccalaureate Organization</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  Seules 22% des écoles internationales dans le monde obtiennent ces accréditations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><MapPin className="text-primary" />Localisation Stratégique</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  La majorité des écoles internationales se trouvent à <strong>Metro Manila</strong>,
                  principalement dans les quartiers de :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Bonifacio Global City (BGC) - Taguig</li>
                  <li>Makati - Quartier des affaires</li>
                  <li>Parañaque - Aseana Business Park</li>
                  <li>Alabang - Muntinlupa</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><GraduationCap className="text-primary" />Débouchés Universitaires</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les diplômés des écoles internationales intègrent les meilleures universités mondiales.
                  À ISM, environ 60% des élèves poursuivent leurs études aux États-Unis, les autres rejoignant
                  des universités prestigieuses en Europe, Australie et Asie.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Principales écoles à Metro Manila */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Principales Écoles Internationales à Metro Manila</h2>

          <div className="space-y-8">
            {/* ISM */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <School className="text-blue-500" />
                  International School Manila (ISM)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-4">
                      Fondée en 1920, ISM est la plus ancienne et la plus prestigieuse école internationale des Philippines.
                      Elle fut la première en Asie à proposer le programme IB Diploma. Située à BGC, elle accueille plus de
                      2 200 élèves de plus de 50 nationalités.
                    </p>
                    <p className="mb-4">
                      <strong>Curricula :</strong> IB (PYP, MYP, DP) + Advanced Placement (AP)
                    </p>
                    <p className="mb-4">
                      <strong>Langues :</strong> Anglais (instruction), Chinois, Français, Japonais, Coréen, Espagnol, Filipino
                    </p>
                    <p>
                      <strong>Accréditations :</strong> WASC, CIS, IBO
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Frais de scolarité 2025-2026</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Frais de candidature :</strong> $600 USD</li>
                      <li><strong>Frais de matriculation :</strong> $4 500 USD (entrée K-12)</li>
                      <li><strong>Frais d'amélioration des installations :</strong> $4 500 USD</li>
                      <li><strong>Scolarité annuelle :</strong> ~₱1 400 000 (~24 000€)</li>
                    </ul>
                    <a href="https://www.ismanila.org/admissions/school-fees" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm block mt-3">
                      → Voir les tarifs détaillés
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BSM */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <School className="text-red-500" />
                  British School Manila (BSM)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-4">
                      Fondée en 1976, BSM offre une éducation britannique de premier plan à BGC.
                      Elle accueille plus de 1 000 élèves de plus de 40 nationalités et met l'accent
                      sur l'excellence académique et la responsabilité sociale.
                    </p>
                    <p className="mb-4">
                      <strong>Curricula :</strong> British National Curriculum (EYFS → IGCSE) + IB Diploma (Years 12-13)
                    </p>
                    <p className="mb-4">
                      <strong>Âges :</strong> 3 à 18 ans
                    </p>
                    <p>
                      <strong>Accréditations :</strong> CIS, COBIS, IBO
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Frais de scolarité estimés 2025-2026</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Nursery - Year 2 :</strong> ₱600 000 - 900 000 (~10 000-15 500€)</li>
                      <li><strong>Year 3 - Year 9 :</strong> ~₱1 000 000 (~17 300€)</li>
                      <li><strong>Year 10 - Year 13 :</strong> ~₱1 300 000+ (~22 500€)</li>
                    </ul>
                    <a href="https://www.britishschoolmanila.org/admissions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm block mt-3">
                      → Contacter les admissions
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nord Anglia */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <School className="text-purple-500" />
                  Nord Anglia International School Manila (NAIS)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-4">
                      Anciennement The King's School, NAIS Manila fait partie du réseau mondial Nord Anglia Education
                      qui compte plus de 80 écoles dans le monde. Située à Aseana Business Park (Parañaque),
                      elle bénéficie de collaborations exclusives avec le MIT et la Juilliard School.
                    </p>
                    <p className="mb-4">
                      <strong>Curricula :</strong> English National Curriculum + IB Diploma
                    </p>
                    <p className="mb-4">
                      <strong>Âges :</strong> 2 à 18 ans
                    </p>
                    <p>
                      <strong>Particularité :</strong> Programmes STEAM avec MIT, musique et arts avec Juilliard
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Frais de scolarité 2025-2026</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Première année (2 ans) :</strong> ~₱950 000 (~16 400€)</li>
                      <li>Frais progressifs selon le niveau</li>
                      <li>Inclut frais d'inscription et matériel</li>
                    </ul>
                    <a href="https://www.nordangliaeducation.com/nais-manila/admissions/tuition-fees" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm block mt-3">
                      → Voir les tarifs détaillés
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brent */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <School className="text-green-500" />
                  Brent International School
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-4">
                      Fondée en 1984, Brent dispose de trois campus aux Philippines : Manila (Biñan, Laguna),
                      Subic et Baguio. Elle offre un environnement scolaire américain avec le programme IB Diploma
                      et est réputée pour ses excellentes infrastructures sportives.
                    </p>
                    <p className="mb-4">
                      <strong>Curricula :</strong> American Curriculum + IB Diploma
                    </p>
                    <p className="mb-4">
                      <strong>Élèves :</strong> Plus de 1 000 élèves de 30+ nationalités
                    </p>
                    <p>
                      <strong>Particularité :</strong> Options d'internat disponibles (boarding)
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Frais de scolarité 2025-2026</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Scolarité annuelle :</strong> ₱600 000 - 1 200 000 (~10 400-20 700€)</li>
                      <li><strong>Première année (3 ans) :</strong> ~₱644 000 (~11 100€)</li>
                      <li>+ Frais de candidature, matriculation, activités</li>
                    </ul>
                    <a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm block mt-3">
                      → Visiter le site officiel
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EIS/GESM */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <School className="text-amber-500" />
                  European International School (EIS) / GESM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-4">
                      L'European International School est un "Eurocampus" unique regroupant le
                      German European School Manila (GESM) et le Lycée Français de Manille.
                      C'est le premier des sept Eurocampus dans le monde, situé à Parañaque.
                    </p>
                    <p className="mb-4">
                      <strong>Curricula :</strong> Français (AEFE), Allemand (ZfA/Abitur), IB Diploma
                    </p>
                    <p className="mb-4">
                      <strong>Langues :</strong> Français, Allemand, Anglais
                    </p>
                    <p>
                      <strong>Idéal pour :</strong> Familles européennes, multilingues
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Frais de scolarité 2025-2026 (GESM)</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Kindergarten :</strong> 2 540€ + ₱230 000</li>
                      <li>Paiement en Euros ET Pesos</li>
                      <li>+ Dépôt remboursable</li>
                    </ul>
                    <a href="https://www.gesm.org/school-fees" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm block mt-3">
                      → Voir les tarifs GESM
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Écoles hors de Manila */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Écoles Internationales Hors de Metro Manila</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="text-primary" />
                  Cebu International School (CIS)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">
                  Fondée en 1924 à Cebu City, CIS est une école IB World School proposant
                  le PYP, MYP et DP. Accréditée CIS, WASC et PAASCU.
                </p>
                <p className="mb-2"><strong>Scolarité annuelle :</strong> ₱825 000 - 1 445 000 (~14 200-25 000€)</p>
                <p className="mb-2"><strong>Bourses :</strong> Disponibles pour étudiants philippins méritants</p>
                <a href="https://cis.edu.ph/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  → cis.edu.ph
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="text-primary" />
                  Singapore School Cebu (SSC)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">
                  Première et unique école à Cebu offrant à la fois le Cambridge IGCSE et l'IB Diploma.
                  Programme basé sur le curriculum singapourien avec emphase STEM.
                </p>
                <p className="mb-2"><strong>Curricula :</strong> Singapore Curriculum + IGCSE + IB DP</p>
                <p className="mb-2"><strong>De :</strong> Preschool à Pre-University</p>
                <a href="https://www.singaporeschoolcebu.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  → singaporeschoolcebu.com
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tableau comparatif */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Comparatif des Frais de Scolarité 2025-2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-4 text-left">École</th>
                  <th className="p-4 text-left">Localisation</th>
                  <th className="p-4 text-left">Curricula</th>
                  <th className="p-4 text-left">Scolarité annuelle</th>
                  <th className="p-4 text-left">En euros</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">ISM</td>
                  <td className="p-4">BGC, Taguig</td>
                  <td className="p-4">IB, AP</td>
                  <td className="p-4">~₱1 400 000</td>
                  <td className="p-4">~24 000€</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 bg-gray-50">
                  <td className="p-4 font-semibold">BSM</td>
                  <td className="p-4">BGC, Taguig</td>
                  <td className="p-4">British, IB</td>
                  <td className="p-4">₱600 000 - 1 300 000</td>
                  <td className="p-4">10 000 - 22 500€</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">NAIS Manila</td>
                  <td className="p-4">Parañaque</td>
                  <td className="p-4">British, IB</td>
                  <td className="p-4">~₱950 000+</td>
                  <td className="p-4">~16 400€+</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 bg-gray-50">
                  <td className="p-4 font-semibold">Brent Manila</td>
                  <td className="p-4">Biñan, Laguna</td>
                  <td className="p-4">American, IB</td>
                  <td className="p-4">₱600 000 - 1 200 000</td>
                  <td className="p-4">10 400 - 20 700€</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">EIS/GESM</td>
                  <td className="p-4">Parañaque</td>
                  <td className="p-4">Français, Allemand, IB</td>
                  <td className="p-4">€2 540+ ₱230 000</td>
                  <td className="p-4">~6 500€+</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-50">
                  <td className="p-4 font-semibold">CIS Cebu</td>
                  <td className="p-4">Cebu City</td>
                  <td className="p-4">IB</td>
                  <td className="p-4">₱825 000 - 1 445 000</td>
                  <td className="p-4">14 200 - 25 000€</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            * Tarifs indicatifs pour l'année scolaire 2025-2026. Conversion : 1€ ≈ 58 PHP.
            Frais additionnels possibles (inscription, activités, uniformes, transport).
          </p>
        </section>

        {/* Visa pour enfants */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Visa pour les Enfants d'Expatriés</h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-4">
              <Shield className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Bonne nouvelle pour les expatriés</h3>
                <p>
                  Les enfants mineurs (moins de 21 ans, non mariés) de titulaires de certains visas sont
                  <strong> exemptés</strong> du visa étudiant 9(f) et du Special Study Permit.
                  Ils peuvent étudier avec un <strong>visa de dépendant</strong> lié au visa principal du parent.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileCheck className="text-green-600" />
                  Enfants exemptés du visa étudiant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">Les enfants des titulaires de ces visas peuvent étudier sans visa étudiant séparé :</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>9(g)</strong> - Visa de travail</li>
                  <li><strong>9(d)</strong> - Visa diplomatique/consulaire</li>
                  <li><strong>47(a)(2)</strong> - Visa spécial non-immigrant</li>
                  <li><strong>SIRV</strong> - Special Investor's Resident Visa</li>
                  <li><strong>SRRV</strong> - Special Retiree's Resident Visa</li>
                  <li>Personnel d'organisations internationales accréditées</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileCheck className="text-amber-600" />
                  Visa étudiant 9(f) - Si nécessaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">Pour les étudiants de 18+ ans ou sans visa parent éligible :</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Lettre d'admission de l'école</li>
                  <li>Passeport valide 6+ mois</li>
                  <li>Preuve de moyens financiers</li>
                  <li>Certificats scolaires antérieurs</li>
                  <li>Frais : ~₱3 000 - 5 000 + extensions</li>
                </ul>
                <a href="https://immigration.gov.ph/student-visa-9f/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm block mt-3">
                  → Bureau of Immigration - Visa étudiant
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mt-6">
            <div className="flex items-start gap-4">
              <Shield className="text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Enfants de moins de 15 ans voyageant seuls</h3>
                <p>
                  Un <strong>Waiver of Exclusion Ground (WEG)</strong> est requis pour les enfants de moins de 15 ans
                  qui entrent aux Philippines non accompagnés d'un parent. Ce document doit être obtenu
                  auprès de l'ambassade des Philippines avant le voyage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Processus d'admission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Processus d'Admission</h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-lg">Recherche et visite (6-12 mois avant)</h3>
                  <p className="text-gray-600">
                    Contactez les écoles pour organiser des visites et journées portes ouvertes.
                    Les écoles les plus demandées (ISM, BSM) ont des listes d'attente, surtout pour les niveaux 6-10.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-lg">Constitution du dossier</h3>
                  <ul className="text-gray-600 list-disc list-inside mt-2">
                    <li>Formulaire de candidature en ligne</li>
                    <li>Bulletins scolaires des 2-3 dernières années</li>
                    <li>Lettres de recommandation des enseignants</li>
                    <li>Copie du passeport et visa des parents</li>
                    <li>Certificat de naissance traduit</li>
                    <li>Photos d'identité</li>
                    <li>Frais de candidature ($200-600 selon l'école)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-lg">Évaluations et entretien</h3>
                  <p className="text-gray-600">
                    Tests d'admission (anglais, mathématiques), évaluation du niveau scolaire,
                    et entretien avec l'équipe pédagogique. Certaines écoles proposent des évaluations à distance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-lg">Décision et inscription</h3>
                  <p className="text-gray-600">
                    Réponse sous 2-4 semaines. En cas d'acceptation, versement du dépôt et des frais
                    de matriculation pour réserver la place. Signature du contrat d'inscription.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h3 className="font-semibold text-lg">Préparation de la rentrée</h3>
                  <p className="text-gray-600">
                    Achat des uniformes et fournitures, organisation du transport scolaire,
                    participation aux journées d'orientation. L'année scolaire commence généralement en août.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mt-8 max-w-4xl mx-auto">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Languages className="text-primary" />
              Support linguistique (EAL/ESL)
            </h3>
            <p>
              La plupart des écoles internationales proposent des programmes <strong>English as an Additional Language (EAL)</strong>
              pour les élèves non anglophones. À ISM, ce programme coûte $1 625/semestre la première année
              et $1 100/semestre la deuxième année. Ce support aide les enfants francophones à s'intégrer
              rapidement et à suivre le cursus en anglais.
            </p>
          </div>
        </section>

        {/* Ressources officielles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Ressources et Liens Officiels</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <a href="https://www.ismanila.org/" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">International School Manila</p>
              <p className="text-sm text-gray-600">ismanila.org</p>
            </a>
            <a href="https://www.britishschoolmanila.org/" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">British School Manila</p>
              <p className="text-sm text-gray-600">britishschoolmanila.org</p>
            </a>
            <a href="https://www.nordangliaeducation.com/nais-manila" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">Nord Anglia Manila</p>
              <p className="text-sm text-gray-600">nordangliaeducation.com</p>
            </a>
            <a href="https://www.brent.edu.ph/" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">Brent International School</p>
              <p className="text-sm text-gray-600">brent.edu.ph</p>
            </a>
            <a href="https://www.gesm.org/" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">German European School Manila</p>
              <p className="text-sm text-gray-600">gesm.org</p>
            </a>
            <a href="https://cis.edu.ph/" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">Cebu International School</p>
              <p className="text-sm text-gray-600">cis.edu.ph</p>
            </a>
            <a href="https://immigration.gov.ph/student-visa-9f/" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">Bureau of Immigration - Visa 9(f)</p>
              <p className="text-sm text-gray-600">immigration.gov.ph</p>
            </a>
            <a href="https://www.cois.org/" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">Council of International Schools</p>
              <p className="text-sm text-gray-600">cois.org</p>
            </a>
            <a href="https://www.ibo.org/" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-semibold">International Baccalaureate</p>
              <p className="text-sm text-gray-600">ibo.org</p>
            </a>
          </div>
        </section>

        {/* Liens internes */}
        <section className="text-center space-y-4">
          <Link href="/vivre-aux-philippines/etudier/universites" className="text-accent font-bold hover:underline text-lg block">
            → Étudier à l'université aux Philippines
          </Link>
          <Link href="/vivre-aux-philippines/famille" className="text-accent font-bold hover:underline text-lg block">
            → Guide complet pour les familles expatriées
          </Link>
          <Link href="/vivre-aux-philippines/s-installer/visas" className="text-accent font-bold hover:underline text-lg block">
            → Tous les types de visas pour les Philippines
          </Link>
        </section>
      </div>
    </div>
  );
};

export default EcolesInternationalesPage;
