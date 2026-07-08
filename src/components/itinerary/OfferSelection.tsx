'use client';

import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faStar, faCrown, faArrowRight, faLock } from '@fortawesome/free-solid-svg-icons';
import { Check, AlertTriangle, Infinity, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TrustBadgeBar, PRICING_TRUST_BADGES } from '@/components/shared/TrustBadge';
import { fadeInUp, staggerContainer } from './animations';
import {
  DURATION_LABELS,
  OFFER_LABELS,
  MODIFICATION_PRICES,
  formatPrice,
  type Duration,
  type OfferType,
} from '@/config/itinerary-pricing';

interface OfferSelectionProps {
  selectedOffer: OfferType;
  onSelectOffer: (offer: OfferType) => void;
  currentPricing: Record<OfferType, { price: number; modifications: number }>;
  duration: Duration;
  onPayment: (offer: OfferType) => void;
}

// Icon/badge tints are self-contained chips (own bg + readable text), so they
// hold up in light and dark. Everything else is driven by semantic tokens.
const OFFER_CONFIG = {
  express: { icon: faRocket, iconBg: '#F4F7FE', iconColor: '#3B5BDB', badgeBg: '#F4F7FE', badgeColor: '#3B5BDB' },
  premium: { icon: faStar, iconBg: '#FEF3C7', iconColor: '#B45309', badgeBg: '#FEF3C7', badgeColor: '#B45309' },
  conciergerie: { icon: faCrown, iconBg: '#F3E8FF', iconColor: '#7E22CE', badgeBg: '#F3E8FF', badgeColor: '#7E22CE' },
} as const;

const OFFER_ORDER: OfferType[] = ['express', 'premium', 'conciergerie'];

const microLabel: CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'hsl(var(--muted-foreground))',
};

export function OfferSelection({ selectedOffer, onSelectOffer, currentPricing, duration, onPayment }: OfferSelectionProps) {
  return (
    <div id="offer-selection" className="mt-10 scroll-mt-32">
      <h3 className="mb-2 text-center text-xl font-bold text-foreground">
        Choisissez votre formule
      </h3>
      <p className="mb-8 text-center text-muted-foreground">
        Pour un sejour de <span className="font-semibold text-primary">{DURATION_LABELS[duration]}</span>
      </p>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        role="radiogroup"
        aria-label="Choix de la formule"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {OFFER_ORDER.map((offerKey) => {
          const offer = OFFER_LABELS[offerKey];
          const pricing = currentPricing[offerKey];
          const config = OFFER_CONFIG[offerKey];
          const isSelected = selectedOffer === offerKey;
          const isPremium = offerKey === 'premium';

          return (
            <motion.div
              key={offerKey}
              variants={fadeInUp}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectOffer(offerKey)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectOffer(offerKey);
                }
              }}
              className="relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-card transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{
                border: isSelected ? '1.5px solid hsl(var(--primary))' : '0.5px solid hsl(var(--border))',
                boxShadow: isSelected ? '0 8px 24px hsl(var(--primary) / 0.18)' : '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {isPremium && (
                <div
                  className="flex items-center justify-center gap-1.5 py-2 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  Recommandé
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-flex items-center justify-center rounded-xl"
                      style={{ width: '36px', height: '36px', backgroundColor: config.iconBg, color: config.iconColor }}
                      aria-hidden="true"
                    >
                      <FontAwesomeIcon icon={config.icon} style={{ fontSize: '14px' }} />
                    </span>
                    <span className="text-foreground" style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em' }}>
                      {offer.name}
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center rounded px-2 py-0.5"
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      backgroundColor: config.badgeBg,
                      color: config.badgeColor,
                    }}
                  >
                    {offer.badge}
                  </span>
                </div>

                <p style={{ ...microLabel, marginBottom: '2px' }}>Prix</p>
                <p
                  className="mb-1 tabular-nums text-primary"
                  style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}
                >
                  {pricing.price > 0 ? formatPrice(pricing.price) : 'Sur devis'}
                </p>
                <p className="mb-5 mt-2 text-[13px] leading-[1.55] text-muted-foreground">
                  {offer.description}
                </p>

                <ul className="mb-6 flex-1 space-y-2.5 border-t border-border pt-5">
                  {offer.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-foreground/80">
                      <span
                        className="mt-0.5 inline-flex flex-shrink-0 items-center justify-center rounded-full"
                        style={{ width: '16px', height: '16px', backgroundColor: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}
                        aria-hidden="true"
                      >
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border pt-4">
                  {pricing.modifications === 0 ? (
                    <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive/60" />
                      Aucune modification incluse
                    </p>
                  ) : pricing.modifications === -1 ? (
                    <p className="flex items-center gap-2 text-[12px] font-semibold text-primary">
                      <Infinity className="h-3.5 w-3.5" />
                      Modifications illimitées
                    </p>
                  ) : (
                    <p className="flex items-center gap-2 text-[12px] font-semibold text-primary">
                      <Check className="h-3.5 w-3.5" />
                      {pricing.modifications} modification{pricing.modifications > 1 ? 's' : ''} incluse{pricing.modifications > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Modifications supplementaires */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-card-rest">
        <p className="text-center text-[13px] leading-[1.55] text-muted-foreground">
          <strong className="text-foreground">Besoin de plus de modifications ?</strong> Ajoutez-en à tout moment :
          {Object.entries(MODIFICATION_PRICES).map(([key, value], idx) => (
            <span key={key}>
              {idx > 0 && ' |'} {value.description}{' '}
              <strong className="tabular-nums text-foreground">{formatPrice(value.price)}</strong>
            </span>
          ))}
        </p>
      </div>

      {/* Trust signals — last-mile anxiety reducer juste avant le CTA paiement.
          3 badges : Stripe + garantie 7j + support 48h. */}
      <div className="mt-6">
        <TrustBadgeBar
          badges={PRICING_TRUST_BADGES}
          surface="soft"
          badgeVariant="default"
        />
      </div>

      {/* Bouton de paiement */}
      <div className="mt-8 text-center">
        <Button
          onClick={() => onPayment(selectedOffer)}
          size="lg"
          className="h-auto px-10 py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] motion-reduce:hover:scale-100"
        >
          <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
          {currentPricing[selectedOffer].price > 0
            ? `Debloquer pour ${formatPrice(currentPricing[selectedOffer].price)}`
            : 'Demander un devis'
          }
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <FontAwesomeIcon icon={faLock} className="text-[10px]" />
          Paiement securise par Stripe • Livraison par email en quelques minutes
        </p>
      </div>
    </div>
  );
}
