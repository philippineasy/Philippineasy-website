import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Server-side gate for "Qui a vu mon profil ?" — mirrors /api/dating/likes:
// a non-premium caller must never receive real viewer identities, only the
// COUNT (via anonymous placeholders) so the blurred UI keeps working without
// leaking username/age/profile_picture_url through the network response.
export async function GET() {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { data: viewers, error: viewersError } = await supabase.rpc('get_profile_viewers', {
      p_user_id: user.id,
      p_limit: 5,
    });

    if (viewersError) throw viewersError;

    const { data: callerProfile, error: planError } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle();

    if (planError) throw planError;

    const isPremium = callerProfile?.plan === 'premium';

    if (!isPremium) {
      const maskedViewers = (viewers || []).map(() => ({ masked: true as const }));
      return NextResponse.json(maskedViewers);
    }

    return NextResponse.json(viewers || []);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
