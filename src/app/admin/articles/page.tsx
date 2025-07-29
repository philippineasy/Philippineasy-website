'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
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
  const supabase = createClient();
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Gérer les Articles</h1>
        <div className="flex items-center space-x-4">
          <CustomSelect
            options={[{ value: 'all', label: 'Toutes les catégories' }, ...categories.map(cat => ({ value: cat.id, label: cat.name }))]}
            value={filter}
            onChange={(value) => setFilter(value)}
          />
          <Link href="/admin/articles/nouveau" className="px-5 py-2 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />Nouvel Article
          </Link>
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
                  <div key={article.id} className="bg-card rounded-lg shadow-md overflow-hidden">
                    <div className="relative w-full h-48">
                      <Image src={imageUrl} alt={article.title || 'Image non disponible'} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">
                        <Link href={generateArticleUrl(article)} className="text-primary hover:underline">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground">par {article.author?.username || 'Auteur inconnu'}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${article.status === 'published' ? 'bg-green-500' : 'bg-accent'} text-white`}>
                          {article.status}
                        </span>
                        <div>
                          <Link href={`/admin/articles/edit/${article.slug}`} className="text-primary hover:underline mr-4"><FontAwesomeIcon icon={faEdit} /></Link>
                          <button onClick={() => handleDeleteRequest(article)} className="text-destructive hover:underline"><FontAwesomeIcon icon={faTrash} /></button>
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
