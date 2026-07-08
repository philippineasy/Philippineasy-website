import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { PRICING_GRID, type Duration, type OfferType } from '@/config/itinerary-pricing';
import { getClientIp, normalizeIp } from '@/utils/get-client-ip';
import { trackServerEvent, extractClientId } from '@/lib/ga4-server';

// User ID exempté de la limite (super_admin)
const EXEMPT_USER_ID = process.env.RATE_LIMIT_EXEMPT_USER_ID;

// Type pour le résultat du rate limit
interface RateLimitResult {
  allowed: boolean;
  attempts_count: number;
  reset_at: string | null;
}

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });

    const body = await request.json();
    const { generation_id, selected_variant, offer_type, duration, price_id, coupon } = body;

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

    // Auth FIRST — establish identity before any DB op
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    // Vérifier que la génération existe ET appartient à l'utilisateur courant
    // (ou est anonyme — user_id NULL — auquel cas tout user authentifié peut la
    // récupérer, accepté pour le funnel anonyme → checkout post-inscription)
    // delivery_email est récupéré pour l'inclure dans les métadonnées Stripe
    // afin que le webhook puisse livrer l'itinéraire même si user_id est NULL.
    const genQuery = supabase
      .from('itinerary_generations')
      .select('id, status, payment_status, user_id, delivery_email')
      .eq('id', generation_id);
    const { data: generation, error: fetchError } = await genQuery.single();

    if (fetchError || !generation) {
      return NextResponse.json(
        { error: 'Génération non trouvée' },
        { status: 404 }
      );
    }

    // Ownership check : si la génération a un user_id, il doit correspondre à
    // l'utilisateur connecté. Empêche un user A de payer pour la génération de B.
    if (generation.user_id && generation.user_id !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier si déjà payé
    if (generation.payment_status === 'completed') {
      return NextResponse.json(
        { error: 'Cet itinéraire a déjà été débloqué' },
        { status: 400 }
      );
    }

    // =====================================================
    // RATE LIMITING PAR IP (5 tentatives/24h)
    // Assoupli le 2026-07-08 : 2/semaine fail-closed bloquait les IP partagées
    // (hôtels, entreprises, CGNAT mobile) et une panne DB bloquait 100% des
    // paiements. Créer un PaymentIntent est inoffensif tant qu'il n'est pas
    // confirmé — le rate limit ne protège que du spam, pas d'une fraude.
    // =====================================================
    const clientIp = normalizeIp(await getClientIp());
    const isExempt = userId && EXEMPT_USER_ID && userId === EXEMPT_USER_ID;

    if (!isExempt) {
      const supabaseAdmin = createServiceRoleClient();

      const { data: rateLimit, error: rateLimitError } = await supabaseAdmin
        .rpc('check_ip_rate_limit', { p_ip_address: clientIp, p_limit: 5, p_window_days: 1 })
        .single() as { data: RateLimitResult | null; error: Error | null };

      if (rateLimitError) {
        // Fail-OPEN : une panne du check ne doit jamais empêcher un client
        // de payer. On log pour surveiller.
        console.error('Rate limit check error (fail-open):', rateLimitError);
      } else if (rateLimit && !rateLimit.allowed && rateLimit.reset_at) {
        const resetDate = new Date(rateLimit.reset_at).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        });
        return NextResponse.json({
          error: 'Limite de tentatives atteinte',
          message: `Trop de tentatives de paiement depuis votre connexion. Réessayez à partir du ${resetDate}, ou contactez-nous si vous pensez qu'il s'agit d'une erreur.`,
          code: 'RATE_LIMIT_EXCEEDED',
          reset_at: rateLimit.reset_at
        }, { status: 429 });
      }

      // Enregistrer la tentative
      await supabaseAdmin.rpc('record_payment_attempt', {
        p_ip: clientIp,
        p_user_id: userId,
        p_generation_id: generation_id,
        p_metadata: { offer_type, duration }
      });
    }

    // Convertir le prix en centimes
    const originalAmountCents = Math.round(pricing.price * 100);
    let amountInCents = originalAmountCents;
    let appliedCoupon: { id: string; percentOff: number } | null = null;

    // ─── Coupon recovery (J+3 cart abandonment) ─────────────────────────────
    // Auto-apply via URL param plutot que saisie manuelle (Stripe PaymentIntents
    // ne supporte pas les promo codes nativement, contrairement a Checkout Session).
    // Strategie LENIENT : tout echec de validation = ignore + paie plein prix.
    // L'utilisateur ne doit JAMAIS etre bloque par un coupon foireux — la livraison
    // de l'itineraire post-paiement reste prioritaire (cf. webhook chain).
    if (coupon && typeof coupon === 'string' && coupon.length <= 50) {
      try {
        const couponObj = await stripe.coupons.retrieve(coupon);
        if (
          couponObj.valid &&
          typeof couponObj.percent_off === 'number' &&
          couponObj.percent_off > 0 &&
          couponObj.percent_off < 100
        ) {
          const discountedCents = Math.round(originalAmountCents * (1 - couponObj.percent_off / 100));
          // Stripe minimum charge = 0,50 EUR. Garde-fou.
          if (discountedCents >= 50) {
            amountInCents = discountedCents;
            appliedCoupon = { id: couponObj.id, percentOff: couponObj.percent_off };
            console.log(`[payment] Coupon ${couponObj.id} applied (-${couponObj.percent_off}%) on generation ${generation_id}: ${originalAmountCents}c -> ${amountInCents}c`);
          } else {
            console.warn(`[payment] Coupon ${couponObj.id} would discount below Stripe minimum (50c), skipping`);
          }
        } else {
          console.warn(`[payment] Coupon ${coupon} not valid or not percent-based, skipping`);
        }
      } catch (couponErr) {
        // Coupon inexistant ou autre erreur Stripe — non-bloquant
        console.warn(`[payment] Coupon ${coupon} retrieval failed:`, couponErr instanceof Error ? couponErr.message : 'unknown');
      }
    }

    // Créer le PaymentIntent Stripe
    // delivery_email est inclus dans les métadonnées pour permettre au webhook
    // de livrer l'itinéraire et de créer un compte même si user_id est NULL.
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
        delivery_email: generation.delivery_email || '',
        // Audit du coupon (utilise plus tard pour reporting / fraud detection)
        ...(appliedCoupon ? {
          coupon_applied: appliedCoupon.id,
          discount_percent: appliedCoupon.percentOff.toString(),
          original_amount_cents: originalAmountCents.toString(),
        } : {}),
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

    // Server-side GA4 tracking (bypass adblockers) — ia_checkout_started
    // ET passer le client_id dans Stripe metadata pour le webhook purchase event
    const clientId = extractClientId(request.headers.get('cookie'));
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: { ...paymentIntent.metadata, client_id: clientId },
    }).catch(() => { /* non-bloquant si stripe down */ });
    trackServerEvent(
      clientId,
      {
        name: 'ia_checkout_started',
        params: {
          generation_id,
          offer_type,
          duration,
          value: pricing.price,
          currency: 'EUR',
        },
      },
      user?.id,
    ).catch(() => { /* non-bloquant */ });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents / 100,
      original_amount: pricing.price,
      offer: offer_type,
      modifications: pricing.modifications,
      coupon_applied: appliedCoupon?.id || null,
      discount_percent: appliedCoupon?.percentOff || null,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
