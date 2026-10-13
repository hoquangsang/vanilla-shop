# Design

## Subsetting tool

Use **`subset-font`** (npm, wraps HarfBuzz compiled to WASM, so no Python or native build). Add it as a dev dependency.

`scripts/subset-icons.ts` (run with `tsx`, which T9 already added):

1. Read `src/styles/icons.css`. Collect every codepoint from declarations of the form `--fa: "\f107";` (regex `/--fa:\s*"\\([0-9a-f]{4,5})"/gi`). Today there are 23.
2. For each of `fa-solid-900` and `fa-brands-400`: read `node_modules/@fortawesome/fontawesome-free/webfonts/<name>.woff2`, call `subsetFont(buffer, text, { targetFormat: "woff2" })`, where `text` is the string of all collected codepoints, and write the result to `src/assets/fonts/<name>.woff2`. Passing every codepoint to both fonts is fine, because each font simply skips glyphs it does not have.
3. Print each output file's size. Exit with code 1 if no codepoints were found.

`package.json`: `"icons": "tsx scripts/subset-icons.ts"`. Run it once and commit the two output files, so `pnpm build` does not depend on the script.

## CSS

In `src/styles/icons.css`, change only the two `src:` lines:

```css
src: url("../assets/fonts/fa-solid-900.woff2") format("woff2");
src: url("../assets/fonts/fa-brands-400.woff2") format("woff2");
```

Keep `font-display: block`. With fonts of about 2 kB it no longer matters, and `block` avoids showing the wrong glyph. Add one line to the header comment: "After adding an icon, run `pnpm icons` to rebuild the subset fonts."

## Guard test

`tests/unit/styles/icon-subset.test.ts` (Vitest, node environment, using `// @vitest-environment node` at the top):

- Parse the codepoints from `icons.css` with the same regex.
- For each codepoint, check that at least one of the two subset fonts contains it. To get each font's character set without adding a new font parser: in the test, run `subset-font` on the subset font with that single character and compare the glyph count, or use `fontkit` if `subset-font` already pulls it in. Pick the simplest option that works, and record the choice under Assumptions.
- Also assert that each subset file is below 20 kB.

## Lighthouse

`lighthouserc.json`: `categories:performance` → `["error", { "minScore": 0.9 }]`. Keep `numberOfRuns: 3`.

## Files

| File | Change |
|---|---|
| `scripts/subset-icons.ts` | new |
| `src/assets/fonts/fa-solid-900.woff2`, `fa-brands-400.woff2` | new (generated, committed) |
| `src/styles/icons.css` | 2 `src:` lines + comment |
| `tests/unit/styles/icon-subset.test.ts` | new |
| `package.json`, `pnpm-lock.yaml` | `icons` script, `subset-font` dev dependency |
| `lighthouserc.json` | perf `minScore` 0.9 |
