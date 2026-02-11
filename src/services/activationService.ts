import type { SupabaseClient } from '@supabase/supabase-js';
import type { ServiceType } from '@/types/services';
import { PACK_ENTITLEMENTS } from '@/types/services';
import { createEntitlements } from './entitlementService';

/**
 * Main activation function called after successful payment.
 * Routes to the appropriate activation logic based on service_type.
 */
export async function activateService(supabase: SupabaseClient, purchaseId: string) {
  // Fetch purchase
  const { data: purchase, error: fetchError } = await supabase
    .from('service_purchases')
    .select('*')
    .eq('id', purchaseId)
    .single();

  if (fetchError || !purchase) {
    console.error(`activateService: purchase ${purchaseId} not found`, fetchError);
    return { error: fetchError || new Error('Purchase not found') };
  }

  if (purchase.status !== 'paid') {
    console.error(`activateService: purchase ${purchaseId} status is ${purchase.status}, expected 'paid'`);
    return { error: new Error(`Invalid status: ${purchase.status}`) };
  }

  // Mark as activating
  await supabase
    .from('service_purchases')
    .update({ status: 'activating', updated_at: new Date().toISOString() })
    .eq('id', purchaseId);

  const serviceType = purchase.service_type as ServiceType;
  const userId = purchase.user_id;

  try {
    // Create entitlements from pack config
    const packConfig = PACK_ENTITLEMENTS[serviceType];
    if (packConfig) {
      await createEntitlements(supabase, purchaseId, userId, packConfig);
    }

    // Service-specific activation logic
    if (serviceType.startsWith('buddy_')) {
      await activateBuddy(supabase, purchaseId, userId, serviceType);
    } else if (serviceType.startsWith('voyage_serein_')) {
      await activateVoyageSerein(supabase, purchaseId, userId, serviceType);
    } else if (serviceType.startsWith('pack_ultime_')) {
      await activatePackUltime(supabase, purchaseId, userId, serviceType);
    } else if (serviceType.startsWith('easy_plus_')) {
      await activateEasyPlus(supabase, userId, serviceType);
    } else if (serviceType === 'rencontre_premium') {
      await activateRencontrePremium(supabase, userId);
    }
    // guide_pdf_* only need entitlements — no extra activation

    // Mark as active
    const now = new Date().toISOString();
    await supabase
      .from('service_purchases')
      .update({ status: 'active', activated_at: now, updated_at: now })
      .eq('id', purchaseId);

    // Log activation
    await supabase.from('service_activations').insert({
      purchase_id: purchaseId,
      activation_type: 'auto_webhook',
      details: { service_type: serviceType },
    });

    // Update customer stats
    await updateCustomerStats(supabase, userId, purchase.amount_paid);

    console.log(`Service activated: ${serviceType} for user ${userId}`);
    return { error: null };
  } catch (err) {
    console.error(`activateService failed for ${purchaseId}:`, err);
    // Revert to paid so it can be retried
    await supabase
      .from('service_purchases')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', purchaseId);
    return { error: err };
  }
}

async function activateBuddy(
  supabase: SupabaseClient,
  purchaseId: string,
  userId: string,
  serviceType: ServiceType
) {
  const callsMap: Record<string, number> = {
    buddy_short: 2,
    buddy_medium: 3,
    buddy_long: 4,
  };
  const totalCalls = callsMap[serviceType] || 2;

  // Create empty call bookings
  const bookings = Array.from({ length: totalCalls }, (_, i) => ({
    purchase_id: purchaseId,
    user_id: userId,
    call_number: i + 1,
    total_calls: totalCalls,
    status: 'scheduled',
  }));

  await supabase.from('call_bookings').insert(bookings);

  // Create CRM conversation
  await createWelcomeConversation(supabase, userId, purchaseId, 'Buddy System');
}

async function activateVoyageSerein(
  supabase: SupabaseClient,
  purchaseId: string,
  userId: string,
  serviceType: ServiceType
) {
  // Create 1 call booking
  await supabase.from('call_bookings').insert({
    purchase_id: purchaseId,
    user_id: userId,
    call_number: 1,
    total_calls: 1,
    status: 'scheduled',
  });

  // Create CRM conversation
  await createWelcomeConversation(supabase, userId, purchaseId, 'Pack Voyage Serein');
}

async function activatePackUltime(
  supabase: SupabaseClient,
  purchaseId: string,
  userId: string,
  serviceType: ServiceType
) {
  const callsMap: Record<string, number> = {
    pack_ultime_medium: 3,
    pack_ultime_long: 4,
    pack_ultime_expat: 4,
  };
  const totalCalls = callsMap[serviceType] || 3;

  // Create call bookings
  const bookings = Array.from({ length: totalCalls }, (_, i) => ({
    purchase_id: purchaseId,
    user_id: userId,
    call_number: i + 1,
    total_calls: totalCalls,
    status: 'scheduled',
  }));
  await supabase.from('call_bookings').insert(bookings);

  // Activate Easy+ on profile
  await activateEasyPlus(supabase, userId, 'easy_plus_yearly');

  // Activate Rencontre Premium on profile
  await activateRencontrePremium(supabase, userId);

  // Create CRM conversation
  await createWelcomeConversation(supabase, userId, purchaseId, 'Pack Ultime');
}

async function activateEasyPlus(
  supabase: SupabaseClient,
  userId: string,
  serviceType: ServiceType
) {
  const durationDays: Record<string, number | null> = {
    easy_plus_monthly: 30,
    easy_plus_yearly: 365,
    easy_plus_lifetime: null,
  };
  const days = durationDays[serviceType];
  const expiresAt = days
    ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    : null;

  await supabase
    .from('profiles')
    .update({
      easy_plus_expires_at: expiresAt,
    })
    .eq('id', userId);
}

async function activateRencontrePremium(supabase: SupabaseClient, userId: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await supabase
    .from('profiles')
    .update({
      plan: 'premium',
      rencontre_premium_expires_at: expiresAt,
    })
    .eq('id', userId);
}

async function createWelcomeConversation(
  supabase: SupabaseClient,
  userId: string,
  purchaseId: string,
  serviceName: string
) {
  await supabase.from('crm_conversations').insert({
    customer_id: userId,
    subject: `Bienvenue - ${serviceName}`,
    status: 'open',
    related_purchase_id: purchaseId,
    last_message_at: new Date().toISOString(),
  });
}

async function updateCustomerStats(
  supabase: SupabaseClient,
  userId: string,
  amountPaid: number
) {
  // Update total_spent and customer_since
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_spent, customer_since')
    .eq('id', userId)
    .single();

  const updates: Record<string, unknown> = {
    total_spent: (profile?.total_spent || 0) + amountPaid,
  };

  if (!profile?.customer_since) {
    updates.customer_since = new Date().toISOString();
  }

  await supabase.from('profiles').update(updates).eq('id', userId);
}
