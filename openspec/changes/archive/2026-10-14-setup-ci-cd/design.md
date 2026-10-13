# Design

## Context

After T1 the repo has `pnpm check` and `pnpm test:e2e`. The repo is on GitHub (`hoquangsang/vanilla-shop`). The user has `gh` authenticated locally, but no Vercel CLI yet.

## Goals / Non-Goals

**Goals:** one place (Actions) controls test → deploy; preview URL on every PR; production only from a green `main`.
**Non-Goals:** multiple environments beyond preview/production; Render (no backend exists).

## Decisions

### Deploy through Actions + Vercel CLI, not Vercel's Git integration
The Git integration needs no workflow at all, but it deploys even when tests fail and does not show the pipeline in the repo. With the CLI flow (`vercel pull` → `vercel build` → `vercel deploy --prebuilt`), deploy is a job that `needs: ci`, so a red build never ships. The Git integration is turned off in `vercel.json` to avoid double deploys.

### Workflows
- `ci.yml`: `on: workflow_call`, `concurrency` per ref with cancel-in-progress. Steps: checkout → `pnpm/action-setup` → `actions/setup-node` (node 24, cache pnpm) → `pnpm install --frozen-lockfile` → `pnpm check` → cache `~/.cache/ms-playwright` → `pnpm exec playwright install --with-deps chromium` → `pnpm test:e2e` → upload `playwright-report/` if failed. Exposed as a reusable workflow (`workflow_call`) so deploy can depend on it.
- `deploy.yml`: `on: pull_request` (preview) and `push: main` (production); job `ci` uses `./.github/workflows/ci.yml`; job `deploy` `needs: ci`, runs `npx vercel@latest pull --yes --environment=<preview|production>`, `vercel build [--prod]`, `vercel deploy --prebuilt [--prod]`, then for PRs posts or updates one comment with the URL (`marocchino/sticky-pull-request-comment`). Uses GitHub `environment: preview|production` so deployments show in the repo sidebar. Skips forks (no secrets).
- `claude-review.yml`: `on: pull_request: [opened, synchronize, ready_for_review]`, `anthropics/claude-code-action@v1` with `claude_code_oauth_token`, prompt: review the diff against `CLAUDE.md`, the MVC rules and the OpenSpec change folder named in the PR body; comment inline only on real problems; no style nits that Prettier covers.
- **Trigger layout:** `ci.yml` has only `workflow_call`, so `deploy.yml` is the single entry point for PRs and `main` and CI never runs twice. Branch protection requires the `ci / check` job of `deploy.yml`.

### vercel.json
```json
{ "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite", "buildCommand": "pnpm build", "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile", "cleanUrls": true,
  "git": { "deploymentEnabled": false },
  "headers": [{ "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }] }
```
No `cleanUrls`: with Vercel CLI 63 it maps `index.html` to `/index` and the site root returns 404. Pages are served at `/` and `/detail.html`, matching the links in the markup.

### Secrets and settings (done with CLI by the planning session)
- `npm i -g vercel` → user runs `vercel login` → `vercel link --yes --project vanilla-shop` → read `orgId`/`projectId` from `.vercel/project.json` → `gh secret set VERCEL_ORG_ID / VERCEL_PROJECT_ID`.
- `VERCEL_TOKEN`: the user creates it at vercel.com/account/tokens (scope: the account, expiry 90 days) and pastes it into `gh secret set VERCEL_TOKEN`. The token value never goes through the chat.
- `CLAUDE_CODE_OAUTH_TOKEN`: the user runs `claude setup-token` and pipes it into `gh secret set`. Alternatively, install the Claude GitHub App via `/install-github-app` in a terminal Claude session.
- Branch protection via `gh api -X PUT repos/hoquangsang/vanilla-shop/branches/main/protection` (required check from deploy/ci, 0 required approvals since it's a solo repo, linear history), and `gh repo edit --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --delete-branch-on-merge`.

## Risks / Trade-offs

- [Private repo + branch protection needs GitHub Pro] → if the API refuses, use a repository **ruleset** (available on free private repos) or make the repo public after submission.
- [Vercel token expiry] → 90 days is longer than the test; note the date in the README maintenance section.
- [Cloud session cannot push workflow files without the `workflow` permission] → workflows are owned by the planning session; cloud PRs never touch `.github/workflows/`.
