import { defineConfig, devices } from "@playwright/test";

const MARKETING_URL = "http://localhost:4321";
const APP_URL = "http://localhost:3000";

/**
 * Matches docker-compose's `db` service, so `docker compose up -d db` is all a
 * local run needs. CI overrides it to point at its Postgres service.
 */
const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgres://postgres:password@localhost:5432/tanstarter";

/**
 * End-to-end tests. Both suites are self-contained: Playwright builds and
 * serves each app itself (see `webServer`), so nothing has to be deployed
 * first.
 *
 * - `marketing` runs against a preview of the static build.
 * - `app` runs against the real SSR server (the same Nitro output the Docker
 *   image runs), which needs Postgres with migrations applied.
 */
export default defineConfig({
  testDir: "./e2e",
  // `*.e2e.ts`, not `*.spec.ts`, so Vitest (which claims `*.test|spec.*`)
  // never tries to run these Playwright suites.
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Sequential in CI: stability over speed on a shared 2-core runner.
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "marketing",
      testMatch: "**/marketing.e2e.ts",
      use: { ...devices["Desktop Chrome"], baseURL: MARKETING_URL },
    },
    {
      name: "app",
      testMatch: "**/auth.e2e.ts",
      use: { ...devices["Desktop Chrome"], baseURL: APP_URL },
    },
  ],
  webServer: [
    {
      command: "vp run --filter=@repo/marketing build && vp run --filter=@repo/marketing preview",
      url: MARKETING_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      // The built SSR server, not `dev` — this exercises what actually ships.
      command: "vp run --filter=web build && node apps/web/.output/server/index.mjs",
      url: APP_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: {
        DATABASE_URL,
        BETTER_AUTH_SECRET:
          process.env.BETTER_AUTH_SECRET ?? "e2e-secret-not-for-production-min-32-chars",
        VITE_BASE_URL: APP_URL,
        PORT: "3000",
      },
    },
  ],
});
