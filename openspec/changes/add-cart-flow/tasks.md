# Tasks

## 1. Views

- [ ] 1.1 Implement `CartBadgeView` with unit tests (labels, `99+`, live region); verify `pnpm test` passes
- [ ] 1.2 Implement `AddToCartView` with unit tests (delegation to late-added buttons, `showAdded` timing with fake timers); verify `pnpm test` passes

## 2. Controller and wiring

- [ ] 2.1 Implement `CartController` with a unit test using the real `CartModel` + memory storage and fake views; verify `pnpm test` passes
- [ ] 2.2 Add `src/pages/cart.ts` (`initCart()`) and call it from `home.ts` and `detail.ts`; verify in `pnpm dev` that clicking "Add to cart" increments the badge and Detail shows the same count

## 3. E2E

- [ ] 3.1 Write `tests/e2e/cart.spec.ts` with one test per scenario in `specs/cart-badge/spec.md`; verify `pnpm test:e2e` passes on all projects

## 4. Ship

- [ ] 4.1 Run `pnpm check`; verify it exits 0
- [ ] 4.2 Run `a11y-auditor` and `spec-verifier` (`add-cart-flow`); fix blockers
- [ ] 4.3 Open the PR with the `ship-change` skill (branch `feat/add-cart-flow`), including a short screen recording or before/after screenshots of the badge (0 → 1)
