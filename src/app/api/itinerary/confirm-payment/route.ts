import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });
    const body = await request.json();
    const { generation_id } = body;

    if (!generation_id) {
      return NextResponse.json({ error: 'generation_id requis' }, { status: 400 });
    }

    // Auth obligatoire — empêche les anonymes de confirmer un paiement
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    // Récupérer la génération + ownership
    const { data: generation, error: fetchError } = await supabase
      .from('itinerary_generations')
      .select('id, payment_intent_id, payment_status, user_id')
      .eq('id', generation_id)
      .single();

    if (fetchError || !generation) {
      return NextResponse.json({ error: 'Génération non trouvée' }, { status: 404 });
    }

    // Ownership check : seul le propriétaire peut confirmer son paiement
    if (generation.user_id && generation.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // Si déjà complété, retourner succès (idempotent) avec montant pour tracking
    if (generation.payment_status === 'completed') {
      const { data: existing } = await supabase
        .from('itinerary_generations')
        .select('amount_paid')
        .eq('id', generation_id)
        .single();
      return NextResponse.json({
        success: true,
        already_completed: true,
        amount: Number(existing?.amount_paid) || 0,
        currency: 'EUR',
      });
    }

    // On ne fait JAMAIS confiance au payment_intent_id du body — on utilise
    // uniquement celui enregistré sur la génération (créé par /payment route).
    const intentId = generation.payment_intent_id;
    if (!intentId) {
      return NextResponse.json({ error: 'Aucun paiement associé' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

    // Vérifier que le PI appartient bien à cette génération (defense in depth :
    // metadata.generation_id est setté côté serveur dans /payment route).
    if (paymentIntent.metadata?.generation_id !== generation_id) {
      return NextResponse.json({ error: 'Paiement non lié à cette génération' }, { status: 403 });
    }

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({
        success: false,
        error: 'Paiement non confirmé',
        stripe_status: paymentIntent.status,
      });
    }

    // UPDATE conditionnel pour empêcher le double-traitement (race entre 2 onglets)
    const { data: updated, error: updateError } = await supabase
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
      console.error('Confirm payment update error:', updateError);
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }

    const amount = paymentIntent.amount / 100;
    const currency = (paymentIntent.currency ?? 'eur').toUpperCase();

    // Si rien n'a été mis à jour, c'est qu'un autre process a déjà completé entre-temps
    if (!updated || updated.length === 0) {
      return NextResponse.json({
        success: true,
        already_completed: true,
        amount,
        currency,
      });
    }

    return NextResponse.json({
      success: true,
      payment_confirmed: true,
      generation_id,
      amount,
      currency,
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
