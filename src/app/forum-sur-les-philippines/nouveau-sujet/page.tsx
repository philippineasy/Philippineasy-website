'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { addTopicAndRevalidate } from '@/app/actions/forumActions';
import { getCategoryBySlug } from '@/services/categoryService';
import { createClient } from '@/utils/supabase/client';
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
  const supabase = createClient();
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
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-primary text-4xl"></i>
          <p className="mt-4 text-lg text-muted-foreground">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive">Catégorie non trouvée</h1>
          <p className="mt-4 text-muted-foreground">La catégorie que vous cherchez n'existe pas ou a été déplacée.</p>
          <Link href="/forum-sur-les-philippines" className="mt-6 inline-block px-6 py-3 bg-primary text-card-foreground rounded-lg hover:bg-primary/90">
            Retour aux forums
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="text-muted-foreground hover:text-primary">Accueil</Link>
            <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 mx-3 text-muted-foreground" />
          </li>
          <li className="flex items-center">
            <Link href="/forum-sur-les-philippines" className="text-muted-foreground hover:text-primary">Forums</Link>
            <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 mx-3 text-muted-foreground" />
          </li>
          <li className="flex items-center">
            <Link href={`/forum-sur-les-philippines/${category.slug}`} className="text-muted-foreground hover:text-primary">{category.name}</Link>
            <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 mx-3 text-muted-foreground" />
          </li>
          <li className="flex items-center">
            <span className="text-foreground font-medium">Nouveau Sujet</span>
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-2">Créer un Nouveau Sujet</h1>
      <p className="text-muted-foreground mb-8">Dans la catégorie : <strong className="text-primary">{category.name}</strong></p>

      <form onSubmit={handleSubmit} className="bg-card p-6 md:p-8 rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="topic-title-input" className="block text-sm font-medium text-foreground mb-1">Titre du Sujet</label>
          <input
            type="text"
            id="topic-title-input"
            name="title"
            required
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            placeholder="Un titre clair et concis (max 150 caractères)"
          />
        </div>

        <div>
          <label htmlFor="editorjs" className="block text-sm font-medium text-foreground mb-1">Votre premier message</label>
          <div className="mt-2 border border-border rounded-md p-4 min-h-[200px]">
            <Editor holder="editorjs" onChange={setContent} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t">
          <Link href={`/forum-sur-les-philippines/${category.slug}`} className="text-muted-foreground hover:underline text-sm">Annuler</Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold flex items-center justify-center disabled:bg-gray-400"
          >
            <FontAwesomeIcon icon={isSubmitting ? faSpinner : faCheck} className={`mr-2 ${isSubmitting ? 'fa-spin' : ''}`} /> 
            {isSubmitting ? 'Création...' : 'Créer le Sujet'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default NewTopicPage;
