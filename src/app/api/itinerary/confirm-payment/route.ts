import { NextResponse } from 'next/server';
import { after } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { runFinalize } from '@/lib/itinerary/finalize';

// after() peut porter la finalisation (génération du complet, 1-3 min) si le
// webhook Stripe ne l'a pas déjà prise.
export const maxDuration = 300;

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

    // Récupérer la génération + ownership (offer_type renvoye au client pour
    // adapter la page completion : checkbox PDF visible uniquement Premium+)
    const { data: generation, error: fetchError } = await supabase
      .from('itinerary_generations')
      .select('id, payment_intent_id, payment_status, user_id, offer_type')
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
        offer_type: generation.offer_type || null,
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
    // status 'paid' (pas 'delivered') : la livraison réelle est faite par
    // runFinalize() une fois l'itinéraire complet généré.
    const { data: updated, error: updateError } = await supabase
      .from('itinerary_generations')
      .update({
        payment_status: 'completed',
        amount_paid: paymentIntent.amount / 100,
        status: 'paid',
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

    // Filet : si le webhook Stripe n'a pas (encore) déclenché la finalisation,
    // on la lance ici. runFinalize est idempotent (claim atomique) — au pire
    // ce call constate que le webhook a déjà la main et ne fait rien.
    after(async () => {
      const result = await runFinalize(generation_id);
      if (result.status !== 'ready' && result.status !== 'generating') {
        console.error(`[confirm-payment] finalize ${generation_id} -> ${result.status}${result.error ? `: ${result.error}` : ''}`);
      }
    });

    // Si rien n'a été mis à jour, c'est qu'un autre process a déjà completé entre-temps
    if (!updated || updated.length === 0) {
      return NextResponse.json({
        success: true,
        already_completed: true,
        amount,
        currency,
        offer_type: generation.offer_type || null,
      });
    }

    return NextResponse.json({
      success: true,
      payment_confirmed: true,
      generation_id,
      amount,
      currency,
      offer_type: generation.offer_type || null,
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
