// Configuration des prix pour le générateur d'itinéraire
// Produits et prix Stripe

export type Duration = '3-days' | '1-week' | '10-days' | '2-weeks' | '3-weeks' | '1-month' | 'more';
export type OfferType = 'express' | 'premium' | 'conciergerie';
export type ModificationType = 'simple' | 'moyenne' | 'majeure';

// IDs des produits Stripe
export const STRIPE_PRODUCTS = {
  express: 'prod_TmDGVeJGvGxI44',
  premium: 'prod_TmDH6MaD8BH2bA',
  conciergerie: 'prod_TmDHiW5m9yTwr5',
  modification: 'prod_TmDIcPNigtzvUu',
} as const;

// Grille tarifaire avec IDs des prix Stripe
export const PRICING_GRID: Record<OfferType, Record<Duration, {
  price: number;
  priceId: string;
  modifications: number;
}>> = {
  express: {
    '3-days': { price: 9.99, priceId: 'price_1SoersRtqAEWEBi1q9G9Uf1h', modifications: 0 },
    '1-week': { price: 12.99, priceId: 'price_1SoeryRtqAEWEBi1XKQaTFLr', modifications: 0 },
    '10-days': { price: 14.99, priceId: 'price_1SoeryRtqAEWEBi15MkNMRRG', modifications: 0 },
    '2-weeks': { price: 17.99, priceId: 'price_1SoerzRtqAEWEBi1NgdeVtEo', modifications: 0 },
    '3-weeks': { price: 19.99, priceId: 'price_1SoerzRtqAEWEBi16C0rESAe', modifications: 0 },
    '1-month': { price: 24.99, priceId: 'price_1Soes0RtqAEWEBi1FkHxo0St', modifications: 0 },
    'more': { price: 29.99, priceId: 'price_1Soes0RtqAEWEBi1VYG9uxc2', modifications: 0 },
  },
  premium: {
    '3-days': { price: 29, priceId: 'price_1Soes9RtqAEWEBi1Id53DTTm', modifications: 1 },
    '1-week': { price: 39, priceId: 'price_1SoesARtqAEWEBi1HB9kUekE', modifications: 1 },
    '10-days': { price: 49, priceId: 'price_1SoesARtqAEWEBi1lofJ5qi6', modifications: 2 },
    '2-weeks': { price: 59, priceId: 'price_1SoesBRtqAEWEBi1n94TD4ka', modifications: 2 },
    '3-weeks': { price: 69, priceId: 'price_1SoesBRtqAEWEBi1GRXZtXp2', modifications: 3 },
    '1-month': { price: 79, priceId: 'price_1SoesCRtqAEWEBi1mGrmnsyF', modifications: 3 },
    'more': { price: 99, priceId: 'price_1SoesCRtqAEWEBi1sauRwc9C', modifications: 4 },
  },
  conciergerie: {
    '3-days': { price: 79, priceId: 'price_1SoesORtqAEWEBi1LjMT85bK', modifications: 3 },
    '1-week': { price: 99, priceId: 'price_1SoesPRtqAEWEBi1HkxMdffH', modifications: 4 },
    '10-days': { price: 119, priceId: 'price_1SoesPRtqAEWEBi1ehQpp2qv', modifications: 5 },
    '2-weeks': { price: 149, priceId: 'price_1SoesQRtqAEWEBi1P6gWJSQd', modifications: 6 },
    '3-weeks': { price: 179, priceId: 'price_1SoesQRtqAEWEBi1yyamtypF', modifications: 8 },
    '1-month': { price: 219, priceId: 'price_1SoesRRtqAEWEBi1XBGb6I3V', modifications: 10 },
    'more': { price: 0, priceId: '', modifications: -1 }, // Sur devis
  },
};

// Prix des modifications supplémentaires
export const MODIFICATION_PRICES: Record<ModificationType, {
  price: number;
  priceId: string;
  description: string;
}> = {
  simple: {
    price: 9.99,
    priceId: 'price_1SoesRRtqAEWEBi1wM01eJHM',
    description: 'Changer un hôtel, resto ou activité',
  },
  moyenne: {
    price: 14.99,
    priceId: 'price_1SoesSRtqAEWEBi1gQqcEZLV',
    description: 'Changer une journée complète',
  },
  majeure: {
    price: 24.99,
    priceId: 'price_1SoesSRtqAEWEBi1CccZVqTJ',
    description: 'Changer une île ou réorganiser plusieurs jours',
  },
};

// Labels pour l'affichage
export const DURATION_LABELS: Record<Duration, string> = {
  '3-days': '3-5 jours',
  '1-week': '1 semaine',
  '10-days': '10 jours',
  '2-weeks': '2 semaines',
  '3-weeks': '3 semaines',
  '1-month': '1 mois',
  'more': 'Plus d\'un mois',
};

export const OFFER_LABELS: Record<OfferType, {
  name: string;
  description: string;
  features: string[];
  badge?: string;
}> = {
  express: {
    name: 'Express',
    description: '100% IA - Livraison instantanée',
    features: [
      'Itinéraire complet jour par jour',
      'Hébergements recommandés',
      'Liens Google Maps',
      'Budget détaillé',
      'Livraison par email',
    ],
    badge: 'Rapide',
  },
  premium: {
    name: 'Premium',
    description: 'IA + Support personnalisé',
    features: [
      'Tout Express inclus',
      'Modifications gratuites incluses',
      'PDF professionnel',
      'Support email sous 48h',
      'Validité 30 jours',
    ],
    badge: 'Populaire',
  },
  conciergerie: {
    name: 'Conciergerie',
    description: 'Service sur-mesure complet',
    features: [
      'Échange préalable personnalisé',
      'Itinéraire 100% sur-mesure',
      'Modifications incluses',
      'Support WhatsApp direct',
      'Vérification disponibilités',
      'Validité 60 jours',
    ],
    badge: 'Premium',
  },
};

// Helper pour obtenir le prix selon durée et offre
export function getPrice(duration: Duration, offer: OfferType): {
  price: number;
  priceId: string;
  modifications: number;
} | null {
  const pricing = PRICING_GRID[offer]?.[duration];
  if (!pricing || pricing.price === 0) return null;
  return pricing;
}

// Helper pour formater le prix
export function formatPrice(price: number): string {
  return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
}
