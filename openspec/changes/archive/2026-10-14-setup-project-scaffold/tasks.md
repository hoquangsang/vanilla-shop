# Tasks

## 1. Toolchain

- [x] 1.1 Create `package.json` (name `vanilla-shop`, private, `"type": "module"`, engines, `packageManager` via `corepack use pnpm@latest`), `.nvmrc`, `.editorconfig`, `.gitignore` (node_modules, dist, playwright-report, test-results, .vercel, *.local), and install every dependency listed in proposal.md at latest stable; verify `pnpm install` succeeds and `pnpm-lock.yaml` exists
- [x] 1.2 Add `tsconfig.json` as in design.md; verify `pnpm typecheck` passes
- [x] 1.3 Add `eslint.config.js`, `.prettierrc.json`, `.prettierignore` (dist, pnpm-lock.yaml, public/images, docs/design); verify `pnpm lint` and `pnpm exec prettier --check .` pass
- [x] 1.4 Add all scripts from design.md > Scripts; verify `pnpm openspec list` prints the changes

## 2. Pages, partials, styles

- [x] 2.1 Write `build/html-partials.ts` and its unit test (replaces an include, leaves other comments alone, throws on a missing file); verify `pnpm test` passes
- [x] 2.2 Add `vite.config.ts` as in design.md; verify `pnpm build` emits `dist/index.html` and `dist/detail.html` with the placeholder header/footer inlined and relative asset URLs (`./assets/...`)
- [x] 2.3 Create `index.html` and `detail.html` exactly as in design.md > Page shells and ROADMAP > Page regions, plus placeholder `src/partials/header.html` and `footer.html`; verify both pages render in `pnpm dev`
- [x] 2.4 Create `src/styles/main.css` with every token from `docs/design/README.md > Design tokens` and the four component classes; create `src/pages/home.ts` and `src/pages/detail.ts` importing fonts, Font Awesome and styles; verify the footer placeholder is purple `#551760` and the text is Roboto in dev
- [x] 2.5 Create the empty folders with `.gitkeep`: `src/core`, `src/models`, `src/controllers`, `src/types`, `src/data`, `tests/unit/models`, `tests/unit/controllers`; verify the tree matches `CLAUDE.md > Architecture`

## 3. Shared UI primitive

- [x] 3.1 Implement `src/views/carousel-view.ts` as in design.md > CarouselView (all options, `update()`, `destroy()`, `.carousel-bar-pagination` styles), with a unit test (happy-dom) that mounts it on the documented markup and checks that `destroy()` runs and that autoplay is off when `prefers-reduced-motion` matches (mock `matchMedia`); verify `pnpm test` passes

## 4. E2E

- [x] 4.1 Add `playwright.config.ts` and `tests/e2e/smoke.spec.ts` as in design.md > Tests; run `pnpm exec playwright install --with-deps chromium` then verify `pnpm test:e2e` passes on all 3 projects (if browsers cannot be installed in this sandbox, say so in the PR)

## 5. Ship

- [x] 5.1 Run `pnpm check`; verify it exits 0
- [x] 5.2 Open the PR with the `ship-change` skill (branch `chore/setup-project-scaffold`, title `chore: setup-project-scaffold - Vite + TS + Tailwind scaffold`), including the output of `pnpm check`
