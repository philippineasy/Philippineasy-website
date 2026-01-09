import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
    ];
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://embed.tawk.to https://*.sentry.io https://cdn.jsdelivr.net https://js.stripe.com; style-src 'self' 'unsafe-inline' https://embed.tawk.to; img-src * data:; font-src 'self' data: https://embed.tawk.to; connect-src * wss://*.tawk.to; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;",
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
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon/thumbnail sizes
    // Lower default quality for better compression (Google PageSpeed recommendation)
    // Individual images can override with quality prop
    unoptimized: false,
    domains: [
      'byxjlsbmhixdehbisvjp.supabase.co',
      'images.unsplash.com',
      'via.placeholder.com',
      'randomuser.me',
      'storage.googleapis.com',
      'ui-avatars.com',
      'lh3.googleusercontent.com',
    ],
    // Configure loader options for better compression
    loaderFile: undefined,
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
