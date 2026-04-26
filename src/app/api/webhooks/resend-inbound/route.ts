import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import crypto from 'node:crypto';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

const FORWARD_TO = process.env.CONTACT_EMAIL || 'philippineasy@gmail.com';
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

// Resend webhooks are signed by Svix. Header layout:
//   svix-id: msg_xxx
//   svix-timestamp: 1234567890
//   svix-signature: v1,<base64sig> v1,<another>
function verifySvixSignature(rawBody: string, headers: Headers): boolean {
  if (!WEBHOOK_SECRET) {
    // Fail-CLOSED in production (no secret = reject), open only in dev.
    if (process.env.NODE_ENV === 'production') {
      console.error('[resend-inbound] RESEND_WEBHOOK_SECRET not configured in production — rejecting webhook');
      return false;
    }
    console.warn('[resend-inbound] RESEND_WEBHOOK_SECRET not set — signature verification SKIPPED (dev only)');
    return true;
  }
  const id = headers.get('svix-id');
  const timestamp = headers.get('svix-timestamp');
  const signatureHeader = headers.get('svix-signature');
  if (!id || !timestamp || !signatureHeader) return false;

  const secret = WEBHOOK_SECRET.startsWith('whsec_') ? WEBHOOK_SECRET.slice(6) : WEBHOOK_SECRET;
  const secretBytes = Buffer.from(secret, 'base64');
  const signedPayload = `${id}.${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secretBytes).update(signedPayload).digest('base64');

  const candidates = signatureHeader
    .split(' ')
    .map((p) => p.split(',')[1])
    .filter(Boolean);
  return candidates.some((sig) =>
    sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    if (!verifySvixSignature(rawBody, request.headers)) {
      console.error('Resend inbound webhook: invalid Svix signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    if (body.type !== 'email.received') {
      return NextResponse.json({ ignored: true, type: body.type }, { status: 200 });
    }

    const { email_id } = body.data ?? {};
    if (!email_id) {
      return NextResponse.json({ error: 'Missing email_id' }, { status: 400 });
    }

    // Inbound emails live under /emails/receiving/{id} — NOT /emails/{id}.
    // The latter is for outbound (Sending) and returns 404 on inbound IDs.
    const emailResponse = await fetch(
      `https://api.resend.com/emails/receiving/${email_id}`,
      { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } }
    );

    if (!emailResponse.ok) {
      const detail = await emailResponse.text();
      console.error('Failed to fetch inbound email', emailResponse.status, detail);
      return NextResponse.json(
        { error: 'Failed to fetch email', upstream: emailResponse.status, detail },
        { status: 502 }
      );
    }

    const emailData = await emailResponse.json();
    const sender = emailData.from as string;
    const subject = (emailData.subject as string) || '(sans sujet)';
    const replyTo = Array.isArray(emailData.reply_to) && emailData.reply_to.length > 0
      ? emailData.reply_to[0]
      : sender;

    const resend = getResend();
    const { error: forwardError } = await resend.emails.send({
      from: `Philippineasy Forward <noreply@philippineasy.com>`,
      to: FORWARD_TO,
      replyTo,
      subject: `[Fwd] ${subject}`,
      html: emailData.html || `<pre>${emailData.text || 'Contenu vide'}</pre>`,
      text: emailData.text || undefined,
    });

    if (forwardError) {
      console.error('Failed to forward inbound email', forwardError);
      return NextResponse.json({ error: 'Forward failed', detail: forwardError }, { status: 500 });
    }

    try {
      const supabase = createServiceRoleClient();
      await supabase.from('email_log').insert({
        email_to: 'contact@philippineasy.com',
        email_from: sender,
        subject,
        category: 'inbound',
        status: 'forwarded',
        direction: 'inbound',
      });
    } catch (logErr) {
      console.warn('Failed to log inbound email', logErr);
    }

    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `📧 Email recu sur contact@philippineasy.com\n\nDe: ${sender}\nSujet: ${subject}\n\n→ Forwarde vers ${FORWARD_TO}`,
        }),
      }).catch((err) => console.error('Telegram alert error:', err));
    }

    return NextResponse.json({ forwarded: true, to: FORWARD_TO }, { status: 200 });
  } catch (err) {
    console.error('Resend inbound webhook error:', err);
    return NextResponse.json({ error: 'Internal error', detail: String(err) }, { status: 500 });
  }
}
