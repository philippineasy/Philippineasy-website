import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendNewsletterWelcome } from '@/emails/senders/newsletter';

export const dynamic = 'force-dynamic';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${origin}/newsletter-confirmee?etat=invalide`);
  }

  const supabase = createServiceRoleClient();

  const { data: subscriber } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, confirmed_at, confirmation_sent_at')
    .eq('confirmation_token', token)
    .single();

  if (!subscriber) {
    return NextResponse.redirect(`${origin}/newsletter-confirmee?etat=invalide`);
  }

  // Already confirmed — idempotent, just show the success page again.
  if (subscriber.confirmed_at) {
    return NextResponse.redirect(`${origin}/newsletter-confirmee`);
  }

  const sentAt = subscriber.confirmation_sent_at ? new Date(subscriber.confirmation_sent_at).getTime() : 0;
  if (!sentAt || Date.now() - sentAt > TOKEN_TTL_MS) {
    return NextResponse.redirect(`${origin}/newsletter-confirmee?etat=invalide`);
  }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ confirmed_at: new Date().toISOString() })
    .eq('id', subscriber.id);

  if (error) {
    console.error('Newsletter confirmation error:', error.message);
    return NextResponse.redirect(`${origin}/newsletter-confirmee?etat=invalide`);
  }

  // Welcome email now that the subscriber is confirmed (non-blocking).
  sendNewsletterWelcome(subscriber.email).catch((err) => {
    console.error('Newsletter welcome email error:', err);
  });

  return NextResponse.redirect(`${origin}/newsletter-confirmee`);
}
