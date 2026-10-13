# Proposal

## Why

Roadmap **T1**. Depends on: T0 (repo bootstrap, merged). Every other change needs a working toolchain, the two page shells, the design tokens and the shared carousel wrapper. Doing this once, first, lets T3–T6 run in parallel without each inventing its own setup.

## What Changes

- Vite multi-page project (`index.html`, `detail.html`) with TypeScript strict, Tailwind CSS v4, pnpm, Node 24.
- A tiny Vite plugin that inlines `<!-- @include partials/<name>.html -->` at dev and build time, so header/footer markup is written once.
- Placeholder `src/partials/header.html` and `src/partials/footer.html` (real content comes in T4).
- Design tokens from `docs/design/README.md` as Tailwind `@theme` variables, Roboto font, Font Awesome Free.
- Shared UI primitives used by later changes: `CarouselView` (Swiper wrapper) and component classes `.container-page`, `.section-title`, `.btn-primary`, `.btn-outline`.
- Quality tooling: ESLint (flat config) + Prettier (with Tailwind class sorting), Vitest + happy-dom, Playwright (3 viewport projects) with one smoke test, OpenSpec CLI as a devDependency.
- npm scripts listed in `CLAUDE.md` (`dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `test:e2e`, `check`, `openspec`).
- Empty source folders from `CLAUDE.md > Architecture`.

## Capabilities

### New Capabilities

None. This is tooling and scaffolding with no user-facing behaviour (`skip_specs: true`).

### Modified Capabilities

None.

## Out of scope

- CI workflows, Vercel, branch protection → T2 `setup-ci-cd` (planning session).
- Event emitter, storage, models → T3 `add-mvc-core`.
- Real header/footer → T4 `add-site-layout`.
- Any Home section content → T5, T6. Detail body → T8.

## Impact

- New files at repo root: `package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `playwright.config.ts`, `.gitignore`, `.nvmrc`, `.editorconfig`, `index.html`, `detail.html`.
- New: `build/html-partials.ts`, `src/**` skeleton, `tests/unit/`, `tests/e2e/smoke.spec.ts`.
- Dependencies: `swiper`, `@fortawesome/fontawesome-free`, `@fontsource/roboto`; dev: `vite`, `typescript`, `tailwindcss`, `@tailwindcss/vite`, `vitest`, `happy-dom`, `@playwright/test`, `eslint`, `@eslint/js`, `typescript-eslint`, `globals`, `eslint-config-prettier`, `prettier`, `prettier-plugin-tailwindcss`, `@fission-ai/openspec`.
