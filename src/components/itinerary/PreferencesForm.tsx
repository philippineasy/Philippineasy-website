'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic, faLock, faSpinner, faCompass, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { InterestSelector } from './InterestSelector';
import type { Duration } from '@/config/itinerary-pricing';

// Email validation simple (RFC 5322-ish, suffisant pour le frontend)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const travelTypeOptions: SelectOption[] = [
  { value: 'solo', label: 'Voyage solo' },
  { value: 'couple', label: 'En couple' },
  { value: 'famille', label: 'En famille' },
  { value: 'amis', label: 'Entre amis' },
];

const durationOptions: SelectOption[] = [
  { value: '3-days', label: '3-5 jours' },
  { value: '1-week', label: '1 semaine' },
  { value: '10-days', label: '10 jours' },
  { value: '2-weeks', label: '2 semaines' },
  { value: '3-weeks', label: '3 semaines' },
  { value: '1-month', label: '1 mois' },
  { value: 'more', label: 'Plus d\'un mois' },
];

const budgetOptions: SelectOption[] = [
  { value: 'eco', label: 'Economique (< 800€)' },
  { value: 'standard', label: 'Standard (800€ - 1500€)' },
  { value: 'comfort', label: 'Confort (1500€ - 2500€)' },
  { value: 'luxury', label: 'Luxe (> 2500€)' },
];

const tripStyleOptions: SelectOption[] = [
  { value: 'relax', label: 'Detente et plage' },
  { value: 'adventure', label: 'Aventure et nature' },
  { value: 'culture', label: 'Culture et histoire' },
  { value: 'diving', label: 'Plongee / Snorkeling' },
  { value: 'mix', label: 'Mix equilibre' },
];

interface PreferencesFormProps {
  onGenerate: (data: {
    travelType: string;
    duration: Duration;
    budget: string;
    tripStyle: string;
    interests: string[];
    additionalInfo: string;
    email: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  defaultEmail?: string;
}

// Micro-label partagé par tous les champs — hiérarchie nette et cohérente.
const fieldLabel = 'mb-1.5 block text-sm font-semibold text-foreground';

export function PreferencesForm({ onGenerate, isLoading, error, isAuthenticated, authLoading, defaultEmail }: PreferencesFormProps) {
  const [travelType, setTravelType] = useState('');
  const [duration, setDuration] = useState<Duration | ''>('');
  const [budget, setBudget] = useState('');
  const [tripStyle, setTripStyle] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [email, setEmail] = useState(defaultEmail || '');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!travelType || !duration || !budget || !tripStyle) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!isAuthenticated && (!email || !EMAIL_RE.test(email))) {
      setFormError('Veuillez saisir un email valide pour recevoir votre apercu.');
      return;
    }
    setFormError(null);
    await onGenerate({
      travelType,
      duration: duration as Duration,
      budget,
      tripStyle,
      interests,
      additionalInfo,
      email: email.trim(),
    });
  };

  const displayError = error || formError;

  return (
    <div
      id="itinerary-form"
      className="mx-auto max-w-4xl scroll-mt-32 animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-card md:p-10"
    >
      <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
        {/* En-tête de carte — eyebrow + titre + rassurance */}
        <div className="border-b border-border pb-5">
          <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
            <FontAwesomeIcon icon={faCompass} aria-hidden="true" />
            Étape 1 · Aperçu gratuit
          </span>
          <h2 className="text-2xl font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
            Dites-nous ce que vous recherchez
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Quelques préférences suffisent — vous pourrez tout ajuster ensuite.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <div>
            <label className={fieldLabel}>Type de voyage</label>
            <CustomSelect
              options={travelTypeOptions}
              value={travelType}
              onChange={(value) => setTravelType(value as string)}
              placeholder="Selectionnez..."
            />
          </div>
          <div>
            <label className={fieldLabel}>Duree du sejour</label>
            <CustomSelect
              options={durationOptions}
              value={duration}
              onChange={(value) => setDuration(value as Duration)}
              placeholder="Selectionnez..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <div>
            <label className={fieldLabel}>Budget (par personne, hors vol inter)</label>
            <CustomSelect
              options={budgetOptions}
              value={budget}
              onChange={(value) => setBudget(value as string)}
              placeholder="Selectionnez..."
            />
          </div>
          <div>
            <label className={fieldLabel}>Style de voyage principal</label>
            <CustomSelect
              options={tripStyleOptions}
              value={tripStyle}
              onChange={(value) => setTripStyle(value as string)}
              placeholder="Selectionnez..."
            />
          </div>
        </div>

        <div>
          <label className={fieldLabel}>Vos centres d&apos;interet (max 3)</label>
          <InterestSelector
            selected={interests}
            onChange={setInterests}
          />
        </div>

        <div>
          <label className={fieldLabel}>Preferences ou informations complementaires ?</label>
          <Textarea
            rows={3}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Ex: rythme souhaite (relax/intense), iles a eviter/privilegier, voyage avec enfants..."
            className="rounded-lg bg-muted/50 hover:border-primary/50 focus:bg-card focus-visible:ring-primary/30"
          />
        </div>

        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {displayError}
          </motion.div>
        )}

        {/* Champ email — capture necessaire pour anonymes (recovery + magic link payment) */}
        {!authLoading && !isAuthenticated && (
          <div>
            <label htmlFor="itinerary-email" className={fieldLabel}>
              Votre email <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70" aria-hidden="true" />
              <input
                id="itinerary-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                autoComplete="email"
                required
                className="min-h-[44px] w-full rounded-lg border border-border bg-muted/50 py-3 pl-10 pr-4 transition-colors hover:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              On vous envoie l&apos;apercu et on retient vos preferences si vous revenez plus tard.
            </p>
          </div>
        )}

        <div className="border-t border-border pt-6 text-center">
          {authLoading ? (
            <div className="py-4">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-primary" />
            </div>
          ) : (
            <>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                size="lg"
                className="h-auto w-full bg-accent px-8 py-4 text-lg font-semibold text-accent-foreground shadow-cta transition-all duration-200 hover:bg-accent/90 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] motion-reduce:hover:scale-100 md:w-auto"
              >
                {isLoading ? (
                  <><FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" /> Generation en cours...</>
                ) : (
                  <><FontAwesomeIcon icon={faMagic} className="mr-2" /> Voir mon apercu gratuit</>
                )}
              </Button>

              {/* Loading feedback panel — visible only during generation */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    key="loading-feedback"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
                  >
                    <p className="text-base font-semibold text-foreground">
                      Votre itineraire est en cours de creation...
                    </p>
                    <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                      Nos experts IA analysent vos preferences et selectionnent les meilleurs lieux aux Philippines.
                    </p>

                    {/* Animated progress dots */}
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.span
                          key={i}
                          className="block h-1.5 w-1.5 rounded-full bg-primary"
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            delay: i * 0.18,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mx-auto h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-primary/10">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>

                    <p className="pt-1 text-xs font-medium text-muted-foreground">
                      Veuillez ne pas fermer cette page. Cela peut prendre jusqu&apos;a 1 minute.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-4 text-sm text-muted-foreground">
                <FontAwesomeIcon icon={faLock} className="mr-1" /> Apercu gratuit. Aucun engagement avant validation.
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
