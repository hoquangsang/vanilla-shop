import { expect, test, type Page } from "@playwright/test";

const KEY = "vanilla-shop:cart";
const count = (page: Page) => page.locator("[data-cart-count]");
const link = (page: Page) => page.locator("[data-cart-link]");
const card = (page: Page, tab = "description") =>
  page.locator(`[data-product-list="${tab}"] [data-add-to-cart]`);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.clear();
      sessionStorage.setItem("seeded", "1");
    }
  });
  await page.goto("/index.html");
});

test("design flow: first card adds one", async ({ page }) => {
  await expect(count(page)).toHaveText("0");
  await card(page).first().click();
  await expect(count(page)).toHaveText("1");
});

test("repeated clicks across products", async ({ page }) => {
  const buttons = card(page);
  for (let i = 0; i < 3; i++) await buttons.nth(0).click();
  for (let i = 0; i < 2; i++) await buttons.nth(1).click();
  await expect(count(page)).toHaveText("5");
});

test("buttons in the SPECIFICATIONS tab count", async ({ page }) => {
  await page.getByRole("tab", { name: /specifications/i }).click();
  await card(page, "specifications").first().click();
  await expect(count(page)).toHaveText("1");
});

test("count persists across reload and Detail page", async ({ page }) => {
  await card(page).first().click();
  await card(page).first().click();
  await page.reload();
  await expect(count(page)).toHaveText("2");
  await page.goto("/detail.html");
  await expect(count(page)).toHaveText("2");
});

test("count above 99 shows 99+ with the exact accessible name", async ({ page }) => {
  await page.evaluate(
    ([key]) => localStorage.setItem(key!, JSON.stringify({ version: 1, items: { p1: 120 } })),
    [KEY],
  );
  await page.reload();
  await expect(count(page)).toHaveText("99+");
  await expect(link(page)).toHaveAttribute("aria-label", "Cart, 120 items");
});

test("accessible name and live region update", async ({ page }) => {
  await card(page).first().click();
  await expect(link(page)).toHaveAttribute("aria-label", "Cart, 1 item");
  await expect(page.locator('[role="status"][aria-live="polite"]')).toHaveText(
    "Cart updated: 1 item",
  );
});

test("keyboard activation keeps focus on the button", async ({ page }) => {
  const button = card(page).first();
  await button.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await expect(count(page)).toHaveText("2");
  await expect(button).toBeFocused();
});

test("button feedback then restore; double click counts twice", async ({ page }) => {
  const button = card(page).first();
  await button.click();
  await expect(button).toHaveText("Added ✓");
  await expect(button).toHaveText("Add to cart", { timeout: 3000 });
  await button.dblclick({ delay: 20 });
  await expect(count(page)).toHaveText("3");
});
