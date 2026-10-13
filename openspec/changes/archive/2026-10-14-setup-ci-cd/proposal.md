# Proposal

## Why

Roadmap **T2**, owned by the **planning (local) session** because it needs secrets, repo settings and the Vercel account. Depends on T1 (`pnpm check` / `pnpm test:e2e` must exist). Every later PR should be checked automatically, get its own preview URL, and be reviewed by Claude, so reviewers see a working build for each change.

## What Changes

- `.github/workflows/ci.yml`: lint, typecheck, unit tests, build, Playwright e2e on every PR and every push to `main`; uploads the Playwright report on failure.
- `.github/workflows/deploy.yml`: deploys to **Vercel** through the Vercel CLI. Pull requests get a preview deployment whose URL is posted as a sticky PR comment. Pushes to `main` deploy to production after CI passes.
- `.github/workflows/claude-review.yml`: `anthropics/claude-code-action` reviews each PR against `CLAUDE.md` and the change's OpenSpec files.
- `vercel.json`: build settings and cache headers for hashed assets.
- Repository settings: branch protection on `main` (PR required, CI must pass, linear history, squash merge only, delete branch on merge).
- Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `CLAUDE_CODE_OAUTH_TOKEN`.
- README badges for CI and deployment.

## Capabilities

### New Capabilities

None. Delivery tooling only (`skip_specs: true`).

### Modified Capabilities

None.

## Out of scope

- Lighthouse CI → T9 `add-quality-gates`.
- Zipping the submission → later, after T9.

## Impact

- New: `.github/workflows/{ci,deploy,claude-review}.yml`, `vercel.json`, `.github/dependabot.yml` (weekly npm + actions, grouped).
- GitHub repo settings and secrets; a Vercel project `vanilla-shop` linked to the repo with Vercel's Git auto-deploy **disabled** (`"git": { "deploymentEnabled": false }`), so GitHub Actions is the only deployer.
