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
import { faChevronRight, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

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
      <main className="container mx-auto px-4 py-16 pt-32 text-center">
        <FontAwesomeIcon icon={faSpinner} className="fa-spin text-4xl text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Chargement...</p>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-16 pt-32">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive">Catégorie non trouvée</h1>
          <p className="mt-4 text-muted-foreground">La catégorie que vous cherchez n&apos;existe pas ou a été déplacée.</p>
          <Link href="/forum-sur-les-philippines" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90">
            Retour aux forums
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16 pt-32">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex list-none items-center p-0">
          <li className="flex items-center">
            <Link href="/" className="text-muted-foreground hover:text-primary">Accueil</Link>
            <FontAwesomeIcon icon={faChevronRight} className="mx-3 h-2.5 w-2.5 text-primary" />
          </li>
          <li className="flex items-center">
            <Link href="/forum-sur-les-philippines" className="text-muted-foreground hover:text-primary">Forum</Link>
            <FontAwesomeIcon icon={faChevronRight} className="mx-3 h-2.5 w-2.5 text-primary" />
          </li>
          <li className="flex items-center">
            <Link href={`/forum-sur-les-philippines/${category.slug}`} className="text-muted-foreground hover:text-primary">{category.name}</Link>
            <FontAwesomeIcon icon={faChevronRight} className="mx-3 h-2.5 w-2.5 text-primary" />
          </li>
          <li className="flex items-center">
            <span className="font-medium text-foreground">Nouveau sujet</span>
          </li>
        </ol>
      </nav>

      <span className="mb-2 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        Forum
      </span>
      <h1
        className="font-bold text-foreground"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.15, letterSpacing: '-0.02em' }}
      >
        Créer un nouveau sujet
      </h1>
      <p className="mt-2 mb-8 text-muted-foreground">
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
    </main>
  );
};

export default NewTopicPage;
