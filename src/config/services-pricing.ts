// Configuration des prix pour la page Services
// Nouveaux packs: Buddy System, Pack Voyage Serein, Pack Ultime

export type ServiceDuration = 'short' | 'medium' | 'long' | 'expat';
export type ServiceType = 'buddy' | 'voyage-serein' | 'pack-ultime' | 'guide-pdf' | 'easy-plus';

// IDs des produits Stripe (LIVE)
export const SERVICE_STRIPE_PRODUCTS = {
  buddy: 'prod_Txa0L11YbtTR6h',
  'voyage-serein': 'prod_Txa0JtYZblfrwU',
  'pack-ultime': 'prod_Txa0ovVRckD7Ly',
  'guide-pdf': 'prod_Txa0pvN9ymE2g0',
  'easy-plus': 'prod_Txa0tR4pRAxGax',
  'rencontre-premium': 'prod_Txa04zZwioxjnv',
} as const;

// Grille tarifaire Buddy System
export const BUDDY_PRICING: Record<ServiceDuration, {
  price: number;
  priceId: string;
  calls: number;
  whatsappDuration: string;
} | null> = {
  short: { price: 79, priceId: 'price_1SzetjRxqcfmHXQYj5sZWwCi', calls: 2, whatsappDuration: '1 semaine' },
  medium: { price: 119, priceId: 'price_1SzetkRxqcfmHXQYOBni4V3O', calls: 3, whatsappDuration: '2 semaines' },
  long: { price: 149, priceId: 'price_1SzetlRxqcfmHXQYtGE2S226', calls: 4, whatsappDuration: '1 mois' },
  expat: null, // Utilise 'long'
};

// Grille tarifaire Pack Voyage Serein
export const VOYAGE_SEREIN_PRICING: Record<ServiceDuration, {
  price: number;
  priceId: string;
  whatsappDuration: string;
} | null> = {
  short: { price: 99, priceId: 'price_1SzetlRxqcfmHXQY0k2bC7C3', whatsappDuration: '1 semaine' },
  medium: { price: 149, priceId: 'price_1SzetmRxqcfmHXQYO5BQyB88', whatsappDuration: '2 semaines' },
  long: { price: 199, priceId: 'price_1SzetnRxqcfmHXQYwngSwuMs', whatsappDuration: '3 semaines' },
  expat: null, // Utilise 'long'
};

// Grille tarifaire Pack Ultime
export const PACK_ULTIME_PRICING: Record<ServiceDuration, {
  price: number;
  priceId: string;
} | null> = {
  short: null, // Non disponible pour séjours courts
  medium: { price: 369, priceId: 'price_1SzetoRxqcfmHXQYtB1zMCRt' },
  long: { price: 449, priceId: 'price_1SzetoRxqcfmHXQYmuKu9a1k' },
  expat: { price: 549, priceId: 'price_1SzetpRxqcfmHXQY7dzoDhLl' },
};

// Guides PDF
export const GUIDE_PDF_PRICING = {
  visa: { price: 14.99, priceId: 'price_1SzetqRxqcfmHXQYGv7pWnv4', name: 'Guide Visa Philippines 2026' },
  'cout-vie': { price: 14.99, priceId: 'price_1SzetqRxqcfmHXQYe9aotRWZ', name: 'Guide Coût de la Vie' },
  destinations: { price: 19.99, priceId: 'price_1SzetrRxqcfmHXQYSwEQp4Qk', name: 'Guide Destinations Secrètes' },
  pack: { price: 24.99, priceId: 'price_1SzetsRxqcfmHXQY88EewSEf', name: 'Pack 3 Guides', originalPrice: 49.97 },
} as const;

// Easy+ Pricing
export const EASY_PLUS_PRICING = {
  monthly: { price: 29.99, priceId: 'price_1SzettRxqcfmHXQYgVv8XvW8', period: 'mois', minEngagement: 3 },
  yearly: { price: 249, priceId: 'price_1SzettRxqcfmHXQYCCnr7Vpg', period: 'an', savings: '31%' },
  lifetime: { price: 499, priceId: 'price_1SzetuRxqcfmHXQYMQoa10Us', period: 'à vie' },
} as const;

// Labels pour l'affichage
export const SERVICE_DURATION_LABELS: Record<ServiceDuration, string> = {
  short: '3-5 jours',
  medium: '1-2 semaines',
  long: '3+ semaines',
  expat: '+1 mois / Expatriation',
};

// Détails des services
export const SERVICE_DETAILS: Record<ServiceType, {
  name: string;
  description: string;
  features: string[];
  badge?: string;
  icon: string;
}> = {
  buddy: {
    name: 'Buddy System',
    description: 'Un expat français sur place vous accompagne',
    features: [
      'Matching avec un expatrié français',
      'Calls de 30min avant/pendant/après',
      'Contact WhatsApp avec votre buddy',
      'Conseils personnalisés et locaux',
      'Réseau d\'entraide sur place',
    ],
    badge: 'Exclusif',
    icon: 'faUsers',
  },
  'voyage-serein': {
    name: 'Pack Voyage Serein',
    description: 'Itinéraire Premium + Accompagnement humain',
    features: [
      'Itinéraire Premium inclus',
      'Call 30min avec Hugo avant départ',
      'Suivi WhatsApp pendant le voyage',
      'Checklist pré-départ personnalisée',
      'Support en cas de problème',
    ],
    badge: 'Populaire',
    icon: 'faShieldAlt',
  },
  'pack-ultime': {
    name: 'Pack Ultime',
    description: 'Tout ce dont vous avez besoin pour réussir',
    features: [
      'Itinéraire Conciergerie inclus',
      'Buddy System complet',
      'Suivi WhatsApp durée complète',
      'Easy+ 1 an inclus',
      'Rencontre Premium 6 mois',
      'Guide PDF au choix',
      'Groupe privé à vie',
    ],
    badge: 'Best Value',
    icon: 'faCrown',
  },
  'guide-pdf': {
    name: 'Guides PDF',
    description: 'Guides pratiques téléchargeables',
    features: [
      'Format PDF professionnel',
      'Mises à jour gratuites',
      'Accessible hors-ligne',
      'Conseils exclusifs',
    ],
    icon: 'faFileDownload',
  },
  'easy-plus': {
    name: 'Easy+',
    description: 'Abonnement privilège Philippin\'Easy',
    features: [
      '-20% chez nos partenaires',
      'Support prioritaire 24/7',
      'Accès guides premium',
      'Assistant IA illimité',
      'Événements privés',
    ],
    badge: 'VIP',
    icon: 'faStar',
  },
};

