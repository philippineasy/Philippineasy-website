// ---------------------------------------------------------------------------
// Unsubscribe token utilities
// ---------------------------------------------------------------------------
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { BRAND } from './config';
import type { EmailCategory } from './types';

/** Get or create an unsubscribe URL for a user */
export async function getUnsubscribeUrl(userId: string, category: EmailCategory): Promise<string> {
  const supabase = createServiceRoleClient();

  // Get existing token or create one
  const { data: existing } = await supabase
    .from('email_preferences')
    .select('unsubscribe_token')
    .eq('user_id', userId)
    .single();

  let token = existing?.unsubscribe_token;

  if (!token) {
    // Create preferences row with default opt-in
    const newToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
    const { data: inserted } = await supabase
      .from('email_preferences')
      .insert({
        user_id: userId,
        unsubscribe_token: newToken,
        community_emails: true,
        marketing_emails: true,
        service_emails: true,
      })
      .select('unsubscribe_token')
      .single();

    token = inserted?.unsubscribe_token || newToken;
  }

  return `${BRAND.siteUrl}/api/email/unsubscribe?token=${token}&category=${category}`;
}

/** Get unsubscribe URL for newsletter subscribers (no user account) */
export async function getNewsletterUnsubscribeUrl(email: string): Promise<string> {
  const supabase = createServiceRoleClient();

  const { data: existing } = await supabase
    .from('email_preferences')
    .select('unsubscribe_token')
    .eq('email', email)
    .single();

  let token = existing?.unsubscribe_token;

  if (!token) {
    const newToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
    const { data: inserted } = await supabase
      .from('email_preferences')
      .insert({
        email,
        unsubscribe_token: newToken,
        marketing_emails: true,
      })
      .select('unsubscribe_token')
      .single();

    token = inserted?.unsubscribe_token || newToken;
  }

  return `${BRAND.siteUrl}/api/email/unsubscribe?token=${token}&category=marketing`;
}
