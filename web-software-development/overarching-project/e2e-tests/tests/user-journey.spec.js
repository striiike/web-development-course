import { test, expect } from "@playwright/test";

async function createAuthenticatedPage(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const email = `journey${Date.now()}@example.com`;
  
  await page.goto("/auth/register");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "Journey123!");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "Journey123!");
  await page.click('button[type="submit"]');
  await page.waitForURL("/");
  
  return page;
}

test.describe("Complete User Journey", () => {
  test("should complete full workflow from registration to interaction", async ({ browser }) => {
    const email = `fulljourney${Date.now()}@example.com`;
    const page = await browser.newPage();
    
    // 1. Registration
    await page.goto("/auth/register");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "Journey123!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2500);
    
    // 2. Login
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "Journey123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
    
    // 3. Navigate to communities
    await page.goto("/communities");
    await expect(page).toHaveURL(/communities/);
    
    // 4. Interact with a community if available
    await page.waitForTimeout(1000);
    const communityLink = page.locator('a[href^="/communities/"]').first();
    if (await communityLink.isVisible({ timeout: 2000 })) {
      await communityLink.click();
      await page.waitForTimeout(1000);
    }
    
    // 5. Go back to home
    await page.goto("/");
    await expect(page).toHaveURL("/");
    
    // 6. Logout
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await logoutButton.click();
      await page.waitForTimeout(500);
    }
    
    await page.close();
  });

  test("should persist session across page refreshes", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    
    await page.goto("/communities");
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Should still be on communities page after refresh
    await expect(page).toHaveURL(/communities/);
    
    await page.close();
  });
});