// Helper pour obtenir le prix
export function getServicePrice(
  service: 'buddy' | 'voyage-serein' | 'pack-ultime',
  duration: ServiceDuration
): { price: number; priceId: string } | null {
  switch (service) {
    case 'buddy':
      return BUDDY_PRICING[duration];
    case 'voyage-serein':
      return VOYAGE_SEREIN_PRICING[duration];
    case 'pack-ultime':
      return PACK_ULTIME_PRICING[duration];
    default:
      return null;
  }
}

// Helper pour formater le prix
export function formatServicePrice(price: number): string {
  return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
}

// =====================================================
// Server-side checkout mapping: ServiceType → Stripe priceId + amount
// Used by the checkout API route to validate and create Stripe sessions.
// Replace empty priceId strings with real Stripe price IDs when products are created.
// =====================================================
import type { ServiceType as CRMServiceType } from '@/types/services';

export interface CheckoutConfig {
  priceId: string;
  amount: number;
  name: string;
  mode: 'payment' | 'subscription';
}

export const SERVICE_CHECKOUT_MAP: Record<CRMServiceType, CheckoutConfig> = {
  // Buddy System
  buddy_short: { priceId: 'price_1SzetjRxqcfmHXQYj5sZWwCi', amount: 7900, name: 'Buddy System - Court Séjour', mode: 'payment' },
  buddy_medium: { priceId: 'price_1SzetkRxqcfmHXQYOBni4V3O', amount: 11900, name: 'Buddy System - Standard', mode: 'payment' },
  buddy_long: { priceId: 'price_1SzetlRxqcfmHXQYtGE2S226', amount: 14900, name: 'Buddy System - Long Séjour', mode: 'payment' },
  // Pack Voyage Serein
  voyage_serein_short: { priceId: 'price_1SzetlRxqcfmHXQY0k2bC7C3', amount: 9900, name: 'Pack Voyage Serein - Court', mode: 'payment' },
  voyage_serein_medium: { priceId: 'price_1SzetmRxqcfmHXQYO5BQyB88', amount: 14900, name: 'Pack Voyage Serein - Standard', mode: 'payment' },
  voyage_serein_long: { priceId: 'price_1SzetnRxqcfmHXQYwngSwuMs', amount: 19900, name: 'Pack Voyage Serein - Long', mode: 'payment' },
  // Pack Ultime
  pack_ultime_medium: { priceId: 'price_1SzetoRxqcfmHXQYtB1zMCRt', amount: 36900, name: 'Pack Ultime - 2 semaines', mode: 'payment' },
  pack_ultime_long: { priceId: 'price_1SzetoRxqcfmHXQYmuKu9a1k', amount: 44900, name: 'Pack Ultime - 3+ semaines', mode: 'payment' },
  pack_ultime_expat: { priceId: 'price_1SzetpRxqcfmHXQY7dzoDhLl', amount: 54900, name: 'Pack Ultime - Expatriation', mode: 'payment' },
  // Guides PDF
  guide_pdf_visa: { priceId: 'price_1SzetqRxqcfmHXQYGv7pWnv4', amount: 1499, name: 'Guide Visa Philippines 2026', mode: 'payment' },
  guide_pdf_cout_vie: { priceId: 'price_1SzetqRxqcfmHXQYe9aotRWZ', amount: 1499, name: 'Guide Coût de la Vie', mode: 'payment' },
  guide_pdf_destinations: { priceId: 'price_1SzetrRxqcfmHXQYSwEQp4Qk', amount: 1999, name: 'Guide Destinations Secrètes', mode: 'payment' },
  guide_pdf_pack: { priceId: 'price_1SzetsRxqcfmHXQY88EewSEf', amount: 2499, name: 'Pack 3 Guides', mode: 'payment' },
  // Easy+
  easy_plus_monthly: { priceId: 'price_1SzettRxqcfmHXQYgVv8XvW8', amount: 2999, name: 'Easy+ Mensuel', mode: 'subscription' },
  easy_plus_yearly: { priceId: 'price_1SzettRxqcfmHXQYCCnr7Vpg', amount: 24900, name: 'Easy+ Annuel', mode: 'subscription' },
  easy_plus_lifetime: { priceId: 'price_1SzetuRxqcfmHXQYMQoa10Us', amount: 49900, name: 'Easy+ À Vie', mode: 'payment' },
  // Rencontre Premium
  rencontre_premium: { priceId: 'price_1SzetvRxqcfmHXQYHVh9NIMU', amount: 1999, name: 'Rencontre Premium', mode: 'subscription' },
};
