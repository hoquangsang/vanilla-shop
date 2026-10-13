# Proposal

## Why

Roadmap **T6** (runs 8th, after T8; see `openspec/ROADMAP.md`). Needs T1; by the time it runs T3, T4, T5, T7 and T8 are merged. The lower half of the Home page (`docs/design/zoom/home-part-3.png`, `home-part-4.png`, `home-part-5.png`) is mostly content and layout work, independent from the cart and search logic, so it is scheduled after the features the brief grades.

## What Changes

- Region `awards`: `Award And Recognition` title pill, wide award banner, awards carousel with 6 award items (self-drawn SVG seals) and dot pagination.
- Region `nu-skin-way`: `The Nu Skin Way` title pill, stats strip (`25+`, `20+`, `850M+`), "Being a Force for Good" and "Nature + Science" image/text blocks.
- Region `news`: `Nu Skin In The News` title pill, news carousel (5 cards) with `View All >>`, and the tall "News" side card.

## Capabilities

### New Capabilities

- `home-brand-content`: the awards, Nu Skin Way and news sections of the Home page, their content and responsive layout.

### Modified Capabilities

None.

## Out of scope

- Hero, products, LumiSpa → T5 `add-home-showcase`. Header/footer → T4.
- Real news articles or links; every link is `#`.

## Impact

- Modified: `index.html` (regions `awards`, `nu-skin-way`, `news` only), `src/pages/home.ts` (one import + call). New: `src/pages/home-brand-content.ts`.
- New: `public/images/awards/award-1..6.svg` (self-drawn seals), `tests/e2e/home-brand-content.spec.ts`.
