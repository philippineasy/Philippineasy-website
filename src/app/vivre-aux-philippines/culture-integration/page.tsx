import { Metadata } from 'next';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard, type StatItem } from '@/components/sections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandshake,
  faHome,
  faSchool,
  faHeartbeat,
  faPassport,
  faGlobeAsia,
  faGraduationCap,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Culture & Intégration aux Philippines',
  description:
    "Comprendre la culture philippine, les coutumes locales, et des conseils pour une intégration réussie : en solo, en famille, ou pendant vos études aux Philippines.",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/culture-integration',
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
    title: 'Culture & Intégration aux Philippines',
    description:
      "Comprendre la culture philippine, les coutumes locales, et des conseils pour une intégration réussie aux Philippines.",
    url: 'https://philippineasy.com/vivre-aux-philippines/culture-integration',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Culture & Intégration aux Philippines',
    description:
      "Comprendre la culture philippine, les coutumes locales, et une intégration réussie aux Philippines.",
    site: '@philippineasy',
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
  { label: 'Culture & Intégration' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
  { name: 'Culture & Intégration', item: '/vivre-aux-philippines/culture-integration' },
];

const educationStats: StatItem[] = [
  { icon: <FontAwesomeIcon icon={faGraduationCap} className="text-[18px]" />, value: 'Top 4', label: 'Universités de renommée mondiale' },
  { icon: <FontAwesomeIcon icon={faSchool} className="text-[18px]" />, value: '20+', label: 'Grandes écoles internationales' },
  { icon: <FontAwesomeIcon icon={faGlobe} className="text-[18px]" />, value: 'Anglais', label: "Langue principale d'enseignement" },
];

