# Tasks

## 1. Product catalogue (model)

- [x] 1.1 Add `src/types/product.ts`, `src/data/products.json` (table in design.md) and `src/core/format.ts`; verify `pnpm typecheck` passes
- [x] 1.2 Implement `src/models/product-model.ts`; write `tests/unit/models/product-model.test.ts` and `tests/unit/core/format.test.ts` with one test per scenario in `specs/product-catalog/spec.md`; verify `pnpm test` passes

## 2. Hero region

- [x] 2.1 Build region `hero` in `index.html` (hero slot, hero carousel with 2 slides, 2 promo banners) and mount the hero `CarouselView` in `src/pages/home-showcase.ts`; verify at 375 / 768 / 1440 against `docs/design/zoom/home-part-1.png`

## 3. Popular products region

- [x] 3.1 Add the `Most Popular Products` title pill, the band layout, intro card with teal strokes, tabs and `View All >>`; verify at 1440 against `docs/design/zoom/home-part-2.png`
- [x] 3.2 Add `<template id="product-card-template">`, `ProductListView`, the award-seal SVG, and `ProductListController`; write the view and controller unit tests; verify `pnpm test` passes
- [x] 3.3 Implement `TabsView` with unit tests and wire tabs + both product carousels in `src/pages/home-showcase.ts`; verify in `pnpm dev` that switching tabs shows the other products and the carousel has correct widths after switching

## 4. LumiSpa region

- [x] 4.1 Build region `lumispa` (image + badge + text + button); verify at 375 and 1440 against `docs/design/zoom/home-part-2.png`

## 5. E2E

- [x] 5.1 Write `tests/e2e/home-showcase.spec.ts` covering the scenarios in `specs/home-showcase/spec.md` (visual-match scenario via screenshots in the PR); verify `pnpm test:e2e` passes

## 6. Ship

- [x] 6.1 Run `pnpm check`; verify it exits 0
- [x] 6.2 Run `responsive-reviewer`, `a11y-auditor` and `spec-verifier` (`add-home-showcase`); fix blockers
- [x] 6.3 Open the PR with the `ship-change` skill (branch `feat/add-home-showcase`), with 375 and 1440 screenshots of the three regions
