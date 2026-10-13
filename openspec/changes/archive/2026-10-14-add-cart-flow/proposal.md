# Proposal

## Why

Roadmap **T7**. Depends on T3 (`CartModel`), T4 (cart box with `data-cart-count`) and T5 (buttons with `data-add-to-cart`). The brief requires: *clicking "Add to cart" increases the number on the cart icon by the number of clicks* (`docs/design/flow-add-to-cart.png`). This change connects the existing model and markup through a view and a controller.

## What Changes

- `CartBadgeView`: renders the count into every `[data-cart-count]`, updates the cart link's accessible name, announces changes politely, caps the display at `99+`.
- `AddToCartView`: listens (event delegation) for clicks on any `[data-add-to-cart]` button, including buttons Swiper duplicates for looping, and gives short visual feedback on the clicked button.
- `CartController`: on add → `CartModel.add(id)`; on model change → `CartBadgeView.render(count)`.
- `src/pages/cart.ts` → `initCart()` called from both `home.ts` and `detail.ts` (the badge is in the shared header, so Detail shows the same count).

## Capabilities

### New Capabilities

- `cart-badge`: what the shopper sees and hears when adding to cart: the header count, its persistence across pages and reloads, its accessible label and the button feedback.

### Modified Capabilities

None. (`cart-store` rules from T3 are used unchanged.)

## Out of scope

- Cart page, removing items, mini-cart popover.
- Wishlist (stays `0`, see `docs/design/README.md`).
- Search → T8.

## Impact

- New: `src/views/{cart-badge,add-to-cart}-view.ts`, `src/controllers/cart-controller.ts`, `src/pages/cart.ts`, `tests/unit/views/cart-badge-view.test.ts`, `tests/unit/controllers/cart-controller.test.ts`, `tests/e2e/cart.spec.ts`.
- Modified: `src/pages/home.ts`, `src/pages/detail.ts` (one import + call each); `src/partials/header.html` only if the live region needs an extra element.
