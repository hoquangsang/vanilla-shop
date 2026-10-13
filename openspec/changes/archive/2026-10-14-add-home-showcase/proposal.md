# Proposal

## Why

Roadmap **T5**. Depends on T1. The top half of the Home page (`docs/design/zoom/home-part-1.png`, `home-part-2.png`, `flow-add-to-cart.png`) is the part reviewers look at first and contains the "Add to cart" buttons the brief asks about. Product cards are rendered from a product catalogue (model → view → controller), so the MVC pattern is visible beyond the search flow too.

## What Changes

- Region `hero`: empty left column (`data-hero-slot`) + hero carousel (2 slides) + two "Winter Collection" promo banners.
- Region `popular-products`: "Most Popular Products" title pill; band with the "Find out what everyone's talking about" card, DESCRIPTION / SPECIFICATIONS tabs, `View All >>`, and a product carousel per tab.
- Product cards rendered from `src/data/products.json` through `ProductModel` → `ProductListController` → `ProductListView`, each with a `data-add-to-cart="<id>"` button.
- Region `lumispa`: feature band with image, round price badge, text and `SHOP NOW` button.
- `formatPrice` helper and product types.

## Capabilities

### New Capabilities

- `product-catalog`: the list of products, their fields, which products appear in which Home tab, and price formatting.
- `home-showcase`: the hero, promo banners, popular-products band (tabs, carousel, product cards) and LumiSpa band of the Home page.

### Modified Capabilities

None.

## Out of scope

- What happens when "Add to cart" is clicked → T7 `add-cart-flow` (here the button exists but does nothing).
- Header, footer, Categories menu → T4 `add-site-layout`.
- Awards, Nu Skin Way, News → T6 `add-home-brand-content`.

## Impact

- Modified: `index.html` (regions `hero`, `popular-products`, `lumispa` only), `src/pages/home.ts` (one import + call; logic in new `src/pages/home-showcase.ts`), `src/styles/main.css` (product card / tab classes if needed).
- New: `src/data/products.json`, `src/types/product.ts`, `src/models/product-model.ts`, `src/core/format.ts`, `src/views/{product-list,tabs}-view.ts`, `src/controllers/product-list-controller.ts`, `src/views/svg/award-seal.ts` (inline SVG string), tests under `tests/unit/**` and `tests/e2e/home-showcase.spec.ts`.
