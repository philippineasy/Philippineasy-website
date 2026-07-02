import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  basePath: 'vivre-aux-philippines' | 'voyager-aux-philippines' | 'meilleurs-plans-aux-philippines' | 'actualites-sur-les-philippines';
  priority?: boolean;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();

const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

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
      const clean = stripHtml(textContent);
      return clean.length > 120 ? `${clean.substring(0, 120)}…` : clean;
    }

    return 'Cliquez pour lire la suite…';
  };

  const formattedDate = new Date(article.published_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={href}
      className="group bg-card rounded-2xl overflow-hidden flex flex-col h-full border-[0.5px] border-border shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative w-full h-[180px] overflow-hidden">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
            quality={70}
            priority={priority}
          />
        ) : (
          <div className="w-full h-full bg-soft-blue" />
        )}
      </div>
      <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
        {article.category?.name && (
          <span
            className="inline-flex items-center self-start mb-2.5 px-2 py-0.5 rounded text-primary bg-primary/10"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {article.category.name}
          </span>
        )}
        <h3
          className="text-foreground mb-2"
          style={{
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.35,
          }}
        >
          {article.title}
        </h3>
        <p
          className="mb-4 flex-1 line-clamp-3 text-muted-foreground"
          style={{
            fontSize: '13px',
            lineHeight: 1.55,
          }}
        >
          {getSnippet()}
        </p>
        <div className="flex items-center gap-4 pt-3 mb-3 border-t-[0.5px] border-border">
          <span
            className="inline-flex items-center gap-1.5 text-muted-foreground/80"
            style={{ fontSize: '11px' }}
          >
            <CalendarIcon />
            {formattedDate}
          </span>
          {article.reading_time && (
            <span
              className="inline-flex items-center gap-1.5 text-muted-foreground/80"
              style={{ fontSize: '11px' }}
            >
              <ClockIcon />
              {article.reading_time} min
            </span>
          )}
        </div>
        <span
          className="inline-flex items-center gap-1 text-primary text-sm font-medium"
          aria-hidden="true"
        >
          Lire l&apos;article
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
};

export default ArticleCard;
