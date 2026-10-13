# Design

## Context

After T1: `index.html`/`detail.html` include `src/partials/header.html` and `footer.html` (placeholders), Tailwind tokens and `.container-page` exist, Font Awesome is loaded. Contracts (data attributes, `data-page`) are in `openspec/ROADMAP.md`. Visual spec: `docs/design/README.md > Shared shell`.

## Goals / Non-Goals

**Goals:** pixel-close shell at 1440, clean stacking at 375/768/1024, keyboard-accessible menus, works (minus menus) without JS.
**Non-Goals:** mega-menu, sticky header, real Login/Register pages.

## Decisions

### Markup skeleton (header.html)
```html
<header>
  <div class="bg-primary text-white text-sm"> <!-- top bar -->
    <div class="container-page flex h-9 items-center justify-center md:justify-between">
      <nav aria-label="Help" class="hidden md:block">FAQs | Help | Support</nav>
      <ul aria-label="Social media">… 5 × <a aria-label="Facebook"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i></a></ul>
    </div>
  </div>
  <div class="container-page grid … py-4"> <!-- search row: [logo (mobile only)] [search form] [wishlist][cart] -->
    <form data-search-form role="search" action="detail.html" method="get">
      <label for="site-search" class="sr-only">Search products</label>
      <input id="site-search" data-search-input name="q" type="search" maxlength="200" placeholder="Search for products" autocomplete="off">
      <button type="submit" aria-label="Search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></button>
    </form>
    <a href="#" aria-label="Wishlist, 0 items" …><i class="fa-solid fa-heart"></i><span data-wishlist-count>0</span></a>
    <a href="#" data-cart-link aria-label="Cart, 0 items" …><i class="fa-solid fa-cart-shopping"></i><span data-cart-count>0</span></a>
  </div>
  <div class="container-page relative flex …"> <!-- nav row -->
    <div class="relative lg:w-1/4"> <!-- categories column -->
      <button data-categories-toggle aria-expanded="false" aria-controls="categories-menu" class="bg-primary …">Categories <i class="fa-solid fa-angle-down"></i></button>
      <ul id="categories-menu" data-categories-menu hidden class="absolute inset-x-0 top-full z-30 bg-white …">…</ul>
    </div>
    <nav aria-label="Main" class="lg:w-3/4 …">
      <button data-nav-toggle aria-expanded="false" aria-controls="main-nav" class="lg:hidden" aria-label="Menu">☰</button>
      <div id="main-nav" data-nav-menu class="hidden lg:flex …"> Home / Shop / Shop Detail / Pages ▾ / Contact … Login / Register </div>
    </nav>
  </div>
</header>
```
Exact copy, items and icons: `docs/design/README.md`. Use `hidden` attribute (not only a class) for closed menus so they are removed from the accessibility tree; on `lg` the main nav is shown with `lg:flex` and the view keeps `hidden` off there (see below).

### Footer
`<footer class="bg-primary text-white">` → `.container-page grid gap-8 py-12 md:grid-cols-[2fr_1fr_1fr]`; bottom bar `bg-primary-dark border-t border-white/20` with `flex flex-col gap-4 md:flex-row md:justify-between`. Payment icons: Font Awesome `fa-cc-visa`, `fa-cc-mastercard`, `fa-cc-paypal`, `fa-cc-amex`, `fa-cc-discover` (stand-in for Visa Electron), `fa-cc-diners-club` (stand-in for Maestro), each with `role="img" aria-label="…"`. Note the stand-ins under PR Assumptions.

### Views (no models; this is pure UI state)
- `DisclosureView` base (`src/views/disclosure-view.ts`): given a toggle button + panel, handles `aria-expanded`, `hidden`, Escape (focus back to button), optional outside-click close. `NavMenuView`, `CategoriesMenuView` and `DropdownView` compose it.
- `CategoriesMenuView(toggle, menu, { pinnedOpen: () => boolean })`: `pinnedOpen = body.dataset.page === "home" && matchMedia("(min-width: 1024px)").matches`. When pinned: open, no outside-click/Escape close, toggle still works. Re-evaluate on the media query `change` event.
- `NavMenuView`: below lg toggles `#main-nav`; on `lg` media match it removes `hidden` and resets `aria-expanded="false"`.
- `DropdownView`: used for "Pages ▾" and "Dresses ▾"; opens on click (not hover-only), closes on outside click/Escape.
- `ActiveNavView(document)`: finds `[data-nav="<body data-page>"]` and sets `aria-current="page"`; styling via `aria-[current=page]:text-link-active`.
- Wire everything in a shared `src/pages/shell.ts` (`initShell()`), called from `home.ts` and `detail.ts`, so the two pages cannot drift.

### Tests
- Unit (happy-dom): `DisclosureView` toggling, Escape, outside click; `CategoriesMenuView` pinned vs not; `ActiveNavView`.
- E2E `tests/e2e/layout.spec.ts`: scenarios from the spec. Use `page.setViewportSize` inside tests for the 375/1440 cases where a project's default viewport differs, or `test.skip` by project name. JS-disabled native submit: `test.use({ javaScriptEnabled: false })`.

## Risks / Trade-offs

- [Categories menu overlaying the hero on Home] → relies on T5 reserving the left column (`data-hero-slot`, `lg:w-1/4`). Until T5 merges, the open list overlays page content; acceptable.
- [`hidden` attribute vs Tailwind `lg:flex`] → `hidden` has `display:none` with low specificity in Tailwind v4 preflight; verify `lg:flex` wins or let the view remove `hidden` at `lg` (preferred, deterministic).
