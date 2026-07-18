import posthog from "posthog-js";

/**
 * PostHog is opt-in: with no project key it stays a no-op, so the template runs
 * without an account. Set `VITE_POSTHOG_KEY` (and optionally `VITE_POSTHOG_HOST`
 * to self-host) to enable product analytics.
 */
export function shouldEnablePostHog(key: string | undefined): key is string {
  return typeof key === "string" && key.trim().length > 0;
}

/** Initialize PostHog on the client. Returns whether it was actually enabled. */
export function initPostHog(key: string | undefined, host = "https://us.i.posthog.com"): boolean {
  if (!shouldEnablePostHog(key)) return false;

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    // Respect Do-Not-Track; opt into more capture per project.
    respect_dnt: true,
    persistence: "localStorage+cookie",
  });
  return true;
}

/** Identify the signed-in user; call after login. */
export function identifyUser(id: string, properties?: Record<string, unknown>): void {
  if (posthog.__loaded) posthog.identify(id, properties);
}

/** Reset identity on logout. */
export function resetPostHog(): void {
  if (posthog.__loaded) posthog.reset();
}
