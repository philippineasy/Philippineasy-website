// ---------------------------------------------------------------------------
// Unified email send function — wraps Resend with preference checking
// ---------------------------------------------------------------------------
import { Resend } from 'resend';
import { EMAIL_FROM } from './config';
import type { SendEmailParams } from './types';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY not configured');
    resendInstance = new Resend(key);
  }
  return resendInstance;
}

// In-memory rate limiter for community emails
const rateLimitCache = new Map<string, number>();

function isEmailRateLimited(to: string, category: string): boolean {
  if (category !== 'community') return false;

  const key = `${to}:${category}`;
  const lastSent = rateLimitCache.get(key);
  const now = Date.now();
  const cooldownMs = 30 * 60 * 1000; // 30 minutes between community emails per recipient

  if (lastSent && now - lastSent < cooldownMs) {
    return true;
  }

  rateLimitCache.set(key, now);

  // Clean old entries every 100 inserts
  if (rateLimitCache.size > 500) {
    const cutoff = now - cooldownMs;
    for (const [k, v] of rateLimitCache) {
      if (v < cutoff) rateLimitCache.delete(k);
    }
  }

  return false;
}

/**
 * Send an email with preference checking and rate limiting.
 * Transactional emails are always sent. Other categories check user preferences.
 */
export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const { to, from, subject, html, category, userId, replyTo } = params;

  // Check preferences for non-transactional emails
  if (category !== 'transactional' && userId) {
    const shouldSend = await checkEmailPreference(userId, category);
    if (!shouldSend) {
      return { success: true }; // Silently skip — user opted out
    }
  }

  // Rate limit community emails (max 1 per 30 min per recipient)
  if (isEmailRateLimited(to, category)) {
    return { success: true }; // Silently skip — rate limited
  }

  try {
    const { error } = await getResend().emails.send({
      from: EMAIL_FROM[from],
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      console.error(`Email send error [${from}→${to}]:`, error.message);
      logEmail(userId, to, EMAIL_FROM[from], subject, category, 'failed').catch(() => {});
      return { success: false, error: error.message };
    }

    // Log successful send
    logEmail(userId, to, EMAIL_FROM[from], subject, category, 'sent').catch(() => {});

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error(`Email send exception [${from}→${to}]:`, message);
    logEmail(userId, to, EMAIL_FROM[from], subject, category, 'error').catch(() => {});
    return { success: false, error: message };
  }
}

/** Log email to database for history tracking */
async function logEmail(
  userId: string | undefined,
  to: string,
  from: string,
  subject: string,
  category: string,
  status: string,
) {
  try {
    const supabase = createServiceRoleClient();
    await supabase.from('email_log').insert({
      user_id: userId || null,
      email_to: to,
      email_from: from,
      subject,
      category,
      status,
      direction: 'outbound',
    });
  } catch {
    // Silent fail — logging should never block email delivery
  }
}

/** Check if user has opted in for a given email category */
async function checkEmailPreference(userId: string, category: string): Promise<boolean> {
  try {
    const supabase = createServiceRoleClient();
    const columnMap: Record<string, string> = {
      community: 'community_emails',
      marketing: 'marketing_emails',
      service: 'service_emails',
    };

    const column = columnMap[category];
    if (!column) return true; // Unknown category — send by default

    const { data } = await supabase
      .from('email_preferences')
      .select(column)
      .eq('user_id', userId)
      .single();

    if (!data) return true; // No preferences row — send by default
    return (data as unknown as Record<string, unknown>)[column] !== false;
  } catch {
    return true; // On error, send rather than silently drop
  }
}

/** Get user email from Supabase auth (for triggers that only have userId) */
export async function getUserEmail(userId: string): Promise<{ email: string; name: string } | null> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', userId)
      .single();

    const { data: authData } = await supabase.auth.admin.getUserById(userId);

    if (!authData?.user?.email) return null;

    return {
      email: authData.user.email,
      name: data?.username || authData.user.user_metadata?.username || 'voyageur',
    };
  } catch {
    return null;
  }
}
