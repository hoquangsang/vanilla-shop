# Design

## Context

After T1: regions `awards`, `nu-skin-way`, `news` exist as empty comments in `index.html`; `CarouselView`, `.section-title`, tokens are available. Images: `public/images/banners/award-devices.webp`, `sections/force-for-good.webp`, `sections/nature-science.webp`, `news/news-1..5.webp`, `news/news-side.webp`. T5 edits other regions of the same file in parallel.

## Goals / Non-Goals

**Goals:** static, semantic markup in `index.html`; two carousels; faithful layout.
**Non-Goals:** data-driven rendering (this content is static copy; MVC is shown by T3/T5/T7/T8), real article links.

## Decisions

### Static markup, no model
These sections are editorial content with no state, so they are written directly in `index.html`. The only JS is mounting two `CarouselView`s in `src/pages/home-brand-content.ts` (`initHomeBrandContent()`, called from `home.ts`; see ROADMAP > Page wiring):
- Awards: `{ slidesPerView: 2, spaceBetween: 16, breakpoints: { 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 6 } } }`, dot pagination (clickable bullets).
- News: `{ slidesPerView: 1.2, spaceBetween: 16, breakpoints: { 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2, spaceBetween: 24 } } }`, prev/next + `pagination: "bar"`.

### Award seals
Six inline SVGs (viewBox `0 0 120 120`), visually distinct (colours from the design: pink, magenta, multicolour, green, black, lavender), each a circle + ring + 2–3 short text lines (e.g. `2024`, `AWARD`, `WINNER`). Put them in `public/images/awards/award-1..6.svg` and use `<img src alt width="96" height="96">` so the markup stays clean and the images are cacheable.

### Layout
- Award banner: `relative overflow-hidden bg-neutral-200` with `grid md:grid-cols-2 items-center`; image `object-cover h-40 md:h-48`; text `text-center md:text-right p-6`.
- Stats strip: `.container-page` → `border rounded-sm p-6 md:p-10 grid gap-6 md:grid-cols-[1.2fr_2fr] items-center`; stats `grid grid-cols-3 gap-4`. Big numbers `text-2xl md:text-3xl`.
- Image/text blocks: `grid md:grid-cols-2` each; second block uses `md:[&>figure]:order-2` (or explicit `md:order-*`) so DOM order is photo-then-text for both (better on mobile and for screen readers). Text panel `bg-surface-muted p-8 md:p-12`.
- News row: `grid gap-6 lg:grid-cols-[7fr_3fr]`; side card `relative h-56 lg:h-full min-h-[420px]` with `object-cover` image + overlay text bottom-centre.
- All images below the fold: `loading="lazy"`, explicit `width`/`height`.

### Copy
Use the paragraphs readable in `docs/design/zoom/home-part-4.png`; paraphrase where blurry:
- Force for Good: "Some call it corporate social responsibility. We call it our purpose. Together we're engaged in initiatives worldwide—nourishing thousands of hungry children, funding pediatric health and wellness services, or striving for a more sustainable future. And sometimes, we're simply taking meaningful steps to improve our local communities. Whatever we do, we believe changing the world begins with a single action."
- Nature + Science: "Capturing the best in nature to bring you the best results is our personal mission. We combine powerful ingredients with innovative science and technology. The result? World-class products that deliver real benefits. And even though we've spent more than 30 years researching aging at the genetic level, Mother Nature continually inspires us to push the boundaries of inquiry and innovation. We bottle what's best and bring it right to your door."

### Tests
E2E `tests/e2e/home-brand-content.spec.ts`: count visible award slides at 1440 vs 375 (use `.swiper-slide-visible` with `watchSlidesProgress: true`, or bounding boxes inside the carousel viewport), block order via bounding boxes, news side-card position, and no horizontal overflow.

## Risks / Trade-offs

- [`index.html` merge conflicts with T5] → edit only the three owned region blocks.
- [Swiper `.swiper-slide-visible` needs `watchSlidesProgress`] → pass `watchSlidesProgress: true` (supported by T1's `CarouselView`).
