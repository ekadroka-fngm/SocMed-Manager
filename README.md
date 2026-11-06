# SocMed-Manager

Multi-brand content planning and management workspace.

## Run locally

Requirements: Node.js 22 and npm.

```bash
npm install
npm run dev
```

The development command prepares the local D1 database, seeds two local test members, builds the frontend, then starts:
- Vite frontend: http://localhost:3000
- Cloudflare Worker API: http://127.0.0.1:8787

Local development authentication uses `owner@local.test` by default. Change `LOCAL_DEV_EMAIL` in `.dev.vars` to `editor@local.test` to test the Editor role.

## Cloudflare setup

See [Cloudflare setup guide](docs/CLOUDFLARE_SETUP.md) for:
- D1 creation and migrations
- Cloudflare Access configuration
- Remote workspace bootstrap
- Deployment

## Current implementation

The frontend is still progressively migrating from in-memory mock data to the Worker API. Initial Cloudflare foundation endpoints are:
- `GET /api/health`
- `GET /api/v1/me`
- `GET /api/v1/workspace`
- `GET /api/v1/brands`
- `POST /api/v1/brands`

The local identity bypass is development-only. Production API routes require a verified Cloudflare Access JWT and an active workspace membership.
