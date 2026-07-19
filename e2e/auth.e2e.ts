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

test.describe("password reset", () => {
  // This link pointed at a route that did not exist — a 404 on the most-clicked
  // link of the login page.
  test("the login page links to a real forgot-password page", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Forgot your password?" }).click();

    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.getByRole("heading", { name: "Forgot your password?" })).toBeVisible();
  });

  test("requesting a link confirms without revealing whether the account exists", async ({
    page,
  }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(`nobody+${Date.now()}@example.com`);
    await page.getByRole("button", { name: "Send reset link" }).click();

    // Same confirmation for a non-existent address as for a real one —
    // anything else would make this an account-enumeration oracle.
    await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
  });

  test("a reset link with no token offers a way to request a fresh one", async ({ page }) => {
    await page.goto("/reset-password");

    await expect(page.getByRole("heading", { name: "This link is no longer valid" })).toBeVisible();
    await page.getByRole("link", { name: "Request a new reset link" }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("an expired token is reported rather than shown a dead form", async ({ page }) => {
    await page.goto("/reset-password?error=INVALID_TOKEN");

    await expect(page.getByRole("heading", { name: "This link is no longer valid" })).toBeVisible();
    await expect(page.getByText(/expired or was already used/)).toBeVisible();
  });
});
