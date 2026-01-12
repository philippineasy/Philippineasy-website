import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const ITINERARY_PRICE_CENTS = 999; // 9.99€

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { generation_id, selected_variant } = body;

    if (!generation_id || !selected_variant) {
      return NextResponse.json(
        { error: 'generation_id et selected_variant requis' },
        { status: 400 }
      );
    }

    // Vérifier que la génération existe
    const supabase = await createClientForRouteHandler();
    const { data: generation, error: fetchError } = await supabase
      .from('itinerary_generations')
      .select('id, status, payment_status')
      .eq('id', generation_id)
      .single();

    if (fetchError || !generation) {
      return NextResponse.json(
        { error: 'Génération non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si déjà payé
    if (generation.payment_status === 'completed') {
      return NextResponse.json(
        { error: 'Cet itinéraire a déjà été débloqué' },
        { status: 400 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();

    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ITINERARY_PRICE_CENTS,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'itinerary',
        generation_id,
        selected_variant,
        user_id: user?.id || 'anonymous',
      },
    });

    // Mettre à jour la génération avec le payment intent
    await supabase
      .from('itinerary_generations')
      .update({
        selected_variant,
        payment_intent_id: paymentIntent.id,
        payment_status: 'pending',
        status: 'selected',
      })
      .eq('id', generation_id);

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: ITINERARY_PRICE_CENTS / 100,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
