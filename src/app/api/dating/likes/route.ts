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
