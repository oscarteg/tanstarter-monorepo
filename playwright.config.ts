import { defineConfig, devices } from "@playwright/test";

const MARKETING_URL = "http://localhost:4321";

/**
 * End-to-end smoke tests.
 *
 * The `marketing` suite runs against a preview of the static build, started by
 * `webServer` below — so `pnpm test:e2e` is self-contained. The `auth` suite
 * runs against a running app pointed at by `E2E_APP_URL` (set in CI once the
 * web app + Postgres are up); it skips itself when that isn't set.
 */
export default defineConfig({
  testDir: "./e2e",
  // `*.e2e.ts`, not `*.spec.ts`, so Vitest (which claims `*.test|spec.*`)
  // never tries to run these Playwright suites.
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: MARKETING_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "vp run --filter=@repo/marketing build && vp run --filter=@repo/marketing preview",
    url: MARKETING_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
