'use client';

import { useState } from 'react';
import type { Article } from '@/types';
import ArticleCard from './ArticleCard';
import { EditableWrapper } from './EditableWrapper';

interface ArticleListProps {
  articles: Article[];
  basePath: 'vivre-aux-philippines' | 'voyager-aux-philippines' | 'meilleurs-plans-aux-philippines' | 'actualites-sur-les-philippines';
}

interface Category {
  id: number;
}

const ArticleList = ({ articles: initialArticles, basePath }: ArticleListProps) => {
  const [articles, setArticles] = useState(initialArticles);

  const handleArticleUpdate = (updatedArticle: Article | Category) => {
    setArticles(prevArticles =>
      prevArticles.map(art =>
        art.id === updatedArticle.id ? updatedArticle as Article : art
      )
    );
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">Aucun article n'a été trouvé pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <EditableWrapper key={article.id} item={article} type="article" onUpdate={handleArticleUpdate}>
          <ArticleCard article={article} basePath={basePath} priority={index < 3} />
        </EditableWrapper>
      ))}
    </div>
  );
};

export default ArticleList;
