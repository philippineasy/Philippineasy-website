import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const dynamic = 'force-dynamic';

// Retrograde les profils dont l'abonnement "Rencontre Premium" a expire, sans que
// Stripe ait envoye de customer.subscription.deleted (ex: dunning en cours suite a un
// echec de paiement, abonnement legacy sans renouvellement traque, premium accorde
// manuellement par un admin — cf. grantPremium() dans admin/dating/profiles/actions.ts,
// qui pose deliberement un rencontre_premium_expires_at a 30j pour etre repris ici).
//
// IMPORTANT — semantique de `profiles.plan` : ce champ est DEDIE a Rencontre Premium
// ('free' | 'premium'), distinct de `easy_plus_expires_at` qui gere Easy+ (pas de colonne
// `plan` propre a Easy+). Ce cron ne touche donc QUE le statut dating, jamais Easy+.
// Un profil sans `rencontre_premium_expires_at` (NULL) n'est jamais matche par `lt()` —
// ca couvre les rares cas de premium "a vie" ou de donnees historiques sans date de fin.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();

  const { data: expiredProfiles, error: selectError } = await supabase
    .from('profiles')
    .select('id')
    .eq('plan', 'premium')
    .not('rencontre_premium_expires_at', 'is', null)
    .lt('rencontre_premium_expires_at', now);

  if (selectError) {
    console.error('dating-premium-expiry cron: select failed', selectError);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }

  const ids = (expiredProfiles || []).map((p) => p.id);

  if (ids.length === 0) {
    return NextResponse.json({ downgraded: 0 });
  }

  // Nettoie aussi la colonne legacy `premium_expires_at` (affichee dans
  // /admin/dating/profiles, cf. grantPremium) pour rester coherent avec `plan: 'free'`.
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ plan: 'free', premium_expires_at: null })
    .in('id', ids);

  if (updateError) {
    console.error('dating-premium-expiry cron: update failed', updateError);
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }

  console.log(`dating-premium-expiry cron: downgraded ${ids.length} expired Rencontre Premium profile(s)`);
  return NextResponse.json({ downgraded: ids.length });
}
