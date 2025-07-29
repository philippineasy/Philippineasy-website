import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getTopicsByCategorySlug, getForumCategoryBySlug } from '@/services/forumService';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TopicListClient } from '@/app/forum-sur-les-philippines/[slug]/TopicListClient';
import type { Metadata } from 'next';

// ✅ generateMetadata avec params en Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient();
  const { data: category } = await getForumCategoryBySlug(supabase, slug);

  if (!category) {
    return {
      title: 'Catégorie de forum non trouvée',
    };
  }

  return {
    title: `${category.name} | Forum Philippin'Easy`,
    description: `Discussions et sujets dans la catégorie ${category.name}.`,
  };
}

// ✅ même chose pour la page
export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
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
          <Link href="/forum-sur-les-philippines" className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Retour aux forums
          </Link>
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

  return (
    <main className="container mx-auto px-4 py-16 pt-32">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{category.name}</h1>
          <p className="text-muted-foreground mt-1">{category.description}</p>
        </div>
      </div>
      
      <TopicListClient slug={slug} initialTopics={initialTopics || []} />
    </main>
  );
}