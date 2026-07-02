import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * SplitSection — two-column editorial section (rich text + visual), in the vein
 * of BlogSection / ItineraireIABlock. Pass `reverse` to flip sides, `tone="muted"`
 * for the alternating background pause, and rich `children` (p / ul / a / h3…).
 * With no image it collapses to a single centred column. Replaces AlternatingContent.
 */

// Scoped rich-text styling (no @tailwindcss/typography in this project).
const richText = cn(
  'text-[16px] leading-[1.7] text-muted-foreground',
  '[&_p]:mb-4 [&_p:last-child]:mb-0',
  '[&_strong]:font-semibold [&_strong]:text-foreground',
  '[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80',
  '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul>li]:mb-1.5 [&_ul>li]:marker:text-primary',
  '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol>li]:mb-1.5',
  '[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:tracking-[-0.01em] [&_h3]:text-foreground',
  '[&_h4]:mb-1.5 [&_h4]:mt-5 [&_h4]:text-[17px] [&_h4]:font-semibold [&_h4]:text-foreground'
);

interface SplitSectionProps {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  imageUrl?: string;
  imageAlt?: string;
  reverse?: boolean;
  tone?: 'default' | 'muted';
  children: ReactNode;
}

export const SplitSection = ({
  eyebrow,
  title,
  titleAccent,
  imageUrl,
  imageAlt = '',
  reverse = false,
  tone = 'default',
  children,
}: SplitSectionProps) => {
  const header = (
    <>
      {eyebrow && (
        <span className="mb-3 inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <h2
        className="mb-5 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold text-foreground"
        style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
      >
        {title}
        {titleAccent && (
          <>
            {' '}
            {/* Vivid amber signature word (large display heading) — matches the
                homepage H2 accent. Small-text/links keep `accent-strong` for AA. */}
            <span className="text-accent">{titleAccent}</span>
          </>
        )}
      </h2>
    </>
  );

  return (
    <section
      className={cn(
        'py-20 md:py-24',
        tone === 'muted' ? 'bg-muted' : 'bg-background'
      )}
    >
      <div className="container mx-auto px-4">
        {imageUrl ? (
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className={cn(reverse && 'md:order-last')}>
              {header}
              <div className={richText}>{children}</div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {header}
            <div className={richText}>{children}</div>
          </div>
        )}
      </div>
    </section>
  );
};
