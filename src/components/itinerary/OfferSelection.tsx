'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faStar, faCrown, faArrowRight, faLock } from '@fortawesome/free-solid-svg-icons';
import { Check, AlertTriangle, Infinity, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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

const OFFER_CONFIG = {
  express: { icon: faRocket, iconBg: '#F4F7FE', iconColor: '#3B5BDB', badgeBg: '#F4F7FE', badgeColor: '#3B5BDB' },
  premium: { icon: faStar, iconBg: '#FEF3C7', iconColor: '#F59E0B', badgeBg: '#FEF3C7', badgeColor: '#B45309' },
  conciergerie: { icon: faCrown, iconBg: '#F3E8FF', iconColor: '#A855F7', badgeBg: '#F3E8FF', badgeColor: '#7E22CE' },
} as const;

const OFFER_ORDER: OfferType[] = ['express', 'premium', 'conciergerie'];

export function OfferSelection({ selectedOffer, onSelectOffer, currentPricing, duration, onPayment }: OfferSelectionProps) {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-foreground mb-2 text-center">
        Choisissez votre formule
      </h3>
      <p className="text-muted-foreground text-center mb-8">
        Pour un sejour de <span className="font-semibold text-primary">{DURATION_LABELS[duration]}</span>
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
              onClick={() => onSelectOffer(offerKey)}
              className="bg-card rounded-2xl cursor-pointer transition-all duration-200 relative flex flex-col overflow-hidden hover:-translate-y-1"
              style={{
                border: isSelected ? '1.5px solid #3B5BDB' : '0.5px solid #e5e7eb',
                boxShadow: isSelected ? '0 8px 24px rgba(59,91,219,0.15)' : '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              {isPremium && (
                <div
                  className="flex items-center justify-center gap-1.5 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  Recommandé
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-3 mb-4">
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
                    className="inline-flex items-center px-2 py-0.5 rounded"
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

                <p
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                  }}
                >
                  Prix
                </p>
                <p
                  className="text-foreground tabular-nums mb-1"
                  style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: '#3B5BDB' }}
                >
                  {pricing.price > 0 ? formatPrice(pricing.price) : 'Sur devis'}
                </p>
                <p className="mb-5 mt-2" style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}>
                  {offer.description}
                </p>

                <ul className="space-y-2.5 mb-6 flex-1 pt-5" style={{ borderTop: '0.5px solid #f1f5f9' }}>
                  {offer.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5" style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                      <span
                        className="flex-shrink-0 inline-flex items-center justify-center rounded-full mt-0.5"
                        style={{ width: '16px', height: '16px', backgroundColor: '#F4F7FE', color: '#3B5BDB' }}
                        aria-hidden="true"
                      >
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4" style={{ borderTop: '0.5px solid #f1f5f9' }}>
                  {pricing.modifications === 0 ? (
                    <p className="flex items-center gap-2" style={{ fontSize: '12px', color: '#94a3b8' }}>
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive/60" />
                      Aucune modification incluse
                    </p>
                  ) : pricing.modifications === -1 ? (
                    <p className="flex items-center gap-2" style={{ fontSize: '12px', color: '#3B5BDB', fontWeight: 600 }}>
                      <Infinity className="w-3.5 h-3.5" />
                      Modifications illimitées
                    </p>
                  ) : (
                    <p className="flex items-center gap-2" style={{ fontSize: '12px', color: '#3B5BDB', fontWeight: 600 }}>
                      <Check className="w-3.5 h-3.5" />
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
      <div
        className="mt-6 p-4 bg-card rounded-2xl"
        style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
      >
        <p className="text-center" style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}>
          <strong className="text-foreground">Besoin de plus de modifications ?</strong> Ajoutez-en à tout moment :
          {Object.entries(MODIFICATION_PRICES).map(([key, value], idx) => (
            <span key={key}>
              {idx > 0 && ' |'} {value.description}{' '}
              <strong className="text-foreground tabular-nums">{formatPrice(value.price)}</strong>
            </span>
          ))}
        </p>
      </div>

      {/* Bouton de paiement */}
      <div className="mt-8 text-center">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
          <Button
            onClick={() => onPayment(selectedOffer)}
            size="lg"
            className="px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all h-auto"
          >
            <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
            {currentPricing[selectedOffer].price > 0
              ? `Debloquer pour ${formatPrice(currentPricing[selectedOffer].price)}`
              : 'Demander un devis'
            }
          </Button>
        </motion.div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
          <FontAwesomeIcon icon={faLock} className="text-[10px]" />
          Paiement securise par Stripe • Livraison instantanee par email
        </p>
      </div>
    </div>
  );
}
