// Types for the CRM & Service Activation system

export type ServiceType =
  | 'buddy_short' | 'buddy_medium' | 'buddy_long'
  | 'voyage_serein_short' | 'voyage_serein_medium' | 'voyage_serein_long'
  | 'pack_ultime_medium' | 'pack_ultime_long' | 'pack_ultime_expat'
  | 'guide_pdf_visa' | 'guide_pdf_cout_vie' | 'guide_pdf_destinations' | 'guide_pdf_pack'
  | 'easy_plus_monthly' | 'easy_plus_yearly' | 'easy_plus_lifetime'
  | 'rencontre_premium';

export type PurchaseStatus = 'pending' | 'paid' | 'activating' | 'active' | 'expired' | 'cancelled' | 'refunded';

export type ActivationType = 'auto_webhook' | 'manual_admin' | 'pack_decomposition';

export type CallStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type ConversationStatus = 'open' | 'closed' | 'waiting_customer' | 'waiting_admin';

export type EntitlementStatus = 'available' | 'in_use' | 'fully_used' | 'expired';

export type FeatureType =
  | 'call_30min' | 'whatsapp_support' | 'itinerary_conciergerie' | 'itinerary_premium'
  | 'easy_plus' | 'rencontre_premium' | 'guide_pdf_visa' | 'guide_pdf_cout_vie'
  | 'guide_pdf_destinations' | 'private_group' | 'unlimited_modifications';

// =====================================================
// Database row types
// =====================================================

