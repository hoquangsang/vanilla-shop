import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
});

const vw = (page: Page) => page.viewportSize()?.width ?? 0;

const box = async (page: Page, selector: string) =>
  (await page.locator(selector).first().boundingBox())!;

test("no horizontal overflow", async ({ page }) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("titles are present", async ({ page }) => {
  for (const name of ["Award And Recognition", "The Nu Skin Way", "Nu Skin In The News"])
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
});

test("award banner text sits right of the photo from 768px, below it under 768px", async ({
  page,
}) => {
  const img = await box(page, "#awards-title ~ div img[src$='award-devices.webp']");
  const text = (await page.getByText("Euromonitor").boundingBox())!;
  if (vw(page) >= 768) expect(text.x).toBeGreaterThan(img.x + img.width / 2);
  else expect(text.y).toBeGreaterThan(img.y + img.height - 1);
});

test("awards carousel shows 6 / 4 / 3 / 2 items by width", async ({ page }) => {
  const width = vw(page);
  const expected = width >= 1280 ? 6 : width >= 1024 ? 4 : width >= 640 ? 3 : 2;
  const visible = page.locator('[data-carousel="awards"] .swiper-slide-visible');
  await expect(visible).toHaveCount(expected);
  await expect(page.locator('[data-carousel="awards"] .swiper-slide img').first()).toHaveAttribute(
    "src",
    /award-1\.svg$/,
  );
});

test("awards seals are repo-drawn SVGs", async ({ page }) => {
  const srcs = await page
    .locator('[data-carousel="awards"] img')
    .evaluateAll((els) => els.map((e) => e.getAttribute("src")));
  expect(srcs).toHaveLength(6);
  for (const src of srcs) expect(src).toMatch(/images\/awards\/award-\d\.svg$/);
});

test("stats strip: one row from 768px, stacked below; all stats visible", async ({ page }) => {
  const heading = (await page.getByText("Improving Lives Everyday").boundingBox())!;
  const first = (await page.getByText("25+").boundingBox())!;
  if (vw(page) >= 768) expect(Math.abs(heading.y - first.y)).toBeLessThan(80);
  else expect(first.y).toBeGreaterThan(heading.y + heading.height - 1);
  for (const stat of ["25+", "20+", "850M+"]) await expect(page.getByText(stat)).toBeVisible();
  await expect(page.getByRole("link", { name: "Current Social Projects" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Nourish the Children/ })).toBeVisible();
});

test("image/text blocks alternate on desktop and stack photo-first on mobile", async ({ page }) => {
  const blocks = page.locator("#nu-skin-way-title ~ div article");
  for (const [i, name] of [
    [0, "force-for-good"],
    [1, "nature-science"],
  ] as const) {
    const img = (await blocks.nth(i).locator("img").boundingBox())!;
    const text = (await blocks.nth(i).locator("h3").boundingBox())!;
    expect(await blocks.nth(i).locator("img").getAttribute("src")).toContain(name);
    if (vw(page) >= 768) {
      if (i === 0) expect(img.x).toBeLessThan(text.x);
      else expect(img.x).toBeGreaterThan(text.x);
    } else {
      expect(text.y).toBeGreaterThan(img.y + img.height - 1);
    }
  }
});

test("news carousel has 5 cards and the side card position follows the viewport", async ({
  page,
}) => {
  await expect(page.locator('[data-carousel="news"] .swiper-slide')).toHaveCount(5);
  const carousel = await box(page, '[data-carousel="news"]');
  const side = await box(page, "a:has(img[src$='news-side.webp'])");
  if (vw(page) >= 1024) {
    expect(side.x).toBeGreaterThan(carousel.x + carousel.width - 1);
    expect(
      await page.locator('[data-carousel="news"] .swiper-slide-visible').count(),
    ).toBeGreaterThanOrEqual(3);
    expect(side.width / (side.x + side.width - carousel.x)).toBeGreaterThan(0.25);
  } else {
    expect(side.y).toBeGreaterThan(carousel.y + carousel.height - 1);
    expect(side.width).toBeGreaterThan(vw(page) - 60);
    expect(side.height).toBeLessThan(300);
  }
});

test("news next button moves the carousel", async ({ page }) => {
  const news = page.locator('[data-carousel="news"]');
  await news.scrollIntoViewIfNeeded();
  await news.getByRole("button", { name: "Next slide" }).click();
  await expect(news.locator(".swiper-slide-active")).toContainText("38 New Beauty Products");
  await expect(news.locator(".swiper-slide").nth(1)).toHaveClass(/swiper-slide-active/);
});
