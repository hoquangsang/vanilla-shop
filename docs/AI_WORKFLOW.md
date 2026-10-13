# How this was built with Claude Code

This project was built by two kinds of Claude Code sessions, coordinated by one human. The human chose the stack, the scope and the rules, and approved the plan. Claude planned the work, wrote the code, reviewed it, and shipped it through CI.

## 1. Roles

| Who                                              | Where                                                                                             | Did                                                                                                                                                                                                                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Human** (repo owner)                           | chat with the planning session                                                                    | Chose the stack (vanilla TS + Tailwind, no framework), the deploy target (Vercel), and the task split. Answered open questions (Swiper for carousels, `localStorage` for the cart, placeholder photos). Set the secrets. Approved the plan before any code was written. |
| **Planning session** (Claude Code, local)        | this machine, `gh` + Vercel CLI                                                                   | Wrote the design spec, the OpenSpec changes and the roadmap. Set up CI/CD, the repo rules and the Vercel project. Started cloud sessions one at a time, reviewed and merged their PRs, and wrote this document. It wrote **no app code**.                               |
| **Coding sessions** (Claude Code, cloud)         | one fresh sandbox per change, started by a [routine](https://docs.claude.com/en/docs/claude-code) | Implemented exactly one OpenSpec change each, ran tests and review agents, and opened a PR. Then fixed the automated review's findings.                                                                                                                                 |
| **Review bot** (`anthropics/claude-code-action`) | GitHub Actions on every PR                                                                        | Reviewed each diff against `CLAUDE.md` and the change's specs: MVC layering, XSS, responsive rules, scope.                                                                                                                                                              |

## 2. Spec-driven flow (OpenSpec)

All work was planned up front as [OpenSpec](https://github.com/Fission-AI/OpenSpec) changes before any code existed. Each change has a `proposal.md` (why, what, out of scope), `specs/**/spec.md` (requirements with testable scenarios), `design.md` (files, classes, decisions) and `tasks.md` (checkboxes ending in verification and a ship step). All of them pass `openspec validate --strict`.

The roadmap ran **sequentially**: one cloud session at a time, and the next started only after the previous PR merged.

| #   | Change                                      | Kind          | PR                                                                                                                     |
| --- | ------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| T0  | bootstrap: design docs, specs, Claude setup | local         | `e60d320`                                                                                                              |
| T1  | `setup-project-scaffold`                    | cloud         | [#1](https://github.com/hoquangsang/vanilla-shop/pull/1)                                                               |
| T2  | `setup-ci-cd`                               | local         | [#3](https://github.com/hoquangsang/vanilla-shop/pull/3), fix [#4](https://github.com/hoquangsang/vanilla-shop/pull/4) |
| T3  | `add-mvc-core`                              | cloud         | [#5](https://github.com/hoquangsang/vanilla-shop/pull/5)                                                               |
| T4  | `add-site-layout`                           | cloud         | [#6](https://github.com/hoquangsang/vanilla-shop/pull/6)                                                               |
| T5  | `add-home-showcase`                         | cloud         | [#7](https://github.com/hoquangsang/vanilla-shop/pull/7)                                                               |
| T7  | `add-cart-flow`                             | cloud         | [#8](https://github.com/hoquangsang/vanilla-shop/pull/8)                                                               |
| T8  | `add-search-to-detail`                      | cloud         | [#9](https://github.com/hoquangsang/vanilla-shop/pull/9)                                                               |
| T6  | `add-home-brand-content`                    | cloud         | [#10](https://github.com/hoquangsang/vanilla-shop/pull/10)                                                             |
| T9  | `add-quality-gates`                         | cloud + local | see roadmap                                                                                                            |

After merge, every change was archived into [`openspec/specs/`](../openspec/specs/), which now describes the whole system. The archived change folders are in [`openspec/changes/archive/`](../openspec/changes/archive/).

### What made the specs work for an unattended session

- **Shared contracts** in [`openspec/ROADMAP.md`](../openspec/ROADMAP.md): page regions, `data-*` hooks, and which change owns which file. Changes touched only their own regions, so they never conflicted.
- **"Don't ask, decide and record"**: open details were decided by the coding session and listed under _Assumptions_ in the PR, where the planning session could check them.
- **Design as text**: [`docs/design/README.md`](design/README.md) spells out the tokens, the sections and the image table, with zoomed design crops next to it, because the original Figma file needed a login.

## 3. Claude Code features used

### Hooks ([`.claude/hooks/`](../.claude/hooks/), wired in [`.claude/settings.json`](../.claude/settings.json))

| Hook                 | When                    | What it enforces                                                                                                                                                                         |
| -------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `guard-mvc.mjs`      | before every Write/Edit | Views may not import models or controllers. Models may not import views or controllers, or touch the DOM (`document`, `querySelector`, `innerHTML`). The edit is rejected with a reason. |
| `block-coauthor.mjs` | before every Bash call  | Rejects `git commit` messages that contain `Co-Authored-By` or "Generated with Claude", a rule set by the repo owner.                                                                    |
| `format-on-edit.mjs` | after every Write/Edit  | Runs Prettier (with the Tailwind class sorter) and ESLint `--fix` on the edited file.                                                                                                    |

The cloud run logs show these hooks firing on every edit and commit. For example, one page of the T5 run log (#7) alone shows 15 hook runs.

### Agents ([`.claude/agents/`](../.claude/agents/))

Each coding session ran these before opening its PR, as `tasks.md` asked:

- **`responsive-reviewer`**: checks mobile-first classes, overflow at 320px and touch-target sizes. On #7 it caught 36–40px carousel arrows and 10px text, which were fixed to 44px and 12px before the PR opened.
- **`a11y-auditor`**: checks landmarks, labels, contrast and the ARIA patterns. On #7 it led to unique "Shop now" labels, focusable tab panels and darker small text.
- **`spec-verifier`**: maps every spec scenario to a test and reports `READY FOR PR` or the gaps.

### Skills ([`.claude/skills/`](../.claude/skills/))

- `design-to-section`: build one page section from the design docs.
- `mvc-feature`: add a stateful feature with the model → view → controller split.
- `ship-change`: final checks, commit, PR with the template.
- OpenSpec skills (`openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, ...) and the `/opsx:*` commands.

### Routines (cloud sessions)

One routine, "vanilla-shop: implement change", was re-armed for each change with a change-specific prompt. The planning session then:

1. checked that no branch or PR for that change already existed;
2. waited in the background for the PR;
3. checked it out locally and ran `pnpm check` and `pnpm test:e2e`, then took screenshots and compared them with the design;
4. pushed a one-line ROADMAP status commit to the PR branch;
5. waited for CI, the Vercel preview and the Claude review to pass on a stable head, and for the cloud session to go idle;
6. squash-merged, then re-armed the routine for the next change.

## 4. CI/CD

- **`ci.yml`**: lint, typecheck, unit tests, build, and Playwright e2e at 375, 768 and 1440px.
- **`deploy.yml`**: each PR gets a Vercel preview and a sticky comment with its URL. `main` deploys to production after CI passes. Vercel's own Git deploys are off, so GitHub Actions is the only deployer.
- **`claude-review.yml`**: Claude reviews every PR.
- **`lighthouse.yml`**: Lighthouse budgets on both pages.
- **`main` is protected**: changes go in only through a PR with `ci / check` passing. History is linear, merges are squash-only, and force-push is blocked.

## 5. Human decisions vs AI decisions

**Human:** vanilla TS instead of React or Next. Tailwind, picked because it is current and AI-friendly. Big tasks rather than a day-by-day plan. Cloud sessions run one at a time. No AI attribution in commits. Vercel. Swiper. `localStorage`. Placeholder photos are fine.

**AI (and reviewed):**

- The MVC shape: a typed `EventEmitter`, views that only touch the DOM, and controllers as the only layer that knows both sides.
- The task split and its shared contracts.
- HTML partials through a small Vite plugin.
- The test strategy.
- Every _Assumption_ listed in the PRs.

## 6. Problems hit and how they were handled

- **Duplicate first run.** T1 was started both by hand and by the routine, which produced #1 and #2. #1 was kept and #2 closed. Since then the planning session checks for an existing branch or PR before every run.
- **Production 404 on `/`.** `cleanUrls` in `vercel.json` mapped `index.html` to `/index`. Fixed in #4, and the spec was updated to match.
- **Prototype-pollution bug.** The Claude review on #5 found that product ids such as `__proto__` or `constructor` could corrupt the cart. The coding session switched to `Object.create(null)` and added tests before merge.
- **Swiper side effects.** Swiper's active bullet sets `aria-current`, which broke the T4 nav test. The test was scoped to the header in #7. Swiper also clones slides in loop mode, so "Add to cart" uses one delegated listener instead of one per button (#8).
- **Attribution footers.** The cloud tool appends a "Generated by Claude Code" link to PR bodies. The planning session removed it on every PR, to keep the no-attribution rule.

## 7. Lessons

- Up-front specs with explicit **ownership** and **contracts** let an unattended session finish a change with almost no back-and-forth. Across the coding sessions, no PR needed a question answered.
- A **second reviewer** (the review bot plus a local check-out and screenshots) catches what the author misses, especially when the author is also an AI.
- Hooks are better than instructions for hard rules. A rule that is enforced cannot be forgotten.
