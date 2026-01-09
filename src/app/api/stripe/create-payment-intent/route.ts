import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

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

    // Get authenticated user using server-side Supabase client with cookies
    const supabase = await createClientForRouteHandler();
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
    // Return more details for debugging
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      type: error.type || error.name
    }, { status: 500 });
  }
}
