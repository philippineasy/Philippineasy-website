import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import { getTopicsByCategorySlug, getForumCategoryBySlug } from '@/services/forumService';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TopicListClient } from '@/app/forum-sur-les-philippines/[slug]/TopicListClient';
import { ForumCommunityLinks } from '@/components/forum/ForumCommunityLinks';
import { ForumStatePanel } from '@/components/forum/ForumStatePanel';
import { PageHero, CTABand } from '@/components/sections';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { AlertTriangle, Compass, MessagesSquare } from 'lucide-react';
import type { Metadata } from 'next';

const HERO_IMAGE = '/imagesHero/hutte-philippines.webp';
const HERO_ALT = 'Maison traditionnelle philippine (bahay kubo) nichée dans la végétation tropicale';

export async function generateStaticParams() {
  const supabase = createBuildClient();
  if (!supabase) return [];
  const { data: categories } = await supabase
    .from('forum_categories')
    .select('slug');

  if (!categories) {
    return [];
  }

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// ✅ generateMetadata avec params en Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await getForumCategoryBySlug(supabase, slug);

  if (!category) {
    return {
      title: 'Catégorie de forum non trouvée',
    };
  }

  const canonicalUrl = `https://philippineasy.com/forum-sur-les-philippines/${slug}`;
  const description = category.description || `Discussions et sujets sur ${category.name} : posez vos questions, partagez vos expériences avec la communauté francophone des Philippines.`;

  return {
    title: `${category.name} - Forum Philippines`,
    description,
    keywords: ['forum Philippines', category.name, 'discussion Philippines', 'communauté', 'questions Philippines'],
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
      title: `${category.name} - Forum Philippines`,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${category.name} - Forum`,
      description,
      site: '@philippineasy',
    },
  };
}

// ✅ même chose pour la page
export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: category }, { data: initialTopics, error }] = await Promise.all([
    getForumCategoryBySlug(supabase, slug),
    getTopicsByCategorySlug(supabase, slug, 1),
  ]);

  // Hard error fetching the topic list (RPC failure) — a proper design-language state.
  if (error) {
    return (
      <div className="bg-background">
        <PageHero
          eyebrow="Forum communauté"
          title="Une erreur est"
          titleAccent="survenue"
          subtitle="Impossible de charger les discussions de cette catégorie pour l'instant."
          imageUrl={HERO_IMAGE}
          imageAlt={HERO_ALT}
        />
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ForumStatePanel
              icon={<AlertTriangle className="h-6 w-6" aria-hidden="true" />}
              title="Chargement impossible"
              description="Les sujets de cette catégorie n'ont pas pu être récupérés. Réessayez dans un moment."
              actions={[{ label: 'Retour au forum', href: '/forum-sur-les-philippines', variant: 'primary' }]}
            />
          </div>
        </section>
      </div>
    );
  }

  // The category slug doesn't exist at all.
  if (!category) {
    return (
      <div className="bg-background">
        <PageHero
          eyebrow="Forum communauté"
          title="Catégorie"
          titleAccent="introuvable"
          subtitle="Cette catégorie n'existe pas ou a été déplacée."
          imageUrl={HERO_IMAGE}
          imageAlt={HERO_ALT}
        />
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ForumStatePanel
              icon={<Compass className="h-6 w-6" aria-hidden="true" />}
              title="Cette catégorie n'existe pas"
              description="Le lien est peut-être erroné. Retrouvez toutes les catégories actives depuis l'accueil du forum."
              actions={[{ label: 'Voir toutes les catégories', href: '/forum-sur-les-philippines', variant: 'primary' }]}
            />
          </div>
        </section>
      </div>
    );
  }

  const topics = initialTopics || [];

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/forum-sur-les-philippines', label: 'Forums' },
    { label: category.name },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Forums', item: '/forum-sur-les-philippines' },
    { name: category.name, item: `/forum-sur-les-philippines/${slug}` },
  ];

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow="Forum communauté"
        title={category.name}
        subtitle={
          category.description ||
          `Discussions et entraide autour de « ${category.name} » avec la communauté francophone des Philippines.`
        }
        imageUrl={HERO_IMAGE}
        imageAlt={HERO_ALT}
      />

      <section className="bg-background pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          {topics.length > 0 ? (
            <TopicListClient slug={slug} initialTopics={topics} />
          ) : (
            <div className="py-8">
              <ForumStatePanel
                icon={<MessagesSquare className="h-6 w-6" aria-hidden="true" />}
                title="Aucun sujet pour l'instant"
                description="Cette catégorie n'a pas encore de discussion. Lancez la première et ouvrez le bal !"
                actions={[
                  {
                    label: 'Créer le premier sujet',
                    href: `/forum-sur-les-philippines/nouveau-sujet?category_slug=${slug}`,
                    variant: 'primary',
                  },
                  { label: 'Retour au forum', href: '/forum-sur-les-philippines', variant: 'secondary' },
                ]}
              />
            </div>
          )}
        </div>
      </section>

      <ForumCommunityLinks />

      <CTABand
        title="Vous avez vécu"
        titleAccent="cette expérience ?"
        subtitle="Ouvrez un sujet pour partager vos conseils, ou préparez votre voyage avec notre assistant d'itinéraire."
        primary={{ label: 'Ouvrir un sujet', href: `/forum-sur-les-philippines/nouveau-sujet?category_slug=${slug}` }}
        secondary={{ label: 'Créer mon itinéraire IA', href: '/itineraire-personnalise-pour-les-philippines' }}
      />
    </div>
  );
}
