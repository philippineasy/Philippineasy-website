import { Metadata } from 'next';
import { Landmark, Shield, CreditCard, Hospital, AlertTriangle, CheckCircle, ExternalLink, DollarSign, FileText, Heart, Building, ChevronRight, Smartphone, Users, Clock, Globe } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Banque et Assurance aux Philippines 2026 : Guide Expatrié | Philippineasy",
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
    title: "Banque et Assurance aux Philippines 2026 : Guide Expatrié",
    description: "Ouvrir un compte bancaire et choisir une assurance santé aux Philippines. Guide pratique pour expatriés avec documents requis et comparatif.",
    url: 'https://philippineasy.com/vivre-aux-philippines/s-installer/banque-assurance',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Banque et Assurance aux Philippines 2026",
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

        {/* Stats rapides */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 text-center">
              <Landmark className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-700">3</p>
              <p className="text-sm text-blue-600">grandes banques</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700">59</p>
              <p className="text-sm text-green-600">jours min. résidence</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-700">3</p>
              <p className="text-sm text-purple-600">types d'assurance</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 text-center">
              <Hospital className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-amber-700">6</p>
              <p className="text-sm text-amber-600">hôpitaux de référence</p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Une fois installé aux Philippines, deux priorités s'imposent : ouvrir un compte bancaire local
            pour faciliter vos transactions quotidiennes, et souscrire une assurance santé adaptée
            pour vous protéger en cas de pépin. Ce guide vous accompagne dans ces démarches essentielles.
          </p>
        </section>

        {/* ========== SECTION BANQUE ========== */}
        <section className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Landmark className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold">Ouvrir un Compte Bancaire</h2>
          </div>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Les banques philippines acceptent les clients étrangers, mais certaines conditions doivent être remplies.
          </p>

          {/* Condition préalable */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-4xl mx-auto mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-amber-900">Condition préalable pour les étrangers</h4>
                <p className="text-amber-800 mb-3">
                  Pour ouvrir un compte en pesos, vous devez être classé comme <strong>"resident alien"</strong>,
                  c'est-à-dire avoir séjourné au moins 59-60 jours aux Philippines et posséder une <strong>ACR I-Card</strong>
                  (Alien Certificate of Registration).
                </p>
                <p className="text-sm text-amber-700 bg-amber-100/50 rounded-lg px-3 py-2">
                  Les touristes peuvent parfois ouvrir des comptes en devises (USD, EUR) mais avec restrictions.
                </p>
              </div>
            </div>
          </div>

          {/* Les principales banques */}
          <h3 className="text-2xl font-bold text-center mb-6">Les principales banques</h3>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {/* BDO */}
            <div className="bg-white border-l-4 border-l-blue-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Landmark className="h-6 w-6 text-white" />
                  <h4 className="font-bold text-lg text-white">BDO (Banco de Oro)</h4>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  La plus grande banque du pays avec plus de 1 400 agences et 4 400 distributeurs.
                </p>
                <div className="space-y-2">
                  {[
                    "Réseau ATM le plus étendu",
                    "Application mobile complète",
                    "Ouverture possible via Zoom"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://www.bdo.com.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  bdo.com.ph
                </a>
              </div>
            </div>

            {/* BPI */}
            <div className="bg-white border-l-4 border-l-red-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Landmark className="h-6 w-6 text-white" />
                  <h4 className="font-bold text-lg text-white">BPI</h4>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Banque historique réputée pour son service client et sa fiabilité.
                </p>
                <div className="space-y-2">
                  {[
                    "Excellente application mobile",
                    "Bonne réputation expats",
                    "Services en ligne performants"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://www.bpi.com.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  bpi.com.ph
                </a>
              </div>
            </div>

            {/* Metrobank */}
            <div className="bg-white border-l-4 border-l-green-500 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Landmark className="h-6 w-6 text-white" />
                  <h4 className="font-bold text-lg text-white">Metrobank</h4>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Troisième plus grande banque, connue pour ses services aux entreprises et particuliers.
                </p>
                <div className="space-y-2">
                  {[
                    "Large réseau d'agences",
                    "Comptes multi-devises",
                    "Service personnalisé"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://www.metrobank.com.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  metrobank.com.ph
                </a>
              </div>
            </div>
          </div>

          {/* Documents requis */}
          <div className="max-w-4xl mx-auto bg-white border-l-4 border-l-indigo-500 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-white" />
                <h3 className="font-bold text-lg text-white">Documents requis pour ouvrir un compte</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-indigo-800">Documents d'identité</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Passeport valide (original + copie)",
                      "ACR I-Card ou ICR",
                      "Visa en cours de validité"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-indigo-700">
                        <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Justificatifs complémentaires</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Justificatif de domicile (facture, bail)",
                      "Photos d'identité (2-3 exemplaires)",
                      "Dépôt initial : 2 000 à 10 000 PHP"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-semibold text-blue-900 mb-3">Bon à savoir</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    "Lettre employeur parfois demandée",
                    "Ouverture généralement en agence",
                    "Carte débit : 1-2 semaines",
                    "Frais : 0 à 300 PHP/mois"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-blue-800">
                      <ChevronRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alternatives digitales */}
          <div className="mt-10 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Alternatives digitales</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "GCash", desc: "Le portefeuille électronique le plus populaire. Parfait pour paiements, transferts et achats en ligne.", color: "cyan" },
                { name: "Maya (ex-PayMaya)", desc: "Alternative avec comptes d'épargne numériques offrant des taux d'intérêt attractifs.", color: "purple" }
              ].map((wallet, index) => (
                <div key={index} className={`bg-gradient-to-br from-${wallet.color}-50 to-${wallet.color}-100 border border-${wallet.color}-200 rounded-xl p-5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-${wallet.color}-100 rounded-full flex items-center justify-center`}>
                      <Smartphone className={`h-5 w-5 text-${wallet.color}-600`} />
                    </div>
                    <h4 className={`font-bold text-${wallet.color}-800`}>{wallet.name}</h4>
                  </div>
                  <p className={`text-sm text-${wallet.color}-700`}>{wallet.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SECTION ASSURANCE ========== */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold">Assurance Santé</h2>
          </div>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Le système de santé philippin est de qualité dans les grandes villes, mais les soins peuvent
            être coûteux. Une bonne couverture est indispensable.
          </p>

          {/* PhilHealth */}
          <div className="max-w-4xl mx-auto bg-white border-l-4 border-l-green-500 rounded-xl shadow-sm overflow-hidden mb-10">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-white" />
                <h3 className="font-bold text-lg text-white">PhilHealth : L'assurance sociale nationale</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-5">
                PhilHealth est le système national d'assurance santé philippin. Les expatriés résidents
                peuvent y adhérer volontairement pour bénéficier d'une couverture de base.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-green-800">Cotisations 2026</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Salariés", value: "5% du salaire (partagé)" },
                      { label: "Adhésion volontaire", value: "2 400 à 5 000 PHP/an" }
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-lg px-4 py-2 border border-green-100">
                        <span className="font-medium text-green-800 text-sm">{item.label}</span>
                        <p className="text-green-700 text-xs">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Couverture</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Hospitalisations (forfaits)",
                      "Consultations publiques",
                      "Chirurgies non urgentes"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>Limite :</strong> PhilHealth fonctionne avec des forfaits fixes.
                    Reste à charge jusqu'à 40% pour les soins complexes ou hôpitaux privés.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* HMO locales */}
          <h3 className="text-2xl font-bold text-center mb-6">Les HMO locales</h3>
          <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
            Health Maintenance Organizations - Couverture complémentaire recommandée
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {[
              { name: "Maxicare", desc: "Leader du marché avec large réseau d'hôpitaux.", features: ["Plans individuels et familiaux", "Réseau étendu", "À partir de ~15 000 PHP/an"], color: "blue" },
              { name: "Intellicare", desc: "Bon rapport qualité-prix avec options flexibles.", features: ["Plans personnalisables", "Bonne couverture dentaire", "Options maternité"], color: "purple" },
              { name: "MediCard", desc: "Ancienneté et fiabilité sur le marché philippin.", features: ["+500 hôpitaux partenaires", "Plans entreprise/individuels", "Réclamation simple"], color: "teal" }
            ].map((hmo, index) => (
              <div key={index} className={`bg-gradient-to-br from-${hmo.color}-50 to-${hmo.color}-100 border border-${hmo.color}-200 rounded-xl p-5`}>
                <div className={`w-12 h-12 bg-${hmo.color}-100 rounded-full flex items-center justify-center mb-3`}>
                  <Heart className={`h-6 w-6 text-${hmo.color}-600`} />
                </div>
                <h4 className={`font-bold text-${hmo.color}-800 mb-2`}>{hmo.name}</h4>
                <p className={`text-sm text-${hmo.color}-700 mb-3`}>{hmo.desc}</p>
                <ul className="space-y-1">
                  {hmo.features.map((feature, idx) => (
                    <li key={idx} className={`text-xs text-${hmo.color}-600 flex items-center gap-1`}>
                      <CheckCircle className="h-3 w-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Assurances internationales */}
          <h3 className="text-2xl font-bold text-center mb-6">Assurances internationales</h3>

          <div className="max-w-4xl mx-auto bg-white border-l-4 border-l-indigo-500 rounded-xl shadow-sm overflow-hidden mb-10">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-white" />
                <h3 className="font-bold text-lg text-white">Couverture mondiale pour expatriés</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-6">
                Pour une couverture complète avec rapatriement et soins à l'étranger,
                les assurances internationales offrent une meilleure prise en charge dans les hôpitaux premium.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { name: "Cigna Global", desc: "Couverture mondiale", url: "https://www.cigna.com/" },
                  { name: "Allianz Care", desc: "Plans modulables", url: "https://www.allianzcare.com/" },
                  { name: "AXA", desc: "Présence locale", url: "https://www.axa.com/" },
                  { name: "April International", desc: "Spécialiste expats français", url: "https://www.april-international.com/" }
                ].map((insurer, index) => (
                  <a
                    key={index}
                    href={insurer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group text-center"
                  >
                    <h4 className="font-semibold text-indigo-800 group-hover:text-indigo-900">{insurer.name}</h4>
                    <p className="text-xs text-indigo-600">{insurer.desc}</p>
                  </a>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-semibold text-blue-900 mb-3">Coûts indicatifs (2026)</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { type: "Plan de base", price: "30-50 €/mois", desc: "Hospitalisation" },
                    { type: "Intermédiaire", price: "80-150 €/mois", desc: "Consultations + hospi" },
                    { type: "Premium", price: "200-400 €/mois", desc: "Complet + rapatriement" }
                  ].map((plan, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-blue-100 text-center">
                      <span className="text-xs text-blue-600 uppercase">{plan.type}</span>
                      <p className="text-lg font-bold text-blue-800">{plan.price}</p>
                      <p className="text-xs text-blue-600">{plan.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-700 mt-3 text-center">
                  * Tarifs selon âge, couverture et franchises
                </p>
              </div>
            </div>
          </div>

          {/* Hôpitaux de référence */}
          <h3 className="text-2xl font-bold text-center mb-6">Hôpitaux de référence</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { name: "St. Luke's Medical Center", location: "BGC & Quezon City", desc: "Standard international, soins complexes", color: "blue" },
              { name: "Makati Medical Center", location: "Makati CBD", desc: "Excellence cardiologie et oncologie", color: "green" },
              { name: "The Medical City", location: "Pasig", desc: "Équipe multilingue, dpt. international", color: "purple" },
              { name: "Asian Hospital", location: "Alabang (Sud Manila)", desc: "Excellentes infrastructures", color: "amber" },
              { name: "Cebu Doctors' University Hospital", location: "Cebu City", desc: "Référence Visayas, tarifs accessibles", color: "teal" },
              { name: "Chong Hua Hospital", location: "Cebu City", desc: "Accrédité JCI (standard international)", color: "indigo" }
            ].map((hospital, index) => (
              <div key={index} className={`bg-white border-l-4 border-l-${hospital.color}-500 rounded-xl shadow-sm p-5`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-${hospital.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Hospital className={`h-5 w-5 text-${hospital.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{hospital.name}</h4>
                    <p className={`text-xs text-${hospital.color}-600 mb-1`}>{hospital.location}</p>
                    <p className="text-xs text-muted-foreground">{hospital.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommandation finale */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Notre recommandation</h3>
                <p className="text-muted-foreground mb-6">
                  Pour une protection optimale, nous conseillons aux expatriés de combiner :
                </p>
                <div className="space-y-4">
                  {[
                    { num: "1", title: "PhilHealth", desc: "Couverture de base (obligatoire si salarié, recommandé sinon)", color: "green" },
                    { num: "2", title: "Une HMO locale", desc: "Maxicare, Intellicare pour soins courants et consultations", color: "blue" },
                    { num: "3", title: "Assurance internationale", desc: "Pour événements majeurs et rapatriement si budget le permet", color: "purple" }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4 bg-white/60 rounded-xl p-4">
                      <div className={`w-10 h-10 bg-${step.color}-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold">{step.num}</span>
                      </div>
                      <div>
                        <span className="font-semibold">{step.title}</span>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="border-t border-gray-200 pt-12">
          <h3 className="text-xl font-semibold text-center mb-6">Continuez votre exploration</h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { title: "Obtenir un visa", href: "/vivre-aux-philippines/s-installer/visas", desc: "Types de visas et procédures" },
              { title: "Trouver un logement", href: "/vivre-aux-philippines/s-installer/logement", desc: "Prix et conseils location" },
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

export default BanqueAssurancePage;
