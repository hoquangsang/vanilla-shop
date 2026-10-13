# Design

## Context

All features are merged (T1–T8). Playwright runs `pnpm build && pnpm preview` on port 4173 with 3 projects. The CI workflow (T2) already runs `pnpm test:e2e`, so the new e2e checks become PR gates automatically. Workflow files are owned by the planning session (cloud sessions may lack the `workflow` permission).

## Goals / Non-Goals

**Goals:** objective, repeatable gates and a clean pass on them; screenshots for the README.
**Non-Goals:** visual regression snapshots (too brittle with autoplaying carousels and remote fonts).

## Decisions

### `tests/e2e/quality.spec.ts`
- Run only in the `desktop` project (`test.skip(testInfo.project.name !== "desktop")`) and set viewports explicitly, so each width is tested once.
- Overflow: for each page × width → `page.setViewportSize({ width, height: 900 })`, `goto`, scroll to bottom in steps (`window.scrollBy`) to trigger lazy images, then evaluate `scrollWidth <= innerWidth`. On failure, report the offending elements: `[...document.querySelectorAll("body *")].filter(el => el.getBoundingClientRect().right > innerWidth + 1)` (first 5 selectors).
- Axe: `new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze()`; filter impact serious/critical; print `id`, `help`, target selectors on failure. Exclude Swiper's duplicated slides only if they cause false positives (`.swiper-slide-duplicate`), with a comment.
- Font size / target size: evaluate over visible `a, button, input, textarea, [role=tab]` and text nodes' parents at 375px.
- Disable carousel autoplay during these tests to avoid flakiness with `page.emulateMedia({ reducedMotion: "reduce" })`, which `CarouselView` already respects (T1). No test-only query flags in app code.

### Lighthouse
`lighthouserc.json`:
```json
{ "ci": {
  "collect": { "staticDistDir": "./dist", "url": ["/index.html", "/detail.html"], "numberOfRuns": 1, "settings": { "preset": "mobile" } },
  "assert": { "assertions": {
    "categories:performance": ["error", { "minScore": 0.8 }],
    "categories:accessibility": ["error", { "minScore": 0.9 }],
    "categories:best-practices": ["error", { "minScore": 0.9 }],
    "categories:seo": ["error", { "minScore": 0.9 }] } },
  "upload": { "target": "temporary-public-storage" } } }
```
Script `"lhci": "pnpm build && lhci autorun"`. Run it locally in the sandbox if Chrome is available; otherwise rely on the local follow-up workflow.

Typical fixes to expect: `<meta name="description">` per page, image `width/height`, `fetchpriority="high"` on the first hero image, preloading the Roboto 400 woff2, `font-display: swap` (Fontsource default), contrast of grey text, link names.

### Screenshots
`scripts/screenshots.ts` run with `tsx`: start `vite preview` (or reuse port 4173), launch Chromium, for each page × width set viewport, `emulateMedia({ reducedMotion: "reduce" })`, wait for `networkidle`, scroll to bottom and back (lazy images), `screenshot({ fullPage: true })` into `docs/screenshots/`. Script `"screenshots": "pnpm build && tsx scripts/screenshots.ts"`.

## Risks / Trade-offs

- [Lighthouse scores vary run to run] → Performance threshold 0.8 on mobile; `numberOfRuns: 3` in CI if flaky.
- [A fix for one gate changes another feature's behaviour] → not allowed; list it under Follow-ups instead.

## Local follow-up (planning session, after merge)

- `.github/workflows/lighthouse.yml`: on PR + main, `pnpm build`, `npx @lhci/cli autorun`, comment the report links.
- `README.md`: overview, live link, badges, screenshots grid, features vs brief checklist, architecture (link `docs/mvc.md`), scripts, CI/CD diagram, "How this was built with Claude Code" (link `docs/AI_WORKFLOW.md`), image credits.
- `docs/AI_WORKFLOW.md`: roles (planning vs coding session), OpenSpec flow with links to archived changes and PRs, hooks/agents/skills and real examples of each firing, what was decided by the human vs by AI, lessons learned.
