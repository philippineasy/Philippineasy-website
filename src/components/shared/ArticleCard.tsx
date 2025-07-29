import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';

interface ArticleCardProps {
  article: Article;
  basePath: 'vivre-aux-philippines' | 'voyager-aux-philippines' | 'meilleurs-plans-aux-philippines' | 'actualites-sur-les-philippines';
  priority?: boolean;
}

const stripHtml = (html: string) => {
  if (typeof window === 'undefined') {
    // Simple regex for server-side stripping
    return html.replace(/<[^>]*>?/gm, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const ArticleCard = ({ article, basePath, priority = false }: ArticleCardProps) => {
  const href = `/${basePath}/${article.category.slug}/${article.slug}`;

  const getSnippet = () => {
    let textContent = '';
    if (typeof article.content === 'string') {
      textContent = article.content;
    } else if (typeof article.content === 'object' && article.content.blocks) {
      const firstParagraph = article.content.blocks.find(block => block.type === 'paragraph');
      if (firstParagraph && firstParagraph.data.text) {
        textContent = firstParagraph.data.text;
      }
    }
    
    if (textContent) {
      return `${stripHtml(textContent).substring(0, 100)}...`;
    }

    return 'Cliquez pour lire la suite...';
  };

  const formattedDate = new Date(article.published_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="destination-card bg-card rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <Link href={href} className="relative w-full h-48">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover card-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
        <p className="text-muted-foreground mb-4 text-sm flex-grow">{getSnippet()}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-1.5" />
            {formattedDate}
          </span>
          {article.reading_time && (
            <span className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-1.5" />
              {article.reading_time} min de lecture
            </span>
          )}
        </div>
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
          <Button variant="link" asChild className="p-0 h-auto font-semibold">
            <Link href={href}>
              Lire la suite <FontAwesomeIcon icon={faArrowRight} className="text-xs ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
