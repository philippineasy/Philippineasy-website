'use client';

import React from 'react';
import Image from 'next/image';
import TinderCard from 'react-tinder-card';
import type { DatingProfile } from '@/types';

/**
 * SwipeDeck — presentational card stack for the Rencontres discovery surface.
 *
 * Pure presentation: it renders the fanned stack of profile cards, the loading
 * skeleton, the empty state and the LIKE / NOPE / SUPER stamps. All product
 * logic (API calls, quotas, premium gating, fetch-more, match handling) lives in
 * the parent container (SwipeClientPage) and is passed down through callbacks and
 * the `childRefs` array so the `react-tinder-card` imperative API is untouched.
 *
 * Motion is handled by react-tinder-card (@react-spring under the hood). We only
 * add decorative depth transforms for the back cards, which we drop entirely when
 * `reducedMotion` is set — the buttons in the parent keep the deck fully usable.
 */

type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeDeckProps {
  profiles: DatingProfile[];
  childRefs: React.RefObject<any>[];
  loading: boolean;
  reducedMotion: boolean;
  swipeFeedback: string | null;
  onSwipe: (direction: string, userId: string) => void;
  onCardLeftScreen: (userId: string) => void;
  onRequirementFulfilled: (direction: string) => void;
  onRequirementUnfulfilled: () => void;
  onAdjustFilters?: () => void;
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SparkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.416 8.265L12 19.897l-7.416 3.965L6 15.597 0 9.75l8.332-1.732z" />
  </svg>
);

const EmptyGlyph = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 15s1.5-2 4-2 4 2 4 2" />
    <path d="M9 9h.01M15 9h.01" />
  </svg>
);

/** Rotated Tinder-style stamp shown once a drag threshold is reached. */
const FeedbackStamp = ({ feedback }: { feedback: string }) => {
  const config: Record<string, { label: string; classes: string; rotate: string; align: string }> = {
    right: {
      label: 'LIKE',
      classes: 'border-emerald-400 text-emerald-400',
      rotate: '-rotate-12',
      align: 'left-5 top-6',
    },
    left: {
      label: 'NOPE',
      classes: 'border-rose-500 text-rose-500',
      rotate: 'rotate-12',
      align: 'right-5 top-6',
    },
    up: {
      label: 'SUPER',
      classes: 'border-primary text-primary',
      rotate: '-rotate-6',
      align: 'left-1/2 top-10 -translate-x-1/2',
    },
  };
  const c = config[feedback];
  if (!c) return null;
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 rounded-xl border-[3px] bg-black/10 px-4 py-1.5 text-[28px] font-extrabold uppercase tracking-[0.08em] backdrop-blur-[1px] ${c.classes} ${c.rotate} ${c.align}`}
    >
      {c.label}
    </span>
  );
};

const SwipeDeck = ({
  profiles,
  childRefs,
  loading,
  reducedMotion,
  swipeFeedback,
  onSwipe,
  onCardLeftScreen,
  onRequirementFulfilled,
  onRequirementUnfulfilled,
  onAdjustFilters,
}: SwipeDeckProps) => {
  const wrapperClass =
    'relative w-[min(88vw,340px)] h-[min(130vw,510px)] sm:w-[380px] sm:h-[570px]';

  if (loading) {
    return (
      <div className={wrapperClass}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[20px] border border-border bg-muted">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary motion-reduce:animate-none" />
          <p className="text-sm font-medium text-muted-foreground">Recherche de profils…</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className={wrapperClass}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[20px] border border-border bg-card px-8 text-center shadow-card">
          <span className="text-muted-foreground/60">
            <EmptyGlyph />
          </span>
          <h3 className="text-[19px] font-semibold text-foreground">
            Plus personne à découvrir pour le moment
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Revenez un peu plus tard, ou élargissez vos filtres pour rencontrer davantage de
            personnes.
          </p>
          {onAdjustFilters && (
            <button
              type="button"
              onClick={onAdjustFilters}
              className="mt-2 inline-flex min-h-[44px] items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Ajuster mes filtres
            </button>
          )}
        </div>
      </div>
    );
  }

  const topIndex = profiles.length - 1;

  return (
    <div className={wrapperClass}>
      {profiles.map((profile, index) => {
        // depth 0 = card on top; deeper cards sit slightly scaled/offset behind.
        const depth = topIndex - index;
        const isTop = depth === 0;
        const hidden = depth > 2; // only render 3 cards of visible depth
        const depthStyle: React.CSSProperties = reducedMotion
          ? { zIndex: index, opacity: isTop ? 1 : 0 }
          : {
              zIndex: index,
              transform: `translateY(${depth * 12}px) scale(${1 - depth * 0.04})`,
              opacity: hidden ? 0 : 1,
              transition: 'transform 0.25s ease-out, opacity 0.25s ease-out',
            };

        return (
          <TinderCard
            key={profile.user_id}
            ref={childRefs[index]}
            className="absolute inset-0"
            onSwipe={(dir: SwipeDirection) => onSwipe(dir, profile.user_id)}
            onCardLeftScreen={() => onCardLeftScreen(profile.user_id)}
            preventSwipe={['down']}
            swipeRequirementType="position"
            onSwipeRequirementFulfilled={(dir: SwipeDirection) => onRequirementFulfilled(dir)}
            onSwipeRequirementUnfulfilled={onRequirementUnfulfilled}
          >
            <article
              aria-label={`${profile.username ?? 'Profil'}, ${profile.age ?? ''}`}
              className="relative h-full w-full select-none overflow-hidden rounded-[20px] bg-card shadow-[0_20px_40px_rgba(15,23,42,0.15)]"
              style={depthStyle}
            >
              <Image
                src={profile.profile_picture_url || '/default-avatar.webp'}
                alt={profile.username ? `Photo de ${profile.username}` : 'Photo de profil'}
                fill
                draggable={false}
                sizes="(max-width: 640px) 88vw, 380px"
                className="pointer-events-none object-cover"
                priority={isTop}
              />

              {/* Bottom scrim for text legibility */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
              />

              {isTop && swipeFeedback && <FeedbackStamp feedback={swipeFeedback} />}

              {/* Top badges */}
              <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                  <CheckIcon />
                  Vérifié
                </span>
                {typeof profile.compatibility === 'number' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm">
                    <SparkIcon />
                    {profile.compatibility}%
                  </span>
                )}
              </div>

              {/* Bottom info */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h2 className="text-[26px] font-bold leading-tight tracking-[-0.01em] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
                  {profile.username}
                  {profile.age ? <span className="font-medium">, {profile.age}</span> : null}
                </h2>
                {profile.city && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
                    <PinIcon />
                    {profile.city}
                  </p>
                )}
                {profile.description && (
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-white/85">
                    {profile.description}
                  </p>
                )}
                {profile.interests && profile.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {profile.interests.slice(0, 3).map((interest) => (
                      <span
                        key={interest.id}
                        className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
                      >
                        {interest.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </TinderCard>
        );
      })}
    </div>
  );
};

export default SwipeDeck;
