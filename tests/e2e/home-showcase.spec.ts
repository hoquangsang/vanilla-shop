import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
});

const vw = (page: import("@playwright/test").Page) => page.viewportSize()?.width ?? 0;

test("no horizontal overflow", async ({ page }) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("hero next button shows the second slide", async ({ page }) => {
  const hero = page.locator('[data-carousel="hero"]');
  await hero.getByRole("button", { name: "Next slide" }).click();
  await expect(hero.locator(".swiper-slide-active img")).toHaveAttribute("src", /hero-2\.webp$/);
});

test("hero layout follows the viewport", async ({ page }) => {
  const box = (await page.locator('[data-carousel="hero"]').boundingBox())!;
  const container = (await page.locator("section[aria-label='Featured offers']").boundingBox())!;
  if (vw(page) >= 1024) {
    expect(box.height).toBeGreaterThan(400);
    expect(box.height).toBeLessThan(460);
    expect((box.x - container.x) / container.width).toBeGreaterThan(0.2);
  } else {
    expect(box.width).toBeGreaterThan(container.width - 60);
  }
});

test("promo banners are side by side from 768px and stacked below", async ({ page }) => {
  const [a, b] = await page.locator("section[aria-label='Featured offers'] h2").all();
  const [ba, bb] = [(await a!.boundingBox())!, (await b!.boundingBox())!];
  if (vw(page) >= 768) expect(Math.abs(ba.y - bb.y)).toBeLessThan(5);
  else expect(bb.y).toBeGreaterThan(ba.y + 100);
});

test("Most Popular Products title and default tab", async ({ page }) => {
  await expect(
    page.getByRole("heading", { level: 2, name: "Most Popular Products" }),
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "Description" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const ids = await page
    .locator("#panel-description [data-add-to-cart]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-add-to-cart")));
  expect(ids).toEqual(["p1", "p2", "p3", "p4", "p5", "p6"]);
});

test("switching tab shows the other products", async ({ page }) => {
  await page.getByRole("tab", { name: "Specifications" }).click();
  await expect(page.locator("#panel-description")).toBeHidden();
  const panel = page.locator("#panel-specifications");
  await expect(panel).toBeVisible();
  const ids = await panel
    .locator("[data-add-to-cart]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-add-to-cart")));
  expect(ids).toEqual(["p3", "p4", "p5", "p6", "p7", "p8"]);
  const slide = (await panel.locator(".swiper-slide").first().boundingBox())!;
  expect(slide.width).toBeGreaterThan(100);
});

test("product card content", async ({ page }) => {
  const card = page.locator("#panel-description .swiper-slide", {
    hasText: "Restorative Hair Mask",
  });
  await expect(card.getByText("$18.00")).toBeVisible();
  await expect(card.locator("s")).toHaveText("$32.00");
  await expect(card.getByText("Sale", { exact: true })).toBeVisible();
  const button = card.getByRole("button", { name: "Add to cart" });
  await expect(button).toHaveAttribute("data-add-to-cart", "p2");
});

test("product carousel shows a peek of the next card", async ({ page }) => {
  const slides = page.locator("#panel-description .swiper-slide");
  const root = (await page.locator('[data-product-list="description"] .swiper').boundingBox())!;
  const first = (await slides.nth(0).boundingBox())!;
  const second = (await slides.nth(1).boundingBox())!;
  expect(first.x + first.width).toBeLessThanOrEqual(root.x + root.width + 1);
  if (vw(page) < 640) expect(second.x).toBeLessThan(root.x + root.width);
  else expect(second.x + second.width).toBeLessThanOrEqual(root.x + root.width + 1);
});

test("LumiSpa band: side by side from 768px, stacked below, badge visible", async ({ page }) => {
  const section = page.locator("section[aria-labelledby='lumispa-title']");
  const img = (await section.locator("img").boundingBox())!;
  const text = (await section.getByRole("heading").boundingBox())!;
  if (vw(page) >= 768) expect(text.x).toBeGreaterThan(img.x + img.width - 5);
  else expect(text.y).toBeGreaterThan(img.y + img.height);
  const badge = (await section.getByText("$29.99").boundingBox())!;
  expect(badge.x + badge.width).toBeLessThanOrEqual(vw(page));
  expect(badge.y).toBeGreaterThanOrEqual(0);
});
