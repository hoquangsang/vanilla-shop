# quality-gates Specification

## Purpose
Makes "properly responsive and accessible" verifiable: both pages must pass automated layout, accessibility and performance checks at the screen sizes reviewers are likely to use.

## Requirements

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
A Lighthouse run (mobile preset) of the production build SHALL score at least 90 for Accessibility, Best Practices, SEO and Performance on both pages.

#### Scenario: Lighthouse CI
- **WHEN** `lhci autorun` runs against `dist/` for `index.html` and `detail.html`
- **THEN** all assertions in `lighthouserc.json` pass, including `categories:performance` with `minScore` 0.9

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

### Requirement: Icon fonts contain only used glyphs
The icon fonts served by the site SHALL be subsets of Font Awesome Free that contain the glyphs referenced in `src/styles/icons.css`, and each font file SHALL be smaller than 20 kB.

#### Scenario: Every used icon is in a subset font
- **WHEN** the codepoints in `src/styles/icons.css` are compared with the glyphs in `src/assets/fonts/fa-solid-900.woff2` and `fa-brands-400.woff2`
- **THEN** every codepoint is present in at least one of the two fonts

#### Scenario: Subset fonts are small
- **WHEN** the size of each file in `src/assets/fonts/` is measured
- **THEN** each one is under 20 kB

#### Scenario: Icons still render
- **WHEN** Home is loaded at 1440px
- **THEN** the header search, wishlist and cart icons, the top-bar social icons and the footer payment icons are visible with non-zero width (the existing layout e2e and a screenshot comparison with `docs/screenshots/home-1440.png` show no missing icons)
