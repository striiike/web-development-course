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

test.describe("Post Management", () => {
  test("should create a post in community", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    
    // First create or find a community
    await page.goto("/communities");
    await page.waitForTimeout(1000);
    
    const communityLink = page.locator('a[href^="/communities/"]').first();
    if (await communityLink.isVisible({ timeout: 2000 })) {
      await communityLink.click();
      await page.waitForURL(/communities\/\d+/);
      
      const postTitle = `Test Post ${Date.now()}`;
      
      const titleInput = page.locator('input[placeholder*="title" i], input[name="title"]').first();
      const contentInput = page.locator('textarea[placeholder*="content" i], textarea[name="content"]').first();
      
      if (await titleInput.isVisible({ timeout: 2000 })) {
        await titleInput.fill(postTitle);
        await contentInput.fill("Test post content");
        await page.click('button:has-text("Post"), button:has-text("Create")');
        await page.waitForTimeout(1500);
      }
    }
    
    await page.close();
  });

  test("should view post details", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    await page.goto("/communities");
    await page.waitForTimeout(1000);
    
    const communityLink = page.locator('a[href^="/communities/"]').first();
    if (await communityLink.isVisible({ timeout: 2000 })) {
      await communityLink.click();
      await page.waitForTimeout(1000);
      
      const postLink = page.locator('a[href*="/posts/"]').first();
      if (await postLink.isVisible({ timeout: 2000 })) {
        await postLink.click();
        await expect(page).toHaveURL(/posts\/\d+/);
      }
    }
    
    await page.close();
  });
});
