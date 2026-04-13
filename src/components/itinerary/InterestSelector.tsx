'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const INTERESTS = [
  { value: 'beaches', label: 'Plages', icon: '🏖️' },
  { value: 'snorkeling', label: 'Plongee/Snorkel', icon: '🤿' },
  { value: 'hiking', label: 'Randonnee/Nature', icon: '🥾' },
  { value: 'culture', label: 'Culture/Histoire', icon: '🏛️' },
  { value: 'food', label: 'Gastronomie', icon: '🍜' },
  { value: 'nightlife', label: 'Vie nocturne', icon: '🌙' },
  { value: 'surfing', label: 'Surf', icon: '🏄' },
  { value: 'offbeaten', label: 'Hors sentiers battus', icon: '🗺️' },
  { value: 'local', label: 'Rencontres locales', icon: '🤝' },
] as const;

interface InterestSelectorProps {
  selected: string[];
  onChange: (interests: string[]) => void;
  maxSelections?: number;
}

export function InterestSelector({ selected, onChange, maxSelections = 3 }: InterestSelectorProps) {
  const isMaxReached = selected.length >= maxSelections;

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(i => i !== value));
    } else if (!isMaxReached) {
      onChange([...selected, value]);
    }
  };

  return (
    <div>
      <div
        role="group"
        aria-label="Centres d'interet"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest.value);
          const isDisabled = isMaxReached && !isSelected;

          return (
            <motion.button
              key={interest.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(interest.value)}
              disabled={isDisabled}
              whileTap={!isDisabled ? { scale: 0.95 } : undefined}
              className={`
                inline-flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm transition-all
                ${isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10'
                  : isDisabled
                    ? 'border-border text-muted-foreground opacity-50 cursor-not-allowed'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted cursor-pointer'
                }
              `}
            >
              <span className="text-base">{interest.icon}</span>
              <span className="flex-1 text-left">{interest.label}</span>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <FontAwesomeIcon icon={faCheck} className="text-primary text-xs" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {selected.length}/{maxSelections} selectionnee{selected.length > 1 ? 's' : ''}
      </p>
    </div>
  );
}
