import { createClient } from '@/utils/supabase/server';
import { getArticlesByCategorySlug } from '@/services/articleService';
import ArticleList from '@/components/shared/ArticleList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Actualités Philippines : Dernières Infos & Nouveautés | Philippin\'Easy',
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
  openGraph: {
    title: 'Actualités Philippines : Dernières Infos',
    description: 'Suivez l\'actualité des Philippines en français : news, événements et culture.',
    url: 'https://philippineasy.com/actualites-sur-les-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Actualités Philippines',
    description: 'Dernières nouvelles sur les Philippines',
    site: '@philippineasy',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function ActualitesPage() {
  const supabase = await createClient();
  const { data: articles, error } = await getArticlesByCategorySlug(supabase, 'actualites');

  if (error) {
    // TODO: Create a more user-friendly error component
    return <p className="text-destructive">Could not load articles: {error.message}</p>;
  }

  return (
    <main className="container mx-auto px-4 py-16 pt-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">Actualités & <span className="text-accent">Nouveautés</span></h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Restez à jour sur les dernières informations concernant les Philippines.
        </p>
      </div>

      <ArticleList articles={articles || []} basePath="actualites-sur-les-philippines" />
      
    </main>
  );
}
