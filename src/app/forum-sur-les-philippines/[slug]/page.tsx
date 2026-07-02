import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { createBuildClient } from '@/utils/supabase/build-client';
import { getTopicsByCategorySlug, getForumCategoryBySlug } from '@/services/forumService';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TopicListClient } from '@/app/forum-sur-les-philippines/[slug]/TopicListClient';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import type { Metadata } from 'next';

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
  const { data: initialTopics, error } = await getTopicsByCategorySlug(supabase, slug, 1);

  if (error) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive">Erreur</h1>
          <p className="mt-4 text-muted-foreground">Impossible de charger les sujets pour cette catégorie.</p>
          <Link href="/forum-sur-les-philippines" className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Retour aux forums
          </Link>
        </div>
      </main>
    );
  }

  if (!initialTopics || initialTopics.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Catégorie non trouvée ou vide</h1>
          <p className="mt-4 text-muted-foreground">La catégorie que vous cherchez n'existe pas ou ne contient aucun sujet.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/forum-sur-les-philippines" className="inline-block px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80">
              Retour aux forums
            </Link>
            <Link href={`/forum-sur-les-philippines/nouveau-sujet?category_slug=${slug}`} className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              Créer un nouveau sujet
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const category = {
    name: initialTopics[0].category_name,
    description: initialTopics[0].category_description,
  };

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
    <main className="container mx-auto px-4 py-16 pt-32">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <span className="mb-2 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Forum
        </span>
        <h1
          className="font-bold text-foreground"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.15, letterSpacing: '-0.02em' }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">{category.description}</p>
        )}
      </div>

      <TopicListClient slug={slug} initialTopics={initialTopics || []} />
    </main>
  );
}
