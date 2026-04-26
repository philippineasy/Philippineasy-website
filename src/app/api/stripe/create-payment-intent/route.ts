import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

type CartItem = {
  product: { id: number };
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });

    const { cart } = await request.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Invalid cart data.' }, { status: 400 });
    }

    const supabase = await createClientForRouteHandler();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // Validation : chaque item doit avoir un product.id numérique et quantity > 0
    const items: CartItem[] = [];
    for (const raw of cart) {
      const id = Number(raw?.product?.id);
      const qty = Number(raw?.quantity);
      if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(qty) || qty <= 0 || qty > 100) {
        return NextResponse.json({ error: 'Invalid cart item.' }, { status: 400 });
      }
      items.push({ product: { id }, quantity: qty });
    }

    // Fetch prices SERVER-SIDE — JAMAIS faire confiance au prix client.
    const productIds = items.map(i => i.product.id);
    const admin = createServiceRoleClient();
    const { data: products, error: prodErr } = await admin
      .from('products')
      .select('id, price, vendor_id')
      .in('id', productIds);

    if (prodErr || !products || products.length !== productIds.length) {
      return NextResponse.json({ error: 'Some products not found.' }, { status: 400 });
    }

    const priceById = new Map<number, { price: number; vendor_id: number | null }>();
    for (const p of products) {
      priceById.set(p.id, { price: Number(p.price), vendor_id: p.vendor_id });
    }

    let totalAmount = 0;
    const simplifiedCart = items.map((item) => {
      const p = priceById.get(item.product.id)!;
      totalAmount += p.price * item.quantity;
      return { id: item.product.id, qty: item.quantity, price: p.price, vendor_id: p.vendor_id };
    });

    if (totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid total amount.' }, { status: 400 });
    }

    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: user.id,
        cartItems: JSON.stringify(simplifiedCart),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
