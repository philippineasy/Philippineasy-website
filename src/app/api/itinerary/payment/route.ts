import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { PRICING_GRID, type Duration, type OfferType } from '@/config/itinerary-pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { generation_id, selected_variant, offer_type, duration, price_id } = body;

    // Validation des champs requis
    if (!generation_id || !selected_variant || !offer_type || !duration) {
      return NextResponse.json(
        { error: 'generation_id, selected_variant, offer_type et duration requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'offre et la durée sont valides
    const validOffers: OfferType[] = ['express', 'premium', 'conciergerie'];
    const validDurations: Duration[] = ['3-days', '1-week', '10-days', '2-weeks', '3-weeks', '1-month', 'more'];

    if (!validOffers.includes(offer_type) || !validDurations.includes(duration)) {
      return NextResponse.json(
        { error: 'Offre ou durée invalide' },
        { status: 400 }
      );
    }

    // Récupérer le prix depuis la config (validation côté serveur)
    const pricing = PRICING_GRID[offer_type as OfferType][duration as Duration];

    if (!pricing || pricing.price === 0) {
      // Sur devis pour conciergerie +1 mois
      return NextResponse.json(
        { error: 'Cette offre nécessite un devis personnalisé', requiresQuote: true },
        { status: 400 }
      );
    }

    // Vérifier que le price_id correspond (sécurité)
    if (price_id && price_id !== pricing.priceId) {
      console.warn(`Price ID mismatch: received ${price_id}, expected ${pricing.priceId}`);
      // On utilise le price_id de la config côté serveur pour éviter la manipulation
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

    // Convertir le prix en centimes
    const amountInCents = Math.round(pricing.price * 100);

    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'itinerary',
        generation_id,
        selected_variant,
        offer_type,
        duration,
        modifications_included: pricing.modifications.toString(),
        user_id: user?.id || 'anonymous',
      },
    });

    // Mettre à jour la génération avec les infos de paiement
    await supabase
      .from('itinerary_generations')
      .update({
        selected_variant,
        offer_type,
        payment_intent_id: paymentIntent.id,
        payment_status: 'pending',
        status: 'selected',
        modifications_remaining: pricing.modifications,
      })
      .eq('id', generation_id);

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: pricing.price,
      offer: offer_type,
      modifications: pricing.modifications,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
