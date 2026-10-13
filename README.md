# vanilla-shop

Responsive two-page shop (Home + Detail) built for the **XTech789 front-end intern test**: Vite, TypeScript, Tailwind CSS v4 and a hand-written **MVC** layer, with no framework and no backend.

> 🚧 Work in progress. See [`openspec/ROADMAP.md`](openspec/ROADMAP.md) for the plan and status.

## What the brief asks for

- [ ] Home page built from the design, responsive on every device
- [ ] "Add to cart" increments the cart icon count on every click
- [ ] Detail page with the Home header/footer and a textarea
- [ ] MVC: text typed in the search box is shown on the Detail page

## How this repo is organised

| Path | What |
|---|---|
| [`docs/design/`](docs/design/README.md) | Design exports + written design spec (tokens, sections, responsive rules) |
| [`openspec/`](openspec/) | Spec-driven plan: one change per feature (proposal → specs → design → tasks) |
| [`CLAUDE.md`](CLAUDE.md) | Conventions for Claude Code sessions working on this repo |
| [`.claude/`](.claude/) | Claude Code hooks (MVC guard, commit guard, auto-format), review agents and skills |

Full README (live demo, screenshots, architecture, CI/CD, AI workflow) lands with the last roadmap task.
