import { Metadata } from 'next';
import { Home, Building, MapPin, Search, Users, MessageSquare, DollarSign, CheckCircle, AlertTriangle, ExternalLink, Zap, Shield, Wifi, FileText, ChevronRight, Clock, Building2, TrendingUp } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Trouver un Logement aux Philippines en 2026 : Prix et Conseils | Philippineasy",
  description: "Guide complet pour trouver un logement aux Philippines : prix des loyers à Manila, Cebu et BGC en 2026, meilleures plateformes (Lamudi, Carousell), conseils pour la location et pièges à éviter.",
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
    title: "Trouver un Logement aux Philippines en 2026 : Prix et Conseils",
    description: "Prix des loyers à Manila et Cebu, meilleures plateformes de recherche, conseils pratiques pour expatriés. Guide actualisé 2026.",
    url: 'https://philippineasy.com/vivre-aux-philippines/s-installer/logement',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Logement aux Philippines 2026 : Guide Complet",
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

        {/* Stats rapides */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 text-center">
              <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-700">3</p>
              <p className="text-sm text-blue-600">types de logement</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700">14k</p>
              <p className="text-sm text-green-600">PHP minimum/mois</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 text-center">
              <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-700">2</p>
              <p className="text-sm text-purple-600">villes principales</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 text-center">
              <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-amber-700">12</p>
              <p className="text-sm text-amber-600">mois de bail min.</p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Que vous visiez un condo moderne à BGC, un appartement abordable à Cebu ou une maison dans un village sécurisé,
            le marché locatif philippin offre des options pour tous les budgets. Ce guide vous aide à comprendre
            les prix actuels, les meilleures plateformes et les pratiques locales.
          </p>
        </section>

        {/* Types de logements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Les types de logements</h2>
          <p className="text-center text-muted-foreground mb-8">Choisissez celui qui correspond à votre style de vie</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Condominium */}
            <div className="bg-white border-l-4 border-l-blue-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">Condominium</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Le choix préféré des expatriés. Sécurité 24/7, piscine, salle de sport et vue imprenable.
                </p>
                <div className="space-y-2">
                  {[
                    { icon: Shield, label: "Sécurité renforcée", color: "blue" },
                    { icon: CheckCircle, label: "Commodités incluses", color: "blue" },
                    { icon: Zap, label: "Générateur de secours", color: "blue" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                      <item.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    Le plus populaire
                  </span>
                </div>
              </div>
            </div>

            {/* Maison */}
            <div className="bg-white border-l-4 border-l-green-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">Maison (House & Lot)</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Plus d'espace et de tranquillité dans des "subdivisions" sécurisées avec gardiens.
                </p>
                <div className="space-y-2">
                  {[
                    { icon: CheckCircle, label: "Jardin privatif possible", color: "green" },
                    { icon: TrendingUp, label: "Plus de surface habitable", color: "green" },
                    { icon: Users, label: "Idéal pour les familles", color: "green" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                      <item.icon className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Pour les familles
                  </span>
                </div>
              </div>
            </div>

            {/* Appartement */}
            <div className="bg-white border-l-4 border-l-amber-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Building className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">Appartement</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Option économique sans les commodités des condos mais souvent bien situés.
                </p>
                <div className="space-y-2">
                  {[
                    { icon: DollarSign, label: "Budget accessible", color: "amber" },
                    { icon: MapPin, label: "Emplacements variés", color: "amber" },
                    { icon: CheckCircle, label: "Contrats flexibles", color: "amber" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
                      <item.icon className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-800">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                    Budget serré
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prix des loyers 2026 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Prix des loyers en 2026</h2>
          <p className="text-center text-muted-foreground mb-8">Comparatif entre les deux grandes métropoles</p>

          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Metro Manila */}
            <div className="bg-white border-l-4 border-l-indigo-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-white" />
                  <div>
                    <h3 className="font-bold text-lg text-white">Metro Manila</h3>
                    <p className="text-indigo-100 text-sm">BGC, Makati, Rockwell, Ortigas</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-5">
                  La capitale économique avec les prix les plus élevés du pays dans les quartiers d'affaires.
                </p>

                <div className="space-y-4">
                  {[
                    { type: "Studio (20-30 m²)", min: 25000, max: 40000, color: "indigo" },
                    { type: "1 chambre (35-50 m²)", min: 35000, max: 60000, color: "indigo" },
                    { type: "2 chambres (60-80 m²)", min: 50000, max: 95000, color: "indigo" },
                    { type: "3 chambres+ (100+ m²)", min: 80000, max: 150000, color: "indigo" }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          {(item.min / 1000).toFixed(0)}k - {(item.max / 1000).toFixed(0)}k PHP
                        </span>
                      </div>
                      <div className="w-full bg-indigo-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${(item.max / 150000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cebu */}
            <div className="bg-white border-l-4 border-l-teal-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-white" />
                  <div>
                    <h3 className="font-bold text-lg text-white">Cebu City</h3>
                    <p className="text-teal-100 text-sm">IT Park, Business Park, Lahug, Mactan</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-5">
                  Excellent rapport qualité-prix avec une scène expatriée dynamique et la proximité des plages.
                </p>

                <div className="space-y-4">
                  {[
                    { type: "Studio (20-30 m²)", min: 14000, max: 23000, color: "teal" },
                    { type: "1 chambre (35-50 m²)", min: 22000, max: 50000, color: "teal" },
                    { type: "2 chambres (60-80 m²)", min: 35000, max: 80000, color: "teal" },
                    { type: "Maison 2-3 ch.", min: 40000, max: 70000, color: "teal" }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                          {(item.min / 1000).toFixed(0)}k - {(item.max / 1000).toFixed(0)}k PHP
                        </span>
                      </div>
                      <div className="w-full bg-teal-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full"
                          style={{ width: `${(item.max / 150000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charges supplémentaires */}
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-3">Charges à prévoir en plus du loyer</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { label: "Électricité", value: "3 000 - 8 000 PHP/mois" },
                      { label: "Eau", value: "300 - 800 PHP/mois" },
                      { label: "Internet fibre", value: "1 500 - 3 000 PHP/mois" },
                      { label: "Association fees", value: "2 000 - 6 000 PHP/mois" },
                      { label: "Parking", value: "2 000 - 5 000 PHP/mois" }
                    ].map((charge, index) => (
                      <div key={index} className="bg-white rounded-lg px-4 py-3 border border-amber-100">
                        <span className="font-medium text-amber-800 text-sm">{charge.label}</span>
                        <p className="text-amber-700 text-xs">{charge.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Où chercher */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Où chercher un logement ?</h2>
          <p className="text-center text-muted-foreground mb-8">Les meilleures ressources pour votre recherche</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Plateformes en ligne */}
            <div className="bg-white border-l-4 border-l-blue-500 rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Plateformes en ligne</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Les sites spécialisés sont le meilleur point de départ.
              </p>
              <div className="space-y-3">
                {[
                  { name: "Lamudi.com.ph", desc: "Le leader, large choix", url: "https://www.lamudi.com.ph/" },
                  { name: "DotProperty.com.ph", desc: "Bonne interface", url: "https://www.dotproperty.com.ph/" },
                  { name: "Carousell Property", desc: "Annonces directes", url: "https://www.carousell.ph/categories/property-102" }
                ].map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors group"
                  >
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-sm font-medium text-blue-800 group-hover:text-blue-900">{platform.name}</span>
                      <p className="text-xs text-blue-600">{platform.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Groupes Facebook */}
            <div className="bg-white border-l-4 border-l-purple-500 rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Groupes Facebook</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Facebook Marketplace et groupes locaux sont très utilisés.
              </p>
              <div className="space-y-2">
                {[
                  "Manila Expats Housing",
                  "Cebu Apartments for Rent",
                  "BGC Condo Rentals",
                  "Makati Rentals - Direct Owners"
                ].map((group, index) => (
                  <div key={index} className="flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-800">{group}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 bg-gray-50 rounded p-2">
                Tip: Recherchez "[Ville] + apartments + rent"
              </p>
            </div>

            {/* Agents immobiliers */}
            <div className="bg-white border-l-4 border-l-green-500 rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Agents immobiliers</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Les brokers facilitent la recherche haut de gamme.
              </p>
              <div className="space-y-2">
                {[
                  "Commission : 1 mois de loyer",
                  "Souvent payée par le propriétaire",
                  "Utile pour la négociation"
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">{point}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 bg-gray-50 rounded p-2">
                Vérifiez l'enregistrement PRC de l'agent
              </p>
            </div>
          </div>
        </section>

        {/* Conditions de location */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Conditions de location</h2>
          <p className="text-center text-muted-foreground mb-8">Ce qu'il faut savoir avant de signer</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Dépôt et avance */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Dépôt et avance</h3>
              </div>

              <div className="bg-white rounded-xl p-5 text-center mb-4 shadow-sm">
                <p className="text-3xl font-bold text-primary">2 + 1-2</p>
                <p className="text-sm text-muted-foreground">mois de dépôt + mois d'avance</p>
                <p className="text-xs text-muted-foreground mt-1">= 3 à 4 mois à l'entrée</p>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Le dépôt couvre dommages et impayés
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Post-dated checks parfois acceptés
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Chèques encore courants pour paiements mensuels
                </li>
              </ul>
            </div>

            {/* Durée et contrat */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-bold text-lg">Durée et contrat</h3>
              </div>

              <div className="space-y-4">
                {[
                  { type: "Bail standard", desc: "12 mois, renouvelable. Pénalité si départ anticipé.", badge: "Classique" },
                  { type: "Courte durée", desc: "6 mois possible mais loyer majoré (+10-20%).", badge: "Flexible" },
                  { type: "Location meublée", desc: "Très courante, inclut souvent l'électroménager.", badge: "Pratique" }
                ].map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.type}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.badge}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils pratiques</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* À faire */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">À faire</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {[
                    { title: "Visitez en personne", desc: "Les photos peuvent être trompeuses" },
                    { title: "Vérifiez la pression de l'eau", desc: "Et l'état de la climatisation" },
                    { title: "Testez la connexion internet", desc: "Disponible dans le bâtiment" },
                    { title: "Photographiez tout", desc: "Avant d'emménager pour l'état des lieux" },
                    { title: "Demandez une copie du titre", desc: "De propriété ou du contrat de gestion" },
                    { title: "Négociez", desc: "Les loyers sont souvent discutables" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-green-800">{item.title}</span>
                        <p className="text-sm text-green-700">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* À éviter */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">À éviter</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {[
                    { title: "Ne payez jamais", desc: "Sans avoir vu le logement physiquement" },
                    { title: "Méfiez-vous des offres", desc: "Trop belles pour être vraies (arnaques)" },
                    { title: "Évitez les RDC", desc: "Si possible (inondations, sécurité)" },
                    { title: "Ne signez pas", desc: "Sans avoir lu intégralement le contrat" },
                    { title: "Vérifiez les nuisances", desc: "Bruit, odeurs, trafic" },
                    { title: "Ne sous-estimez pas", desc: "Le temps de trajet aux heures de pointe" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-red-800">{item.title}</span>
                        <p className="text-sm text-red-700">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Exemple de message */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Comment contacter un propriétaire</h2>

          <div className="max-w-4xl mx-auto bg-white border-l-4 border-l-cyan-500 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-white" />
                <h3 className="font-bold text-lg text-white">Exemple de message en anglais</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6 font-mono text-sm leading-relaxed text-gray-700">
                <p>Hello,</p>
                <br />
                <p>I saw your listing for the [1-bedroom condo] in [BGC/Makati] on [Lamudi/Facebook].</p>
                <br />
                <p>I'm a French expatriate looking for a long-term rental (12+ months). I'm interested in scheduling a viewing at your earliest convenience.</p>
                <br />
                <p>Could you please confirm:</p>
                <p className="ml-4">- If the unit is still available</p>
                <p className="ml-4">- The monthly rent and what's included</p>
                <p className="ml-4">- The required deposit and advance</p>
                <p className="ml-4">- When we could arrange a visit</p>
                <br />
                <p>Thank you for your time.</p>
                <br />
                <p>Best regards,<br />[Votre nom]<br />[Votre numéro]</p>
              </div>

              <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-xl p-5">
                <h4 className="font-semibold text-cyan-900 mb-3">Conseils de communication</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    "Communications principalement en anglais",
                    "Viber et WhatsApp très utilisés",
                    "Répondez vite : bons logements partent vite",
                    "Soyez poli mais direct"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-cyan-800">
                      <CheckCircle className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fournisseurs Internet */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Connectivité internet</h2>
          <p className="text-center text-muted-foreground mb-8">
            Crucial pour le télétravail - vérifiez la couverture avant de signer
          </p>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { name: "PLDT Fibr", desc: "Leader du marché, bonne couverture", price: "1 699 PHP/mois", color: "blue" },
              { name: "Globe Fiber", desc: "Alternative solide, bon SAV", price: "1 499 PHP/mois", color: "green" },
              { name: "Converge", desc: "Bon rapport qualité-prix", price: "1 500 PHP/mois", color: "purple" }
            ].map((provider, index) => (
              <div key={index} className={`bg-gradient-to-br from-${provider.color}-50 to-${provider.color}-100 border border-${provider.color}-200 rounded-xl p-5 text-center`}>
                <div className={`w-12 h-12 bg-${provider.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Wifi className={`h-6 w-6 text-${provider.color}-600`} />
                </div>
                <h4 className={`font-bold text-${provider.color}-800`}>{provider.name}</h4>
                <p className={`text-sm text-${provider.color}-700 mt-1`}>{provider.desc}</p>
                <p className={`text-xs text-${provider.color}-600 mt-2 bg-white/60 rounded-full px-3 py-1 inline-block`}>
                  À partir de {provider.price}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t border-gray-200 pt-12">
          <h3 className="text-xl font-semibold text-center mb-6">Continuez votre exploration</h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { title: "Investir dans l'immobilier", href: "/vivre-aux-philippines/investir/immobilier", desc: "Acheter plutôt que louer" },
              { title: "Banques et assurances", href: "/vivre-aux-philippines/s-installer/banque-assurance", desc: "Ouvrir un compte bancaire" },
              { title: "Forum expatriés", href: "/forum-sur-les-philippines", desc: "Échangez avec la communauté" }
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
              >
                <div>
                  <p className="font-medium group-hover:text-primary transition-colors">{link.title}</p>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default LogementPage;
