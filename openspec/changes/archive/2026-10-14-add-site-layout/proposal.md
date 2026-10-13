# Proposal

## Why

Roadmap **T4**. Depends on T1. The brief requires the Detail page to reuse the Home header and footer, and the design (`docs/design/zoom/home-part-1.png`, `home-part-5.png`, `flow-search-detail.png`) defines them in detail. Building the shared shell once, responsive, in the partials from T1 gives both pages the same chrome and gives T7/T8 the elements they hook into.

## What Changes

- Real `src/partials/header.html`: top bar, search row (search form + wishlist and cart boxes), nav row (Categories menu + main nav + Login/Register).
- Real `src/partials/footer.html`: contact column, two Quick Links columns, bottom bar with copyright and payment icons.
- Responsive behaviour: hamburger menu below `lg`, Categories dropdown, "Pages" sub-menu, mobile text logo.
- View-only behaviour in `src/views/`: `NavMenuView` (hamburger), `CategoriesMenuView` (open/close, open by default on Home ≥ lg), `DropdownView` (Pages menu, Dresses sub-menu), `ActiveNavView` (marks the current page link).
- All `data-*` hooks owned by T4 in `openspec/ROADMAP.md > Shared contracts`.

## Capabilities

### New Capabilities

- `site-layout`: the shared header and footer shown on every page, their content, their responsive behaviour and their keyboard/screen-reader behaviour.

### Modified Capabilities

None.

## Out of scope

- Cart count updates and accessible "Cart, N items" label → T7 `add-cart-flow` (T4 renders a static `0`).
- Search submit handling (T4 only builds a working native form `action="detail.html"` with `name="q"`) → T8 `add-search-to-detail`.
- Home body sections, including the empty `data-hero-slot` column → T5 `add-home-showcase`.

## Impact

- Modified: `src/partials/header.html`, `src/partials/footer.html`, `src/pages/home.ts`, `src/pages/detail.ts` (instantiate the views).
- New: `src/views/{nav-menu,categories-menu,dropdown,active-nav}-view.ts`, `tests/unit/views/*.test.ts`, `tests/e2e/layout.spec.ts`.
