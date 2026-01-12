import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Supabase admin client (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const N8N_DELIVER_URL = process.env.N8N_ITINERARY_DELIVER_URL || 'http://localhost:5678/webhook/itinerary-deliver';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Gérer l'événement payment_intent.succeeded
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { generation_id, selected_variant, user_id } = paymentIntent.metadata;

    if (paymentIntent.metadata.type !== 'itinerary') {
      // Ce n'est pas un paiement d'itinéraire
      return NextResponse.json({ received: true });
    }

    console.log(`Payment succeeded for generation ${generation_id}, variant ${selected_variant}`);

    try {
      // 1. Mettre à jour Supabase
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

      // 2. Récupérer les données de la génération pour la livraison
      const { data: generation, error: fetchError } = await supabaseAdmin
        .from('itinerary_generations')
        .select('*')
        .eq('id', generation_id)
        .single();

      if (fetchError || !generation) {
        console.error('Error fetching generation:', fetchError);
        throw fetchError || new Error('Generation not found');
      }

      // 3. Déclencher le workflow n8n pour la livraison
      // Note: La livraison sera déclenchée quand l'utilisateur choisit email/telegram
      // Pour l'instant, on marque juste comme payé

      console.log(`Generation ${generation_id} marked as paid, ready for delivery`);

    } catch (error) {
      console.error('Error processing payment:', error);
      // On ne retourne pas d'erreur à Stripe pour éviter les retry
      // L'erreur est loggée et peut être traitée manuellement
    }
  }

  return NextResponse.json({ received: true });
}
