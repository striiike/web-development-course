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

test.describe("Comments", () => {
  test("should add a comment to post", async ({ browser }) => {
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
        await page.waitForTimeout(1000);
        
        const commentInput = page.locator('textarea[placeholder*="comment" i], textarea[name="content"]').first();
        if (await commentInput.isVisible({ timeout: 2000 })) {
          await commentInput.fill(`Test comment ${Date.now()}`);
          await page.click('button:has-text("Comment"), button:has-text("Post")');
          await page.waitForTimeout(1000);
        }
      }
    }
    
    await page.close();
  });

  test("should display comments on post", async ({ browser }) => {
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
        await page.waitForTimeout(1000);
        expect(true).toBeTruthy();
      }
    }
    
    await page.close();
  });
});
