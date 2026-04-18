// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: "https://fb9bcec672b03a79d258af305cbf63bb@o4509711982002176.ingest.de.sentry.io/4509711984361552",
    // Only report from production — dev errors are visible in terminal,
    // no need to burn Sentry quota on dev-mode noise.
    enabled: process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
}

export const onRequestError = Sentry.captureRequestError;
