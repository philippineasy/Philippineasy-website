import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Service Role Key for webhook');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (userId && customerId && subscriptionId) {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ 
          plan: 'premium',
          stripe_customer_id: customerId.toString(),
          stripe_subscription_id: subscriptionId.toString(),
        })
        .eq('id', userId);

      if (error) {
        console.error(`Failed to update plan and Stripe IDs for user ${userId}:`, error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }
  }

  // Handle marketplace payments
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata?.userId;
    const cartItems = paymentIntent.metadata?.cartItems;

    if (userId && cartItems) {
      try {
        const parsedCartItems = JSON.parse(cartItems);
        
        // Create order
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: userId,
            total_amount: paymentIntent.amount / 100, // Convert from cents
            status: 'succeeded',
            stripe_payment_intent_id: paymentIntent.id,
            shipping_address: paymentIntent.shipping || null,
          })
          .select('id')
          .single();

        if (orderError || !order) {
          console.error(`Failed to create order for payment intent ${paymentIntent.id}:`, orderError);
          return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        // Create order items
        const orderItemsToInsert = parsedCartItems.map((item: any) => ({
          order_id: order.id,
          product_id: item.product.id,
          vendor_id: item.product.vendor_id,
          quantity: item.quantity,
          price: item.product.price,
        }));

        const { error: itemsError } = await supabaseAdmin
          .from('order_items')
          .insert(orderItemsToInsert);

        if (itemsError) {
          console.error(`Failed to create order items for order ${order.id}:`, itemsError);
          return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
        }

        console.log(`Successfully processed marketplace order ${order.id} for payment intent ${paymentIntent.id}`);
      } catch (parseError) {
        console.error(`Failed to parse cart items for payment intent ${paymentIntent.id}:`, parseError);
        return NextResponse.json({ error: 'Invalid cart data' }, { status: 500 });
      }
    } else {
      console.log(`Payment intent ${paymentIntent.id} missing required metadata (userId or cartItems)`);
    }
  }
  
  // Handle subscription deletion
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        plan: 'free',
        stripe_subscription_id: null,
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error(`Failed to update plan on subscription deletion for ${subscription.id}:`, error);
      // We don't return an error to Stripe, as it might cause retry loops.
      // We just log it.
    }
  }

  return NextResponse.json({ received: true });
}
