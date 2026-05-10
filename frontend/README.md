# Splatmaker Frontend

Minimal Next.js frontend with:
- shadcn/ui (Tailwind + Radix)
- react-three-fiber + drei (OrbitControls)
- SparkJS (`SparkRenderer`) for splat rendering
- RTK Query for Jobs API (`/v1/jobs`, `/v1/jobs/:jobId`)

## Local run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Jobs API integration

Frontend expects Jobs API base URL from env:

- `NEXT_PUBLIC_JOBS_API_BASE_URL` (example: `http://localhost:8787`)

If not set, frontend defaults to `http://localhost:8787`.

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
- `GET /healthz`
- `GET /v1/jobs`
- `GET /v1/jobs/:jobId`

Then run frontend (`npm run dev`) and open `http://localhost:3000/jobs`.

## Local splat files

For mock data, sample URLs point to:
- `http://localhost:3000/sample.sog`
- `http://localhost:3000/sample.ply`

Put files into `frontend/public/` if needed.
