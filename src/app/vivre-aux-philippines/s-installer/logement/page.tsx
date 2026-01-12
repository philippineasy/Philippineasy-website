import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Home, Building, MapPin, Search, Users, MessageSquare, DollarSign, CheckCircle, AlertTriangle, ExternalLink, Zap, Shield, Wifi } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Trouver un Logement aux Philippines en 2025 : Prix et Conseils | Philippineasy",
  description: "Guide complet pour trouver un logement aux Philippines : prix des loyers à Manila, Cebu et BGC en 2025, meilleures plateformes (Lamudi, Carousell), conseils pour la location et pièges à éviter.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/s-installer/logement',
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
    title: "Trouver un Logement aux Philippines en 2025 : Prix et Conseils",
    description: "Prix des loyers à Manila et Cebu, meilleures plateformes de recherche, conseils pratiques pour expatriés. Guide actualisé 2025.",
    url: 'https://philippineasy.com/vivre-aux-philippines/s-installer/logement',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Logement aux Philippines 2025 : Guide Complet",
    description: "Prix des loyers, plateformes et conseils pour trouver un logement aux Philippines.",
  },
};

const LogementPage = () => {
  return (
    <div className="bg-background">
      <HeroThematic
        titlePart1="Trouver un"
        titlePart2="Logement"
        subtitle="Le guide pratique pour dénicher votre appartement ou maison aux Philippines, avec les prix actuels et les meilleures stratégies de recherche."
        imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1974&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Que vous visiez un condo moderne à BGC, un appartement abordable à Cebu ou une maison dans un village sécurisé,
            le marché locatif philippin offre des options pour tous les budgets. Ce guide vous aide à comprendre
            les prix actuels, les meilleures plateformes et les pratiques locales.
          </p>
        </section>

        {/* Types de logements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Les types de logements aux Philippines</h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="text-primary" />
                  Condominium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Le choix préféré des expatriés. Les condos offrent sécurité 24/7, piscine, salle de sport
                  et souvent une vue imprenable sur la ville.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Sécurité renforcée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Commodités incluses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span>Générateur de secours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Home className="text-primary" />
                  Maison (House & Lot)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Plus d'espace et de tranquillité. Les maisons se trouvent généralement dans des "subdivisions"
                  ou "villages" sécurisés avec gardiens.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Jardin privatif possible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Plus de surface habitable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>Idéal pour les familles</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="text-primary" />
                  Appartement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Option plus économique que les condos. Moins de commodités mais souvent
                  bien situés et plus abordables pour les longs séjours.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>Budget accessible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>Emplacements variés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Contrats flexibles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Prix des loyers 2025 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Prix des loyers en 2025</h2>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Metro Manila */}
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="text-primary" />
                  Metro Manila (BGC, Makati)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  La capitale économique reste la destination la plus prisée, avec des prix reflétant
                  la demande élevée dans les quartiers d'affaires.
                </p>

                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Fourchettes de prix mensuels</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span>Studio (20-30 m²)</span>
                        <span className="font-medium">25 000 - 40 000 PHP</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span>1 chambre (35-50 m²)</span>
                        <span className="font-medium">35 000 - 60 000 PHP</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span>2 chambres (60-80 m²)</span>
                        <span className="font-medium">50 000 - 95 000 PHP</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>3 chambres+ (100+ m²)</span>
                        <span className="font-medium">80 000 - 150 000+ PHP</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Quartiers prisés :</span> BGC (Fort Bonifacio), Makati CBD, Rockwell, Ortigas
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cebu */}
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="text-primary" />
                  Cebu City
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Deuxième ville du pays, Cebu offre un excellent rapport qualité-prix avec
                  une scène expatriée dynamique et la proximité des plages.
                </p>

                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Fourchettes de prix mensuels</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span>Studio (20-30 m²)</span>
                        <span className="font-medium">14 000 - 23 000 PHP</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span>1 chambre (35-50 m²)</span>
                        <span className="font-medium">22 000 - 50 000 PHP</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span>2 chambres (60-80 m²)</span>
                        <span className="font-medium">35 000 - 80 000 PHP</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Maison 2-3 ch.</span>
                        <span className="font-medium">40 000 - 70 000 PHP</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Quartiers prisés :</span> IT Park, Cebu Business Park, Lahug, Mandaue, Mactan
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Note sur les charges */}
          <Card className="max-w-5xl mx-auto mt-8 border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Zap className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2 text-amber-900">Charges à prévoir en plus du loyer</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-800">
                    <div>
                      <ul className="space-y-1">
                        <li>• <strong>Électricité :</strong> 3 000 - 8 000 PHP/mois (avec climatisation)</li>
                        <li>• <strong>Eau :</strong> 300 - 800 PHP/mois</li>
                        <li>• <strong>Internet fibre :</strong> 1 500 - 3 000 PHP/mois</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-1">
                        <li>• <strong>Association fees (condo) :</strong> 2 000 - 6 000 PHP/mois</li>
                        <li>• <strong>Parking :</strong> 2 000 - 5 000 PHP/mois</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Où chercher */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Où chercher un logement ?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Search className="text-primary" />
                  Plateformes en ligne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Les sites spécialisés sont le meilleur point de départ pour comparer les offres.
                </p>
                <ul className="space-y-2">
                  <li>
                    <a href="https://www.lamudi.com.ph/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <ExternalLink className="h-4 w-4" />
                      Lamudi.com.ph
                    </a>
                    <p className="text-xs text-muted-foreground ml-6">Le leader, large choix</p>
                  </li>
                  <li>
                    <a href="https://www.dotproperty.com.ph/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <ExternalLink className="h-4 w-4" />
                      DotProperty.com.ph
                    </a>
                    <p className="text-xs text-muted-foreground ml-6">Bonne interface, filtre par budget</p>
                  </li>
                  <li>
                    <a href="https://www.carousell.ph/categories/property-102" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <ExternalLink className="h-4 w-4" />
                      Carousell Property
                    </a>
                    <p className="text-xs text-muted-foreground ml-6">Annonces directes propriétaires</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Users className="text-primary" />
                  Groupes Facebook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Facebook Marketplace et les groupes locaux sont très utilisés aux Philippines.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>"Manila Expats Housing"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>"Cebu Apartments for Rent"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>"BGC Condo Rentals"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>"Makati Rentals - Direct Owners"</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  Recherchez "[Ville] + apartments/condo + rent" sur Facebook
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Building className="text-primary" />
                  Agents immobiliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Les brokers peuvent faciliter la recherche, surtout pour les logements haut de gamme.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Commission : généralement 1 mois de loyer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Payée par le propriétaire (souvent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Utile pour la négociation</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  Vérifiez que l'agent est enregistré auprès du PRC (Professional Regulation Commission)
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conditions de location */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conditions de location typiques</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <DollarSign className="text-primary" />
                  Dépôt et avance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  La formule standard aux Philippines est généralement :
                </p>
                <div className="bg-primary/10 rounded-lg p-4 text-center mb-4">
                  <p className="text-2xl font-bold text-primary">2 mois de dépôt + 1-2 mois d'avance</p>
                  <p className="text-sm text-muted-foreground mt-1">Soit 3 à 4 mois de loyer à l'entrée</p>
                </div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Le dépôt couvre les éventuels dommages et impayés</li>
                  <li>• Certains propriétaires acceptent des post-dated checks (PDC)</li>
                  <li>• Les chèques sont encore courants pour les paiements mensuels</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <FileText className="text-primary" />
                  Durée et contrat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Les baux sont généralement d'un an minimum, mais des options existent.
                </p>
                <div className="space-y-3">
                  <div className="border-b border-border pb-2">
                    <p className="font-medium">Bail standard</p>
                    <p className="text-sm text-muted-foreground">12 mois, renouvelable. Pénalité si départ anticipé.</p>
                  </div>
                  <div className="border-b border-border pb-2">
                    <p className="font-medium">Location courte durée</p>
                    <p className="text-sm text-muted-foreground">6 mois possible mais loyer majoré (+10-20%).</p>
                  </div>
                  <div>
                    <p className="font-medium">Location meublée</p>
                    <p className="text-sm text-muted-foreground">Très courante, inclut souvent l'électroménager.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils pratiques</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <CheckCircle className="text-green-600" />
                  À faire
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Visitez en personne</strong> avant de vous engager, les photos peuvent être trompeuses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Vérifiez la pression de l'eau</strong> et l'état de la climatisation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Testez la connexion internet</strong> disponible dans le bâtiment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Photographiez tout</strong> avant d'emménager pour l'état des lieux</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Demandez une copie du titre</strong> de propriété ou du contrat de gestion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Négociez</strong> : les loyers sont souvent discutables</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-3 text-red-800">
                  <AlertTriangle className="text-red-600" />
                  À éviter
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Ne payez jamais</strong> sans avoir vu le logement physiquement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Méfiez-vous des offres</strong> trop belles pour être vraies (arnaques fréquentes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Évitez les RDC</strong> si possible (inondations, sécurité)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Ne signez pas</strong> sans avoir lu intégralement le contrat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Vérifiez les nuisances</strong> : bruit, odeurs, trafic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Ne sous-estimez pas</strong> le temps de trajet aux heures de pointe</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Exemple de message */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Comment contacter un propriétaire</h2>

          <Card className="max-w-4xl mx-auto">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="text-primary" />
                Exemple de message en anglais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm">
                <p>Hello,</p>
                <br />
                <p>I saw your listing for the [1-bedroom condo] in [BGC/Makati] on [Lamudi/Facebook].</p>
                <br />
                <p>I'm a French expatriate looking for a long-term rental (12+ months). I'm interested in scheduling a viewing at your earliest convenience.</p>
                <br />
                <p>Could you please confirm:</p>
                <p>- If the unit is still available</p>
                <p>- The monthly rent and what's included</p>
                <p>- The required deposit and advance</p>
                <p>- When we could arrange a visit</p>
                <br />
                <p>Thank you for your time. I look forward to hearing from you.</p>
                <br />
                <p>Best regards,</p>
                <p>[Votre nom]</p>
                <p>[Votre numéro de téléphone]</p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Conseils de communication</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• La plupart des communications se font en anglais</li>
                  <li>• Viber et WhatsApp sont très utilisés pour les échanges rapides</li>
                  <li>• Répondez rapidement : les bons logements partent vite</li>
                  <li>• Soyez poli mais direct dans vos questions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Fournisseurs Internet */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Connectivité internet</h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-center text-muted-foreground mb-8">
              La connexion internet est cruciale, surtout si vous travaillez à distance.
              Vérifiez la couverture avant de signer un bail.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Wifi className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">PLDT Fibr</h4>
                  <p className="text-sm text-muted-foreground">Leader du marché, bonne couverture</p>
                  <p className="text-xs mt-2">À partir de 1 699 PHP/mois</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Wifi className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Globe Fiber</h4>
                  <p className="text-sm text-muted-foreground">Alternative solide, bon SAV</p>
                  <p className="text-xs mt-2">À partir de 1 499 PHP/mois</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Wifi className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Converge</h4>
                  <p className="text-sm text-muted-foreground">Bon rapport qualité-prix</p>
                  <p className="text-xs mt-2">À partir de 1 500 PHP/mois</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Vous cherchez plutôt à acheter un bien immobilier ? Consultez notre guide sur l'investissement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vivre-aux-philippines/investir/immobilier"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Guide achat immobilier
            </Link>
            <Link
              href="/forum-sur-les-philippines"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              Poser une question sur le forum
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

// Add missing import
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default LogementPage;
