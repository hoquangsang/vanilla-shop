# Design

## Context

The repo contains only docs, `.claude/`, `openspec/` and `public/images/`. There is no `package.json` yet. Conventions (folders, scripts, naming) are fixed in `CLAUDE.md`; page regions and `data-*` hooks are fixed in `openspec/ROADMAP.md > Shared contracts`.

## Goals / Non-Goals

**Goals:**
- `pnpm install && pnpm check && pnpm test:e2e` pass on a clean clone.
- Both pages load in dev and in `dist/` with the shared partials inlined.
- The build uses relative asset URLs (`base: './'`) so `dist/` can later be zipped and served from any sub-path.

**Non-Goals:**
- Opening `dist/index.html` straight from disk (`file://`). That is handled at submission time.
- Visual fidelity: pages only show placeholder header/footer text.

## Decisions

### Package manager and versions
pnpm (pin with `"packageManager": "pnpm@<latest 10.x or newer>"` via `corepack use pnpm@latest`), `"engines": { "node": ">=24" }`, `.nvmrc` = `24`. Install the **latest stable** versions of every dependency; do not pin to versions from memory. `"type": "module"`.

### Multi-page Vite
`vite.config.ts`:
```ts
export default defineConfig({
  base: "./",
  plugins: [htmlPartials({ root: "src/partials" }), tailwindcss()],
  build: { rollupOptions: { input: { index: "index.html", detail: "detail.html" } } },
  test: { environment: "happy-dom", include: ["tests/unit/**/*.test.ts"], passWithNoTests: true },
});
```
(Use `/// <reference types="vitest/config" />` or `defineConfig` from `vitest/config` so `test` type-checks.)

### HTML partials plugin (`build/html-partials.ts`)
Alternatives: `vite-plugin-handlebars` (extra dependency, unmaintained risk), rendering header/footer from JS (bad for no-JS, SEO, layout shift). Chosen: ~20 lines of our own `Plugin` with `transformIndexHtml` that replaces `<!-- @include partials/<file>.html -->` with the file content from `src/partials/<file>.html`. Throw a clear error if the file is missing. Add the partial files to `server.watcher` (or call `server.ws.send({ type: "full-reload" })` in `handleHotUpdate` for `*.html` under `src/partials`) so edits reload in dev. Unit test it in `tests/unit/build/html-partials.test.ts` (call the transform function directly).

### Page shells
`index.html` and `detail.html` follow `openspec/ROADMAP.md > Page regions` exactly: `<html lang="en">`, viewport meta, `<title>` (`Home | Vanilla Shop`, `Detail | Vanilla Shop`), meta description, `<body data-page="home|detail" class="bg-white text-ink font-sans antialiased">`, header include, `<main id="main">` with the empty region comments, footer include, and `<script type="module" src="/src/pages/home.ts">` (resp. `detail.ts`). Add a "Skip to content" link as the first focusable element.

Placeholder partials: `header.html` → `<header class="border-b p-4">Header (T4)</header>`, `footer.html` → `<footer class="bg-primary p-4 text-white">Footer (T4)</footer>`.

### Styles (`src/styles/main.css`)
```css
@import "tailwindcss";
@theme {
  --font-sans: "Roboto", system-ui, sans-serif;
  --color-primary: #551760;  /* …all tokens from docs/design/README.md > Design tokens */
}
@layer components {
  .container-page { @apply mx-auto w-full max-w-[1320px] px-4 lg:px-6; }
  .section-title { … }  /* purple pill, white bold text, soft line left+right of text via ::before/::after */
  .btn-primary  { … }   /* bg-primary text-white, hover:bg-primary-dark, focus-visible ring */
  .btn-outline  { … }   /* border, transparent bg, hover: bg-primary text-white */
}
```
`src/pages/home.ts` and `detail.ts` import, in this order: `@fontsource/roboto/400.css`, `500.css`, `700.css`, `@fortawesome/fontawesome-free/css/all.min.css`, `../styles/main.css`. To check the tokens render, the placeholder footer uses `bg-primary`.

