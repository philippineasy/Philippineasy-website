import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * CardGrid — responsive grid for LinkCards (or any cards), with an optional
 * centred section header (eyebrow / title + amber accent / subtitle). Choose
 * 2, 3 or 4 columns; mobile-first collapse is handled. Composable: wrap it in a
 * <section> for padding. Mirrors the RegionCards / hub-vivre card layouts.
 */

const columnClasses: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
};

interface CardGridProps {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}

export const CardGrid = ({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  columns = 3,
  children,
  className,
}: CardGridProps) => {
  const hasHeader = eyebrow || title || subtitle;

  return (
    <div className={cn('mx-auto max-w-6xl', className)}>
      {hasHeader && (
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          {eyebrow && (
            <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2
              className="mt-3 text-[clamp(1.875rem,3.5vw,2.5rem)] font-bold text-foreground"
              style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
            >
              {title}
              {titleAccent && (
                <>
                  {' '}
                  {/* Vivid amber signature word (large display heading) — matches
                      the homepage H2 accent. Links/small text keep accent-strong. */}
                  <span className="text-accent">{titleAccent}</span>
                </>
              )}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 text-[17px] leading-[1.6] text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className={cn('grid gap-5 md:gap-6', columnClasses[columns])}>
        {children}
      </div>
    </div>
  );
};
