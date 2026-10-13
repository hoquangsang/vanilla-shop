import { expect, test } from "@playwright/test";

const pages = [
  { path: "/index.html", title: "Home | Vanilla Shop" },
  { path: "/detail.html", title: "Detail | Vanilla Shop" },
];

for (const { path, title } of pages) {
  test(`${path} loads with shared header and footer`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("header")).toContainText("Header");
    await expect(page.locator("footer")).toContainText("Footer");
    expect(errors).toEqual([]);
  });
}
