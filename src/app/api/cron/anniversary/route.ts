import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendAnniversaryEmail } from '@/emails/senders/lifecycle';
import { getUserEmail } from '@/emails/send';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  // Find profiles created exactly 1 year ago (today's date last year)
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const dayAfter = new Date(oneYearAgo);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .gte('created_at', oneYearAgo.toISOString())
    .lt('created_at', dayAfter.toISOString());

  let sent = 0;
  for (const profile of profiles || []) {
    const user = await getUserEmail(profile.id);
    if (!user) continue;

    await sendAnniversaryEmail(profile.id, user.email, user.name);
    sent++;
  }

  return NextResponse.json({ sent });
}
