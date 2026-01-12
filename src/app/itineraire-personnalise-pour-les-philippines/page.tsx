'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic, faLock, faDownload, faSpinner, faCheck, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';

// Types pour les itinéraires
interface ItineraryPreview {
  variant: 'relax' | 'balanced' | 'adventure';
  title: string;
  description: string;
  budget_estimate: string;
  highlights: string[];
  teaser_days: { day: number; summary: string }[];
}

// Metadata for SEO - Note: Metadata must be in a separate layout.tsx or use Next.js App Router patterns
// Since this is a 'use client' component, metadata should be in a parent layout

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
  { value: 'eco', label: 'Économique (< 800€)' },
  { value: 'standard', label: 'Standard (800€ - 1500€)' },
  { value: 'comfort', label: 'Confort (1500€ - 2500€)' },
  { value: 'luxury', label: 'Luxe (> 2500€)' },
];

const tripStyleOptions: SelectOption[] = [
  { value: 'relax', label: 'Détente et plage' },
  { value: 'adventure', label: 'Aventure et nature' },
  { value: 'culture', label: 'Culture et histoire' },
  { value: 'diving', label: 'Plongée / Snorkeling' },
  { value: 'mix', label: 'Mix équilibré' },
];

// Fonction pour déterminer l'itinéraire recommandé basé sur le style de voyage
const getRecommendedVariant = (style: string): 'relax' | 'balanced' | 'adventure' => {
  switch (style) {
    case 'relax':
      return 'relax';
    case 'adventure':
    case 'diving':
      return 'adventure';
    case 'culture':
    case 'mix':
    default:
      return 'balanced';
  }
};

