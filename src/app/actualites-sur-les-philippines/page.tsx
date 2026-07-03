import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import { PageHero, CTABand, CardGrid, LinkCard } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { Plane, Home, Newspaper } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Actualités Philippines : Dernières Infos & Nouveautés',
  description: 'Suivez l\'actualité des Philippines en français : dernières news, événements, politique, économie, tourisme et culture philippine.',
  keywords: [
    'actualités Philippines',
    'news Philippines',
    'événements Philippines',
    'politique Philippines',
    'économie Philippines',
    'culture philippine',
    'tourisme Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/actualites-sur-les-philippines',
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
    title: 'Actualités Philippines : Dernières Infos',
    description: 'Suivez l\'actualité des Philippines en français : news, événements et culture.',
    url: 'https://philippineasy.com/actualites-sur-les-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/imagesHero/cebu-island-philippines.webp',
        width: 1200,
        height: 630,
        alt: 'Actualités des Philippines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Actualités Philippines',
    description: 'Dernières nouvelles sur les Philippines',
    site: '@philippineasy',
  },
};

export const revalidate = 3600; // Revalidate every hour

const breadcrumbItems = [
  { href: '/', label: 'Accueil' },
  { label: 'Actualités des Philippines' },
];

const breadcrumbJsonLdItems = [
  { name: 'Accueil', item: '/' },
  { name: 'Actualités des Philippines', item: '/actualites-sur-les-philippines' },
];

export default async function ActualitesPage() {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'actualites');

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-destructive">Impossible de charger les actualités : {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Actualités des Philippines"
        title="Toute l'actualité des"
        titleAccent="Philippines"
        subtitle="News, événements, société, tourisme et culture : notre veille sur l'archipel, décryptée et restituée en français."
        imageUrl="/imagesHero/cebu-island-philippines.webp"
        imageAlt="Vue sur une île des Philippines, illustrant l'actualité du pays"
      />

      {/* Breadcrumb + intro éditoriale */}
      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              <Newspaper className="h-4 w-4 text-primary" aria-hidden="true" />
              Notre veille
            </span>
            <p className="text-[16px] leading-[1.7] text-muted-foreground">
              Nous suivons ce qui bouge aux Philippines pour vous le restituer en français, sans
              jargon : événements marquants, vie quotidienne, tourisme et sujets pratiques pour les
              voyageurs comme pour les expatriés. Retrouvez ci-dessous nos derniers articles, publiés
              au fil de l&apos;eau.
            </p>
          </div>
        </div>
      </section>

      {/* Liste d'articles (composant existant, intact) */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ArticleList articles={articles || []} basePath="actualites-sur-les-philippines" />
        </div>
      </section>

      {/* Maillage interne — guides */}
      <section className="bg-background pb-4">
        <div className="container mx-auto px-4">
          <CardGrid
            eyebrow="Pour aller plus loin"
            title="Préparez votre"
            titleAccent="séjour"
            subtitle="Au-delà de l'actualité, nos guides pratiques pour voyager et vivre aux Philippines."
            columns={2}
          >
            <LinkCard
              href="/voyager-aux-philippines"
              icon={<Plane className="h-5 w-5" />}
              title="Voyager aux Philippines"
              desc="Itinéraires, îles, transports et bons plans pour un premier voyage réussi."
              cta="Voir les guides voyage"
            />
            <LinkCard
              href="/vivre-aux-philippines"
              icon={<Home className="h-5 w-5" />}
              title="Vivre aux Philippines"
              desc="Visas, santé, logement, banque : tout pour s'installer sur place sereinement."
              cta="Voir les guides expat"
            />
          </CardGrid>
        </div>
      </section>

      {/* CTA itinéraire IA */}
      <CTABand
        title="Envie de partir aux"
        titleAccent="Philippines ?"
        subtitle="Notre générateur d'itinéraires par IA construit votre voyage sur mesure en quelques minutes, gratuitement pour l'aperçu."
        primary={{
          label: 'Créer mon itinéraire',
          href: '/itineraire-personnalise-pour-les-philippines',
        }}
        secondary={{ label: 'Rejoindre le forum', href: '/forum-sur-les-philippines' }}
      />
    </div>
  );
}
