---
name: ship-change
description: Finish an OpenSpec change, verify, commit and open the PR. Use when the implementation of a change is done and it is time to open (or update) its pull request.
---

# Ship a change

1. **Tasks:** every box in `openspec/changes/<id>/tasks.md` is `- [x]`. If one cannot be done, leave it unticked and explain why in the PR.
2. **Verify:** `pnpm check` (and `pnpm test:e2e` if the change has e2e). Paste the summary lines into the PR. Do not claim green without running it.
3. **Review agents:** run `spec-verifier` with the change id. If you touched UI, also run `responsive-reviewer` and `a11y-auditor`. Fix blockers before opening the PR.
4. **Commit:** Conventional Commits, small logical commits (e.g. `feat(cart): add CartModel with persistence`, `test(cart): cover corrupted storage`). **No `Co-Authored-By` or "Generated with" trailers.** The `block-coauthor` hook rejects them.
5. **Branch / PR:** branch `feat/<id>` (or `ci/`, `chore/`, `docs/`), push, then
   `gh pr create --base main --title "<type>: <id> - <summary>" --body-file <file>`, using `.github/pull_request_template.md` as the body: Summary, Spec coverage (paste the spec-verifier table), Assumptions, Screenshots (UI changes: 375 + 1440), Follow-ups, Checks.
6. Do **not** archive the OpenSpec change or merge the PR. The planning session does that.
