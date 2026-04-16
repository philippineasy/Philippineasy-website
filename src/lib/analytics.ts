/**
 * GA4 Event Tracking — Philippineasy
 *
 * Usage:
 *   import { trackPurchase, trackBeginCheckout } from '@/lib/analytics'
 *   trackPurchase({ transaction_id: 'abc', value: 29.99, currency: 'EUR', items: [...] })
 */

type GtagEvent = Record<string, string | number | boolean | undefined | GtagItem[]>

interface GtagItem {
  item_id: string
  item_name: string
  item_category?: string
  price?: number
  quantity?: number
}

function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

function trackEvent(eventName: string, params?: GtagEvent) {
  gtag('event', eventName, params)
}

// ─── Ecommerce ──────────────────────────────────────────────

export function trackPurchase(params: {
  transaction_id: string
  value: number
  currency?: string
  items?: GtagItem[]
}) {
  trackEvent('purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency ?? 'EUR',
    items: params.items,
  })
}

export function trackBeginCheckout(params: {
  value: number
  currency?: string
  items?: GtagItem[]
}) {
  trackEvent('begin_checkout', {
    value: params.value,
    currency: params.currency ?? 'EUR',
    items: params.items,
  })
}

// ─── Itinerary funnel ───────────────────────────────────────

export function trackItineraryStarted(params?: {
  destination?: string
  duration_days?: number
}) {
  trackEvent('itinerary_started', params)
}

export function trackItineraryCompleted(params?: {
  destination?: string
  duration_days?: number
  variant?: string
}) {
  trackEvent('itinerary_completed', params)
}

// ─── Lead generation ────────────────────────────────────────

export function trackGenerateLead(params?: {
  form_name?: string
  value?: number
  currency?: string
}) {
  trackEvent('generate_lead', {
    value: params?.value,
    currency: params?.currency ?? 'EUR',
    ...params,
  })
}

export function trackSignUp(params?: {
  method?: string
}) {
  trackEvent('sign_up', params)
}

export function trackNewsletterSignup(params?: {
  source?: string
}) {
  trackEvent('newsletter_signup', params)
}

// ─── CTA & engagement ───────────────────────────────────────

export function trackCtaClicked(params: {
  cta_text: string
  cta_location: string
  destination_url?: string
}) {
  trackEvent('cta_clicked', params)
}

export function trackExitIntentShown() {
  trackEvent('exit_intent_shown')
}

export function trackExitIntentConverted() {
  trackEvent('exit_intent_converted')
}

// ─── Dating ─────────────────────────────────────────────────

export function trackDatingSignUp(params?: {
  gender?: string
}) {
  trackEvent('dating_sign_up', params)
}

export function trackDatingPremiumPurchase(params: {
  transaction_id: string
  value: number
}) {
  trackEvent('dating_premium_purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: 'EUR',
  })
}

// ─── Services ───────────────────────────────────────────────

export function trackServicePurchase(params: {
  transaction_id: string
  value: number
  service_name: string
}) {
  trackEvent('service_purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: 'EUR',
    item_name: params.service_name,
  })
}
