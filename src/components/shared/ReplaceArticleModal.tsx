'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/layout/Modal';
import { Button } from '@/components/ui/Button';
import type { Article, Category } from '@/types';
import { getCategories } from '@/app/actions/categoryActions';
import { getArticlesByCategory } from '@/app/actions/articleActions';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faHome, faStar, faNewspaper } from '@fortawesome/free-solid-svg-icons';

interface ReplaceArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: (newArticle: Article) => void;
  currentArticleId: number;
}

export const ReplaceArticleModal = ({ isOpen, onClose, onReplace, currentArticleId }: ReplaceArticleModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await getCategories();
      setCategories(data as Category[]);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchArticles = async () => {
        setIsLoading(true);
        const { articles: fetchedArticles } = await getArticlesByCategory(selectedCategory.id);
        setArticles(fetchedArticles.filter((a: Article) => a.id !== currentArticleId));
        setIsLoading(false);
      };
      fetchArticles();
    }
  }, [selectedCategory, currentArticleId]);

  const handleSelectArticle = (article: Article) => {
    onReplace(article);
    onClose();
  };

const categoryAppearance = {
  'voyager-aux-philippines': { icon: faPlane, color: 'bg-blue-500' },
  'vivre-aux-philippines': { icon: faHome, color: 'bg-green-500' },
  'meilleurs-plans': { icon: faStar, color: 'bg-yellow-500' },
  actualites: { icon: faNewspaper, color: 'bg-red-500' },
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Remplacer l'article">
      <div className="space-y-4">
        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-4">
            {categories.map(category => {
              const appearance = categoryAppearance[category.main_category as keyof typeof categoryAppearance] || { icon: faStar, color: 'bg-gray-500' };
              return (
                <Button key={category.id} variant="outline" onClick={() => setSelectedCategory(category)} className={`flex items-center justify-center space-x-2 !bg-opacity-20 ${appearance.color}`}>
                  <FontAwesomeIcon icon={appearance.icon} />
                  <span>{category.name}</span>
                </Button>
              )
            })}
          </div>
        ) : (
          <div>
            <Button variant="link" onClick={() => setSelectedCategory(null)}>
              &larr; Retour aux catégories
            </Button>
            <div className="max-h-60 overflow-y-auto space-y-2 mt-4">
              {isLoading ? (
                <p>Chargement des articles...</p>
              ) : (
                articles.map(article => (
                  <div
                    key={article.id}
                    className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectArticle(article)}
                  >
                    <div className="relative w-16 h-12 rounded-md overflow-hidden">
                      <Image src={article.image || ''} alt={article.title} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{article.title}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
