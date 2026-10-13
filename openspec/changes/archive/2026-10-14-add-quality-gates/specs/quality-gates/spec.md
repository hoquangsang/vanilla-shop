# Spec Delta

## Purpose

Makes "properly responsive and accessible" verifiable: both pages must pass automated layout, accessibility and performance checks at the screen sizes reviewers are likely to use.

## ADDED Requirements

### Requirement: No horizontal overflow
Home and Detail SHALL have no horizontal page scroll at viewport widths 320, 375, 414, 768, 1024, 1280, 1440 and 1920 px: `document.documentElement.scrollWidth` SHALL NOT exceed `window.innerWidth`.

#### Scenario: All widths, both pages
- **WHEN** each page is loaded at each listed width and scrolled to the bottom (to trigger lazy content)
- **THEN** the page's scroll width is less than or equal to the viewport width

### Requirement: No serious accessibility violations
An axe-core scan (WCAG 2.0/2.1/2.2 A and AA rules) of Home and Detail at 375px and 1440px SHALL report no violations of impact `serious` or `critical`.

#### Scenario: Axe scan
- **WHEN** axe runs on each page at both widths after the page is fully loaded
- **THEN** there are zero serious or critical violations

### Requirement: Lighthouse budgets
A Lighthouse run (mobile preset) of the production build SHALL score at least 90 for Accessibility, Best Practices and SEO and at least 80 for Performance on both pages.

#### Scenario: Lighthouse CI
- **WHEN** `lhci autorun` runs against `dist/` for `index.html` and `detail.html`
- **THEN** all assertions in `lighthouserc.json` pass

### Requirement: Readable text and usable targets on mobile
At 375px no visible text SHALL be smaller than 12px, and every button and link in the header, carousels and product cards SHALL have a hit area of at least 44×44px or at least 24×24px with enough spacing, per WCAG 2.2 Target Size.

#### Scenario: Mobile sizes
- **WHEN** Home is loaded at 375px and the computed font sizes and bounding boxes are measured
- **THEN** no visible text is below 12px and no interactive target is smaller than 24×24px

### Requirement: Up-to-date screenshots
The repository SHALL contain screenshots of Home and Detail at 375, 768 and 1440 px generated from the current build by one command.

#### Scenario: Regenerate screenshots
- **WHEN** `pnpm screenshots` is run
- **THEN** `docs/screenshots/home-375.png`, `home-768.png`, `home-1440.png`, `detail-375.png`, `detail-768.png` and `detail-1440.png` are (re)written as full-page images
