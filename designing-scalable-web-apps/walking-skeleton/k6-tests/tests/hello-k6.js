import { browser } from "k6/browser";

export const options = {
  scenarios: {
    client: {
      vus: 5,
      duration: "30s",
      executor: "constant-vus",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export default async () => {
  const page = await browser.newPage();
  await page.goto("http://client:4321/");

  try {
    for (let i = 1; i < 5; i++) {
      await page.locator('button#btn').click();
      await page.locator(`ul#list li:nth-child(${i})`);
    }
  } finally {
    await page.close();
  }
};