import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getTopicBySlug, getPostsByTopicId } from '@/services/forumService';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TopicClientPage } from '@/app/forum-sur-les-philippines/sujet/[slug]/TopicClientPage';
import type { Metadata } from 'next';
import ForumJsonLd from '@/components/shared/ForumJsonLd';
import { ForumTopic, ForumPost } from '@/types';

// ✅ params en Promise pour generateMetadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient();
  const { data: topic } = await getTopicBySlug(supabase, slug);

  if (!topic) {
    return {
      title: 'Sujet non trouvé',
    };
  }

  return {
    title: `${topic.title} | Forum Philippin'Easy`,
    description: `Discussion sur ${topic.title}.`,
  };
}

// ✅ idem pour la page
export default async function ForumTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
  
  const { data: topic, error: topicError } = await getTopicBySlug(supabase, slug);

  if (topicError || !topic) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive">Sujet non trouvé</h1>
          <p className="mt-4 text-muted-foreground">Le sujet que vous cherchez n'existe pas ou a été déplacé.</p>
          <Link href="/forum-sur-les-philippines" className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Retour aux forums
          </Link>
        </div>
      </main>
    );
  }

  const { data: initialPosts, error: postsError } = await getPostsByTopicId(supabase, topic.id);

  if (postsError) {
    return <p className="text-center text-destructive">Impossible de charger les messages pour ce sujet.</p>;
  }

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/forum-sur-les-philippines', label: 'Forums' },
    { href: `/forum-sur-les-philippines/${topic.category?.slug || ''}`, label: topic.category?.name || 'Catégorie' },
    { label: topic.title },
  ];

  return (
    <main className="container mx-auto px-4 py-16 pt-32">
      <ForumJsonLd topic={topic as ForumTopic} posts={initialPosts as ForumPost[] || []} />
      <Breadcrumb items={breadcrumbItems} />
      <TopicClientPage initialTopic={topic} initialPosts={initialPosts || []} />
    </main>
  );
}
