import type Swiper from "swiper";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BAR_PAGINATION_CLASS, CarouselView } from "../../../src/views/carousel-view";

const MARKUP = `
  <div data-carousel>
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">One</div>
        <div class="swiper-slide">Two</div>
        <div class="swiper-slide">Three</div>
      </div>
    </div>
    <button data-carousel-prev aria-label="Previous slide"></button>
    <button data-carousel-next aria-label="Next slide"></button>
    <div data-carousel-pagination></div>
  </div>`;

function mockReducedMotion(reduce: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

function mount(options?: ConstructorParameters<typeof CarouselView>[1]) {
  document.body.innerHTML = MARKUP;
  const root = document.querySelector<HTMLElement>("[data-carousel]")!;
  const container = root.querySelector<HTMLElement & { swiper?: Swiper }>(".swiper")!;
  const view = new CarouselView(root, options);
  return { root, container, view, swiper: container.swiper! };
}

describe("CarouselView", () => {
  beforeEach(() => mockReducedMotion(false));
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("mounts Swiper on the documented markup", () => {
    const { container, swiper } = mount();
    expect(swiper).toBeDefined();
    expect(container.classList.contains("swiper-initialized")).toBe(true);
    expect(swiper.slides).toHaveLength(3);
  });

  it("destroy() tears Swiper down", () => {
    const { container, view, swiper } = mount();
    view.destroy();
    expect(swiper.destroyed).toBe(true);
    expect(container.classList.contains("swiper-initialized")).toBe(false);
  });

  it("update() delegates to Swiper", () => {
    const { view, swiper } = mount();
    const spy = vi.spyOn(swiper, "update");
    view.update();
    expect(spy).toHaveBeenCalledOnce();
  });

  it("turns autoplay on when autoplayMs is set", () => {
    const { swiper } = mount({ autoplayMs: 3000 });
    expect(swiper.params.autoplay).toMatchObject({ delay: 3000, pauseOnMouseEnter: true });
  });

  it("keeps autoplay off when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    const { swiper } = mount({ autoplayMs: 3000 });
    expect(swiper.params.autoplay).toMatchObject({ enabled: false });
    expect(swiper.autoplay.running).toBe(false);
  });

  it('adds the bar class to the pagination for pagination: "bar"', () => {
    const { root } = mount({ pagination: "bar" });
    const pagination = root.querySelector("[data-carousel-pagination]")!;
    expect(pagination.classList.contains(BAR_PAGINATION_CLASS)).toBe(true);
  });

  it("throws when the .swiper container is missing", () => {
    document.body.innerHTML = "<div data-carousel></div>";
    const root = document.querySelector<HTMLElement>("[data-carousel]")!;
    expect(() => new CarouselView(root)).toThrow(/missing \.swiper/);
  });
});
