import Swiper from "swiper";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface CarouselOptions {
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  autoplayMs?: number;
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>;
  /** "bar" = short dark bar for the active slide (product + news carousels). Default "bullets". */
  pagination?: "bullets" | "bar";
  /** Adds `.swiper-slide-visible`, used by e2e tests. */
  watchSlidesProgress?: boolean;
  rewind?: boolean;
}

/**
 * Thin wrapper around Swiper so pages never import it directly.
 *
 * Expected markup (prev/next/pagination are optional):
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
  private swiper: Swiper | null;

  constructor(root: HTMLElement, options: CarouselOptions = {}) {
    const container = root.querySelector<HTMLElement>(".swiper");
    if (!container) {
      throw new Error("CarouselView: missing .swiper element");
    }
    const prev = root.querySelector<HTMLElement>("[data-carousel-prev]");
    const next = root.querySelector<HTMLElement>("[data-carousel-next]");
    const pagination = root.querySelector<HTMLElement>("[data-carousel-pagination]");
    if (pagination && options.pagination === "bar") {
      pagination.classList.add("carousel-bar-pagination");
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoplay =
      options.autoplayMs !== undefined && !reducedMotion
        ? { delay: options.autoplayMs, pauseOnMouseEnter: true, disableOnInteraction: false }
        : false;

    this.swiper = new Swiper(container, {
      modules: [Navigation, Pagination, Autoplay, A11y, Keyboard],
      slidesPerView: options.slidesPerView ?? 1,
      spaceBetween: options.spaceBetween ?? 0,
      loop: options.loop ?? false,
      rewind: options.rewind ?? false,
      breakpoints: options.breakpoints,
      watchSlidesProgress: options.watchSlidesProgress ?? false,
      autoplay,
      navigation: prev && next ? { prevEl: prev, nextEl: next } : false,
      pagination: pagination ? { el: pagination, clickable: true } : false,
      keyboard: { enabled: true },
      a11y: { enabled: true },
    });
  }

  /** Call when the carousel becomes visible after being inside a hidden container. */
  update(): void {
    this.swiper?.update();
  }

  destroy(): void {
    this.swiper?.destroy(true, true);
    this.swiper = null;
  }
}
