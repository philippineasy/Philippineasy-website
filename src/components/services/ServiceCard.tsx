'use client';

import Link from 'next/link';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { cn } from '@/lib/utils';

// A feature is either a plain label or a label carrying a Radix tooltip.
export type Feature = string | { text: string; tooltip: string };

interface ServiceCardProps {
  name: string;
  /** Duration / short qualifier shown under the name (e.g. "1-2 semaines"). */
  description: string;
  features: Feature[];
  price: number | string;
  /** Optional inline unit next to the price (e.g. "/mois"). */
  priceLabel?: string;
  /** Mention under the price. One-time by default; pass "par mois" / "par an"
   * for subscriptions. Set to '' to hide it. */
  paymentNote?: string;
  badge?: string;
  ctaText?: string;
  ctaHref?: string;
  highlighted?: boolean;
}

/**
 * Unified price card (validated pattern — _handoff/design_v4/PriceCard.dc.html).
 * White surface, radius 16, hairline border (or 1.5px primary + shadow when
 * highlighted). Floating primary badge, name 17 / duration 13 muted, price 32
 * tabular (primary when highlighted), payment mention, hairline divider, then
 * features as amber tick-dashes, and a full-width "Choisir" CTA (solid accent +
 * shadow when highlighted, otherwise white bordered). Tokenised & dark-ready.
 */
export default function ServiceCard({
  name,
  description,
  features,
  price,
  priceLabel = '',
  paymentNote = 'Paiement unique',
  badge,
  ctaText = 'Choisir',
  ctaHref = '#',
  highlighted = false,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-2xl bg-card px-[26px] py-7 transition-all duration-200 hover:-translate-y-1 motion-reduce:hover:transform-none',
        highlighted
          ? 'border-[1.5px] border-primary shadow-[0_4px_6px_rgba(0,0,0,0.07)]'
          : 'border-[0.5px] border-border shadow-card-rest hover:border-primary/30 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)]'
      )}
    >
      {badge && (
        <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary-foreground">
          {badge}
        </span>
      )}

      <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-foreground">{name}</h3>
      <p className="mt-[3px] text-[13px] leading-[1.4] text-muted-foreground">{description}</p>

      <div className="mb-[2px] mt-[18px] flex items-baseline gap-2">
        <span
          className={cn(
            'text-[32px] font-bold leading-none tracking-[-0.02em] tabular-nums',
            highlighted ? 'text-primary' : 'text-foreground'
          )}
        >
          {typeof price === 'number' ? `${price}€` : price}
        </span>
        {priceLabel && <span className="text-[13px] text-muted-foreground">{priceLabel}</span>}
      </div>
      {paymentNote && <p className="text-[12px] text-muted-foreground">{paymentNote}</p>}

      <ul className="mt-[18px] flex flex-1 flex-col gap-2.5 border-t-[0.5px] border-border pt-4">
        {features.map((feature, index) => {
          const text = typeof feature === 'string' ? feature : feature.text;
          const tooltip = typeof feature === 'string' ? null : feature.tooltip;

          return (
            <li key={index} className="flex items-baseline gap-2.5 text-[13.5px] leading-[1.5]">
              <span
                className="h-[1.5px] w-3 flex-shrink-0 -translate-y-1 bg-accent"
                aria-hidden="true"
              />
              <span className="text-foreground/90">
                {text}
                {tooltip && <InfoTooltip content={tooltip} />}
              </span>
            </li>
          );
        })}
      </ul>

      <Link
        href={ctaHref}
        className={cn(
          'mt-[22px] block rounded-lg px-[18px] py-[11px] text-center text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          highlighted
            ? 'bg-accent text-accent-foreground shadow-[0_10px_15px_rgba(0,0,0,0.08)] hover:bg-accent/90'
            : 'border border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted'
        )}
      >
        {ctaText}
      </Link>
    </div>
  );
}
