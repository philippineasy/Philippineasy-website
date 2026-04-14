// ---------------------------------------------------------------------------
// Email system types
// ---------------------------------------------------------------------------

/** Categories for email preference management */
export type EmailCategory =
  | 'transactional'  // Cannot unsubscribe (auth, payment confirmations)
  | 'community'      // Forum, dating notifications
  | 'marketing'      // Newsletter, promotions
  | 'service';       // Service-specific (calls, expiry reminders)

/** Options for the base email template */
export interface BaseEmailOptions {
  title: string;
  preheader?: string;
  userName?: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  footerText?: string;
  unsubscribeUrl?: string;
}

/** Parameters for the unified send function */
export interface SendEmailParams {
  to: string;
  from: keyof typeof import('./config').EMAIL_FROM;
  subject: string;
  html: string;
  category: EmailCategory;
  userId?: string;
  replyTo?: string;
}
