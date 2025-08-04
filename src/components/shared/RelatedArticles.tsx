'use client';

import { useEffect, useState } from 'react';
import type { Article } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { getRelatedArticles } from '@/services/articleService';
import ArticleCard from './ArticleCard';

interface RelatedArticlesProps {
  categoryId: number;
  currentArticleId: number;
}

const RelatedArticles = ({ categoryId, currentArticleId }: RelatedArticlesProps) => {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      const { data } = await getRelatedArticles(supabase, categoryId, currentArticleId);
      if (data) {
        setRelatedArticles(data);
      }
    };

    fetchRelated();
  }, [supabase, categoryId, currentArticleId]);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 py-12 bg-muted -mx-6 md:-mx-10 px-6 md:px-10">
      <h2 className="text-2xl font-bold mb-8 text-center">À lire aussi dans la même catégorie</h2>
      <div className="flex overflow-x-auto space-x-8 pb-4 snap-x snap-mandatory">
        {relatedArticles.map(article => {
          if (!article.category?.main_category) return null;
          return (
            <div key={article.id} className="snap-center flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
              <ArticleCard article={article} basePath={article.category.main_category.toLowerCase() as any} />
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default RelatedArticles;
