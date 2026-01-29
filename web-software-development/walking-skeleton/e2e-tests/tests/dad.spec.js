import { expect, test } from "@playwright/test";

test("Sending a message on chat adds the message to the list of messages.", async ({ page }) => {
  await page.goto("https://dad-etc-websocket-example.deno.dev/");
  await page.waitForTimeout(1000);

  const randomMessage = `Hello ${Math.floor(10000 + Math.random() * 90000)}`;
  await page.locator("input[type=text]").fill(randomMessage);
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByRole("listitem").filter({ hasText: randomMessage }))
    .toBeVisible();
});