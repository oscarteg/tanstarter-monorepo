import { expect, test } from "@playwright/test";

const password = "password123";

/**
 * Account settings — the template's reference form surface. Exercises the real
 * Better Auth endpoints (updateUser / changePassword) against Postgres.
 */
test.describe("settings", () => {
  test.beforeEach(async ({ page }) => {
    const email = `e2e+settings${Date.now()}@example.com`;

    await page.goto("/signup");
    await page.getByLabel("Full Name").fill("Settings User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm Password").fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page).toHaveURL(/\/app/);

    await page.goto("/app/settings");
  });

  test("updates the display name", async ({ page }) => {
    await page.getByLabel("Name").fill("Renamed User");
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("Profile updated.")).toBeVisible();
    // The sidebar reads the same session query, so it reflects the change.
    await expect(page.getByRole("button", { name: /Renamed User/i })).toBeVisible();
  });

  test("rejects a mismatched password confirmation without calling the server", async ({
    page,
  }) => {
    await page.getByLabel("Current password").fill(password);
    await page.getByLabel("New password", { exact: true }).fill("newpassword123");
    await page.getByLabel("Confirm new password").fill("different123");
    await page.getByRole("button", { name: "Change password" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("changes the password", async ({ page }) => {
    await page.getByLabel("Current password").fill(password);
    await page.getByLabel("New password", { exact: true }).fill("newpassword123");
    await page.getByLabel("Confirm new password").fill("newpassword123");
    await page.getByRole("button", { name: "Change password" }).click();

    await expect(page.getByText("Password changed.")).toBeVisible();
  });

  test("asks for confirmation before deleting the account", async ({ page }) => {
    await page.getByRole("button", { name: "Delete account" }).click();

    await expect(page.getByText("Delete your account?")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();

    // Cancelling leaves the account intact.
    await expect(page).toHaveURL(/\/app\/settings/);
  });
});
