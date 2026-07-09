import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Force la racine du workspace pour eviter le warning Next 15.5+ qui detecte
  // le package-lock.json dans ~/ comme racine.
  outputFileTracingRoot: path.join(__dirname),

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  async rewrites() {
    return [
      {
        source: "/images/articles/:path*",
        destination:
          "https://byxjlsbmhixdehbisvjp.supabase.co/storage/v1/object/public/articles/:path*",
      },
      {
        source: "/images/products/:path*",
        destination:
          "https://byxjlsbmhixdehbisvjp.supabase.co/storage/v1/object/public/products/:path*",
      },
      {
        source: "/images/pages/:path*",
        destination:
          "https://byxjlsbmhixdehbisvjp.supabase.co/storage/v1/object/public/pages/:path*",
      },
      {
        source: "/images/hero/:path*",
        destination:
          "https://byxjlsbmhixdehbisvjp.supabase.co/storage/v1/object/public/hero/:path*",
      },
      {
        source: "/images/uploads/:path*",
        destination:
          "https://byxjlsbmhixdehbisvjp.supabase.co/storage/v1/object/public/uploads/:path*",
      },
      // BLOC 6.2 : URL publique /itineraire-{slug} mappee vers /itineraires/[slug]
      // (Next.js ne supporte pas le pattern prefix-[slug] dans les folders d'app router)
      {
        source: "/itineraire-:slug",
        destination: "/itineraires/:slug",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/voyager',
        destination: '/voyager-aux-philippines',
        permanent: true,
      },
      {
        source: '/voyager/:slug*',
        destination: '/voyager-aux-philippines/:slug*',
        permanent: true,
      },
      {
        source: '/rencontre',
        destination: '/rencontre-philippines',
        permanent: true,
      },
      {
        source: '/rencontre/:slug*',
        destination: '/rencontre-philippines/:slug*',
        permanent: true,
      },
      {
        source: '/vivre',
        destination: '/vivre-aux-philippines',
        permanent: true,
      },
      {
        source: '/vivre/:slug*',
        destination: '/vivre-aux-philippines/:slug*',
        permanent: true,
      },
      {
        source: '/forums',
        destination: '/forum-sur-les-philippines',
        permanent: true,
      },
      {
        source: '/forums/:slug*',
        destination: '/forum-sur-les-philippines/:slug*',
        permanent: true,
      },
      {
        source: '/marketplace',
        destination: '/marketplace-aux-philippines',
        permanent: true,
      },
      {
        source: '/marketplace/:slug*',
        destination: '/marketplace-aux-philippines/:slug*',
        permanent: true,
      },
      {
        source: '/itineraire',
        destination: '/itineraire-personnalise-pour-les-philippines',
        permanent: true,
      },
      // 2026-07-02 : fusion des hubs thèmes "vivre" dans les 6 pages catégories
      // (fin de la double taxonomie). Sources EXACTES uniquement — les guides
      // enfants (ex. /travailler/creer-entreprise) restent en place.
      {
        source: '/vivre-aux-philippines/s-installer',
        destination: '/vivre-aux-philippines',
        permanent: true,
      },
      {
        source: '/vivre-aux-philippines/s-installer/visas',
        destination: '/vivre-aux-philippines/visas-et-formalites',
        permanent: true,
      },
      {
        source: '/vivre-aux-philippines/s-installer/logement',
        destination: '/vivre-aux-philippines/logement',
        permanent: true,
      },
      {
        source: '/vivre-aux-philippines/s-installer/banque-assurance',
        destination: '/vivre-aux-philippines/banque-finances',
        permanent: true,
      },
      {
        source: '/vivre-aux-philippines/travailler',
        destination: '/vivre-aux-philippines/travail-entreprise',
        permanent: true,
      },
      {
        source: '/vivre-aux-philippines/investir',
        destination: '/vivre-aux-philippines/travail-entreprise',
        permanent: true,
      },
      {
        source: '/vivre-aux-philippines/etudier',
        destination: '/vivre-aux-philippines/culture-integration',
        permanent: true,
      },
      {
        source: '/vivre-aux-philippines/famille',
        destination: '/vivre-aux-philippines/culture-integration',
        permanent: true,
      },
      {
        source: '/actualites',
        destination: '/actualites-sur-les-philippines',
        permanent: true,
      },
      {
        source: '/actualites/:slug*',
        destination: '/actualites-sur-les-philippines/:slug*',
        permanent: true,
      },
      {
        source: '/meilleurs-plans',
        destination: '/meilleurs-plans-aux-philippines',
        permanent: true,
      },
      {
        source: '/meilleurs-plans/:slug*',
        destination: '/meilleurs-plans-aux-philippines/:slug*',
        permanent: true,
      },
      // Redirections spécifiques pour les anciennes URLs indexées par Google
      {
        source: '/meilleurs-plans/activites-excursions',
        destination: '/meilleurs-plans-aux-philippines/activites-excursions',
        permanent: true,
      },
      {
        source: '/meilleurs-plans/hebergements',
        destination: '/meilleurs-plans-aux-philippines/hebergements',
        permanent: true,
      },
      {
        source: '/images',
        destination: '/',
        permanent: true,
      },
      // NOTE: /article/:slug* est géré dynamiquement par middleware.ts
      // car nous devons interroger la DB pour trouver la bonne catégorie

      // Redirections cannibalisation rencontre (Phase E SEO 2026-04-27)
      // Article A "rencontre-femmes-philippines-guide-culturel" passe en draft
      // (status=draft) -> rediriger trafic backlinks vers le winner B.
      // Article C renomme : "rencontrer-philippine-codes-culturels" pivote sur
      // intent culturel different -> nouveau slug, 301 depuis l'ancien.
      {
        source: '/vivre-aux-philippines/culture-integration/rencontre-femmes-philippines-guide-culturel',
        destination: '/vivre-aux-philippines/culture-integration/guide-rencontrer-femmes-philippines-conseils-et-astuces',
        permanent: true,
      },
      {
        source: '/vivre-aux-philippines/culture-integration/rencontrer-philippine-codes-culturels',
        destination: '/vivre-aux-philippines/culture-integration/codes-culturels-philippins-couple-famille-religion',
        permanent: true,
      },
      // Cannibalisation Bohol (Phase F SEO 2026-05-05)
      // Article #45 'bohol-chocolate-hills-tarsiers-plages-panglao' (7K chars) doublon
      // de l'article winner #105 (33K chars, refondu en 'Bohol Philippines :
      // itineraire 5 jours teste'). #45 passe en status=draft, redirect 301
      // pour preserver le jus SEO + eviter les 404 sur backlinks externes.
      {
        source: '/voyager-aux-philippines/cebu-visayas/bohol-chocolate-hills-tarsiers-plages-panglao',
        destination: '/voyager-aux-philippines/cebu-visayas/visiter-bohol-philippines-guide-complet-2026',
        permanent: true,
      },
      // Cannibalisation Siquijor (Phase F SEO 2026-05-05)
      // Article #115 'guide-ultime-explorer-siquijor-philippines-logement' (10K chars)
      // doublon du winner #46 (24K chars, refondu en 'Siquijor Philippines :
      // guide pratique 2026'). #115 passe en status=draft, redirect 301.
      {
        source: '/voyager-aux-philippines/cebu-visayas/guide-ultime-explorer-siquijor-philippines-logement',
        destination: '/voyager-aux-philippines/cebu-visayas/siquijor-mystique',
        permanent: true,
      },
      // Redirections pour les articles recategorises (anciennement dans Actualites)
      {
        source: '/actualites-sur-les-philippines/actualites/guide-ultime-visita-iglesia-manille-eglises-historiques',
        destination: '/voyager-aux-philippines/conseils-voyage/guide-ultime-visita-iglesia-manille-eglises-historiques',
        permanent: true,
      },
      {
        // Cannibalisation Siquijor : passe directement vers le winner
        // (article #46 'siquijor-mystique', refondu 2026-05-05).
        // Avant pointait sur #115 qui est aussi devenu doublon -> court-circuite
        source: '/actualites-sur-les-philippines/actualites/guide-ultime-explorer-siquijor-philippines-logement',
        destination: '/voyager-aux-philippines/cebu-visayas/siquijor-mystique',
        permanent: true,
      },
      {
        source: '/actualites-sur-les-philippines/actualites/guide-ultime-decouvrir-samal-island-philippines',
        destination: '/voyager-aux-philippines/conseils-voyage/guide-ultime-decouvrir-samal-island-philippines',
        permanent: true,
      },
      {
        source: '/actualites-sur-les-philippines/actualites/guide-ultime-voyager-el-nido-coron-2026',
        destination: '/voyager-aux-philippines/palawan/guide-ultime-voyager-el-nido-coron-2026',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // CORS pour les routes API : restreindre au domaine principal et aux
        // previews Vercel. Les webhooks (Stripe, Resend, n8n) sont server-to-server
        // et n'ont pas besoin de CORS — donc pas grave si on les bloque ici.
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_SITE_URL || "https://philippineasy.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          { key: "Vary", value: "Origin" },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            // CSP renforce 2026-04-27 :
            // - connect-src : liste explicite au lieu de '*' (etait un trou geant)
            // - base-uri 'self' : empeche l'injection de <base href> malveillant
            // - form-action : limite ou les forms peuvent submit (anti-CSRF visuel)
            // - frame-ancestors 'none' : anti-clickjacking (HSTS already in place)
            // - object-src 'none' : bloque <object>/<embed> Flash legacy
            // - upgrade-insecure-requests : force HTTPS sur les sub-resources
            // 'unsafe-inline' + 'unsafe-eval' restent pour script-src tant que
            // GTM/Sentry inline-init ne sont pas migres vers nonces CSP
            // (pattern Next 15 mais necessite refacto + middleware nonce, non
            // shippe dans cette session pour eviter de casser les widgets).
            // Tawk.to retire 2026-07-09 (remplace par le chat maison, zero host tiers).
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sentry.io https://cdn.jsdelivr.net https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: https://www.facebook.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.sentry.io https://*.ingest.sentry.io https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.facebook.com https://connect.facebook.net https://maps.googleapis.com https://places.googleapis.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.youtube.com https://youtube.com https://www.facebook.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://hooks.stripe.com",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/imagesHero/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
    // Optimize imports for better tree-shaking
    optimizePackageImports: ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons'],
  },
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'], // Modern image formats for better compression
    minimumCacheTTL: 86400, // Cache optimized images for 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon/thumbnail sizes
    // Lower default quality for better compression (Google PageSpeed recommendation)
    // Individual images can override with quality prop
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'byxjlsbmhixdehbisvjp.supabase.co', pathname: '/storage/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

const sentryConfig = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Suppresses source map uploading logs during build
  silent: true,
  org: "philippineasy",
  project: "javascript-nextjs",
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), sentryConfig);
