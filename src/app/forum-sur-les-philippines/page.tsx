import { createClient } from '@/utils/supabase/server';
import { getForumCategories } from '@/services/forumService';
import { ForumListClient } from '@/app/forum-sur-les-philippines/ForumListClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forums | Philippin\'Easy',
  description: 'Partagez, échangez et trouvez des réponses auprès d\'autres passionnés des Philippines.',
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
