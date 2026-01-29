import { test, expect } from "@playwright/test";

async function createAuthenticatedPage(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const email = `test${Date.now()}@example.com`;
  
  await page.goto("/auth/register");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "TestPass123!");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "TestPass123!");
  await page.click('button[type="submit"]');
  await page.waitForURL("/");
  
  return page;
}

test.describe("Community Features", () => {
  test("should view communities page", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    await page.goto("/communities");
    await expect(page).toHaveURL(/communities/);
    await page.close();
  });

  test("should create a community", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    await page.goto("/communities");
    
    const communityName = `Test Community ${Date.now()}`;
    
    const nameInput = page.locator('input[placeholder*="name" i], input[name="name"]').first();
    const descInput = page.locator('textarea[placeholder*="desc" i], textarea[name="description"]').first();
    
    if (await nameInput.isVisible({ timeout: 2000 })) {
      await nameInput.fill(communityName);
      await descInput.fill("Test description");
      await page.click('button:has-text("Create")');
      await page.waitForTimeout(1500);
      
      await expect(page.locator(`text=${communityName}`)).toBeVisible({ timeout: 5000 });
    }
    
    await page.close();
  });

  test("should navigate to community detail", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    await page.goto("/communities");
    
    await page.waitForTimeout(1000);
    const firstCommunity = page.locator('a[href^="/communities/"]').first();
    
    if (await firstCommunity.isVisible({ timeout: 2000 })) {
      await firstCommunity.click();
      await expect(page).toHaveURL(/communities\/\d+/);
    }
    
    await page.close();
  });
});
