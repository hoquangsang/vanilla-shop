## MODIFIED Requirements

### Requirement: Lighthouse budgets
A Lighthouse run (mobile preset) of the production build SHALL score at least 90 for Accessibility, Best Practices, SEO and Performance on both pages.

#### Scenario: Lighthouse CI
- **WHEN** `lhci autorun` runs against `dist/` for `index.html` and `detail.html`
- **THEN** all assertions in `lighthouserc.json` pass, including `categories:performance` with `minScore` 0.9

## ADDED Requirements

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
