import * as Sentry from "@sentry/react";

/**
 * Sentry is opt-in: with no DSN configured it stays a no-op, so the template
 * runs without a Sentry account. Set `VITE_SENTRY_DSN` to enable client error
 * reporting.
 */
export function shouldEnableSentry(dsn: string | undefined): dsn is string {
  return typeof dsn === "string" && dsn.trim().length > 0;
}

/** Initialize Sentry on the client. Returns whether it was actually enabled. */
export function initSentry(dsn: string | undefined, environment?: string): boolean {
  if (!shouldEnableSentry(dsn)) return false;

  Sentry.init({
    dsn,
    environment,
    // Opt into tracing deliberately per project; off by default.
    tracesSampleRate: 0,
  });
  return true;
}
