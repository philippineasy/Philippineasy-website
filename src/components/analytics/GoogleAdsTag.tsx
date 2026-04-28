'use client'

import Script from 'next/script'

// Sanitize: keep only AW-1234567890 format characters (digits, letters, dash).
// Resilient to env values pollued with stray \n, quotes ou whitespace (cf. bug
// META_PIXEL_ID que Vercel avait stocke avec \n litteral).
const RAW_GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const GOOGLE_ADS_ID = RAW_GOOGLE_ADS_ID?.trim().replace(/[^A-Za-z0-9-]/g, '') || undefined

/**
 * Google Ads Tag — pose le pixel de remarketing Google Ads pour permettre
 * la creation d'audiences (visiteurs site, abandons checkout, etc.) utilisables
 * dans les campagnes Display/Remarketing.
 *
 * GA4 charge deja gtag.js (cf. GoogleAnalytics.tsx). Ce composant ajoute
 * uniquement la commande `gtag('config', 'AW-XXX')` pour activer le tag Google Ads.
 *
 * Pre-requis (action manuelle Hugo) :
 *   1. Creer le compte Google Ads (cf. guide bloc3-google-ads/3.1)
 *   2. Recuperer l'ID Google Ads (format `AW-XXXXXXXXXX`)
 *   3. Ajouter `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX` dans Vercel (Production, Preview, Development)
 *   4. Redeployer
 *
 * Le composant retourne null tant que l'env var est absente — aucun script
 * charge inutilement, aucune erreur en local sans la valeur.
 */
export default function GoogleAdsTag() {
  if (!GOOGLE_ADS_ID) return null

  return (
    <Script
      id="google-ads-tag"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `gtag('config','${GOOGLE_ADS_ID}');`,
      }}
    />
  )
}
