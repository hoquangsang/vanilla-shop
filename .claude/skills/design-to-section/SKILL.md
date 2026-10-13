---
name: design-to-section
description: Build one visual section (header, footer, hero, product band, etc.) of the vanilla-shop pages from docs/design. Use whenever a task says to implement or restyle a section of the Home or Detail page.
---

# Design → section

1. **Read the spec of the section** in `docs/design/README.md` (tokens, layout, mobile behaviour, copy) and look at the matching image in `docs/design/zoom/` with the Read tool. When text in the image is unreadable, use the copy from the README; when it is not there either, write plausible placeholder copy.
2. **Markup first, mobile first.** Write semantic HTML in the page (`index.html` / `detail.html`) or in `src/partials/` if shared. Add base classes for 375px, then `md:`/`lg:`/`xl:` for wider layouts. Use the `@theme` tokens (`bg-primary`, `text-accent`...), never raw hex.
3. **Images** come from `public/images/...` (see the Images table in the design README). Always set `width`/`height` (or an `aspect-*` class), `alt`, and `loading="lazy"` unless above the fold.
4. **Repeated pieces** (section title pill, primary button, product card) get one component class in `src/styles/main.css` via `@apply`, or are rendered from data by a view. Do not copy-paste the same 15 classes six times.
5. **Behaviour** (carousel, toggles, tabs) goes in a view in `src/views/`, created from `src/pages/<page>.ts`. If it changes app state, use the `mvc-feature` skill instead.
6. **Check it:** `pnpm dev`, then look at 375 / 768 / 1024 / 1440 (Playwright screenshot or browser devtools). Compare side by side with the design image. Then run the `responsive-reviewer` agent on the files you touched.
7. Note any deliberate difference from the design in the PR under **Assumptions**.
