import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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
  // =====================================================
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;

    // Expire any service purchases linked to this subscription
    const { error: purchaseError } = await supabaseAdmin
      .from('service_purchases')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', subscription.id)
      .eq('status', 'active');

    if (purchaseError) {
      console.error(`Failed to expire purchases for subscription ${subscription.id}:`, purchaseError);
    }

    // Reset dating plan (legacy)
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: 'free',
        stripe_subscription_id: null,
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error(`Failed to update plan on subscription deletion for ${subscription.id}:`, error);
    }
  }

  // =====================================================
  // invoice.payment_failed
  // =====================================================
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    console.error(`Payment failed for invoice ${invoice.id}, customer ${invoice.customer}`);
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

  // Update purchase status to paid
  const { error: updateError } = await supabaseAdmin
    .from('service_purchases')
    .update({
      status: 'paid',
      stripe_payment_intent_id: session.payment_intent as string || null,
      stripe_subscription_id: session.subscription as string || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', purchaseId);

  if (updateError) {
    console.error(`Failed to update purchase ${purchaseId}:`, updateError);
    return;
  }

  // Update customer_since if first purchase
  await supabaseAdmin.rpc('update_customer_since_if_null', {
    p_user_id: userId,
  }).then(({ error }) => {
    // Ignore errors from missing function — will be handled by activation service
    if (error) console.log('update_customer_since_if_null not available, skipping');
  });

  // Trigger auto-activation
  const { activateService } = await import('@/services/activationService');
  const { error: activationError } = await activateService(supabaseAdmin, purchaseId);
  if (activationError) {
    console.error(`Activation failed for purchase ${purchaseId}:`, activationError);
    // Purchase stays in 'paid' status for manual retry
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
    const { error: updateError } = await supabaseAdmin
      .from('itinerary_generations')
      .update({
        payment_status: 'completed',
        amount_paid: paymentIntent.amount / 100,
        status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', generation_id);

    if (updateError) {
      console.error('Error updating generation:', updateError);
      throw updateError;
    }

    console.log(`Generation ${generation_id} marked as paid, ready for delivery`);
  } catch (error) {
    console.error('Error processing itinerary payment:', error);
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
  } catch (parseError) {
    console.error(`Failed to parse cart items for payment intent ${paymentIntent.id}:`, parseError);
  }
}
