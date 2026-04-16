/**
 * Meta Pixel Event Tracking — Philippineasy
 *
 * Usage:
 *   import { metaTrackPurchase, metaTrackLead } from '@/lib/meta-pixel'
 *   metaTrackPurchase({ value: 29.99, currency: 'EUR' })
 */

function fbq(...args: any[]) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args)
  }
}

// ─── Standard events ────────────────────────────────────────

export function metaTrackPurchase(params: {
  value: number
  currency?: string
  content_name?: string
  content_ids?: string[]
}) {
  fbq('track', 'Purchase', {
    value: params.value,
    currency: params.currency ?? 'EUR',
    content_name: params.content_name,
    content_ids: params.content_ids,
  })
}

export function metaTrackInitiateCheckout(params?: {
  value?: number
  currency?: string
  content_name?: string
}) {
  fbq('track', 'InitiateCheckout', {
    value: params?.value,
    currency: params?.currency ?? 'EUR',
    content_name: params?.content_name,
  })
}

export function metaTrackCompleteRegistration(params?: {
  content_name?: string
  status?: string
}) {
  fbq('track', 'CompleteRegistration', params)
}

export function metaTrackLead(params?: {
  content_name?: string
  value?: number
  currency?: string
}) {
  fbq('track', 'Lead', {
    value: params?.value,
    currency: params?.currency ?? 'EUR',
    content_name: params?.content_name,
  })
}

export function metaTrackViewContent(params?: {
  content_name?: string
  content_category?: string
  value?: number
  currency?: string
}) {
  fbq('track', 'ViewContent', {
    value: params?.value,
    currency: params?.currency ?? 'EUR',
    content_name: params?.content_name,
    content_category: params?.content_category,
  })
}

export function metaTrackSearch(params?: {
  search_string?: string
}) {
  fbq('track', 'Search', params)
}

// ─── Custom events ──────────────────────────────────────────

export function metaTrackItineraryStarted() {
  fbq('trackCustom', 'ItineraryStarted')
}

export function metaTrackNewsletterSignup(params?: {
  source?: string
}) {
  fbq('trackCustom', 'NewsletterSignup', params)
}

export function metaTrackExitIntentConverted() {
  fbq('trackCustom', 'ExitIntentConverted')
}
