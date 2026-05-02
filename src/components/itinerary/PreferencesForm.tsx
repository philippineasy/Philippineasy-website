'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic, faLock, faSpinner, faCompass, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { InterestSelector } from './InterestSelector';
import { fadeInUp } from './animations';
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
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="bg-card rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] max-w-4xl mx-auto p-6 md:p-10 border border-border/50"
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faCompass} className="text-primary" />
          Dites-nous ce que vous recherchez :
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-foreground mb-1 font-medium">Type de voyage</label>
            <CustomSelect
              options={travelTypeOptions}
              value={travelType}
              onChange={(value) => setTravelType(value as string)}
              placeholder="Selectionnez..."
            />
          </div>
          <div>
            <label className="block text-foreground mb-1 font-medium">Duree du sejour</label>
            <CustomSelect
              options={durationOptions}
              value={duration}
              onChange={(value) => setDuration(value as Duration)}
              placeholder="Selectionnez..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-foreground mb-1 font-medium">Budget (par personne, hors vol inter)</label>
            <CustomSelect
              options={budgetOptions}
              value={budget}
              onChange={(value) => setBudget(value as string)}
              placeholder="Selectionnez..."
            />
          </div>
          <div>
            <label className="block text-foreground mb-1 font-medium">Style de voyage principal</label>
            <CustomSelect
              options={tripStyleOptions}
              value={tripStyle}
              onChange={(value) => setTripStyle(value as string)}
              placeholder="Selectionnez..."
            />
          </div>
        </div>

        <div>
          <label className="block text-foreground mb-2 font-medium">Vos centres d&apos;interet (max 3) :</label>
          <InterestSelector
            selected={interests}
            onChange={setInterests}
          />
        </div>

        <div>
          <label className="block text-foreground mb-1 font-medium">Preferences ou informations complementaires ?</label>
          <Textarea
            rows={3}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Ex: rythme souhaite (relax/intense), iles a eviter/privilegier, voyage avec enfants..."
            className="bg-muted/50 hover:border-primary/50 focus:bg-card"
          />
        </div>

        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm"
          >
            {displayError}
          </motion.div>
        )}

        {/* Champ email — capture necessaire pour anonymes (recovery + magic link payment) */}
        {!authLoading && !isAuthenticated && (
          <div>
            <label htmlFor="itinerary-email" className="block text-foreground mb-1 font-medium">
              Votre email <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="itinerary-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-muted/50 hover:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              On vous envoie l&apos;apercu et on retient vos preferences si vous revenez plus tard.
            </p>
          </div>
        )}

        <div className="border-t border-border mt-6 pt-6 text-center">
          {authLoading ? (
            <div className="py-4">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary text-2xl" />
            </div>
          ) : (
            <>
              <motion.div whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  size="lg"
                  className="w-full md:w-auto px-8 py-4 bg-accent text-accent-foreground text-lg hover:bg-accent/90 font-semibold shadow-md hover:shadow-lg transition-all h-auto"
                >
                  {isLoading ? (
                    <><FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" /> Generation en cours...</>
                  ) : (
                    <><FontAwesomeIcon icon={faMagic} className="mr-2" /> Voir mon apercu gratuit</>
                  )}
                </Button>
              </motion.div>

              {/* Loading feedback panel — visible only during generation */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    key="loading-feedback"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-3"
                  >
                    <p className="text-foreground font-semibold text-base">
                      Votre itineraire est en cours de creation...
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                      Nos experts IA analysent vos preferences et selectionnent les meilleurs lieux aux Philippines.
                    </p>

                    {/* Animated progress dots */}
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.span
                          key={i}
                          className="block w-1.5 h-1.5 rounded-full bg-primary"
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
                    <div className="w-full bg-primary/10 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>

                    <p className="text-muted-foreground text-xs font-medium pt-1">
                      Veuillez ne pas fermer cette page. Cela peut prendre jusqu&apos;a 1 minute.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-sm text-muted-foreground mt-4">
                <FontAwesomeIcon icon={faLock} className="mr-1" /> Apercu gratuit. Aucun engagement avant validation.
              </p>
            </>
          )}
        </div>
      </form>
    </motion.div>
  );
}
