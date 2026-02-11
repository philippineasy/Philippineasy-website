import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { SERVICE_CHECKOUT_MAP } from '@/config/services-pricing';
import type { ServiceType } from '@/types/services';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { service_type } = body as { service_type: string };

    // Validate service type
    if (!service_type || !(service_type in SERVICE_CHECKOUT_MAP)) {
      return NextResponse.json({ error: 'Invalid service type' }, { status: 400 });
    }

    const config = SERVICE_CHECKOUT_MAP[service_type as ServiceType];

    if (!config.priceId) {
      return NextResponse.json(
        { error: 'This service is not yet available for purchase. Please contact us.' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createServiceRoleClient();

    // Create pending purchase
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('service_purchases')
      .insert({
        user_id: user.id,
        service_type,
        amount_paid: config.amount / 100,
        currency: 'eur',
        status: 'pending',
        metadata: { source: 'checkout' },
      })
      .select('id')
      .single();

    if (purchaseError || !purchase) {
      console.error('Failed to create purchase:', purchaseError);
      return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 });
    }

    const stripe = getStripe();

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: config.mode,
      line_items: [{ price: config.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/services/completion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
      customer_email: user.email,
      metadata: {
        purchase_id: purchase.id,
        service_type,
        user_id: user.id,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Update purchase with Stripe session ID
    await supabaseAdmin
      .from('service_purchases')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', purchase.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
