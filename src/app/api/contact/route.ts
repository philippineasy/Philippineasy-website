import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sendContactAutoReply } from '@/emails/senders/contact';

// ---------------------------------------------------------------------------
// Lazy-init Resend
// ---------------------------------------------------------------------------
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

// ---------------------------------------------------------------------------
// Telegram alert
// ---------------------------------------------------------------------------
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<void> {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured, skipping alert');
    return;
  }

  const preview = message.length > 300 ? message.slice(0, 300) + '...' : message;
  const text =
    `📩 Nouveau message sur Philippineasy\n\n` +
    `De: ${name} (${email})\n` +
    `Sujet: ${subject}\n` +
    `Message: ${preview}\n\n` +
    `→ Repondre: ${email}`;

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error ${res.status}: ${body}`);
  }
}

// ---------------------------------------------------------------------------
// In-memory rate limiter — max 3 emails per hour per IP
// ---------------------------------------------------------------------------
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

// ---------------------------------------------------------------------------
// Allowed subject values
// ---------------------------------------------------------------------------
const VALID_SUBJECTS = [
  'Question generale',
  'Signaler un bug',
  'Demande de partenariat',
  'Autre',
] as const;

type Subject = (typeof VALID_SUBJECTS)[number];

function isValidSubject(value: unknown): value is Subject {
  return VALID_SUBJECTS.includes(value as Subject);
}

// ---------------------------------------------------------------------------
// Admin notification email — uses branded template
// ---------------------------------------------------------------------------
import { buildEmailHtml } from '@/emails/templates/base';
import { emailInfoBox } from '@/emails/templates/components';

function buildAdminNotificationHtml(
  name: string,
  email: string,
  subject: string,
  message: string
): string {
  const escapedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  const bodyHtml = `
    ${emailInfoBox([
      { label: 'Nom', value: name },
      { label: 'Email', value: `<a href="mailto:${email}" style="color:#4A7FD6;text-decoration:none;">${email}</a>` },
      { label: 'Sujet', value: subject },
    ])}

    <p style="margin:16px 0 8px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;font-size:14px;color:#0f172a;line-height:1.7;">
      ${escapedMessage}
    </div>
  `;

  return buildEmailHtml({
    title: 'Nouveau message de contact',
    preheader: `Message de ${name} — ${subject}`,
    bodyHtml,
    ctaText: `Repondre a ${name}`,
    ctaUrl: `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`,
    footerText: "Philippin'Easy — Formulaire de contact",
  });
}

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Resolve client IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Trop de messages envoyes. Reessayez dans une heure.' },
        { status: 429 }
      );
    }

    // Parse body
    const body: unknown = await request.json();

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Corps de la requete invalide.' }, { status: 400 });
    }

    const { name, email, subject, message } = body as Record<string, unknown>;

    // Validate name
    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le nom doit contenir au moins 2 caracteres.' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }

    // Validate subject
    if (!isValidSubject(subject)) {
      return NextResponse.json({ error: 'Sujet invalide.' }, { status: 400 });
    }

    // Validate message
    if (typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Le message doit contenir au moins 10 caracteres.' },
        { status: 400 }
      );
    }

    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();
    const safeMessage = message.trim();

    // Send email via Resend
    const { error: resendError } = await getResend().emails.send({
      from: 'Philippineasy Contact <noreply@philippineasy.com>',
      to: 'contact@philippineasy.com',
      replyTo: safeEmail,
      subject: `[Contact] ${subject} — ${safeName}`,
      html: buildAdminNotificationHtml(safeName, safeEmail, subject, safeMessage),
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      return NextResponse.json(
        { error: "L'envoi de l'email a echoue. Reessayez plus tard." },
        { status: 500 }
      );
    }

    // Send auto-reply to the visitor (non-blocking)
    sendContactAutoReply(safeEmail, safeName, subject, safeMessage).catch((err: unknown) => {
      console.error('Contact auto-reply error:', err instanceof Error ? err.message : err);
    });

    // Send Telegram alert (non-blocking — failure does not affect the response)
    sendTelegramAlert(safeName, safeEmail, subject, safeMessage).catch((err: unknown) => {
      console.error('Telegram alert error:', err instanceof Error ? err.message : err);
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json({ error: 'Erreur serveur. Reessayez plus tard.' }, { status: 500 });
  }
}
