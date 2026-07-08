'use client';

import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
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

// Category chips are self-contained (own tint + readable text), so they hold in
// both light and dark. Everything else on the card is driven by semantic tokens.
const VARIANT_CONFIG = {
  relax: { label: 'Relax', dot: '#14B8A6', bg: '#F0FDFA', color: '#0F766E' },
  balanced: { label: 'Equilibre', dot: '#10B981', bg: '#ECFDF5', color: '#047857' },
  adventure: { label: 'Aventure', dot: '#F59E0B', bg: '#FEF3C7', color: '#B45309' },
} as const;

// Small labels reused across the card (uppercase micro-headers).
const microLabel: CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'hsl(var(--muted-foreground))',
};

export function ProposalCards({ previews, selectedVariant, recommendedVariant, onSelect }: ProposalCardsProps) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Choisissez Votre Itineraire</h2>
      <p className="mb-8 text-muted-foreground">3 propositions adaptees a vos preferences. Selectionnez celle qui vous plait !</p>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault(); // Espace ne doit pas scroller la page
                  onSelect(preview.variant);
                }
              }}
              variants={fadeInUp}
              className="relative cursor-pointer overflow-hidden rounded-2xl bg-card transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{
                border: isSelected ? '1.5px solid hsl(var(--primary))' : '0.5px solid hsl(var(--border))',
                boxShadow: isSelected
                  ? '0 8px 24px hsl(var(--primary) / 0.18)'
                  : '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {isRecommended && (
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
                  Recommandé pour vous
                </div>
              )}

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{
                      backgroundColor: config.bg,
                      color: config.color,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.dot }} />
                    {config.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </motion.div>
                  )}
                </div>

                <h3
                  className="mb-2 text-foreground"
                  style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}
                >
                  {preview.title}
                </h3>
                <p className="mb-5 text-[13px] leading-[1.55] text-muted-foreground">
                  {preview.description}
                </p>

                <div className="mb-5">
                  <p className="mb-2.5" style={microLabel}>
                    Points forts
                  </p>
                  <ul className="space-y-2">
                    {preview.highlights?.slice(0, 3).map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[13px] leading-[1.5] text-foreground/80">
                        <span
                          className="mt-0.5 inline-flex flex-shrink-0 items-center justify-center rounded-full"
                          style={{ width: '16px', height: '16px', backgroundColor: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}
                          aria-hidden="true"
                        >
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="mb-2.5" style={microLabel}>
                    Aperçu
                  </p>
                  <div className="space-y-1.5">
                    {preview.teaser_days?.slice(0, 2).map((day) => (
                      <p key={day.day} className="text-[13px] leading-[1.5] text-muted-foreground">
                        <span className="font-semibold text-foreground">Jour {day.day} :</span> {day.summary}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] italic text-muted-foreground">
                    … et plus encore après déblocage
                  </p>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <p style={{ ...microLabel, letterSpacing: '0.06em', fontWeight: 600, marginBottom: '2px' }}>
                    Budget estimé
                  </p>
                  <p
                    className="tabular-nums text-primary"
                    style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1 }}
                  >
                    {preview.budget_estimate}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
