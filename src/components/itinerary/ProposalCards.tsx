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
  relax: { label: 'Relax', dot: '#14B8A6', bg: '#F0FDFA', color: '#0F766E' },
  balanced: { label: 'Equilibre', dot: '#10B981', bg: '#ECFDF5', color: '#047857' },
  adventure: { label: 'Aventure', dot: '#F59E0B', bg: '#FEF3C7', color: '#B45309' },
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
              className="bg-card rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden relative hover:-translate-y-1"
              style={{
                border: isSelected ? '1.5px solid #3B5BDB' : '0.5px solid #e5e7eb',
                boxShadow: isSelected
                  ? '0 8px 24px rgba(59,91,219,0.15)'
                  : '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              {isRecommended && (
                <div
                  className="text-center py-2 flex items-center justify-center gap-1.5"
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
                  Recommandé pour vous
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: config.bg,
                      color: config.color,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: config.dot }}
                    />
                    {config.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#3B5BDB', color: '#ffffff' }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </div>

                <h3
                  className="text-foreground mb-2"
                  style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}
                >
                  {preview.title}
                </h3>
                <p
                  className="mb-5"
                  style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}
                >
                  {preview.description}
                </p>

                <div className="mb-5">
                  <p
                    className="mb-2.5"
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#94a3b8',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Points forts
                  </p>
                  <ul className="space-y-2">
                    {preview.highlights?.slice(0, 3).map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2" style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                        <span
                          className="flex-shrink-0 inline-flex items-center justify-center rounded-full mt-0.5"
                          style={{ width: '16px', height: '16px', backgroundColor: '#F4F7FE', color: '#3B5BDB' }}
                          aria-hidden="true"
                        >
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4" style={{ borderTop: '0.5px solid #f1f5f9' }}>
                  <p
                    className="mb-2.5"
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#94a3b8',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Aperçu
                  </p>
                  <div className="space-y-1.5">
                    {preview.teaser_days?.map((day) => (
                      <p key={day.day} style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>Jour {day.day} :</span> {day.summary}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 italic" style={{ fontSize: '11px', color: '#94a3b8' }}>
                    … et plus encore après déblocage
                  </p>
                </div>

                <div className="mt-5 pt-4" style={{ borderTop: '0.5px solid #f1f5f9' }}>
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
                    Budget estimé
                  </p>
                  <p
                    className="tabular-nums"
                    style={{ fontSize: '20px', fontWeight: 700, color: '#3B5BDB', letterSpacing: '-0.01em', lineHeight: 1 }}
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
