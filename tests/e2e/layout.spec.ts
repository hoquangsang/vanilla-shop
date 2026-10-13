import { expect, test, type Page } from "@playwright/test";

const PURPLE = "rgb(85, 23, 96)";
const ACTIVE = "rgb(209, 156, 151)";

function width(page: Page): number {
  return page.viewportSize()?.width ?? 0;
}

test.describe("shared shell", () => {
  test("Home and Detail share identical header and footer markup", async ({ page }) => {
    const shell = async (path: string) => {
      await page.goto(path);
      return page.evaluate(() => {
        const strip = (el: Element) => {
          const clone = el.cloneNode(true) as Element;
          clone
            .querySelectorAll("[aria-current]")
            .forEach((n) => n.removeAttribute("aria-current"));
          clone.querySelectorAll("[hidden]").forEach((n) => n.removeAttribute("hidden"));
          clone
            .querySelectorAll("[aria-expanded]")
            .forEach((n) => n.removeAttribute("aria-expanded"));
          return clone.outerHTML;
        };
        return [strip(document.querySelector("header")!), strip(document.querySelector("footer")!)];
      });
    };
    expect(await shell("/index.html")).toEqual(await shell("/detail.html"));
  });

  test("top bar", async ({ page }) => {
    await page.goto("/index.html");
    const bar = page.locator("header > div").first();
    await expect(bar).toHaveCSS("background-color", PURPLE);
    const social = page.getByRole("list", { name: "Social media" }).getByRole("link");
    await expect(social).toHaveCount(5);
    for (const name of ["Facebook", "Twitter", "LinkedIn", "Instagram", "YouTube"])
      await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
    const help = page.getByRole("navigation", { name: "Help" });
    if (width(page) >= 768) {
      await expect(help.getByRole("link")).toHaveText(["FAQs", "Help", "Support"]);
    } else {
      await expect(help).toBeHidden();
    }
  });

  test("search form submits natively without JavaScript", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto("/index.html");
    const input = page.getByRole("searchbox", { name: "Search products" });
    await expect(input).toHaveAttribute("placeholder", "Search for products");
    await expect(input).toHaveAttribute("maxlength", "200");
    await input.fill("serum");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/detail\.html\?q=serum$/);
    await context.close();
  });

  test("wishlist and cart start at 0 with accessible names", async ({ page }) => {
    await page.goto("/index.html");
    await expect(page.locator("[data-wishlist-count]")).toHaveText("0");
    await expect(page.locator("[data-cart-count]")).toHaveText("0");
    await expect(page.getByRole("link", { name: "Wishlist, 0 items" })).toBeVisible();
    await expect(page.locator("[data-cart-link]")).toHaveAccessibleName("Cart, 0 items");
  });

  test("current page link", async ({ page }) => {
    await page.goto("/index.html");
    if (width(page) < 1024) await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.locator("header [aria-current]")).toHaveCount(1);
    const home = page.locator("[data-nav=home]");
    await expect(home).toHaveAttribute("aria-current", "page");
    await expect(home).toHaveCSS("color", ACTIVE);

    await page.goto("/detail.html");
    await expect(page.locator("[aria-current]")).toHaveCount(1);
    await expect(page.locator("[data-nav=detail]")).toHaveAttribute("aria-current", "page");
  });
});

