# SocMed-Manager

Multi-brand content planning and management workspace.

## Run locally

Requirements: Node.js 22 and npm.

```bash
npm ci
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
- GPT Worker secret
- Remote workspace bootstrap
- Deployment

## Implemented foundation

- Authenticated workspace identity and role are loaded from Cloudflare Access.
- Brands, campaigns, content briefs, ideas, competitor observations, social integration placeholders, and local publishing jobs are stored in a versioned workspace state record in D1.
- Workspace writes use optimistic revision checks to detect concurrent edits.
- Audit events are stored separately in D1 and exposed as an append-only application feed.
- Workspace settings and notification preferences are persisted to D1.
- AI Assistant requests are sent from the Worker to the OpenAI Responses API; the API key never goes to the browser.
- Desktop workspace search navigates to matching brands, campaigns, ideas, and content briefs.
- Mobile analytics export uses current workspace content records.

## Current integration limits

- Social OAuth and official platform API connections are not configured. Integration UI must not be treated as proof that an account is connected.
- Publishing jobs are stored locally in D1, but a social publishing worker is not connected. A queued job is not a published post.
- Analytics currently reports content/workflow records. Reach, impressions, engagement and follower-growth metrics require official platform APIs.
- Competitor monitoring is based on manual observations; automatic scraping and private competitor metrics are not implemented.
- Brand logo previews are local browser previews; permanent Cloudflare R2 upload is not enabled.
- GPT Assistant requires the `OPENAI_API_KEY` Worker secret. `OPENAI_MODEL` is optional and defaults to `gpt-6-luna`.

The local identity bypass is development-only. Production API routes require a verified Cloudflare Access JWT and an active workspace membership.
