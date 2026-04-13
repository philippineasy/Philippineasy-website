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
  express: { icon: faRocket, color: 'text-blue-500', accentBg: 'bg-blue-50', accentText: 'text-blue-700' },
  premium: { icon: faStar, color: 'text-yellow-500', accentBg: 'bg-yellow-50', accentText: 'text-yellow-700' },
  conciergerie: { icon: faCrown, color: 'text-purple-500', accentBg: 'bg-purple-50', accentText: 'text-purple-700' },
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
              className={`
                bg-card rounded-2xl cursor-pointer transition-all duration-200 relative flex flex-col
                shadow-lg border
                ${isSelected
                  ? 'border-primary ring-4 ring-primary/20'
                  : 'border-border hover:border-primary/40 hover:shadow-xl'
                }
              `}
            >
              {/* Recommended banner for Premium */}
              {isPremium && (
                <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-t-2xl flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommande
                </div>
              )}

              <div className={`p-6 flex flex-col flex-1 ${isPremium ? '' : 'pt-6'}`}>
                {/* Header: icon + name + badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full ${config.accentBg} flex items-center justify-center`}>
                      <FontAwesomeIcon icon={config.icon} className={`${config.color} text-sm`} />
                    </div>
                    <span className="font-bold text-lg text-foreground">{offer.name}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.accentBg} ${config.accentText}`}>
                    {offer.badge}
                  </span>
                </div>

                {/* Price */}
                <p className="text-3xl font-bold text-primary mb-1">
                  {pricing.price > 0 ? formatPrice(pricing.price) : 'Sur devis'}
                </p>
                <p className="text-sm text-muted-foreground mb-5">{offer.description}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {offer.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-foreground flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Modifications info */}
                <div className="border-t border-border pt-4">
                  {pricing.modifications === 0 ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive/60" />
                      Aucune modification incluse
                    </p>
                  ) : pricing.modifications === -1 ? (
                    <p className="text-sm text-primary font-medium flex items-center gap-2">
                      <Infinity className="w-4 h-4" />
                      Modifications illimitees
                    </p>
                  ) : (
                    <p className="text-sm text-primary font-medium flex items-center gap-2">
                      <Check className="w-4 h-4" />
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
      <div className="mt-6 p-4 bg-card rounded-xl border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Besoin de plus de modifications ?</strong> Ajoutez-en a tout moment :
          {Object.entries(MODIFICATION_PRICES).map(([key, value], idx) => (
            <span key={key}>
              {idx > 0 && ' |'} {value.description} <strong className="text-foreground">{formatPrice(value.price)}</strong>
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
