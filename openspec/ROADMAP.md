# Roadmap

One OpenSpec change = one branch = one PR. Status is updated by the planning session.

| Id | Change | Owner | Depends on | Status |
|---|---|---|---|---|
| T0 | bootstrap repo, Claude setup, design docs, all specs | local | – | ✅ done |
| T1 | `setup-project-scaffold` | cloud | T0 | ⏳ ready |
| T2 | `setup-ci-cd` | local | T1 | blocked by T1 |
| T3 | `add-mvc-core` | cloud | T1 | blocked by T1 |
| T4 | `add-site-layout` | cloud | T1 | blocked by T1 |
| T5 | `add-home-showcase` | cloud | T1 | blocked by T1 |
| T6 | `add-home-brand-content` | cloud | T1 | blocked by T1 |
| T7 | `add-cart-flow` | cloud | T3, T4, T5 | blocked |
| T8 | `add-search-to-detail` | cloud | T3, T4 | blocked |
| T9 | `add-quality-gates` | cloud + local | T7, T8 | blocked |

```
T0 → T1 ─┬─ T2 (local)
         ├─ T3 ─┬───────────┐
         ├─ T4 ─┼─ T8 ──────┤
         ├─ T5 ─┴─ T7 ──────┼─ T9
         └─ T6 ─────────────┘
```

T3–T6 can run **in parallel** once T1 is merged. T4, T5 and T6 all edit `index.html`, but each in its own region (see below), so merge conflicts stay trivial.

## Shared contracts

Changes running in parallel rely on these names. **Do not rename them**; a change that needs a new one adds it here in its PR.

### Page regions in `index.html`

```html
<body data-page="home">
  <!-- @include partials/header.html -->      T4
  <main id="main">
    <!-- region:hero -->            … T5 (hero + sidebar slot + promo banners)
    <!-- region:popular-products --> … T5
    <!-- region:lumispa -->          … T5
    <!-- region:awards -->           … T6
    <!-- region:nu-skin-way -->      … T6 (title, stats, force for good, nature + science)
    <!-- region:news -->             … T6
  </main>
  <!-- @include partials/footer.html -->      T4
</body>
```

`detail.html` uses `data-page="detail"` and `<!-- region:detail -->` (T8). T1 creates both files with these empty region comments.

### `data-*` hooks (JS finds elements only through these)

| Attribute | Element | Created by | Used by |
|---|---|---|---|
| `data-search-form` | header `<form>` (`action="detail.html" method="get"`) | T4 | T8 |
| `data-search-input` | its `<input name="q">` | T4 | T8 |
| `data-cart-count` | `<span>` with the cart number | T4 | T7 |
| `data-cart-link` | the cart box `<a>` (gets the accessible label) | T4 | T7 |
| `data-wishlist-count` | `<span>` with the wishlist number (always 0) | T4 | – |
| `data-categories-toggle` / `data-categories-menu` | Categories button / list | T4 | T4 |
| `data-nav-toggle` / `data-nav-menu` | hamburger / collapsible nav | T4 | T4 |
| `data-nav="home"` / `data-nav="detail"` | nav links that get `aria-current="page"` | T4 | T4 |
| `data-hero-slot` | empty, `aria-hidden` left column (`lg:` 1/4 width) beside the hero. On Home ≥ lg the Categories menu (absolutely positioned, open by default) overlays it | T5 | T4 |
| `data-carousel` | root of every Swiper carousel (`CarouselView`) | T1 | T5, T6 |
| `data-product-list="description"` / `="specifications"` | product carousel wrappers | T5 | T5 |
| `data-add-to-cart="<productId>"` | "Add to cart" buttons | T5 | T7 |
| `data-detail-text` | Detail page `<textarea>` | T8 | T8 |

### Shared code (who creates what)

- T1: `src/views/carousel-view.ts` (Swiper wrapper), CSS component classes `.container-page`, `.section-title`, `.btn-primary`, `.btn-outline` in `src/styles/main.css`.
- T3: `src/core/event-emitter.ts`, `src/core/storage.ts`, `src/models/cart-model.ts`, `src/models/search-model.ts`, `src/types/cart.ts`.
- T5: `src/data/products.json`, `src/types/product.ts`, `src/models/product-model.ts`, `src/core/format.ts` (`formatPrice`). Product ids are the strings `p1`…`p8`; T7 only relies on that.

### Page wiring (avoids conflicts in `src/pages/*.ts`)

Each change puts its page setup in its own module that exports one `init…()` function, and adds **one import + one call** to the page entry:

| Module | Change | Called from |
|---|---|---|
| `src/pages/shell.ts` → `initShell()` | T4 | `home.ts`, `detail.ts` |
| `src/pages/home-showcase.ts` → `initHomeShowcase()` | T5 | `home.ts` |
| `src/pages/home-brand-content.ts` → `initHomeBrandContent()` | T6 | `home.ts` |
| `src/pages/cart.ts` → `initCart()` | T7 | `home.ts`, `detail.ts` |
| `src/pages/search.ts` → `initSearch()` / `initDetail()` | T8 | `home.ts`, `detail.ts` / `detail.ts` |
