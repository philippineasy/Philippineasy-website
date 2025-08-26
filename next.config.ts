import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://embed.tawk.to https://*.sentry.io https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://embed.tawk.to; img-src * data:; font-src 'self' data: https://embed.tawk.to; connect-src * wss://*.tawk.to;",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'byxjlsbmhixdehbisvjp.supabase.co',
      'images.unsplash.com',
      'via.placeholder.com',
      'randomuser.me',
      'storage.googleapis.com',
      'ui-avatars.com',
      'lh3.googleusercontent.com',
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
