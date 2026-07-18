import { expect, test } from "@playwright/test";

// The auth flow needs the running web app (+ Postgres). CI sets E2E_APP_URL
// once the app is up; locally this suite skips itself.
const appUrl = process.env.E2E_APP_URL;

test.describe("auth happy path", () => {
  test.skip(!appUrl, "Set E2E_APP_URL to run the auth E2E against a running app.");

  test("sign up then land in the app", async ({ page }) => {
    const email = `e2e+${Date.now()}@example.com`;

    await page.goto(`${appUrl}/signup`);
    await page.getByLabel("Full Name").fill("E2E User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL(/\/app/);
  });
});
