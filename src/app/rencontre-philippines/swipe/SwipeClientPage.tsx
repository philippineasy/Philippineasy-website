'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { DatingProfile, Interest } from '@/types';
import { getProfiles, getInterests } from '@/services/datingService';
import { likeUser, superLikeUser } from '../profil/actions';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faCrown } from '@fortawesome/free-solid-svg-icons';
import SwipeDeck from '@/components/dating/SwipeDeck';
import SwipeFilters, { DatingFilters } from '@/components/dating/SwipeFilters';

interface SwipeClientPageProps {
  initialProfiles: DatingProfile[];
  hasMoreInitial: boolean;
}

/* Action-bar glyphs — filled heart / star and a stroked cross, matching the
   Rencontres prototype rather than generic library icons. */
const PassGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const SuperGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.416 8.265L12 19.897l-7.416 3.965L6 15.597 0 9.75l8.332-1.732z" />
  </svg>
);
const LikeGlyph = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SwipeClientPage = ({ initialProfiles, hasMoreInitial }: SwipeClientPageProps) => {
  const [profiles, setProfiles] = useState<DatingProfile[]>(initialProfiles);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [loading, setLoading] = useState(false); // Initially false, as we have initialProfiles
  const { user } = useAuth();
  const { isPremium } = usePremium();

  const [page, setPage] = useState(2); // Start fetching from page 2
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [activeFilters, setActiveFilters] = useState<DatingFilters | null>(null);
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const canSwipe = profiles.length > 0;

  const childRefs: React.RefObject<any>[] = useMemo(
    () =>
      Array(profiles.length)
        .fill(0)
        .map(() => React.createRef()),
    [profiles.length]
  );

  const fetchInitialData = async (filters: DatingFilters | null) => {
    setLoading(true);
    setPage(2); // Reset page count for new filter
    try {
      const [interests, profilesData] = await Promise.all([
        getInterests(),
        getProfiles(1, 20, filters, user?.id),
      ]);
      setAvailableInterests(interests);
      setProfiles(profilesData.profiles);
      setHasMore(profilesData.hasMore);
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch interests on initial load, not profiles unless filters change
    getInterests().then(setAvailableInterests);
  }, []);

  useEffect(() => {
    if (activeFilters) {
      fetchInitialData(activeFilters);
    }
  }, [activeFilters]);

  // Respect the user's motion preference for the decorative stack transforms.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const fetchMoreProfiles = async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      const profilesData = await getProfiles(page, 10, activeFilters, user?.id);
      if (profilesData.profiles.length > 0) {
        setProfiles((prev) => [...profilesData.profiles, ...prev]); // Add new profiles to the bottom of the stack
        setPage((prev) => prev + 1);
      }
      setHasMore(profilesData.hasMore);
    } catch (error) {
      console.error('Failed to fetch more profiles', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const swiped = async (direction: string, userId: string) => {
    try {
      if (direction === 'right') {
        await likeUser(userId);
      } else if (direction === 'up') {
        await superLikeUser(userId);
      }
    } catch (error) {
      console.error('Failed to record swipe', error);
    }

    // Check if we need to fetch more profiles
    if (profiles.length <= 5 && hasMore && !isFetchingMore) {
      fetchMoreProfiles();
    }
  };

  const outOfFrame = (userId: string) => {
    // no-op: card removal is handled in onCardLeftScreen
    void userId;
  };

  const swipe = useCallback(
    async (dir: 'left' | 'right' | 'up') => {
      if (profiles.length > 0) {
        await childRefs[profiles.length - 1]?.current?.swipe(dir);
      }
    },
    [childRefs, profiles.length]
  );

  // Super Like is a premium feature — gate it on the client so a free member is
  // not silently charged a lost profile, while the server action stays the guard.
  const handleSuperLike = useCallback(() => {
    if (!canSwipe) return;
    if (!isPremium) {
      toast('Les Super Likes sont réservés aux membres Premium.', { icon: '⭐' });
      return;
    }
    swipe('up');
  }, [canSwipe, isPremium, swipe]);

  // Keyboard controls: ← pass · → like · ↑ super (spec A11y).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (!canSwipe || loading) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        swipe('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        swipe('right');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleSuperLike();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canSwipe, loading, swipe, handleSuperLike]);

  const handleApplyFilters = (filters: DatingFilters) => {
    setActiveFilters(filters);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowFilters(false); // On mobile, hide after applying
    }
  };

  const actionsDisabled = !canSwipe || loading;

  return (
    <div className="min-h-[calc(100vh-11rem)] bg-background pb-12">
      {/* Header — signature rose surface for the dating product */}
      <header className="border-b border-border bg-pink-50 dark:bg-pink-950/25">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-rose-600 dark:text-rose-300">
              Rencontres
            </p>
            <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-foreground">
              Découverte
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {isPremium ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-[13px] font-semibold text-accent-strong">
                <FontAwesomeIcon icon={faCrown} className="text-[12px]" />
                Premium
              </span>
            ) : (
              <Link
                href="/rencontre-philippines/premium"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-ink shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <FontAwesomeIcon icon={faCrown} className="text-[13px]" />
                Passer Premium
              </Link>
            )}

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-controls="swipe-filters"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
            >
              <FontAwesomeIcon icon={faFilter} />
              <span className="sr-only">Filtres</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start lg:justify-center">
        {/* Deck + actions */}
        <section className="flex flex-1 flex-col items-center">
          <SwipeDeck
            profiles={profiles}
            childRefs={childRefs}
            loading={loading}
            reducedMotion={reducedMotion}
            swipeFeedback={swipeFeedback}
            onSwipe={(dir, userId) => {
              swiped(dir, userId);
              setSwipeFeedback(null);
            }}
            onCardLeftScreen={(userId) => {
              setProfiles((prev) => prev.slice(0, prev.length - 1));
              setSwipeFeedback(null);
              outOfFrame(userId);
            }}
            onRequirementFulfilled={(dir) => setSwipeFeedback(dir)}
            onRequirementUnfulfilled={() => setSwipeFeedback(null)}
            onAdjustFilters={() => setShowFilters(true)}
          />

          {/* Action bar — Pass · Super Like · Like */}
          <div className="mt-7 flex items-center justify-center gap-5 sm:gap-6">
            <button
              type="button"
              onClick={() => swipe('left')}
              disabled={actionsDisabled}
              aria-label="Passer"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-500 disabled:pointer-events-none disabled:opacity-40 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <PassGlyph />
            </button>

            <button
              type="button"
              onClick={handleSuperLike}
              disabled={actionsDisabled}
              aria-label={isPremium ? 'Super like' : 'Super like — réservé aux membres Premium'}
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-accent shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/5 disabled:pointer-events-none disabled:opacity-40 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <SuperGlyph />
              {!isPremium && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] text-ink"
                >
                  <FontAwesomeIcon icon={faCrown} />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => swipe('right')}
              disabled={actionsDisabled}
              aria-label="Like"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-white shadow-like transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-600 disabled:pointer-events-none disabled:opacity-40 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
            >
              <LikeGlyph />
            </button>
          </div>

          {/* Meta row */}
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span aria-hidden="true">Un doute&nbsp;?</span>
            <Link
              href="/rencontre-philippines/messages"
              className="group inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Voir mes matchs
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* Filters — permanent sidebar on desktop, toggled panel on mobile */}
        <aside
          id="swipe-filters"
          className={`flex-shrink-0 lg:sticky lg:top-40 lg:block lg:w-80 ${
            showFilters ? 'block w-full' : 'hidden'
          }`}
        >
          <SwipeFilters onApplyFilters={handleApplyFilters} availableInterests={availableInterests} />
        </aside>
      </main>
    </div>
  );
};

export default SwipeClientPage;
