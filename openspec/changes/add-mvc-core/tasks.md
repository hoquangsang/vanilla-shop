# Tasks

## 1. Core

- [x] 1.1 Implement `src/core/event-emitter.ts` with tests (subscribe, unsubscribe, multiple listeners, a throwing listener does not block others); verify `pnpm test tests/unit/core/event-emitter.test.ts` passes
- [x] 1.2 Implement `src/core/storage.ts` (browser + memory variants) with tests (get/set round-trip, throwing `localStorage` → no throw, external change callback fires only for its key, unsubscribe); verify `pnpm test tests/unit/core/storage.test.ts` passes

## 2. Cart

- [x] 2.1 Add `src/types/cart.ts` and `src/models/cart-model.ts` as in design.md; verify `pnpm typecheck` passes
- [x] 2.2 Write `tests/unit/models/cart-model.test.ts` with one test per scenario in `specs/cart-store/spec.md` (titles = scenario names); verify all pass

## 3. Search

- [x] 3.1 Implement `src/models/search-model.ts` as in design.md; verify `pnpm typecheck` passes
- [x] 3.2 Write `tests/unit/models/search-model.test.ts` with one test per scenario in `specs/search-query/spec.md`; verify all pass

## 4. Ship

- [x] 4.1 Run `pnpm check`; verify it exits 0 and the guard-mvc hook never fired (no DOM in models)
- [x] 4.2 Run the `spec-verifier` agent for `add-mvc-core`; verify it reports `READY FOR PR`
- [x] 4.3 Open the PR with the `ship-change` skill (branch `feat/add-mvc-core`, title `feat: add-mvc-core - cart and search models`)
