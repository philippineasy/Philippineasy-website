import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GraduationCap, School, DollarSign, FileText, Globe, Award, CheckCircle, AlertTriangle, ExternalLink, ChevronRight, MapPin, Clock, Users, BookOpen, Info } from 'lucide-react';
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
    <div>
      <HeroThematic
        titlePart1="Étudier aux"
        titlePart2="Philippines"
        subtitle="Un enseignement de qualité en anglais, des frais abordables et une expérience culturelle unique pour les étudiants internationaux."
        imageUrl="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-muted-foreground mb-6">
            Les Philippines sont une destination de plus en plus prisée par les étudiants internationaux,
            grâce à des programmes enseignés en anglais, des frais de scolarité compétitifs et un coût
            de la vie abordable. En 2026, 35 universités philippines figurent dans le classement QS Asia,
            avec l'Université des Philippines en tête (104ème rang asiatique).
          </p>
        </section>

        {/* Rankings 2026 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Classements 2026</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Position des principales universités philippines dans les classements internationaux.
          </p>

          <div className="overflow-x-auto max-w-4xl mx-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-3 text-left">Université</th>
                  <th className="border p-3 text-center">QS World 2026</th>
                  <th className="border p-3 text-center">QS Asia 2026</th>
                  <th className="border p-3 text-center">THE World 2026</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">University of the Philippines (UP)</td>
                  <td className="border p-3 text-center">#362</td>
                  <td className="border p-3 text-center">#104</td>
                  <td className="border p-3 text-center">1201-1500</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Ateneo de Manila University (ADMU)</td>
                  <td className="border p-3 text-center">#511</td>
                  <td className="border p-3 text-center">#141</td>
                  <td className="border p-3 text-center">1001-1200</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">De La Salle University (DLSU)</td>
                  <td className="border p-3 text-center">#654</td>
                  <td className="border p-3 text-center">#178</td>
                  <td className="border p-3 text-center">1501+</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">University of Santo Tomas (UST)</td>
                  <td className="border p-3 text-center">851-900</td>
                  <td className="border p-3 text-center">#184</td>
                  <td className="border p-3 text-center">1501+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Big Three */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Le "Big Three" des Universités</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Les trois universités les plus prestigieuses des Philippines, chacune avec son identité et ses forces.
          </p>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-3">
                  <GraduationCap className="text-green-600" />
                  University of the Philippines
                </CardTitle>
                <p className="text-sm text-muted-foreground">Publique • Fondée en 1908</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  Le système universitaire national avec 8 campus à travers le pays. UP Diliman (Quezon City)
                  est le plus prestigieux et le plus grand.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Forces :</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Sciences, Droit, Arts, Médecine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Frais les plus bas du Big Three</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Réseau alumni très influent</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Frais :</strong> ₱1,000-2,000/unité (internationaux paient plus)</p>
                </div>
                <a
                  href="https://www.up.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-700 hover:underline text-sm"
                >
                  up.edu.ph <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-3">
                  <GraduationCap className="text-blue-600" />
                  Ateneo de Manila University
                </CardTitle>
                <p className="text-sm text-muted-foreground">Privée Jésuite • Fondée en 1859</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  Université privée jésuite à Quezon City, connue pour son excellence en sciences humaines,
                  business et son campus verdoyant et moderne.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Forces :</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Business, Droit, Sciences Sociales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>#1 THE Rankings Philippines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Communauté étudiante active</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Frais :</strong> ~₱5,200/unité (~₱104,000/semestre)</p>
                </div>
                <a
                  href="https://www.ateneo.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-700 hover:underline text-sm"
                >
                  ateneo.edu <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-3">
                  <GraduationCap className="text-green-600" />
                  De La Salle University
                </CardTitle>
                <p className="text-sm text-muted-foreground">Privée Lasallienne • Fondée en 1911</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  Université catholique au cœur de Manille (Taft Avenue), leader en ingénierie,
                  informatique et commerce.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Forces :</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Ingénierie, IT, Commerce</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Recherche et publications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Liens forts avec l'industrie</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Frais :</strong> ₱160,000-200,000/an</p>
                </div>
                <a
                  href="https://www.dlsu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-700 hover:underline text-sm"
                >
                  dlsu.edu.ph <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Autres universités */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Autres Universités Reconnues</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">University of Santo Tomas</h3>
                <p className="text-sm text-muted-foreground mb-2">Plus ancienne université d'Asie (1611). Médecine, Architecture.</p>
                <p className="text-xs">₱100,000-150,000/an</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Mapua University</h3>
                <p className="text-sm text-muted-foreground mb-2">Leader en ingénierie et technologie. Campus moderne à Makati.</p>
                <p className="text-xs">₱80,000-120,000/an</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Silliman University</h3>
                <p className="text-sm text-muted-foreground mb-2">À Dumaguete. Environnement paisible, programmes en sciences marines.</p>
                <p className="text-xs">₱60,000-120,000/an</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">University of San Carlos</h3>
                <p className="text-sm text-muted-foreground mb-2">À Cebu. Bonne réputation en commerce et sciences.</p>
                <p className="text-xs">₱50,000-100,000/an</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Frais de scolarité */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frais de Scolarité Indicatifs</h2>
          <div className="overflow-x-auto max-w-4xl mx-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-3 text-left">Type d'Université</th>
                  <th className="border p-3 text-left">Frais/An (₱)</th>
                  <th className="border p-3 text-left">Frais/An (€)</th>
                  <th className="border p-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Universités Publiques (UP, etc.)</td>
                  <td className="border p-3">₱20,000-60,000</td>
                  <td className="border p-3">€320-960</td>
                  <td className="border p-3 text-sm">Frais plus élevés pour internationaux</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Privées "Mid-range"</td>
                  <td className="border p-3">₱60,000-120,000</td>
                  <td className="border p-3">€960-1,920</td>
                  <td className="border p-3 text-sm">Silliman, San Carlos, etc.</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Privées Premium (Ateneo, DLSU)</td>
                  <td className="border p-3">₱150,000-250,000</td>
                  <td className="border p-3">€2,400-4,000</td>
                  <td className="border p-3 text-sm">Selon programme</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Programmes Médecine/Dentaire</td>
                  <td className="border p-3">₱200,000-400,000</td>
                  <td className="border p-3">€3,200-6,400</td>
                  <td className="border p-3 text-sm">UST, UP, DLSU</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            * Conversion approximative à 1€ = ₱62.5. Les étudiants internationaux peuvent payer 20-50% de plus.
          </p>
        </section>

        {/* Visa étudiant */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Visa Étudiant 9(F)</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Le visa 9(F) est obligatoire pour les études supérieures de plus de 30 jours.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="text-primary" />
                  Conditions d'Éligibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>18 ans minimum à l'inscription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Acceptation d'une université accréditée CHED</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Preuve de moyens financiers suffisants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Casier judiciaire vierge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Certificat médical</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="text-primary" />
                  Documents Requis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Lettre d'acceptation de l'université</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Passeport valide 6+ mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Formulaire FA-2 + Personal History Statement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Relevés bancaires / affidavit de support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Transcripts authentifiés par l'ambassade</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-4xl mx-auto mt-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Délai</p>
                  <p className="text-sm text-muted-foreground">2-8 semaines</p>
                  <p className="text-xs text-muted-foreground">Commencer 3 mois avant</p>
                </div>
                <div className="text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Frais</p>
                  <p className="text-sm text-muted-foreground">US$250-400</p>
                  <p className="text-xs text-muted-foreground">Selon nationalité</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Validité</p>
                  <p className="text-sm text-muted-foreground">1 an renouvelable</p>
                  <p className="text-xs text-muted-foreground">ACR I-Card requis après arrivée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Processus admission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Processus d'Admission</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recherche et Candidature</h3>
                    <p className="text-muted-foreground">
                      Identifiez les programmes qui vous intéressent et vérifiez les dates limites de candidature.
                      Soumettez votre dossier en ligne (transcripts, lettre de motivation, recommandations).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tests et Entretien</h3>
                    <p className="text-muted-foreground">
                      Certaines universités exigent un test d'entrée (ACET pour Ateneo, DCAT pour DLSU, UPCAT pour UP).
                      Un test d'anglais peut être requis si vous n'êtes pas anglophone natif.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Lettre d'Acceptation</h3>
                    <p className="text-muted-foreground">
                      Une fois accepté, vous recevez une lettre officielle. L'université initie ensuite
                      votre demande de visa auprès de la CHED et du DFA.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Demande de Visa 9(F)</h3>
                    <p className="text-muted-foreground">
                      Déposez votre demande à l'ambassade des Philippines avec tous les documents.
                      Vous pouvez aussi entrer avec un visa touriste et convertir sur place.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">5</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Arrivée et Enregistrement</h3>
                    <p className="text-muted-foreground">
                      À votre arrivée, enregistrez-vous au Bureau of Immigration pour obtenir votre ACR I-Card.
                      Finalisez votre inscription à l'université.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Coût de la vie */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Coût de la Vie Étudiant</h2>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span>Logement (chambre ou studio)</span>
                  <span className="font-semibold">₱8,000-20,000/mois</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span>Nourriture</span>
                  <span className="font-semibold">₱6,000-12,000/mois</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span>Transport</span>
                  <span className="font-semibold">₱2,000-5,000/mois</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span>Livres et fournitures</span>
                  <span className="font-semibold">₱2,000-5,000/semestre</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span>Téléphone et Internet</span>
                  <span className="font-semibold">₱1,000-2,000/mois</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-lg">
                  <span>Budget mensuel total</span>
                  <span className="text-primary">₱20,000-40,000</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Soit environ €320-640/mois (hors frais de scolarité)
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Info box */}
        <div className="flex items-start space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-16">
          <Info className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Programmes en Anglais</h3>
            <p className="text-muted-foreground">
              La quasi-totalité des programmes universitaires aux Philippines sont enseignés en anglais.
              Le pays est le 3ème plus grand pays anglophone au monde. Aucun test d'anglais formel n'est
              généralement requis pour les étudiants venant de pays anglophones ou ayant suivi un cursus
              en anglais.
            </p>
          </div>
        </div>

        {/* Ressources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources Officielles</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="https://ched.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>CHED (Commission on Higher Ed)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://immigration.gov.ph/student-visa-9f/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Bureau of Immigration</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.topuniversities.com/asia-university-rankings?countries=ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>QS Rankings Philippines</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.up.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>University of the Philippines</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.ateneo.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Ateneo de Manila</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.dlsu.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>De La Salle University</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/vivre-aux-philippines/etudier/ecoles-internationales"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Écoles Internationales</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/vivre-aux-philippines/s-installer/visas"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Visas et Permis</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/vivre-aux-philippines/s-installer/logement"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Trouver un Logement</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UniversitesPage;
