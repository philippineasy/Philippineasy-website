import type { SupabaseClient } from '@supabase/supabase-js';
import type { ServiceType } from '@/types/services';
import { PACK_ENTITLEMENTS } from '@/types/services';
import { createEntitlements } from './entitlementService';
import { sendServicePurchaseConfirmation } from '@/emails/senders/payment';
import { sendGuidePdfReady } from '@/emails/senders/lifecycle';
import { getUserEmail } from '@/emails/send';

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
    // guide_pdf_* — send download notification
    if (serviceType.startsWith('guide_pdf_')) {
      const guideUser = await getUserEmail(userId);
      if (guideUser) {
        const guideName = serviceType.replace('guide_pdf_', '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        sendGuidePdfReady(guideUser.email, guideUser.name, guideName).catch((err) =>
          console.error('Guide PDF email error:', err)
        );
      }
    }

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
    await updateCustomerStats(supabase, userId, Number(purchase.amount_paid ?? 0));

    // Send purchase confirmation email
    const user = await getUserEmail(userId);
    if (user) {
      const entitlementLabels = packConfig
        ? packConfig.map((e) => {
            const label = e.feature_type.replace(/_/g, ' ');
            const qty = e.total_quantity ? `x${e.total_quantity}` : 'illimite';
            const duration = e.duration_days ? `${e.duration_days}j` : 'permanent';
            return `${label} (${qty}, ${duration})`;
          })
        : [serviceType.replace(/_/g, ' ')];

      sendServicePurchaseConfirmation(
        user.email,
        user.name,
        serviceType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        `${purchase.amount_paid || 0} EUR`,
        entitlementLabels,
      ).catch((err) => console.error('Service purchase email error:', err));
    }

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

/** Helper idempotent : cree les call_bookings UNE SEULE FOIS par purchase_id.
 *  Si l'activation est rejouee (webhook retry), on ne re-cree pas les bookings. */
async function ensureCallBookings(
  supabase: SupabaseClient,
  purchaseId: string,
  userId: string,
  totalCalls: number,
) {
  const { data: existing } = await supabase
    .from('call_bookings')
    .select('id')
    .eq('purchase_id', purchaseId)
    .limit(1);

  if (existing && existing.length > 0) {
    console.log(`ensureCallBookings: bookings deja crees pour purchase ${purchaseId}, skip`);
    return;
  }

  const bookings = Array.from({ length: totalCalls }, (_, i) => ({
    purchase_id: purchaseId,
    user_id: userId,
    call_number: i + 1,
    total_calls: totalCalls,
    status: 'scheduled',
  }));
  await supabase.from('call_bookings').insert(bookings);
}

/** Helper idempotent : cree la conversation CRM UNE SEULE FOIS par purchase. */
async function ensureWelcomeConversation(
  supabase: SupabaseClient,
  userId: string,
  purchaseId: string,
  serviceName: string,
) {
  const { data: existing } = await supabase
    .from('crm_conversations')
    .select('id')
    .eq('related_purchase_id', purchaseId)
    .limit(1);
  if (existing && existing.length > 0) return;
  await createWelcomeConversation(supabase, userId, purchaseId, serviceName);
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

  await ensureCallBookings(supabase, purchaseId, userId, totalCalls);
  await ensureWelcomeConversation(supabase, userId, purchaseId, 'Buddy System');
}

async function activateVoyageSerein(
  supabase: SupabaseClient,
  purchaseId: string,
  userId: string,
  _serviceType: ServiceType
) {
  await ensureCallBookings(supabase, purchaseId, userId, 1);
  await ensureWelcomeConversation(supabase, userId, purchaseId, 'Pack Voyage Serein');
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

  await ensureCallBookings(supabase, purchaseId, userId, totalCalls);

  // Pack Ultime → cancel auto une eventuelle subscription Easy+ monthly du
  // meme user (sinon double facturation : pack inclut deja 1 an + le monthly
  // continue a debiter en background). On ignore les erreurs car ce n'est
  // pas critique (logguer pour audit, l'admin peut intervenir).
  await cancelExistingEasyPlusMonthlyIfAny(supabase, userId).catch((err) =>
    console.warn(`Pack Ultime: cancel Easy+ monthly failed for ${userId}:`, err)
  );

  // Activate Easy+ on profile (1 an = 365 jours, conforme a l'annonce Pack Ultime)
  await activateEasyPlus(supabase, userId, 'easy_plus_yearly');

  // Activate Rencontre Premium on profile — 180 jours (6 mois) pour Pack Ultime,
  // PAS le default 30j. Sinon mismatch entre entitlement (180j) et profile (30j),
  // l'enforcement runtime se fait sur profile.rencontre_premium_expires_at donc
  // le client perdrait 5 mois de Premium.
  await activateRencontrePremium(supabase, userId, 180);

  await ensureWelcomeConversation(supabase, userId, purchaseId, 'Pack Ultime');
}

