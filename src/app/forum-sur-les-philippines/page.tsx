import { createClient } from '@/utils/supabase/server';
import { getForumCategories } from '@/services/forumService';
import { ForumListClient } from '@/app/forum-sur-les-philippines/ForumListClient';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forum Philippines : Communauté & Entraide',
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
  const supabase = await createClient();
  // Fetch data on the server
  const { data: forumCategories, error } = await getForumCategories(supabase);

  if (error) {
    return <p className="text-center text-destructive">Impossible de charger les catégories du forum.</p>;
  }

  const categories = forumCategories || [];
  const totalTopics = categories.reduce((sum, category) => sum + (category.topic_count || 0), 0);

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { label: 'Forum' },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Forum', item: '/forum-sur-les-philippines' },
  ];

  return (
    <main className="container mx-auto px-4 py-16 pt-32">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <Breadcrumb items={breadcrumbItems} />

      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Communauté
        </span>
        <h1
          className="font-bold text-foreground"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 2.75rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Forum Philippin&apos;<span className="text-accent">Easy</span>
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground text-pretty">
          La communauté francophone des Philippines. Posez vos questions, partagez vos
          expériences et trouvez des conseils auprès de voyageurs et d&apos;expatriés.
          {totalTopics > 0 && (
            <>
              {' '}Déjà <strong className="text-foreground">{totalTopics.toLocaleString('fr-FR')}</strong> sujet{totalTopics !== 1 ? 's' : ''} ouvert{totalTopics !== 1 ? 's' : ''} par la communauté.
            </>
          )}
        </p>
      </div>

      <ForumListClient initialCategories={categories} />

    </main>
  );
};

export default ForumsPage;
