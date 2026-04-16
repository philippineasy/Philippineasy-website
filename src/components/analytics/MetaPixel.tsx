'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

export default function MetaPixel() {
  useEffect(() => {
    if (!META_PIXEL_ID) return

    // Apply stored consent on mount
    try {
      const stored = localStorage.getItem('cookieConsent')
      if (stored) {
        const consent = JSON.parse(stored)
        if (consent.ads) {
          window.fbq?.('consent', 'grant')
        }
      }
    } catch { /* ignore malformed consent */ }

    // Listen for consent updates from CookieBanner
    const handleConsent = (e: Event) => {
      const { ads } = (e as CustomEvent).detail
      if (ads) {
        window.fbq?.('consent', 'grant')
      } else {
        window.fbq?.('consent', 'revoke')
      }
    }

    window.addEventListener('cookie-consent-update', handleConsent)
    return () => window.removeEventListener('cookie-consent-update', handleConsent)
  }, [])

  if (!META_PIXEL_ID) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('consent', 'revoke');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
