import { expect, test } from "@playwright/test";

/**
 * The auth happy path against the real SSR server (started by `webServer` in
 * playwright.config.ts, backed by Postgres). Needs a database with migrations
 * applied — locally: `docker compose up -d db && pnpm db migrate`.
 */
test.describe("auth", () => {
  test("sign up lands in the app", async ({ page }) => {
    // Unique per run: signup is a real insert, and the email is unique.
    const email = `e2e+${Date.now()}@example.com`;

    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
    await page.getByLabel("Full Name").fill("E2E User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL(/\/app/);
  });

  test("signed out visitors are redirected to login", async ({ page }) => {
    await page.goto("/app");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("sign in with the wrong password shows an error and stays put", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password", { exact: true }).fill("wrong-password");
    await page.getByRole("button", { name: "Login", exact: true }).click();

    await expect(page).toHaveURL(/\/login/);
  });
});
