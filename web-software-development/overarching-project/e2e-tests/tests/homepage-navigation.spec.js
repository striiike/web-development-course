import { test, expect } from "@playwright/test";

test.describe("Homepage and Navigation", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator('body')).toBeVisible();
  });

  test("should navigate to communities page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/communities"]');
    await expect(page).toHaveURL(/communities/);
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");
    const loginLink = page.locator('a[href="/auth/login"]');
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/auth\/login/);
    }
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/");
    const registerLink = page.locator('a[href="/auth/register"]');
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/auth\/register/);
    }
  });

  test("should display navigation elements", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('header, nav').first();
    await expect(nav).toBeVisible({ timeout: 5000 });
  });
});