export interface ServicePurchase {
  id: string;
  user_id: string;
  service_type: ServiceType;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_subscription_id: string | null;
  amount_paid: number;
  currency: string;
  status: PurchaseStatus;
  activated_at: string | null;
  expires_at: string | null;
  parent_purchase_id: string | null;
  metadata: Record<string, unknown>;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseEntitlement {
  id: string;
  purchase_id: string;
  user_id: string;
  feature_type: FeatureType;
  total_quantity: number | null;
  used_quantity: number;
  status: EntitlementStatus;
  starts_at: string;
  expires_at: string | null;
  metadata: Record<string, unknown>;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceActivation {
  id: string;
  purchase_id: string;
  activation_type: ActivationType;
  details: Record<string, unknown>;
  activated_by: string | null;
  created_at: string;
}

export interface CallSlot {
  id: string;
  admin_id: string;
  starts_at: string;
  ends_at: string;
  is_available: boolean;
  created_at: string;
}

export interface CallBooking {
  id: string;
  purchase_id: string;
  slot_id: string | null;
  user_id: string;
  call_number: number;
  total_calls: number;
  status: CallStatus;
  scheduled_at: string | null;
  completed_at: string | null;
  duration_minutes: number | null;
  admin_notes: string | null;
  user_notes: string | null;
  call_summary: string | null;
  meeting_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CRMConversation {
  id: string;
  customer_id: string;
  admin_id: string | null;
  subject: string;
  status: ConversationStatus;
  last_message_at: string;
  related_purchase_id: string | null;
  created_at: string;
}

export interface CRMMessage {
  id: string;
  conversation_id: string;
  from_user_id: string;
  to_user_id: string | null;
  content: string;
  is_read: boolean;
  is_admin_message: boolean;
  related_purchase_id: string | null;
  created_at: string;
}

export interface CRMNote {
  id: string;
  customer_id: string;
  admin_id: string;
  content: string;
  is_pinned: boolean;
  related_purchase_id: string | null;
  created_at: string;
}

// =====================================================
// Joined / enriched types for UI
// =====================================================

export interface ServicePurchaseWithProfile extends ServicePurchase {
  profiles?: {
    username: string;
    avatar_url: string;
    role: string;
  };
}

export interface CallBookingWithSlot extends CallBooking {
  call_slots?: CallSlot | null;
}

export interface CRMConversationWithMessages extends CRMConversation {
  crm_messages?: CRMMessage[];
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

// =====================================================
// Entitlement summary for dashboard display
// =====================================================

export interface EntitlementSummary {
  feature_type: FeatureType;
  total: number | null;
  used: number;
  remaining: number | null;
  status: EntitlementStatus;
  expires_at: string | null;
  starts_at: string;
  purchase_id: string;
  entitlement_id: string;
}

// =====================================================
// Customer overview for admin CRM
// =====================================================

export interface CustomerOverview {
  id: string;
  username: string;
  avatar_url: string;
  email?: string;
  whatsapp_number: string | null;
  customer_since: string | null;
  total_spent: number;
  easy_plus_expires_at: string | null;
  rencontre_premium_expires_at: string | null;
  active_services: ServiceType[];
  purchases_count: number;
  unread_messages: number;
}

// =====================================================
// Feature display config (for UI components)
// =====================================================

export const FEATURE_DISPLAY: Record<FeatureType, {
  label: string;
  icon: string;
  unit: string;
  isTimeBased: boolean;
}> = {
  call_30min: { label: 'Appels Buddy (30min)', icon: 'faPhone', unit: 'appels', isTimeBased: false },
  whatsapp_support: { label: 'Support WhatsApp', icon: 'faWhatsapp', unit: 'jours', isTimeBased: true },
  itinerary_conciergerie: { label: 'Itinéraire Conciergerie', icon: 'faMapMarkedAlt', unit: 'itinéraire', isTimeBased: false },
  itinerary_premium: { label: 'Itinéraire Premium', icon: 'faMap', unit: 'itinéraire', isTimeBased: false },
  easy_plus: { label: 'Easy+', icon: 'faStar', unit: 'abonnement', isTimeBased: true },
  rencontre_premium: { label: 'Rencontre Premium', icon: 'faHeart', unit: 'abonnement', isTimeBased: true },
  guide_pdf_visa: { label: 'Guide Visa Philippines', icon: 'faFileDownload', unit: 'téléchargement', isTimeBased: false },
  guide_pdf_cout_vie: { label: 'Guide Coût de la Vie', icon: 'faFileDownload', unit: 'téléchargement', isTimeBased: false },
  guide_pdf_destinations: { label: 'Guide Destinations Secrètes', icon: 'faFileDownload', unit: 'téléchargement', isTimeBased: false },
  private_group: { label: 'Groupe Privé', icon: 'faUserFriends', unit: 'accès', isTimeBased: false },
  unlimited_modifications: { label: 'Modifications Illimitées', icon: 'faEdit', unit: 'accès', isTimeBased: false },
};

// =====================================================
// Pack decomposition config
// =====================================================

export type PackEntitlementConfig = {
  feature_type: FeatureType;
  total_quantity: number | null;
  duration_days: number | null; // null = permanent
};

export const PACK_ENTITLEMENTS: Record<string, PackEntitlementConfig[]> = {
  buddy_short: [
    { feature_type: 'call_30min', total_quantity: 2, duration_days: 21 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 7 },
  ],
  buddy_medium: [
    { feature_type: 'call_30min', total_quantity: 3, duration_days: 30 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 14 },
  ],
  buddy_long: [
    { feature_type: 'call_30min', total_quantity: 4, duration_days: 45 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 30 },
  ],
  voyage_serein_short: [
    { feature_type: 'call_30min', total_quantity: 1, duration_days: 21 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 7 },
    { feature_type: 'itinerary_premium', total_quantity: 1, duration_days: null },
  ],
  voyage_serein_medium: [
    { feature_type: 'call_30min', total_quantity: 1, duration_days: 30 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 14 },
    { feature_type: 'itinerary_premium', total_quantity: 1, duration_days: null },
  ],
  voyage_serein_long: [
    { feature_type: 'call_30min', total_quantity: 1, duration_days: 45 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 21 },
    { feature_type: 'itinerary_premium', total_quantity: 1, duration_days: null },
  ],
  pack_ultime_medium: [
    { feature_type: 'itinerary_conciergerie', total_quantity: 1, duration_days: 60 },
    { feature_type: 'call_30min', total_quantity: 3, duration_days: 30 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 14 },
    { feature_type: 'easy_plus', total_quantity: 1, duration_days: 365 },
    { feature_type: 'rencontre_premium', total_quantity: 1, duration_days: 180 },
    { feature_type: 'guide_pdf_visa', total_quantity: 1, duration_days: null },
    { feature_type: 'private_group', total_quantity: 1, duration_days: null },
  ],
  pack_ultime_long: [
    { feature_type: 'itinerary_conciergerie', total_quantity: 1, duration_days: 90 },
    { feature_type: 'call_30min', total_quantity: 4, duration_days: 45 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 21 },
    { feature_type: 'easy_plus', total_quantity: 1, duration_days: 365 },
    { feature_type: 'rencontre_premium', total_quantity: 1, duration_days: 180 },
    { feature_type: 'guide_pdf_visa', total_quantity: 1, duration_days: null },
    { feature_type: 'private_group', total_quantity: 1, duration_days: null },
  ],
  pack_ultime_expat: [
    { feature_type: 'itinerary_conciergerie', total_quantity: 1, duration_days: 120 },
    { feature_type: 'call_30min', total_quantity: 4, duration_days: 60 },
    { feature_type: 'whatsapp_support', total_quantity: null, duration_days: 30 },
    { feature_type: 'easy_plus', total_quantity: 1, duration_days: 365 },
    { feature_type: 'rencontre_premium', total_quantity: 1, duration_days: 180 },
    { feature_type: 'guide_pdf_visa', total_quantity: 1, duration_days: null },
    { feature_type: 'guide_pdf_cout_vie', total_quantity: 1, duration_days: null },
    { feature_type: 'private_group', total_quantity: 1, duration_days: null },
  ],
  guide_pdf_visa: [
    { feature_type: 'guide_pdf_visa', total_quantity: 1, duration_days: null },
  ],
  guide_pdf_cout_vie: [
    { feature_type: 'guide_pdf_cout_vie', total_quantity: 1, duration_days: null },
  ],
  guide_pdf_destinations: [
    { feature_type: 'guide_pdf_destinations', total_quantity: 1, duration_days: null },
  ],
  guide_pdf_pack: [
    { feature_type: 'guide_pdf_visa', total_quantity: 1, duration_days: null },
    { feature_type: 'guide_pdf_cout_vie', total_quantity: 1, duration_days: null },
    { feature_type: 'guide_pdf_destinations', total_quantity: 1, duration_days: null },
  ],
  easy_plus_monthly: [
    { feature_type: 'easy_plus', total_quantity: 1, duration_days: 30 },
  ],
  easy_plus_yearly: [
    { feature_type: 'easy_plus', total_quantity: 1, duration_days: 365 },
  ],
  easy_plus_lifetime: [
    { feature_type: 'easy_plus', total_quantity: 1, duration_days: null },
  ],
  rencontre_premium: [
    { feature_type: 'rencontre_premium', total_quantity: 1, duration_days: 30 },
  ],
};
