'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { HowItWorks } from '@/components/itinerary/HowItWorks';
import { PreferencesForm } from '@/components/itinerary/PreferencesForm';
import { ProposalCards } from '@/components/itinerary/ProposalCards';
import { OfferSelection } from '@/components/itinerary/OfferSelection';
import { fadeInUp } from '@/components/itinerary/animations';
import {
  PRICING_GRID,
  type Duration,
  type OfferType,
} from '@/config/itinerary-pricing';

interface ItineraryPreview {
  variant: 'relax' | 'balanced' | 'adventure';
  title: string;
  description: string;
  budget_estimate: string;
  highlights: string[];
  teaser_days: { day: number; summary: string }[];
}

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
  const [duration, setDuration] = useState<Duration | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<ItineraryPreview[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [recommendedVariant, setRecommendedVariant] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferType>('express');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: {
    travelType: string;
    duration: Duration;
    budget: string;
    tripStyle: string;
    interests: string[];
    additionalInfo: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setShowResult(false);
    setPreviews([]);
    setSelectedVariant(null);
    setDuration(data.duration);

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la generation');
      }

      setGenerationId(result.generation_id);
      setPreviews(result.previews);

      const recommended = getRecommendedVariant(data.tripStyle);
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
          duration,
          price_id: pricing.priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors du paiement');
      }

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
    <main className="min-h-screen bg-[hsl(var(--warm-bg))]">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            Creez Votre <span className="text-primary">Itineraire Ideal</span> aux Philippines
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Notre assistant IA concoit le voyage de vos reves en quelques minutes. Indiquez vos preferences, choisissez votre formule, partez serein !
          </p>
        </motion.div>

        {/* Comment ca marche */}
        <HowItWorks />

        {/* Formulaire */}
        <PreferencesForm
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          isAuthenticated={!!user}
          authLoading={authLoading}
        />

        {/* Resultats */}
        <AnimatePresence mode="wait">
          {showResult && previews.length > 0 && (
            <motion.div
              id="itinerary-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-10 max-w-4xl mx-auto"
            >
              <ProposalCards
                previews={previews}
                selectedVariant={selectedVariant}
                recommendedVariant={recommendedVariant}
                onSelect={setSelectedVariant}
              />

              {selectedVariant && currentPricing && (
                <OfferSelection
                  selectedOffer={selectedOffer}
                  onSelectOffer={setSelectedOffer}
                  currentPricing={currentPricing}
                  duration={duration as Duration}
                  onPayment={handlePayment}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default ItinerairePage;
