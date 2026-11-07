# Vihaan X

Vihaan X is the event platform and dashboard application for the hackathon.
The repository contains the public frontend and the dashboard API backend.

## Backend development setup

The backend runs locally with Node.js, while MongoDB runs in Docker. This keeps
the development loop simple: start one database container, then use the normal
Node watch command while working on API features.

### Prerequisites

- Docker Desktop (or Docker Engine with the Compose plugin)
- Node.js `22.12` or newer
- npm

### First-time setup

Run these commands from the repository root:

```bash
docker compose -f backend/docker-compose.yml up -d
cd backend
npm ci
cp .env.example .env
```

Open `backend/.env` and set the integration credentials. For local-only work,
the sample values are sufficient for the required non-integration settings;
use real GitHub and Cloudinary credentials when testing those features.

Start the API:

```bash
npm run dev
```

The API will be available at `http://localhost:4000/api/v1`. Check that both
the server and MongoDB are connected at:

```text
http://localhost:4000/api/v1/health
```

The development database is named `vihaanx-dev`. MongoDB data is persisted in
the Docker volume `vihaanx-mongodb-data`, so restarting the container does not
erase local records.

### Daily workflow

From the repository root, start or stop MongoDB with:

```bash
docker compose -f backend/docker-compose.yml up -d
docker compose -f backend/docker-compose.yml stop
```

Run `npm run dev` from `backend/` in a separate terminal. To see database
status or logs:

```bash
docker compose -f backend/docker-compose.yml ps
docker compose -f backend/docker-compose.yml logs -f mongodb
```

To remove the local database and start fresh, run this only when the data is
disposable:

```bash
docker compose -f backend/docker-compose.yml down -v
```

### Backend checks

From `backend/`:

```bash
npm run typecheck
npm test
npm run build
```

More backend architecture and API notes are in [`docs/backend.md`](docs/backend.md).

## Frontend development

The frontend has its own package and development workflow. See
[`frontend/README.md`](frontend/README.md).
