'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // Apply stored consent on mount
    try {
      const stored = localStorage.getItem('cookieConsent')
      if (stored) {
        const consent = JSON.parse(stored)
        window.gtag?.('consent', 'update', {
          analytics_storage: consent.analytics ? 'granted' : 'denied',
          ad_storage: consent.ads ? 'granted' : 'denied',
          ad_user_data: consent.ads ? 'granted' : 'denied',
          ad_personalization: consent.ads ? 'granted' : 'denied',
        })
      }
    } catch { /* ignore malformed consent */ }

    // Listen for consent updates from CookieBanner
    const handleConsent = (e: Event) => {
      const { analytics, ads } = (e as CustomEvent).detail
      window.gtag?.('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: ads ? 'granted' : 'denied',
        ad_user_data: ads ? 'granted' : 'denied',
        ad_personalization: ads ? 'granted' : 'denied',
      })
    }

    window.addEventListener('cookie-consent-update', handleConsent)
    return () => window.removeEventListener('cookie-consent-update', handleConsent)
  }, [])

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
          });
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
