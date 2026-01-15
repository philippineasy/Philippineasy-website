'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCrown, faUsers, faShieldAlt, faFileDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface ServiceCardProps {
  name: string;
  description: string;
  features: string[];
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
      className={`relative bg-card rounded-2xl shadow-lg p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${
        highlighted
          ? 'border-2 border-primary ring-2 ring-primary/20 scale-105'
          : 'border border-border hover:border-primary/50'
      }`}
    >
      {badge && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
            badge === 'Best Value' || badge === 'Exclusif'
              ? 'bg-accent text-accent-foreground'
              : badge === 'Populaire'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}
        >
          {badge}
        </div>
      )}

      <div className="text-center mb-6 mt-2">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${
            highlighted ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          <FontAwesomeIcon icon={IconComponent} className="text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-4xl font-bold ${highlighted ? 'text-primary' : 'text-foreground'}`}>
            {typeof price === 'number' ? `${price}€` : price}
          </span>
          {priceLabel && <span className="text-muted-foreground text-sm">{priceLabel}</span>}
        </div>
        {priceNote && <p className="text-xs text-muted-foreground mt-1">{priceNote}</p>}
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faCheck}
              className={`mt-1 text-sm ${highlighted ? 'text-primary' : 'text-green-500'}`}
            />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors ${
          highlighted
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted text-foreground hover:bg-muted/80'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
}
