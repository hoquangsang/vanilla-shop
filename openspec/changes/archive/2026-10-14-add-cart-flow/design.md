# Design

## Context

Available after T3/T4/T5: `CartModel` (`add`, `count`, `on("change")`, `STORAGE_KEY`), `createBrowserStorage()`, header markup `[data-cart-link]` containing `[data-cart-count]`, product buttons `[data-add-to-cart="pN"]` rendered by `ProductListView` (possibly after an async render, and possibly duplicated by Swiper). Layering rules: `CLAUDE.md` + `.claude/skills/mvc-feature`.

## Goals / Non-Goals

**Goals:** a textbook-clear MVC triangle that a reviewer can read in two minutes; robust to async-rendered and duplicated buttons.
**Non-Goals:** animations beyond the button text swap; cart contents UI.

## Decisions

### Views
```ts
// src/views/cart-badge-view.ts
export class CartBadgeView {
  constructor(root: ParentNode = document);   // finds all [data-cart-count] and [data-cart-link]
  render(count: number): void;                // text "0".."99" | "99+", aria-label "Cart, N item(s)"
  announce(count: number): void;              // writes "Cart updated: N item(s)" into a visually hidden aria-live="polite" region it creates once
}
// src/views/add-to-cart-view.ts
export class AddToCartView {
  constructor(root: ParentNode = document);
  bindAdd(handler: (productId: string, button: HTMLButtonElement) => void): void;  // one delegated "click" listener on root; reads closest("[data-add-to-cart]")
  showAdded(button: HTMLButtonElement): void;            // "Added ✓" for 1000ms, then restore; restarting the timer on re-click
}
```
- Delegation on `document` handles buttons rendered later and Swiper clones without re-binding.
- Native `<button>` already fires `click` for Enter/Space, so no key handling is needed and focus does not move.
- Pluralisation helper `itemsLabel(n)` lives in the view (presentation).

### Controller
```ts
// src/controllers/cart-controller.ts
export class CartController {
  constructor(model: CartModel, badge: Pick<CartBadgeView, "render" | "announce">, buttons: Pick<AddToCartView, "bindAdd" | "showAdded">);
  init(): void; // badge.render(model.count) once; model.on("change", s => { badge.render(s.count); badge.announce(s.count); }); buttons.bindAdd((id, btn) => { model.add(id); buttons.showAdded(btn); })
}
```
`bindAdd` passes the clicked button back so the controller can ask the view for feedback; the controller never queries the DOM itself.

Cross-tab updates come for free: the model emits `change` on external storage changes (T3), so the badge updates in other tabs too (the announcement there is harmless).

### Page wiring
`src/pages/cart.ts`:
```ts
export function initCart(): CartController {
  const controller = new CartController(new CartModel(createBrowserStorage()), new CartBadgeView(), new AddToCartView());
  controller.init();
  return controller;
}
```
Called from `home.ts` and `detail.ts`.

### Tests
- Unit: `cart-badge-view.test.ts` (0, 1 item vs items, 99 vs `99+`, live region created once), `add-to-cart-view.test.ts` (delegated click on a button added after binding; `showAdded` restores text with fake timers), `cart-controller.test.ts` (real `CartModel` on memory storage + fake views: initial render, add → render + announce).
- E2E `tests/e2e/cart.spec.ts`: one test per scenario. For the 99+ case, seed storage with `page.addInitScript(() => localStorage.setItem("vanilla-shop:cart", JSON.stringify({ version: 1, items: { p1: 120 } })))`. Use `page.clock` or `expect.poll` for the 1-second feedback. Clear storage in `beforeEach`.

## Risks / Trade-offs

- [Swiper `loop` clones carry the same `data-add-to-cart`] → delegation makes clones work; the count is per click, so no double count.
- [Badge box width with 3 characters (`99+`)] → set `min-w-[2ch] tabular-nums` so the box does not jump.
