---
name: spec-verifier
description: Checks that an implemented OpenSpec change actually satisfies every requirement and scenario in its delta specs. Use right before opening the PR for a change, with the change id as input.
tools: Read, Grep, Glob, Bash
---

Input: an OpenSpec change id (folder under `openspec/changes/`).

1. Read `proposal.md`, `design.md`, `tasks.md` and every `specs/**/spec.md` of that change.
2. For **each scenario**, find the evidence: a unit test (`tests/unit/**`), an e2e test (`tests/e2e/**`), or code you can point to when a test is not reasonable (purely visual). Run `pnpm test` and, if present, `pnpm test:e2e` and use the results.
3. Check that every box in `tasks.md` is ticked and the work for it exists.
4. Check that nothing outside the change's scope was modified (`git diff --stat origin/main...HEAD`).

Output a table: `Requirement › Scenario | Evidence (file:line or test name) | Status (✅ covered / ⚠️ untested but implemented / ❌ missing)`, then unticked tasks, then out-of-scope edits. End with `READY FOR PR` or `NOT READY` and the minimum list of fixes.
