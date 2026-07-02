import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * StatRow — a horizontal row of 2–4 key figures (value + label + optional icon),
 * modelled on the hero stats row. `tone="onDark"` renders white type for use over
 * the PageHero scrim / signature blue panels; the default tone sits on light or
 * card surfaces and replaces the old KeyStatCard grids. Fully token-driven.
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

export const StatRow = ({ stats, tone = 'default', className }: StatRowProps) => {
  const onDark = tone === 'onDark';

  return (
    <div
      className={cn(
        'flex flex-wrap items-start gap-x-10 gap-y-6',
        onDark && 'border-t border-white/15 pt-6',
        className
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          {stat.icon && (
            <span
              className={cn(
                'mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl',
                onDark ? 'bg-white/10 text-accent' : 'bg-primary/10 text-primary'
              )}
              aria-hidden="true"
            >
              {stat.icon}
            </span>
          )}
          <span
            className={cn(
              'text-[clamp(1.75rem,3vw,2rem)] font-bold leading-none tabular-nums tracking-[-0.02em]',
              onDark ? 'text-white' : 'text-foreground'
            )}
          >
            {stat.value}
          </span>
          <span
            className={cn(
              'mt-1.5 text-[12px] font-medium uppercase tracking-[0.06em]',
              onDark ? 'text-white/70' : 'text-muted-foreground'
            )}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};
