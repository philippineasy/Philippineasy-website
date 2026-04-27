import type { SupabaseClient } from '@supabase/supabase-js';
import type { CallSlot, CallBooking, CallBookingWithSlot, CallStatus } from '@/types/services';

export const getAvailableSlots = async (
  supabase: SupabaseClient,
  from?: string,
  to?: string
) => {
  let query = supabase
    .from('call_slots')
    .select('*')
    .eq('is_available', true)
    .order('starts_at', { ascending: true });

  if (from) query = query.gte('starts_at', from);
  if (to) query = query.lte('starts_at', to);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching available slots:', error);
    return { data: null, error };
  }
  return { data: data as CallSlot[], error: null };
};

export const bookSlot = async (
  supabase: SupabaseClient,
  bookingId: string,
  slotId: string
) => {
  // UPDATE atomique : ne marque le slot pris QUE s'il est encore dispo.
  // Si deux clients réservent en parallèle, un seul .select() retourne une row.
  const { data: claimed, error: claimErr } = await supabase
    .from('call_slots')
    .update({ is_available: false })
    .eq('id', slotId)
    .eq('is_available', true)
    .select('id, starts_at');

  if (claimErr) {
    console.error('Error booking slot:', claimErr);
    return { data: null, error: claimErr };
  }
  if (!claimed || claimed.length === 0) {
    return { data: null, error: new Error('Slot not available') };
  }
  const slot = claimed[0];

  const { data, error } = await supabase
    .from('call_bookings')
    .update({
      slot_id: slotId,
      scheduled_at: slot.starts_at,
      status: 'confirmed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    // Compensating action : libérer le slot si le booking a échoué
    await supabase.from('call_slots').update({ is_available: true }).eq('id', slotId);
    console.error('Error updating booking:', error);
    return { data: null, error };
  }
  return { data: data as CallBooking, error: null };
};

export const updateCallStatus = async (
  supabase: SupabaseClient,
  bookingId: string,
  status: CallStatus,
  extra?: Partial<CallBooking>
) => {
  // Lit l'etat actuel pour : (1) detecter si on liber un slot reservable,
  // (2) detecter si on consomme un credit call_30min de l'entitlement
  const { data: existing } = await supabase
    .from('call_bookings')
    .select('purchase_id, user_id, slot_id, status')
    .eq('id', bookingId)
    .single();

  if (!existing) {
    return { data: null, error: new Error('Booking not found') };
  }

  const updatePayload: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
    ...extra,
  };

  if (status === 'completed') {
    updatePayload.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('call_bookings')
    .update(updatePayload)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating call status:', error);
    return { data: null, error };
  }

  // Side effects post-update :
  const wasReserved = existing.status === 'scheduled' || existing.status === 'confirmed';

  // 1) Liberation du slot calendrier si annulation/no-show (slot redevient
  //    reservable par d'autres clients).
  if ((status === 'cancelled' || status === 'no_show') && existing.slot_id && wasReserved) {
    await supabase
      .from('call_slots')
      .update({ is_available: true })
      .eq('id', existing.slot_id);
  }

  // 2) Liberation du credit call_30min sur l'entitlement :
  //    - cancelled = annulation avant l'appel -> credit rendu (decrement used_quantity)
  //    - no_show   = client a rate l'appel    -> NE PAS rendre le credit (penalite)
  //    - completed = appel realise            -> consomme le credit (increment used_quantity)
  if (existing.purchase_id) {
    if (status === 'cancelled' && wasReserved) {
      await refundCallCredit(supabase, existing.purchase_id, existing.user_id);
    } else if (status === 'completed' && existing.status !== 'completed') {
      await consumeCallCredit(supabase, existing.purchase_id, existing.user_id);
    }
  }

  return { data: data as CallBooking, error: null };
};

/** Decremente atomiquement used_quantity du call_30min entitlement lie au pack. */
async function refundCallCredit(supabase: SupabaseClient, purchaseId: string, userId: string) {
  const { data: ent } = await supabase
    .from('purchase_entitlements')
    .select('id, used_quantity, status')
    .eq('purchase_id', purchaseId)
    .eq('user_id', userId)
    .eq('feature_type', 'call_30min')
    .maybeSingle();

  if (!ent || ent.used_quantity <= 0) return;

  const newUsed = ent.used_quantity - 1;
  await supabase
    .from('purchase_entitlements')
    .update({
      used_quantity: newUsed,
      // Si etait fully_used, repasse en in_use (credit a nouveau dispo)
      status: ent.status === 'fully_used' ? 'in_use' : ent.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ent.id)
    .eq('used_quantity', ent.used_quantity); // CAS atomique
}

/** Incremente atomiquement used_quantity quand l'appel est completed. */
async function consumeCallCredit(supabase: SupabaseClient, purchaseId: string, userId: string) {
  const { data: ent } = await supabase
    .from('purchase_entitlements')
    .select('id, total_quantity, used_quantity')
    .eq('purchase_id', purchaseId)
    .eq('user_id', userId)
    .eq('feature_type', 'call_30min')
    .maybeSingle();

  if (!ent) return;

  const newUsed = ent.used_quantity + 1;
  const isFullyUsed = ent.total_quantity !== null && newUsed >= ent.total_quantity;

  await supabase
    .from('purchase_entitlements')
    .update({
      used_quantity: newUsed,
      status: isFullyUsed ? 'fully_used' : 'in_use',
      updated_at: new Date().toISOString(),
    })
    .eq('id', ent.id)
    .eq('used_quantity', ent.used_quantity);
}

export const getCallsByUser = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('call_bookings')
    .select('*, call_slots(*)')
    .eq('user_id', userId)
    .order('scheduled_at', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching user calls:', error);
    return { data: null, error };
  }
  return { data: data as CallBookingWithSlot[], error: null };
};

export const getCallsByPurchase = async (supabase: SupabaseClient, purchaseId: string) => {
  const { data, error } = await supabase
    .from('call_bookings')
    .select('*, call_slots(*)')
    .eq('purchase_id', purchaseId)
    .order('call_number', { ascending: true });

  if (error) {
    console.error('Error fetching purchase calls:', error);
    return { data: null, error };
  }
  return { data: data as CallBookingWithSlot[], error: null };
};

// Admin: get all upcoming calls
export const getUpcomingCalls = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from('call_bookings')
    .select('*, call_slots(*), profiles:user_id(username, avatar_url)')
    .in('status', ['scheduled', 'confirmed'])
    .order('scheduled_at', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching upcoming calls:', error);
    return { data: null, error };
  }
  return { data, error: null };
};

// Admin: manage slots
export const createSlot = async (
  supabase: SupabaseClient,
  adminId: string,
  startsAt: string,
  endsAt: string
) => {
  const { data, error } = await supabase
    .from('call_slots')
    .insert({ admin_id: adminId, starts_at: startsAt, ends_at: endsAt, is_available: true })
    .select()
    .single();

  if (error) {
    console.error('Error creating slot:', error);
    return { data: null, error };
  }
  return { data: data as CallSlot, error: null };
};

export const deleteSlot = async (supabase: SupabaseClient, slotId: string) => {
  const { error } = await supabase
    .from('call_slots')
    .delete()
    .eq('id', slotId)
    .eq('is_available', true);

  if (error) {
    console.error('Error deleting slot:', error);
    return { error };
  }
  return { error: null };
};
