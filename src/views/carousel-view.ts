import Swiper from "swiper";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface CarouselOptions {
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  /** Autoplay delay in ms. Autoplay is off when unset or when the user prefers reduced motion. */
  autoplayMs?: number;
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>;
  /** "bullets" (default) or "bar": a short dark bar for the active slide (product + news carousels). */
  pagination?: "bullets" | "bar";
  /** Adds `.swiper-slide-visible` to the visible slides (used by e2e tests). */
  watchSlidesProgress?: boolean;
  rewind?: boolean;
}

export const BAR_PAGINATION_CLASS = "carousel-bar-pagination";

/**
 * Thin Swiper wrapper, so pages never import Swiper directly.
 *
 * Expected markup (prev, next and pagination are optional):
 * ```html
 * <div data-carousel>
 *   <div class="swiper"><div class="swiper-wrapper"><div class="swiper-slide">…</div></div></div>
 *   <button data-carousel-prev aria-label="Previous slide">…</button>
 *   <button data-carousel-next aria-label="Next slide">…</button>
 *   <div data-carousel-pagination></div>
 * </div>
 * ```
 */
export class CarouselView {
  private readonly swiper: Swiper;

  constructor(root: HTMLElement, options: CarouselOptions = {}) {
    const container = root.querySelector<HTMLElement>(".swiper");
    if (!container)
      throw new Error("CarouselView: missing .swiper container inside [data-carousel]");

    const prevEl = root.querySelector<HTMLElement>("[data-carousel-prev]");
    const nextEl = root.querySelector<HTMLElement>("[data-carousel-next]");
    const paginationEl = root.querySelector<HTMLElement>("[data-carousel-pagination]");
    if (paginationEl && options.pagination === "bar")
      paginationEl.classList.add(BAR_PAGINATION_CLASS);

    const config: SwiperOptions = {
      modules: [Navigation, Pagination, Autoplay, A11y, Keyboard],
      slidesPerView: options.slidesPerView ?? 1,
      spaceBetween: options.spaceBetween ?? 0,
      loop: options.loop ?? false,
      rewind: options.rewind ?? false,
      watchSlidesProgress: options.watchSlidesProgress ?? false,
      a11y: { enabled: true },
      keyboard: { enabled: true, onlyInViewport: true },
      autoplay:
        options.autoplayMs !== undefined && !prefersReducedMotion()
          ? { delay: options.autoplayMs, pauseOnMouseEnter: true, disableOnInteraction: false }
          : false,
    };
    if (options.breakpoints) config.breakpoints = options.breakpoints;
    if (prevEl || nextEl) config.navigation = { prevEl, nextEl };
    if (paginationEl) config.pagination = { el: paginationEl, clickable: true };

    this.swiper = new Swiper(container, config);
  }

  /** Recompute sizes, e.g. after the carousel leaves a `hidden` tab panel. */
  update(): void {
    this.swiper.update();
  }

  destroy(): void {
    this.swiper.destroy(true, true);
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
