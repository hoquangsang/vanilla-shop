import { expect, test } from "@playwright/test";

const pages = [
  { path: "/index.html", title: "Home | Vanilla Shop", dataPage: "home" },
  { path: "/detail.html", title: "Detail | Vanilla Shop", dataPage: "detail" },
];

for (const { path, title, dataPage } of pages) {
  test(`${dataPage} page loads with header and footer`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    // Partials are inlined at build time, so they are in the served HTML before any JS runs.
    const html = (await response?.text()) ?? "";
    expect(html).toMatch(/<header[\s>]/);
    expect(html).toMatch(/<footer[\s>]/);
    expect(html).not.toContain("@include");

    await expect(page).toHaveTitle(title);
    await expect(page.locator("body")).toHaveAttribute("data-page", dataPage);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("main#main")).toBeAttached();

    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}
