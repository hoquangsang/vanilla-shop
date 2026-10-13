# Proposal

## Why

Roadmap **T9**, the last change. Depends on T7 and T8, so both pages are complete. The brief asks for "responsive đúng tiêu chuẩn" (proper responsive). This change turns that into measurable, automated gates (no horizontal overflow at any common width, no serious accessibility violations, Lighthouse budgets), fixes whatever they find, and produces the screenshots the README needs.

## What Changes

- **Cloud part:**
  - `tests/e2e/quality.spec.ts`: overflow check at 320 / 375 / 414 / 768 / 1024 / 1280 / 1440 / 1920 on both pages; axe-core scan on both pages.
  - `lighthouserc.json` with budgets.
  - `pnpm screenshots` script that writes `docs/screenshots/{home,detail}-{375,768,1440}.png`.
  - Fixes for every problem the gates find.
- **Local part** (planning session, after the cloud PR merges):
  - `.github/workflows/lighthouse.yml`.
  - Final `README.md`.
  - `docs/AI_WORKFLOW.md`.

## Capabilities

### New Capabilities

- `quality-gates`: measurable responsive, accessibility and performance guarantees for both pages, checked automatically.

### Modified Capabilities

None. Fixes found by the gates must not change behaviour defined in other capabilities. If one would, stop and record it under Follow-ups.

## Out of scope

- Packaging the submission zip / `file://` support (separate step after T9).
- New features.

## Impact

- New: `tests/e2e/quality.spec.ts`, `lighthouserc.json`, `scripts/screenshots.ts`, `docs/screenshots/*.png`; dev dependencies `@axe-core/playwright`, `@lhci/cli`, `tsx`.
- Possibly modified: any HTML/CSS/view file, to fix findings.
- Local follow-up: `.github/workflows/lighthouse.yml`, `README.md`, `docs/AI_WORKFLOW.md`.
