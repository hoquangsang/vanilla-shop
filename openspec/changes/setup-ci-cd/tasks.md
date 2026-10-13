# Tasks

## 1. Workflows

- [ ] 1.1 Write `.github/workflows/ci.yml` (`workflow_call` only) as in design.md; verify with `actionlint` (or `gh workflow view` after push) that it parses
- [ ] 1.2 Write `.github/workflows/deploy.yml` (PR → preview + sticky comment, main → production, `needs: ci`); verify a test PR shows the preview URL comment
- [ ] 1.3 Write `.github/workflows/claude-review.yml`; verify a test PR gets a review from Claude
- [ ] 1.4 Add `.github/dependabot.yml` (npm + github-actions, weekly, grouped minor/patch); verify it appears under Insights → Dependency graph → Dependabot

## 2. Vercel

- [ ] 2.1 Install the Vercel CLI, have the user run `vercel login`, `vercel link` the project `vanilla-shop`; verify `.vercel/project.json` exists (and is git-ignored)
- [ ] 2.2 Add `vercel.json` as in design.md; verify `vercel build` locally produces `.vercel/output`
- [ ] 2.3 Set secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `CLAUDE_CODE_OAUTH_TOKEN` with `gh secret set`; verify `gh secret list` shows all four

## 3. Repository settings

- [ ] 3.1 Configure squash-only merges, delete branch on merge, and branch protection or a ruleset on `main` requiring the CI check; verify a direct push to `main` is rejected
- [ ] 3.2 Grant the Claude GitHub App access to the repo for cloud sessions; verify a cloud session can clone and push a branch

## 4. Ship

- [ ] 4.1 Add CI + Vercel badges and the production URL to `README.md`; open PR `ci: setup-ci-cd - GitHub Actions + Vercel`, verify all checks pass and the preview deploy works, then merge and verify the production URL serves the site
