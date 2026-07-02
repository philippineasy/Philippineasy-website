import { Metadata } from 'next';
import { Home, Building, MapPin, Search, Users, MessageSquare, DollarSign, CheckCircle, AlertTriangle, ExternalLink, Zap, Shield, Wifi, FileText, ChevronRight, Building2, TrendingUp } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faSackDollar, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, CardGrid, LinkCard } from '@/components/sections';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Trouver un Logement aux Philippines en 2026 : Prix et Conseils",
  description: "Guide complet pour trouver un logement aux Philippines : prix des loyers à Manila, Cebu et BGC en 2026, meilleures plateformes (Lamudi, Carousell), conseils pour la location et pièges à éviter.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/logement',
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
    url: 'https://philippineasy.com/vivre-aux-philippines/logement',
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

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
  { label: 'Logement' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
  { name: 'Logement', item: '/vivre-aux-philippines/logement' },
];

const LogementPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'logement');

  if (error) {
    console.error(error);
  }

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Trouver un"
        titleAccent="Logement"
        subtitle="Le guide pratique pour dénicher votre appartement ou maison aux Philippines, avec les prix actuels et les meilleures stratégies de recherche."
        imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1974&auto=format&fit=crop"
        imageAlt="Trouver un Logement"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        <Breadcrumb items={breadcrumbItems} />

        {/* Stats rapides */}
        <section className="mb-12">
          <StatRow
            stats={[
              { value: '3', label: 'types de logement', icon: <FontAwesomeIcon icon={faBuilding} className="text-[18px]" /> },
              { value: '14k', label: 'PHP minimum/mois', icon: <FontAwesomeIcon icon={faSackDollar} className="text-[18px]" /> },
              { value: '2', label: 'villes principales', icon: <FontAwesomeIcon icon={faLocationDot} className="text-[18px]" /> },
              { value: '12', label: 'mois de bail min.', icon: <FontAwesomeIcon icon={faClock} className="text-[18px]" /> },
            ]}
          />
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
          <CardGrid title="Les types de logements" subtitle="Choisissez celui qui correspond à votre style de vie" columns={3}>
            {/* Condominium */}
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest overflow-hidden">
              <div className="flex items-center gap-3 bg-muted px-5 py-4 border-b border-border">
                <span className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Condominium</h3>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Le choix préféré des expatriés. Sécurité 24/7, piscine, salle de sport et vue imprenable.
                </p>
                <div className="space-y-2">
                  {[
                    { icon: Shield, label: "Sécurité renforcée" },
                    { icon: CheckCircle, label: "Commodités incluses" },
                    { icon: Zap, label: "Générateur de secours" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Le plus populaire
                  </span>
                </div>
              </div>
            </div>

            {/* Maison */}
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest overflow-hidden">
              <div className="flex items-center gap-3 bg-muted px-5 py-4 border-b border-border">
                <span className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="h-5 w-5 text-primary" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Maison (House & Lot)</h3>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Plus d'espace et de tranquillité dans des "subdivisions" sécurisées avec gardiens.
                </p>
                <div className="space-y-2">
                  {[
                    { icon: CheckCircle, label: "Jardin privatif possible" },
                    { icon: TrendingUp, label: "Plus de surface habitable" },
                    { icon: Users, label: "Idéal pour les familles" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Pour les familles
                  </span>
                </div>
              </div>
            </div>

            {/* Appartement */}
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest overflow-hidden">
              <div className="flex items-center gap-3 bg-muted px-5 py-4 border-b border-border">
                <span className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building className="h-5 w-5 text-primary" />
                </span>
                <h3 className="font-bold text-lg text-foreground">Appartement</h3>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Option économique sans les commodités des condos mais souvent bien situés.
                </p>
                <div className="space-y-2">
                  {[
                    { icon: DollarSign, label: "Budget accessible" },
                    { icon: MapPin, label: "Emplacements variés" },
                    { icon: CheckCircle, label: "Contrats flexibles" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Budget serré
                  </span>
                </div>
              </div>
            </div>
          </CardGrid>
        </section>

        {/* Prix des loyers 2026 */}
        <section className="mb-16">
          <CardGrid title="Prix des loyers en 2026" subtitle="Comparatif entre les deux grandes métropoles" columns={2}>
            {/* Metro Manila */}
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest overflow-hidden">
              <div className="flex items-center gap-3 bg-muted px-6 py-4 border-b border-border">
                <span className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Metro Manila</h3>
                  <p className="text-muted-foreground text-sm">BGC, Makati, Rockwell, Ortigas</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-5">
                  La capitale économique avec les prix les plus élevés du pays dans les quartiers d'affaires.
                </p>

                <div className="space-y-4">
                  {[
                    { type: "Studio (20-30 m²)", min: 25000, max: 40000 },
                    { type: "1 chambre (35-50 m²)", min: 35000, max: 60000 },
                    { type: "2 chambres (60-80 m²)", min: 50000, max: 95000 },
                    { type: "3 chambres+ (100+ m²)", min: 80000, max: 150000 }
                  ].map((item, index) => (
                    <div key={index} className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">{item.type}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {(item.min / 1000).toFixed(0)}k - {(item.max / 1000).toFixed(0)}k PHP
                        </span>
                      </div>
                      <div className="w-full bg-card rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(item.max / 150000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cebu */}
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest overflow-hidden">
              <div className="flex items-center gap-3 bg-muted px-6 py-4 border-b border-border">
                <span className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Cebu City</h3>
                  <p className="text-muted-foreground text-sm">IT Park, Business Park, Lahug, Mactan</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-5">
                  Excellent rapport qualité-prix avec une scène expatriée dynamique et la proximité des plages.
                </p>

                <div className="space-y-4">
                  {[
                    { type: "Studio (20-30 m²)", min: 14000, max: 23000 },
                    { type: "1 chambre (35-50 m²)", min: 22000, max: 50000 },
                    { type: "2 chambres (60-80 m²)", min: 35000, max: 80000 },
                    { type: "Maison 2-3 ch.", min: 40000, max: 70000 }
                  ].map((item, index) => (
                    <div key={index} className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">{item.type}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {(item.min / 1000).toFixed(0)}k - {(item.max / 1000).toFixed(0)}k PHP
                        </span>
                      </div>
                      <div className="w-full bg-card rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(item.max / 150000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardGrid>

          {/* Charges supplémentaires */}
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-accent/5 border border-accent/25 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-accent-strong" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Charges à prévoir en plus du loyer</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { label: "Électricité", value: "3 000 - 8 000 PHP/mois" },
                      { label: "Eau", value: "300 - 800 PHP/mois" },
                      { label: "Internet fibre", value: "1 500 - 3 000 PHP/mois" },
                      { label: "Association fees", value: "2 000 - 6 000 PHP/mois" },
                      { label: "Parking", value: "2 000 - 5 000 PHP/mois" }
                    ].map((charge, index) => (
                      <div key={index} className="bg-card rounded-lg px-4 py-3 border border-border">
                        <span className="font-medium text-foreground text-sm">{charge.label}</span>
                        <p className="text-muted-foreground text-xs">{charge.value}</p>
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
          <CardGrid title="Où chercher un logement ?" subtitle="Les meilleures ressources pour votre recherche" columns={3}>
            {/* Plateformes en ligne */}
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Plateformes en ligne</h3>
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
                    className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 hover:bg-primary/10 transition-colors group"
                  >
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary">{platform.name}</span>
                      <p className="text-xs text-muted-foreground">{platform.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Groupes Facebook */}
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Groupes Facebook</h3>
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
                  <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{group}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 bg-muted rounded p-2">
                Tip: Recherchez "[Ville] + apartments + rent"
              </p>
            </div>

            {/* Agents immobiliers */}
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Agents immobiliers</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Les brokers facilitent la recherche haut de gamme.
              </p>
              <div className="space-y-2">
                {[
                  "Commission : 1 mois de loyer",
                  "Souvent payée par le propriétaire",
                  "Utile pour la négociation"
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{point}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 bg-muted rounded p-2">
                Vérifiez l'enregistrement PRC de l'agent
              </p>
            </div>
          </CardGrid>
        </section>

        {/* Conditions de location */}
        <section className="mb-16">
          <CardGrid title="Conditions de location" subtitle="Ce qu'il faut savoir avant de signer" columns={2}>
            {/* Dépôt et avance */}
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Dépôt et avance</h3>
              </div>

              <div className="bg-card rounded-xl p-5 text-center mb-4 shadow-card-rest">
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
            <div className="bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Durée et contrat</h3>
              </div>

              <div className="space-y-4">
                {[
                  { type: "Bail standard", desc: "12 mois, renouvelable. Pénalité si départ anticipé.", badge: "Classique" },
                  { type: "Courte durée", desc: "6 mois possible mais loyer majoré (+10-20%).", badge: "Flexible" },
                  { type: "Location meublée", desc: "Très courante, inclut souvent l'électroménager.", badge: "Pratique" }
                ].map((item, index) => (
                  <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{item.type}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{item.badge}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardGrid>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-16">
          <CardGrid title="Conseils pratiques" columns={2}>
            {/* À faire */}
            <div className="bg-primary/5 border border-primary/15 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 bg-primary/10 px-6 py-4">
                <CheckCircle className="h-6 w-6 text-primary" />
                <h3 className="font-bold text-lg text-foreground">À faire</h3>
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
                    <li key={index} className="flex items-start gap-3 bg-card rounded-lg p-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">{item.title}</span>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* À éviter */}
            <div className="bg-destructive/5 border border-destructive/15 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 bg-destructive/10 px-6 py-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <h3 className="font-bold text-lg text-foreground">À éviter</h3>
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
                    <li key={index} className="flex items-start gap-3 bg-card rounded-lg p-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">{item.title}</span>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardGrid>
        </section>

        {/* Exemple de message */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Comment contacter un propriétaire</h2>

          <div className="max-w-4xl mx-auto bg-card border-[0.5px] border-border rounded-2xl shadow-card-rest overflow-hidden">
            <div className="flex items-center gap-3 bg-muted px-6 py-4 border-b border-border">
              <span className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-primary" />
              </span>
              <h3 className="font-bold text-lg text-foreground">Exemple de message en anglais</h3>
            </div>
            <div className="p-6">
              <div className="bg-muted rounded-xl p-6 font-mono text-sm leading-relaxed text-foreground">
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

              <div className="mt-6 bg-primary/5 border border-primary/15 rounded-xl p-5">
                <h4 className="font-semibold text-foreground mb-3">Conseils de communication</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    "Communications principalement en anglais",
                    "Viber et WhatsApp très utilisés",
                    "Répondez vite : bons logements partent vite",
                    "Soyez poli mais direct"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
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
          <CardGrid
            title="Connectivité internet"
            subtitle="Crucial pour le télétravail - vérifiez la couverture avant de signer"
            columns={3}
          >
            {[
              { name: "PLDT Fibr", desc: "Leader du marché, bonne couverture", price: "1 699 PHP/mois" },
              { name: "Globe Fiber", desc: "Alternative solide, bon SAV", price: "1 499 PHP/mois" },
              { name: "Converge", desc: "Bon rapport qualité-prix", price: "1 500 PHP/mois" }
            ].map((provider, index) => (
              <div key={index} className="bg-card border-[0.5px] border-border rounded-xl shadow-card-rest p-5 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-foreground">{provider.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{provider.desc}</p>
                <p className="text-xs text-primary mt-2 bg-primary/10 rounded-full px-3 py-1 inline-block">
                  À partir de {provider.price}
                </p>
              </div>
            ))}
          </CardGrid>
        </section>

        {/* Investir dans l'immobilier locatif */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Investir dans l'immobilier locatif</h2>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Louer n'est pas la seule option : certains lecteurs envisagent d'acheter un bien aux Philippines pour le
                mettre en location plutôt que pour y vivre eux-mêmes. Cette logique d'investissement obéit à des règles
                différentes de celles d'une simple recherche de logement, avec un rendement locatif brut généralement
                compris entre 5 et 8% selon les zones.
              </p>
              <p>
                Les étrangers ne peuvent pas posséder de terrain aux Philippines, mais peuvent détenir un condominium à
                100% en nom propre, dans la limite d'un quota de 40% par immeuble. Une fiscalité spécifique s'applique
                également aux revenus locatifs.
              </p>
              <p>
                Si votre objectif est de générer un revenu locatif, notre guide dédié détaille le rendement par zone,
                la fiscalité et le processus d'achat. Si vous cherchez plutôt à acheter un bien pour y vivre vous-même,
                sans recherche de rendement, l'article sur l'achat immobilier aux Philippines répond à cette question
                précise.
              </p>
            </div>

            <CardGrid columns={2} className="mt-6">
              <LinkCard
                title="Investissement locatif"
                href="/vivre-aux-philippines/investir/immobilier"
                desc="Rendement, fiscalité, quota 40%"
                cta="En savoir plus"
              />
              <LinkCard
                title="Acheter pour y vivre"
                href="/vivre-aux-philippines/logement/acheter-immobilier-philippines"
                desc="Résidence principale, pas d'investissement"
                cta="En savoir plus"
              />
            </CardGrid>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t border-border pt-12 mb-16">
          <CardGrid title="Continuez votre exploration" columns={3}>
            <LinkCard title="Investir dans l'immobilier" href="/vivre-aux-philippines/investir/immobilier" desc="Acheter plutôt que louer" cta="En savoir plus" />
            <LinkCard title="Banques et assurances" href="/vivre-aux-philippines/banque-finances" desc="Ouvrir un compte bancaire" cta="En savoir plus" />
            <LinkCard title="Forum expatriés" href="/forum-sur-les-philippines" desc="Échangez avec la communauté" cta="En savoir plus" />
          </CardGrid>
        </section>

        {/* Nos articles Logement */}
        {articles && articles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Nos articles Logement</h2>
            <ArticleList articles={articles} basePath="vivre-aux-philippines" />
          </section>
        )}

      </div>
    </div>
  );
};

export default LogementPage;
