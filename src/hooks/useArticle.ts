'use client';

import { useState, useEffect, useMemo } from 'react';
import { getArticleBySlugAction } from '@/app/actions/articleActions';
import type { Article } from '@/types';

export const useArticle = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const parsedContent = useMemo(() => {
    if (!article?.content) return null;

    if (typeof article.content === 'object' && article.content !== null && Array.isArray(article.content.blocks)) {
      return article.content;
    }

    if (typeof article.content === 'string') {
      try {
        if (article.content.trim().startsWith('{')) {
          const parsed = JSON.parse(article.content);
          if (parsed && Array.isArray(parsed.blocks)) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Impossible de parser le contenu de l'article, traitement en texte brut:", e);
      }
      
      return {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: article.content,
            },
          },
        ],
      };
    }

    return null;
  }, [article]);

  useEffect(() => {
    if (slug) {
      const fetchArticle = async () => {
        setLoading(true);
        const result = await getArticleBySlugAction(slug);
        if (result.success) {
          setArticle(result.data as Article);
        } else {
          console.error("Failed to fetch article:", result.error);
          setArticle(null);
        }
        setLoading(false);
      };
      fetchArticle();
    }
  }, [slug]);

  return { article, loading, parsedContent };
};
