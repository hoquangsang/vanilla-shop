# Tasks

## 1. Gates

- [x] 1.1 Add dev deps `@axe-core/playwright`, `@lhci/cli`, `tsx`; verify `pnpm install` succeeds
- [x] 1.2 Write `tests/e2e/quality.spec.ts` (overflow at 8 widths × 2 pages, axe at 2 widths × 2 pages, mobile text/target sizes) as in design.md; run it and record the failures it finds in the PR description (before/after)
- [x] 1.3 Add `lighthouserc.json` and the `lhci` script; verify `pnpm lhci` runs (or note in the PR that Chrome is unavailable in the sandbox)

## 2. Fixes

- [x] 2.1 Fix every overflow, axe, size and Lighthouse finding without changing specified behaviour; verify `pnpm test:e2e` and `pnpm lhci` pass

## 3. Screenshots

- [x] 3.1 Add `scripts/screenshots.ts` and the `screenshots` script; run it; verify the 6 PNGs exist in `docs/screenshots/` and look right

## 4. Ship

- [x] 4.1 Run `pnpm check` and `pnpm test:e2e`; verify both exit 0
- [ ] 4.2 Run `responsive-reviewer`, `a11y-auditor` and `spec-verifier` (`add-quality-gates`); verify all PASS / READY
- [ ] 4.3 Open the PR with the `ship-change` skill (branch `chore/add-quality-gates`), attaching the 1440 and 375 Home screenshots

## Workflow follow-up

- Planning session: add `.github/workflows/lighthouse.yml`, write the final `README.md` and `docs/AI_WORKFLOW.md` (design.md > Local follow-up).
- Planning session: archive all changes (`openspec archive <id>`) and verify `openspec/specs/` contains every capability.
