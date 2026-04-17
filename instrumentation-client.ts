// This file configures the Sentry browser client.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://fb9bcec672b03a79d258af305cbf63bb@o4509711982002176.ingest.de.sentry.io/4509711984361552",

  // Reduce trace sampling in production to control Sentry quota usage.
  // Errors are always captured — only performance traces are sampled.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Filter out noise: browser extension errors, network chunk failures,
  // cross-origin script errors. These are not actionable code bugs.
  ignoreErrors: [
    // Browser extensions / ad-blockers injecting malformed scripts
    "Failed to execute 'appendChild' on 'Node': Invalid or unexpected token",
    "Can't find variable: ZiteReader",
    "jigsaw is not defined",
    "ComboSearch is not defined",
    // Next.js RSC streaming interrupted by user navigation or network loss
    "Unexpected EOF",
    "ChunkLoadError",
    "Loading chunk",
    "Loading CSS chunk",
    // Cross-origin scripts (masked by browser for security)
    "Script error.",
    "Script error",
    // Network errors (user connection issues, not our bugs)
    "NetworkError when attempting to fetch resource",
    "Failed to fetch",
    "Load failed",
    "AbortError",
    // Meta Pixel / GA script blocked by ad-blocker
    "fbq is not defined",
    "gtag is not defined",
    // ResizeObserver spurious errors (benign, browser-level)
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
  ],

  // Deny errors originating from browser extensions — these are not our code.
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,
    /^safari-web-extension:\/\//i,
  ],

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
