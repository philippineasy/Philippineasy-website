import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * StatRow — a compact band of 2–4 KEY FIGURES (value + label + optional icon).
 *
 * Reserved for NUMBERS ONLY (durations, amounts, counts). Do not use it for
 * prose bullets or feature lists — it is a metrics band, not a content list.
 *
 * Two tones:
 * - `tone="onDark"` — white type over the PageHero navy scrim / signature blue
 *   panels. Left-aligned row with a hairline top rule, mirrors the hero stats.
 * - `tone="default"` (light surfaces) — an ANCHORED band: figures sit in a
 *   rounded `bg-muted` panel split by hairline separators (1px `bg-border`
 *   gutters), so numbers read as a solid block instead of floating on white.
 *   This is the fix for the earlier "figures adrift on white" problem.
 *
 * Fully token-driven (dark-mode ready).
 */

export interface StatItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface StatRowProps {
  stats: StatItem[];
  tone?: 'default' | 'onDark';
  className?: string;
}

// Mobile keeps figures paired; desktop opens to a single row of separators.
const gridClasses: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
};

export const StatRow = ({ stats, tone = 'default', className }: StatRowProps) => {
  const onDark = tone === 'onDark';

  // onDark — left-aligned hero-style row over a scrim / blue panel.
  if (onDark) {
    return (
      <div
        className={cn(
          'flex flex-wrap items-start gap-x-10 gap-y-6 border-t border-white/15 pt-6',
          className
        )}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            {stat.icon && (
              <span
                className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent"
                aria-hidden="true"
              >
                {stat.icon}
              </span>
            )}
            <span className="text-[clamp(1.75rem,3vw,2rem)] font-bold leading-none tabular-nums tracking-[-0.02em] text-white">
              {stat.value}
            </span>
            <span className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.06em] text-white/70">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // default — anchored band on light surfaces. The `bg-border` container with a
  // 1px gap draws the hairline separators between cells whatever the wrap.
  const cols = gridClasses[Math.min(4, Math.max(2, stats.length))] ?? gridClasses[4];

  return (
    <div
      className={cn(
        'grid gap-px overflow-hidden rounded-2xl border-[0.5px] border-border bg-border shadow-card-rest',
        cols,
        className
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center bg-muted px-4 py-6 text-center md:px-6 md:py-7"
        >
          {stat.icon && (
            <span
              className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
              aria-hidden="true"
            >
              {stat.icon}
            </span>
          )}
          <span className="text-[clamp(1.75rem,3vw,2.125rem)] font-bold leading-none tabular-nums tracking-[-0.02em] text-foreground">
            {stat.value}
          </span>
          <span className="mt-2 text-[12px] font-medium uppercase leading-tight tracking-[0.06em] text-muted-foreground">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};
