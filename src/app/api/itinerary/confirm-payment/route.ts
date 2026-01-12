import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { generation_id, payment_intent_id } = body;

    if (!generation_id) {
      return NextResponse.json(
        { error: 'generation_id requis' },
        { status: 400 }
      );
    }

    const supabase = await createClientForRouteHandler();

    // Récupérer la génération
    const { data: generation, error: fetchError } = await supabase
      .from('itinerary_generations')
      .select('id, payment_intent_id, payment_status')
      .eq('id', generation_id)
      .single();

    if (fetchError || !generation) {
      return NextResponse.json(
        { error: 'Génération non trouvée' },
        { status: 404 }
      );
    }

    // Si déjà complété, retourner succès
    if (generation.payment_status === 'completed') {
      return NextResponse.json({ success: true, already_completed: true });
    }

    // Récupérer le payment_intent_id
    const intentId = payment_intent_id || generation.payment_intent_id;

    if (!intentId) {
      return NextResponse.json(
        { error: 'Aucun paiement associé' },
        { status: 400 }
      );
    }

    // Vérifier le statut du PaymentIntent avec Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

    if (paymentIntent.status === 'succeeded') {
      // Mettre à jour le statut dans Supabase
      const { error: updateError } = await supabase
        .from('itinerary_generations')
        .update({
          payment_status: 'completed',
          amount_paid: paymentIntent.amount / 100,
          status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', generation_id);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json(
          { error: 'Erreur lors de la mise à jour' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, payment_confirmed: true });
    }

    return NextResponse.json({
      success: false,
      error: 'Paiement non confirmé',
      stripe_status: paymentIntent.status,
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
