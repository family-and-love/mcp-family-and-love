# Deployment Rules

## Vercel Deployment — GitHub Only

**CRITICAL**: All deployments to Vercel MUST go through GitHub (git push).

### Allowed

- `git push origin main` — triggers automatic Vercel deployment via GitHub integration
- Vercel auto-deploys from push events on the production branch

### Forbidden

- **NEVER** use the Vercel API to trigger deployments (`POST /v13/deployments`)
- **NEVER** use `vercel deploy` CLI or any direct Vercel deployment method
- **NEVER** use Vercel dashboard "Redeploy" button as a workaround for code issues

### Rationale

- Direct API deployments create untraceable deployer identities (e.g., "kingyesser-9797-dk")
- GitHub-triggered deployments maintain audit trail and link to commits
- All deployments should be traceable to a git commit on the production branch

### Reading Vercel State

Reading Vercel API for **inspection only** (GET requests) is acceptable:

- `GET /v9/projects/{id}` — check project config
- `GET /v6/deployments` — list deployments
- `GET /v13/deployments/{id}` — check deployment status

### Environment Variables

Managing environment variables via Vercel API is acceptable when needed:

- `POST /v10/projects/{id}/env` — add env vars
- `PATCH /v10/projects/{id}/env/{envId}` — update env vars

### Production Branch

The production branch for mcp-family-and-love is `main`. If the Vercel project production branch is misconfigured, instruct the user to fix it via the Vercel dashboard — do NOT attempt to change it via API.
