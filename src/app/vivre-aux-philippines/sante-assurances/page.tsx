import { Metadata } from 'next';
import { Shield, Hospital, AlertTriangle, CheckCircle, Heart, Globe, Landmark, Syringe, ShieldAlert } from 'lucide-react';
import { PageHero, StatRow, CardGrid, LinkCard, type StatItem } from '@/components/sections';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { AffiliateRecommendation } from '@/components/affiliate/AffiliateRecommendation';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Santé et Assurances aux Philippines 2026 : Guide Expatrié",
  description: "Guide complet sur le système de santé philippin et les assurances pour expatriés : PhilHealth, HMO locales (Maxicare, Intellicare, MediCard), assurances internationales et hôpitaux de référence.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/sante-assurances',
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
    title: "Santé et Assurances aux Philippines 2026 : Guide Expatrié",
    description: "Choisir une assurance santé et comprendre le système de soins aux Philippines. Guide pratique pour expatriés avec comparatif PhilHealth, HMO et assurances internationales.",
    url: 'https://philippineasy.com/vivre-aux-philippines/sante-assurances',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Santé et Assurances aux Philippines 2026",
    description: "Guide complet pour expatriés : système de santé et assurances aux Philippines.",
  },
};

const quickStats: StatItem[] = [
  { icon: <Shield className="text-[18px]" />, value: '3', label: "types d'assurance" },
  { icon: <Hospital className="text-[18px]" />, value: '6', label: 'hôpitaux de référence' },
  { icon: <Heart className="text-[18px]" />, value: '3', label: 'HMO locales' },
  { icon: <Globe className="text-[18px]" />, value: '4', label: 'assureurs internationaux' },
];

const SanteAssurancesPage = async () => {
  const supabase = await createClient();
  const { data: articles } = await getArticlesByCategorySlug(supabase, 'sante-assurances');

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
    { label: 'Santé & Assurances' },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
    { name: 'Santé & Assurances', item: '/vivre-aux-philippines/sante-assurances' },
  ];

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Santé &"
        titleAccent="Assurances"
        subtitle="Protégez votre santé aux Philippines : système de soins, PhilHealth, HMO locales et assurances internationales pour vivre l'esprit tranquille."
        imageUrl="/imagesHero/securite-et-sante-aux-philippines.webp"
        imageAlt="Santé & Assurances"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        <Breadcrumb items={breadcrumbItems} />

        {/* Stats rapides */}
        <section className="mb-12">
          <StatRow stats={quickStats} className="justify-center" />
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Une fois installé aux Philippines, souscrire une assurance santé adaptée est une priorité
            pour vous protéger en cas de pépin. Le système de santé philippin est de qualité dans les
            grandes villes, mais les soins peuvent être coûteux. Ce guide vous accompagne dans le choix
            d'une couverture adaptée à votre situation.
          </p>
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
          <CardGrid
            title="Les HMO locales"
            subtitle="Health Maintenance Organizations - Couverture complémentaire recommandée"
            columns={3}
            className="mb-10"
          >
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
          </CardGrid>

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
          <CardGrid title="Hôpitaux de référence" columns={3}>
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
          </CardGrid>
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

        {/* Pour aller plus loin : renvois vers les guides santé & sécurité voyage */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold">Pour aller plus loin</h2>
          </div>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Avant même votre installation, préparez votre santé pour les Philippines avec nos guides
            dédiés aux voyageurs : vaccins recommandés et conseils de sécurité au quotidien.
          </p>
          <CardGrid columns={3}>
            <LinkCard
              href="/voyager-aux-philippines/sante-securite"
              icon={<Shield className="h-5 w-5" />}
              title="Santé & Sécurité en voyage"
              desc="Le guide complet avant le départ"
            />
            <LinkCard
              href="/voyager-aux-philippines/sante-securite/vaccins"
              icon={<Syringe className="h-5 w-5" />}
              title="Vaccins recommandés"
              desc="Quels vaccins prévoir avant de partir"
            />
            <LinkCard
              href="/voyager-aux-philippines/sante-securite/conseils"
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Conseils de sécurité"
              desc="Précautions au quotidien"
            />
          </CardGrid>
        </section>

        {/* Affiliate recommendations */}
        <AffiliateRecommendation
          title="Nos recommandations pour les expats"
          icon={faShieldHalved}
          location="sante_assurances_page"
          items={[
            {
              name: 'Chapka',
              description: "Pour les expats: Cap Expatrie couvre les frais medicaux, hospitalisation et rapatriement aux Philippines. Alternative aux HMO locales pour une couverture complete.",
              advantage: 'Couverture monde entier — rapatriement inclus',
              url: 'https://www.chapkadirect.fr/assurance-voyage.html',
              recommended: true,
            },
          ]}
        />

        {/* Voir aussi */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <LinkCard
              href="/vivre-aux-philippines/banque-finances"
              icon={<Landmark className="h-5 w-5" />}
              title="Voir aussi : Banque & Finances"
              desc="Ouvrir un compte, transférer de l'argent et gérer son quotidien"
            />
          </div>
        </section>

        {/* Articles */}
        {articles && articles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Articles sur la Santé & les Assurances</h2>
            <ArticleList articles={articles} basePath="vivre-aux-philippines" />
          </section>
        )}

        {/* Navigation */}
        <section className="border-t border-gray-200 pt-12">
          <CardGrid title="Continuez votre exploration" columns={4}>
            <LinkCard href="/vivre-aux-philippines/banque-finances" title="Banque & Finances" desc="Comptes bancaires et transferts" />
            <LinkCard href="/vivre-aux-philippines/visas-et-formalites" title="Obtenir un visa" desc="Types de visas et procédures" />
            <LinkCard href="/vivre-aux-philippines/logement" title="Trouver un logement" desc="Prix et conseils location" />
            <LinkCard href="/forum-sur-les-philippines" title="Forum expatriés" desc="Échangez avec la communauté" />
          </CardGrid>
        </section>

      </div>
    </div>
  );
};

export default SanteAssurancesPage;
