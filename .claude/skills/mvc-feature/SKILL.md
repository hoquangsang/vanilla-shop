---
name: mvc-feature
description: Add or change a stateful feature (cart, search, tabs with data...) using this repo's hand-written MVC. Use when a task creates or modifies anything under src/models, src/views or src/controllers.
---

# MVC feature recipe

Layering (enforced by `.claude/hooks/guard-mvc.mjs`):

| Layer | Knows | Never |
|---|---|---|
| `src/models/*` | state, rules, persistence via `src/core/storage.ts`, emits events | DOM, views, controllers |
| `src/views/*` | DOM: `render(data)`, `bindX(handler)` | models, controllers, business rules |
| `src/controllers/*` | one model + its views; translates view events → model calls, model events → `view.render` | DOM queries (ask the view) |
| `src/pages/*.ts` | composition root: `new Model()`, `new View(root)`, `new Controller(model, view)` | logic |

Shared types go in `src/types/`. Views import types from there.

Steps:
1. **Model + test first.** Write `tests/unit/models/<name>-model.test.ts` from the spec scenarios (one `it` per scenario, named after it), then the model. Models extend/compose `EventEmitter<{ change: State }>` from `src/core/event-emitter.ts`.
2. **View.** Constructor takes the root element(s) it owns; `render()` is idempotent; user text via `textContent`/`.value` only. A view may be unit-tested with happy-dom if it has logic worth testing.
3. **Controller + test.** Test with the real model and a fake view object (`{ render: vi.fn(), bindAdd: (h) => ... }`) so no DOM is needed.
4. **Wire** in `src/pages/<page>.ts`.
5. **E2E** for user-visible flows in `tests/e2e/<feature>.spec.ts` (Playwright; the config runs mobile + desktop projects).
6. `pnpm check` green, then use the `ship-change` skill.
