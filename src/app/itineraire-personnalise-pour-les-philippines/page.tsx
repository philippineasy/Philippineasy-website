'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic, faLock, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';

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

const ItinerairePage = () => {
  const [showResult, setShowResult] = useState(false);
  const [travelType, setTravelType] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [tripStyle, setTripStyle] = useState('');

  const handleGenerate = () => {
    setShowResult(true);
    // In a real app, you would send the form data via API
    alert("Génération de l'itinéraire (simulation) !");
    setTimeout(() => {
      document.getElementById('itinerary-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
            <label className="block text-primary/90 mb-2 font-medium">Vos centres d'intérêt principaux (cochez jusqu'à 3) :</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="beaches" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Plages</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="snorkeling" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Plongée/Snorkel</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="hiking" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Randonnée/Nature</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="culture" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Culture/Histoire</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="food" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Gastronomie</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="nightlife" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Vie nocturne</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="surfing" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Surf</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="offbeaten" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Hors sentiers battus</label>
              <label className="flex items-center p-3 border border-primary/20 rounded-lg hover:bg-primary/10 hover:border-primary/60 cursor-pointer transition-all duration-150"><input type="checkbox" name="interests-page" value="local" className="mr-2 h-4 w-4 text-primary focus:ring-ring rounded" />Rencontres locales</label>
            </div>
          </div>

          <div>
            <label className="block text-primary/90 mb-1 font-medium" htmlFor="additional-info-page">Préférences ou informations complémentaires ?</label>
            <textarea id="additional-info-page" rows={3} className="w-full px-4 py-2 border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-primary/10 hover:border-primary focus:bg-card" placeholder="Ex: rythme souhaité (relax/intense), îles à éviter/privilégier, voyage avec enfants, besoins spécifiques..."></textarea>
          </div>

          <div className="border-t border-primary/20 mt-6 pt-6 text-center">
            <button type="button" onClick={handleGenerate} className="w-full md:w-auto px-8 py-4 bg-accent text-card-foreground text-lg rounded-lg hover:bg-accent/90 transition duration-300 pulse-animation font-semibold">
              <FontAwesomeIcon icon={faMagic} className="mr-2" /> Générer mon Itinéraire Magique !
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              <FontAwesomeIcon icon={faLock} className="mr-1" /> Nous utilisons ces informations uniquement pour créer votre proposition d'itinéraire.
            </p>
          </div>
        </form>

        {showResult && (
          <div id="itinerary-result" className="mt-10 border-t pt-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Votre Itinéraire Personnalisé :</h2>
            <div className="bg-primary/10 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">Exemple : Aventure Palawan (10 jours)</h3>
              <p className="text-foreground mb-4">Basé sur vos choix (Couple, 10 jours, Aventure, Plongée, Plages).</p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li><strong>Jours 1-2: Puerto Princesa</strong> - Rivière souterraine, acclimatation.</li>
                <li><strong>Jours 3-6: El Nido</strong> - Island Hopping Tours A & C (Big Lagoon, Small Lagoon, Secret Beach...), plages (Nacpan).</li>
                <li><strong>Jours 7-9: Coron</strong> - Plongée sur épaves, Kayangan Lake, Twin Lagoon, farniente sur île isolée.</li>
                <li><strong>Jour 10: Vol retour</strong> depuis Coron (Busuanga USU).</li>
              </ul>
              <p className="mt-4 font-semibold">Budget estimé : 1200€/personne</p>
              <div className="mt-6 text-center space-x-4">
                <button className="px-5 py-2 bg-primary text-card-foreground rounded hover:bg-primary/90"><FontAwesomeIcon icon={faDownload} className="mr-1" /> Télécharger PDF</button>
                <button className="px-5 py-2 bg-green-500 text-card-foreground rounded hover:bg-green-600"><FontAwesomeIcon icon={faWhatsapp} className="mr-1" /> Exporter WhatsApp (Premium)</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ItinerairePage;
