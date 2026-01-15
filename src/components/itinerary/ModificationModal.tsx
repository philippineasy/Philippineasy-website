'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPaperPlane,
  faSpinner,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

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

// Suggestions predefinies selon le type d'element
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

      // Fermer apres 2 secondes
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
    setRequestText((prev) => {
      if (prev) {
        return `${prev}\n${suggestion}`;
      }
      return suggestion;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary">Demander une modification</h2>
              <p className="text-sm text-muted-foreground mt-1">{elementName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Succes */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-green-600">Demande envoyee !</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Nous traitons votre modification et vous contacterons bientot.
            </p>
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Quota restant */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-800">Modifications restantes</span>
                <span className="font-bold text-blue-600">
                  {isUnlimited ? 'Illimite' : modificationsRemaining}
                </span>
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suggestions rapides
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-primary/10 text-sm rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decrivez votre demande
                </label>
                <textarea
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="Ex: Je souhaite un restaurant plus economique avec cuisine locale..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Erreur */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
