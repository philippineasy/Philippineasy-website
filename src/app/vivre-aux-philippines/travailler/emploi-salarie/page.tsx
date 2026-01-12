import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Briefcase, Search, Building, DollarSign, Users, AlertTriangle, CheckCircle, ExternalLink, TrendingUp, Globe, FileText, Clock } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Trouver un Emploi Salarié aux Philippines en 2025 | Philippineasy",
  description: "Guide complet pour trouver un emploi aux Philippines en tant qu'expatrié : secteurs qui recrutent, plateformes d'emploi (JobStreet, LinkedIn), salaires, visa de travail 9G et permis AEP.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/travailler/emploi-salarie',
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
    title: "Trouver un Emploi Salarié aux Philippines en 2025",
    description: "Secteurs porteurs, plateformes de recherche d'emploi, salaires et démarches administratives pour travailler aux Philippines.",
    url: 'https://philippineasy.com/vivre-aux-philippines/travailler/emploi-salarie',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Emploi aux Philippines 2025 : Guide Expatrié",
    description: "Comment trouver un emploi salarié aux Philippines : secteurs, salaires et démarches.",
  },
};

const EmploiSalariePage = () => {
  return (
    <div className="bg-background">
      <HeroThematic
        titlePart1="Trouver un"
        titlePart2="Emploi Salarié"
        subtitle="Le marché du travail philippin pour les expatriés : opportunités, démarches et conseils pour décrocher un poste."
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Les Philippines offrent de réelles opportunités professionnelles aux étrangers qualifiés,
            notamment dans les secteurs en forte croissance. L'anglais étant la langue des affaires,
            les francophones bilingues y trouvent souvent leur place. Ce guide vous accompagne dans votre recherche d'emploi.
          </p>
        </section>

        {/* Prérequis légaux */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-amber-900">Prérequis légal : AEP + Visa 9G</h3>
                  <p className="text-amber-800 mb-3">
                    Pour travailler légalement aux Philippines, vous devez obtenir un <strong>Alien Employment Permit (AEP)</strong>
                    délivré par le DOLE, suivi d'un <strong>visa de travail 9(G)</strong> du Bureau of Immigration.
                    Ces démarches sont généralement initiées par votre employeur.
                  </p>
                  <Link href="/vivre-aux-philippines/s-installer/visas" className="text-amber-700 hover:underline font-medium inline-flex items-center gap-1">
                    Voir notre guide complet sur les visas →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Secteurs qui recrutent */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Secteurs qui recrutent des expatriés</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Certains secteurs sont particulièrement ouverts aux talents étrangers,
            que ce soit pour leur expertise technique ou leurs compétences linguistiques.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="text-blue-500" />
                  BPO / Call Centers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  Les Philippines sont le leader mondial du BPO. Les postes de management
                  et de formation sont souvent accessibles aux expatriés.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Service client multilingue</li>
                  <li>• Support technique</li>
                  <li>• Finance & comptabilité</li>
                  <li>• Ressources humaines</li>
                </ul>
                <p className="text-xs mt-3 text-blue-600 font-medium">
                  Salaires managers : 80 000 - 200 000 PHP/mois
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="text-green-500" />
                  IT & Tech
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  Fort développement du secteur tech avec une demande croissante
                  pour les profils seniors et spécialisés.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Développement logiciel</li>
                  <li>• Cybersécurité</li>
                  <li>• Data science & IA</li>
                  <li>• DevOps / Cloud</li>
                </ul>
                <p className="text-xs mt-3 text-green-600 font-medium">
                  Salaires seniors : 100 000 - 300 000+ PHP/mois
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="text-purple-500" />
                  Enseignement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  Forte demande pour les professeurs natifs de langues étrangères
                  et les enseignants dans les écoles internationales.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Professeur de français (FLE)</li>
                  <li>• Professeur d'anglais</li>
                  <li>• Écoles internationales</li>
                  <li>• Formation en entreprise</li>
                </ul>
                <p className="text-xs mt-3 text-purple-600 font-medium">
                  Salaires : 50 000 - 150 000 PHP/mois
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="text-orange-500" />
                  Finance & Consulting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  Les multinationales recherchent des profils expérimentés
                  pour leurs opérations régionales.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Audit & comptabilité</li>
                  <li>• Conseil en management</li>
                  <li>• Analyse financière</li>
                  <li>• Risk management</li>
                </ul>
                <p className="text-xs mt-3 text-orange-600 font-medium">
                  Salaires seniors : 150 000 - 400 000+ PHP/mois
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Briefcase className="text-red-500" />
                  Hôtellerie & Tourisme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  Secteur en plein essor avec de nombreux resorts
                  et hôtels de luxe recherchant des managers internationaux.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Direction hôtelière</li>
                  <li>• F&B Management</li>
                  <li>• Chef cuisinier</li>
                  <li>• Event management</li>
                </ul>
                <p className="text-xs mt-3 text-red-600 font-medium">
                  Salaires managers : 70 000 - 200 000 PHP/mois
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="text-cyan-500" />
                  Industrie & Manufacturing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  Les zones économiques spéciales (PEZA) attirent
                  de nombreuses entreprises manufacturières.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Ingénierie de production</li>
                  <li>• Qualité & conformité</li>
                  <li>• Supply chain</li>
                  <li>• Direction d'usine</li>
                </ul>
                <p className="text-xs mt-3 text-cyan-600 font-medium">
                  Salaires : 100 000 - 300 000 PHP/mois
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Où chercher */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Où trouver des offres d'emploi ?</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <Search className="text-primary" />
                  Plateformes principales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li>
                    <a href="https://www.jobstreet.com.ph" target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-primary hover:underline font-medium">
                      <ExternalLink className="h-4 w-4" />
                      JobStreet Philippines
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Le leader local avec des milliers d'offres. Filtrez par "expat-friendly" ou "foreign nationals welcome".
                    </p>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/jobs" target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-primary hover:underline font-medium">
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn Jobs
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Incontournable pour les postes qualifiés et le networking avec les recruteurs.
                    </p>
                  </li>
                  <li>
                    <a href="https://www.kalibrr.com" target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-primary hover:underline font-medium">
                      <ExternalLink className="h-4 w-4" />
                      Kalibrr
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Plateforme moderne populaire auprès des startups et entreprises tech.
                    </p>
                  </li>
                  <li>
                    <a href="https://www.indeed.com.ph" target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-primary hover:underline font-medium">
                      <ExternalLink className="h-4 w-4" />
                      Indeed Philippines
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Agrégateur d'offres avec un large choix de secteurs.
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <Users className="text-primary" />
                  Autres canaux efficaces
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li>
                    <p className="font-medium">Pages carrière des multinationales</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Accenture, Concentrix, Telus, JPMorgan, Google, Meta... consultez directement leurs sites.
                    </p>
                  </li>
                  <li>
                    <p className="font-medium">Cabinets de recrutement</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Michael Page, Robert Walters, Hays sont actifs aux Philippines pour les profils seniors.
                    </p>
                  </li>
                  <li>
                    <p className="font-medium">Groupes Facebook</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      "Jobs in Manila for Foreigners", "Expat Jobs Philippines" - souvent des offres exclusives.
                    </p>
                  </li>
                  <li>
                    <p className="font-medium">Chambre de Commerce</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      La Chambre de Commerce Franco-Philippine peut faciliter les mises en relation.
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Salaires et avantages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Salaires et packages</h2>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Fourchettes salariales indicatives (2025)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Niveau</th>
                        <th className="text-left py-2">Salaire mensuel (PHP)</th>
                        <th className="text-left py-2">Équivalent EUR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-2">Junior (0-3 ans)</td>
                        <td className="py-2">40 000 - 70 000</td>
                        <td className="py-2 text-muted-foreground">~650 - 1 150€</td>
                      </tr>
                      <tr>
                        <td className="py-2">Intermédiaire (3-7 ans)</td>
                        <td className="py-2">70 000 - 150 000</td>
                        <td className="py-2 text-muted-foreground">~1 150 - 2 450€</td>
                      </tr>
                      <tr>
                        <td className="py-2">Senior (7-15 ans)</td>
                        <td className="py-2">150 000 - 300 000</td>
                        <td className="py-2 text-muted-foreground">~2 450 - 4 900€</td>
                      </tr>
                      <tr>
                        <td className="py-2">Direction / Expert</td>
                        <td className="py-2">300 000 - 600 000+</td>
                        <td className="py-2 text-muted-foreground">~4 900 - 10 000€+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">* Taux de change approximatif : 1 EUR = 61 PHP</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Avantages courants</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      13ème mois (obligatoire par la loi)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Assurance santé (HMO)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Congés payés (5-15 jours selon ancienneté)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Prime de performance (variable)
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Packages expatriés (postes seniors)</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Logement fourni ou allocation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Billets d'avion annuels (home leave)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Prise en charge du visa et AEP
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Frais de scolarité enfants (parfois)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Culture du travail */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Culture du travail aux Philippines</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ce qui fonctionne</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Respect de la hiérarchie :</strong> Les Philippins valorisent le respect des aînés et des supérieurs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Communication indirecte :</strong> Privilégiez la diplomatie et évitez la confrontation directe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Relations personnelles :</strong> Prenez le temps de construire des liens avec vos collègues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Patience :</strong> Les processus peuvent prendre plus de temps qu'en Europe</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">À éviter</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Critiques publiques :</strong> Ne jamais embarrasser quelqu'un devant les autres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Impatience visible :</strong> La colère fait perdre la face à tout le monde</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Arrogance :</strong> Évitez de vous positionner comme "supérieur" en tant qu'étranger</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Ignorer les fêtes :</strong> Les événements d'entreprise sont importants pour la cohésion</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Démarches administratives */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Démarches pour être embauché</h2>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Step 1 */}
              <div className="flex-1 relative">
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</span>
                      <h4 className="font-semibold">Offre d'emploi</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trouvez un employeur prêt à vous sponsoriser. L'entreprise doit avoir les moyens
                      et l'autorisation d'embaucher des étrangers.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Step 2 */}
              <div className="flex-1">
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</span>
                      <h4 className="font-semibold">Demande AEP</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Votre employeur dépose la demande d'Alien Employment Permit auprès du DOLE.
                      Délai : 2-3 semaines environ.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Step 3 */}
              <div className="flex-1">
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</span>
                      <h4 className="font-semibold">Visa 9(G)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Une fois l'AEP obtenu, demande du visa de travail 9(G) au Bureau of Immigration.
                      Processus total : 2-4 mois.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Step 4 */}
              <div className="flex-1">
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">4</span>
                      <h4 className="font-semibold">ACR I-Card</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Obtention de votre carte de résident étranger, nécessaire pour ouvrir un compte bancaire
                      et autres démarches.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Option PWP (Provisional Work Permit)</h4>
                  <p className="text-sm text-blue-800">
                    Si vous devez commencer à travailler avant l'obtention du 9(G), un permis provisoire (PWP)
                    peut être obtenu plus rapidement. Validité : 3 mois, renouvelable une fois.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Entreprises qui recrutent */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Entreprises qui recrutent des expatriés</h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">BPO / Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Accenture</li>
                  <li>• Concentrix</li>
                  <li>• Telus International</li>
                  <li>• TaskUs</li>
                  <li>• Alorica</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tech / Digital</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Google Philippines</li>
                  <li>• Meta</li>
                  <li>• Grab</li>
                  <li>• PayMaya / Maya</li>
                  <li>• Canva Philippines</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Finance / Conseil</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• JPMorgan</li>
                  <li>• HSBC</li>
                  <li>• McKinsey</li>
                  <li>• Deloitte</li>
                  <li>• EY / PwC</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Vous préférez créer votre propre activité ? Découvrez notre guide sur l'entrepreneuriat aux Philippines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vivre-aux-philippines/travailler/creer-entreprise"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Créer son entreprise
            </Link>
            <Link
              href="/vivre-aux-philippines/s-installer/visas"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              Guide des visas
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmploiSalariePage;
