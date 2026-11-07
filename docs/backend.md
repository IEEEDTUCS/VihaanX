# Vihaan X backend

The backend is the TypeScript API used by the Vihaan X event-day dashboards.
It is an ESM Node.js application built with Express 5, Mongoose, and Zod.

## Runtime and local development

- Node.js `>=22.12`
- npm, using the committed `backend/package-lock.json`
- MongoDB, normally started with [`backend/docker-compose.dev.yml`](../backend/docker-compose.dev.yml)
- The API process runs on the host with `npm run dev`; Docker is only used for MongoDB
- The default local port is `4000`
- Development data is stored in the `vihaanx-dev` MongoDB database

From the repository root:

```bash
docker compose -f backend/docker-compose.dev.yml up -d
cd backend
npm ci
cp .env.example .env
npm run dev
```

The API is available at `http://localhost:4000/api/v1`. The database health
endpoint is `http://localhost:4000/api/v1/health`.

Useful commands from `backend/`:

```bash
npm run typecheck  # TypeScript validation
npm test           # Test suite
npm run build      # Production build
```

Stop MongoDB while keeping local data:

```bash
docker compose -f docker-compose.dev.yml stop
```

Remove the container and its named data volume only when local data can be
discarded:

```bash
docker compose -f docker-compose.dev.yml down -v
```

## Configuration

Copy `.env.example` to `.env`. The application validates its environment at
startup. `MONGODB_URI` should be `mongodb://127.0.0.1:27017` for the host-run
development server; the application selects the `vihaanx-dev` database itself.

The event timestamps must be valid ISO 8601 values with offsets and must be in
chronological order. `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` must each
be at least 32 characters and must differ. `GITHUB_TOKEN` and `CLOUDINARY_URL`
are required by the validator even when a particular feature is not being
used; use real team credentials when testing those integrations.

Never commit `.env` or real credentials.

## API organization

All routes are registered in `backend/src/routes/index.ts` below `/api/v1`:

- public health and event schedule: `/health`, `/schedule`
- authentication and participant self-service: `/auth`, `/me`
- team and room operations: `/me/team`, `/teams`, `/rooms`
- check-in cards and participants: `/cards`, `/participants`
- admin operations: `/admin/volunteers`, `/admin/participants`, `/admin/teams`, `/admin/stats`, `/admin/activity`

Business logic lives in `src/services`, request handling in `src/controllers`,
persistence in `src/models`, and input validation in `src/schemas`.
Authentication, authorization, rate limiting, uploads, and error handling are
implemented as Express middleware in `src/middlewares`.

## Important implementation notes

- MongoDB connection startup is required before the server begins listening.
- `NODE_ENV=development` selects `vihaanx-dev`; test and production select separate database names.
- CORS is an explicit allowlist. Set `CORS_ORIGINS` to comma-separated origins such as `http://localhost:3000`.
- Access tokens use the `Authorization` header; credentialed browser requests are not enabled.
- GitHub repository checks and Cloudinary image uploads are external integrations.
- The API includes event-window rules for the project and four checkpoint rounds; keep the schedule environment values consistent when changing submission behavior.

## Volunteer dashboard

The local dashboard is `/volunteer` on the Next.js frontend. Set `NEXT_PUBLIC_API_URL` at frontend build/development time to the API base including `/api/v1` (it defaults to `http://localhost:4000/api/v1`). Set the backend `CORS_ORIGINS` to the actual frontend origin. Camera scanning requires HTTPS or localhost and camera permission; manual card entry is also available. Staff tokens are held in page memory and signing out or reloading clears the page session.

Start MongoDB with `docker compose -f backend/docker-compose.dev.yml up -d`. The compose service initializes a single-node replica set, which is required for atomic card linking, allocation, card replacement and room moves. Production MongoDB must also support transactions. Existing standalone installations require migration to a replica set; validate and back up existing data before making that change.

Import the **shortlisted offline roster only** with the existing Unstop import script: the system currently has no independent shortlist status. The script generates an individual unique RSVP code and can export the codes for the team's separately managed invitation process. Generate printed card inventory using `src/scripts/generateCards.ts`. Do not publish code exports or log QR values.

A super admin configures rooms using the dashboard's Room inventory JSON editor or `PUT /api/v1/rooms/inventory`. Example:

```json
{
  "number": "AB4-104",
  "capacity": 56,
  "hardware": false,
  "small": true,
  "enabled": true,
  "slots": [
    { "label": "104-T1", "row": "C2", "enabled": true },
    { "label": "104-T2", "row": "C2", "enabled": true }
  ]
}
```

`capacity` is the physical people limit, not the number of table slots. Slot labels are unique within a room; a three- or four-person team needs two enabled slots in the same row. Provide the complete verified room inventory before check-in. Rooms already occupied cannot be edited through this endpoint. The current allocator follows the existing exclusive `hardware` room classification; configure it to reflect event policy. It prefers fewer than 15 teams in small rooms, then college proximity, while respecting physical capacity.

Scanning an available card and submitting a participant's RSVP code links the card, records arrival, and tries to allocate the full roster in one transaction. If no suitable room exists, the person is still checked in and the dashboard offers an allocation retry. If an old team already has a room but no table labels, it is flagged for manual migration rather than silently assigned new capacity. Super admins can move a team and edit its participant details; volunteers and super admins can replace cards with a recorded reason. Six meal rounds are tracked per person; only super admins may undo a meal record. Invitation delivery is handled separately by the organizing team.

The previous independent check-in/undo and team room-move endpoints are disabled: they can bypass the card and slot invariants. Do not use the older room seeding script to rewrite capacities after slot-based allocations have started. This feature needs a rehearsal with a replica-set database, real room layouts and representative concurrent check-ins before event use.
