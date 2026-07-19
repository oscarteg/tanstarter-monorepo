import { expect, test } from "@playwright/test";

/**
 * The authed app shell. These menus are Base UI primitives with structural
 * requirements that only fail at runtime — a GroupLabel outside a Group throws
 * when the menu opens, which lint, typecheck and build all pass happily.
 */
test.describe("app shell", () => {
  test.beforeEach(async ({ page }) => {
    const email = `e2e+shell${Date.now()}@example.com`;

    await page.goto("/signup");
    await page.getByLabel("Full Name").fill("E2E Shell");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page).toHaveURL(/\/app/);
  });

  test("the team switcher opens without crashing", async ({ page }) => {
    await page.getByRole("button", { name: /Acme/i }).first().click();

    await expect(page.getByText("Teams")).toBeVisible();
    await expect(page.getByText("Add team")).toBeVisible();
  });

  test("the user menu opens and can sign out", async ({ page }) => {
    await page.getByRole("button", { name: /E2E Shell/i }).click();

    await expect(page.getByText("Account")).toBeVisible();

    await page.getByText("Log out").click();
    await expect(page).toHaveURL(/\/login/);
  });
});
