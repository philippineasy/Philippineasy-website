import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Briefcase, TrendingUp, Building, Info, AlertTriangle, CheckCircle, ExternalLink, ChevronRight, DollarSign, LineChart, PieChart, Users, Globe, Shield, Calculator, FileText } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Investir en Bourse aux Philippines en 2026 : PSE, Actions, Entreprises | Philippineasy",
  description: "Guide complet pour investir à la bourse philippine (PSE) et dans les entreprises locales : ouverture de compte, fiscalité, secteurs porteurs, SIRV 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/investir/bourse-et-entreprises',
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
    title: "Investir en Bourse aux Philippines en 2026 : PSE, Actions, Entreprises",
    description: "Guide complet pour investir à la bourse philippine (PSE) et dans les entreprises locales : ouverture de compte, fiscalité, secteurs porteurs.",
    url: 'https://philippineasy.com/vivre-aux-philippines/investir/bourse-et-entreprises',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Investir en Bourse aux Philippines en 2026",
    description: "Guide pour investir à la bourse philippine (PSE) : compte, fiscalité, entreprises.",
    site: '@philippineasy',
  },
};

const BourseEntreprisesPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Investir en Bourse"
        titlePart2="et Entreprises"
        subtitle="Guide complet pour investir à la bourse philippine et dans les entreprises locales : PSE, secteurs porteurs, fiscalité et visa investisseur."
        imageUrl="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-muted-foreground mb-6">
            Au-delà de l'immobilier, les Philippines offrent des opportunités d'investissement diversifiées via
            le marché boursier local (PSE) et l'investissement direct dans les entreprises. Avec une économie
            parmi les plus dynamiques d'Asie du Sud-Est, le pays attire les investisseurs en quête de croissance
            à long terme.
          </p>
        </section>

        {/* PSE Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">La Bourse Philippine (PSE)</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Le Philippine Stock Exchange est le marché boursier national, avec plus de 280 sociétés cotées.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <LineChart className="h-10 w-10 text-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">PSEi (indice principal)</p>
                <p className="text-3xl font-bold mb-2">~6,200</p>
                <p className="text-sm text-muted-foreground">30 plus grandes entreprises</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Building className="h-10 w-10 text-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Sociétés cotées</p>
                <p className="text-3xl font-bold mb-2">280+</p>
                <p className="text-sm text-muted-foreground">Tous secteurs confondus</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-10 w-10 text-green-600 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Objectif PSEi fin 2026</p>
                <p className="text-3xl font-bold mb-2">6,500</p>
                <p className="text-sm text-muted-foreground">Scénario base First Metro</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Actions A et B */}
        <div className="flex items-start space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-16">
          <Info className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Actions de Classe A et Classe B</h3>
            <p className="text-muted-foreground mb-3">
              De nombreuses sociétés philippines émettent deux classes d'actions :
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">Classe A :</span>
                <span className="text-muted-foreground">Réservées aux citoyens philippins uniquement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-700">Classe B :</span>
                <span className="text-muted-foreground">Ouvertes aux étrangers ET aux Philippins (mêmes droits, mêmes dividendes)</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              La participation étrangère totale dans une société ne peut généralement pas dépasser 40% du capital,
              sauf dans certains secteurs non restreints.
            </p>
          </div>
        </div>

        {/* Comment investir */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Comment Investir à la PSE</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-3">
                  <Globe className="text-green-600" />
                  Via un Broker International
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  La solution la plus simple pour les non-résidents. Plusieurs courtiers internationaux
                  donnent accès au marché philippin.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span><strong>Interactive Brokers</strong> - Frais bas, accès multi-marchés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span><strong>Boom Securities</strong> (Hong Kong) - Spécialisé Asie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span><strong>XTB</strong> - CFD sur actions philippines</span>
                  </li>
                </ul>
                <p className="text-sm text-amber-700 mt-3">
                  Note : Vérifiez que le broker est régulé et accepte les résidents de votre pays.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-3">
                  <Building className="text-blue-600" />
                  Via un Broker Local
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  Si vous avez un visa de résident ou séjournez régulièrement aux Philippines.
                  Nécessite souvent une visite physique pour l'ouverture de compte.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span><strong>COL Financial</strong> - Le plus populaire, app mobile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span><strong>First Metro Securities</strong> - Filiale de Metrobank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span><strong>BDO Securities</strong> - Lié à BDO Unibank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span><strong>BPI Trade</strong> - Filiale de BPI</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Documents requis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Documents pour Ouvrir un Compte</h2>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Broker International</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Passeport ou carte d'identité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Justificatif de domicile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Formulaire fiscal W-8BEN (si broker US)</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">Ouverture 100% en ligne</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Broker Local</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Passeport + visa de résident</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>ACR I-Card (si applicable)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>TIN philippin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Preuve d'adresse locale</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">Visite en agence souvent requise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Fiscalité */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Fiscalité des Investissements</h2>
          <div className="overflow-x-auto max-w-4xl mx-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-3 text-left">Type de Revenu</th>
                  <th className="border p-3 text-left">Taux pour Non-Résidents</th>
                  <th className="border p-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Dividendes (personne physique)</td>
                  <td className="border p-3">25%</td>
                  <td className="border p-3 text-sm">Retenue à la source</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Dividendes (société étrangère)</td>
                  <td className="border p-3">30%</td>
                  <td className="border p-3 text-sm">Peut être réduit par convention fiscale</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Taxe sur transaction (vente)</td>
                  <td className="border p-3">0.6%</td>
                  <td className="border p-3 text-sm">Stock Transaction Tax</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Frais PSE (achat/vente)</td>
                  <td className="border p-3">0.005%</td>
                  <td className="border p-3 text-sm">Sur le montant brut</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">TVA sur frais de courtage</td>
                  <td className="border p-3">12%</td>
                  <td className="border p-3 text-sm">Sur les commissions du broker</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4 max-w-3xl mx-auto">
            Consultez un conseiller fiscal pour comprendre l'interaction avec la fiscalité de votre pays de résidence.
            La France a une convention fiscale avec les Philippines.
          </p>
        </section>

        {/* Secteurs porteurs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Secteurs Porteurs en 2026</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="text-primary" />
                  Immobilier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Grands promoteurs avec portefeuilles diversifiés (centres commerciaux, bureaux, résidentiel).
                </p>
                <p className="text-sm font-medium">Exemples : SM Prime (SMPH), Ayala Land (ALI), Megaworld</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <DollarSign className="text-primary" />
                  Services Financiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Banques et assurances en expansion avec la bancarisation croissante de la population.
                </p>
                <p className="text-sm font-medium">Exemples : BDO, BPI, Metrobank, Security Bank</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="text-primary" />
                  Consommation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Classe moyenne en expansion, forte demande de biens de consommation et restauration.
                </p>
                <p className="text-sm font-medium">Exemples : Jollibee (JFC), Universal Robina (URC), SM Retail</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="text-primary" />
                  Télécoms & Tech
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Croissance de l'internet fixe et mobile, data centers, IA et services cloud.
                </p>
                <p className="text-sm font-medium">Exemples : PLDT, Globe Telecom, Converge ICT</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="text-primary" />
                  Utilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Demande énergétique croissante, projets d'énergies renouvelables.
                </p>
                <p className="text-sm font-medium">Exemples : Meralco (MER), Aboitiz Power, First Gen</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Briefcase className="text-primary" />
                  Conglomérats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Holdings diversifiées exposées à plusieurs secteurs de l'économie.
                </p>
                <p className="text-sm font-medium">Exemples : SM Investments (SM), Ayala Corp (AC), GT Capital</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Investir dans une entreprise non cotée */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Investir dans une Entreprise Non Cotée</h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-4 bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
              <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-xl mb-2 text-amber-900">Règle des 40%</h3>
                <p className="text-amber-800">
                  La participation étrangère dans une entreprise philippine non cotée est généralement limitée à <strong>40%</strong>.
                  Certains secteurs (comme l'export ou la tech) permettent 100% de propriété étrangère, mais vérifiez toujours
                  la Foreign Investment Negative List (FINL) avant d'investir.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Avantages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Potentiel de rendement élevé</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Accès à des secteurs non cotés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Influence directe sur la gestion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Peut donner accès au SIRV</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risques</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>Liquidité faible ou nulle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>Due diligence complexe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>Risque de fraude plus élevé</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>Sortie difficile à négocier</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SIRV */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Visa Investisseur : SIRV</h2>
          <Card className="max-w-4xl mx-auto border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="text-primary" />
                Special Investor's Resident Visa (SIRV)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Le SIRV permet de résider indéfiniment aux Philippines en échange d'un investissement qualifié.
                C'est une alternative intéressante aux visas de retraite pour les investisseurs actifs.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Conditions Principales</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Investissement minimum : <strong>US$75,000</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Âge minimum : 21 ans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Casier judiciaire vierge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Frais de dossier : ~US$300</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Investissements Éligibles</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Actions de sociétés cotées (PSE)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Entreprises dans les secteurs prioritaires (IPP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>Immobilier NON éligible</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Processus</h3>
                <p className="text-sm text-muted-foreground">
                  1. Dépôt de US$75,000 minimum à la DBP ou Land Bank (dépôt à terme 30-180 jours) →
                  2. Obtention d'un visa probatoire →
                  3. Conversion du dépôt en investissement qualifié sous 180 jours →
                  4. Rapport à la BOI →
                  5. Visa permanent tant que l'investissement est maintenu
                </p>
              </div>

              <a
                href="https://boi.gov.ph/wp-content/uploads/2019/11/SIRV-FAQ.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline font-medium"
              >
                FAQ officielle SIRV (BOI) <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </CardContent>
          </Card>
        </section>

        {/* Conseils */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils Pratiques</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <PieChart className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Diversifiez</h3>
                <p className="text-muted-foreground">
                  Ne concentrez pas tous vos investissements philippins sur un seul secteur.
                  Combinez actions, immobilier et peut-être une participation dans une PME locale.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Calculator className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Anticipez la Fiscalité</h3>
                <p className="text-muted-foreground">
                  Les retenues à la source sur dividendes sont élevées (25-30%). Vérifiez les conventions
                  fiscales et consultez un expert pour optimiser votre situation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <FileText className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Documentez Tout</h3>
                <p className="text-muted-foreground">
                  Conservez tous les justificatifs de transferts de fonds et d'achats d'actions.
                  Ils seront nécessaires pour le rapatriement des dividendes et plus-values.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <AlertTriangle className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Méfiez-vous des Arnaques</h3>
                <p className="text-muted-foreground">
                  Les "opportunités d'investissement" non régulées pullulent. N'investissez que via
                  des courtiers licenciés par la SEC Philippines et vérifiez les registres officiels.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Ressources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources Officielles</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="https://www.pse.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Philippine Stock Exchange</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://edge.pse.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>PSE Edge (données marché)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.sec.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>SEC Philippines</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://boi.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Board of Investments</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.colfinancial.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>COL Financial</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.firstmetrosec.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>First Metro Securities</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/vivre-aux-philippines/investir/immobilier"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Investir dans l'Immobilier</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/vivre-aux-philippines/travailler/creer-entreprise"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Créer une Entreprise</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/vivre-aux-philippines/s-installer/visas"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Visas et Permis</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BourseEntreprisesPage;
