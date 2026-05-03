import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendItineraryPaymentConfirmation, sendPaymentFailedEmail, sendSubscriptionCancelledEmail } from '@/emails/senders/payment';
import { sendOrderConfirmation, sendVendorNewOrder } from '@/emails/senders/marketplace';
import { sendDatingPremiumConfirmation } from '@/emails/senders/lifecycle';
import { sendItineraryReadyEmail } from '@/emails/senders/itinerary';
import { getUserEmail } from '@/emails/send';

// Helper : envoie l'email "Itineraire pret" avec lien + PDF.
// Appele depuis le webhook pour garantir delivery meme si l'utilisateur ne
// revient pas sur /checkout/completion (ex: ferme browser apres paiement Stripe).
// Idempotent au niveau Resend (le sender ne re-envoie pas si meme template+to+24h).
async function dispatchItineraryReadyEmail(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  generationId: string,
  to: string,
  userName?: string,
) {
  try {
    const { data: gen, error } = await supabaseAdmin
      .from('itinerary_generations')
      .select('id, selected_variant, itineraries')
      .eq('id', generationId)
      .single();

    if (error || !gen) {
      console.error(`[webhook] dispatchItineraryReadyEmail: gen ${generationId} not found`, error);
      return;
    }

    const itineraries = typeof gen.itineraries === 'string' ? JSON.parse(gen.itineraries) : gen.itineraries;
    if (!Array.isArray(itineraries) || itineraries.length === 0) {
      console.error(`[webhook] dispatchItineraryReadyEmail: gen ${generationId} has no itineraries`);
      return;
    }

    const selectedVariant = itineraries.find(
      (it: { variant: string }) => it.variant === gen.selected_variant
    ) || itineraries[0];

    const days = selectedVariant?.full?.days || [];
    const destinations = [...new Set(
      days.map((d: { location?: string }) => d.location).filter(Boolean)
    )].join(', ') || 'Philippines';

    await sendItineraryReadyEmail({
      to,
      userName,
      itineraryTitle: selectedVariant?.preview?.title || selectedVariant?.full?.title || 'Votre itineraire',
      destination: destinations,
      days: days.length || 1,
      variant: gen.selected_variant || 'balanced',
      generationId,
    });

    console.log(`[webhook] Itinerary ready email dispatched for gen ${generationId} to ${to}`);
  } catch (err) {
    console.error(`[webhook] Failed to dispatch itinerary ready email for gen ${generationId}:`, err);
  }
}

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Service Role Key for webhook');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing Stripe signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // =====================================================
  // checkout.session.completed
  // =====================================================
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // --- Service purchases (new CRM flow) ---
    if (session.metadata?.service_type) {
      await handleServiceCheckout(supabaseAdmin, session);
    }
    // --- Dating subscription (legacy) ---
    else if (session.metadata?.userId && session.customer && session.subscription) {
      const userId = session.metadata.userId;
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          plan: 'premium',
          stripe_customer_id: (session.customer as string),
          stripe_subscription_id: (session.subscription as string),
        })
        .eq('id', userId);

      if (error) {
        console.error(`Failed to update plan for user ${userId}:`, error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      // Send dating premium confirmation email
      const premiumUser = await getUserEmail(userId);
      if (premiumUser) {
        sendDatingPremiumConfirmation(premiumUser.email, premiumUser.name).catch((err) =>
          console.error('Dating premium email error:', err)
        );
      }
    }
  }

  // =====================================================
  // payment_intent.succeeded
  // =====================================================
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // --- Itinerary payment ---
    if (paymentIntent.metadata?.type === 'itinerary') {
      await handleItineraryPayment(supabaseAdmin, paymentIntent);
    }
    // --- Marketplace payment ---
    else if (paymentIntent.metadata?.userId && paymentIntent.metadata?.cartItems) {
      await handleMarketplacePayment(supabaseAdmin, paymentIntent);
    }
  }

  // =====================================================
  // customer.subscription.deleted
  // Cascade : expire le service_purchase + tous ses entitlements + cancel
  // les call_bookings non encore consommes. Sinon le user garde indument
  // l'acces a tout (Easy+, library PDF, Premium dating, calls reservables).
  // =====================================================
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;

    // 1. Recupere les service_purchases impactes
    const { data: impactedPurchases } = await supabaseAdmin
      .from('service_purchases')
      .select('id, user_id, service_type')
      .eq('stripe_subscription_id', subscription.id)
      .eq('status', 'active');

    if (impactedPurchases && impactedPurchases.length > 0) {
      const purchaseIds = impactedPurchases.map((p) => p.id);

      // 2. Expire les service_purchases
      await supabaseAdmin
        .from('service_purchases')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .in('id', purchaseIds);

      // 3. Expire les entitlements lies (Easy+, rencontre_premium, pdf_library_access...)
      await supabaseAdmin
        .from('purchase_entitlements')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .in('purchase_id', purchaseIds)
        .in('status', ['available', 'in_use']);

      // 4. Cancel les call_bookings non encore completes
      await supabaseAdmin
        .from('call_bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .in('purchase_id', purchaseIds)
        .in('status', ['scheduled', 'confirmed']);

      // 5. Reset les flags profile pour les services impactes (Easy+, Rencontre Premium)
      for (const purchase of impactedPurchases) {
        if (purchase.service_type.startsWith('easy_plus_')) {
          await supabaseAdmin
            .from('profiles')
            .update({ easy_plus_expires_at: new Date().toISOString() })
            .eq('id', purchase.user_id);
        }
        if (purchase.service_type === 'rencontre_premium' || purchase.service_type.startsWith('pack_ultime_')) {
          await supabaseAdmin
            .from('profiles')
            .update({
              plan: 'free',
              rencontre_premium_expires_at: new Date().toISOString(),
            })
            .eq('id', purchase.user_id);
        }
      }
    }

    // Reset dating plan (legacy stripe_subscription_id sur profiles)
    const { data: cancelledProfile } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: 'free',
        stripe_subscription_id: null,
      })
      .eq('stripe_subscription_id', subscription.id)
      .select('id')
      .maybeSingle();

    // Send cancellation email
    if (cancelledProfile) {
      const user = await getUserEmail(cancelledProfile.id);
      if (user) {
        sendSubscriptionCancelledEmail(user.email, user.name, 'Abonnement Premium').catch((err) =>
          console.error('Subscription cancelled email error:', err)
        );
      }
    }
  }

  // =====================================================
  // charge.refunded — cascade revoke pour les achats one-shot (non-subscription)
  // Sans ce handler, un user rembourse continue a beneficier de son Pack
  // Ultime / Buddy / Voyage Serein indument.
  // =====================================================
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id;

    if (paymentIntentId) {
      const { data: refundedPurchases } = await supabaseAdmin
        .from('service_purchases')
        .select('id, user_id, service_type')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .in('status', ['paid', 'active', 'activating']);

      if (refundedPurchases && refundedPurchases.length > 0) {
        const purchaseIds = refundedPurchases.map((p) => p.id);

        await supabaseAdmin
          .from('service_purchases')
          .update({ status: 'refunded', updated_at: new Date().toISOString() })
          .in('id', purchaseIds);

        await supabaseAdmin
          .from('purchase_entitlements')
          .update({ status: 'expired', updated_at: new Date().toISOString() })
          .in('purchase_id', purchaseIds)
          .in('status', ['available', 'in_use']);

        await supabaseAdmin
          .from('call_bookings')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .in('purchase_id', purchaseIds)
          .in('status', ['scheduled', 'confirmed']);

        // Reset profile flags si applicable
        for (const purchase of refundedPurchases) {
          if (purchase.service_type.startsWith('pack_ultime_')) {
            // Pack Ultime → revert Easy+ et Rencontre Premium accordes
            await supabaseAdmin
              .from('profiles')
              .update({
                easy_plus_expires_at: new Date().toISOString(),
                plan: 'free',
                rencontre_premium_expires_at: new Date().toISOString(),
              })
              .eq('id', purchase.user_id);
          } else if (purchase.service_type === 'easy_plus_lifetime') {
            await supabaseAdmin
              .from('profiles')
              .update({ easy_plus_expires_at: new Date().toISOString() })
              .eq('id', purchase.user_id);
          }
        }

        console.log(`Refund cascade: ${purchaseIds.length} purchases revoked for payment ${paymentIntentId}`);
      }
    }
  }

  // =====================================================
  // invoice.paid — renewal des subscriptions (Easy+ monthly/yearly,
  // Rencontre Premium monthly). Sans ce handler, l'user perd l'acces apres
  // 30j/365j malgre que Stripe debite correctement chaque cycle.
  // =====================================================
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = (invoice as Stripe.Invoice & { subscription?: string | null }).subscription
      ?? null;

    // Skip la 1ere facture (creation), elle est geree par checkout.session.completed
    if (subscriptionId && invoice.billing_reason !== 'subscription_create') {
      const { data: purchase } = await supabaseAdmin
        .from('service_purchases')
        .select('id, user_id, service_type, status')
        .eq('stripe_subscription_id', subscriptionId as string)
        .maybeSingle();

      if (purchase && (purchase.status === 'active' || purchase.status === 'expired')) {
        // Re-activate / extend
        const { activateService } = await import('@/services/activationService');
        // Reset status to 'paid' pour permettre re-activation propre
        await supabaseAdmin
          .from('service_purchases')
          .update({ status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', purchase.id);

        await activateService(supabaseAdmin, purchase.id);
        console.log(`Subscription renewed: ${purchase.service_type} for user ${purchase.user_id}`);
      }
    }
  }

  // =====================================================
  // invoice.payment_failed
  // =====================================================
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    console.error(`Payment failed for invoice ${invoice.id}, customer ${invoice.customer}`);

    // Send payment failure email
    if (invoice.customer) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, username')
        .eq('stripe_customer_id', invoice.customer as string)
        .single();

      if (profile) {
        const user = await getUserEmail(profile.id);
        if (user) {
          sendPaymentFailedEmail(user.email, user.name).catch((err) =>
            console.error('Payment failed email error:', err)
          );
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

// =====================================================
// Handler: Service checkout (CRM)
// =====================================================
async function handleServiceCheckout(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  session: Stripe.Checkout.Session
) {
  const purchaseId = session.metadata!.purchase_id;
  const serviceType = session.metadata!.service_type;
  const userId = session.metadata!.user_id;

  console.log(`Service checkout completed: ${serviceType} for user ${userId}, purchase ${purchaseId}`);

  // Idempotent : ne passe en 'paid' QUE depuis 'pending'. Si Stripe retry
  // l'event, le second appel ne match plus et on n'active pas deux fois
  // (sinon entitlements + appels + emails dupliqués).
  const { data: claimed, error: updateError } = await supabaseAdmin
    .from('service_purchases')
    .update({
      status: 'paid',
      stripe_payment_intent_id: session.payment_intent as string || null,
      stripe_subscription_id: session.subscription as string || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', purchaseId)
    .eq('status', 'pending')
    .select('id');

  if (updateError) {
    console.error(`Failed to update purchase ${purchaseId}:`, updateError);
    return;
  }
  if (!claimed || claimed.length === 0) {
    console.log(`Service checkout ${purchaseId} already processed — skipping activation`);
    return;
  }

  await supabaseAdmin.rpc('update_customer_since_if_null', {
    p_user_id: userId,
  }).then(({ error }) => {
    if (error) console.log('update_customer_since_if_null not available, skipping');
  });

  const { activateService } = await import('@/services/activationService');
  const { error: activationError } = await activateService(supabaseAdmin, purchaseId);
  if (activationError) {
    console.error(`Activation failed for purchase ${purchaseId}:`, activationError);
  }
}

// =====================================================
// Handler: Itinerary payment
// =====================================================
async function handleItineraryPayment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  paymentIntent: Stripe.PaymentIntent
) {
  const { generation_id, selected_variant } = paymentIntent.metadata;

  console.log(`Payment succeeded for generation ${generation_id}, variant ${selected_variant}`);

  try {
    // Idempotent : on ne complète que si pas déjà completed (évite double email).
    const { data: claimed, error: updateError } = await supabaseAdmin
      .from('itinerary_generations')
      .update({
        payment_status: 'completed',
        amount_paid: paymentIntent.amount / 100,
        status: 'delivered',
        delivered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', generation_id)
      .neq('payment_status', 'completed')
      .select('id');

    if (updateError) {
      console.error('Error updating generation:', updateError);
      throw updateError;
    }
    if (!claimed || claimed.length === 0) {
      console.log(`Itinerary payment ${generation_id} already processed — skipping email`);
      return;
    }

    console.log(`Generation ${generation_id} marked as delivered (auto-profile delivery)`);

    // Récupérer user_id ET delivery_email pour gérer les achats anonymes
    const { data: generation } = await supabaseAdmin
      .from('itinerary_generations')
      .select('user_id, delivery_email, destination, duration_days')
      .eq('id', generation_id)
      .single();

    const amountFormatted = `${(paymentIntent.amount / 100).toFixed(2)} EUR`;
    const destination = generation?.destination || 'Philippines';
    const durationDays = generation?.duration_days || 7;

    // delivery_email : priorité DB, fallback métadonnées Stripe (pour rows
    // créées avant le déploiement de 1.A qui n'ont pas encore le champ DB)
    const deliveryEmail =
      generation?.delivery_email ||
      paymentIntent.metadata?.delivery_email ||
      '';

    if (generation?.user_id) {
      // ── Cas normal : utilisateur authentifié au moment du paiement ──
      const user = await getUserEmail(generation.user_id);
      if (user) {
        sendItineraryPaymentConfirmation(
          user.email,
          user.name,
          destination,
          durationDays,
          amountFormatted,
        ).catch((err) => console.error('Itinerary payment email error:', err));

        // Envoie aussi l'email "Itineraire pret" (avec lien + PDF) directement
        // depuis le webhook pour garantir delivery meme si l'user ne revient
        // pas sur /checkout/completion (cas: ferme browser apres Stripe).
        dispatchItineraryReadyEmail(supabaseAdmin, generation_id, user.email, user.name)
          .catch((err) => console.error('Itinerary ready email error:', err));
      }
    } else if (deliveryEmail) {
      // ── Cas anonyme : paiement sans compte — créer ou lier un compte ──
      await handleAnonymousItineraryPurchase(
        supabaseAdmin,
        generation_id,
        deliveryEmail,
        destination,
        durationDays,
        amountFormatted,
      );
    } else {
      // ── Cas pathologique : pas de user_id ni de delivery_email ──
      // Normalement impossible si la feature 1.A est déployée, mais possible
      // pour des rows créées avant le déploiement.
      console.error(
        `Itinerary payment ${generation_id} completed but no user_id or delivery_email — cannot send confirmation.`
      );
    }
  } catch (error) {
    console.error('Error processing itinerary payment:', error);
  }
}

// =====================================================
// Helper: Création/liaison compte pour achat anonyme
// =====================================================

// Regex de validation email basique (évite de créer un user avec un email malformé)
const EMAIL_VALIDATION_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function handleAnonymousItineraryPurchase(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  generationId: string,
  deliveryEmail: string,
  destination: string,
  durationDays: number,
  amountFormatted: string,
) {
  // Valider le format email avant toute opération
  if (!EMAIL_VALIDATION_RE.test(deliveryEmail)) {
    console.error(
      `handleAnonymousItineraryPurchase: invalid email format "${deliveryEmail}" for generation ${generationId}`
    );
    return;
  }

  console.log(`Handling anonymous purchase for ${deliveryEmail}, generation ${generationId}`);

  try {
    // 1. Vérifier si un compte existe déjà avec cet email
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listError) {
      console.error('Error listing users for anonymous purchase:', listError);
      // Envoyer quand même l'email de confirmation pour ne pas bloquer la livraison
      sendItineraryPaymentConfirmation(deliveryEmail, 'Voyageur', destination, durationDays, amountFormatted)
        .catch((err) => console.error('Itinerary payment email (fallback) error:', err));
      return;
    }

    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === deliveryEmail.toLowerCase()
    );

    let finalUserId: string;

    if (existingUser) {
      // 2a. Compte existant → lier la génération à ce compte
      finalUserId = existingUser.id;
      console.log(`Linking generation ${generationId} to existing user ${finalUserId}`);
    } else {
      // 2b. Pas de compte → créer un nouveau compte
      // email_confirm: true → l'email est directement confirmé (pas besoin de
      // cliquer sur un lien de vérification, le magic link d'accès suffit)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: deliveryEmail,
        email_confirm: true,
        user_metadata: {
          created_via: 'itinerary_anonymous_purchase',
        },
      });

      if (createError || !newUser?.user) {
        console.error('Error creating user for anonymous purchase:', createError);
        // Envoyer quand même la confirmation email sans créer le compte
        sendItineraryPaymentConfirmation(deliveryEmail, 'Voyageur', destination, durationDays, amountFormatted)
          .catch((err) => console.error('Itinerary payment email (no-account) error:', err));
        return;
      }

      finalUserId = newUser.user.id;
      console.log(`Created new user ${finalUserId} for anonymous purchase`);
    }

    // 3. Lier la génération au compte (existant ou nouveau)
    const { error: linkError } = await supabaseAdmin
      .from('itinerary_generations')
      .update({ user_id: finalUserId })
      .eq('id', generationId);

    if (linkError) {
      console.error(`Error linking generation ${generationId} to user ${finalUserId}:`, linkError);
    }

    // 4. Envoyer la confirmation de paiement
    const userName = existingUser
      ? (await getUserEmail(finalUserId))?.name || 'Voyageur'
      : 'Voyageur';

    sendItineraryPaymentConfirmation(
      deliveryEmail,
      userName,
      destination,
      durationDays,
      amountFormatted,
    ).catch((err) => console.error('Itinerary payment email (anonymous) error:', err));

    // Envoie aussi l'email "Itineraire pret" (avec lien + PDF) pour livrer
    // immediatement le contenu (cas anonyme : sans cet envoi, l'user ne
    // saurait jamais ou recuperer son itineraire avant de cliquer le magic link)
    dispatchItineraryReadyEmail(supabaseAdmin, generationId, deliveryEmail, userName)
      .catch((err) => console.error('Itinerary ready email (anonymous) error:', err));

    // 5. Envoyer un magic link pour permettre l'accès à l'espace personnel
    // Ne pas await — opération non-bloquante, failure acceptable
    supabaseAdmin.auth.admin
      .generateLink({
        type: 'magiclink',
        email: deliveryEmail,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://philippineasy.com'}/mon-espace`,
        },
      })
      .then(({ data: linkData, error: linkGenError }) => {
        if (linkGenError || !linkData?.properties?.action_link) {
          console.error('Error generating magic link for new user:', linkGenError);
          return;
        }
        // L'envoi via Supabase est automatique avec generateLink — pas besoin
        // d'envoyer un email séparé. Supabase envoie l'email de "magic link"
        // avec le lien d'accès inclus dans action_link.
        console.log(`Magic link generated for ${deliveryEmail} — Supabase will send the email`);
      })
      .catch((err) => console.error('Magic link generation exception:', err));

  } catch (err) {
    console.error('handleAnonymousItineraryPurchase exception:', err);
  }
}

// =====================================================
// Handler: Marketplace payment
// =====================================================
async function handleMarketplacePayment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  paymentIntent: Stripe.PaymentIntent
) {
  const userId = paymentIntent.metadata.userId;
  const cartItems = paymentIntent.metadata.cartItems;

  try {
    const parsedCartItems = JSON.parse(cartItems);

    // Idempotent : si un order existe déjà pour ce payment_intent_id (Stripe
    // a retried), on retourne sans rien faire (UNIQUE constraint en BDD).
    const { data: existing } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .maybeSingle();
    if (existing) {
      console.log(`Marketplace order ${existing.id} already exists for ${paymentIntent.id} — skipping`);
      return;
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: paymentIntent.amount / 100,
        status: 'succeeded',
        stripe_payment_intent_id: paymentIntent.id,
        shipping_address: paymentIntent.shipping || null,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error(`Failed to create order for payment intent ${paymentIntent.id}:`, orderError);
      return;
    }

    const orderItemsToInsert = parsedCartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      vendor_id: item.vendor_id,
      quantity: item.qty,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error(`Failed to create order items for order ${order.id}:`, itemsError);
      return;
    }

    console.log(`Successfully processed marketplace order ${order.id} for payment intent ${paymentIntent.id}`);

    // Send order confirmation to buyer
    const buyer = await getUserEmail(userId);
    if (buyer) {
      const itemDetails = parsedCartItems.map((item: any) => ({
        name: item.name || item.title || `Produit #${item.id}`,
        qty: item.qty || 1,
        price: item.price || 0,
      }));

      sendOrderConfirmation(
        buyer.email,
        buyer.name,
        String(order.id),
        itemDetails,
        paymentIntent.amount / 100,
      ).catch((err) => console.error('Order confirmation email error:', err));

      // Notify each vendor
      const vendorIds = [...new Set(parsedCartItems.map((item: any) => item.vendor_id).filter(Boolean))];
      for (const vendorId of vendorIds) {
        const { data: vendor } = await supabaseAdmin
          .from('vendors')
          .select('user_id')
          .eq('id', vendorId)
          .single();

        if (vendor?.user_id) {
          const vendorItems = parsedCartItems
            .filter((item: any) => item.vendor_id === vendorId)
            .map((item: any) => ({
              name: item.name || item.title || `Produit #${item.id}`,
              qty: item.qty || 1,
              price: item.price || 0,
            }));

          sendVendorNewOrder(vendor.user_id, String(order.id), vendorItems, buyer.name).catch((err) =>
            console.error(`Vendor order notification error for vendor ${vendorId}:`, err)
          );
        }
      }
    }
  } catch (parseError) {
    console.error(`Failed to parse cart items for payment intent ${paymentIntent.id}:`, parseError);
  }
}
