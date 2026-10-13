# Tasks

## 1. Awards region

- [x] 1.1 Draw the 6 award seals as SVG in `public/images/awards/`; verify each opens in a browser and they are visually distinct
- [x] 1.2 Build region `awards` (title pill, banner, carousel markup) and mount its `CarouselView` in `src/pages/home-brand-content.ts`; verify at 375 / 1024 / 1440 against `docs/design/zoom/home-part-3.png` (2 / 4 / 6 items visible)

## 2. Nu Skin Way region

- [x] 2.1 Build region `nu-skin-way`: title pill, stats strip, Force for Good and Nature + Science blocks with the copy from design.md; verify at 375 and 1440 against `docs/design/zoom/home-part-3.png` and `home-part-4.png`

## 3. News region

- [x] 3.1 Build region `news`: title pill, `View All >>`, 5 news cards carousel, side card; mount the news `CarouselView`; verify at 375 / 1024 / 1440 against `docs/design/zoom/home-part-4.png` and `home-part-5.png`

## 4. E2E

- [x] 4.1 Write `tests/e2e/home-brand-content.spec.ts` covering the scenarios in `specs/home-brand-content/spec.md` (visual-match via PR screenshots); verify `pnpm test:e2e` passes

## 5. Ship

- [x] 5.1 Run `pnpm check`; verify it exits 0
- [x] 5.2 Run `responsive-reviewer`, `a11y-auditor` and `spec-verifier` (`add-home-brand-content`); fix blockers
- [x] 5.3 Open the PR with the `ship-change` skill (branch `feat/add-home-brand-content`), with 375 and 1440 screenshots of the three regions
