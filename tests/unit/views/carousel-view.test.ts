import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CarouselView } from "../../../src/views/carousel-view";

function mockMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
}

function mount(): HTMLElement {
  document.body.innerHTML = `
    <div data-carousel>
      <div class="swiper"><div class="swiper-wrapper">
        <div class="swiper-slide">1</div><div class="swiper-slide">2</div>
      </div></div>
      <button data-carousel-prev aria-label="Previous slide"></button>
      <button data-carousel-next aria-label="Next slide"></button>
      <div data-carousel-pagination></div>
    </div>`;
  return document.querySelector<HTMLElement>("[data-carousel]")!;
}

describe("CarouselView", () => {
  beforeEach(() => mockMatchMedia(false));
  afterEach(() => vi.unstubAllGlobals());

  it("mounts on the documented markup, updates and destroys", () => {
    const root = mount();
    const view = new CarouselView(root, { pagination: "bar" });
    expect(root.querySelector(".swiper")?.classList.contains("swiper-initialized")).toBe(true);
    expect(root.querySelector("[data-carousel-pagination]")?.classList).toContain(
      "carousel-bar-pagination",
    );
    expect(() => view.update()).not.toThrow();
    view.destroy();
    expect(root.querySelector(".swiper")?.classList.contains("swiper-initialized")).toBe(false);
    expect(() => view.destroy()).not.toThrow();
  });

  it("throws without a .swiper element", () => {
    document.body.innerHTML = "<div data-carousel></div>";
    expect(
      () => new CarouselView(document.querySelector<HTMLElement>("[data-carousel]")!),
    ).toThrow();
  });

  it("starts autoplay only when asked and motion is allowed", () => {
    const view = new CarouselView(mount(), { autoplayMs: 1000 });
    const swiper = (view as unknown as { swiper: { params: { autoplay: unknown } } }).swiper;
    expect(swiper.params.autoplay).toMatchObject({ enabled: true, delay: 1000 });
    view.destroy();

    mockMatchMedia(true);
    const reduced = new CarouselView(mount(), { autoplayMs: 1000 });
    const rs = (reduced as unknown as { swiper: { params: { autoplay: unknown } } }).swiper;
    expect(rs.params.autoplay).toMatchObject({ enabled: false });
    reduced.destroy();
  });
});
