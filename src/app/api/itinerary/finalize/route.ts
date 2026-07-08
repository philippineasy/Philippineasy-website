import { NextResponse } from 'next/server';
import { createClientForRouteHandler } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { runFinalize } from '@/lib/itinerary/finalize';

// Génération de l'itinéraire complet post-paiement (previews-first).
// Déclenché en fallback par la page completion si le webhook Stripe n'a pas
// déjà lancé la finalisation. Idempotent (claim atomique dans runFinalize).
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const generationId = typeof body.generation_id === 'string' ? body.generation_id : '';
    if (!generationId) {
      return NextResponse.json({ error: 'generation_id requis' }, { status: 400 });
    }

    // Appel interne (webhook/cron) authentifié par secret, sinon owner authentifié
    const internalKey = request.headers.get('x-internal-key');
    const isInternal = !!process.env.CRON_SECRET && internalKey === process.env.CRON_SECRET;

    if (!isInternal) {
      const supabase = await createClientForRouteHandler();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
      }

      const admin = createServiceRoleClient();
      const { data: gen } = await admin
        .from('itinerary_generations')
        .select('id, user_id, delivery_email')
        .eq('id', generationId)
        .single();

      if (!gen) return NextResponse.json({ error: 'Génération non trouvée' }, { status: 404 });

      const isOwner = gen.user_id === user.id;
      const isAnonOwnerByEmail = !gen.user_id && gen.delivery_email && user.email &&
        gen.delivery_email.toLowerCase() === user.email.toLowerCase();
      if (!isOwner && !isAnonOwnerByEmail) {
        return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
      }
    }

    const result = await runFinalize(generationId);
    if (result.status === 'not_found') {
      return NextResponse.json({ error: 'Génération non trouvée' }, { status: 404 });
    }
    if (result.status === 'not_paid') {
      return NextResponse.json({ error: 'Paiement requis' }, { status: 403 });
    }
    return NextResponse.json({ status: result.status, error: result.error });
  } catch (error) {
    console.error('[itinerary/finalize] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
