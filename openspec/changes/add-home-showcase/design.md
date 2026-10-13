# Design

## Context

After T1: page shell with `<!-- region:hero -->`, `<!-- region:popular-products -->`, `<!-- region:lumispa -->` in `index.html`; tokens, `.container-page`, `.section-title`, `.btn-primary`, `.btn-outline`; `CarouselView` (Swiper). T3 (EventEmitter) may not be merged yet, so the product model must not depend on it. T4 may not be merged yet, so do not touch partials.

## Goals / Non-Goals

**Goals:** faithful layout at 1440, clean 375/768/1024; product cards rendered from data with MVC; no layout shift (image sizes set).
**Non-Goals:** product detail pages, real "View All", filtering, the click behaviour of "Add to cart" (T7).

## Decisions

### Product data (`src/data/products.json`)
Imported statically (`import products from "../data/products.json"`), so the build also works from `file://`. Image paths are **relative without a leading slash** (`images/products/product-1.webp`) because `base: "./"`.

| id | brand | name | price | oldPrice | image | onSale | hasAward | tabs |
|---|---|---|---|---|---|---|---|---|
| p1 | ageLOC | Gentle Body Lotion | 14.00 | 35.00 | product-1.webp | false | true | description |
| p2 | Nutricentials | Restorative Hair Mask | 18.00 | 32.00 | product-2.webp | true | true | description |
| p3 | ageLOC | Hydrating Day Cream | 24.00 | 40.00 | product-3.webp | true | true | description, specifications |
| p4 | Nu Skin | Cooling Gel Mask | 16.50 | 28.00 | product-4.webp | true | false | description, specifications |
| p5 | Epoch | Hemp Seed Facial Oil | 21.00 | 36.00 | product-5.webp | false | true | description, specifications |
| p6 | ageLOC | Radiance Serum | 29.99 | 49.00 | product-6.webp | true | false | description, specifications |
| p7 | Nu Skin | Clarifying Toner | 12.00 | 22.00 | product-7.webp | false | false | specifications |
| p8 | Nutricentials | Daily Gentle Cleanser | 14.00 | 35.00 | product-8.webp | true | true | specifications |

### MVC for products
```ts
// src/types/product.ts
export type ProductTab = "description" | "specifications";
export interface Product { id: string; brand: string; name: string; price: number; oldPrice: number;
  image: string; onSale: boolean; hasAward: boolean; tabs: ProductTab[]; }

// src/models/product-model.ts  (no EventEmitter needed: data is static)
export class ProductModel { constructor(source?: () => Promise<Product[]>); getAll(): Promise<Product[]>; getByTab(tab: string): Promise<Product[]>; }

// src/views/product-list-view.ts
export class ProductListView { constructor(root: HTMLElement /* [data-product-list] */); render(products: readonly Product[]): void; }

// src/controllers/product-list-controller.ts
export class ProductListController { constructor(model: ProductModel, views: Record<ProductTab, ProductListView>); init(): Promise<void>; }
```
- The view builds each card from a `<template id="product-card-template">` placed in `index.html` (markup stays in HTML; data is set with `textContent`, `src`, `alt`, `dataset`). It then mounts `CarouselView` on its own root after rendering.
- `formatPrice(n)` in `src/core/format.ts` with `Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })`.
- The award seal is an inline SVG string from `src/views/svg/award-seal.ts` (a lime-green disc with a gold ring, ~44px), so no third-party logo is used.
- `src/pages/home-showcase.ts` (`initHomeShowcase()`, called from `home.ts`; see ROADMAP > Page wiring) wires: `new ProductListController(new ProductModel(), { description: new ProductListView(...), specifications: new ProductListView(...) }).init()`.

### Tabs
`TabsView` (`src/views/tabs-view.ts`): generic ARIA tabs (click + Left/Right/Home/End keys, roving `tabindex`). Hidden panels use `hidden`. Swiper inside a panel that was hidden at init needs `swiper.update()` when shown: `TabsView` emits a `select` callback and the page calls `carousel.update()` (provided by T1's `CarouselView`).

### Layout with Tailwind
- Hero region: `.container-page grid gap-6 lg:grid-cols-4` → `<div data-hero-slot aria-hidden="true" class="hidden lg:block">` + hero `lg:col-span-3`. Hero height `h-64 sm:h-80 lg:h-[430px]`. Slides: `<img>` with `object-cover` + `bg-black/40` overlay. First slide image `fetchpriority="high"`, no lazy.
- Promo banners: `grid gap-6 md:grid-cols-2` inside the same `lg:col-span-3` column (they align under the hero, not under the sidebar).
- Products band: `bg-surface-alt py-10`, inner `grid gap-6 lg:grid-cols-4`, intro card `lg:col-span-1`, tabs + carousel `lg:col-span-3`. Teal strokes: absolutely positioned rotated `div`s (`h-2 rounded-full bg-teal`) or one inline SVG, `aria-hidden`.
- Product carousel `CarouselView` options: `slidesPerView: 1.3, spaceBetween: 16, breakpoints: { 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.3, spaceBetween: 24 } }`, `pagination: "bar"`.
- Hero `CarouselView`: `slidesPerView: 1, loop: true, autoplayMs: 5000`.
- LumiSpa: `bg-surface-warm py-12`, `grid items-center gap-8 md:grid-cols-2`; badge `absolute -top-4 right-4 size-20 rounded-full bg-primary text-white grid place-items-center text-center`.

### Tests
- Unit: `format.test.ts`, `product-model.test.ts` (spec scenarios; image existence check uses `node:fs` against `public/`), `product-list-view.test.ts` (happy-dom; renders template, uses textContent, sets `data-add-to-cart`), `product-list-controller.test.ts` (fake views), `tabs-view.test.ts`.
- E2E `tests/e2e/home-showcase.spec.ts`: hero next button, tab switch, card content, banner/lumispa layout at 375 vs 1440 (compare bounding boxes), no horizontal overflow (`document.documentElement.scrollWidth <= innerWidth`).

## Risks / Trade-offs

- [Parallel edits of `index.html` with T6] → only touch the three owned regions; keep other region comments in place.
- [Swiper `loop` with few slides warns] → hero has 2 slides; if Swiper warns, use `rewind: true` (supported by `CarouselView`) instead of `loop` and note it.
