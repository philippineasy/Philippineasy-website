'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { CardGrid } from '@/components/sections';
import { GradientAvatar } from '@/components/forum/GradientAvatar';

export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  topic_count: number;
  last_topic_title: string;
  last_post_timestamp: string;
  last_post_author_username: string;
  last_post_author_avatar_url: string;
  last_topic_slug: string;
}

interface ForumListClientProps {
  initialCategories: ForumCategory[];
}

// Deterministic tonal cycle for category chips — dark-ready semantic tokens only
// (no fixed hex), mirrors the primary / accent / success palette used site-wide.
const CATEGORY_TONES = [
  'bg-primary/10 text-primary',
  'bg-accent/10 text-accent-strong',
  'bg-[hsl(var(--success)/0.14)] text-[hsl(var(--success))]',
] as const;

const getCategoryTone = (index: number) => CATEGORY_TONES[index % CATEGORY_TONES.length];

const formatRelativeTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `Il y a quelques sec`;
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} h`;
  if (days === 1) return `Hier`;
  if (days < 7) return `Il y a ${days} j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const ForumListClient = ({ initialCategories }: ForumListClientProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');

  const filteredCategories = useMemo(() => {
    if (activeCategoryId === 'all') return initialCategories;
    return initialCategories.filter((category) => category.id === activeCategoryId);
  }, [initialCategories, activeCategoryId]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    router.push(`/recherche?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      {/* Toolbar: sitewide search (articles + forum) */}
      <form
        onSubmit={handleSearchSubmit}
        className="mx-auto mb-6 flex max-w-xl items-center gap-2 rounded-full border-[0.5px] border-border bg-card px-4 py-2 shadow-card-rest transition-colors focus-within:border-primary/40"
        role="search"
      >
        <FontAwesomeIcon icon={faSearch} className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="forum-hub-search" className="sr-only">
          Rechercher un sujet, une ville, une catégorie
        </label>
        <input
          id="forum-hub-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Rechercher un sujet, une ville, une catégorie…"
          className="w-full bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <button
          type="submit"
          className="flex-shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-40"
          disabled={!searchTerm.trim()}
        >
          Rechercher
        </button>
      </form>
      <p className="mx-auto mb-8 max-w-xl text-center text-[13px] text-muted-foreground">
        Choisissez une catégorie ci-dessous pour lancer une discussion.
      </p>

      {/* Category quick-filter pills */}
      {initialCategories.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Filtrer par catégorie">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategoryId === 'all'}
            onClick={() => setActiveCategoryId('all')}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
              activeCategoryId === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border-[0.5px] border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            Toutes catégories
          </button>
          {initialCategories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategoryId === category.id}
              onClick={() => setActiveCategoryId(category.id)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                activeCategoryId === category.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : `${getCategoryTone(index)} hover:opacity-80`
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <CardGrid columns={3}>
        {filteredCategories.map((category) => {
          const toneIndex = initialCategories.findIndex((c) => c.id === category.id);
          const tone = getCategoryTone(toneIndex === -1 ? 0 : toneIndex);
          return (
            <Link
              key={category.id}
              href={`/forum-sur-les-philippines/${category.slug}`}
              className="group flex h-full flex-col rounded-2xl border-[0.5px] border-border bg-card p-5 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex-grow">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3
                    className="text-foreground"
                    style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}
                  >
                    {category.name}
                  </h3>
                  <span
                    className={`inline-flex flex-shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] ${tone}`}
                  >
                    {category.topic_count} sujet{category.topic_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="mb-4 text-[13px] leading-[1.55] text-muted-foreground" style={{ minHeight: '3em' }}>
                  {category.description}
                </p>
              </div>
              <div className="mt-auto border-t-[0.5px] border-border pt-3">
                {category.last_topic_title ? (
                  <>
                    <p className="mb-1.5 truncate text-[12px] text-foreground/80" title={category.last_topic_title}>
                      <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-muted-foreground/80">
                        Dernier
                      </span>
                      <span className="font-medium text-foreground">{category.last_topic_title}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <GradientAvatar
                        src={category.last_post_author_avatar_url}
                        name={category.last_post_author_username}
                        className="h-4 w-4 rounded-full"
                        imgSizes="16px"
                        textClassName="text-[8px]"
                      />
                      <span className="font-medium text-muted-foreground">{category.last_post_author_username}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatRelativeTime(category.last_post_timestamp)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] italic text-muted-foreground/80">Aucune activité récente.</p>
                )}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-primary" aria-hidden="true">
                Voir le forum
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          );
        })}
      </CardGrid>

      {filteredCategories.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Aucune catégorie ne correspond à ce filtre.
        </p>
      )}

      {!user && (
        <div className="mx-auto mt-16 max-w-md">
          <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 text-center shadow-card-rest">
            <span
              className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={faRightToBracket} style={{ fontSize: '20px' }} />
            </span>
            <h3 className="mb-1 text-[16px] font-semibold text-foreground">Rejoignez la discussion</h3>
            <p className="mb-4 text-[13px] leading-[1.55] text-muted-foreground">
              Créez un compte gratuit pour répondre et démarrer vos propres sujets.
            </p>
            <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Link
                href="/connexion"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90"
              >
                Se connecter
              </Link>
              <Link
                href="/connexion#register"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
              >
                Créer un compte
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
