import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Product } from "../../../src/types/product";

vi.mock("../../../src/views/carousel-view", () => ({
  CarouselView: class {
    update = vi.fn();
    destroy = vi.fn();
  },
}));

import { ProductListView } from "../../../src/views/product-list-view";

const product = (over: Partial<Product> = {}): Product => ({
  id: "p2",
  brand: "Nutricentials",
  name: "Restorative Hair Mask",
  price: 18,
  oldPrice: 32,
  image: "images/products/product-2.webp",
  onSale: true,
  hasAward: true,
  tabs: ["description"],
  ...over,
});

describe("ProductListView", () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <template id="product-card-template">
        <div class="swiper-slide"><article>
          <img data-field="image" alt="" />
          <span data-field="sale">Sale</span><span data-field="award"></span>
          <p data-field="brand"></p><h3 data-field="name"></h3>
          <span data-field="price"></span><s data-field="old-price"></s>
          <button data-field="cart">Add to cart</button>
        </article></div>
      </template>
      <div id="root"><div class="swiper"><div class="swiper-wrapper"></div></div></div>`;
    root = document.getElementById("root")!;
  });

  it("renders one card per product with formatted prices and the cart hook", () => {
    new ProductListView(root).render([product(), product({ id: "p3" })]);
    const cards = root.querySelectorAll(".swiper-slide");
    expect(cards).toHaveLength(2);
    const first = cards[0]!;
    expect(first.querySelector("h3")?.textContent).toBe("Restorative Hair Mask");
    expect(first.querySelector('[data-field="price"]')?.textContent).toBe("$18.00");
    expect(first.querySelector("s")?.textContent).toBe("$32.00");
    expect(first.querySelector("img")?.alt).toBe("Restorative Hair Mask");
    expect(first.querySelector("button")?.getAttribute("data-add-to-cart")).toBe("p2");
    expect(first.querySelector('[data-field="sale"]')).not.toBeNull();
    expect(first.querySelector('[data-field="award"] svg')).not.toBeNull();
  });

  it("omits the SALE ribbon and award seal when the product has neither", () => {
    new ProductListView(root).render([product({ onSale: false, hasAward: false })]);
    expect(root.querySelector('[data-field="sale"]')).toBeNull();
    expect(root.querySelector('[data-field="award"]')).toBeNull();
  });

  it("shows product text literally instead of parsing it as HTML", () => {
    new ProductListView(root).render([product({ name: "<b>Bold</b>" })]);
    const name = root.querySelector("h3")!;
    expect(name.textContent).toBe("<b>Bold</b>");
    expect(name.querySelector("b")).toBeNull();
  });
});
