import { requireEl } from "../core/dom";
import { CarouselView } from "../views/carousel-view";

/** Awards and news carousels; the rest of the brand content is static markup. */
export function initHomeBrandContent(): void {
  new CarouselView(requireEl('[data-carousel="awards"]'), {
    slidesPerView: 2,
    spaceBetween: 16,
    watchSlidesProgress: true,
    breakpoints: {
      640: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
      1280: { slidesPerView: 6 },
    },
  });

  new CarouselView(requireEl('[data-carousel="news"]'), {
    slidesPerView: 1.2,
    spaceBetween: 16,
    pagination: "bar",
    watchSlidesProgress: true,
    breakpoints: {
      640: { slidesPerView: 2.2 },
      1024: { slidesPerView: 3.2, spaceBetween: 24 },
    },
  });
}
