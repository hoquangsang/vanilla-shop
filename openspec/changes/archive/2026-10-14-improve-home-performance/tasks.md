# Tasks

## 1. Subset fonts

- [x] 1.1 Add the `subset-font` dev dependency, `scripts/subset-icons.ts` and the `icons` script as in design.md; run `pnpm icons` and verify it prints two files, each under 20 kB
- [x] 1.2 Point `src/styles/icons.css` at `../assets/fonts/*.woff2` and add the header comment; verify `pnpm build` has no `fa-solid-900-*.woff2` over 20 kB in `dist/assets/`

## 2. Guard

- [x] 2.1 Write `tests/unit/styles/icon-subset.test.ts` (scenarios "Every used icon is in a subset font" and "Subset fonts are small"); verify it passes, and that it fails when you temporarily add a bogus codepoint such as `--fa: "\e000";` to `icons.css` (then revert it)

## 3. Budget

- [x] 3.1 Set the performance `minScore` to 0.9 in `lighthouserc.json`; run `pnpm lhci` if Chrome is available and record the scores in the PR (otherwise say so)

## 4. Ship

- [x] 4.1 Run `pnpm check` and `pnpm test:e2e`; verify both exit 0, then run `pnpm screenshots` and check visually that `home-1440.png` and `home-375.png` show all header, top-bar and footer icons (commit the regenerated screenshots)
- [x] 4.2 Run the `spec-verifier` agent for `improve-home-performance`; verify it reports READY FOR PR
- [x] 4.3 Open the PR with the `ship-change` skill (branch `perf/improve-home-performance`, title `perf: improve-home-performance - subset icon fonts`)
