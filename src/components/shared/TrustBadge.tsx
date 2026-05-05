'use client';

/**
 * TrustBadge — credibility / risk-reversal signals.
 *
 * Pourquoi : trafic Google Ads froid arrive sceptique. On reduit l'anxiete
 * d'achat avec 4 leviers psycho :
 *   - autorite (guide francophone depuis 2020)
 *   - preuve sociale (+10 000 voyageurs)
 *   - reduction du risque (paiement Stripe + satisfait/rembourse)
 *   - support / recours (reponse <48h)
 *
 * Reference design : OfferConfirmationModal.tsx (gradient bleu, dashed circles,
 * pill-icon en `bg-primary/10 text-primary`, rounded-2xl, shadow subtile).
 *
 * 3 variants :
 *   - 'default'  : badge horizontal, icone + label + description (homepage / pricing)
 *   - 'compact'  : badge compact icone + label seul (espace reduit, ex. footer)
 *   - 'shield'   : carte single grande (post-CTA, checkout) — emphase forte
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faLock,
  faRotateLeft,
  faEnvelopeOpenText,
  faUsers,
  faMapLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { ReactNode } from 'react';

// ============================================================================
// Tokens (alignes sur OfferConfirmationModal et tailwind.config.js)
// ============================================================================

type Tone = 'primary' | 'accent' | 'success';

const TONE_COLORS: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: '#F4F7FE', fg: '#3B5BDB' },
  accent: { bg: '#FEF3C7', fg: '#B45309' },
  success: { bg: '#ECFDF5', fg: '#059669' },
};

// ============================================================================
// TrustBadge — atomic
// ============================================================================

export interface TrustBadgeProps {
  /** FontAwesome icon definition */
  icon: IconDefinition;
  /** Bold short label, ex. "Paiement securise" */
  label: string;
  /** Optional subtext, ex. "Stripe + SSL chiffre" */
  description?: string;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'shield';
  /** Color tone of the icon pill */
  tone?: Tone;
  /** Optional className override */
  className?: string;
}

