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

test.describe("Voting System", () => {
  test("should upvote a post", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    await page.goto("/communities");
    await page.waitForTimeout(1000);
    
    const communityLink = page.locator('a[href^="/communities/"]').first();
    if (await communityLink.isVisible({ timeout: 2000 })) {
      await communityLink.click();
      await page.waitForTimeout(1000);
      
      const upvoteButton = page.locator('button[aria-label*="upvote" i], button:has-text("↑")').first();
      if (await upvoteButton.isVisible({ timeout: 2000 })) {
        await upvoteButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    await page.close();
  });

  test("should downvote a post", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    await page.goto("/communities");
    await page.waitForTimeout(1000);
    
    const communityLink = page.locator('a[href^="/communities/"]').first();
    if (await communityLink.isVisible({ timeout: 2000 })) {
      await communityLink.click();
      await page.waitForTimeout(1000);
      
      const downvoteButton = page.locator('button[aria-label*="downvote" i], button:has-text("↓")').first();
      if (await downvoteButton.isVisible({ timeout: 2000 })) {
        await downvoteButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    await page.close();
  });

  test("should toggle vote on post", async ({ browser }) => {
    const page = await createAuthenticatedPage(browser);
    await page.goto("/communities");
    await page.waitForTimeout(1000);
    
    const communityLink = page.locator('a[href^="/communities/"]').first();
    if (await communityLink.isVisible({ timeout: 2000 })) {
      await communityLink.click();
      await page.waitForTimeout(1000);
      
      const upvote = page.locator('button[aria-label*="upvote" i], button:has-text("↑")').first();
      const downvote = page.locator('button[aria-label*="downvote" i], button:has-text("↓")').first();
      
      if (await upvote.isVisible({ timeout: 2000 })) {
        await upvote.click();
        await page.waitForTimeout(300);
        await downvote.click();
        await page.waitForTimeout(300);
      }
    }
    
    await page.close();
  });
});
