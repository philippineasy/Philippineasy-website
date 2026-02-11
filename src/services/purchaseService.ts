import type { SupabaseClient } from '@supabase/supabase-js';
import type { ServicePurchase, ServiceType, PurchaseStatus } from '@/types/services';

export const getUserPurchases = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('service_purchases')
    .select('*')
    .eq('user_id', userId)
    .is('parent_purchase_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user purchases:', error);
    return { data: null, error };
  }
  return { data: data as ServicePurchase[], error: null };
};

export const getActivePurchases = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('service_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active purchases:', error);
    return { data: null, error };
  }
  return { data: data as ServicePurchase[], error: null };
};

export const getPurchaseById = async (supabase: SupabaseClient, purchaseId: string) => {
  const { data, error } = await supabase
    .from('service_purchases')
    .select('*')
    .eq('id', purchaseId)
    .single();

  if (error) {
    console.error('Error fetching purchase:', error);
    return { data: null, error };
  }
  return { data: data as ServicePurchase, error: null };
};

export const getSubPurchases = async (supabase: SupabaseClient, parentPurchaseId: string) => {
  const { data, error } = await supabase
    .from('service_purchases')
    .select('*')
    .eq('parent_purchase_id', parentPurchaseId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sub-purchases:', error);
    return { data: null, error };
  }
  return { data: data as ServicePurchase[], error: null };
};

export const hasActiveService = async (
  supabase: SupabaseClient,
  userId: string,
  serviceType: ServiceType
) => {
  const { data, error } = await supabase
    .from('service_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('service_type', serviceType)
    .eq('status', 'active')
    .limit(1);

  if (error) {
    console.error('Error checking active service:', error);
    return { data: false, error };
  }
  return { data: (data?.length ?? 0) > 0, error: null };
};

export const updatePurchaseStatus = async (
  supabase: SupabaseClient,
  purchaseId: string,
  status: PurchaseStatus,
  extra?: Partial<ServicePurchase>
) => {
  const { error } = await supabase
    .from('service_purchases')
    .update({ status, ...extra, updated_at: new Date().toISOString() })
    .eq('id', purchaseId);

  if (error) {
    console.error('Error updating purchase status:', error);
    return { error };
  }
  return { error: null };
};
