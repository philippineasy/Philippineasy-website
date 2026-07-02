import Image from 'next/image';
import type { ReactNode } from 'react';
import { StatRow, type StatItem } from './StatRow';

/**
 * PageHero — editorial hero for interior pages. Left-aligned copy over a navy
 * scrim, more contained than the homepage hero. Renders an optional eyebrow, a
 * title with an amber `titleAccent` segment, subtitle, optional StatRow, and a
 * `children` slot above the title for breadcrumbs. Replaces HeroThematic.
 *
 * ACCENT DISCIPLINE — `titleAccent` is the vivid amber (#F59E0B / `text-accent`)
 * signature word, exactly like the homepage "mille visages" H2. Keep it to
 * ONE or TWO words max (a place, a visa code, a headline noun); accenting a
 * whole phrase kills the effect and the contrast on a bright photo. Everything
 * else in the title stays white.
 *
 * The title must stay legible even on a weak / low-contrast photo: the navy
 * scrim is weighted toward the bottom-left (where the copy sits) and the
 * headline carries a soft text-shadow as a safety net.
 */

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt: string;
  stats?: StatItem[];
  children?: ReactNode;
  priority?: boolean;
}

export const PageHero = ({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  imageUrl,
  imageAlt,
  stats,
  children,
  priority = true,
}: PageHeroProps) => {
  return (
    <section className="relative flex min-h-[clamp(380px,54vh,560px)] items-end overflow-hidden">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      {/* Navy protection scrim: weighted to the bottom-left so the copy always
          sits on the darkest area, holding legibility even on a pale or busy
          photo. Two stacked gradients (vertical depth + left-to-right anchor).
          Kept static — no ken-burns motion. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(9,16,42,0.20) 0%, rgba(9,16,42,0.42) 52%, rgba(9,16,42,0.70) 100%), linear-gradient(90deg, rgba(9,16,42,0.62) 0%, rgba(9,16,42,0.16) 60%, rgba(9,16,42,0) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4 pb-10 pt-28 md:pb-14 md:pt-32">
        <div className="max-w-2xl">
          {children && <div className="mb-5">{children}</div>}

          {eyebrow && (
            <span className="mb-4 flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white">
              <span className="h-px w-7 flex-shrink-0 bg-accent" aria-hidden="true" />
              {eyebrow}
            </span>
          )}

          <h1
            className="font-bold text-white"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 28px rgba(9,16,42,0.45)',
            }}
          >
            {title}
            {titleAccent && (
              <>
                {' '}
                <span className="text-accent">{titleAccent}</span>
              </>
            )}
          </h1>

          {subtitle && (
            <p
              className="mt-5 max-w-xl text-base md:text-lg"
              style={{
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.6,
                textShadow: '0 1px 16px rgba(9,16,42,0.4)',
              }}
            >
              {subtitle}
            </p>
          )}

          {stats && stats.length > 0 && (
            <StatRow stats={stats} tone="onDark" className="mt-8" />
          )}
        </div>
      </div>
    </section>
  );
};
