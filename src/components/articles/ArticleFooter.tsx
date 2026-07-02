import ShareButtons from '@/components/shared/ShareButtons';
import ArticleCard from '@/components/shared/ArticleCard';
import { IATriggerButton } from '@/components/iaoverlay/IATriggerButton';
import { getMainCategoryPath } from '@/lib/utils';
import type { Article } from '@/types';

type Props = {
  article: Article;
  relatedArticles: Article[];
  canonicalUrl: string;
};

function plainTitle(title: string): string {
  return title.replace(/\*\*([^*]+)\*\*/g, '$1');
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const ALLOWED_BASE_PATHS = [
  'voyager-aux-philippines',
  'vivre-aux-philippines',
  'meilleurs-plans-aux-philippines',
  'actualites-sur-les-philippines',
] as const;
type AllowedBasePath = typeof ALLOWED_BASE_PATHS[number];

function basePathOrFallback(value: string): AllowedBasePath {
  return (ALLOWED_BASE_PATHS as readonly string[]).includes(value)
    ? (value as AllowedBasePath)
    : 'voyager-aux-philippines';
}

export function ArticleFooter({ article, relatedArticles, canonicalUrl }: Props) {
  const authorName = article.author?.username || "Équipe Philippin'Easy";
  const initials = getInitials(authorName);
  const tags = (article.tags || []).filter(Boolean);

  return (
    <footer className="mt-16 lg:mt-20">
      {/* CTA IA block — proto pe-article-cta-block */}
      <div
        className="relative overflow-hidden rounded-3xl text-white px-8 py-10 lg:px-12 lg:py-14 mb-14 shadow-hero"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3B5BDB 100%)' }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-dashed border-white/[0.12]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full border-2 border-dashed border-white/[0.12]"
        />
        <div className="relative max-w-[55ch]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-3">
            ✦ Création IA gratuite
          </span>
          <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] leading-tight mb-3">
            Prêt pour votre voyage aux Philippines ?
          </h3>
          <p className="text-[16px] leading-[1.6] text-white/85 mb-6">
            Notre IA construit votre itinéraire sur-mesure en 30 secondes — hébergements pré-sélectionnés, ferries, vols intérieurs et carte interactive.
          </p>
          <IATriggerButton
            source="article_footer"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-3 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
            </svg>
            Créer mon itinéraire IA
          </IATriggerButton>
        </div>
      </div>

      {/* Tags + Share row */}
      <div className="flex flex-wrap items-center gap-y-4 gap-x-6 py-6 border-y border-border/60">
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-semibold mr-1">
              Mots-clés
            </span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[12px] rounded-full border border-accent/30 text-accent bg-accent/5 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="ml-auto">
          <ShareButtons url={canonicalUrl} title={plainTitle(article.title)} />
        </div>
      </div>

      {/* Author bio */}
      <div className="mt-12 rounded-2xl border border-border/60 bg-muted/30 px-6 py-6 lg:px-8 lg:py-7 flex items-start gap-5">
        <div
          className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-[18px] tracking-[0.02em]"
          style={{ backgroundColor: '#3B5BDB' }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <strong className="block text-[16px] font-semibold text-ink">{authorName}</strong>
          <span className="block text-[13px] text-muted-foreground mb-2">
            Équipe éditoriale Philippin'Easy
          </span>
          <p className="text-[14px] leading-[1.6] text-foreground/85 max-w-[60ch]">
            Basée entre Cebu, Palawan et Siargao depuis 2020, l'équipe partage les itinéraires testés sur le terrain et accompagne plus de 2 500 voyageurs francophones par an. Tous nos guides sont écrits depuis le pays.
          </p>
        </div>
      </div>

      {/* Related articles — grid 3-up */}
      {relatedArticles.length > 0 && (
        <div className="mt-16">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
            Continuer la lecture
          </span>
          <h2 className="text-[clamp(1.5rem,2.8vw,1.875rem)] font-bold tracking-[-0.02em] mb-8 text-ink">
            Dans la même catégorie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((related) => {
              const path = basePathOrFallback(getMainCategoryPath(related.category?.main_category || ''));
              return <ArticleCard key={related.id} article={related} basePath={path} />;
            })}
          </div>
        </div>
      )}
    </footer>
  );
}
