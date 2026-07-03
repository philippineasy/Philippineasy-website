import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { NextResponse } from 'next/server';
import { DatingProfile, Interest } from '@/types';

interface DatingProfileWithDetails extends DatingProfile {
  profiles: { username: string } | null;
}

// Public, SEO-facing showcase used by the anonymous landing (RencontreClientPage
// "Nos derniers membres inscrits"). Deliberately queried with the service-role
// client (bypasses RLS) so this endpoint never depends on — or is silently
// broken by — table-level RLS changes: the safety guarantee here comes from
// explicitly whitelisting validated profiles and a small set of non-sensitive
// columns, not from RLS. No description/religion/education/occupation/
// dating_intent/message counters/etc ever leave this branch.
const getPublicProfilesShowcase = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('dating_profiles')
    .select('user_id, city, birth_date, created_at, profiles ( username )')
    .eq('is_validated', true)
    .not('charter_signed_at', 'is', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const rows = data || [];
  const userIds = rows.map((p: any) => p.user_id);

  // Interests fetched separately (same join direction already proven in
  // datingService.getUserExtras) rather than a reverse embed, then grouped
  // client-side — avoids relying on unverified nested-embed FK resolution.
  let interestsByProfile = new Map<string, Interest[]>();
  if (userIds.length > 0) {
    const { data: interestRows, error: interestsError } = await supabase
      .from('dating_profile_interests')
      .select('profile_id, interests ( id, name, icon )')
      .in('profile_id', userIds);

    if (interestsError) throw interestsError;

    interestsByProfile = (interestRows || []).reduce((acc: Map<string, Interest[]>, row: any) => {
      if (!row.interests) return acc;
      const list = acc.get(row.profile_id) || [];
      list.push(row.interests);
      acc.set(row.profile_id, list);
      return acc;
    }, new Map<string, Interest[]>());
  }

  const profiles = rows.map((p: any) => ({
    user_id: p.user_id,
    username: p.profiles?.username,
    city: p.city,
    created_at: p.created_at,
    age: p.birth_date ? new Date().getFullYear() - new Date(p.birth_date).getFullYear() : undefined,
    interests: interestsByProfile.get(p.user_id) || [],
  }));

  return profiles;
};

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  if (!user) {
    // Anonymous visitor (SEO landing): public, non-sensitive subset only.
    // Filters (age/height/interests/...) are reserved for the authenticated
    // discovery/swipe experience and are intentionally not supported here.
    try {
      const profiles = await getPublicProfilesShowcase(page, limit);
      return NextResponse.json({ profiles, count: profiles.length });
    } catch (error: any) {
      console.error('Error fetching public profiles showcase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

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
