'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCoins } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer } from './animations';

interface ItineraryPreview {
  variant: 'relax' | 'balanced' | 'adventure';
  title: string;
  description: string;
  budget_estimate: string;
  highlights: string[];
  teaser_days: { day: number; summary: string }[];
}

interface ProposalCardsProps {
  previews: ItineraryPreview[];
  selectedVariant: string | null;
  recommendedVariant: string | null;
  onSelect: (variant: string) => void;
}

const VARIANT_CONFIG = {
  relax: { label: 'Relax', badge: 'relax' as const, borderColor: 'border-l-teal-400' },
  balanced: { label: 'Equilibre', badge: 'balanced' as const, borderColor: 'border-l-emerald-400' },
  adventure: { label: 'Aventure', badge: 'adventure' as const, borderColor: 'border-l-amber-400' },
} as const;

export function ProposalCards({ previews, selectedVariant, recommendedVariant, onSelect }: ProposalCardsProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Choisissez Votre Itineraire :</h2>
      <p className="text-muted-foreground mb-6">3 propositions adaptees a vos preferences. Selectionnez celle qui vous plait !</p>

      <motion.div
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:snap-none md:pb-0 mt-6"
        role="radiogroup"
        aria-label="Choix de l'itineraire"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {previews.map((preview) => {
          const config = VARIANT_CONFIG[preview.variant];
          const isSelected = selectedVariant === preview.variant;
          const isRecommended = recommendedVariant === preview.variant;

          return (
            <motion.div
              key={preview.variant}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelect(preview.variant)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(preview.variant)}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`
                min-w-[280px] snap-center md:min-w-0
                bg-card/80 backdrop-blur-sm p-6 rounded-2xl cursor-pointer transition-all duration-300 relative
                shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                ${isSelected
                  ? 'ring-2 ring-primary/40 border border-primary shadow-[0_4px_16px_rgba(74,127,214,0.15)]'
                  : 'border border-border/50 hover:border-primary/30'
                }
              `}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge variant="recommended" className="px-4 py-1 shadow-sm">
                    Recommande pour vous
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between mb-3 mt-3">
                <Badge variant={config.badge}>{config.label}</Badge>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <FontAwesomeIcon icon={faCheck} className="text-primary" />
                  </motion.span>
                )}
              </div>

              <h3 className="text-lg font-bold mb-2">{preview.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{preview.description}</p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground/70 mb-2">Points forts :</p>
                <ul className="space-y-1">
                  {preview.highlights?.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="text-xs text-foreground flex items-start gap-1.5">
                      <FontAwesomeIcon icon={faCheck} className="text-accent mt-0.5 text-[10px]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`border-l-2 ${config.borderColor} pl-3 pt-3 mt-3`}>
                <p className="text-xs font-semibold text-foreground/70 mb-2">Apercu :</p>
                {preview.teaser_days?.map((day) => (
                  <p key={day.day} className="text-xs text-muted-foreground mb-1">
                    <strong>Jour {day.day}:</strong> {day.summary}
                  </p>
                ))}
                <p className="text-xs text-muted-foreground italic mt-2">... et plus encore apres deblocage</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCoins} className="text-accent text-xs" />
                <p className="text-sm font-bold text-primary">{preview.budget_estimate}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
