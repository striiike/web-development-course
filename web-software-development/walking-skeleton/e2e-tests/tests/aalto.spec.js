import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.aalto.fi/en");
  await page.getByRole("button", { name: "Allow all" }).click();
});

test("Aalto site has title Aalto University.", async ({ page }) => {
  expect(await page.title()).toBe("Aalto University");
});

test("Clicking Apply to Aalto and verifying page title", async ({ page }) => {
  await page.getByRole("link", { name: "Apply to Aalto" }).click();
  expect(await page.title()).toBe("Study at Aalto | Aalto University");
});

test("1", async ({ page }) => {
  await page.getByRole("link", { name: "Donate" , exact: true }).click();
  expect(await page.title()).toBe("A! Sign of Change | Aalto University");
});

test("11", async ({ page }) => {
  await page.getByRole("link", { name: "Research and artistic" }).click();
  expect(await page.title()).toBe("Aalto University");
});

test("111", async ({ page }) => {
  await page.getByRole("link", { name: "See all Aa" }).click();
  expect(await page.title()).toBe("News | Aalto University");
});