test.describe("main navigation", () => {
  test("hamburger opens and Escape closes it", async ({ page }) => {
    test.skip(width(page) >= 1024, "hamburger is below lg only");
    await page.goto("/index.html");
    const button = page.getByRole("button", { name: "Menu" });
    const menu = page.locator("[data-nav-menu]");
    await expect(menu).toBeHidden();
    await button.click();
    await expect(menu).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("desktop shows the nav inline", async ({ page }) => {
    test.skip(width(page) < 1024, "desktop only");
    await page.goto("/index.html");
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const name of ["Home", "Shop", "Shop Detail", "Contact", "Login", "Register"])
      await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Pages" })).toBeVisible();
  });

  test("Pages sub-menu opens on click and closes on Escape", async ({ page }) => {
    await page.goto("/index.html");
    if (width(page) < 1024) await page.getByRole("button", { name: "Menu" }).click();
    const toggle = page.getByRole("button", { name: "Pages" });
    await toggle.click();
    await expect(page.getByRole("link", { name: "Shopping Cart" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Checkout" }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("categories menu", () => {
  const items = [
    "Dresses",
    "Shirts",
    "Jeans",
    "Swimwear",
    "Sleepwear",
    "Sportswear",
    "Jumpsuits",
    "Blazers",
    "Jackets",
    "Shoes",
  ];

  test("Home on desktop is open on load with 10 categories", async ({ page }) => {
    test.skip(width(page) < 1024, "desktop only");
    await page.goto("/index.html");
    const button = page.getByRole("button", { name: "Categories" });
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("[data-categories-menu]");
    await expect(menu).toBeVisible();
    await expect(menu.locator(":scope > li")).toHaveCount(10);
    for (const name of items.slice(1))
      await expect(menu.getByRole("link", { name, exact: true })).toBeVisible();
    // Pinned: Escape and outside clicks do not close it.
    await page.keyboard.press("Escape");
    await page.mouse.click(5, 600);
    await expect(menu).toBeVisible();
    await expect(button).toHaveCSS("background-color", PURPLE);
  });

  test("Dresses sub-menu has 3 items", async ({ page }) => {
    await page.goto("/detail.html");
    await page.getByRole("button", { name: "Categories" }).click();
    await page.getByRole("button", { name: "Dresses" }).click();
    for (const name of ["Men's Dresses", "Women's Dresses", "Baby's Dresses"])
      await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  });

  test("Detail on desktop starts closed and opens on click", async ({ page }) => {
    test.skip(width(page) < 1024, "desktop only");
    await page.goto("/detail.html");
    const menu = page.locator("[data-categories-menu]");
    await expect(menu).toBeHidden();
    await page.getByRole("button", { name: "Categories" }).click();
    await expect(menu).toBeVisible();
  });

  test("mobile dropdown closes on outside click", async ({ page }) => {
    test.skip(width(page) >= 1024, "below lg only");
    await page.goto("/index.html");
    const button = page.getByRole("button", { name: "Categories" });
    const menu = page.locator("[data-categories-menu]");
    await expect(menu).toBeHidden();
    await button.click();
    await expect(menu).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.mouse.click(width(page) - 5, 500);
    await expect(menu).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("footer", () => {
  test("content and payment icons", async ({ page }) => {
    await page.goto("/index.html");
    const footer = page.locator("footer");
    await expect(footer).toHaveCSS("background-color", PURPLE);
    await expect(footer.getByText("123 Street, New York, USA")).toBeVisible();
    await expect(footer.getByRole("link", { name: "info@example.com" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "+012 345 67890" })).toBeVisible();
    await expect(footer.getByRole("heading", { name: "Quick Links" })).toHaveCount(2);
    await expect(footer.getByRole("link", { name: "Contact Us" })).toHaveCount(2);
    await expect(footer.getByText("Distributed By ThemeWagon")).toBeVisible();
    await expect(footer.getByRole("img")).toHaveCount(6);
  });

  test("columns are side by side from md and stacked below", async ({ page }) => {
    await page.goto("/index.html");
    const headings = page.locator("footer h2");
    const [a, b] = await Promise.all([
      headings.nth(0).boundingBox(),
      headings.nth(1).boundingBox(),
    ]);
    if (width(page) >= 768) expect(Math.abs(a!.y - b!.y)).toBeLessThan(2);
    else expect(b!.y).toBeGreaterThan(a!.y + 50);
  });

  test("no horizontal overflow", async ({ page }) => {
    for (const path of ["/index.html", "/detail.html"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    }
  });
});
