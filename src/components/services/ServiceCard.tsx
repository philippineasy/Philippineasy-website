'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCrown, faUsers, faShieldAlt, faFileDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import InfoTooltip from '@/components/ui/InfoTooltip';

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
      className={`group relative bg-card rounded-2xl p-6 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        highlighted ? 'md:scale-[1.03]' : ''
      }`}
      style={{
        border: highlighted ? '1.5px solid #3B5BDB' : '0.5px solid #e5e7eb',
        boxShadow: highlighted
          ? '0 8px 24px rgba(59,91,219,0.12)'
          : '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      {badge && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full"
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            backgroundColor:
              badge === 'Best Value' || badge === 'Exclusif'
                ? '#F59E0B'
                : badge === 'Populaire'
                ? '#3B5BDB'
                : '#f1f5f9',
            color:
              badge === 'Best Value' || badge === 'Exclusif'
                ? '#1a1a00'
                : badge === 'Populaire'
                ? '#ffffff'
                : '#334155',
          }}
        >
          {badge}
        </div>
      )}

      <div className="text-center mb-5 mt-1">
        <span
          className="inline-flex items-center justify-center rounded-xl mb-3"
          style={{
            width: '52px',
            height: '52px',
            backgroundColor: highlighted ? '#F4F7FE' : '#f8fafc',
            color: highlighted ? '#3B5BDB' : '#64748b',
          }}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={IconComponent} style={{ fontSize: '22px' }} />
        </span>
        <h3
          className="text-foreground"
          style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
        >
          {name}
        </h3>
        <p
          className="mt-1"
          style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}
        >
          {description}
        </p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span
            className="tabular-nums"
            style={{
              fontSize: '36px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: highlighted ? '#3B5BDB' : '#0f172a',
            }}
          >
            {typeof price === 'number' ? `${price}€` : price}
          </span>
          {priceLabel && (
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              {priceLabel}
            </span>
          )}
        </div>
        {priceNote && (
          <p className="mt-1" style={{ fontSize: '11px', color: '#94a3b8' }}>
            {priceNote}
          </p>
        )}
      </div>

      <ul
        className="space-y-3 mb-6 flex-grow pt-5"
        style={{ borderTop: '0.5px solid #f1f5f9' }}
      >
        {features.map((feature, index) => {
          const text = typeof feature === 'string' ? feature : feature.text;
          const tooltip = typeof feature === 'string' ? null : feature.tooltip;

          return (
            <li key={index} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 inline-flex items-center justify-center rounded-full mt-0.5"
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: highlighted ? '#F4F7FE' : '#ecfdf5',
                  color: highlighted ? '#3B5BDB' : '#059669',
                }}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={faCheck} style={{ fontSize: '9px' }} />
              </span>
              <span
                style={{
                  fontSize: '13px',
                  color: '#334155',
                  lineHeight: 1.5,
                }}
              >
                {text}
                {tooltip && <InfoTooltip content={tooltip} />}
              </span>
            </li>
          );
        })}
      </ul>

      <Link
        href={ctaHref}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-center text-sm transition-all duration-200 hover:scale-[1.02] ${
          highlighted
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
            : 'bg-foreground text-background hover:opacity-90'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
}
