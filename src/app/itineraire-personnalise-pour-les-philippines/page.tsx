'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic, faLock, faSpinner, faCheck, faRocket, faStar, faCrown, faCircleInfo, faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  PRICING_GRID,
  DURATION_LABELS,
  OFFER_LABELS,
  MODIFICATION_PRICES,
  formatPrice,
  type Duration,
  type OfferType
} from '@/config/itinerary-pricing';

// Types pour les itinéraires
interface ItineraryPreview {
  variant: 'relax' | 'balanced' | 'adventure';
  title: string;
  description: string;
  budget_estimate: string;
  highlights: string[];
  teaser_days: { day: number; summary: string }[];
}

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
  const { user, loading: authLoading } = useAuth();

  const [showResult, setShowResult] = useState(false);
  const [travelType, setTravelType] = useState('');
  const [duration, setDuration] = useState<Duration | ''>('');
  const [budget, setBudget] = useState('');
  const [tripStyle, setTripStyle] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Etats pour la generation
  const [isLoading, setIsLoading] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<ItineraryPreview[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [recommendedVariant, setRecommendedVariant] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferType>('express');
  const [error, setError] = useState<string | null>(null);

  const handleInterestChange = (value: string, checked: boolean) => {
    if (checked && interests.length < 3) {
      setInterests([...interests, value]);
    } else if (!checked) {
      setInterests(interests.filter(i => i !== value));
    }
  };

  const handleGenerate = async () => {
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
        throw new Error(data.error || 'Erreur lors de la generation');
      }

      setGenerationId(data.generation_id);
      setPreviews(data.previews);

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

  const handlePayment = async (offer: OfferType) => {
    if (!generationId || !selectedVariant || !duration) return;

    const pricing = PRICING_GRID[offer][duration as Duration];
    if (!pricing || pricing.price === 0) {
      // Sur devis pour conciergerie +1 mois
      window.location.href = '/contact?subject=conciergerie-voyage';
      return;
    }

    try {
      const response = await fetch('/api/itinerary/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_id: generationId,
          selected_variant: selectedVariant,
          offer_type: offer,
          duration: duration,
          price_id: pricing.priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors du paiement');
      }

      // Rediriger vers Stripe Checkout ou afficher le formulaire de paiement
      // Pour l'instant on utilise le client_secret pour Elements
      window.location.href = `/checkout/itinerary?client_secret=${data.clientSecret}&generation_id=${generationId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement');
    }
  };

  const currentPricing = duration ? {
    express: PRICING_GRID.express[duration as Duration],
    premium: PRICING_GRID.premium[duration as Duration],
    conciergerie: PRICING_GRID.conciergerie[duration as Duration],
  } : null;

  return (
    <main className="container mx-auto px-4 py-16">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-4">
        Creez Votre <span className="text-primary">Itineraire Ideal</span> aux Philippines
      </h1>
      <p className="text-center text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
        Notre assistant IA concoit le voyage de vos reves en quelques minutes. Indiquez vos preferences, choisissez votre formule, partez serein !
      </p>

      {/* Comment ca marche */}
      <div className="bg-card rounded-2xl p-6 md:p-8 mb-12 max-w-4xl mx-auto border border-border shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faCircleInfo} className="text-primary" />
          Comment ca marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-1">Decrivez votre voyage</h3>
            <p className="text-sm text-muted-foreground">Remplissez le formulaire (2 min)</p>
            <p className="text-xs text-green-600 font-medium mt-1">GRATUIT</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold mb-1">Recevez 3 propositions</h3>
            <p className="text-sm text-muted-foreground">Notre IA cree 3 itineraires adaptes</p>
            <p className="text-xs text-green-600 font-medium mt-1">GRATUIT</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold mb-1">Debloquez le complet</h3>
            <p className="text-sm text-muted-foreground">Programme detaille, liens, conseils</p>
            <p className="text-xs text-primary font-medium mt-1">DES 9,99€</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-card rounded-xl shadow-2xl max-w-4xl mx-auto p-6 md:p-10 border-2 border-primary">
        <form className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary/90 mb-6 border-b border-primary/20 pb-3">
            Dites-nous ce que vous recherchez :
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-primary/90 mb-1 font-medium">Type de voyage</label>
              <CustomSelect
                options={travelTypeOptions}
                value={travelType}
                onChange={(value) => setTravelType(value as string)}
                placeholder="Selectionnez..."
              />
            </div>
            <div>
              <label className="block text-primary/90 mb-1 font-medium">Duree du sejour</label>
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
              <label className="block text-primary/90 mb-1 font-medium">Budget (par personne, hors vol inter)</label>
              <CustomSelect
                options={budgetOptions}
                value={budget}
                onChange={(value) => setBudget(value as string)}
                placeholder="Selectionnez..."
              />
            </div>
            <div>
              <label className="block text-primary/90 mb-1 font-medium">Style de voyage principal</label>
              <CustomSelect
                options={tripStyleOptions}
                value={tripStyle}
                onChange={(value) => setTripStyle(value as string)}
                placeholder="Selectionnez..."
              />
            </div>
          </div>

          <div>
            <label className="block text-primary/90 mb-2 font-medium">Vos centres d&apos;interet (max 3) :</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: 'beaches', label: 'Plages' },
                { value: 'snorkeling', label: 'Plongee/Snorkel' },
                { value: 'hiking', label: 'Randonnee/Nature' },
                { value: 'culture', label: 'Culture/Histoire' },
                { value: 'food', label: 'Gastronomie' },
                { value: 'nightlife', label: 'Vie nocturne' },
                { value: 'surfing', label: 'Surf' },
                { value: 'offbeaten', label: 'Hors sentiers battus' },
                { value: 'local', label: 'Rencontres locales' },
              ].map((interest) => (
                <label key={interest.value} className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150">
                  <input
                    type="checkbox"
                    value={interest.value}
                    checked={interests.includes(interest.value)}
                    onChange={(e) => handleInterestChange(interest.value, e.target.checked)}
                    className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded"
                  />
                  {interest.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-primary/90 mb-1 font-medium">Preferences ou informations complementaires ?</label>
            <textarea
              rows={3}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full px-4 py-2 border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-primary/10 hover:border-primary focus:bg-card"
              placeholder="Ex: rythme souhaite (relax/intense), iles a eviter/privilegier, voyage avec enfants..."
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="border-t border-primary/20 mt-6 pt-6 text-center">
            {authLoading ? (
              <div className="py-4">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary text-2xl" />
              </div>
            ) : !user ? (
              <div className="bg-blue-50 border-2 border-primary/30 rounded-xl p-6 mb-4">
                <FontAwesomeIcon icon={faUser} className="text-primary text-3xl mb-3" />
                <h3 className="text-lg font-semibold text-primary mb-2">Connectez-vous pour creer votre itineraire</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Un compte est necessaire pour generer et sauvegarder vos itineraires personnalises.
                </p>
                <Link
                  href="/connexion?redirect=/itineraire-personnalise-pour-les-philippines"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-all"
                >
                  <FontAwesomeIcon icon={faUser} />
                  Se connecter
                </Link>
                <p className="text-xs text-muted-foreground mt-3">
                  Pas encore de compte ? <Link href="/inscription" className="text-primary hover:underline">Inscrivez-vous gratuitement</Link>
                </p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full md:w-auto px-8 py-4 bg-accent text-card-foreground text-lg rounded-lg hover:bg-accent/90 transition duration-300 pulse-animation font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" /> Generation en cours...</>
                  ) : (
                    <><FontAwesomeIcon icon={faMagic} className="mr-2" /> Generer mon Itineraire (Gratuit)</>
                  )}
                </button>
                <p className="text-sm text-muted-foreground mt-4">
                  <FontAwesomeIcon icon={faLock} className="mr-1" /> Vos donnees sont utilisees uniquement pour creer votre itineraire.
                </p>
              </>
            )}
          </div>
        </form>

        {/* Resultats */}
        {showResult && previews.length > 0 && (
          <div id="itinerary-result" className="mt-10 border-t pt-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Choisissez Votre Itineraire :</h2>
            <p className="text-muted-foreground mb-6">3 propositions adaptees a vos preferences. Selectionnez celle qui vous plait !</p>

            {/* Previews des 3 variantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 mt-6">
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
                  {recommendedVariant === preview.variant && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-primary border-2 border-primary px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      Recommande pour vous
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3 mt-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      preview.variant === 'relax' ? 'bg-blue-100 text-blue-700' :
                      preview.variant === 'balanced' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {preview.variant === 'relax' ? 'Relax' : preview.variant === 'balanced' ? 'Equilibre' : 'Aventure'}
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
                    <p className="text-xs font-semibold text-primary/80 mb-2">Apercu :</p>
                    {preview.teaser_days?.map((day) => (
                      <p key={day.day} className="text-xs text-muted-foreground mb-1">
                        <strong>Jour {day.day}:</strong> {day.summary}
                      </p>
                    ))}
                    <p className="text-xs text-muted-foreground italic mt-2">... et plus encore apres deblocage</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-primary/10">
                    <p className="text-sm font-bold text-primary">{preview.budget_estimate}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection de l'offre */}
            {selectedVariant && currentPricing && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-6 text-center">
                  Choisissez votre formule pour <span className="text-primary">{DURATION_LABELS[duration as Duration]}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                  {/* EXPRESS */}
                  <div
                    onClick={() => setSelectedOffer('express')}
                    className={`bg-card p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedOffer === 'express'
                        ? 'border-primary shadow-lg scale-[1.02]'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4 mt-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
                        <span className="font-bold text-lg">{OFFER_LABELS.express.name}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {OFFER_LABELS.express.badge}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {formatPrice(currentPricing.express.price)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{OFFER_LABELS.express.description}</p>
                    <ul className="space-y-2 mb-4">
                      {OFFER_LABELS.express.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-red-500">Aucune modification incluse</p>
                  </div>

                  {/* PREMIUM */}
                  <div
                    onClick={() => setSelectedOffer('premium')}
                    className={`bg-card p-6 rounded-xl border-2 cursor-pointer transition-all relative ${
                      selectedOffer === 'premium'
                        ? 'border-primary shadow-lg scale-[1.02]'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-primary border-2 border-primary px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      Recommande
                    </div>
                    <div className="flex items-center justify-between mb-4 mt-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                        <span className="font-bold text-lg">{OFFER_LABELS.premium.name}</span>
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        {OFFER_LABELS.premium.badge}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {formatPrice(currentPricing.premium.price)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{OFFER_LABELS.premium.description}</p>
                    <ul className="space-y-2 mb-4">
                      {OFFER_LABELS.premium.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-green-600 font-medium">
                      {currentPricing.premium.modifications} modification{currentPricing.premium.modifications > 1 ? 's' : ''} incluse{currentPricing.premium.modifications > 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* CONCIERGERIE */}
                  <div
                    onClick={() => setSelectedOffer('conciergerie')}
                    className={`bg-card p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedOffer === 'conciergerie'
                        ? 'border-primary shadow-lg scale-[1.02]'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4 mt-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCrown} className="text-purple-500" />
                        <span className="font-bold text-lg">{OFFER_LABELS.conciergerie.name}</span>
                      </div>
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                        {OFFER_LABELS.conciergerie.badge}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {currentPricing.conciergerie.price > 0
                        ? formatPrice(currentPricing.conciergerie.price)
                        : 'Sur devis'
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{OFFER_LABELS.conciergerie.description}</p>
                    <ul className="space-y-2 mb-4">
                      {OFFER_LABELS.conciergerie.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-green-600 font-medium">
                      {currentPricing.conciergerie.modifications > 0
                        ? `${currentPricing.conciergerie.modifications} modifications incluses`
                        : 'Modifications illimitees'
                      }
                    </p>
                  </div>
                </div>

                {/* Modifications supplementaires */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Besoin de plus de modifications ?</strong> Ajoutez-en a tout moment :
                    {Object.entries(MODIFICATION_PRICES).map(([key, value], idx) => (
                      <span key={key}>
                        {idx > 0 && ' |'} {value.description} <strong>{formatPrice(value.price)}</strong>
                      </span>
                    ))}
                  </p>
                </div>

                {/* Bouton de paiement */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => handlePayment(selectedOffer)}
                    className="px-10 py-4 bg-primary text-white text-lg rounded-lg hover:bg-primary/90 font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                    {currentPricing[selectedOffer].price > 0
                      ? `Debloquer pour ${formatPrice(currentPricing[selectedOffer].price)}`
                      : 'Demander un devis'
                    }
                  </button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Paiement securise par Stripe • Livraison instantanee par email
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default ItinerairePage;
