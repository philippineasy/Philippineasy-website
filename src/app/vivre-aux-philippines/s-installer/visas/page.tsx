import { Metadata } from 'next';
import { CheckCircle, Clock, FileText, Briefcase, GraduationCap, Home, AlertTriangle, ExternalLink, Users, RefreshCw, Plane, Calendar, DollarSign, Shield, ChevronRight, ArrowRight } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Visas Philippines 2026 : Guide Complet pour s'installer | Philippineasy",
  description: "Guide complet et à jour sur les visas pour vivre aux Philippines en 2026 : visa touriste 9A, visa retraite SRRV (nouvelles règles), visa travail 9G et AEP. Conditions, coûts et démarches.",
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
    title: "Visas Philippines 2026 : Guide Complet pour s'installer",
    description: "Tout savoir sur les visas pour vivre aux Philippines : touriste, retraite SRRV, travail 9G. Conditions actualisées, coûts et procédures officielles.",
    url: 'https://philippineasy.com/vivre-aux-philippines/s-installer/visas',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Visas Philippines 2026 : Guide Complet",
    description: "Guide complet et à jour sur les visas pour vivre aux Philippines en 2026.",
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

        {/* Stats rapides */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 text-center">
              <Plane className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700">30</p>
              <p className="text-sm text-green-600">jours gratuits</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-700">36</p>
              <p className="text-sm text-blue-600">mois max touriste</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 text-center">
              <Home className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-700">40+</p>
              <p className="text-sm text-purple-600">ans pour SRRV</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 text-center">
              <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-amber-700">5</p>
              <p className="text-sm text-amber-600">types de visas</p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            L'obtention du bon visa est la première étape de votre expatriation aux Philippines.
            Que vous souhaitiez y séjourner quelques mois, y travailler ou y prendre votre retraite,
            ce guide vous présente les options disponibles avec les conditions et tarifs en vigueur en 2026.
          </p>
        </section>

        {/* Avertissement */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-4xl mx-auto mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
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

        {/* Exemption Visa - Entrée gratuite */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Entrée sans visa : 30 jours gratuits</h2>

          <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-green-800">Bonne nouvelle pour les Français</h3>
                <p className="text-green-700 mb-6">
                  Les citoyens français bénéficient d'une <strong>exemption de visa pour les séjours de 30 jours maximum</strong>.
                  Cette facilité concerne 157 nationalités au total.
                </p>

                <div className="bg-white/80 rounded-lg p-5 border border-green-200">
                  <h4 className="font-semibold mb-3 text-green-800">Documents requis à l'arrivée :</h4>
                  <div className="space-y-3">
                    {[
                      "Passeport valide au moins 6 mois après la date de retour prévue",
                      "Billet d'avion de sortie du territoire philippin",
                      "Enregistrement sur le portail eTravel (obligatoire)"
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-green-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visa Touriste 9A */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Visa Touriste (9A)</h2>
          <p className="text-center text-muted-foreground mb-8">Prolongez votre séjour jusqu'à 36 mois</p>

          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Extension sur place */}
            <div className="bg-white border-l-4 border-l-blue-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">Extension sur place</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-5">
                  Après vos 30 jours gratuits, prolongez votre séjour directement aux Philippines
                  auprès du Bureau of Immigration.
                </p>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                      <DollarSign className="h-5 w-5" />
                      Coûts des extensions (2026)
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: "1 mois", price: "3 000 - 4 000 PHP" },
                        { label: "2 mois", price: "5 000 - 6 000 PHP" },
                        { label: "6 mois (LSVVE)", price: "11 500 - 13 900 PHP" }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-white rounded px-3 py-2">
                          <span className="text-blue-700">{item.label}</span>
                          <span className="font-semibold text-blue-800">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">ACR I-Card obligatoire</h4>
                    <p className="text-sm text-muted-foreground">
                      Après 59 jours aux Philippines, vous devez obtenir l'Alien Certificate of Registration.
                      <span className="block mt-1 font-medium text-gray-700">Coût : environ 3 000 PHP</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demande avant départ */}
            <div className="bg-white border-l-4 border-l-cyan-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">Demande avant départ (59 jours)</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-5">
                  Demandez un visa de 59 jours auprès de l'ambassade avant votre départ.
                  Utile si vous n'avez pas de billet retour.
                </p>

                <div className="space-y-4">
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-cyan-800">Documents requis</h4>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Formulaire de demande de visa",
                        "Passeport valide 6 mois minimum",
                        "2 photos d'identité récentes",
                        "Preuve de moyens financiers",
                        "Itinéraire de voyage"
                      ].map((doc, index) => (
                        <li key={index} className="flex items-center gap-2 text-cyan-700">
                          <CheckCircle className="h-4 w-4 text-cyan-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <span className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
                      30-40€ de frais
                    </span>
                    <span className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
                      3-5 jours ouvrables
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://e-services.immigration.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Portail eServices du Bureau of Immigration (extensions en ligne)
            </a>
          </div>
        </section>

        {/* Visa Retraite SRRV */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Visa Retraite SRRV</h2>
          <p className="text-center text-muted-foreground mb-8">Résidence permanente aux Philippines</p>

          {/* Info nouvelle règle */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-900">Nouvelles règles depuis 2025</h3>
                <p className="text-blue-800">
                  Le programme SRRV a été modifié avec un <strong>abaissement de l'âge minimum à 40 ans</strong>
                  et de nouveaux montants de dépôt. Ces changements s'appliquent à tous les nouveaux demandeurs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
            {/* SRRV Classic */}
            <div className="bg-white border-l-4 border-l-purple-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">SRRV Classic</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-5">
                  Le visa de retraite principal pour résider aux Philippines de manière permanente.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-800">Dépôts requis :</h4>

                  {[
                    { age: "50+ avec pension", deposit: "15 000 $US", note: "+ pension 800$/mois" },
                    { age: "50+ sans pension", deposit: "30 000 $US", note: null },
                    { age: "40-49 avec pension", deposit: "25 000 $US", note: null },
                    { age: "40-49 sans pension", deposit: "50 000 $US", note: null }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-purple-50 rounded-lg px-4 py-3">
                      <div>
                        <span className="font-medium text-purple-800">{item.age}</span>
                        {item.note && <span className="text-xs text-purple-600 block">{item.note}</span>}
                      </div>
                      <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-bold text-sm">
                        {item.deposit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-purple-100">
                  <h4 className="font-semibold text-sm text-purple-800 mb-2">Frais supplémentaires</h4>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• Frais de dossier : 1 500 $US (principal)</li>
                    <li>• Par personne à charge : 300 $US</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SRRV Courtesy */}
            <div className="bg-white border-l-4 border-l-indigo-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-white" />
                  <h3 className="font-bold text-lg text-white">SRRV Courtesy</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-5">
                  Programme spécial pour les anciens citoyens philippins ayant renoncé à leur nationalité.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-indigo-800">Dépôts requis :</h4>

                  {[
                    { age: "50 ans et plus", deposit: "1 500 $US" },
                    { age: "40-49 ans", deposit: "3 000 $US" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-indigo-50 rounded-lg px-4 py-3">
                      <span className="font-medium text-indigo-800">{item.age}</span>
                      <span className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full font-bold text-sm">
                        {item.deposit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-700">
                    <strong>Note :</strong> Ce visa est réservé aux personnes ayant eu la nationalité philippine par le passé.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Avantages SRRV */}
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
            <h3 className="font-bold text-xl mb-6 text-green-800 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Avantages du SRRV
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Résidence permanente aux Philippines",
                "Entrées et sorties illimitées du territoire",
                "Pas de renouvellement annuel du visa",
                "Exemption de certains droits de douane",
                "Importation franchise de biens (jusqu'à 7 000 $US)",
                "Dépôt récupérable en cas de départ définitif"
              ].map((advantage, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800">{advantage}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://pra.gov.ph/SRRVisa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Site officiel de la Philippine Retirement Authority (PRA)
              </a>
            </div>
          </div>
        </section>

        {/* Visa Travail 9G - Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Visa de Travail (9G) et Permis AEP</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">
            Pour travailler légalement aux Philippines, vous devez obtenir un Alien Employment Permit (AEP)
            puis un visa de travail 9(G).
          </p>

          {/* Timeline du processus */}
          <div className="max-w-4xl mx-auto mb-10">
            <h3 className="text-xl font-semibold text-center mb-8">Processus d'obtention</h3>

            <div className="relative">
              {/* Ligne centrale - visible sur desktop */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-300 via-amber-300 to-yellow-300" />

              <div className="space-y-8 md:space-y-0">
                {[
                  {
                    step: "1",
                    title: "AEP (Alien Employment Permit)",
                    description: "Délivré par le DOLE - L'employeur prouve qu'aucun Philippin qualifié n'est disponible",
                    duration: "2-3 semaines",
                    color: "orange"
                  },
                  {
                    step: "2",
                    title: "PWP (Provisional Work Permit)",
                    description: "Optionnel - Permet de travailler pendant le traitement du 9G",
                    duration: "3 mois (renouvelable)",
                    color: "amber"
                  },
                  {
                    step: "3",
                    title: "Visa 9(G)",
                    description: "Demandé après obtention de l'AEP auprès du Bureau of Immigration",
                    duration: "1 à 3 ans",
                    color: "yellow"
                  }
                ].map((item, index) => (
                  <div key={index} className={`relative md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center md:mb-8`}>
                    {/* Contenu */}
                    <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                      <div className={`bg-white border-l-4 border-l-${item.color}-500 rounded-xl shadow-sm p-5`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`bg-${item.color}-100 text-${item.color}-700 px-2 py-1 rounded text-xs font-bold`}>
                            Étape {item.step}
                          </span>
                          <span className={`bg-${item.color}-50 text-${item.color}-600 px-2 py-1 rounded text-xs`}>
                            {item.duration}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>

                    {/* Point central */}
                    <div className="hidden md:flex md:w-2/12 justify-center">
                      <div className={`w-10 h-10 bg-${item.color}-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10`}>
                        {item.step}
                      </div>
                    </div>

                    {/* Espace vide */}
                    <div className="hidden md:block md:w-5/12" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Points importants */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-amber-900">Points importants à retenir</h4>
                  <ul className="space-y-2 text-amber-800">
                    {[
                      "L'AEP est lié à un employeur spécifique : changement d'emploi = nouvelle demande",
                      "L'entreprise sponsor doit généralement avoir un capital minimum de 200 000 $US",
                      "Tout retard de renouvellement peut entraîner des pénalités ou un blacklistage",
                      "Certaines professions sont exemptées d'AEP (diplomates, résidents permanents...)"
                    ].map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visa Étudiant 9F */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-3">Visa Étudiant (9F)</h2>
          <p className="text-center text-muted-foreground mb-8">Poursuivez vos études aux Philippines</p>

          <div className="max-w-4xl mx-auto bg-white border-l-4 border-l-teal-500 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-white" />
                <h3 className="font-bold text-lg text-white">Étudier aux Philippines</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-6">
                Le visa étudiant 9(F) est destiné aux étrangers de 18 ans et plus souhaitant suivre des études supérieures
                dans une université accréditée par la CHED (Commission on Higher Education).
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-teal-50 rounded-lg p-5">
                  <h4 className="font-semibold mb-4 text-teal-800">Procédure en 4 étapes</h4>
                  <div className="space-y-3">
                    {[
                      "Admission dans une université accréditée CHED",
                      "L'université transmet votre dossier à la CHED",
                      "Après approbation, transmission au Bureau of Immigration",
                      "Le DFA informe l'ambassade pour délivrance du visa"
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-sm text-teal-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold mb-4">Documents clés</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Lettre d'acceptation de l'université",
                      "Relevés de notes authentifiés",
                      "Certificat de bonne conduite",
                      "Preuve de capacité financière",
                      "Certificat médical",
                      "Casier judiciaire vierge"
                    ].map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                  Validité : 1 an renouvelable
                </span>
                <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                  Délai : 2 à 8 semaines
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/vivre-aux-philippines/etudier/universites"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              Découvrir les universités philippines
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Tableau récapitulatif - Style amélioré */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Comparatif des visas</h2>

          <div className="overflow-x-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-w-[700px]">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <div className="grid grid-cols-4 p-4">
                  <div className="font-semibold">Type de visa</div>
                  <div className="font-semibold">Durée max.</div>
                  <div className="font-semibold">Condition principale</div>
                  <div className="font-semibold">Coût estimé</div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { type: "Exemption (tourisme)", duration: "30 jours", condition: "Nationalité française", cost: "Gratuit", color: "green" },
                  { type: "9A (touriste)", duration: "36 mois", condition: "Extensions successives", cost: "3 000-13 900 PHP/ext.", color: "blue" },
                  { type: "SRRV (retraite)", duration: "Permanent", condition: "40+ ans, dépôt bancaire", cost: "15 000-50 000 $US", color: "purple" },
                  { type: "9G (travail)", duration: "1-3 ans", condition: "Contrat + AEP", cost: "Pris en charge employeur", color: "orange" },
                  { type: "9F (étudiant)", duration: "1 an renouv.", condition: "Admission université CHED", cost: "Variable", color: "teal" }
                ].map((visa, index) => (
                  <div key={index} className={`grid grid-cols-4 p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary/5 transition-colors`}>
                    <div className="font-medium flex items-center gap-2">
                      <div className={`w-2 h-8 bg-${visa.color}-500 rounded-full`} />
                      {visa.type}
                    </div>
                    <div className="flex items-center">
                      <span className={`bg-${visa.color}-100 text-${visa.color}-700 px-3 py-1 rounded-full text-sm font-medium`}>
                        {visa.duration}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center">{visa.condition}</div>
                    <div className="font-medium flex items-center">{visa.cost}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ressources officielles */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Ressources officielles</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { name: "Bureau of Immigration", url: "https://immigration.gov.ph/", domain: "immigration.gov.ph" },
              { name: "Philippine Retirement Authority", url: "https://pra.gov.ph/", domain: "pra.gov.ph" },
              { name: "Ambassade Philippines (Paris)", url: "https://parispe.dfa.gov.ph/", domain: "parispe.dfa.gov.ph" },
              { name: "eTravel (enregistrement)", url: "https://etravel.gov.ph/", domain: "etravel.gov.ph" }
            ].map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ExternalLink className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">{resource.domain}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t border-gray-200 pt-12">
          <h3 className="text-xl font-semibold text-center mb-6">Continuez votre exploration</h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { title: "Trouver un logement", href: "/vivre-aux-philippines/s-installer/logement", desc: "Condos, maisons, quartiers" },
              { title: "Ouvrir un compte en banque", href: "/vivre-aux-philippines/s-installer/banque-assurance", desc: "Banques et assurances" },
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

export default VisasPage;
