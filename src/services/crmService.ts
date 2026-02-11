import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  CRMConversation,
  CRMConversationWithMessages,
  CRMMessage,
  CRMNote,
  CustomerOverview,
} from '@/types/services';

// =====================================================
// Conversations
// =====================================================

export const getConversations = async (
  supabase: SupabaseClient,
  filters?: { customerId?: string; status?: string }
) => {
  let query = supabase
    .from('crm_conversations')
    .select('*, profiles:customer_id(username, avatar_url)')
    .order('last_message_at', { ascending: false });

  if (filters?.customerId) query = query.eq('customer_id', filters.customerId);
  if (filters?.status) query = query.eq('status', filters.status);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching conversations:', error);
    return { data: null, error };
  }
  return { data: data as CRMConversationWithMessages[], error: null };
};

export const getConversationsByUser = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('crm_conversations')
    .select('*')
    .eq('customer_id', userId)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching user conversations:', error);
    return { data: null, error };
  }
  return { data: data as CRMConversation[], error: null };
};

// =====================================================
// Messages
// =====================================================

export const getMessages = async (supabase: SupabaseClient, conversationId: string) => {
  const { data, error } = await supabase
    .from('crm_messages')
    .select('*, profiles:from_user_id(username, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return { data: null, error };
  }
  return { data: data as (CRMMessage & { profiles: { username: string; avatar_url: string } })[], error: null };
};

export const sendMessage = async (
  supabase: SupabaseClient,
  conversationId: string,
  fromUserId: string,
  content: string,
  isAdminMessage: boolean,
  toUserId?: string
) => {
  const { data, error } = await supabase
    .from('crm_messages')
    .insert({
      conversation_id: conversationId,
      from_user_id: fromUserId,
      to_user_id: toUserId || null,
      content,
      is_admin_message: isAdminMessage,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return { data: null, error };
  }

  // Update conversation last_message_at and status
  const newStatus = isAdminMessage ? 'waiting_customer' : 'waiting_admin';
  await supabase
    .from('crm_conversations')
    .update({ last_message_at: new Date().toISOString(), status: newStatus })
    .eq('id', conversationId);

  return { data: data as CRMMessage, error: null };
};

export const markMessagesAsRead = async (
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
) => {
  const { error } = await supabase
    .from('crm_messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('from_user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error marking messages as read:', error);
  }
  return { error };
};

export const getUnreadCount = async (supabase: SupabaseClient, userId: string) => {
  const { count, error } = await supabase
    .from('crm_messages')
    .select('*', { count: 'exact', head: true })
    .or(`to_user_id.eq.${userId}`)
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    return { data: 0, error };
  }
  return { data: count || 0, error: null };
};

// =====================================================
// Notes (admin only)
// =====================================================

export const getNotes = async (supabase: SupabaseClient, customerId: string) => {
  const { data, error } = await supabase
    .from('crm_notes')
    .select('*, profiles:admin_id(username)')
    .eq('customer_id', customerId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    return { data: null, error };
  }
  return { data: data as (CRMNote & { profiles: { username: string } })[], error: null };
};

export const createNote = async (
  supabase: SupabaseClient,
  customerId: string,
  adminId: string,
  content: string,
  relatedPurchaseId?: string
) => {
  const { data, error } = await supabase
    .from('crm_notes')
    .insert({
      customer_id: customerId,
      admin_id: adminId,
      content,
      related_purchase_id: relatedPurchaseId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating note:', error);
    return { data: null, error };
  }
  return { data: data as CRMNote, error: null };
};

export const toggleNotePin = async (
  supabase: SupabaseClient,
  noteId: string,
  isPinned: boolean
) => {
  const { error } = await supabase
    .from('crm_notes')
    .update({ is_pinned: isPinned })
    .eq('id', noteId);

  if (error) {
    console.error('Error toggling note pin:', error);
  }
  return { error };
};

// =====================================================
// Customer Overview (admin)
// =====================================================

export const getCustomerOverview = async (
  supabase: SupabaseClient,
  customerId: string
): Promise<{ data: CustomerOverview | null; error: any }> => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, whatsapp_number, customer_since, total_spent, easy_plus_expires_at, rencontre_premium_expires_at')
    .eq('id', customerId)
    .single();

  if (profileError || !profile) {
    return { data: null, error: profileError };
  }

  // Get active services
  const { data: purchases } = await supabase
    .from('service_purchases')
    .select('service_type')
    .eq('user_id', customerId)
    .eq('status', 'active');

  // Get unread messages count
  const { count: unreadMessages } = await supabase
    .from('crm_messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', customerId)
    .eq('is_read', false)
    .eq('is_admin_message', true);

  const { count: purchasesCount } = await supabase
    .from('service_purchases')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', customerId)
    .is('parent_purchase_id', null);

  return {
    data: {
      ...profile,
      active_services: (purchases || []).map((p: any) => p.service_type),
      purchases_count: purchasesCount || 0,
      unread_messages: unreadMessages || 0,
    },
    error: null,
  };
};
