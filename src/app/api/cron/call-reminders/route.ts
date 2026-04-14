import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendCallReminder } from '@/emails/senders/lifecycle';
import { getUserEmail } from '@/emails/send';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  // Find call bookings scheduled within the next 24-28 hours that haven't been reminded
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in28h = new Date(now.getTime() + 28 * 60 * 60 * 1000);

  const { data: bookings, error } = await supabase
    .from('call_bookings')
    .select('id, user_id, scheduled_at, purchase:service_purchases(service_type)')
    .gte('scheduled_at', in24h.toISOString())
    .lte('scheduled_at', in28h.toISOString())
    .eq('status', 'confirmed')
    .is('reminder_sent_at', null);

  if (error) {
    console.error('Call reminders cron error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }

  let sent = 0;
  for (const booking of bookings || []) {
    const user = await getUserEmail(booking.user_id);
    if (!user) continue;

    const purchase = Array.isArray(booking.purchase) ? booking.purchase[0] : booking.purchase;
    const serviceName = (purchase?.service_type || 'Service').replace(/_/g, ' ');
    const callDate = new Date(booking.scheduled_at).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    await sendCallReminder(booking.user_id, user.email, user.name, callDate, serviceName);

    // Mark as reminded
    await supabase
      .from('call_bookings')
      .update({ reminder_sent_at: now.toISOString() })
      .eq('id', booking.id);

    sent++;
  }

  return NextResponse.json({ sent, total: bookings?.length || 0 });
}
