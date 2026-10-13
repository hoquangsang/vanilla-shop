# vanilla-shop

Front-end intern test for XTech789: a responsive two-page shop (Home + Detail) built from a design, with a hand-written **MVC** layer.
Brief: `docs/design/brief.pdf`. Visual source of truth: `docs/design/README.md` + images in `docs/design/`.

## How work is split

- **Planning session (local):** writes OpenSpec changes, docs, CI/CD, GitHub/Vercel settings, assets. It does not write app code.
- **Coding session (cloud, you, most likely):** implements **one OpenSpec change per branch/PR**, exactly as specified.
- Work order and status: `openspec/ROADMAP.md`.

### Rules for the coding session
1. Start with `/opsx:apply <change-id>` (or read `openspec/changes/<change-id>/{proposal,design,tasks}.md` + `specs/**`). Implement `tasks.md` top to bottom and tick each box (`- [x]`) as you finish it.
2. **Do not stop to ask** about details the spec leaves open. Pick the simplest option that matches `docs/design/`, and list it under **Assumptions** in the PR description. Only stop if a spec contradicts itself or the brief.
3. Stay inside the change's scope. Spotted something for another change? Mention it in the PR under **Follow-ups**; don't fix it.
4. Don't edit `openspec/specs/**` or archive changes. The planning session archives after merge.
5. Before opening the PR, `pnpm check` must pass (and `pnpm test:e2e` once e2e exists).
6. Never edit `.github/workflows/**`, repo settings or secrets. Those belong to the planning session. If a change needs a CI tweak, describe it under **Follow-ups**.
7. OpenSpec CLI: `pnpm openspec …` after T1. Before `package.json` exists, use `npx -y @fission-ai/openspec@1.14.1 …`.
8. Read `openspec/ROADMAP.md > Shared contracts` before touching `index.html`, `detail.html`, partials or `src/pages/*`. Only edit the regions and modules your change owns.

## Stack

Vite (multi-page) · TypeScript strict · Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `@theme`) · Swiper (carousels) · Font Awesome Free · `@fontsource/roboto` · Vitest + happy-dom · Playwright · ESLint (flat config) + Prettier · pnpm · Node 24. **No framework, no backend.**

## Commands

```bash
pnpm install
pnpm dev          # Vite dev server
pnpm build        # typecheck + production build to dist/
pnpm preview      # serve dist/
pnpm lint         # eslint
pnpm format       # prettier --write
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run (unit)
pnpm test:e2e     # playwright test (builds + previews first)
pnpm check        # lint + typecheck + test + build, the pre-PR gate
pnpm openspec ... # OpenSpec CLI (devDependency)
```

## Architecture (MVC, enforced by a hook)

```
index.html, detail.html        page shells; shared markup via <!-- @include partials/header.html -->
src/
  partials/                    header.html, footer.html (inlined at build time by a small Vite plugin)
  types/                       shared data types (Product, CartItem...). Views import types from here, never from models/
  core/                        event-emitter.ts, storage.ts (safe localStorage), dom.ts helpers
  models/                      state + business rules. No DOM, no imports from views/controllers
  views/                       DOM only: render(state) + bind<Event>(handler). Never import models
  controllers/                 wire a model to views: subscribe to model events, call view.render, pass view events to model
  pages/home.ts, pages/detail.ts   entry points: instantiate models/views/controllers, nothing else
  data/products.json           product catalogue (bundled, so the build also works from file://)
  styles/main.css              @import "tailwindcss"; @theme tokens; a few component classes
tests/unit/                    vitest, mirrors src/ (models + controllers)
tests/e2e/                     playwright, at viewports 375 / 768 / 1440
public/images/                 placeholder photos (see CREDITS.md)
```

- Models emit change events (typed `EventEmitter`). Views know nothing about models. Controllers are the only place that knows both.
- Render user-provided text with `textContent` / `.value`, **never** `innerHTML`.
- Use Tailwind utilities in markup. Use `@apply` only for repeated component classes (`.section-title`, `.btn-primary`) in `main.css`.
- Mobile first: base classes target 375px, add `md:` / `lg:` / `xl:` upward. No horizontal scroll at any width ≥ 320px.
- Accessibility: real `<button>`/`<a>`, `alt` on images, `aria-label` on icon-only controls, visible focus styles.

## Conventions

- Files `kebab-case.ts`, classes `PascalCase`, one class per file.
- Branch: `feat/<change-id>` (or `chore/`, `ci/`, `docs/`).
- Commits: Conventional Commits (`feat(cart): ...`, `test(search): ...`), small and focused.
- **Never add `Co-Authored-By` (or any AI attribution trailer) to commits.** A hook blocks it.
- PR title `<type>: <change-id> - <summary>`; body uses `.github/pull_request_template.md`.

## Claude Code setup in this repo

- `.claude/hooks/`: `guard-mvc.mjs` (blocks MVC layer violations), `block-coauthor.mjs` (blocks AI trailers in commits), `format-on-edit.mjs` (prettier/eslint after edits).
- `.claude/agents/`: `responsive-reviewer`, `a11y-auditor`, `spec-verifier`. Run the relevant ones before opening a PR.
- `.claude/skills/`: `design-to-section`, `mvc-feature`, `ship-change`, plus OpenSpec skills (`openspec-*`, `/opsx:*`).
