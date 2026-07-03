import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import { getTopicBySlug, getPostsByTopicId } from '@/services/forumService';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TopicClientPage } from '@/app/forum-sur-les-philippines/sujet/[slug]/TopicClientPage';
import { ForumHeroCompact } from '@/components/forum/ForumHeroCompact';
import { ForumCommunityLinks } from '@/components/forum/ForumCommunityLinks';
import { ForumStatePanel } from '@/components/forum/ForumStatePanel';
import { CTABand } from '@/components/sections';
import { MessageSquareOff } from 'lucide-react';
import type { Metadata } from 'next';
import ForumJsonLd from '@/components/shared/ForumJsonLd';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { ForumTopic, ForumPost } from '@/types';
import { generateForumTopicMetaDescription } from '@/utils/seo/metaDescriptionGenerator';

const HERO_IMAGE = '/imagesHero/hutte-philippines.webp';
const HERO_ALT = 'Maison traditionnelle philippine (bahay kubo) nichée dans la végétation tropicale';

const TopicErrorState = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-background">
    <ForumHeroCompact eyebrow="Forum communauté" title={title} imageUrl={HERO_IMAGE} imageAlt={HERO_ALT} />
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <ForumStatePanel
          icon={<MessageSquareOff className="h-6 w-6" aria-hidden="true" />}
          title={title}
          description={description}
          actions={[{ label: 'Retour au forum', href: '/forum-sur-les-philippines', variant: 'primary' }]}
        />
      </div>
    </section>
  </div>
);

export async function generateStaticParams() {
  const supabase = createBuildClient();
  if (!supabase) return [];
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
    title: `${topic.title} - Forum`,
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
      <TopicErrorState
        title="Ce sujet est introuvable"
        description="Le sujet que vous cherchez n'existe pas, a été déplacé ou supprimé. Explorez les discussions en cours de la communauté."
      />
    );
  }

  const { data: initialPosts, error: postsError } = await getPostsByTopicId(supabase, topic.id);

  if (postsError) {
    return (
      <TopicErrorState
        title="Messages indisponibles"
        description="Les messages de ce sujet n'ont pas pu être chargés pour l'instant. Réessayez dans un moment."
      />
    );
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
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <ForumJsonLd topic={topic as ForumTopic} posts={initialPosts as ForumPost[] || []} />

      <ForumHeroCompact
        eyebrow="Forum communauté"
        title={topic.category?.name || 'Discussion'}
        imageUrl={HERO_IMAGE}
        imageAlt={HERO_ALT}
      />

      <section className="bg-background pt-8 md:pt-10">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mx-auto max-w-4xl">
            <TopicClientPage initialTopic={topic} initialPosts={initialPosts || []} />
          </div>
        </div>
      </section>

      <ForumCommunityLinks />

      <CTABand
        title="Prêt à explorer"
        titleAccent="les Philippines ?"
        subtitle="Transformez ces conseils en voyage : composez un itinéraire sur mesure en quelques minutes avec notre assistant."
        primary={{ label: 'Créer mon itinéraire', href: '/itineraire-personnalise-pour-les-philippines' }}
        secondary={{ label: 'Parcourir le forum', href: '/forum-sur-les-philippines' }}
      />
    </div>
  );
}
