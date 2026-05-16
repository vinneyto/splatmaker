# Splatmaker Frontend

Minimal Next.js frontend with:

- shadcn/ui (Tailwind + Radix)
- react-three-fiber + drei (OrbitControls)
- SparkJS (`SparkRenderer`) for splat rendering
- RTK Query for Jobs API (`/api/v1/jobs`, `/api/v1/jobs/:jobId`)

## Local run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Dev mode with real API proxy

1. Create local env file from example:

```bash
cp .env.example .env.local
```

2. Set real API base URL in `.env.local`:

```env
FRONTEND_API_PROXY_BASE_URL=https://xxx.cloudfront.net
```

3. Start frontend in real-API proxy mode:

```bash
npm run dev:real-api
```

In this mode, Next.js rewrites:
- `/api/v1/*` -> `${FRONTEND_API_PROXY_BASE_URL}/api/v1/*`
- `/api/healthz` -> `${FRONTEND_API_PROXY_BASE_URL}/api/healthz`

## Jobs API integration

Frontend uses same-origin API paths:

- `GET /api/v1/jobs`
- `GET /api/v1/jobs/:jobId`

In development, Next.js dev server proxies these routes:
- to `http://localhost:8787` by default (local mock API)
- to `FRONTEND_API_PROXY_BASE_URL` when set in `.env.local`

### Pages

- `/jobs` — list of jobs
- `/job?jobId=<id>` — job details + Spark viewer
  - optional `fileName=<name>` query parameter to preselect file

## Mock API server (no deploy required)

Run mock API locally:

```bash
npm run mock:jobs-api
```

Mock server exposes:

- `GET /api/healthz`
- `GET /api/v1/jobs`
- `GET /api/v1/jobs/:jobId`

Then run frontend (`npm run dev`) and open `http://localhost:3000/jobs`.

## Local splat files

For mock data, sample URLs point to:

- `http://localhost:3000/sample.sog`
- `http://localhost:3000/sample.ply`

Put files into `frontend/public/` if needed.
