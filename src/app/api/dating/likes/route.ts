import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    // Get the IDs of users who liked the current user
    const { data: likes, error: likesError } = await supabase
      .from('likes')
      .select('from_user_id')
      .eq('to_user_id', user.id);

    if (likesError) throw likesError;

    const userIds = likes.map((like: { from_user_id: string }) => like.from_user_id);

    if (userIds.length === 0) {
      return NextResponse.json([]);
    }

    // Server-side premium gate: only a premium caller may ever receive real
    // liker identities. Same source of truth as usePremium() (profiles.plan).
    const { data: callerProfile, error: planError } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle();

    if (planError) throw planError;

    const isPremium = callerProfile?.plan === 'premium';

    if (!isPremium) {
      // Non-premium: expose the COUNT only, via anonymous placeholders. No
      // username/city/photo/age ever leaves the server for these callers —
      // the blurred UI is now backed by masked data, not just CSS.
      const maskedProfiles = userIds.map(() => ({ masked: true as const }));
      return NextResponse.json(maskedProfiles);
    }

    // Get the profiles of those users
    const { data: profiles, error: profilesError } = await supabase
      .from('dating_profiles')
      .select('user_id, profile_picture_url, city, birth_date, profiles (username)')
      .in('user_id', userIds);

    if (profilesError) throw profilesError;

    const formattedProfiles = profiles.map((p: any) => ({
        ...p,
        username: p.profiles?.username,
        age: p.birth_date ? new Date().getFullYear() - new Date(p.birth_date).getFullYear() : undefined,
    }));


    return NextResponse.json(formattedProfiles);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
