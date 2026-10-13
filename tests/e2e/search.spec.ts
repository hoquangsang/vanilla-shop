import { expect, test, type Page } from "@playwright/test";

const input = (page: Page) => page.locator("[data-search-input]");
const text = (page: Page) => page.locator("[data-detail-text]");

async function search(page: Page, query: string) {
  await input(page).fill(query);
  await page.getByRole("button", { name: "Search" }).click();
}

test("design flow: Reasonable Price on Detail", async ({ page }) => {
  await page.goto("/index.html");
  await search(page, "Reasonable Price");
  await expect(text(page)).toHaveValue("Reasonable Price");
  await expect(page).toHaveURL(/detail\.html\?q=Reasonable\+Price/);
});

test("Enter key submits", async ({ page }) => {
  await page.goto("/index.html");
  await input(page).fill("serum");
  await input(page).press("Enter");
  await expect(text(page)).toHaveValue("serum");
});

test("search again from Detail", async ({ page }) => {
  await page.goto("/detail.html?q=serum");
  await expect(text(page)).toHaveValue("serum");
  await search(page, "toner");
  await expect(text(page)).toHaveValue("toner");
});

test("blank submit shows a hint and stays", async ({ page }) => {
  await page.goto("/index.html");
  await input(page).fill("   ");
  await input(page).press("Enter");
  await expect(page).toHaveURL(/index\.html$/);
  await expect(page.getByText("Please enter a keyword")).toBeVisible();
  await expect(input(page)).toHaveAttribute("aria-invalid", "true");
  await expect(input(page)).toBeFocused();
  await input(page).pressSequentially("a");
  await expect(page.getByText("Please enter a keyword")).toBeHidden();
  await expect(input(page)).not.toHaveAttribute("aria-invalid", /.*/);
});

test("HTML-like input stays text", async ({ page }) => {
  let dialog = false;
  page.on("dialog", () => (dialog = true));
  await page.goto("/index.html");
  await search(page, "<img src=x onerror=alert(1)>");
  await expect(text(page)).toHaveValue("<img src=x onerror=alert(1)>");
  expect(dialog).toBe(false);
  await expect(page.locator("main img")).toHaveCount(0);
});

test("Vietnamese and emoji", async ({ page }) => {
  await page.goto("/index.html");
  await search(page, "Giá hợp lý 😊");
  await expect(text(page)).toHaveValue("Giá hợp lý 😊");
});

test("reload keeps the text", async ({ page }) => {
  await page.goto("/detail.html?q=Reasonable+Price");
  await page.reload();
  await expect(text(page)).toHaveValue("Reasonable Price");
});

test("direct visit shows the placeholder", async ({ page }) => {
  await page.goto("/detail.html");
  await expect(text(page)).toHaveValue("");
  await expect(text(page)).toHaveAttribute(
    "placeholder",
    "Nothing searched yet. Use the search box above.",
  );
});

test("Detail layout: collapsed Categories, no overflow, textarea width", async ({ page }) => {
  await page.goto("/detail.html?q=x");
  await expect(page.locator("[data-categories-menu]")).toBeHidden();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
  const box = await text(page).boundingBox();
  const main = await page.locator("main .container-page").boundingBox();
  const ratio = box!.width / (main!.width - 32);
  const wide = (page.viewportSize()?.width ?? 0) >= 1024;
  if (wide) expect(ratio).toBeLessThan(0.6);
  else expect(ratio).toBeGreaterThan(0.9);
  expect(box!.height).toBeGreaterThanOrEqual(169);
});

test("cart badge still works on Detail", async ({ page }) => {
  await page.goto("/detail.html");
  await expect(page.locator("[data-cart-count]")).toHaveText(/\d+/);
});

test("without JavaScript the form still reaches Detail", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:4173/index.html");
  await search(page, "serum");
  await expect(page).toHaveURL(/detail\.html\?q=serum/);
  await context.close();
});
