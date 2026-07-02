import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * LinkCard — a hairline card that links somewhere. Provide either an `image`
 * (photo-led card, top image) or an `icon` (icon-led horizontal card). Renders
 * title, optional desc and a CTA arrow. Border 0.5px + subtle shadow, lifts on
 * hover. The whole card is the link; the CTA text is decorative.
 */

interface LinkCardImage {
  src: string;
  alt: string;
}

interface LinkCardProps {
  title: string;
  href: string;
  desc?: string;
  icon?: ReactNode;
  image?: LinkCardImage;
  cta?: string;
}

const cardBase =
  'group bg-card rounded-2xl border-[0.5px] border-border shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:shadow-card hover:border-primary/30 motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const CtaArrow = ({ label }: { label: string }) => (
  <span
    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary"
    aria-hidden="true"
  >
    {label}
    <span className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0">
      →
    </span>
  </span>
);

export const LinkCard = ({ title, href, desc, icon, image, cta }: LinkCardProps) => {
  if (image) {
    return (
      <Link href={href} className={cn(cardBase, 'flex flex-col overflow-hidden')}>
        <div className="relative h-[180px] w-full overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="flex flex-1 flex-col px-5 pb-5 pt-[18px]">
          <h3
            className="mb-2 text-[18px] font-semibold text-foreground"
            style={{ letterSpacing: '-0.01em', lineHeight: 1.3 }}
          >
            {title}
          </h3>
          {desc && (
            <p className="mb-4 flex-1 text-[13px] leading-[1.55] text-muted-foreground">
              {desc}
            </p>
          )}
          <CtaArrow label={cta ?? 'En savoir plus'} />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn(cardBase, 'flex items-start gap-4 px-5 py-5')}>
      {icon && (
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="min-w-0">
        <h3
          className="mb-1 text-[15px] font-semibold text-foreground"
          style={{ letterSpacing: '-0.01em' }}
        >
          {title}
        </h3>
        {desc && (
          <p className="text-[13px] leading-[1.55] text-muted-foreground">{desc}</p>
        )}
        {cta && <CtaArrow label={cta} />}
      </span>
    </Link>
  );
};
