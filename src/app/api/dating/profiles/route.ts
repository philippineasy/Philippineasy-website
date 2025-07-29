import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { DatingProfile, Interest } from '@/types';

interface DatingProfileWithDetails extends DatingProfile {
  profiles: { username: string } | null;
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { searchParams } = new URL(request.url);

  if (!user) {
    return NextResponse.json({ profiles: [], count: 0 }, { status: 401 });
  }

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  const interestsParam = searchParams.get('interests');

  const rpcParams = {
    p_user_id: user.id,
    p_limit: limit,
    p_offset: offset,
    p_min_age: searchParams.has('minAge') ? parseInt(searchParams.get('minAge')!, 10) : null,
    p_max_age: searchParams.has('maxAge') ? parseInt(searchParams.get('maxAge')!, 10) : null,
    p_min_height: searchParams.has('minHeight') ? parseInt(searchParams.get('minHeight')!, 10) : null,
    p_max_height: searchParams.has('maxHeight') ? parseInt(searchParams.get('maxHeight')!, 10) : null,
    p_city: searchParams.get('city'),
    p_interests: interestsParam ? interestsParam.split(',').map(id => parseInt(id, 10)) : null,
    p_religion: searchParams.get('religion'),
    p_education: searchParams.get('education'),
    p_dating_intent: searchParams.get('dating_intent'),
    p_gender: searchParams.get('gender'),
  };

  const { data, error } = await supabase.rpc('get_filtered_profiles', rpcParams);

  if (error) {
    console.error('Error fetching filtered profiles:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const count = data && data.length > 0 ? data[0].total_count : 0;
  // The RPC function returns the profile structure directly, no need for mapping
  const profiles = data || [];

  return NextResponse.json({ profiles, count });
}
