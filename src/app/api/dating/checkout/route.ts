import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DATING_PREMIUM_PLANS, type DatingPremiumPlan } from '@/config/services-pricing';

// GET, pas POST : le bouton "Choisir ce plan" sur /rencontre-philippines/premium est un
// <Link href="/api/dating/checkout?plan=..."> — une navigation top-level classique, jamais
// un fetch(). Un handler POST-only ici renvoyait 405 pour tout visiteur cliquant sur un plan :
// le checkout dating était intégralement cassé avant même la question du price mapping.
// On répond donc par un redirect direct vers l'URL Stripe Checkout hébergée (session.url),
// exactement comme le ferait `stripe.redirectToCheckout()` côté client, mais sans JS.
export async function GET(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });

  const url = new URL(request.url);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Un 401 JSON n'est d'aucune utilité pour un visiteur qui vient de cliquer un <Link>.
    return NextResponse.redirect(new URL('/connexion', url.origin));
  }

  const rawPlan = url.searchParams.get('plan');
  const plan: DatingPremiumPlan =
    rawPlan === 'trimester' || rawPlan === 'semester' ? rawPlan : 'month';
  const { priceId } = DATING_PREMIUM_PLANS[plan];

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${url.origin}/rencontre-philippines?payment_success=true`,
      cancel_url: `${url.origin}/rencontre-philippines/premium?payment_canceled=true`,
      metadata: {
        userId: user.id,
        plan,
      },
      // Duplique userId/plan sur la Subscription elle-même (pas seulement la Session) :
      // le webhook en a besoin lors des renouvellements (invoice.paid), où seul le
      // subscription id est disponible, pas la Checkout Session d'origine.
      subscription_data: {
        metadata: {
          userId: user.id,
          plan,
        },
      },
    });

    if (!session.url) {
      throw new Error('Stripe session created without a checkout URL');
    }

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.redirect(
      new URL('/rencontre-philippines/premium?payment_error=true', url.origin)
    );
  }
}
