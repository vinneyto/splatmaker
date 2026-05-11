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

## Jobs API integration

Frontend uses same-origin API paths:

- `GET /api/v1/jobs`
- `GET /api/v1/jobs/:jobId`

In development, Next.js dev server proxies these routes to the local mock API (`http://localhost:8787`).

### Pages

- `/jobs` — list of jobs
- `/jobs/:jobId` — job details + Spark viewer
  - by default tries to load `.sog` from `output_files`
  - if `.sog` is missing, loads the first available file

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
