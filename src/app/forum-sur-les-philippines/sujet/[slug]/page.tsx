import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import { getTopicBySlug, getPostsByTopicId } from '@/services/forumService';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TopicClientPage } from '@/app/forum-sur-les-philippines/sujet/[slug]/TopicClientPage';
import type { Metadata } from 'next';
import ForumJsonLd from '@/components/shared/ForumJsonLd';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { ForumTopic, ForumPost } from '@/types';
import { generateForumTopicMetaDescription } from '@/utils/seo/metaDescriptionGenerator';

export async function generateStaticParams() {
  const supabase = createBuildClient();
  const { data: topics } = await supabase
    .from('forum_topics')
    .select('slug');

  if (!topics) {
    return [];
  }

  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

// ✅ params en Promise pour generateMetadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: topic } = await getTopicBySlug(supabase, slug);

  if (!topic) {
    return {
      title: 'Sujet non trouvé',
    };
  }

  // Récupérer le premier post pour générer une description intelligente
  const { data: posts } = await supabase
    .from('forum_posts')
    .select('content')
    .eq('topic_id', topic.id)
    .order('created_at', { ascending: true })
    .limit(1);

  const firstPostContent = posts?.[0]?.content;

  const description = generateForumTopicMetaDescription(
    topic.title,
    firstPostContent,
    topic.category?.name,
    { maxLength: 155, addEllipsis: true }
  );

  const canonicalUrl = `https://philippineasy.com/forum-sur-les-philippines/sujet/${slug}`;

  return {
    title: `${topic.title} | Forum Philippin'Easy`,
    description,
    keywords: ['forum Philippines', topic.title, topic.category?.name || '', 'discussion', 'communauté Philippines'],
    alternates: {
      canonical: canonicalUrl,
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
      title: topic.title,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: topic.title,
      description,
      site: '@philippineasy',
    },
  };
}

// ✅ idem pour la page
export default async function ForumTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  
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

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Forums', item: '/forum-sur-les-philippines' },
    { name: topic.category?.name || 'Catégorie', item: `/forum-sur-les-philippines/${topic.category?.slug || ''}` },
    { name: topic.title, item: `/forum-sur-les-philippines/sujet/${slug}` },
  ];

  return (
    <main className="container mx-auto px-4 py-16 pt-32">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <ForumJsonLd topic={topic as ForumTopic} posts={initialPosts as ForumPost[] || []} />
      <Breadcrumb items={breadcrumbItems} />
      <TopicClientPage initialTopic={topic} initialPosts={initialPosts || []} />
    </main>
  );
}
