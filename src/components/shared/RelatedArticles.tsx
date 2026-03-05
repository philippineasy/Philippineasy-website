import type { Article } from '@/types';
import ArticleCard from './ArticleCard';

interface RelatedArticlesProps {
  articles: Article[];
}

const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 py-12 bg-muted -mx-6 md:-mx-10 px-6 md:px-10">
      <h2 className="text-2xl font-bold mb-8 text-center">A lire aussi dans la meme categorie</h2>
      <div className="flex overflow-x-auto space-x-8 pb-4 snap-x snap-mandatory">
        {articles.map(article => {
          if (!article.category?.main_category) return null;
          return (
            <div key={article.id} className="snap-center flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
              <ArticleCard article={article} basePath={article.category.main_category.toLowerCase() as any} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedArticles;
