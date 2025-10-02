import { createClient } from '@/utils/supabase/server';
import { getForumCategories } from '@/services/forumService';
import { ForumListClient } from '@/app/forum-sur-les-philippines/ForumListClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forum Philippines : Communauté & Entraide | Philippin\'Easy',
  description: 'Rejoignez la communauté francophone des Philippines : posez vos questions, partagez vos expériences, trouvez des conseils sur le voyage, l\'expatriation et la vie aux Philippines.',
  keywords: [
    'forum Philippines',
    'communauté Philippines',
    'expat Philippines',
    'questions Philippines',
    'conseils voyage Philippines',
    'entraide Philippines',
    'français Philippines',
  ],
  alternates: {
    canonical: 'https://philippineasy.com/forum-sur-les-philippines',
  },
  openGraph: {
    title: 'Forum Philippines : Communauté & Entraide',
    description: 'Rejoignez la communauté francophone des Philippines : questions, conseils et partage d\'expériences.',
    url: 'https://philippineasy.com/forum-sur-les-philippines',
    siteName: "Philippin'Easy",
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forum Philippines - Communauté',
    description: 'Communauté francophone des Philippines',
    site: '@philippineasy',
  },
};

export const revalidate = 3600; // Revalidate every hour

// This is now a Server Component
const ForumsPage = async () => {
  const supabase = createClient();
  // Fetch data on the server
  const { data: forumCategories, error } = await getForumCategories(supabase);

  if (error) {
    return <p className="text-center text-destructive">Impossible de charger les catégories du forum.</p>;
  }

  return (
    <main className="container mx-auto px-4 py-16 pt-32">
      <h1 className="text-4xl font-bold text-center mb-4">Forums & <span className="text-primary">Communauté</span></h1>
      <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
        Partagez, échangez et trouvez des réponses auprès d'autres passionnés des Philippines.
      </p>
      
      <ForumListClient initialCategories={forumCategories || []} />

    </main>
  );
};

export default ForumsPage;
