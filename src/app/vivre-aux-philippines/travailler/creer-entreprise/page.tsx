import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Building, FileText, Users, Landmark, Info, DollarSign, Shield, Globe, CheckCircle, AlertTriangle, Briefcase, Calculator, ExternalLink, ChevronRight, Building2, User, Clock, Scale } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Créer son Entreprise aux Philippines en 2026 : Guide Complet | Philippineasy",
  description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : SEC, structures juridiques, capital minimum, PEZA, FINL, coûts et démarches 2026.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/travailler/creer-entreprise',
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
    title: "Créer son Entreprise aux Philippines en 2026 : Guide Complet",
    description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : SEC, structures juridiques, capital minimum, PEZA, FINL, coûts et démarches 2026.",
    url: 'https://philippineasy.com/vivre-aux-philippines/travailler/creer-entreprise',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Créer son Entreprise aux Philippines en 2026",
    description: "Guide complet pour créer une entreprise aux Philippines en tant qu'étranger : structures, capital, démarches.",
    site: '@philippineasy',
  },
};

const CreerEntreprisePage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Créer son"
        titlePart2="Entreprise"
        subtitle="Guide complet pour lancer votre activité aux Philippines : structures juridiques, capital requis, démarches administratives et opportunités fiscales."
        imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pourquoi Entreprendre aux Philippines ?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Avec une croissance économique soutenue de plus de 6% par an, une population jeune de 115 millions d'habitants
            et un taux d'anglophonie parmi les plus élevés d'Asie, les Philippines représentent un terrain fertile pour
            l'entrepreneuriat. Le gouvernement encourage activement les investissements étrangers via des incitations
            fiscales attractives et une simplification progressive des démarches administratives.
          </p>
          <p className="text-lg text-muted-foreground">
            En 2026, la plateforme <strong>eSPARC de la SEC</strong> (Securities and Exchange Commission) permet de créer
            une entreprise en 4 à 12 semaines, contre plusieurs mois auparavant. Le <strong>CREATE MORE Act</strong> de 2024
            a également renforcé les avantages fiscaux pour les investisseurs étrangers.
          </p>
        </section>

        {/* Alerte FINL */}
        <div className="flex items-start space-x-4 bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-4xl mx-auto mb-12">
          <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-xl mb-2 text-amber-900">Foreign Investment Negative List (FINL)</h3>
            <p className="text-amber-800 mb-3">
              Avant tout projet, consultez la <strong>12ème FINL</strong> (Executive Order 175) qui définit les secteurs
              où la participation étrangère est limitée ou interdite. Parmi les restrictions principales :
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>Médias de masse : participation étrangère interdite</li>
              <li>Commerce de détail : capital minimum de ₱25 millions si plus de 40% étranger</li>
              <li>Services publics : limité à 40% de participation étrangère</li>
              <li>Professions réglementées : généralement réservées aux Philippins</li>
            </ul>
            <a
              href="https://emerhub.com/philippines/foreign-investment-negative-list-in-the-philippines/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-amber-700 hover:text-amber-900 mt-3 font-medium"
            >
              Consulter la FINL complète <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>

        {/* Structures juridiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Structures Juridiques Disponibles</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Le choix de la structure dépend de votre activité, du nombre d'associés et du niveau de contrôle souhaité.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Building className="text-primary" />
                    Corporation
                  </CardTitle>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Recommandé</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Structure la plus courante pour les investisseurs étrangers. Responsabilité limitée aux apports.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>2 à 15 actionnaires (depuis le Revised Corporation Code)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>100% propriété étrangère possible (hors FINL)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Capital min. : US$200,000 (US$100,000 si tech ou 50+ employés)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="text-primary" />
                  One Person Corporation (OPC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Structure simplifiée pour un entrepreneur seul. Créée par le Revised Corporation Code de 2019.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Un seul actionnaire (personne physique)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Ouvert aux étrangers avec les mêmes règles de capital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>Secrétaire philippin obligatoire</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="text-primary" />
                  Branch Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Extension d'une société étrangère. La maison-mère reste responsable des dettes.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>100% contrôle par la maison-mère</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Peut générer des revenus aux Philippines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>Capital min. : US$200,000 rapatrié</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="text-primary" />
                  Representative Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Bureau de liaison sans activité commerciale. Idéal pour prospecter le marché.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Capital réduit : US$30,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Promotion, étude de marché, liaison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>Ne peut pas facturer ni générer de revenus locaux</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="text-primary" />
                  Partnership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Association de 2+ personnes. Peut être générale (responsabilité illimitée) ou limitée.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Formalités simplifiées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Pas de capital minimum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>Rare pour les étrangers (complexité juridique)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="text-muted-foreground" />
                  Sole Proprietorship
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Entreprise individuelle. <strong>Réservée aux citoyens philippins.</strong>
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Non accessible aux étrangers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Enregistrement DTI (pas SEC)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tableau comparatif capital */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Capital Minimum Requis</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-3 text-left">Structure</th>
                  <th className="border p-3 text-left">Capital Standard</th>
                  <th className="border p-3 text-left">Capital Réduit</th>
                  <th className="border p-3 text-left">Conditions réduction</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Corporation / OPC</td>
                  <td className="border p-3">US$200,000</td>
                  <td className="border p-3 text-green-700">US$100,000</td>
                  <td className="border p-3 text-sm">Tech avancée ou 50+ employés philippins</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Branch Office</td>
                  <td className="border p-3">US$200,000</td>
                  <td className="border p-3 text-green-700">₱5,000</td>
                  <td className="border p-3 text-sm">Export ≥60% + enregistrement PEZA/BOI</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Representative Office</td>
                  <td className="border p-3">US$30,000</td>
                  <td className="border p-3">-</td>
                  <td className="border p-3 text-sm">-</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border p-3 font-medium">Partnership</td>
                  <td className="border p-3" colSpan={3}>Pas de minimum, mais mêmes règles FINL si &gt;40% étranger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Étapes d'enregistrement */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Les Étapes de Création</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Processus complet de 30 à 45 jours ouvrés en moyenne via la plateforme eSPARC.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Réservation du Nom (SEC)</h3>
                    <p className="text-muted-foreground mb-3">
                      Vérifiez la disponibilité du nom via <a href="https://esparc.sec.gov.ph" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eSPARC</a>.
                      La réservation est valable 90 jours (renouvelable une fois).
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>1-3 jours</span>
                      <span className="mx-2">•</span>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>₱100-500</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Enregistrement SEC</h3>
                    <p className="text-muted-foreground mb-3">
                      Soumettez les Articles of Incorporation, By-laws, et documents notariés. Pour les étrangers,
                      ajoutez le formulaire FIA et un certificat bancaire attestant le capital rapatrié.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium mb-2">Documents requis (étrangers) :</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Articles of Incorporation notariés</li>
                        <li>• By-laws de la société</li>
                        <li>• Formulaire FIA (₱3,000)</li>
                        <li>• Certificat bancaire capital</li>
                        <li>• Affidavit Agent Résident</li>
                        <li>• TIN ou passeport des actionnaires</li>
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>7-20 jours</span>
                      <span className="mx-2">•</span>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>₱10,000-30,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Barangay Clearance</h3>
                    <p className="text-muted-foreground mb-3">
                      Obtenez l'autorisation du barangay (quartier) où sera situé votre bureau.
                      Document indispensable pour le Mayor's Permit.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>1-3 jours</span>
                      <span className="mx-2">•</span>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>₱300-1,800</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Mayor's Permit (Business Permit)</h3>
                    <p className="text-muted-foreground mb-3">
                      Permis d'exploitation délivré par la mairie (City Hall ou Municipal Hall).
                      Inclut des inspections sanitaire, incendie et zonage.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium mb-2">Documents requis :</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Certificate of Registration SEC</li>
                        <li>• Barangay Clearance</li>
                        <li>• Contrat de bail du local</li>
                        <li>• Community Tax Certificate (CTC)</li>
                        <li>• Zoning Clearance</li>
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>5-15 jours</span>
                      <span className="mx-2">•</span>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>₱5,000-20,000/an</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">5</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Enregistrement BIR</h3>
                    <p className="text-muted-foreground mb-3">
                      Bureau of Internal Revenue : obtention du TIN entreprise, autorisation d'imprimer des factures (ATP),
                      et enregistrement des livres comptables.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>5-10 jours</span>
                      <span className="mx-2">•</span>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>₱500-4,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">6</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Enregistrement Employeurs (si applicable)</h3>
                    <p className="text-muted-foreground mb-3">
                      Si vous embauchez, affiliez votre entreprise au SSS (sécurité sociale),
                      PhilHealth (santé) et Pag-IBIG (logement).
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>5-7 jours</span>
                      <span className="mx-2">•</span>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Gratuit</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Estimation des coûts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Estimation des Coûts Totaux</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Poste</th>
                      <th className="border p-3 text-right">Fourchette</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3">Enregistrement SEC (frais gouvernementaux)</td>
                      <td className="border p-3 text-right">₱10,000 - ₱30,000</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border p-3">Barangay Clearance + CTC</td>
                      <td className="border p-3 text-right">₱500 - ₱2,000</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Mayor's Permit (première année)</td>
                      <td className="border p-3 text-right">₱5,000 - ₱20,000</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border p-3">Fire Safety + Zoning</td>
                      <td className="border p-3 text-right">₱1,500 - ₱5,000</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Enregistrement BIR + ATP</td>
                      <td className="border p-3 text-right">₱2,000 - ₱5,000</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border p-3">Honoraires avocat/consultant (optionnel)</td>
                      <td className="border p-3 text-right">₱50,000 - ₱150,000</td>
                    </tr>
                    <tr className="bg-primary/10 font-bold">
                      <td className="border p-3">TOTAL (hors capital et honoraires)</td>
                      <td className="border p-3 text-right">₱19,000 - ₱62,000</td>
                    </tr>
                    <tr className="bg-primary/10 font-bold">
                      <td className="border p-3">TOTAL (avec consultant)</td>
                      <td className="border p-3 text-right">₱70,000 - ₱200,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Ces frais n'incluent pas le capital social requis (US$100,000-200,000 pour les étrangers)
              </p>
            </CardContent>
          </Card>
        </section>

        {/* PEZA et incitations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Incitations Fiscales : PEZA et BOI</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Le CREATE MORE Act de 2024 offre jusqu'à 27 ans d'avantages fiscaux pour les projets à fort impact.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-3">
                  <Shield className="text-green-600" />
                  PEZA (Philippine Economic Zone Authority)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  422 zones économiques à travers le pays. Idéal pour l'export, la tech et le BPO.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span><strong>Income Tax Holiday</strong> : 4 à 8 ans (jusqu'à 8 pour green tech)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span><strong>5% SCIT</strong> sur le revenu brut après ITH (au lieu de 25% CIT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Import duty-free pour équipements et matières premières</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Exemption de taxe sur rapatriement des profits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Visas spéciaux pour employés étrangers clés</span>
                  </li>
                </ul>
                <a
                  href="https://www.peza.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-700 hover:text-green-900 mt-3 font-medium"
                >
                  Site officiel PEZA <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-3">
                  <Briefcase className="text-blue-600" />
                  BOI (Board of Investments)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-muted-foreground">
                  Pour les projets hors zones économiques dans les secteurs prioritaires.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span><strong>Income Tax Holiday</strong> : 4 à 7 ans selon le projet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Déduction additionnelle pour formation et R&D</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Réductions douanières sur équipements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Visas spéciaux facilités</span>
                  </li>
                </ul>
                <a
                  href="https://boi.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-700 hover:text-blue-900 mt-3 font-medium"
                >
                  Site officiel BOI <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conseils Pratiques</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <Scale className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Engagez un Avocat Local</h3>
                <p className="text-muted-foreground">
                  Même si les démarches sont plus simples qu'avant, un avocat philippin spécialisé en droit des
                  affaires vous évitera des erreurs coûteuses, surtout concernant la FINL et les structures à capitaux étrangers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Landmark className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ouvrez un Compte Bancaire Corporate</h3>
                <p className="text-muted-foreground">
                  Préparez votre capital avant de démarrer. Les banques exigent une preuve de rapatriement de fonds
                  pour les sociétés à capitaux étrangers (certificat bancaire pour la SEC).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nommez un Agent Résident</h3>
                <p className="text-muted-foreground">
                  Obligatoire pour les branches et corporations à capitaux étrangers. Peut être un citoyen philippin,
                  une société locale, ou un étranger avec visa de travail.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Calculator className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Anticipez les Obligations Fiscales</h3>
                <p className="text-muted-foreground">
                  Déclarations mensuelles (TVA, retenues), trimestrielles (impôt sur le revenu) et annuelles.
                  Un comptable local est quasi indispensable pour éviter les pénalités.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Ressources officielles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources Officielles</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="https://esparc.sec.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>SEC eSPARC</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.bir.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Bureau of Internal Revenue</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.dti.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Dept. of Trade and Industry</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.peza.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>PEZA</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://boi.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Board of Investments</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.philembassy.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Ambassade Philippines (FR)</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Continuez votre Exploration</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/vivre-aux-philippines/travailler/emploi-salarie"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Emploi Salarié</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/vivre-aux-philippines/investir/immobilier"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span>Investir dans l'Immobilier</span>
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

export default CreerEntreprisePage;