### CarouselView (`src/views/carousel-view.ts`)
Thin wrapper so pages never import Swiper directly:
```ts
export interface CarouselOptions { slidesPerView?: number; spaceBetween?: number; loop?: boolean;
  autoplayMs?: number; breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>;
  pagination?: "bullets" | "bar";   // default "bullets"; "bar" = short dark bar for the active slide (product + news carousels)
  watchSlidesProgress?: boolean;      // adds .swiper-slide-visible, used by e2e tests
  rewind?: boolean; }
export class CarouselView { constructor(root: HTMLElement, options?: CarouselOptions); update(): void; destroy(): void; }
```
- Uses `swiper` core + modules `Navigation`, `Pagination`, `Autoplay`, `A11y`, `Keyboard`; imports `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination`.
- Looks up, inside `root`: `.swiper` (container), `[data-carousel-prev]`, `[data-carousel-next]`, `[data-carousel-pagination]` (each optional).
- Autoplay only when `autoplayMs` is set; `pauseOnMouseEnter: true`; disabled when `matchMedia("(prefers-reduced-motion: reduce)").matches`.
- `a11y` module on with default messages.
- `update()` calls `swiper.update()`; needed when a carousel becomes visible after being inside a `hidden` tab panel (T5).
- `pagination: "bar"` adds class `carousel-bar-pagination` to the pagination element; style it in `main.css` (inactive bullets 8×4px light grey, active 24×4px `--color-ink`, no radius) to match the bar under the product and news carousels in `docs/design/zoom/home-part-2.png`.
- Expected markup (document it in a JSDoc block on the class):
```html
<div data-carousel>
  <div class="swiper"><div class="swiper-wrapper"><div class="swiper-slide">…</div></div></div>
  <button data-carousel-prev aria-label="Previous slide">…</button>
  <button data-carousel-next aria-label="Next slide">…</button>
  <div data-carousel-pagination></div>
</div>
```
`src/pages/*.ts` will later do `document.querySelectorAll<HTMLElement>("[data-carousel]")` themselves, passing per-carousel options. T1 does not mount any carousel.

### Lint / format
- `eslint.config.js`: `@eslint/js` recommended + `typescript-eslint` recommended-type-checked (with `parserOptions.projectService: true`) + `eslint-config-prettier`; globals browser + node for config files; apply `tseslint.configs.disableTypeChecked` to `**/*.{js,mjs}`; ignore `dist`, `playwright-report`, `test-results`, `.claude`, `openspec`.
- `.prettierrc.json`: `{ "printWidth": 100, "plugins": ["prettier-plugin-tailwindcss"], "tailwindStylesheet": "./src/styles/main.css" }`.
- Folder rule: `tsconfig.json` with `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `moduleResolution: "bundler"`, `resolveJsonModule`, `verbatimModuleSyntax`, `types: ["vite/client"]`, `include: ["src", "tests", "build", "*.ts"]`.

### Tests
- Vitest: only `tests/unit/build/html-partials.test.ts` for now.
- `playwright.config.ts`: `testDir: "tests/e2e"`, `webServer: { command: "pnpm build && pnpm preview --port 4173 --strictPort", url: "http://localhost:4173", reuseExistingServer: !process.env.CI }`, `use.baseURL: "http://localhost:4173"`, projects (Chromium only):
  - `mobile`: `devices["Pixel 7"]` (412 wide, touch). Then override `viewport: { width: 375, height: 812 }`.
  - `tablet`: `viewport: { width: 768, height: 1024 }`.
  - `desktop`: `viewport: { width: 1440, height: 900 }`.
  - `reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list"`.
- `tests/e2e/smoke.spec.ts`: Home and Detail return 200, have the right `<title>`, contain the partial-inlined header and footer, and log no console errors.

### Scripts (`package.json`)
```json
"dev": "vite", "build": "tsc --noEmit && vite build", "preview": "vite preview",
"lint": "eslint .", "format": "prettier --write .", "typecheck": "tsc --noEmit",
"test": "vitest run", "test:e2e": "playwright test",
"check": "pnpm lint && pnpm typecheck && pnpm test && vite build",
"openspec": "openspec"
```

## Risks / Trade-offs

- [Tailwind v4 + Prettier plugin config differs from v3 docs] → follow the v4 docs (`@tailwindcss/vite`, no `tailwind.config.js`, `tailwindStylesheet` option).
- [Playwright browsers not installed in the cloud sandbox] → `pnpm exec playwright install --with-deps chromium`. If the sandbox cannot install them, still commit the config + test and say so in the PR; CI (T2) runs them.
- [Partial plugin and Vite HMR] → full reload on partial change is enough.