const ItinerairePage = () => {
  const [showResult, setShowResult] = useState(false);
  const [travelType, setTravelType] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [tripStyle, setTripStyle] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  // États pour la génération
  const [isLoading, setIsLoading] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<ItineraryPreview[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [recommendedVariant, setRecommendedVariant] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Gestion des intérêts (max 3)
  const handleInterestChange = (value: string, checked: boolean) => {
    if (checked && interests.length < 3) {
      setInterests([...interests, value]);
    } else if (!checked) {
      setInterests(interests.filter(i => i !== value));
    }
  };

  const handleGenerate = async () => {
    // Validation
    if (!travelType || !duration || !budget || !tripStyle) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowResult(false);
    setPreviews([]);
    setSelectedVariant(null);

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelType,
          duration,
          budget,
          tripStyle,
          interests,
          additionalInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      setGenerationId(data.generation_id);
      setPreviews(data.previews);

      // Déterminer et pré-sélectionner l'itinéraire recommandé
      const recommended = getRecommendedVariant(tripStyle);
      setRecommendedVariant(recommended);
      setSelectedVariant(recommended);

      setShowResult(true);

      setTimeout(() => {
        document.getElementById('itinerary-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Créez Votre <span className="text-primary">Itinéraire Idéal</span></h1>
      <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
        Laissez notre assistant IA concevoir le voyage de vos rêves aux Philippines. Indiquez vos préférences, nous faisons le reste !
      </p>

      <div className="bg-card rounded-xl shadow-2xl max-w-4xl mx-auto p-6 md:p-10 border-2 border-primary">
        <form className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary/90 mb-6 border-b border-primary/20 pb-3">Dites-nous ce que vous recherchez :</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-primary/90 mb-1 font-medium" htmlFor="travel-type-page">Type de voyage</label>
              <CustomSelect
                options={travelTypeOptions}
                value={travelType}
                onChange={(value) => setTravelType(value as string)}
                placeholder="Sélectionnez..."
              />
            </div>
            <div>
              <label className="block text-primary/90 mb-1 font-medium" htmlFor="duration-page">Durée du séjour</label>
              <CustomSelect
                options={durationOptions}
                value={duration}
                onChange={(value) => setDuration(value as string)}
                placeholder="Sélectionnez..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-primary/90 mb-1 font-medium" htmlFor="budget-page">Budget (par personne, hors vol inter)</label>
              <CustomSelect
                options={budgetOptions}
                value={budget}
                onChange={(value) => setBudget(value as string)}
                placeholder="Sélectionnez..."
              />
            </div>
            <div>
              <label className="block text-primary/90 mb-1 font-medium" htmlFor="trip-style-page">Style de voyage principal</label>
              <CustomSelect
                options={tripStyleOptions}
                value={tripStyle}
                onChange={(value) => setTripStyle(value as string)}
                placeholder="Sélectionnez..."
              />
            </div>
          </div>

          <div>
            <label className="block text-primary/90 mb-2 font-medium">Vos centres d&apos;intérêt principaux (cochez jusqu&apos;à 3) :</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="beaches" checked={interests.includes('beaches')} onChange={(e) => handleInterestChange('beaches', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Plages</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="snorkeling" checked={interests.includes('snorkeling')} onChange={(e) => handleInterestChange('snorkeling', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Plongée/Snorkel</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="hiking" checked={interests.includes('hiking')} onChange={(e) => handleInterestChange('hiking', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Randonnée/Nature</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="culture" checked={interests.includes('culture')} onChange={(e) => handleInterestChange('culture', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Culture/Histoire</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="food" checked={interests.includes('food')} onChange={(e) => handleInterestChange('food', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Gastronomie</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="nightlife" checked={interests.includes('nightlife')} onChange={(e) => handleInterestChange('nightlife', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Vie nocturne</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="surfing" checked={interests.includes('surfing')} onChange={(e) => handleInterestChange('surfing', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Surf</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="offbeaten" checked={interests.includes('offbeaten')} onChange={(e) => handleInterestChange('offbeaten', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Hors sentiers battus</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="local" checked={interests.includes('local')} onChange={(e) => handleInterestChange('local', e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Rencontres locales</label>
            </div>
          </div>

          <div>
            <label className="block text-primary/90 mb-1 font-medium" htmlFor="additional-info-page">Préférences ou informations complémentaires ?</label>
            <textarea id="additional-info-page" rows={3} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="w-full px-4 py-2 border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-primary/10 hover:border-primary focus:bg-card" placeholder="Ex: rythme souhaité (relax/intense), îles à éviter/privilégier, voyage avec enfants, besoins spécifiques..."></textarea>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="border-t border-primary/20 mt-6 pt-6 text-center">
            <button type="button" onClick={handleGenerate} disabled={isLoading} className="w-full md:w-auto px-8 py-4 bg-accent text-card-foreground text-lg rounded-lg hover:bg-accent/90 transition duration-300 pulse-animation font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <><FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" /> Génération en cours...</>
              ) : (
                <><FontAwesomeIcon icon={faMagic} className="mr-2" /> Générer mon Itinéraire Magique !</>
              )}
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              <FontAwesomeIcon icon={faLock} className="mr-1" /> Nous utilisons ces informations uniquement pour créer votre proposition d&apos;itinéraire.
            </p>
          </div>
        </form>

        {showResult && previews.length > 0 && (
          <div id="itinerary-result" className="mt-10 border-t pt-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Choisissez Votre Itinéraire :</h2>
            <p className="text-muted-foreground mb-6">Nous avons créé 3 propositions adaptées à vos préférences. Sélectionnez celle qui vous convient !</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previews.map((preview) => (
                <div
                  key={preview.variant}
                  onClick={() => setSelectedVariant(preview.variant)}
                  className={`bg-card p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 border-2 relative ${
                    selectedVariant === preview.variant
                      ? 'border-primary ring-2 ring-primary/50 scale-[1.02]'
                      : 'border-transparent hover:border-primary/50 hover:shadow-xl'
                  }`}
                >
                  {/* Badge Recommandé */}
                  {recommendedVariant === preview.variant && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Recommandé pour vous
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      preview.variant === 'relax' ? 'bg-blue-100 text-blue-700' :
                      preview.variant === 'balanced' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {preview.variant === 'relax' ? '🧘 Relax' : preview.variant === 'balanced' ? '⚖️ Équilibré' : '🏔️ Aventure'}
                    </span>
                    {selectedVariant === preview.variant && (
                      <FontAwesomeIcon icon={faCheck} className="text-primary" />
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-2">{preview.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{preview.description}</p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-primary/80 mb-2">Points forts :</p>
                    <ul className="space-y-1">
                      {preview.highlights?.slice(0, 3).map((highlight, idx) => (
                        <li key={idx} className="text-xs text-foreground flex items-start">
                          <span className="mr-1">✓</span> {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-primary/10 pt-3 mt-3">
                    <p className="text-xs font-semibold text-primary/80 mb-2">Aperçu :</p>
                    {preview.teaser_days?.map((day) => (
                      <p key={day.day} className="text-xs text-muted-foreground mb-1">
                        <strong>Jour {day.day}:</strong> {day.summary}
                      </p>
                    ))}
                    <p className="text-xs text-muted-foreground italic mt-2">... et plus encore après déblocage</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-primary/10">
                    <p className="text-sm font-bold text-primary">{preview.budget_estimate}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedVariant && (
              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="text-xl font-semibold mb-4">
                  Débloquez votre itinéraire <span className="text-primary">{selectedVariant === 'relax' ? 'Relax' : selectedVariant === 'balanced' ? 'Équilibré' : 'Aventure'}</span> pour <span className="text-primary font-bold">9.99€</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-card p-4 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-primary mb-2">✅ Inclus immédiatement</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Programme COMPLET jour par jour</li>
                      <li>• Hébergements recommandés</li>
                      <li>• Liens Google Maps pour chaque lieu</li>
                      <li>• Conseils pratiques et budget détaillé</li>
                      <li>• Livraison par Email ou Telegram</li>
                    </ul>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-primary mb-2">🎁 Bonus offert</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Résumé avancé des 2 autres itinéraires</li>
                      <li>• Aperçu des jours 1-3 de chaque</li>
                      <li>• Comparez sans regret !</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => alert('Paiement Stripe - À implémenter')}
                    className="px-8 py-4 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 font-semibold transition-all text-lg shadow-lg hover:shadow-xl"
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-2" /> Débloquer mon itinéraire
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  💳 Paiement sécurisé par Stripe • Livraison instantanée par email ou Telegram
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default ItinerairePage;
