import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = ["/index.html", "/detail.html"];
const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440, 1920];

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "viewports are set explicitly");
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function load(page: Page, path: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
}

test.describe("no horizontal overflow", () => {
  for (const path of PAGES) {
    for (const width of WIDTHS) {
      test(`${path} at ${width}px`, async ({ page }) => {
        await load(page, path, width);
        const result = await page.evaluate(() => {
          const vw = window.innerWidth;
          const offenders = [...document.querySelectorAll("body *")]
            .filter((el) => el.getBoundingClientRect().right > vw + 1)
            .slice(0, 5)
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
          return { scrollWidth: document.documentElement.scrollWidth, vw, offenders };
        });
        expect(
          result.scrollWidth,
          `offenders: ${result.offenders.join(" | ")}`,
        ).toBeLessThanOrEqual(result.vw);
      });
    }
  }
});

test.describe("axe-core", () => {
  for (const path of PAGES) {
    for (const width of [375, 1440]) {
      test(`${path} at ${width}px has no serious violations`, async ({ page }) => {
        await load(page, path, width);
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        const report = serious
          .map(
            (v) => `${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
          )
          .join("\n");
        expect(report).toBe("");
      });
    }
  }
});

test("mobile text and target sizes (Home, 375px)", async ({ page }) => {
  await load(page, "/index.html", 375);
  const { small, tiny } = await page.evaluate(() => {
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const name = (el: Element) =>
      `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)}`;
    const small: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!el || !n.textContent?.trim() || !visible(el)) continue;
      if (el.closest("script,style,noscript,[hidden],[aria-hidden='true']")) continue;
      if (parseFloat(getComputedStyle(el).fontSize) < 12) small.push(name(el));
    }
    const tiny: string[] = [];
    for (const el of document.querySelectorAll("a, button, input, textarea, [role=tab]")) {
      if (!visible(el) || el.closest("[aria-hidden='true']")) continue;
      if (el.matches(".sr-only, .swiper-slide-duplicate *")) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 24)
        tiny.push(`${name(el)} ${r.width.toFixed(0)}x${r.height.toFixed(0)}`);
    }
    return { small: [...new Set(small)], tiny };
  });
  expect(small, "text under 12px").toEqual([]);
  expect(tiny, "targets under 24x24").toEqual([]);
});
