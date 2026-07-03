'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { addTopicAndRevalidate } from '@/app/actions/forumActions';
import { getCategoryBySlug } from '@/services/categoryService';
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';
import { PageHero } from '@/components/sections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import { ForumHeroCompact } from '@/components/forum/ForumHeroCompact';
import { ForumStatePanel } from '@/components/forum/ForumStatePanel';
import { Compass } from 'lucide-react';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const HERO_IMAGE = '/imagesHero/hutte-philippines.webp';
const HERO_ALT = 'Maison traditionnelle philippine (bahay kubo) nichée dans la végétation tropicale';

interface Category {
  id: number;
  name: string;
  slug: string;
}

const NewTopicPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<OutputData>({ blocks: [] });
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (title.length < 10) {
      toast.error("Le titre doit contenir au moins 10 caractères.");
      setIsSubmitting(false);
      return;
    }

    if (!user || !category) {
      toast.error("Utilisateur ou catégorie non valide.");
      setIsSubmitting(false);
      return;
    }

    const result = await addTopicAndRevalidate(category.id, user.id, title, JSON.stringify(content));

    if (result.success && result.data?.topicSlug) {
      toast.success("Sujet créé avec succès !");
      router.push(`/forum-sur-les-philippines/sujet/${result.data.topicSlug}`);
    } else {
      const errorMessage = result.error?.message || "Une erreur est survenue lors de la création du sujet.";
      toast.error(`Erreur: ${errorMessage}`);
      console.error(result.error);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchUserAndCategory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/connexion');
        return;
      }
      setUser(session.user);

      const categorySlug = searchParams.get('category_slug');
      if (categorySlug) {
        const { data: categoryData, error } = await getCategoryBySlug(supabase, categorySlug);
        if (error) {
          toast.error("Impossible de trouver cette catégorie.");
          console.error('Error fetching category:', error);
        } else {
          setCategory(categoryData);
        }
      }
      setLoading(false);
    };
    fetchUserAndCategory();
  }, [searchParams, router, supabase]);

  if (loading) {
    return (
      <div className="bg-background">
        <section className="py-24 md:py-32">
          <div className="container mx-auto flex flex-col items-center px-4 text-center">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin text-3xl text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm text-muted-foreground">Chargement de la catégorie…</p>
          </div>
        </section>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-background">
        <ForumHeroCompact
          eyebrow="Forum communauté"
          title="Catégorie introuvable"
          imageUrl={HERO_IMAGE}
          imageAlt={HERO_ALT}
        />
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ForumStatePanel
              icon={<Compass className="h-6 w-6" aria-hidden="true" />}
              title="Cette catégorie n'existe pas"
              description="Impossible d'ouvrir un sujet ici : le lien de catégorie est erroné ou la catégorie a été déplacée."
              actions={[{ label: 'Retour au forum', href: '/forum-sur-les-philippines', variant: 'primary' }]}
            />
          </div>
        </section>
      </div>
    );
  }

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/forum-sur-les-philippines', label: 'Forum' },
    { href: `/forum-sur-les-philippines/${category.slug}`, label: category.name },
    { label: 'Nouveau sujet' },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Forum', item: '/forum-sur-les-philippines' },
    { name: category.name, item: `/forum-sur-les-philippines/${category.slug}` },
    { name: 'Nouveau sujet', item: `/forum-sur-les-philippines/nouveau-sujet?category_slug=${category.slug}` },
  ];

  return (
    <div className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <PageHero
        eyebrow={`Forum · ${category.name}`}
        title="Ouvrir un"
        titleAccent="nouveau sujet"
        subtitle={`Partagez votre question ou votre expérience dans « ${category.name} » avec la communauté francophone des Philippines.`}
        imageUrl={HERO_IMAGE}
        imageAlt={HERO_ALT}
      />

      <section className="bg-background pt-10 md:pt-12 pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mx-auto max-w-3xl">
            <p className="mb-8 text-muted-foreground">
              Dans la catégorie <strong className="text-primary">{category.name}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest md:p-8">
              <div>
                <label htmlFor="topic-title-input" className="mb-1 block text-sm font-medium text-foreground">Titre du sujet</label>
                <input
                  type="text"
                  id="topic-title-input"
                  name="title"
                  required
                  maxLength={150}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Un titre clair et concis (max 150 caractères)"
                />
              </div>

              <div>
                <label htmlFor="editorjs" className="mb-1 block text-sm font-medium text-foreground">Votre premier message</label>
                <div className="mt-2 min-h-[200px] rounded-lg border border-border p-4">
                  <Editor holder="editorjs" onChange={setContent} />
                </div>
              </div>

              <div className="flex flex-col items-center justify-end gap-4 border-t-[0.5px] border-border pt-4 sm:flex-row">
                <Link href={`/forum-sur-les-philippines/${category.slug}`} className="text-sm text-muted-foreground hover:underline">Annuler</Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-accent/90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none sm:w-auto"
                >
                  <FontAwesomeIcon icon={isSubmitting ? faSpinner : faCheck} className={isSubmitting ? 'fa-spin' : ''} />
                  {isSubmitting ? 'Création...' : 'Créer le sujet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewTopicPage;
