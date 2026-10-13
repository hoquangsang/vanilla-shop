import { formatPrice } from "../core/format";
import { requireEl } from "../core/dom";
import type { Product } from "../types/product";
import { CarouselView } from "./carousel-view";
import { AWARD_SEAL_SVG } from "./svg/award-seal";

const CAROUSEL = {
  slidesPerView: 1.3,
  spaceBetween: 16,
  pagination: "bar",
  breakpoints: {
    640: { slidesPerView: 2.2, spaceBetween: 16 },
    1024: { slidesPerView: 3.3, spaceBetween: 24 },
  },
} as const;

let cardCount = 0;

/** Renders product cards (from `#product-card-template`) into a product carousel. */
export class ProductListView {
  private carousel: CarouselView | undefined;

  constructor(private readonly root: HTMLElement) {}

  render(products: readonly Product[]): void {
    this.carousel?.destroy();
    const template = requireEl<HTMLTemplateElement>("#product-card-template");
    const wrapper = requireEl(".swiper-wrapper", this.root);
    wrapper.replaceChildren(...products.map((product) => this.card(template, product)));
    this.carousel = new CarouselView(this.root, CAROUSEL);
  }

  /** Recompute carousel sizes, e.g. after its tab panel becomes visible. */
  update(): void {
    this.carousel?.update();
  }

  private card(template: HTMLTemplateElement, product: Product): Node {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const field = <T extends HTMLElement>(name: string) =>
      requireEl<T>(`[data-field="${name}"]`, fragment);

    const image = field<HTMLImageElement>("image");
    image.src = product.image;
    image.alt = product.name;
    field("brand").textContent = product.brand;
    field("name").textContent = product.name;
    field("price").textContent = formatPrice(product.price);
    field("old-price").textContent = formatPrice(product.oldPrice);
    const cart = field("cart");
    cart.dataset.addToCart = product.id;
    // Distinct accessible name per card: "Add to cart <product name>" (the button text can change).
    const uid = ++cardCount;
    cart.id = `cart-btn-${uid}`;
    field("name").id = `product-name-${uid}`;
    cart.setAttribute("aria-labelledby", `cart-btn-${uid} product-name-${uid}`);
    if (!product.onSale) field("sale").remove();
    // Static, trusted markup (no product data), so innerHTML is safe here.
    if (product.hasAward) field("award").innerHTML = AWARD_SEAL_SVG;
    else field("award").remove();
    return fragment;
  }
}
