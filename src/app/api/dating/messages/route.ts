import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to_user_id, content } = await request.json();

  if (!to_user_id || !content) {
    return NextResponse.json({ error: 'Missing to_user_id or content' }, { status: 400 });
  }

  // Check user's plan and message count
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      plan,
      dating_profiles ( message_daily_count, last_message_reset )
    `)
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !profile.dating_profiles) {
    return NextResponse.json({ error: 'Profile not found or error fetching profile.' }, { status: 500 });
  }

  const datingProfile = Array.isArray(profile.dating_profiles) ? profile.dating_profiles[0] : profile.dating_profiles;

  // Reset daily count if it's a new day
  const lastReset = new Date(datingProfile.last_message_reset || 0);
  const now = new Date();
  if (now.toDateString() !== lastReset.toDateString()) {
    const { error: updateError } = await supabase
      .from('dating_profiles')
      .update({ message_daily_count: 0, last_message_reset: now.toISOString() })
      .eq('user_id', user.id);
    if (updateError) {
      // Log error but proceed, as it's not critical to block the message
      console.error("Failed to reset message count:", updateError);
    }
    datingProfile.message_daily_count = 0;
  }

  if (profile.plan === 'free' && datingProfile.message_daily_count >= 2) {
    return NextResponse.json({ error: 'Daily message limit reached. Upgrade to premium.' }, { status: 429 });
  }

  // Insert the message
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({ from_user_id: user.id, to_user_id, content })
    .select()
    .single();

  if (messageError) {
    return NextResponse.json({ error: messageError.message }, { status: 500 });
  }

  // Increment message count for free users
  if (profile.plan === 'free') {
    await supabase
      .from('dating_profiles')
      .update({ message_daily_count: datingProfile.message_daily_count + 1 })
      .eq('user_id', user.id);
  }

  return NextResponse.json(message);
}
