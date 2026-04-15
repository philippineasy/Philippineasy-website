import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendFeedbackRequest } from '@/emails/senders/lifecycle';
import { getUserEmail } from '@/emails/send';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  // Find itineraries that ended 3 days ago (delivered, with duration)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

  const { data: itineraries } = await supabase
    .from('itinerary_generations')
    .select('id, user_id, destination, duration_days, delivered_at')
    .eq('status', 'delivered')
    .eq('payment_status', 'completed')
    .not('delivered_at', 'is', null);

  let sent = 0;
  for (const itinerary of itineraries || []) {
    if (!itinerary.delivered_at || !itinerary.duration_days) continue;

    // Calculate trip end date: delivered_at + duration_days
    const tripEnd = new Date(itinerary.delivered_at);
    tripEnd.setDate(tripEnd.getDate() + itinerary.duration_days);

    // Check if trip ended 3-4 days ago
    if (tripEnd < fourDaysAgo || tripEnd > threeDaysAgo) continue;

    const user = await getUserEmail(itinerary.user_id);
    if (!user) continue;

    // Check if we already sent a feedback email for this itinerary
    const { data: existingLog } = await supabase
      .from('email_log')
      .select('id')
      .eq('user_id', itinerary.user_id)
      .eq('subject', `Comment s'est passe votre voyage a ${itinerary.destination} ?`)
      .limit(1)
      .single();

    if (existingLog) continue; // Already sent

    await sendFeedbackRequest(itinerary.user_id, user.email, user.name, itinerary.destination || 'Philippines');
    sent++;
  }

  return NextResponse.json({ sent });
}
