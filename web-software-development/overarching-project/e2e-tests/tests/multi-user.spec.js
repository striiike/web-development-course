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

test.describe("Multi-User Scenarios", () => {
  test("should allow two users to interact with same content", async ({ browser }) => {
    const user1 = await createAuthenticatedPage(browser);
    const user2 = await createAuthenticatedPage(browser);
    
    // User 1 navigates to communities
    await user1.goto("/communities");
    await user1.waitForTimeout(1000);
    
    // User 2 navigates to communities
    await user2.goto("/communities");
    await user2.waitForTimeout(1000);
    
    // Both should see the communities page
    await expect(user1).toHaveURL(/communities/);
    await expect(user2).toHaveURL(/communities/);
    
    await user1.close();
    await user2.close();
  });

  test("should handle concurrent voting", async ({ browser }) => {
    const user1 = await createAuthenticatedPage(browser);
    const user2 = await createAuthenticatedPage(browser);
    
    await user1.goto("/communities");
    await user2.goto("/communities");
    await user1.waitForTimeout(1000);
    await user2.waitForTimeout(1000);
    
    const link1 = user1.locator('a[href^="/communities/"]').first();
    const link2 = user2.locator('a[href^="/communities/"]').first();
    
    if (await link1.isVisible({ timeout: 2000 }) && await link2.isVisible({ timeout: 2000 })) {
      await link1.click();
      await link2.click();
      await user1.waitForTimeout(1000);
      await user2.waitForTimeout(1000);
      
      const upvote1 = user1.locator('button:has-text("↑")').first();
      const upvote2 = user2.locator('button:has-text("↑")').first();
      
      if (await upvote1.isVisible({ timeout: 2000 })) {
        await upvote1.click();
      }
      if (await upvote2.isVisible({ timeout: 2000 })) {
        await upvote2.click();
      }
      
      await user1.waitForTimeout(500);
      await user2.waitForTimeout(500);
    }
    
    await user1.close();
    await user2.close();
  });
});
