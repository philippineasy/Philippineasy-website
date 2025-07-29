import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
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
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'byxjlsbmhixdehbisvjp.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
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
