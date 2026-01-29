import { test, expect } from "@playwright/test";

test.describe("Form Validation", () => {
  test("should require email for registration", async ({ page }) => {
    await page.goto("/auth/register");
    await page.fill('input[name="password"]', "TestPass123!");
    await page.click('button[type="submit"]');
    
    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required');
  });

  test("should require password for registration", async ({ page }) => {
    await page.goto("/auth/register");
    await page.fill('input[name="email"]', "test@example.com");
    await page.click('button[type="submit"]');
    
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test("should require valid email format", async ({ page }) => {
    await page.goto("/auth/register");
    
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });
});
