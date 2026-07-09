// ---------------------------------------------------------------------------
// Chat du site (remplacement Tawk.to) — types partagés widget / API / admin
// ---------------------------------------------------------------------------

export const CHAT_CATEGORIES = {
  aide: {
    label: 'Aide & questions',
    emoji: '💬',
    description: 'Une question sur le voyage, le site, la communauté ?',
    ai: true,
  },
  offres: {
    label: 'Nos offres',
    emoji: '🧭',
    description: 'Itinéraires personnalisés, packs accompagnement, Easy+…',
    ai: true,
  },
  remboursement: {
    label: 'Remboursement',
    emoji: '💳',
    description: 'Un souci avec une commande ? Hugo te répond en personne.',
    ai: false,
  },
  partenariat: {
    label: 'Partenariat',
    emoji: '🤝',
    description: 'Collaboration, presse, affiliation.',
    ai: false,
  },
  contact: {
    label: 'Contacter Hugo',
    emoji: '👋',
    description: 'Message direct, sans intermédiaire.',
    ai: false,
  },
} as const;

export type ChatCategory = keyof typeof CHAT_CATEGORIES;

export function isChatCategory(value: unknown): value is ChatCategory {
  return typeof value === 'string' && value in CHAT_CATEGORIES;
}

export type ChatSender = 'visitor' | 'ai' | 'admin';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: ChatSender;
  content: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  visitor_key: string;
  user_id: string | null;
  category: ChatCategory;
  visitor_name: string | null;
  visitor_email: string | null;
  status: 'open' | 'closed';
  admin_unread_count: number;
  last_message_at: string;
  last_message_preview: string | null;
  last_email_notif_at: string | null;
  created_at: string;
}

/** Réponse d'accusé de réception pour les catégories sans IA (relay direct). */
export const DIRECT_ACK: Record<Exclude<ChatCategory, 'aide' | 'offres'>, string> = {
  remboursement:
    "C'est transmis ✅ Hugo traite personnellement les demandes de remboursement, en général sous 24 h. " +
    'Tu peux garder cette fenêtre ouverte ou revenir plus tard : sa réponse apparaîtra ici même' +
    " (et par email si tu l'as renseigné).",
  partenariat:
    'Merci pour ta proposition ✅ Elle vient d’être transmise à Hugo, qui te répondra ici même' +
    " (et par email si tu l'as renseigné).",
  contact:
    'Ton message est bien parti ✅ Hugo est notifié en direct et te répond ici même dès que possible' +
    " (et par email si tu l'as renseigné).",
};
