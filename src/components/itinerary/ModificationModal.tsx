'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPaperPlane,
  faSpinner,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { modalOverlay, modalContent, scaleIn } from './animations';

interface ModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementId: string;
  elementType: string;
  elementName: string;
  itineraryId: string;
  modificationsRemaining: number;
  isUnlimited: boolean;
  onSuccess: (newRemaining: number) => void;
}

const SUGGESTIONS: Record<string, string[]> = {
  morning: [
    'Plus proche de mon hotel',
    'Moins touristique',
    'Plus adapte aux enfants',
    'Alternative gratuite',
  ],
  lunch: [
    'Plus economique',
    'Cuisine vegetarienne',
    'Restaurant avec vue',
    'Cuisine locale authentique',
  ],
  afternoon: [
    'Activite plus relaxante',
    'Option en cas de pluie',
    'Moins de marche',
    'Plus d\'aventure',
  ],
  dinner: [
    'Restaurant romantique',
    'Street food',
    'Avec spectacle',
    'Proche de l\'hebergement',
  ],
  accommodation: [
    'Moins cher',
    'Plus central',
    'Avec piscine',
    'Vue mer',
  ],
};

export default function ModificationModal({
  isOpen,
  onClose,
  elementId,
  elementType,
  elementName,
  itineraryId,
  modificationsRemaining,
  isUnlimited,
  onSuccess,
}: ModificationModalProps) {
  const [requestText, setRequestText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = SUGGESTIONS[elementType] || SUGGESTIONS.morning;

  const handleSubmit = async () => {
    if (!requestText.trim()) {
      setError('Veuillez decrire votre demande de modification');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/itinerary/${itineraryId}/modification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          element_id: elementId,
          element_type: elementType,
          request_text: requestText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setIsSuccess(true);
      onSuccess(data.modifications_remaining);

      setTimeout(() => {
        setIsSuccess(false);
        setRequestText('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setRequestText((prev) => prev ? `${prev}\n${suggestion}` : suggestion);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            variants={modalOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            className="relative bg-card rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border/50"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Demander une modification</h2>
                  <p className="text-sm text-muted-foreground mt-1">{elementName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Success */}
            {isSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  variants={scaleIn}
                  initial="initial"
                  animate="animate"
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-3xl" />
                </motion.div>
                <h3 className="text-lg font-semibold text-green-600">Demande envoyee !</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Nous traitons votre modification et vous contacterons bientot.
                </p>
              </div>
            ) : (
              <>
                {/* Body */}
                <div className="p-6 space-y-4">
                  {/* Quota */}
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-sm text-foreground">Modifications restantes</span>
                    <Badge variant={isUnlimited ? 'success' : 'default'}>
                      {isUnlimited ? 'Illimite' : modificationsRemaining}
                    </Badge>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Suggestions rapides
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1.5 bg-muted hover:bg-primary/10 text-sm rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Textarea */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Decrivez votre demande
                    </label>
                    <Textarea
                      value={requestText}
                      onChange={(e) => setRequestText(e.target.value)}
                      placeholder="Ex: Je souhaite un restaurant plus economique avec cuisine locale..."
                      className="h-32 resize-none bg-muted/50 hover:border-primary/50 focus:bg-card"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border flex gap-3 justify-end">
                  <Button variant="ghost" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                        Envoyer
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
