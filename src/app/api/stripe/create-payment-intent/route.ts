import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CartItem = {
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const { cart } = await request.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Invalid cart data.' }, { status: 400 });
    }

    // Get authenticated user
    const cookieStore = cookies();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // In a real application, you would fetch product prices from your database
    // to prevent the client from manipulating prices.
    const totalAmount = cart.reduce((total: number, item: CartItem) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Amount must be in cents for Stripe
    const amountInCents = Math.round(totalAmount * 100);

    // The application fee is 10% of the total
    const applicationFeeAmount = Math.round(amountInCents * 0.10);

    // For a marketplace, you would typically use Stripe Connect and create a charge
    // on behalf of a connected account. This is a simplified example.
    // In a real scenario, you would need the vendor's connected Stripe account ID.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      // application_fee_amount: applicationFeeAmount, // This is for Stripe Connect
      // transfer_data: { // This is for Stripe Connect
      //   destination: 'acct_...', // The vendor's connected Stripe account ID
      // },
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        // Pass cart details and user ID to the webhook
        userId: user.id,
        cartItems: JSON.stringify(cart),
      }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