export function TrustBadge({
  icon,
  label,
  description,
  variant = 'default',
  tone = 'primary',
  className = '',
}: TrustBadgeProps) {
  const colors = TONE_COLORS[tone];

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-2 ${className}`}
        style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.3 }}
      >
        <span
          className="inline-flex items-center justify-center rounded-full shrink-0"
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: colors.bg,
            color: colors.fg,
          }}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={icon} style={{ fontSize: '10px' }} />
        </span>
        <span className="font-medium text-ink">{label}</span>
      </span>
    );
  }

  if (variant === 'shield') {
    return (
      <div
        className={`relative rounded-2xl bg-card overflow-hidden ${className}`}
        style={{
          border: '0.5px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          padding: '14px 16px',
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="inline-flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: colors.bg,
              color: colors.fg,
            }}
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={icon} style={{ fontSize: '14px' }} />
          </span>
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-ink"
              style={{ fontSize: '13.5px', letterSpacing: '-0.005em', lineHeight: 1.35 }}
            >
              {label}
            </p>
            {description && (
              <p
                style={{
                  fontSize: '12.5px',
                  color: '#64748B',
                  lineHeight: 1.45,
                  marginTop: '2px',
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // default
  return (
    <div
      className={`flex items-start gap-3 ${className}`}
      style={{ minHeight: '44px' }}
    >
      <span
        className="inline-flex items-center justify-center rounded-xl shrink-0"
        style={{
          width: '38px',
          height: '38px',
          backgroundColor: colors.bg,
          color: colors.fg,
        }}
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={icon} style={{ fontSize: '15px' }} />
      </span>
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className="font-semibold text-ink"
          style={{ fontSize: '13.5px', letterSpacing: '-0.005em', lineHeight: 1.3 }}
        >
          {label}
        </p>
        {description && (
          <p
            style={{
              fontSize: '12.5px',
              color: '#64748B',
              lineHeight: 1.45,
              marginTop: '2px',
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// TrustBadgeBar — row of multiple badges
// ============================================================================

export interface TrustBadgeBarBadge {
  icon: IconDefinition;
  label: string;
  description?: string;
  tone?: Tone;
}

export interface TrustBadgeBarProps {
  badges: TrustBadgeBarBadge[];
  /** Visual style of the wrapper */
  surface?: 'plain' | 'card' | 'soft';
  /** Eyebrow label above the bar (optional) */
  eyebrow?: string;
  /** Optional title / heading */
  title?: ReactNode;
  className?: string;
  /** Variant for child badges (defaults to 'default') */
  badgeVariant?: 'default' | 'compact';
  /** Animate on viewport entry */
  animate?: boolean;
}

export function TrustBadgeBar({
  badges,
  surface = 'plain',
  eyebrow,
  title,
  className = '',
  badgeVariant = 'default',
  animate = true,
}: TrustBadgeBarProps) {
  const surfaceStyle =
    surface === 'card'
      ? {
          backgroundColor: '#ffffff',
          border: '0.5px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        }
      : surface === 'soft'
      ? {
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F4F7FE 100%)',
          border: '0.5px solid #E2E8F0',
        }
      : {};

  const padding =
    surface === 'plain' ? '' : 'px-5 py-5 sm:px-7 sm:py-6 rounded-2xl';

  // Mobile : grid 2 cols (4 badges -> 2x2). Desktop : grid 4 cols (or N).
  const cols = badges.length;
  const desktopColsClass =
    cols === 2 ? 'sm:grid-cols-2' : cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4';

  // Animation : on a vire framer-motion (40 KB gzip economises sur homepage —
  // audit bundle 2026-05-05). Le fade-in est realise via CSS keyframes + le
  // helper Tailwind `animate-fade-in-up` (defini dans tailwind.config.js).
  const animationClass = animate ? 'animate-fade-in-up' : '';

  return (
    <div className={`${padding} ${animationClass} ${className}`} style={surfaceStyle}>
      {(eyebrow || title) && (
        <div className="text-center mb-5">
          {eyebrow && (
            <p
              className="text-[11px] font-bold uppercase mb-1.5"
              style={{ letterSpacing: '0.1em', color: '#94a3b8' }}
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h3
              className="font-semibold text-ink"
              style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)', letterSpacing: '-0.01em' }}
            >
              {title}
            </h3>
          )}
        </div>
      )}

      <div
        className={`grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-5 ${desktopColsClass}`}
      >
        {badges.map((b, i) => (
          <TrustBadge
            key={i}
            icon={b.icon}
            label={b.label}
            description={b.description}
            tone={b.tone}
            variant={badgeVariant}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// TrustBadgeShield — compact 3-up row dedicated to checkout reassurance.
// ============================================================================

export interface TrustBadgeShieldProps {
  className?: string;
  /** Set false to hide the satisfait-rembourse pill (free flows) */
  withGuarantee?: boolean;
}

export function TrustBadgeShield({
  className = '',
  withGuarantee = true,
}: TrustBadgeShieldProps) {
  const items: Array<{ icon: IconDefinition; label: string }> = [
    { icon: faLock, label: 'Stripe' },
    { icon: faShieldHalved, label: 'SSL chiffré' },
  ];
  if (withGuarantee) {
    items.push({ icon: faRotateLeft, label: 'Satisfait ou remboursé' });
  }

  return (
    <div
      className={`relative rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F4F7FE 100%)',
        border: '0.5px solid #E2E8F0',
        padding: '12px 16px',
      }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {items.map((it, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2"
            style={{ fontSize: '12px', color: '#475569', lineHeight: 1.2 }}
          >
            <span
              className="inline-flex items-center justify-center rounded-full shrink-0"
              style={{
                width: '22px',
                height: '22px',
                backgroundColor: '#ffffff',
                color: '#3B5BDB',
                border: '0.5px solid #E2E8F0',
              }}
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={it.icon} style={{ fontSize: '10px' }} />
            </span>
            <span className="font-medium text-ink">{it.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Presets — strings francais ready-to-use, evitent que chaque page reinvente
// le copy. Modifier ici = changer partout.
// ============================================================================

export const TRUST_BADGES = {
  guideSince2020: {
    icon: faMapLocationDot,
    label: 'Depuis 2020',
    description: 'Guide francophone Philippines',
    tone: 'primary' as const,
  },
  travelers: {
    icon: faUsers,
    label: '+10 000 voyageurs',
    description: 'déjà accompagnés',
    tone: 'accent' as const,
  },
  securePayment: {
    icon: faShieldHalved,
    label: 'Paiement sécurisé',
    description: 'Stripe + SSL chiffré',
    tone: 'primary' as const,
  },
  guarantee: {
    icon: faRotateLeft,
    label: 'Satisfait ou remboursé',
    description: 'sous 7 jours',
    tone: 'success' as const,
  },
  support: {
    icon: faEnvelopeOpenText,
    label: 'Support réactif',
    description: 'Réponse sous 48h',
    tone: 'primary' as const,
  },
} satisfies Record<string, TrustBadgeBarBadge>;

// Combinaisons pre-configurees
export const HOMEPAGE_TRUST_BADGES: TrustBadgeBarBadge[] = [
  TRUST_BADGES.guideSince2020,
  TRUST_BADGES.travelers,
  TRUST_BADGES.securePayment,
  TRUST_BADGES.support,
];

export const PRICING_TRUST_BADGES: TrustBadgeBarBadge[] = [
  TRUST_BADGES.securePayment,
  TRUST_BADGES.guarantee,
  TRUST_BADGES.support,
];
