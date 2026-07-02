import { Metadata } from 'next';
import { Landmark, CreditCard, AlertTriangle, CheckCircle, ExternalLink, FileText, ChevronRight, Smartphone, Clock, HeartPulse } from 'lucide-react';
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { PageHero, StatRow, CardGrid, LinkCard } from '@/components/sections';

export const metadata: Metadata = {
  title: "Banque et Finances aux Philippines 2026 : Guide Expatrié",
  description: "Guide complet pour ouvrir un compte bancaire aux Philippines (BDO, BPI, Metrobank), transférer de l'argent et gérer vos finances au quotidien. Documents requis, wallets digitaux, alternatives.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/banque-finances',
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
    title: "Banque et Finances aux Philippines 2026 : Guide Expatrié",
    description: "Ouvrir un compte bancaire, transférer de l'argent et gérer son quotidien aux Philippines. Guide pratique pour expatriés avec documents requis et comparatif.",
    url: 'https://philippineasy.com/vivre-aux-philippines/banque-finances',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Banque et Finances aux Philippines 2026",
    description: "Guide complet pour expatriés : compte bancaire, transferts et argent au quotidien aux Philippines.",
  },
};

const BanqueFinancesPage = async () => {
  const supabase = await createClient();
  const { data: articles } = await getArticlesByCategorySlug(supabase, 'banque-finances');

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
    { label: 'Banque & Finances' },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
    { name: 'Banque & Finances', item: '/vivre-aux-philippines/banque-finances' },
  ];

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Banque &"
        titleAccent="Finances"
        subtitle="Ouvrez un compte, transférez votre argent et gérez votre quotidien financier aux Philippines : tout ce qu'il faut savoir pour s'organiser sereinement."
        imageUrl="/imagesHero/banque-assurance-philippines.webp"
        imageAlt="Banque & Finances"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        <Breadcrumb items={breadcrumbItems} />

        {/* Stats rapides */}
        <section className="mb-12">
          <StatRow
            stats={[
              { icon: <Landmark className="h-5 w-5" />, value: '3', label: 'grandes banques' },
              { icon: <Clock className="h-5 w-5" />, value: '59', label: 'jours min. résidence' },
              { icon: <Smartphone className="h-5 w-5" />, value: '2', label: 'portefeuilles digitaux' },
              { icon: <FileText className="h-5 w-5" />, value: '6', label: 'documents requis' },
            ]}
            className="justify-center gap-x-14"
          />
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Une fois installé aux Philippines, ouvrir un compte bancaire local facilite grandement
            vos transactions quotidiennes : recevoir votre salaire, payer vos factures, transférer
            de l'argent depuis l'étranger. Ce guide vous accompagne dans ces démarches essentielles.
          </p>
        </section>

        {/* ========== SECTION BANQUE ========== */}
        <section className="mb-16">
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

        {/* ========== SECTION TRANSFERTS & ARGENT AU QUOTIDIEN ========== */}
        <section className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold">Transférer de l'argent au quotidien</h2>
          </div>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto">
            Pour recevoir un salaire depuis l'étranger ou envoyer de l'argent vers les Philippines,
            les néobanques multi-devises comme Wise complètent utilement un compte bancaire local
            et les portefeuilles digitaux GCash ou Maya.
          </p>
        </section>

        {/* Affiliate recommendations */}
        <AffiliateRecommendation
          title="Nos recommandations pour les expats"
          icon={faMoneyBillTransfer}
          location="banque_finances_page"
          items={[
            {
              name: 'Wise',
              description: 'Compte multi-devises EUR + PHP + USD. Recevez votre salaire en euros, convertissez au taux reel, et payez en PHP avec la carte Wise. 16 millions d\'utilisateurs.',
              advantage: 'Economisez 3-5% vs banques traditionnelles — 0 frais mensuels',
              url: 'https://wise.com/fr/send-money/send-money-to-philippines',
              recommended: true,
            },
          ]}
        />

        {/* Voir aussi */}
        <section className="mb-16">
          <div className="mx-auto max-w-4xl">
            <LinkCard
              href="/vivre-aux-philippines/sante-assurances"
              icon={<HeartPulse className="h-5 w-5" />}
              title="Voir aussi : Santé & Assurances"
              desc="PhilHealth, HMO locales, assurances internationales et hôpitaux de référence"
            />
          </div>
        </section>

        {/* Articles */}
        {articles && articles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Articles sur la Banque & les Finances</h2>
            <ArticleList articles={articles} basePath="vivre-aux-philippines" />
          </section>
        )}

        {/* Navigation */}
        <section className="border-t border-border pt-12">
          <CardGrid title="Continuez votre exploration" columns={4}>
            <LinkCard href="/vivre-aux-philippines/sante-assurances" title="Santé & Assurances" desc="PhilHealth, HMO et hôpitaux" />
            <LinkCard href="/vivre-aux-philippines/visas-et-formalites" title="Obtenir un visa" desc="Types de visas et procédures" />
            <LinkCard href="/vivre-aux-philippines/logement" title="Trouver un logement" desc="Prix et conseils location" />
            <LinkCard href="/forum-sur-les-philippines" title="Forum expatriés" desc="Échangez avec la communauté" />
          </CardGrid>
        </section>

      </div>
    </div>
  );
};

export default BanqueFinancesPage;