const CultureIntegrationPage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'culture-integration');

  if (error) {
    console.error(error);
    // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
  }

  const articleCount = articles?.length ?? 0;

  const heroStats: StatItem[] = [
    { icon: <FontAwesomeIcon icon={faHandshake} className="text-[18px]" />, value: `${articleCount} Guides`, label: 'Culture & Intégration' },
    { icon: <FontAwesomeIcon icon={faHome} className="text-[18px]" />, value: '1 500€ - 3 000€', label: 'Budget familial mensuel' },
    { icon: <FontAwesomeIcon icon={faGraduationCap} className="text-[18px]" />, value: 'Top 4', label: 'Universités de renommée mondiale' },
  ];

  return (
    <div>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Culture & Intégration"
        titleAccent="aux Philippines"
        subtitle="Comprendre la culture philippine, les coutumes locales, et des conseils pour une intégration réussie — en solo, en famille, ou le temps de vos études."
        imageUrl="/imagesHero/nouveau-depart-aux-philippines.webp"
        imageAlt="Culture & Intégration aux Philippines"
      />

      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Vivre, Grandir et Étudier aux Philippines</h2>
          <StatRow stats={heroStats} className="justify-center" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Section : S'intégrer */}
      <SplitSection title="S'intégrer" titleAccent="aux Philippines">
        <p className="text-lg text-center max-w-3xl mx-auto text-muted-foreground">
          Vivre aux Philippines, c'est avant tout comprendre sa culture et ses coutumes locales : les valeurs
          familiales, la vie communautaire, et les usages qui structurent le quotidien. L'anglais est parlé
          partout, ce qui facilite les échanges, mais c'est la compréhension des dynamiques sociales et
          familiales qui permet une intégration réussie — que vous vous installiez seul, en couple, ou en
          famille. Nos guides ci-dessous vous accompagnent dans cette découverte : vie de couple et codes
          culturels, rencontres, et coopération franco-philippine.
        </p>
      </SplitSection>

      {/* Section : En famille (contenu du hub famille) */}
      <div className="bg-white text-gray-800">
        <div className="container mx-auto px-4 py-16 space-y-16">
          <CardGrid
            title="Un Nouveau Chapitre Familial"
            subtitle="S'expatrier en famille aux Philippines est une aventure excitante. Le pays offre un coût de la vie attractif, une population accueillante et une nature luxuriante. Voici les clés pour réussir votre installation."
            columns={3}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faHome} className="text-primary" />
                  Logement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Condominiums sécurisés à Manille (700-1200€) ou maisons à Cebu/Davao (400-600€).</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faSchool} className="text-primary" />
                  Scolarité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Écoles internationales de haut niveau (10k-25k€/an) avec cursus IB, US ou UK.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faHeartbeat} className="text-primary" />
                  Santé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Hôpitaux privés de qualité. Assurance santé internationale indispensable.</p>
              </CardContent>
            </Card>
          </CardGrid>

          <SplitSection
            title="Budget et Coût de la Vie"
            imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
            imageAlt="Famille heureuse dans une maison moderne"
          >
            <p className="text-lg leading-relaxed">
              Le coût de la vie est un atout majeur. Un budget familial mensuel se situe entre 1 500 € et
              3 000 €, incluant toutes les dépenses courantes.
            </p>
            <table className="w-full mt-4 text-left">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Logement</td>
                  <td>600€ - 1500€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Nourriture</td>
                  <td>350€ - 600€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Scolarité</td>
                  <td>800€ - 2100€</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Santé & Loisirs</td>
                  <td>250€ - 500€</td>
                </tr>
              </tbody>
            </table>
          </SplitSection>

          <SplitSection
            title="Éducation Internationale"
            imageUrl="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
            imageAlt="Salle de classe internationale"
            reverse
            tone="muted"
          >
            <p className="text-lg leading-relaxed">
              Les Philippines abritent d'excellentes écoles internationales, principalement à Manille et
              Cebu. Elles offrent un environnement multiculturel et des programmes reconnus mondialement.
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>International School Manila (ISM)</li>
              <li>British School Manila (BSM)</li>
              <li>Brent International School</li>
            </ul>
            <Link
              href="/vivre-aux-philippines/etudier/ecoles-internationales"
              className="text-accent font-bold hover:underline mt-6 inline-block"
            >
              → Voir notre guide des écoles
            </Link>
          </SplitSection>

          <CardGrid title="Installation et Vie Quotidienne" columns={2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faPassport} className="text-accent" />
                  Visas et Administration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les visas 13A (mariage), 9G (travail) ou SRRV (retraite) sont les plus courants. L'ACR Card
                  est obligatoire pour les résidents.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faGlobeAsia} className="text-accent" />
                  Intégration Locale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  L'anglais est parlé partout. Utilisez Grab pour les déplacements et rejoignez les groupes
                  Facebook d'expatriés pour des conseils.
                </p>
              </CardContent>
            </Card>
          </CardGrid>
        </div>
      </div>

      {/* Section : Étudier (contenu du hub étudier + guides mis en avant) */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center pt-16">Étudier aux Philippines</h2>

        <div className="bg-muted py-16 my-12">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-12">Le Système Éducatif en Chiffres</h3>
            <StatRow stats={educationStats} className="justify-center" />
          </div>
        </div>

        <SplitSection
          title="Les Universités de Prestige"
          imageUrl="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
          imageAlt="Campus de l'Université des Philippines"
        >
          <p>
            Les Philippines comptent plusieurs universités de premier plan, comme l'Université des
            Philippines (UP), Ateneo de Manila (ADMU) ou De La Salle University (DLSU). Elles offrent un
            large éventail de programmes en anglais et attirent des étudiants de toute l'Asie.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Top universités :</b> UP, Ateneo, La Salle, UST.</li>
            <li><b>Domaines d'excellence :</b> Commerce, Ingénierie, Médecine.</li>
            <li><b>Frais de scolarité :</b> Très abordables comparés à l'Europe ou l'Amérique du Nord.</li>
          </ul>
          <Link
            href="/vivre-aux-philippines/etudier/universites"
            className="text-primary font-bold hover:underline mt-4 inline-block"
          >
            Classement des universités →
          </Link>
        </SplitSection>

        <SplitSection
          title="Écoles Internationales"
          imageUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
          imageAlt="Salle de classe dans une école internationale"
          reverse
          tone="muted"
        >
          <p>
            Pour les familles d'expatriés, de nombreuses écoles internationales proposent des cursus
            américain, britannique, ou international (IB). Ces écoles offrent un enseignement de haute
            qualité et préparent les élèves aux meilleures universités du monde.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><b>Exemples :</b> International School Manila (ISM), British School Manila.</li>
            <li><b>Coûts :</b> Élevés, similaires aux standards internationaux.</li>
            <li><b>Localisation :</b> Principalement à Manille et Cebu.</li>
          </ul>
          <Link
            href="/vivre-aux-philippines/etudier/ecoles-internationales"
            className="text-primary font-bold hover:underline mt-4 inline-block"
          >
            Trouver une école internationale →
          </Link>
        </SplitSection>

        <div className="container mx-auto px-4 py-16">
          <CardGrid title="Nos Guides Complets pour Étudier" columns={2}>
            <LinkCard
              href="/vivre-aux-philippines/etudier/universites"
              icon={<FontAwesomeIcon icon={faGraduationCap} />}
              title="Les Universités Philippines"
              desc="Le classement des meilleures universités philippines (UP, Ateneo, DLSU, UST) : domaines d'excellence, frais de scolarité et visa étudiant 9F. En 2026, 35 universités philippines figurent dans le classement QS Asia, avec l'Université des Philippines en tête."
              cta="Lire le guide complet"
            />
            <LinkCard
              href="/vivre-aux-philippines/etudier/ecoles-internationales"
              icon={<FontAwesomeIcon icon={faSchool} />}
              title="Les Écoles Internationales"
              desc="Le guide complet des écoles internationales aux Philippines (ISM, BSM, Brent, Nord Anglia) : frais de scolarité, curricula IB et britannique, admission et visas pour enfants d'expatriés. Une vingtaine d'écoles accréditées, principalement à Metro Manila."
              cta="Lire le guide complet"
            />
          </CardGrid>
        </div>
      </section>

      {/* Section : Articles de la catégorie */}
      {articles && articles.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nos articles Culture & Intégration</h2>
          <ArticleList articles={articles} basePath="vivre-aux-philippines" />
        </div>
      )}
    </div>
  );
};

export default CultureIntegrationPage;
