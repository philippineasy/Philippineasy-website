'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCrown, faUsers, faShieldAlt, faFileDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { cn } from '@/lib/utils';

// Type pour les features avec ou sans tooltip
export type Feature = string | { text: string; tooltip: string };

interface ServiceCardProps {
  name: string;
  description: string;
  features: Feature[];
  price: number | string;
  priceLabel?: string;
  badge?: string;
  icon: 'faCrown' | 'faUsers' | 'faShieldAlt' | 'faFileDownload' | 'faStar';
  ctaText?: string;
  ctaHref?: string;
  highlighted?: boolean;
  priceNote?: string;
}

const iconMap = {
  faCrown,
  faUsers,
  faShieldAlt,
  faFileDownload,
  faStar,
};

// "Populaire" reads as the recommended tier (brand blue); "Exclusif" / "Best
// Value" / "VIP" read as premium (amber). Both pairings are AA in light & dark.
const badgeToneClass = (badge: string) =>
  badge === 'Populaire'
    ? 'bg-primary text-primary-foreground'
    : 'bg-accent text-accent-foreground';

export default function ServiceCard({
  name,
  description,
  features,
  price,
  priceLabel = '',
  badge,
  icon,
  ctaText = 'Choisir',
  ctaHref = '#',
  highlighted = false,
  priceNote,
}: ServiceCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl bg-card p-6 transition-all duration-200 hover:-translate-y-1 motion-reduce:hover:transform-none',
        highlighted
          ? 'border-[1.5px] border-primary shadow-card md:scale-[1.03]'
          : 'border-[0.5px] border-border shadow-card-rest hover:border-primary/30 hover:shadow-card'
      )}
    >
      {badge && (
        <span
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em]',
            badgeToneClass(badge)
          )}
        >
          {badge}
        </span>
      )}

      <div className="mb-5 mt-1 text-center">
        <span
          className={cn(
            'mb-3 inline-flex h-[52px] w-[52px] items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100',
            highlighted ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          )}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={IconComponent} className="text-[22px]" />
        </span>
        <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-foreground">{name}</h3>
        <p className="mt-1 text-[13px] leading-[1.5] text-muted-foreground">{description}</p>
      </div>

      <div className="mb-6 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span
            className={cn(
              'text-[36px] font-bold leading-none tracking-[-0.02em] tabular-nums',
              highlighted ? 'text-primary' : 'text-foreground'
            )}
          >
            {typeof price === 'number' ? `${price}€` : price}
          </span>
          {priceLabel && <span className="text-[13px] text-muted-foreground">{priceLabel}</span>}
        </div>
        {priceNote && <p className="mt-1 text-[11px] text-muted-foreground">{priceNote}</p>}
      </div>

      <ul className="mb-6 flex-grow space-y-3 border-t border-border/70 pt-5">
        {features.map((feature, index) => {
          const text = typeof feature === 'string' ? feature : feature.text;
          const tooltip = typeof feature === 'string' ? null : feature.tooltip;

          return (
            <li key={index} className="flex items-start gap-2.5">
              <span
                className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
              </span>
              <span className="text-[13px] leading-[1.5] text-foreground/90">
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
          'block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all duration-200 hover:scale-[1.02] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          highlighted
            ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
            : 'bg-foreground text-background hover:opacity-90'
        )}
      >
        {ctaText}
      </Link>
    </div>
  );
}
