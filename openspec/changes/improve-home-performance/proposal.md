# Proposal

## Why

Roadmap **T10**, a follow-up found after T9 merged. Depends on T9 (`add-quality-gates`, archived) being on `main`.

The first `lighthouse` run on `main` failed: Home Performance was **0.77** against the 0.80 budget. On the T9 PR the same page scored 0.80, so the page sits right on the threshold and the gate fails or passes at random.

The planning session profiled it (Lighthouse 12, mobile, simulated throttling: 150 ms RTT, 1.6 Mbps, 4× CPU):

- FCP is 3.0 s and LCP is 4.7 s. Both Font Awesome fonts (`fa-solid-900.woff2` 120 kB, `fa-brands-400.woff2` 116 kB) are in the critical request chain, and they use `font-display: block`. The site uses only 23 icons out of about 2,000.
- An experiment that subset both fonts to the 23 used glyphs (4.5 kB total) gave Home **0.95–0.96** (FCP 1.7 s, LCP 2.7 s). Turning off the hero's Swiper `loop` and using `font-display: swap` without subsetting gained only about 0.02, so neither is part of this change.

## What Changes

- A script `scripts/subset-icons.ts` reads the codepoints from `src/styles/icons.css`, subsets the two Font Awesome fonts from `node_modules` to exactly those glyphs, and writes `src/assets/fonts/fa-solid-900.woff2` and `src/assets/fonts/fa-brands-400.woff2`. It is exposed as `pnpm icons`.
- `src/styles/icons.css` points its `@font-face` rules at the subset files.
- A unit test fails if `icons.css` uses a codepoint that a subset font does not contain, so adding an icon without re-running the script is caught.
- `lighthouserc.json` raises the Performance budget from 0.8 to **0.9** to lock in the gain, with headroom.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality-gates`: Performance budget 0.8 → 0.9. New requirement: icon fonts contain only the glyphs the site uses.

## Out of scope

- Changing the hero carousel (`loop`), images or Roboto loading. The measurements show they are not the bottleneck.
- Replacing Font Awesome with inline SVG.
- `.github/workflows/**`: `lighthouse.yml` already runs `pnpm lhci` and needs no change.

## Impact

- New: `scripts/subset-icons.ts`, `src/assets/fonts/fa-solid-900.woff2`, `src/assets/fonts/fa-brands-400.woff2` (both committed, a few kB each), `tests/unit/styles/icon-subset.test.ts`.
- Modified: `src/styles/icons.css` (two `src:` URLs, plus a header comment explaining `pnpm icons`), `package.json` (`icons` script and a dev dependency for subsetting), `lighthouserc.json` (performance `minScore` 0.9).
