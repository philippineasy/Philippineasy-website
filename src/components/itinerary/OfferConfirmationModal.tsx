'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCheckCircle,
  faTimesCircle,
  faArrowRight,
  faInfoCircle,
  faCrown,
  faRobot,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';
import { modalOverlay, modalContent } from './animations';
import {
  PRICING_GRID,
  OFFER_LABELS,
  DURATION_LABELS,
  formatPrice,
  type OfferType,
  type Duration,
} from '@/config/itinerary-pricing';

interface OfferConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferType;
  duration: Duration;
  /** Appelé quand l'utilisateur confirme l'achat (apres consentement explicite) */
  onConfirm: () => void;
  /** Permet de basculer vers une offre superieure depuis la modal (upsell) */
  onSelectOtherOffer?: (offer: OfferType) => void;
}

// Ce que chaque offre N'INCLUT PAS — important pour la transparence et eviter
// les disputes refunds. Hugo (memory project_philippineasy_positionnement) :
// Philippineasy est un guide, pas une agence. Pas de booking, pas de SAV agence.
const NOT_INCLUDED: Record<OfferType, string[]> = {
  express: [
    'Aucune modification apres livraison',
    'Aucun suivi personnalise',
    'Pas d\'echange prealable avec un humain',
    'Aucune reservation faite a votre place',
  ],
  premium: [
    'Aucune reservation faite a votre place',
    'Pas d\'appel telephonique inclus',
  ],
  conciergerie: [
    'Aucune reservation faite a votre place (mais nous vous accompagnons pour les choix)',
  ],
};

const OFFER_ICONS: Record<OfferType, typeof faRobot> = {
  express: faRobot,
  premium: faHeadset,
  conciergerie: faCrown,
};

export function OfferConfirmationModal({
  isOpen,
  onClose,
  offer,
  duration,
  onConfirm,
  onSelectOtherOffer,
}: OfferConfirmationModalProps) {
  const [consentChecked, setConsentChecked] = useState(false);

  const pricing = PRICING_GRID[offer]?.[duration];
  const offerLabel = OFFER_LABELS[offer];
  const durationLabel = DURATION_LABELS[duration];

  if (!pricing) return null;

  const handleConfirm = () => {
    if (!consentChecked) return;
    onConfirm();
    // reset pour reouverture propre
    setConsentChecked(false);
  };

  const handleClose = () => {
    setConsentChecked(false);
    onClose();
  };

  // Suggestions d'upsell : si Express -> propose Premium ; si Premium -> propose Conciergerie
  const upsellOffer: OfferType | null =
    offer === 'express' ? 'premium' : offer === 'premium' ? 'conciergerie' : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            variants={modalOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-confirmation-title"
            className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full border border-border/50 overflow-hidden my-8"
          >
            <button
              onClick={handleClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-xl transition-colors z-10"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Header avec gradient + icone */}
            <div className="bg-gradient-to-br from-primary/10 to-orange-500/10 px-6 pt-6 pb-5 border-b border-border/50">
              <div className="flex items-start gap-3 pr-8">
                <div className="w-11 h-11 bg-primary/15 rounded-xl flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={OFFER_ICONS[offer]} className="text-primary text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                    Recapitulatif de votre commande
                  </p>
                  <h2 id="offer-confirmation-title" className="text-xl font-bold text-foreground">
                    {offerLabel.name} &middot; {durationLabel}
                  </h2>
                  <p className="text-2xl font-bold text-primary mt-2">
                    {formatPrice(pricing.price)}
                    <span className="text-sm font-normal text-muted-foreground ml-2">paiement unique</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Body scrollable */}
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Positionnement Philippineasy */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 leading-relaxed">
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mt-0.5 shrink-0" />
                  <p>
                    <strong>Philippin&apos;Easy est un guide francophone des Philippines, pas une agence de voyage.</strong>{' '}
                    Nous vous accompagnons pour preparer votre voyage en toute autonomie : nous ne reservons
                    rien a votre place et ne sommes pas responsables des disponibilites des hebergements, vols
                    ou activites suggeres.
                  </p>
                </div>
              </div>

              {/* Ce qui est inclus */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Ce qui est inclus
                </h3>
                <ul className="space-y-2">
                  {offerLabel.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-600 mt-0.5 shrink-0"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {pricing.modifications > 0 && (
                    <li className="flex items-start gap-2 text-sm text-foreground">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-600 mt-0.5 shrink-0"
                      />
                      <span>
                        <strong>{pricing.modifications} modification{pricing.modifications > 1 ? 's' : ''} gratuite{pricing.modifications > 1 ? 's' : ''}</strong> incluse{pricing.modifications > 1 ? 's' : ''}
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Ce qui n'est PAS inclus */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Ce qui n&apos;est pas inclus
                </h3>
                <ul className="space-y-2">
                  {NOT_INCLUDED[offer].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-orange-500 mt-0.5 shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upsell soft si Express ou Premium */}
              {upsellOffer && onSelectOtherOffer && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-900 mb-3">
                    <strong>Vous voulez plus d&apos;accompagnement ?</strong> L&apos;offre{' '}
                    <strong>{OFFER_LABELS[upsellOffer].name}</strong> inclut{' '}
                    {upsellOffer === 'premium' ? 'des modifications gratuites et un support email personnalise' : 'un appel d\'echange prealable + WhatsApp direct + suivi humain'}{' '}
                    a partir de {formatPrice(PRICING_GRID[upsellOffer][duration].price)}.
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectOtherOffer(upsellOffer)}
                    className="text-sm font-semibold text-amber-900 hover:text-amber-700 underline underline-offset-2 transition-colors"
                  >
                    Voir l&apos;offre {OFFER_LABELS[upsellOffer].name} &rarr;
                  </button>
                </div>
              )}

              {/* Consentement */}
              <label className="flex items-start gap-3 cursor-pointer p-3 -mx-1 rounded-xl hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer shrink-0"
                />
                <span className="text-sm text-foreground leading-relaxed">
                  J&apos;ai bien compris ce que comprend l&apos;offre <strong>{offerLabel.name}</strong> et
                  j&apos;accepte que Philippin&apos;Easy soit un guide d&apos;accompagnement, pas une agence de voyage.
                </span>
              </label>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 sm:flex-none"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={!consentChecked}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer vers le paiement
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
