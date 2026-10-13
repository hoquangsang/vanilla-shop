# Tasks

## 1. Header markup

- [x] 1.1 Build the top bar in `src/partials/header.html` (design.md > Markup skeleton, copy from `docs/design/README.md`); verify at 375 and 1440 against `docs/design/zoom/home-part-1.png`
- [x] 1.2 Build the search row (mobile text logo, search form with all `data-*` hooks, wishlist + cart boxes); verify that with JS disabled, submitting `serum` navigates to `detail.html?q=serum`
- [x] 1.3 Build the nav row (Categories column + list with the Dresses sub-menu, main nav with Pages sub-menu, Login/Register, hamburger); verify at 1440 the order and colours match the design image

## 2. Footer markup

- [x] 2.1 Build `src/partials/footer.html` (3 columns + bottom bar with payment icons); verify at 375 (stacked) and 1440 (3 columns) against `docs/design/zoom/home-part-5.png`

## 3. Menu behaviour

- [x] 3.1 Implement `DisclosureView`, `NavMenuView`, `CategoriesMenuView`, `DropdownView`, `ActiveNavView` with unit tests as in design.md; verify `pnpm test` passes
- [x] 3.2 Add `src/pages/shell.ts` (`initShell()`) and call it from `home.ts` and `detail.ts`; verify in `pnpm dev` that menus work on both pages, Categories is open on Home at 1440 and closed on Detail

## 4. E2E

- [x] 4.1 Write `tests/e2e/layout.spec.ts` covering every scenario in `specs/site-layout/spec.md` (except the visual comparison, which is checked by screenshot in the PR); verify `pnpm test:e2e` passes

## 5. Ship

- [x] 5.1 Run `pnpm check`; verify it exits 0
- [x] 5.2 Run `responsive-reviewer`, `a11y-auditor` and `spec-verifier` (`add-site-layout`); fix blockers; verify all report PASS / READY
- [x] 5.3 Open the PR with the `ship-change` skill (branch `feat/add-site-layout`), with screenshots of the header and footer at 375 and 1440
