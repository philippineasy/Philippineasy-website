import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Clock, FileText, Briefcase, GraduationCap, Home, AlertTriangle, ExternalLink, Calculator, Users, RefreshCw } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Visas Philippines 2025 : Guide Complet pour s'installer | Philippineasy",
  description: "Guide complet et à jour sur les visas pour vivre aux Philippines en 2025 : visa touriste 9A, visa retraite SRRV (nouvelles règles septembre 2025), visa travail 9G et AEP. Conditions, coûts et démarches.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/s-installer/visas',
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
    title: "Visas Philippines 2025 : Guide Complet pour s'installer",
    description: "Tout savoir sur les visas pour vivre aux Philippines : touriste, retraite SRRV, travail 9G. Conditions actualisées, coûts et procédures officielles.",
    url: 'https://philippineasy.com/vivre-aux-philippines/s-installer/visas',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Visas Philippines 2025 : Guide Complet",
    description: "Guide complet et à jour sur les visas pour vivre aux Philippines en 2025.",
  },
};

const VisasPage = () => {
  return (
    <div className="bg-background">
      <HeroThematic
        titlePart1="Visas pour les"
        titlePart2="Philippines"
        subtitle="Le guide complet et actualisé pour comprendre les différents types de visas et choisir celui qui correspond à votre projet d'expatriation."
        imageUrl="/imagesHero/visa-philippines-processus.webp"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            L'obtention du bon visa est la première étape de votre expatriation aux Philippines.
            Que vous souhaitiez y séjourner quelques mois, y travailler ou y prendre votre retraite,
            ce guide vous présente les options disponibles avec les conditions et tarifs en vigueur en 2025.
          </p>
        </section>

        {/* Avertissement Mise à jour */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-4xl mx-auto mb-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-amber-900">Informations officielles</h3>
              <p className="text-amber-800">
                Les règles d'immigration évoluent régulièrement. Ce guide est actualisé régulièrement,
                mais nous vous recommandons de vérifier les informations auprès du{' '}
                <a href="https://immigration.gov.ph/" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-600">
                  Bureau of Immigration
                </a>{' '}
                et de l'<a href="https://parispe.dfa.gov.ph/" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-600">
                  Ambassade des Philippines en France
                </a>.
              </p>
            </div>
          </div>
        </div>

        {/* Exemption Visa */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Entrée sans visa : 30 jours gratuits</h2>

          <Card className="max-w-4xl mx-auto border-green-200 bg-green-50/50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-xl mb-3">Bonne nouvelle pour les ressortissants français</h3>
                  <p className="text-muted-foreground mb-4">
                    Les citoyens français bénéficient d'une <strong>exemption de visa pour les séjours de 30 jours maximum</strong>.
                    Cette facilité concerne 157 nationalités au total.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h4 className="font-medium mb-2">Documents requis à l'arrivée :</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Passeport valide au moins 6 mois après la date de retour prévue
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Billet d'avion de sortie du territoire philippin
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Enregistrement sur le portail <a href="https://etravel.gov.ph/" target="_blank" rel="noopener noreferrer" className="text-primary underline">eTravel</a> (obligatoire)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Visa Touriste 9A */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Visa Touriste (9A) : Séjours prolongés</h2>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <FileText className="text-primary" />
                  Extension sur place
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-muted-foreground">
                  Après vos 30 jours gratuits, vous pouvez prolonger votre séjour directement aux Philippines
                  auprès du Bureau of Immigration. Le visa touriste permet de rester jusqu'à <strong>36 mois maximum</strong>.
                </p>

                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Coûts des extensions (2025)
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Extension 1 mois : environ 3 000 - 4 000 PHP</li>
                      <li>• Extension 2 mois : environ 5 000 - 6 000 PHP</li>
                      <li>• Extension 6 mois (LSVVE) : 11 500 - 13 900 PHP</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">ACR I-Card obligatoire</h4>
                    <p className="text-sm text-muted-foreground">
                      Après 59 jours aux Philippines, vous devez obtenir l'Alien Certificate of Registration (ACR I-Card),
                      carte d'identité pour étrangers. Coût : environ 3 000 PHP.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <Clock className="text-primary" />
                  Demande avant départ (59 jours)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-muted-foreground">
                  Vous pouvez également demander un visa de 59 jours auprès de l'ambassade avant votre départ.
                  Utile si vous n'avez pas de billet retour à présenter.
                </p>

                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Documents requis</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Formulaire de demande de visa</li>
                      <li>• Passeport valide 6 mois minimum</li>
                      <li>• 2 photos d'identité récentes</li>
                      <li>• Preuve de moyens financiers</li>
                      <li>• Itinéraire de voyage</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Coût et délai</h4>
                    <p className="text-sm text-muted-foreground">
                      Environ 30-40€ de frais consulaires. Délai de traitement : 3 à 5 jours ouvrables.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://e-services.immigration.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Portail eServices du Bureau of Immigration (extensions en ligne)
            </a>
          </div>
        </section>

        {/* Visa Retraite SRRV */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Visa Retraite SRRV : Résidence permanente</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <div className="flex items-start gap-4">
              <RefreshCw className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-900">Nouvelles règles depuis septembre 2025</h3>
                <p className="text-blue-800">
                  Le programme SRRV a été modifié avec un <strong>abaissement de l'âge minimum à 40 ans</strong>
                  et de nouveaux montants de dépôt. Ces changements s'appliquent à tous les nouveaux demandeurs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <Home className="text-primary" />
                  SRRV Classic
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-muted-foreground">
                  Le visa de retraite principal, ouvert aux étrangers souhaitant résider aux Philippines de manière permanente.
                </p>

                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Dépôts requis (septembre 2025)</h4>
                    <div className="space-y-3 text-sm">
                      <div className="border-b border-border pb-2">
                        <p className="font-medium">50 ans et plus avec pension</p>
                        <p className="text-muted-foreground">15 000 $US + pension mensuelle de 800$ (seul) ou 1 000$ (couple)</p>
                      </div>
                      <div className="border-b border-border pb-2">
                        <p className="font-medium">50 ans et plus sans pension</p>
                        <p className="text-muted-foreground">30 000 $US de dépôt</p>
                      </div>
                      <div className="border-b border-border pb-2">
                        <p className="font-medium">40-49 ans avec pension</p>
                        <p className="text-muted-foreground">25 000 $US de dépôt</p>
                      </div>
                      <div>
                        <p className="font-medium">40-49 ans sans pension</p>
                        <p className="text-muted-foreground">50 000 $US de dépôt</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Frais supplémentaires</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Frais de dossier : 1 500 $US (principal)</li>
                      <li>• Par personne à charge : 300 $US</li>
                      <li>• Dépendant supplémentaire (au-delà de 2) : 15 000 $US chacun</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3">
                  <Users className="text-primary" />
                  SRRV Courtesy (Anciens Philippins)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-muted-foreground">
                  Programme spécial pour les anciens citoyens philippins ayant renoncé à leur nationalité.
                </p>

                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Dépôts requis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="border-b border-border pb-2">
                        <p className="font-medium">50 ans et plus</p>
                        <p className="text-muted-foreground">1 500 $US de dépôt</p>
                      </div>
                      <div>
                        <p className="font-medium">40-49 ans</p>
                        <p className="text-muted-foreground">3 000 $US de dépôt</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-5xl mx-auto mt-8">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="flex items-center gap-3 text-green-800">
                <CheckCircle className="text-green-600" />
                Avantages du SRRV
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Résidence permanente aux Philippines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Entrées et sorties illimitées du territoire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Pas de renouvellement annuel du visa</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Exemption de certains droits de douane</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Importation franchise de biens personnels (jusqu'à 7 000 $US)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Dépôt récupérable en cas de départ définitif</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 text-center">
                <a
                  href="https://pra.gov.ph/SRRVisa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Site officiel de la Philippine Retirement Authority (PRA)
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Visa Travail 9G */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Visa de Travail (9G) et Permis AEP</h2>

          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
            Pour travailler légalement aux Philippines, vous devez obtenir un Alien Employment Permit (AEP)
            délivré par le Département du Travail, puis un visa de travail 9(G) auprès du Bureau of Immigration.
          </p>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">1. L'AEP (Alien Employment Permit)</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Délivré par le DOLE (Department of Labor and Employment)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    L'employeur doit prouver qu'aucun Philippin qualifié n'est disponible ("Labor Market Test")
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Validité : 1 à 3 ans selon le contrat
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Délai : 2 à 3 semaines
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">2. Le Visa 9(G)</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Demandé après obtention de l'AEP
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Validité : 1, 2 ou 3 ans (alignée sur l'AEP)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Processus total : 2 à 4 mois
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    L'employeur prend généralement en charge les frais
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">3. Le PWP (Option temporaire)</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Provisional Work Permit : permet de travailler pendant le traitement du 9G
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Validité : 3 mois, renouvelable une fois
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary">•</span>
                    Utile si vous devez commencer à travailler rapidement
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2 text-amber-900">Points importants</h4>
                    <ul className="text-sm space-y-1 text-amber-800">
                      <li>• L'AEP est lié à un employeur spécifique : changement d'emploi = nouvelle demande</li>
                      <li>• L'entreprise sponsor doit généralement avoir un capital minimum de 200 000 $US</li>
                      <li>• Tout retard de renouvellement peut entraîner des pénalités ou un blacklistage</li>
                      <li>• Certaines professions sont exemptées d'AEP (diplomates, résidents permanents, etc.)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Visa Étudiant 9F */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Visa Étudiant (9F)</h2>

          <Card className="max-w-4xl mx-auto">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-3">
                <GraduationCap className="text-primary" />
                Étudier aux Philippines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-muted-foreground">
                Le visa étudiant 9(F) est destiné aux étrangers de 18 ans et plus souhaitant suivre des études supérieures
                dans une université accréditée par la CHED (Commission on Higher Education).
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Procédure</h4>
                  <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                    <li>Admission dans une université accréditée CHED</li>
                    <li>L'université transmet votre dossier à la CHED</li>
                    <li>Après approbation, transmission au Bureau of Immigration</li>
                    <li>Le DFA informe l'ambassade pour délivrance du visa</li>
                  </ol>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Documents clés</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Lettre d'acceptation de l'université</li>
                    <li>• Relevés de notes authentifiés</li>
                    <li>• Certificat de bonne conduite</li>
                    <li>• Preuve de capacité financière</li>
                    <li>• Certificat médical</li>
                    <li>• Casier judiciaire vierge</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  Validité : 1 an renouvelable
                </span>
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  Délai : 2 à 8 semaines
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link
              href="/vivre-aux-philippines/etudier/universites"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Découvrir les universités philippines →
            </Link>
          </div>
        </section>

        {/* Tableau récapitulatif */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tableau récapitulatif des visas</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-card rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-4 font-semibold">Type de visa</th>
                  <th className="text-left p-4 font-semibold">Durée max.</th>
                  <th className="text-left p-4 font-semibold">Condition principale</th>
                  <th className="text-left p-4 font-semibold">Coût estimé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4 font-medium">Exemption (tourisme)</td>
                  <td className="p-4">30 jours</td>
                  <td className="p-4 text-muted-foreground">Nationalité française</td>
                  <td className="p-4 text-muted-foreground">Gratuit</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="p-4 font-medium">9A (touriste)</td>
                  <td className="p-4">36 mois</td>
                  <td className="p-4 text-muted-foreground">Extensions successives</td>
                  <td className="p-4 text-muted-foreground">3 000-13 900 PHP/extension</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">SRRV (retraite)</td>
                  <td className="p-4">Permanent</td>
                  <td className="p-4 text-muted-foreground">40+ ans, dépôt bancaire</td>
                  <td className="p-4 text-muted-foreground">15 000-50 000 $US + frais</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="p-4 font-medium">9G (travail)</td>
                  <td className="p-4">1-3 ans</td>
                  <td className="p-4 text-muted-foreground">Contrat + AEP</td>
                  <td className="p-4 text-muted-foreground">Pris en charge employeur</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">9F (étudiant)</td>
                  <td className="p-4">1 an renouv.</td>
                  <td className="p-4 text-muted-foreground">Admission université CHED</td>
                  <td className="p-4 text-muted-foreground">Variable selon ambassade</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Liens utiles */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Ressources officielles</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <a
              href="https://immigration.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Bureau of Immigration</p>
                <p className="text-xs text-muted-foreground">immigration.gov.ph</p>
              </div>
            </a>

            <a
              href="https://pra.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Philippine Retirement Authority</p>
                <p className="text-xs text-muted-foreground">pra.gov.ph</p>
              </div>
            </a>

            <a
              href="https://parispe.dfa.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Ambassade Philippines (Paris)</p>
                <p className="text-xs text-muted-foreground">parispe.dfa.gov.ph</p>
              </div>
            </a>

            <a
              href="https://etravel.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">eTravel (enregistrement)</p>
                <p className="text-xs text-muted-foreground">etravel.gov.ph</p>
              </div>
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Vous avez des questions sur les visas ? Consultez notre forum pour échanger avec d'autres expatriés.
          </p>
          <Link
            href="/forum-sur-les-philippines"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Accéder au forum
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VisasPage;
