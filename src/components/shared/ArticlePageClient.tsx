'use client';

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faSpinner, faLink } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faXTwitter, faWhatsapp, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { recordArticleView } from '@/services/articleService';
import { supabase } from '@/utils/supabase/client';
import ArticleContentRenderer from '@/components/shared/ArticleContentRenderer';
import TableOfContents from '@/components/shared/TableOfContents';
import EditArticleButton from '@/components/shared/EditArticleButton';
import RelatedArticles from './RelatedArticles';
import { Article, EditorJSContent } from '@/types';

interface ArticlePageClientProps {
  article: Article;
  basePath: string;
}

const ArticlePageClient = ({ article, basePath }: ArticlePageClientProps) => {
  const { user } = useAuth();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const parsedContent = useMemo(() => {
    if (typeof article.content === 'string') {
      try {
        return JSON.parse(article.content) as EditorJSContent;
      } catch (error) {
        console.error("Failed to parse article content:", error);
        return null;
      }
    }
    return article.content;
  }, [article.content]);

  useEffect(() => {
    if (article && article.id) {
      recordArticleView(supabase, article.id, user?.id || null);
    }
  }, [article, user, supabase]);

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 pt-32">
      <div className="lg:flex lg:space-x-8">
        <aside className="w-full lg:w-1/4 hidden md:block mb-8 lg:mb-0">
          <div className="sticky top-28 p-4 bg-muted rounded-lg shadow-md border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3 border-b pb-2">Sommaire</h2>
            {parsedContent && <TableOfContents blocks={parsedContent.blocks || []} />}
          </div>
        </aside>

        <article className="w-full lg:flex-grow bg-card rounded-lg shadow-xl p-6 md:p-10">
          <nav className="text-sm mb-4 breadcrumb-container" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center">
              <li className="flex items-center">
                <Link href="/" className="text-muted-foreground hover:text-orange-500">Accueil</Link>
                <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 mx-3 text-primary" />
              </li>
              <li className="flex items-center">
                <Link href={`/${basePath}`} className="text-muted-foreground hover:text-orange-500">{article.category.main_category || basePath}</Link>
                <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 mx-3 text-primary" />
              </li>
              {article.category.main_category && article.category.slug !== article.category.main_category.toLowerCase() && (
                <li className="flex items-center">
                  <Link href={`/${basePath}/${article.category.slug}`} className="text-muted-foreground hover:text-orange-500">{article.category.name}</Link>
                  <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 mx-3 text-primary" />
                </li>
              )}
              <li className="flex items-center">
                <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[200px]">{article.title}</span>
              </li>
            </ol>
          </nav>

          <header className="mb-8 border-b pb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-primary">{article.title}</h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-accent font-medium pulse-animation">Partager sur :</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer" title="Partager sur Facebook" className="text-muted-foreground hover:text-primary">
                  <FontAwesomeIcon icon={faFacebookF} size="lg" />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" title="Partager sur Twitter" className="text-muted-foreground hover:text-foreground">
                  <FontAwesomeIcon icon={faXTwitter} size="lg" />
                </a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)} ${currentUrl}`} target="_blank" rel="noopener noreferrer" title="Partager sur WhatsApp" className="text-muted-foreground hover:text-green-500">
                  <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" title="Partager sur LinkedIn" className="text-muted-foreground hover:text-primary/90">
                  <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
                </a>
                <button onClick={() => navigator.clipboard.writeText(currentUrl)} title="Copier le lien" className="text-muted-foreground hover:text-primary">
                  <FontAwesomeIcon icon={faLink} size="lg" />
                </button>
                <EditArticleButton articleSlug={article.slug} />
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-6">
              <span>Publié le : {new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="mx-2">|</span>
              <span>Temps de lecture estimé : {article.reading_time} min</span>
            </div>

            {article.image && (
              <div className="relative w-full h-96">
                <Image src={article.image} alt={article.title} fill priority className="object-cover rounded-lg shadow-md" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none article-content">
            <ArticleContentRenderer content={parsedContent || { blocks: [], time: 0, version: '' }} />
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Mots-clés :</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => <span key={tag} className="bg-muted/80 text-foreground px-3 py-1 rounded-full text-xs font-medium">{tag}</span>)}
              </div>
            </div>
          )}

          <RelatedArticles categoryId={article.category.id} currentArticleId={article.id} />
        </article>
      </div>
    </main>
  );
};

export default ArticlePageClient;
