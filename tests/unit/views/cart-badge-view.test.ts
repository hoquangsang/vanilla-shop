import { beforeEach, describe, expect, it } from "vitest";
import { CartBadgeView } from "../../../src/views/cart-badge-view";

beforeEach(() => {
  document.body.innerHTML = `
    <a data-cart-link aria-label="Cart, 0 items"><span data-cart-count>0</span></a>`;
});

const count = () => document.querySelector("[data-cart-count]")?.textContent;
const label = () => document.querySelector("[data-cart-link]")?.getAttribute("aria-label");

describe("CartBadgeView", () => {
  it("renders the count and an accessible name", () => {
    const view = new CartBadgeView();
    view.render(0);
    expect([count(), label()]).toEqual(["0", "Cart, 0 items"]);
    view.render(1);
    expect([count(), label()]).toEqual(["1", "Cart, 1 item"]);
    view.render(3);
    expect(label()).toBe("Cart, 3 items");
  });

  it("caps the display at 99+ but keeps the exact accessible name", () => {
    const view = new CartBadgeView();
    view.render(99);
    expect(count()).toBe("99");
    view.render(120);
    expect([count(), label()]).toEqual(["99+", "Cart, 120 items"]);
  });

  it("announces through one polite live region", () => {
    const view = new CartBadgeView();
    view.announce(1);
    view.announce(2);
    const regions = document.querySelectorAll('[aria-live="polite"]');
    expect(regions).toHaveLength(1);
    expect(regions[0]?.textContent).toBe("Cart updated: 2 items");
  });

  it("uses the singular in announcements", () => {
    new CartBadgeView().announce(1);
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe(
      "Cart updated: 1 item",
    );
  });
});
