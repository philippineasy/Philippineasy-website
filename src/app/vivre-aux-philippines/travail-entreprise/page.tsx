import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Home } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBuilding, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { PageHero, StatRow, SplitSection, CardGrid, LinkCard } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import ArticleList from '@/components/shared/ArticleList';
import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';

export const metadata: Metadata = {
  title: 'Travailler et Entreprendre aux Philippines',
  description:
    "Du salariat à la création d'entreprise : guide complet pour trouver un emploi, monter votre société et investir aux Philippines (bourse, immobilier).",
  alternates: {
    canonical: 'https://philippineasy.com/vivre-aux-philippines/travail-entreprise',
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
    title: 'Travailler et Entreprendre aux Philippines',
    description:
      "Emploi salarié, création d'entreprise et investissement : le guide complet pour construire votre vie professionnelle aux Philippines.",
    url: 'https://philippineasy.com/vivre-aux-philippines/travail-entreprise',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travailler et Entreprendre aux Philippines',
    description: "Emploi salarié, création d'entreprise et investissement aux Philippines : le guide complet.",
    site: '@philippineasy',
  },
};

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { href: '/vivre-aux-philippines', label: 'Vivre aux Philippines' },
  { label: 'Travail & Entreprise' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Vivre aux Philippines', item: '/vivre-aux-philippines' },
  { name: 'Travail & Entreprise', item: '/vivre-aux-philippines/travail-entreprise' },
];

const TravailEntreprisePage = async () => {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'travail-entreprise');

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Vivre aux Philippines"
        title="Travailler aux"
        titleAccent="Philippines"
        subtitle="Du salariat à l'entrepreneuriat, découvrez les opportunités professionnelles qui vous attendent dans l'archipel."
        imageUrl="/imagesHero/travailleur-etranger-aux-philippines.webp"
        imageAlt="Travailler aux Philippines"
      />

      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <h2 className="text-3xl font-bold text-center mb-12">Le Marché du Travail en Chiffres</h2>
          <StatRow
            stats={[
              {
                icon: <FontAwesomeIcon icon={faBriefcase} className="text-[18px]" />,
                value: 'BPO',
                label: 'Secteur qui recrute le plus',
              },
              {
                icon: <FontAwesomeIcon icon={faBuilding} className="text-[18px]" />,
                value: 'PEZA',
                label: 'Zones économiques spéciales pour entreprises',
              },
              {
                icon: <FontAwesomeIcon icon={faLightbulb} className="text-[18px]" />,
                value: 'Top 50',
                label: "Classement mondial 'Ease of Doing Business'",
              },
            ]}
            className="justify-center gap-x-16"
          />
        </div>
      </div>

      <SplitSection
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
        imageAlt="Réunion de travail dans un bureau moderne"
        title="Trouver un"
        titleAccent="Emploi Salarié"
      >
        <p>Le secteur des BPO (Business Process Outsourcing) reste le plus grand pourvoyeur d&apos;emplois pour les profils internationaux. Notre guide complet détaille les secteurs qui recrutent, les plateformes incontournables (JobStreet, LinkedIn), les salaires pratiqués ainsi que les démarches administratives : visa de travail 9G et permis AEP.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Postes recherchés :</b> Développeurs, spécialistes support, analystes financiers.</li>
          <li><b>Démarches :</b> Visa 9G et permis de travail AEP expliqués pas à pas.</li>
          <li><b>Salaires :</b> Fourchettes réelles selon l&apos;expérience et le secteur.</li>
        </ul>
        <Link
          href="/vivre-aux-philippines/travailler/emploi-salarie"
          className="text-primary font-bold hover:underline mt-4 inline-flex items-center gap-2"
        >
          Le guide complet de l&apos;emploi salarié <ArrowRight className="h-4 w-4" />
        </Link>
      </SplitSection>

      <SplitSection
        imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
        imageAlt="Personne présentant un projet sur un tableau blanc"
        reverse
        tone="muted"
        title="Créer son"
        titleAccent="Entreprise"
      >
        <p>Les Philippines encouragent l&apos;entrepreneuriat étranger : structures juridiques, capital minimum, enregistrement auprès de la SEC, avantages PEZA et limites de la FINL (Foreign Investment Negative List). Notre guide complet détaille chaque étape pour lancer votre activité en 2026.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li><b>Structures juridiques :</b> Corporation, Sole Proprietorship, Branch Office...</li>
          <li><b>Avantages PEZA :</b> Incitations fiscales et non fiscales importantes.</li>
          <li><b>Capital requis :</b> Varie selon le type d&apos;activité et la part d&apos;actionnariat étranger.</li>
        </ul>
        <Link
          href="/vivre-aux-philippines/travailler/creer-entreprise"
          className="text-primary font-bold hover:underline mt-4 inline-flex items-center gap-2"
        >
          Le guide complet de la création d&apos;entreprise <ArrowRight className="h-4 w-4" />
        </Link>
      </SplitSection>

      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-4">
          <CardGrid
            title="Investir aux"
            titleAccent="Philippines"
            subtitle="Au-delà de l'emploi et de l'entreprise, deux voies pour faire fructifier votre capital sur l'archipel."
            columns={2}
          >
            <LinkCard
              href="/vivre-aux-philippines/investir/bourse-et-entreprises"
              icon={<TrendingUp className="h-5 w-5" />}
              title="Bourse & Entreprises"
              desc="Ouverture de compte sur le Philippine Stock Exchange (PSE), fiscalité, secteurs porteurs et visa investisseur."
              cta="Voir le guide"
            />
            <LinkCard
              href="/vivre-aux-philippines/investir/immobilier"
              icon={<Home className="h-5 w-5" />}
              title="Immobilier Locatif"
              desc="Rendement par zone, fiscalité des loyers et règle des 40% pour les acquéreurs étrangers."
              cta="Voir le guide"
            />
          </CardGrid>
          <p className="text-center mt-10">
            <Link
              href="/vivre-aux-philippines/travail-entreprise/investir-aux-philippines-guide-francais-2025"
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              Découvrir le guide complet de l&apos;investissement aux Philippines →
            </Link>
          </p>
        </div>
      </section>

      <div className="bg-muted">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nos articles Travail & Entreprise</h2>
          {articles && <ArticleList articles={articles} basePath="vivre-aux-philippines" />}
        </div>
      </div>
    </div>
  );
};

export default TravailEntreprisePage;
