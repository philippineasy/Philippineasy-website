import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { DatingProfile } from '@/types';

export async function POST(request: Request) {
  console.log('API route /api/dating/register called');
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: Partial<DatingProfile> = await request.json();

  // Basic validation
  if (!body.gender || !body.orientation || !body.birth_date || !body.city || !body.description) {
    console.error('Validation failed: Missing required fields');
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // TODO: Add IP check logic here
  console.log('Calling upsert_dating_profile with data:', body);

  console.log('API route /api/dating/register called');
  const { error } = await supabase.rpc('upsert_dating_profile', {
    p_gender: body.gender,
    p_orientation: body.orientation,
    p_birth_date: body.birth_date,
    p_city: body.city,
    p_description: body.description,
    p_profile_picture_url: body.profile_picture_url,
    p_charter_signed_at: body.charter_signed_at ? new Date().toISOString() : null,
    p_height: body.height,
    p_religion: body.religion,
    p_education: body.education,
    p_occupation: body.occupation,
    p_dating_intent: body.dating_intent,
  });
  
  if (!error) {
    // Also initialize the plan in the profiles table
    await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('id', user.id);
  }

  if (error) {
    console.error('Error from upsert_dating_profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('upsert_dating_profile successful');
  
  // Handle interests
  if (body.interests && body.interests.length > 0) {
    // Delete existing interests
    await supabase.from('dating_profile_interests').delete().eq('profile_id', user.id);
    
    const interestLinks = (body.interests as any[]).map((interestId: number) => ({
      profile_id: user.id,
      interest_id: interestId,
    }));
    const { error: interestError } = await supabase.from('dating_profile_interests').insert(interestLinks);
    if (interestError) {
      console.error('Error linking interests:', interestError);
      // Decide if we should rollback or just log the error
    }
  }

  // Handle question answers
  if (body.answers && body.answers.length > 0) {
    // Delete existing answers
    await supabase.from('dating_question_answers').delete().eq('profile_id', user.id);

    const answerLinks = body.answers.map((answer: any) => ({
      ...answer,
      profile_id: user.id,
    }));
    const { error: answerError } = await supabase.from('dating_question_answers').insert(answerLinks);
    if (answerError) {
      console.error('Error linking answers:', answerError);
      // Decide if we should rollback or just log the error
    }
  }

  const { data } = await supabase.from('dating_profiles').select().eq('user_id', user.id).single();

  return NextResponse.json(data);
}
