'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faArrowRight,
  faCrown,
  faRocket,
  faStar,
  faLock,
  faShieldHalved,
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
    'Aucune modification après livraison',
    'Aucun suivi personnalisé',
    'Pas d’échange préalable avec un humain',
    'Aucune réservation faite à votre place',
  ],
  premium: [
    'Aucune réservation faite à votre place',
    'Pas d’appel téléphonique inclus',
  ],
  conciergerie: [
    'Aucune réservation faite à votre place (mais nous vous accompagnons pour les choix)',
  ],
};

const OFFER_ICONS: Record<OfferType, typeof faRocket> = {
  express: faRocket,
  premium: faStar,
  conciergerie: faCrown,
};

// Mini icone check inline (style ItineraireIABlock — coherent avec la home)
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// Mini icone croix inline pour "non inclus" — moins agressif que faTimesCircle
const MinusIcon = ({ className = '' }: { className?: string }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M5 12h14" />
  </svg>
);

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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto">
          <motion.div
            variants={modalOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-ink/70 backdrop-blur-md"
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
            className="relative bg-card w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl overflow-hidden my-0 sm:my-8 flex flex-col max-h-[95vh] sm:max-h-[92vh]"
            style={{
              boxShadow:
                '0 24px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 0.5px rgba(15, 23, 42, 0.08)',
            }}
          >
            {/* ============ HEADER GRADIENT (style ItineraireIABlock) ============ */}
            <div
              className="relative overflow-hidden text-white px-6 sm:px-8 pt-7 pb-6"
              style={{
                background:
                  'linear-gradient(135deg, #3B5BDB 0%, #1e40af 100%)',
              }}
            >
              {/* Cercles decoratifs dashed — exact pattern home */}
              <span
                className="absolute pointer-events-none rounded-full"
                style={{
                  width: '260px',
                  height: '260px',
                  top: '-110px',
                  right: '-90px',
                  border: '2px dashed rgba(255, 255, 255, 0.13)',
                }}
                aria-hidden="true"
              />
              <span
                className="absolute pointer-events-none rounded-full"
                style={{
                  width: '160px',
                  height: '160px',
                  bottom: '-70px',
                  left: '-50px',
                  border: '2px dashed rgba(255, 255, 255, 0.13)',
                }}
                aria-hidden="true"
              />

              {/* Bouton fermer */}
              <button
                onClick={handleClose}
                aria-label="Fermer"
                className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 z-10"
              >
                <FontAwesomeIcon icon={faTimes} className="text-white/85 text-sm" />
              </button>

              {/* Eyebrow */}
              <div className="relative">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase mb-3"
                  style={{
                    letterSpacing: '0.08em',
                    color: 'rgba(255, 255, 255, 0.78)',
                  }}
                >
                  <span className="text-accent" aria-hidden="true">✦</span>
                  Récapitulatif de votre commande
                </span>

                {/* Titre offre */}
                <div className="flex items-start gap-3.5 pr-10">
                  <span
                    className="inline-flex items-center justify-center rounded-2xl shrink-0"
                    style={{
                      width: '46px',
                      height: '46px',
                      backgroundColor: 'rgba(255, 255, 255, 0.13)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                    }}
                    aria-hidden="true"
                  >
                    <FontAwesomeIcon
                      icon={OFFER_ICONS[offer]}
                      className="text-accent"
                      style={{ fontSize: '17px' }}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2
                      id="offer-confirmation-title"
                      className="text-white font-semibold mb-0.5"
                      style={{
                        fontSize: 'clamp(1.375rem, 3vw, 1.625rem)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                      }}
                    >
                      Offre {offerLabel.name}
                    </h2>
                    <p
                      className="text-[13.5px]"
                      style={{ color: 'rgba(255, 255, 255, 0.78)' }}
                    >
                      Séjour de {durationLabel} · {offerLabel.description}
                    </p>
                  </div>
                </div>

                {/* Prix - bandeau separe pour focus visuel.
                    Stack vertical : eyebrow -> prix (avec sub-label inline en baseline).
                    Evite les 3 alignements concurrents qui cassaient la hierarchie. */}
                <div
                  className="mt-5 pt-4"
                  style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.18)' }}
                >
                  <div
                    className="text-[10.5px] font-bold uppercase mb-1.5"
                    style={{
                      letterSpacing: '0.1em',
                      color: 'rgba(255, 255, 255, 0.65)',
                    }}
                  >
                    Total à régler
                  </div>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span
                      className="text-accent font-bold tabular-nums"
                      style={{
                        fontSize: 'clamp(2rem, 5.5vw, 2.5rem)',
                        letterSpacing: '-0.025em',
                        lineHeight: 1,
                      }}
                    >
                      {formatPrice(pricing.price)}
                    </span>
                    <span
                      className="text-[12.5px]"
                      style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      paiement unique · sans engagement
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============ BODY SCROLLABLE ============ */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              {/* Bandeau positionnement — design subtil, integre, pas un encart bleu agressif */}
              <div
                className="relative rounded-2xl px-4 py-3.5 flex items-start gap-3"
                style={{
                  background: 'linear-gradient(135deg, #FFF8EC 0%, #FFFBF2 100%)',
                  border: '0.5px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <span
                  className="inline-flex items-center justify-center rounded-full shrink-0 mt-0.5"
                  style={{
                    width: '26px',
                    height: '26px',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#B45309',
                  }}
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '11px' }} />
                </span>
                <p
                  className="text-[13px] leading-[1.55]"
                  style={{ color: '#5C2D0C' }}
                >
                  <strong className="font-semibold text-ink">
                    Philippin&apos;Easy est un guide francophone, pas une agence de voyage.
                  </strong>{' '}
                  Nous vous accompagnons pour préparer votre voyage en toute autonomie : nous ne
                  réservons rien à votre place et ne sommes pas responsables des disponibilités
                  des hébergements, vols ou activités suggérés.
                </p>
              </div>

              {/* Sections inclus / non inclus en grid 2 cols sur desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Ce qui est inclus */}
                <section>
                  <h3
                    className="flex items-center gap-2 mb-3"
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#0F172A',
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center rounded-full"
                      style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#F4F7FE',
                        color: '#3B5BDB',
                      }}
                      aria-hidden="true"
                    >
                      <CheckIcon />
                    </span>
                    Ce qui est inclus
                  </h3>
                  <ul className="space-y-2">
                    {offerLabel.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5"
                        style={{
                          fontSize: '13.5px',
                          color: '#334155',
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          className="flex-shrink-0 inline-flex items-center justify-center rounded-full mt-[3px]"
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#F4F7FE',
                            color: '#3B5BDB',
                          }}
                          aria-hidden="true"
                        >
                          <CheckIcon />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {pricing.modifications > 0 && (
                      <li
                        className="flex items-start gap-2.5"
                        style={{
                          fontSize: '13.5px',
                          color: '#334155',
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          className="flex-shrink-0 inline-flex items-center justify-center rounded-full mt-[3px]"
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#F4F7FE',
                            color: '#3B5BDB',
                          }}
                          aria-hidden="true"
                        >
                          <CheckIcon />
                        </span>
                        <span>
                          <strong className="font-semibold text-ink">
                            {pricing.modifications} modification
                            {pricing.modifications > 1 ? 's' : ''} gratuite
                            {pricing.modifications > 1 ? 's' : ''}
                          </strong>{' '}
                          incluse{pricing.modifications > 1 ? 's' : ''}
                        </span>
                      </li>
                    )}
                  </ul>
                </section>

                {/* Ce qui n'est PAS inclus */}
                <section>
                  <h3
                    className="flex items-center gap-2 mb-3"
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#64748b',
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center rounded-full"
                      style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#F1F5F9',
                        color: '#94a3b8',
                      }}
                      aria-hidden="true"
                    >
                      <MinusIcon />
                    </span>
                    Non inclus
                  </h3>
                  <ul className="space-y-2">
                    {NOT_INCLUDED[offer].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5"
                        style={{
                          fontSize: '13.5px',
                          color: '#64748b',
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          className="flex-shrink-0 inline-flex items-center justify-center rounded-full mt-[3px]"
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#F1F5F9',
                            color: '#94a3b8',
                          }}
                          aria-hidden="true"
                        >
                          <MinusIcon />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Upsell soft — design jaune doux coherent avec accent home */}
              {upsellOffer && onSelectOtherOffer && (
                <motion.button
                  type="button"
                  onClick={() => onSelectOtherOffer(upsellOffer)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left rounded-2xl pl-4 pr-5 py-4 group transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  style={{
                    background: 'linear-gradient(135deg, #FEF9E7 0%, #FFFCEF 100%)',
                    border: '0.5px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex items-center justify-center rounded-xl shrink-0"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#F59E0B',
                        color: '#1a1a00',
                      }}
                      aria-hidden="true"
                    >
                      <FontAwesomeIcon
                        icon={OFFER_ICONS[upsellOffer]}
                        style={{ fontSize: '14px' }}
                      />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold mb-0.5 text-ink flex items-center gap-2 flex-wrap"
                        style={{ fontSize: '14px', letterSpacing: '-0.01em' }}
                      >
                        Passer en {OFFER_LABELS[upsellOffer].name}
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tabular-nums"
                          style={{
                            letterSpacing: '0.05em',
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            color: '#92400E',
                          }}
                        >
                          dès {formatPrice(PRICING_GRID[upsellOffer][duration].price)}
                        </span>
                      </p>
                      <p
                        className="text-[13px]"
                        style={{ color: '#78350F', lineHeight: 1.5 }}
                      >
                        {upsellOffer === 'premium'
                          ? 'Modifications gratuites incluses + support email personnalisé sous 48h.'
                          : 'Échange préalable + WhatsApp direct + suivi humain personnalisé.'}
                      </p>
                    </div>
                    <span
                      className="text-accent text-base shrink-0 mt-2 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </motion.button>
              )}

              {/* Consentement — checkbox custom */}
              <label
                className="flex items-start gap-3 cursor-pointer rounded-2xl p-4 transition-colors group"
                style={{
                  backgroundColor: consentChecked
                    ? 'rgba(59, 91, 219, 0.04)'
                    : '#F8FAFC',
                  border: consentChecked
                    ? '0.5px solid rgba(59, 91, 219, 0.35)'
                    : '0.5px solid #e5e7eb',
                }}
              >
                <span className="relative flex items-center justify-center mt-[2px] shrink-0">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="peer sr-only"
                    aria-describedby="consent-text"
                  />
                  <span
                    className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-md transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: consentChecked ? '#3B5BDB' : '#ffffff',
                      border: consentChecked
                        ? '1px solid #3B5BDB'
                        : '1.5px solid #cbd5e1',
                    }}
                  >
                    {consentChecked && <CheckIcon className="text-white" />}
                  </span>
                </span>
                <span
                  id="consent-text"
                  className="text-[13.5px] leading-[1.55]"
                  style={{ color: '#334155' }}
                >
                  J&apos;ai bien compris ce que comprend l&apos;offre{' '}
                  <strong className="font-semibold text-ink">
                    {offerLabel.name}
                  </strong>{' '}
                  et j&apos;accepte que Philippin&apos;Easy soit un guide
                  d&apos;accompagnement, pas une agence de voyage.
                </span>
              </label>
            </div>

            {/* ============ FOOTER CTA — sticky bas, style home (orange brand)
                Structure :
                - Row 1 : Annuler (gauche) | Bouton CTA (droite) — symetrique
                - Row 2 : trust signal centre, pleine largeur, sous tout le footer
                Evite l'asymetrie precedente ou le sub-label etait colle au bouton droit. */}
            <div
              className="px-6 sm:px-8 pt-4 pb-3.5 bg-card"
              style={{ borderTop: '0.5px solid #e5e7eb' }}
            >
              <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[13.5px] font-medium text-muted-foreground hover:text-ink transition-colors py-2 sm:py-0 sm:px-2 focus-visible:outline-none focus-visible:underline self-center sm:self-auto"
                >
                  Annuler
                </button>

                <motion.div
                  whileHover={consentChecked ? { scale: 1.01 } : undefined}
                  whileTap={consentChecked ? { scale: 0.99 } : undefined}
                  className="w-full sm:w-auto"
                >
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!consentChecked}
                    className="w-full sm:w-auto h-12 px-6 inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-[15px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    style={{
                      backgroundColor: consentChecked ? '#F59E0B' : '#E2E8F0',
                      color: consentChecked ? '#1a1a00' : '#94a3b8',
                      boxShadow: consentChecked
                        ? '0 10px 30px rgba(245, 158, 11, 0.35)'
                        : 'none',
                      letterSpacing: '-0.005em',
                    }}
                  >
                    Continuer vers le paiement
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      style={{ fontSize: '13px' }}
                    />
                  </Button>
                </motion.div>
              </div>

              {/* Trust signal — pleine largeur centre, sous les boutons */}
              <p
                className="text-[11.5px] flex items-center justify-center gap-1.5 mt-3"
                style={{ color: '#94a3b8' }}
              >
                <FontAwesomeIcon icon={faLock} style={{ fontSize: '9px' }} />
                Paiement sécurisé par Stripe · SSL chiffré
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
