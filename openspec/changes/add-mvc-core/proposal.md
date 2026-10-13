# Proposal

## Why

Roadmap **T3**. Depends on T1. The brief requires the search → Detail flow to use **MVC**, and the cart badge must count "Add to cart" clicks. This change builds the state layer for both (models + shared core) with no UI, fully unit-tested, so T7 (cart UI) and T8 (search UI) only add views and controllers on top.

## What Changes

- `src/core/event-emitter.ts`: small typed pub/sub used by every model.
- `src/core/storage.ts`: `localStorage` wrapper that never throws (private mode, quota, disabled storage) and can notify about changes made in other tabs.
- `src/models/cart-model.ts`: cart state (quantity per product id), total count, persistence, cross-tab sync.
- `src/models/search-model.ts`: search query state, validation and normalisation, and conversion to/from the Detail page URL.
- `src/types/cart.ts`: shared types.
- Unit tests for all of the above (Vitest).

## Capabilities

### New Capabilities

- `cart-store`: how cart quantities are counted, persisted, restored and synchronised.
- `search-query`: how a search query is validated, normalised and carried to the Detail page through the URL.

### Modified Capabilities

None.

## Out of scope

- Any DOM, view or controller: cart badge and buttons → T7 `add-cart-flow`; search form and Detail page → T8 `add-search-to-detail`.
- Product catalogue, prices and `formatPrice` → T5 `add-home-showcase`.

## Impact

New files only: `src/core/{event-emitter,storage}.ts`, `src/models/{cart,search}-model.ts`, `src/types/cart.ts`, `tests/unit/core/*.test.ts`, `tests/unit/models/*.test.ts`. No new dependencies.
