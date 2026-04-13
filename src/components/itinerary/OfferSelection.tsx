'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faStar, faCrown, faCheck, faArrowRight, faLock, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
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

const OFFER_ICONS = {
  express: { icon: faRocket, color: 'text-blue-500' },
  premium: { icon: faStar, color: 'text-yellow-500' },
  conciergerie: { icon: faCrown, color: 'text-purple-500' },
} as const;

const OFFER_ORDER: OfferType[] = ['express', 'premium', 'conciergerie'];

export function OfferSelection({ selectedOffer, onSelectOffer, currentPricing, duration, onPayment }: OfferSelectionProps) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-6 text-center">
        Choisissez votre formule pour <span className="text-primary">{DURATION_LABELS[duration]}</span>
      </h3>

      <motion.div
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:snap-none md:pb-0 mt-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {OFFER_ORDER.map((offerKey) => {
          const offer = OFFER_LABELS[offerKey];
          const pricing = currentPricing[offerKey];
          const iconConfig = OFFER_ICONS[offerKey];
          const isSelected = selectedOffer === offerKey;
          const isPremium = offerKey === 'premium';

          return (
            <motion.div
              key={offerKey}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="min-w-[280px] snap-center md:min-w-0"
            >
              <Card
                onClick={() => onSelectOffer(offerKey)}
                className={`
                  cursor-pointer transition-all duration-300 h-full relative overflow-hidden
                  ${isSelected
                    ? 'ring-2 ring-primary/40 border-primary shadow-[0_4px_16px_rgba(74,127,214,0.15)]'
                    : 'border-border/50 hover:border-primary/30 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  }
                  ${isPremium ? 'md:scale-[1.02]' : ''}
                `}
              >
                {/* Gradient bar for premium */}
                {isPremium && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
                )}

                {isPremium && (
                  <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 translate-y-3 z-10">
                    <Badge variant="recommended" className="px-4 py-1 shadow-sm">
                      Recommande
                    </Badge>
                  </div>
                )}

                <CardHeader className={`pb-2 ${isPremium ? 'pt-8' : 'pt-6'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={iconConfig.icon} className={iconConfig.color} />
                      <span className="font-bold text-lg">{offer.name}</span>
                    </div>
                    <Badge variant={offerKey === 'express' ? 'express' : offerKey === 'premium' ? 'premium' : 'conciergerie'}>
                      {offer.badge}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {pricing.price > 0 ? formatPrice(pricing.price) : 'Sur devis'}
                    </p>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                  </div>

                  <ul className="space-y-2">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FontAwesomeIcon icon={faCheck} className="text-green-600 text-[8px]" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0">
                  {pricing.modifications === 0 ? (
                    <p className="text-xs text-destructive/80 flex items-center gap-1">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                      Aucune modification incluse
                    </p>
                  ) : pricing.modifications === -1 ? (
                    <Badge variant="success">Modifications illimitees</Badge>
                  ) : (
                    <Badge variant="success">
                      {pricing.modifications} modification{pricing.modifications > 1 ? 's' : ''} incluse{pricing.modifications > 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Modifications supplementaires */}
      <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/50">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Besoin de plus de modifications ?</strong> Ajoutez-en a tout moment :
          {Object.entries(MODIFICATION_PRICES).map(([key, value], idx) => (
            <span key={key}>
              {idx > 0 && ' |'} {value.description} <strong>{formatPrice(value.price)}</strong>
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
        <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
          <FontAwesomeIcon icon={faLock} className="text-[10px]" />
          Paiement securise par Stripe • Livraison instantanee par email
        </p>
      </div>
    </div>
  );
}
