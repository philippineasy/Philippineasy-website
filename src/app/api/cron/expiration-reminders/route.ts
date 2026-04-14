import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendExpiryWarning } from '@/emails/senders/lifecycle';
import { getUserEmail } from '@/emails/send';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const now = new Date();
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in8days = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
  let sent = 0;

  // Check Easy Plus expiry
  const { data: easyPlusProfiles } = await supabase
    .from('profiles')
    .select('id, easy_plus_expires_at')
    .gte('easy_plus_expires_at', in7days.toISOString())
    .lte('easy_plus_expires_at', in8days.toISOString());

  for (const profile of easyPlusProfiles || []) {
    const user = await getUserEmail(profile.id);
    if (!user) continue;

    const expiryDate = new Date(profile.easy_plus_expires_at).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    await sendExpiryWarning(profile.id, user.email, user.name, 'Easy Plus', expiryDate);
    sent++;
  }

  // Check Rencontre Premium expiry
  const { data: premiumProfiles } = await supabase
    .from('profiles')
    .select('id, rencontre_premium_expires_at')
    .gte('rencontre_premium_expires_at', in7days.toISOString())
    .lte('rencontre_premium_expires_at', in8days.toISOString());

  for (const profile of premiumProfiles || []) {
    const user = await getUserEmail(profile.id);
    if (!user) continue;

    const expiryDate = new Date(profile.rencontre_premium_expires_at).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    await sendExpiryWarning(profile.id, user.email, user.name, 'Rencontre Premium', expiryDate);
    sent++;
  }

  return NextResponse.json({ sent });
}
