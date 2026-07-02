import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';
import { getMainCategoryPath } from '@/lib/utils';

type Props = {
  relatedArticles: Article[];
};

function articleHref(article: Article): string {
  const main = getMainCategoryPath(article.category?.main_category || '');
  const cat = article.category?.slug || '';
  return `/${main}/${cat}/${article.slug}`;
}

function plainTitle(title: string): string {
  return title.replace(/\*\*([^*]+)\*\*/g, '$1');
}

export function ArticleAside({ relatedArticles }: Props) {
  return (
    <aside className="lg:sticky lg:top-32 lg:self-start space-y-6">
      {/* À lire aussi */}
      {relatedArticles.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card-rest">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-4">
            À lire aussi
          </span>
          <ul className="space-y-4">
            {relatedArticles.slice(0, 3).map((article) => {
              const cleanTitle = plainTitle(article.title);
              return (
                <li key={article.id}>
                  <Link
                    href={articleHref(article)}
                    className="group flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                  >
                    {article.image && (
                      <div className="relative w-[72px] h-[72px] shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={article.image}
                          alt={cleanTitle}
                          fill
                          sizes="72px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className="block text-[14px] font-semibold leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {cleanTitle}
                      </span>
                      {article.reading_time != null && (
                        <span className="block text-[12px] text-muted-foreground mt-1">
                          {article.reading_time} min de lecture
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Newsletter */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 p-6 shadow-card-rest">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-accent mb-3">
          ✦ Newsletter
        </span>
        <h4 className="text-[18px] font-bold leading-tight text-ink mb-2 tracking-[-0.01em]">
          Recevez nos meilleurs guides
        </h4>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          Un email, une fois par mois, avec les itinéraires testés par notre équipe.
        </p>
        <form
          action="/api/newsletter"
          method="POST"
          className="flex flex-col gap-2"
        >
          <label className="sr-only" htmlFor="aside-newsletter-email">Adresse email</label>
          <input
            id="aside-newsletter-email"
            type="email"
            name="email"
            required
            placeholder="votre@email.com"
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-accent text-accent-foreground font-semibold text-[14px] px-3 py-2.5 shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </aside>
  );
}
