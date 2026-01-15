// Configuration des prix pour la page Services
// Nouveaux packs: Buddy System, Pack Voyage Serein, Pack Ultime

export type ServiceDuration = 'short' | 'medium' | 'long' | 'expat';
export type ServiceType = 'buddy' | 'voyage-serein' | 'pack-ultime' | 'guide-pdf' | 'easy-plus';

// IDs des produits Stripe (à créer dans Stripe Dashboard)
export const SERVICE_STRIPE_PRODUCTS = {
  buddy: 'prod_PLACEHOLDER_BUDDY',
  'voyage-serein': 'prod_PLACEHOLDER_VOYAGE_SEREIN',
  'pack-ultime': 'prod_PLACEHOLDER_PACK_ULTIME',
  'guide-pdf': 'prod_PLACEHOLDER_GUIDE_PDF',
  'easy-plus': 'prod_PLACEHOLDER_EASY_PLUS',
} as const;

// Grille tarifaire Buddy System
export const BUDDY_PRICING: Record<ServiceDuration, {
  price: number;
  priceId: string;
  calls: number;
  whatsappDuration: string;
} | null> = {
  short: { price: 79, priceId: '', calls: 2, whatsappDuration: '1 semaine' },
  medium: { price: 119, priceId: '', calls: 3, whatsappDuration: '2 semaines' },
  long: { price: 149, priceId: '', calls: 4, whatsappDuration: '1 mois' },
  expat: null, // Utilise 'long'
};

// Grille tarifaire Pack Voyage Serein
export const VOYAGE_SEREIN_PRICING: Record<ServiceDuration, {
  price: number;
  priceId: string;
  whatsappDuration: string;
} | null> = {
  short: { price: 99, priceId: '', whatsappDuration: '1 semaine' },
  medium: { price: 149, priceId: '', whatsappDuration: '2 semaines' },
  long: { price: 199, priceId: '', whatsappDuration: '3 semaines' },
  expat: null, // Utilise 'long'
};

// Grille tarifaire Pack Ultime
export const PACK_ULTIME_PRICING: Record<ServiceDuration, {
  price: number;
  priceId: string;
} | null> = {
  short: null, // Non disponible pour séjours courts
  medium: { price: 369, priceId: '' },
  long: { price: 449, priceId: '' },
  expat: { price: 549, priceId: '' },
};

// Guides PDF
export const GUIDE_PDF_PRICING = {
  visa: { price: 14.99, priceId: '', name: 'Guide Visa Philippines 2026' },
  'cout-vie': { price: 14.99, priceId: '', name: 'Guide Coût de la Vie' },
  destinations: { price: 19.99, priceId: '', name: 'Guide Destinations Secrètes' },
  pack: { price: 24.99, priceId: '', name: 'Pack 3 Guides', originalPrice: 49.97 },
} as const;

// Easy+ Pricing
export const EASY_PLUS_PRICING = {
  monthly: { price: 29.99, priceId: '', period: 'mois', minEngagement: 3 },
  yearly: { price: 249, priceId: '', period: 'an', savings: '31%' },
  lifetime: { price: 499, priceId: '', period: 'à vie' },
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
