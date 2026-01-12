import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Home, Building, DollarSign, Landmark, Info, Users, AlertTriangle, CheckCircle, ExternalLink, ChevronRight, MapPin, TrendingUp, Calculator, FileText, Shield, Scale } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Investir dans l'Immobilier aux Philippines en 2026 : Guide Complet | Philippineasy",
  description: "Guide complet pour acheter un bien immobilier aux Philippines en tant qu'étranger : condos, règle des 40%, prix par zone, fiscalité et démarches 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/investir/immobilier',
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
    title: "Investir dans l'Immobilier aux Philippines en 2026 : Guide Complet",
    description: "Guide complet pour acheter un bien immobilier aux Philippines en tant qu'étranger : condos, règle des 40%, prix par zone, fiscalité et démarches 2026.",
    url: 'https://philippineasy.com/vivre-aux-philippines/investir/immobilier',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Investir dans l'Immobilier aux Philippines en 2026",
    description: "Guide pour acheter un bien immobilier aux Philippines : condos, prix, fiscalité.",
    site: '@philippineasy',
  },
};

const ImmobilierPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Investir dans"
        titlePart2="l'Immobilier"
        subtitle="Guide complet pour investir dans le marché immobilier philippin : réglementation, prix, fiscalité et opportunités pour les étrangers."
        imageUrl="/images/investir/vue-condominium-philippines.webp"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-muted-foreground mb-6">
            Avec une économie en croissance, une classe moyenne en expansion et des rendements locatifs attractifs
            (5-8% bruts dans les zones prime), les Philippines attirent de nombreux investisseurs étrangers. Cependant,
            la législation impose des restrictions importantes qu'il est essentiel de comprendre avant d'investir.
          </p>
        </section>

        {/* Règle d'or */}
        <div className="flex items-start space-x-4 bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-4xl mx-auto mb-12">
          <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-xl mb-2 text-amber-900">La Règle Fondamentale</h3>
            <p className="text-amber-800 mb-3">
              <strong>Les étrangers ne peuvent pas posséder de terrain aux Philippines.</strong> C'est une restriction
              constitutionnelle (Article XII, Section 7). Seuls les citoyens philippins ou les sociétés détenues à
              60% minimum par des Philippins peuvent être propriétaires fonciers.
            </p>
            <p className="text-amber-800">
              En revanche, vous pouvez être <strong>propriétaire à 100% d'un condominium</strong> (Republic Act 4726),
              tant que la part étrangère dans l'immeuble ne dépasse pas 40% du total des unités.
            </p>
          </div>
        </div>

        {/* Ce que vous pouvez acheter */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Ce que Vous Pouvez Acheter</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Les options légales pour les investisseurs étrangers aux Philippines.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-3">
                  <Building className="text-green-600" />
                  Condominium
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  L'option la plus simple et la plus sûre. Propriété en nom propre, titre CCT (Condominium Certificate of Title).
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Propriété 100% en votre nom</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Quota 40% étrangers par projet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Transmissible par héritage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-3">
                  <Home className="text-blue-600" />
                  Maison (bâtiment seul)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  Vous pouvez posséder le bâtiment mais pas le terrain sur lequel il est construit.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Bail de terrain (25-75 ans max)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>Plus complexe juridiquement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>Financement difficile</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Landmark className="text-primary" />
                  Via une Corporation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  Créer une société philippine pour acquérir un terrain (y compris maison + terrain).
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Accès à la propriété foncière</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>60% minimum de parts philippines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>Coûts de structure élevés</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Info quota 40% */}
        <div className="flex items-start space-x-4 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-16">
          <Info className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Attention au Quota des 40%</h3>
            <p className="text-muted-foreground mb-3">
              En 2026, le quota de 40% s'applique <strong>par projet</strong>, pas au niveau national. Un immeuble populaire
              auprès des étrangers peut rapidement atteindre sa limite. Vérifiez toujours la disponibilité du quota auprès
              du développeur ou de la Condominium Corporation avant de verser un acompte.
            </p>
            <p className="text-sm text-muted-foreground">
              Si le quota est atteint, vous pourrez peut-être acheter via une société à 60% philippine, mais cela change
              radicalement la structure de propriété.
            </p>
          </div>
        </div>

        {/* Prix par zone */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Prix de l'Immobilier en 2026</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Prix indicatifs par mètre carré dans les principales zones de Metro Manila.
          </p>

          <div className="overflow-x-auto max-w-4xl mx-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-3 text-left">Zone</th>
                  <th className="border p-3 text-left">Prix/m² (₱)</th>
                  <th className="border p-3 text-left">Prix/m² (€)</th>
                  <th className="border p-3 text-left">Profil</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Rockwell (Makati)</td>
                  <td className="border p-3">₱350,000 - 550,000</td>
                  <td className="border p-3">€5,600 - 8,800</td>
                  <td className="border p-3 text-sm">Ultra-luxe, plus cher de Manila</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">BGC (Taguig)</td>
                  <td className="border p-3">₱280,000 - 500,000</td>
                  <td className="border p-3">€4,500 - 8,000</td>
                  <td className="border p-3 text-sm">CBD moderne, expats, entreprises</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Makati CBD</td>
                  <td className="border p-3">₱250,000 - 450,000</td>
                  <td className="border p-3">€4,000 - 7,200</td>
                  <td className="border p-3 text-sm">Centre d'affaires historique</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Ortigas</td>
                  <td className="border p-3">₱150,000 - 280,000</td>
                  <td className="border p-3">€2,400 - 4,500</td>
                  <td className="border p-3 text-sm">Second CBD, BPO, bureaux</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Quezon City</td>
                  <td className="border p-3">₱120,000 - 200,000</td>
                  <td className="border p-3">€1,900 - 3,200</td>
                  <td className="border p-3 text-sm">Plus grande ville, universités</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Mandaluyong</td>
                  <td className="border p-3">₱100,000 - 180,000</td>
                  <td className="border p-3">€1,600 - 2,900</td>
                  <td className="border p-3 text-sm">Connecté, bon rapport qualité/prix</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Caloocan/Valenzuela</td>
                  <td className="border p-3">₱70,000 - 130,000</td>
                  <td className="border p-3">€1,100 - 2,100</td>
                  <td className="border p-3 text-sm">Entry-level, plus accessible</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            * Prix indicatifs janvier 2026. Conversion approximative à 1€ = ₱62.5
          </p>
        </section>

        {/* Exemples de prix */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Exemples de Prix par Type</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Studio (25-35 m²)</p>
                <p className="text-3xl font-bold text-primary mb-2">₱6-12M</p>
                <p className="text-sm text-muted-foreground">€96,000 - €192,000</p>
                <p className="text-xs mt-3">BGC/Makati</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">1 chambre (40-55 m²)</p>
                <p className="text-3xl font-bold text-primary mb-2">₱12-22M</p>
                <p className="text-sm text-muted-foreground">€192,000 - €352,000</p>
                <p className="text-xs mt-3">BGC/Makati</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">2-3 chambres (80-120 m²)</p>
                <p className="text-3xl font-bold text-primary mb-2">₱20-45M</p>
                <p className="text-sm text-muted-foreground">€320,000 - €720,000</p>
                <p className="text-xs mt-3">BGC/Makati</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Autres zones */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Hors Metro Manila</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="text-primary" />
                  Cebu City
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Deuxième métropole, IT Park et Business Park en croissance.
                </p>
                <p className="font-semibold">₱80,000 - 180,000/m²</p>
                <p className="text-sm text-muted-foreground">€1,280 - €2,880/m²</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="text-primary" />
                  Davao
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Capitale de Mindanao, en développement rapide.
                </p>
                <p className="font-semibold">₱60,000 - 130,000/m²</p>
                <p className="text-sm text-muted-foreground">€960 - €2,080/m²</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="text-primary" />
                  Iloilo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Ville émergente des Visayas, BPO en expansion.
                </p>
                <p className="font-semibold">₱50,000 - 100,000/m²</p>
                <p className="text-sm text-muted-foreground">€800 - €1,600/m²</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Fiscalité */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Fiscalité Immobilière</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Les taxes et frais à prévoir lors de l'achat et de la détention d'un bien.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calculator className="text-primary" />
                  Frais d'Acquisition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span>Documentary Stamp Tax (DST)</span>
                    <span className="font-semibold">1.5%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Transfer Tax (Metro Manila)</span>
                    <span className="font-semibold">0.75%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Transfer Tax (Provinces)</span>
                    <span className="font-semibold">0.50%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Frais d'enregistrement (ROD)</span>
                    <span className="font-semibold">~0.5%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Notaire</span>
                    <span className="font-semibold">1-2%</span>
                  </div>
                  <div className="flex justify-between pt-2 font-bold">
                    <span>Total acquéreur</span>
                    <span className="text-primary">4-5%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Le Capital Gains Tax (6%) est normalement payé par le vendeur.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <DollarSign className="text-primary" />
                  Taxes Annuelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span>Real Property Tax (Metro Manila)</span>
                    <span className="font-semibold">2% de la valeur fiscale</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Real Property Tax (Provinces)</span>
                    <span className="font-semibold">1% de la valeur fiscale</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Charges de copropriété</span>
                    <span className="font-semibold">₱50-150/m²/mois</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Assurance (optionnelle)</span>
                    <span className="font-semibold">0.2-0.5%/an</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  La valeur fiscale est généralement 20-40% de la valeur de marché.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Revenus locatifs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Revenus Locatifs et Fiscalité</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="text-green-600" />
                    Rendements Indicatifs (2026)
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>BGC/Makati Prime</span>
                      <span className="font-semibold">4-6% brut</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Ortigas/Mandaluyong</span>
                      <span className="font-semibold">5-7% brut</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quezon City</span>
                      <span className="font-semibold">6-8% brut</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cebu IT Park</span>
                      <span className="font-semibold">5-7% brut</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="text-primary" />
                    Imposition des Loyers
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Les revenus locatifs sont imposés au taux progressif (jusqu'à 35%) pour les résidents.
                    Les non-résidents paient généralement 25% sur les revenus bruts.
                  </p>
                  <p className="text-muted-foreground">
                    TVA de 12% applicable si le revenu locatif annuel dépasse ₱3,000,000.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Processus d'achat */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Processus d'Achat</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Vérification du Quota et Due Diligence</h3>
                    <p className="text-muted-foreground">
                      Confirmez que le quota de 40% n'est pas atteint. Vérifiez le titre (CCT), les charges impayées,
                      et l'historique du développeur. Engagez un avocat spécialisé en immobilier.
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
                    <h3 className="text-lg font-semibold mb-2">Réservation et Contrat</h3>
                    <p className="text-muted-foreground">
                      Versez un acompte de réservation (₱20,000-100,000 selon le bien). Signez le Contract to Sell
                      qui détaille le prix, l'échéancier de paiement et les conditions de transfert.
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
                    <h3 className="text-lg font-semibold mb-2">Paiement</h3>
                    <p className="text-muted-foreground">
                      Neuf : généralement 10-30% d'acompte + paiements échelonnés pendant la construction, solde à la livraison.
                      Revente : paiement comptant ou négociation directe avec le vendeur. Financement bancaire difficile pour les étrangers.
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
                    <h3 className="text-lg font-semibold mb-2">Deed of Absolute Sale et Transfert</h3>
                    <p className="text-muted-foreground">
                      Signature de l'acte de vente notarié, paiement des taxes (DST, Transfer Tax, CGT), puis
                      enregistrement auprès du Registry of Deeds pour obtenir le CCT à votre nom.
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
                    <h3 className="text-lg font-semibold mb-2">Obtention du TIN</h3>
                    <p className="text-muted-foreground">
                      Vous aurez besoin d'un Tax Identification Number (TIN) philippin pour le paiement des taxes
                      et l'enregistrement du titre. Votre avocat peut vous aider à l'obtenir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Documents requis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Documents Requis</h2>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Passeport valide</strong> - copie certifiée</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Tax Identification Number (TIN)</strong> - obligatoire pour les taxes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Preuve de fonds</strong> - relevés bancaires ou lettre de banque</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>ACR I-Card</strong> - si vous êtes résident longue durée (optionnel)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Procuration notariée</strong> - si vous achetez à distance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils Pratiques</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <Scale className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Engagez un Avocat</h3>
                <p className="text-muted-foreground">
                  Un avocat spécialisé vérifiera le titre, les encumbrances (charges), la conformité au quota 40%,
                  et vous représentera pour le transfert. Comptez ₱30,000-100,000 d'honoraires.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Passez par un Broker Licencié</h3>
                <p className="text-muted-foreground">
                  La loi RESA (RA 9646) impose de passer par un broker PRC-licensed pour les transactions.
                  Vérifiez la licence sur le site de la PRC. Commission standard : 3-5%.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <AlertTriangle className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Évitez les Montages Illégaux</h3>
                <p className="text-muted-foreground">
                  Les "dummy corporations" (où un Philippin détient des parts pour le compte d'un étranger) sont
                  illégales et peuvent entraîner la perte du bien. Respectez la règle des 60/40.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Timing et Négociation</h3>
                <p className="text-muted-foreground">
                  Les développeurs offrent souvent des rabais pour paiement comptant (5-10%). Le marché secondaire
                  permet plus de négociation, surtout pour les vendeurs pressés.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Ressources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources Utiles</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="https://www.prc.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>PRC (Vérifier licences)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.bir.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>BIR (Taxes)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.lamudi.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Lamudi (Annonces)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.dotproperty.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>DotProperty</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.carousell.ph/property-for-sale/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Carousell Property</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.colliers.com/en-ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Colliers Philippines</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/vivre-aux-philippines/investir/bourse-et-entreprises"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Bourse et Entreprises</span>
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

export default ImmobilierPage;
