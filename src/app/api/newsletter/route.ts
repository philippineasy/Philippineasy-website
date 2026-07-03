import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendNewsletterConfirmation } from '@/emails/senders/newsletter';

export const dynamic = 'force-dynamic';

const RESEND_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Optional origin tag (e.g. 'app_launch' waitlist, 'footer', 'lead_magnet').
    // Whitelisted to a short slug so it can never carry arbitrary payloads; when
    // absent, the DB column keeps its 'footer' default — existing callers are
    // unaffected.
    const insertRow: { email: string; source?: string; confirmation_sent_at: string } = {
      email: normalizedEmail,
      confirmation_sent_at: new Date().toISOString(),
    };
    if (typeof source === 'string' && /^[a-z0-9_]{1,32}$/.test(source)) {
      insertRow.source = source;
    }

    const supabase = createServiceRoleClient();

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, confirmation_token, confirmed_at, confirmation_sent_at')
      .eq('email', normalizedEmail)
      .single();

    // Already confirmed — nothing to do.
    if (existing?.confirmed_at) {
      return NextResponse.json({ message: 'Vous êtes déjà inscrit(e) !' }, { status: 200 });
    }

    if (existing) {
      // Registered but not confirmed yet — resend the confirmation email, rate-limited.
      const lastSent = existing.confirmation_sent_at ? new Date(existing.confirmation_sent_at).getTime() : 0;
      if (Date.now() - lastSent < RESEND_COOLDOWN_MS) {
        return NextResponse.json(
          { message: 'Un email de confirmation vous a déjà été envoyé. Vérifiez votre boîte mail (et vos spams).' },
          { status: 200 },
        );
      }

      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (updateError) throw updateError;

      sendNewsletterConfirmation(normalizedEmail, existing.confirmation_token).catch((err) => {
        console.error('Newsletter confirmation email error:', err);
      });

      return NextResponse.json(
        { message: 'Vérifiez votre boîte mail pour confirmer votre inscription.' },
        { status: 200 },
      );
    }

    const { data: inserted, error } = await supabase
      .from('newsletter_subscribers')
      .insert(insertRow)
      .select('confirmation_token')
      .single();

    if (error || !inserted) {
      throw error || new Error('Newsletter insert failed');
    }

    sendNewsletterConfirmation(normalizedEmail, inserted.confirmation_token).catch((err) => {
      console.error('Newsletter confirmation email error:', err);
    });

    return NextResponse.json(
      { message: 'Vérifiez votre boîte mail pour confirmer votre inscription.' },
      { status: 201 },
    );
  } catch (err) {
    const error = err as Error;
    console.error('Newsletter subscription error:', error.message);
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}
