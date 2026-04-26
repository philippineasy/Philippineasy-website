import type { SupabaseClient } from '@supabase/supabase-js';
import type { PurchaseEntitlement, EntitlementSummary, FeatureType } from '@/types/services';

export const getEntitlementsByUser = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('purchase_entitlements')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['available', 'in_use'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user entitlements:', error);
    return { data: null, error };
  }
  return { data: data as PurchaseEntitlement[], error: null };
};

export const getEntitlementsByPurchase = async (supabase: SupabaseClient, purchaseId: string) => {
  const { data, error } = await supabase
    .from('purchase_entitlements')
    .select('*')
    .eq('purchase_id', purchaseId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching purchase entitlements:', error);
    return { data: null, error };
  }
  return { data: data as PurchaseEntitlement[], error: null };
};

export const consumeEntitlement = async (
  supabase: SupabaseClient,
  entitlementId: string,
  adminId?: string
) => {
  // Lire l'état pour calculer used+1 et déterminer si c'est le dernier usage.
  // (Le claim atomique ci-dessous protège contre le double-spend en imposant
  // que used_quantity n'a pas changé depuis cette lecture.)
  const { data: entitlement, error: fetchError } = await supabase
    .from('purchase_entitlements')
    .select('*')
    .eq('id', entitlementId)
    .single();

  if (fetchError || !entitlement) {
    console.error('Error fetching entitlement:', fetchError);
    return { data: null, error: fetchError || new Error('Entitlement not found') };
  }

  const currentUsed = entitlement.used_quantity;
  const newUsed = currentUsed + 1;
  const isFullyUsed = entitlement.total_quantity !== null && newUsed >= entitlement.total_quantity;

  // Garde quota : si total défini, refuser si on dépasse
  if (entitlement.total_quantity !== null && newUsed > entitlement.total_quantity) {
    return { data: null, error: new Error('Entitlement quota exhausted') };
  }

  const updatePayload: Record<string, unknown> = {
    used_quantity: newUsed,
    status: isFullyUsed ? 'fully_used' : 'in_use',
    updated_at: new Date().toISOString(),
  };

  if (adminId) {
    updatePayload.validated_by = adminId;
    updatePayload.validated_at = new Date().toISOString();
  }

  // UPDATE atomique : la clause .eq('used_quantity', currentUsed) garantit
  // qu'aucun autre process n'a consommé entre notre lecture et l'écriture.
  // Si une race a lieu, .select() retourne 0 row → on retry/échoue proprement.
  const { data: updated, error: updateError } = await supabase
    .from('purchase_entitlements')
    .update(updatePayload)
    .eq('id', entitlementId)
    .eq('used_quantity', currentUsed)
    .select('id');

  if (updateError) {
    console.error('Error consuming entitlement:', updateError);
    return { data: null, error: updateError };
  }
  if (!updated || updated.length === 0) {
    return { data: null, error: new Error('Concurrent modification — please retry') };
  }

  return { data: { ...entitlement, ...updatePayload }, error: null };
};

export const getEntitlementSummary = async (
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: EntitlementSummary[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('purchase_entitlements')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['available', 'in_use'])
    .order('feature_type');

  if (error) {
    console.error('Error fetching entitlement summary:', error);
    return { data: null, error };
  }

  const summaries: EntitlementSummary[] = (data as PurchaseEntitlement[]).map((e) => ({
    feature_type: e.feature_type,
    total: e.total_quantity,
    used: e.used_quantity,
    remaining: e.total_quantity !== null ? Math.max(0, e.total_quantity - e.used_quantity) : null,
    status: e.status,
    expires_at: e.expires_at,
    starts_at: e.starts_at,
    purchase_id: e.purchase_id,
    entitlement_id: e.id,
  }));

  return { data: summaries, error: null };
};

export const createEntitlements = async (
  supabase: SupabaseClient,
  purchaseId: string,
  userId: string,
  entitlements: Array<{
    feature_type: FeatureType;
    total_quantity: number | null;
    duration_days: number | null;
  }>
) => {
  const now = new Date();
  const rows = entitlements.map((e) => ({
    purchase_id: purchaseId,
    user_id: userId,
    feature_type: e.feature_type,
    total_quantity: e.total_quantity,
    used_quantity: 0,
    status: 'available',
    starts_at: now.toISOString(),
    expires_at: e.duration_days
      ? new Date(now.getTime() + e.duration_days * 24 * 60 * 60 * 1000).toISOString()
      : null,
  }));

  const { data, error } = await supabase
    .from('purchase_entitlements')
    .insert(rows)
    .select();

  if (error) {
    console.error('Error creating entitlements:', error);
    return { data: null, error };
  }
  return { data: data as PurchaseEntitlement[], error: null };
};

export const checkExpiredEntitlements = async (supabase: SupabaseClient) => {
  const { error } = await supabase
    .from('purchase_entitlements')
    .update({ status: 'expired', updated_at: new Date().toISOString() })
    .in('status', ['available', 'in_use'])
    .lt('expires_at', new Date().toISOString())
    .not('expires_at', 'is', null);

  if (error) {
    console.error('Error expiring entitlements:', error);
    return { error };
  }
  return { error: null };
};
