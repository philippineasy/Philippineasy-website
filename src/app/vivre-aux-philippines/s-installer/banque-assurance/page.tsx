import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Landmark, Shield, CreditCard, Hospital, AlertTriangle, CheckCircle, ExternalLink, DollarSign, FileText, Heart, Building } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Banque et Assurance aux Philippines 2025 : Guide Expatrié | Philippineasy",
  description: "Guide complet pour ouvrir un compte bancaire aux Philippines (BDO, BPI, Metrobank) et choisir une assurance santé adaptée. Documents requis, PhilHealth, assurances privées et HMO locales.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/s-installer/banque-assurance',
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
    title: "Banque et Assurance aux Philippines 2025 : Guide Expatrié",
    description: "Ouvrir un compte bancaire et choisir une assurance santé aux Philippines. Guide pratique pour expatriés avec documents requis et comparatif.",
    url: 'https://philippineasy.com/vivre-aux-philippines/s-installer/banque-assurance',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Banque et Assurance aux Philippines 2025",
    description: "Guide complet pour expatriés : compte bancaire et assurance santé aux Philippines.",
  },
};

const BanqueAssurancePage = () => {
  return (
    <div className="bg-background">
      <HeroThematic
        titlePart1="Banque &"
        titlePart2="Assurance"
        subtitle="Gérez vos finances et protégez votre santé aux Philippines : tout ce qu'il faut savoir pour ouvrir un compte et choisir la bonne couverture."
        imageUrl="/imagesHero/banque-assurance-philippines.webp"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Une fois installé aux Philippines, deux priorités s'imposent : ouvrir un compte bancaire local
            pour faciliter vos transactions quotidiennes, et souscrire une assurance santé adaptée
            pour vous protéger en cas de pépin. Ce guide vous accompagne dans ces démarches essentielles.
          </p>
        </section>

        {/* ========== SECTION BANQUE ========== */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Ouvrir un Compte Bancaire</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Les banques philippines acceptent les clients étrangers, mais certaines conditions doivent être remplies.
            Voici les principales options et les démarches à suivre.
          </p>

          {/* Conditions pour étrangers */}
          <Card className="max-w-4xl mx-auto mb-10 border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2 text-amber-900">Condition préalable pour les étrangers</h4>
                  <p className="text-amber-800 mb-3">
                    Pour ouvrir un compte courant ou d'épargne en pesos, vous devez être classé comme <strong>"resident alien"</strong>,
                    c'est-à-dire avoir séjourné au moins 59-60 jours aux Philippines et posséder une <strong>ACR I-Card</strong>
                    (Alien Certificate of Registration).
                  </p>
                  <p className="text-sm text-amber-700">
                    Les touristes ou non-résidents peuvent parfois ouvrir des comptes en devises (USD, EUR)
                    mais avec des restrictions importantes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Les principales banques */}
          <h3 className="text-2xl font-bold text-center mb-6">Les principales banques</h3>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Landmark className="text-blue-500" />
                  BDO (Banco de Oro)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  La plus grande banque du pays avec plus de 1 400 agences et 4 400 distributeurs.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Réseau ATM le plus étendu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Application mobile complète</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Ouverture possible via Zoom</span>
                  </li>
                </ul>
                <a href="https://www.bdo.com.ph/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-3 inline-flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" /> bdo.com.ph
                </a>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Landmark className="text-red-500" />
                  BPI (Bank of the Philippine Islands)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Banque historique réputée pour son service client et sa fiabilité.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Excellente application mobile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Bonne réputation auprès des expats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Services en ligne performants</span>
                  </li>
                </ul>
                <a href="https://www.bpi.com.ph/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline text-sm mt-3 inline-flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" /> bpi.com.ph
                </a>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Landmark className="text-green-500" />
                  Metrobank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Troisième plus grande banque, connue pour ses services aux entreprises et particuliers.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Large réseau d'agences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Comptes multi-devises</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Service personnalisé</span>
                  </li>
                </ul>
                <a href="https://www.metrobank.com.ph/" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline text-sm mt-3 inline-flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" /> metrobank.com.ph
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Documents requis */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-3">
                <FileText className="text-primary" />
                Documents requis pour ouvrir un compte
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Documents d'identité</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Passeport valide (original + copie)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>ACR I-Card</strong> ou ICR (Immigrant Certificate of Registration)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Visa en cours de validité</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Justificatifs complémentaires</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Justificatif de domicile (facture, contrat de location)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Photos d'identité (2-3 exemplaires)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Dépôt initial : 2 000 à 10 000 PHP selon la banque</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Bon à savoir</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Certaines banques peuvent demander une lettre de votre employeur ou une preuve de revenus</li>
                  <li>• L'ouverture se fait généralement en agence (rendez-vous parfois possible)</li>
                  <li>• Comptez 1 à 2 semaines pour recevoir votre carte de débit</li>
                  <li>• Les frais de tenue de compte varient de 0 à 300 PHP/mois selon le type de compte</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Alternatives digitales */}
          <div className="mt-10 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Alternatives digitales</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">GCash</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Le portefeuille électronique le plus populaire aux Philippines.
                    Parfait pour les paiements quotidiens, transferts et achats en ligne.
                    Fonctionne sans compte bancaire traditionnel.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Maya (ex-PayMaya)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Alternative à GCash avec des fonctionnalités similaires.
                    Propose également des comptes d'épargne numériques
                    avec des taux d'intérêt attractifs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ========== SECTION ASSURANCE ========== */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Assurance Santé</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Le système de santé philippin est de qualité dans les grandes villes, mais les soins peuvent
            être coûteux. Une bonne couverture santé est indispensable pour tout expatrié.
          </p>

          {/* PhilHealth */}
          <Card className="max-w-4xl mx-auto mb-10">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="flex items-center gap-3 text-green-800">
                <Shield className="text-green-600" />
                PhilHealth : L'assurance sociale nationale
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                PhilHealth est le système national d'assurance santé philippin. Les expatriés résidents
                peuvent y adhérer volontairement pour bénéficier d'une couverture de base.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Cotisations 2025</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• <strong>Salariés :</strong> 5% du salaire (partagé employeur/employé)</li>
                    <li>• <strong>Adhésion volontaire :</strong> 2 400 à 5 000 PHP/an</li>
                    <li>• Inscription via l'employeur ou en agence PhilHealth</li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Couverture</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Hospitalisations (forfaits par type d'intervention)</li>
                    <li>• Consultations dans les établissements publics</li>
                    <li>• Chirurgies non urgentes</li>
                    <li>• <strong>Attention :</strong> reste à charge jusqu'à 40%</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Limite importante :</strong> PhilHealth fonctionne avec des forfaits fixes ("case rates").
                  La couverture peut être insuffisante pour des soins complexes ou dans les hôpitaux privés haut de gamme.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assurances privées locales HMO */}
          <h3 className="text-2xl font-bold text-center mb-6">Les HMO locales (Health Maintenance Organizations)</h3>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maxicare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Leader du marché philippin avec un large réseau d'hôpitaux partenaires.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Plans individuels et familiaux</li>
                  <li>• Réseau étendu (hôpitaux et cliniques)</li>
                  <li>• À partir de ~15 000 PHP/an</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intellicare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Bon rapport qualité-prix avec des options flexibles.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Plans personnalisables</li>
                  <li>• Bonne couverture dentaire</li>
                  <li>• Options avec maternité</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">MediCard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Ancienneté et fiabilité sur le marché philippin.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Plus de 500 hôpitaux partenaires</li>
                  <li>• Plans entreprise et individuels</li>
                  <li>• Processus de réclamation simple</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Assurances internationales */}
          <h3 className="text-2xl font-bold text-center mb-6">Assurances internationales pour expatriés</h3>

          <Card className="max-w-4xl mx-auto mb-10">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6">
                Pour une couverture plus complète, notamment avec rapatriement et soins à l'étranger,
                les assurances internationales sont recommandées. Elles offrent généralement une
                meilleure prise en charge dans les hôpitaux privés premium.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="https://www.cigna.com/" target="_blank" rel="noopener noreferrer"
                   className="p-4 border rounded-lg hover:border-primary transition-colors text-center">
                  <h4 className="font-semibold mb-1">Cigna Global</h4>
                  <p className="text-xs text-muted-foreground">Couverture mondiale</p>
                </a>
                <a href="https://www.allianzcare.com/" target="_blank" rel="noopener noreferrer"
                   className="p-4 border rounded-lg hover:border-primary transition-colors text-center">
                  <h4 className="font-semibold mb-1">Allianz Care</h4>
                  <p className="text-xs text-muted-foreground">Plans modulables</p>
                </a>
                <a href="https://www.axa.com/" target="_blank" rel="noopener noreferrer"
                   className="p-4 border rounded-lg hover:border-primary transition-colors text-center">
                  <h4 className="font-semibold mb-1">AXA</h4>
                  <p className="text-xs text-muted-foreground">Présence locale</p>
                </a>
                <a href="https://www.april-international.com/" target="_blank" rel="noopener noreferrer"
                   className="p-4 border rounded-lg hover:border-primary transition-colors text-center">
                  <h4 className="font-semibold mb-1">April International</h4>
                  <p className="text-xs text-muted-foreground">Spécialiste expats français</p>
                </a>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Coûts indicatifs (2025)</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Plan de base :</strong> 30-50 €/mois (hospitalisation uniquement)</li>
                  <li>• <strong>Plan intermédiaire :</strong> 80-150 €/mois (consultations + hospitalisation)</li>
                  <li>• <strong>Plan premium :</strong> 200-400 €/mois (couverture complète + rapatriement)</li>
                  <li className="text-xs mt-2 text-blue-700">* Les tarifs varient selon l'âge, la couverture choisie et les franchises</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Hôpitaux de référence */}
          <h3 className="text-2xl font-bold text-center mb-6">Hôpitaux de référence pour expatriés</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hospital className="h-5 w-5 text-primary" />
                  St. Luke's Medical Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Standard international, deux campus : BGC et Quezon City.
                  Référence pour les soins complexes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hospital className="h-5 w-5 text-primary" />
                  Makati Medical Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Au cœur du quartier d'affaires de Makati.
                  Excellence en cardiologie et oncologie.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hospital className="h-5 w-5 text-primary" />
                  The Medical City
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Situé à Pasig. Équipe multilingue et
                  département dédié aux patients internationaux.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hospital className="h-5 w-5 text-primary" />
                  Asian Hospital
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  À Alabang (sud de Metro Manila).
                  Excellentes infrastructures et personnel qualifié.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hospital className="h-5 w-5 text-primary" />
                  Cebu Doctors' University Hospital
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Référence dans les Visayas.
                  Bon niveau de soins à des tarifs plus accessibles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hospital className="h-5 w-5 text-primary" />
                  Chong Hua Hospital
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Autre excellente option à Cebu City.
                  Accrédité JCI (standard international).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recommandation finale */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Heart className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-3">Notre recommandation</h3>
                  <p className="text-muted-foreground mb-4">
                    Pour une protection optimale, nous conseillons aux expatriés de combiner :
                  </p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                      <span><strong>PhilHealth</strong> comme couverture de base (obligatoire si salarié, recommandé sinon)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                      <span><strong>Une HMO locale</strong> (Maxicare, Intellicare) pour les soins courants et les consultations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                      <span><strong>Une assurance internationale</strong> pour les événements majeurs et le rapatriement si votre budget le permet</span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Des questions sur les démarches bancaires ou les assurances ? Échangez avec d'autres expatriés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vivre-aux-philippines/s-installer/visas"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Guide des visas
            </Link>
            <Link
              href="/forum-sur-les-philippines"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              Accéder au forum
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BanqueAssurancePage;
