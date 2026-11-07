# Vihaan X backend

The backend is the TypeScript API used by the Vihaan X event-day dashboards.
It is an ESM Node.js application built with Express 5, Mongoose, and Zod.

## Runtime and local development

- Node.js `>=22.12`
- npm, using the committed `backend/package-lock.json`
- MongoDB, normally started with [`backend/docker-compose.yml`](../backend/docker-compose.yml)
- The API process runs on the host with `npm run dev`; Docker is only used for MongoDB
- The default local port is `4000`
- Development data is stored in the `vihaanx-dev` MongoDB database

From the repository root:

```bash
docker compose -f backend/docker-compose.yml up -d
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
docker compose -f docker-compose.yml stop
```

Remove the container and its named data volume only when local data can be
discarded:

```bash
docker compose -f docker-compose.yml down -v
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
