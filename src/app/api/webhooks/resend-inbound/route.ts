import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

const FORWARD_TO = process.env.CONTACT_EMAIL || 'philippineasy@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Resend sends { type: 'email.received', data: { email_id, from, to, subject, ... } }
    if (body.type !== 'email.received') {
      return NextResponse.json({ ignored: true }, { status: 200 });
    }

    const { email_id, from: sender, subject } = body.data;

    if (!email_id) {
      return NextResponse.json({ error: 'Missing email_id' }, { status: 400 });
    }

    const resend = getResend();

    // Fetch the full received email content
    const emailResponse = await fetch(`https://api.resend.com/emails/${email_id}`, {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });

    if (!emailResponse.ok) {
      console.error('Failed to fetch received email:', emailResponse.status);
      return NextResponse.json({ error: 'Failed to fetch email' }, { status: 500 });
    }

    const emailData = await emailResponse.json();

    // Forward the email
    const { error } = await resend.emails.send({
      from: `Philippineasy Forward <noreply@philippineasy.com>`,
      to: FORWARD_TO,
      replyTo: sender,
      subject: `[Fwd] ${subject || '(sans sujet)'}`,
      html: emailData.html || `<pre>${emailData.text || 'Contenu vide'}</pre>`,
    });

    if (error) {
      console.error('Failed to forward email:', error);
      return NextResponse.json({ error: 'Forward failed' }, { status: 500 });
    }

    // Log inbound email
    try {
      const supabase = createServiceRoleClient();
      await supabase.from('email_log').insert({
        email_to: 'contact@philippineasy.com',
        email_from: sender,
        subject: subject || '(sans sujet)',
        category: 'inbound',
        status: 'forwarded',
        direction: 'inbound',
      });
    } catch { /* silent */ }

    // Send Telegram alert
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `📧 Email recu sur contact@philippineasy.com\n\nDe: ${sender}\nSujet: ${subject || '(sans sujet)'}\n\n→ Forwarde vers ${FORWARD_TO}`,
        }),
      }).catch((err) => console.error('Telegram alert error:', err));
    }

    return NextResponse.json({ forwarded: true }, { status: 200 });
  } catch (err) {
    console.error('Resend inbound webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
