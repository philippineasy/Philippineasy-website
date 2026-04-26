import Link from 'next/link';
import Image from 'next/image';
import ShareButtons from '@/components/shared/ShareButtons';
import EditArticleButton from '@/components/shared/EditArticleButton';
import type { Article } from '@/types';

type Props = {
  article: Article;
  mainCategoryPath: string;
  categorySlug: string;
  excerpt: string;
  canonicalUrl: string;
};

// Heuristic: highlight the segment after ':' in the title (most editorial titles
// use this format). Fallback to the last word.
function splitTitle(title: string): { lead: string; accent: string } {
  const colonMatch = title.match(/^(.+?)\s*:\s*(.+)$/);
  if (colonMatch) return { lead: colonMatch[1].trim(), accent: colonMatch[2].trim() };
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return { lead: '', accent: title };
  return {
    lead: words.slice(0, -1).join(' '),
    accent: words[words.length - 1],
  };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const MAIN_CATEGORY_LABELS: Record<string, string> = {
  'voyager-aux-philippines': 'Voyager',
  'vivre-aux-philippines': 'Vivre',
  'actualites-sur-les-philippines': 'Actualités',
};

export function ArticleHero({
  article,
  mainCategoryPath,
  categorySlug,
  excerpt,
  canonicalUrl,
}: Props) {
  const { lead, accent } = splitTitle(article.title);
  const authorName = article.author?.username || "Équipe Philippin'Easy";
  const authorRole = article.author?.username ? 'Rédacteur' : 'Équipe éditoriale';
  const initials = getInitials(authorName);

  const mainLabel = MAIN_CATEGORY_LABELS[mainCategoryPath] || mainCategoryPath;
  const categoryName = article.category?.name || categorySlug;

  const publishedDate = new Date(article.published_at).toLocaleDateString('fr-FR', {
    month: 'short',
    year: 'numeric',
  });
  const updatedDate = article.updated_at
    ? new Date(article.updated_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    : publishedDate;

  return (
    <header className="mb-10 lg:mb-14">
      {/* Page head — back link + breadcrumb path */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Accueil</span>
        </Link>
        <span className="text-muted-foreground/40" aria-hidden="true">·</span>
        <Link
          href={`/${mainCategoryPath}`}
          className="uppercase tracking-[0.08em] font-medium text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          {mainLabel}
        </Link>
        <span className="text-muted-foreground/40" aria-hidden="true">·</span>
        <Link
          href={`/${mainCategoryPath}/${categorySlug}`}
          className="uppercase tracking-[0.08em] font-medium text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          {categoryName}
        </Link>
      </div>

      {/* Article head — badge + H1 + deck + byline */}
      <div className="space-y-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full">
          {mainLabel} · {categoryName}
        </span>

        <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1] text-ink text-balance">
          {lead && <span>{lead} : </span>}
          <span className="text-accent italic">{accent}</span>
        </h1>

        {excerpt && (
          <p className="text-[18px] leading-[1.6] text-muted-foreground max-w-[68ch] text-pretty">
            {excerpt}
          </p>
        )}

        {/* Byline strip */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/60">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[14px] tracking-[0.02em] shrink-0"
              style={{ backgroundColor: '#3B5BDB' }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="flex flex-col text-[14px] leading-tight">
              <strong className="text-foreground font-semibold">{authorName}</strong>
              <span className="text-muted-foreground text-[13px] mt-0.5">
                {authorRole} · {article.reading_time} min de lecture · Mise à jour {updatedDate}
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ShareButtons url={canonicalUrl} title={article.title} />
            <EditArticleButton articleSlug={article.slug} />
          </div>
        </div>
      </div>

      {/* Cover image — 2.5:1 ratio, radius 24, shadow */}
      {article.image && (
        <figure className="mt-10 lg:mt-12">
          <div className="relative w-full aspect-[2.5/1] rounded-[24px] overflow-hidden shadow-card">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </figure>
      )}
    </header>
  );
}
