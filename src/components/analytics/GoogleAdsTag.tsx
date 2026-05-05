'use client'

import { useEffect } from 'react'

// Sanitize: keep only AW-1234567890 format characters (digits, letters, dash).
const RAW_GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const GOOGLE_ADS_ID = RAW_GOOGLE_ADS_ID?.trim().replace(/[^A-Za-z0-9-]/g, '') || undefined

/**
 * Google Ads remarketing tag (AW-XXXXXXXXXX).
 *
 * Strategie de chargement (audit PageSpeed 2026-05-05) :
 * `gtag('config', 'AW-...')` declenche un download de `gtag/js?id=AW-...`
 * (~133 KB). On differe l'appel jusqu'a la PREMIERE interaction utilisateur
 * (scroll/click/touch) ou un timer de fallback (idle 8s) pour que le script
 * Ads ne soit JAMAIS dans la fenetre de mesure du LCP. Pour le remarketing
 * Google Ads cela n'est pas un probleme : les bouncers (sans interaction)
 * ne sont de toute facon pas une audience valable, et l'event page_view sera
 * envoye au moment ou la lib gtag (deja chargee en lazyOnload via
 * GoogleAnalytics.tsx) traite la queue de commandes.
 *
 * Pre-requis (action manuelle Hugo) :
 *   1. Creer le compte Google Ads (cf. guide bloc3-google-ads/3.1)
 *   2. Recuperer l'ID Google Ads (format `AW-XXXXXXXXXX`)
 *   3. Ajouter `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX` dans Vercel
 *   4. Redeployer
 */
export default function GoogleAdsTag() {
  useEffect(() => {
    if (!GOOGLE_ADS_ID) return
    if (typeof window === 'undefined') return

    let fired = false
    const fire = () => {
      if (fired) return
      fired = true
      // gtag est deja initialise dans GoogleAnalytics.tsx (afterInteractive
      // inline). Si la lib gtag.js n'est pas encore chargee (lazyOnload),
      // l'appel queue dans dataLayer et s'execute des que la lib charge.
      window.gtag?.('config', GOOGLE_ADS_ID)
      events.forEach((ev) => window.removeEventListener(ev, fire))
      clearTimeout(idleTimer)
    }

    const events = ['scroll', 'click', 'touchstart', 'keydown', 'mousemove']
    events.forEach((ev) =>
      window.addEventListener(ev, fire, { once: true, passive: true })
    )

    // Fallback : si pas d'interaction sous 8s, fire en idle pour conserver
    // l'attribution remarketing sur les sessions courtes mais non-bounce.
    const idleTimer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        ;(window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(fire)
      } else {
        fire()
      }
    }, 8000)

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, fire))
      clearTimeout(idleTimer)
    }
  }, [])

  return null
}
