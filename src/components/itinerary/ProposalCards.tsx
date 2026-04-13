'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Check, Sparkles } from 'lucide-react';
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
  relax: { label: 'Relax', color: 'bg-teal-500', lightBg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  balanced: { label: 'Equilibre', color: 'bg-emerald-500', lightBg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  adventure: { label: 'Aventure', color: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
} as const;

export function ProposalCards({ previews, selectedVariant, recommendedVariant, onSelect }: ProposalCardsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Choisissez Votre Itineraire</h2>
      <p className="text-muted-foreground mb-8">3 propositions adaptees a vos preferences. Selectionnez celle qui vous plait !</p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
              className={`
                bg-card rounded-2xl cursor-pointer transition-all duration-200 relative
                shadow-lg border
                ${isSelected
                  ? 'border-primary ring-4 ring-primary/20'
                  : 'border-border hover:border-primary/40 hover:shadow-xl'
                }
              `}
            >
              {/* Recommended badge — inside the card, clean */}
              {isRecommended && (
                <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-t-2xl flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommande pour vous
                </div>
              )}

              <div className={`p-6 ${isRecommended ? '' : 'pt-6'}`}>
                {/* Variant badge + check */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.lightBg} ${config.text}`}>
                    <span className={`w-2 h-2 rounded-full ${config.color}`} />
                    {config.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </div>

                {/* Title & description */}
                <h3 className="text-lg font-bold text-foreground mb-2">{preview.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{preview.description}</p>

                {/* Highlights */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">Points forts</p>
                  <ul className="space-y-2">
                    {preview.highlights?.slice(0, 3).map((highlight, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Day preview */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">Apercu</p>
                  <div className="space-y-1.5">
                    {preview.teaser_days?.map((day) => (
                      <p key={day.day} className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Jour {day.day} :</span> {day.summary}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-2">... et plus encore apres deblocage</p>
                </div>

                {/* Budget */}
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-lg font-bold text-primary">{preview.budget_estimate}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
