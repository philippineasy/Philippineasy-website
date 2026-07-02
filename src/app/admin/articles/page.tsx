'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { getAllArticlesForAdmin, deleteArticle } from '@/services/articleService';
import { getAllCategories } from '@/services/categoryService';
import { generateArticleUrl } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

interface Article {
  id: number;
  title: string;
  slug: string;
  image: string;
  status: string;
  author: {
    username: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
    main_category: string;
  };
}

interface Category {
  id: number;
  name: string;
}

const AdminArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | number>('all');
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const fetchArticlesAndCategories = useCallback(async () => {
    setLoading(true);
    
    const categoriesResult = await getAllCategories(supabase);
    if (categoriesResult.error) {
      toast.error('Erreur lors de la récupération des catégories.');
      console.error('Error fetching categories:', categoriesResult.error);
    } else {
      setCategories(categoriesResult.data || []);
    }

    const categoryId = filter === 'all' ? undefined : parseInt(String(filter));
    const articlesResult = await getAllArticlesForAdmin(supabase, categoryId);

    if (articlesResult.error) {
      toast.error('Erreur lors de la récupération des articles.');
      console.error('Error fetching articles:', articlesResult.error);
    } else {
      setArticles(articlesResult.data || []);
    }
    
    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    fetchArticlesAndCategories();
  }, [fetchArticlesAndCategories]);

  const handleDeleteRequest = (article: Article) => {
    setArticleToDelete(article);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;

    const { error } = await deleteArticle(supabase, articleToDelete.id);
    if (error) {
      toast.error("Erreur lors de la suppression.");
    } else {
      toast.success("Article supprimé.");
      fetchArticlesAndCategories();
    }
    setArticleToDelete(null);
  };

  const articlesByCategory = articles
    .filter(article => article.category && article.title) // Filter out articles with no category or title
    .reduce((acc, article) => {
      const categoryName = article.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(article);
      return acc;
    }, {} as { [key: string]: Article[] });

  return (
    <>
      <div className="mb-8">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-2">
          Contenu éditorial
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.02em] leading-[1.15] text-ink">
              Gestion des <span className="text-accent">articles</span>
            </h1>
            <p className="mt-2 text-[14px] text-muted-foreground">
              {articles.length} article{articles.length > 1 ? 's' : ''} · création, édition, suppression.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <CustomSelect
              options={[{ value: 'all', label: 'Toutes les catégories' }, ...categories.map(cat => ({ value: cat.id, label: cat.name }))]}
              value={filter}
              onChange={(value) => setFilter(value)}
            />
            <Link
              href="/admin/articles/nouveau"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-2 text-[13px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[11px]" />
              Nouvel article
            </Link>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center p-8">
          <FontAwesomeIcon icon={faSpinner} className="fa-spin text-3xl" />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(articlesByCategory).map(([categoryName, articles]) => (
            <div key={categoryName}>
              <h2 className="text-2xl font-bold mb-4">{categoryName} ({articles.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => {
                  // Safety check for each article before rendering
                  if (!article.category || !article.slug) return null;

                  const imageUrl = article.image && (article.image.startsWith('http://') || article.image.startsWith('https://'))
                    ? article.image
                    : 'https://via.placeholder.com/300x200';

                  return (
                  <div key={article.id} className="bg-card rounded-2xl border border-border/60 shadow-card-rest overflow-hidden hover:border-primary/40 hover:shadow-card transition-all">
                    <div className="relative w-full h-44">
                      <Image src={imageUrl} alt={article.title || 'Image non disponible'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-[15px] font-semibold leading-snug mb-1">
                        <Link href={generateArticleUrl(article)} className="text-ink hover:text-accent transition-colors line-clamp-2">
                          {(article.title || '').replace(/\*\*([^*]+)\*\*/g, '$1')}
                        </Link>
                      </h3>
                      <p className="text-[12px] text-muted-foreground">par {article.author?.username || 'Auteur inconnu'}</p>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/40">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold uppercase tracking-[0.05em] ${
                          article.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                            : article.status === 'scheduled'
                            ? 'bg-sky-500/10 text-sky-700 border-sky-500/20'
                            : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                          {article.status}
                        </span>
                        <div className="flex gap-1">
                          <Link href={`/admin/articles/edit/${article.slug}`} className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-primary hover:bg-primary/10 transition-colors" aria-label="Éditer"><FontAwesomeIcon icon={faEdit} className="text-[13px]" /></Link>
                          <button onClick={() => handleDeleteRequest(article)} className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-rose-600 hover:bg-rose-500/10 transition-colors" aria-label="Supprimer"><FontAwesomeIcon icon={faTrash} className="text-[13px]" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          ))}
        </div>
      )}

      {articleToDelete && (
        <ConfirmationModal
          isOpen={!!articleToDelete}
          onClose={() => setArticleToDelete(null)}
          onConfirm={confirmDelete}
          title="Confirmer la suppression"
        >
          <p>Êtes-vous sûr de vouloir supprimer l'article "{articleToDelete.title}" ?</p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default AdminArticlesPage;