/** Cancel l'eventuelle subscription Easy+ monthly active du user (anti double-facturation
 *  quand un pack qui inclut Easy+ est achete par-dessus). */
async function cancelExistingEasyPlusMonthlyIfAny(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data: rows } = await supabase
    .from('service_purchases')
    .select('id, stripe_subscription_id')
    .eq('user_id', userId)
    .eq('service_type', 'easy_plus_monthly')
    .eq('status', 'active')
    .not('stripe_subscription_id', 'is', null);

  if (!rows || rows.length === 0) return;

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' });

  for (const row of rows) {
    try {
      await stripe.subscriptions.cancel(row.stripe_subscription_id as string);
      await supabase
        .from('service_purchases')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', row.id);
      console.log(`Cancelled Easy+ monthly subscription ${row.stripe_subscription_id} for user ${userId} (Pack Ultime takeover)`);
    } catch (err) {
      console.error(`Failed to cancel subscription ${row.stripe_subscription_id}:`, err);
    }
  }
}

/**
 * Active Easy+ avec semantique "extension" :
 * - Si l'user a deja un Easy+ a vie (expires_at IS NULL), NE TOUCHE A RIEN
 *   (sinon downgrade silencieux d'un lifetime vers une duree finie).
 * - Si l'user a un Easy+ encore actif, EXTEND depuis la date d'expiration
 *   actuelle (pas RESET vers NOW + duree, sinon perte des jours restants).
 * - Si l'user n'a rien ou est expire, base = NOW.
 */
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('easy_plus_expires_at')
    .eq('id', userId)
    .single();

  const currentExpiry = profile?.easy_plus_expires_at as string | null | undefined;
  const isCurrentlyLifetime = profile && currentExpiry === null;

  if (days === null) {
    // Achat lifetime : toujours promote a permanent (vire toute date)
    await supabase
      .from('profiles')
      .update({ easy_plus_expires_at: null })
      .eq('id', userId);
    return;
  }

  if (isCurrentlyLifetime) {
    // Deja lifetime, ne pas downgrader
    console.log(`activateEasyPlus: user ${userId} a deja Easy+ a vie, skip`);
    return;
  }

  // Base = MAX(NOW, expiration actuelle si dans le futur) puis ajout des jours.
  const nowMs = Date.now();
  const currentMs = currentExpiry ? new Date(currentExpiry).getTime() : 0;
  const baseMs = Math.max(nowMs, currentMs);
  const expiresAt = new Date(baseMs + days * 24 * 60 * 60 * 1000).toISOString();

  await supabase
    .from('profiles')
    .update({ easy_plus_expires_at: expiresAt })
    .eq('id', userId);
}

/**
 * Meme semantique d'extension pour Rencontre Premium.
 * Default 30j (Rencontre Premium standalone), 180j pour Pack Ultime.
 */
async function activateRencontrePremium(
  supabase: SupabaseClient,
  userId: string,
  durationDays: number = 30,
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('rencontre_premium_expires_at')
    .eq('id', userId)
    .single();

  const currentExpiry = profile?.rencontre_premium_expires_at as string | null | undefined;

  // Pas de notion de "lifetime" pour Rencontre Premium pour l'instant. Si un
  // jour on l'introduit, dupliquer la logique isCurrentlyLifetime de easyPlus.

  const nowMs = Date.now();
  const currentMs = currentExpiry ? new Date(currentExpiry).getTime() : 0;
  const baseMs = Math.max(nowMs, currentMs);
  const expiresAt = new Date(baseMs + durationDays * 24 * 60 * 60 * 1000).toISOString();

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

  // total_spent peut arriver en string depuis Postgres (numeric) → cast Number
  const updates: Record<string, unknown> = {
    total_spent: Number(profile?.total_spent ?? 0) + Number(amountPaid ?? 0),
  };

  if (!profile?.customer_since) {
    updates.customer_since = new Date().toISOString();
  }

  await supabase.from('profiles').update(updates).eq('id', userId);
}
