// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: "https://fb9bcec672b03a79d258af305cbf63bb@o4509711982002176.ingest.de.sentry.io/4509711984361552",
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
}

export const onRequestError = Sentry.captureRequestError;
