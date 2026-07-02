import Image from 'next/image';
import type { ReactNode } from 'react';
import { StatRow, type StatItem } from './StatRow';

/**
 * PageHero — editorial hero for interior pages. Left-aligned copy over a navy
 * scrim, more contained than the homepage hero. Renders an optional eyebrow, a
 * title with an amber `titleAccent` segment, subtitle, optional StatRow, and a
 * `children` slot above the title for breadcrumbs. Replaces HeroThematic.
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
      {/* Navy protection scrim: vertical for depth + left-to-right for legibility
          of the left-aligned copy. Kept static — no ken-burns motion. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(10,20,50,0.25) 0%, rgba(10,20,50,0.55) 100%), linear-gradient(90deg, rgba(10,20,50,0.60) 0%, rgba(10,20,50,0.12) 58%, rgba(10,20,50,0) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4 pb-10 pt-28 md:pb-14 md:pt-32">
        <div className="max-w-2xl">
          {children && <div className="mb-5">{children}</div>}

          {eyebrow && (
            <span className="mb-4 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-white/85">
              {eyebrow}
            </span>
          )}

          <h1
            className="font-bold text-white"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
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
              style={{ color: 'rgba(255,255,255,0.94)', lineHeight: 1.6 }}
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
