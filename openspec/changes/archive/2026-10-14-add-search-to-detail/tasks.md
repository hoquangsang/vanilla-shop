# Tasks

## 1. Detail page

- [x] 1.1 Build region `detail` in `detail.html` as in design.md > Detail markup; verify at 375 and 1440 against `docs/design/flow-search-detail.png`

## 2. Views and navigation

- [x] 2.1 Add `src/core/navigation.ts`; implement `SearchFormView` and `DetailView` with unit tests; verify `pnpm test` passes

## 3. Controllers and wiring

- [x] 3.1 Implement `SearchController` and `DetailController` with unit tests using the real `SearchModel`, fake views and a fake navigator; verify `pnpm test` passes
- [x] 3.2 Add `src/pages/search.ts` (`initSearch()`, `initDetail()`), call them from `home.ts` / `detail.ts`; verify in `pnpm dev` that searching `Reasonable Price` on Home shows it on Detail

## 4. E2E and docs

- [x] 4.1 Write `tests/e2e/search.spec.ts` with one test per scenario in `specs/search-to-detail/spec.md`; verify `pnpm test:e2e` passes on all projects
- [x] 4.2 Write `docs/mvc.md` (Mermaid sequence diagram + file/layer table for search and cart); verify the Mermaid block renders in GitHub's preview

## 5. Ship

- [x] 5.1 Run `pnpm check`; verify it exits 0
- [x] 5.2 Run `a11y-auditor`, `responsive-reviewer` and `spec-verifier` (`add-search-to-detail`); fix blockers
- [x] 5.3 Open the PR with the `ship-change` skill (branch `feat/add-search-to-detail`), with screenshots of Home (typed query) and Detail (result) at 1440 and 375
