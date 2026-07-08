import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

// Endpoint LECTURE-SEULE des metadonnees d'une generation pour le flux
// "resume_payment" post-magic-link. Renvoie le minimum requis pour relancer
// le paiement Stripe (duration, offer_type, payment_status, preferences).
//
// Auth :
//  - Owner direct : user_id = auth.uid()  -> OK
//  - Owner anonyme : user_id IS NULL ET delivery_email = email du user auth
//    -> OK (cas du funnel anonyme : on link plus tard via webhook Stripe)
//  - Sinon : 403
//
// On utilise le service-role client pour bypass la RLS apres avoir fait le
// check applicatif d'ownership ci-dessus (RLS trop restrictive pour le
// pattern anonyme -> proprietaire-via-email).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // 1. Identite du caller
    const supabase = await createClientForRouteHandler();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
    }

    // 2. Lookup avec service-role (RLS bypass) puis check applicatif
    const admin = createServiceRoleClient();
    const { data: gen, error } = await admin
      .from('itinerary_generations')
      .select('id, user_id, delivery_email, offer_type, payment_status, status, preferences, selected_variant, finalize_status')
      .eq('id', id)
      .single();

    if (error || !gen) {
      return NextResponse.json({ error: 'Generation non trouvee' }, { status: 404 });
    }

    // 3. Ownership check
    const isDirectOwner = gen.user_id && gen.user_id === user.id;
    const isAnonOwnerByEmail =
      !gen.user_id &&
      gen.delivery_email &&
      user.email &&
      gen.delivery_email.toLowerCase() === user.email.toLowerCase();

    if (!isDirectOwner && !isAnonOwnerByEmail) {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }

    // 4. Auto-link : si la generation est anonyme et que l'email correspond,
    // on profite de cette requete pour la rattacher au user authentifie.
    // Idempotent : si user_id deja set, ce no-op.
    if (isAnonOwnerByEmail) {
      await admin
        .from('itinerary_generations')
        .update({ user_id: user.id })
        .eq('id', id)
        .is('user_id', null);
    }

    // Duration vit dans preferences (jsonb), pas en colonne dediee
    const prefs = (gen.preferences ?? {}) as Record<string, unknown>;
    const duration = typeof prefs.duration === 'string' ? prefs.duration : null;

    return NextResponse.json({
      id: gen.id,
      duration,
      offer_type: gen.offer_type,
      payment_status: gen.payment_status,
      status: gen.status,
      // Polling post-paiement (page completion) : null|generating|ready|failed
      finalize_status: gen.finalize_status,
      preferences: gen.preferences,
      selected_variant: gen.selected_variant,
    });
  } catch (err) {
    console.error('[api/itinerary/generation/[id]] error', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
