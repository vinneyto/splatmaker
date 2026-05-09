# Splatmaker Frontend (minimal viewer)

Minimal Next.js frontend with:
- shadcn/ui (Tailwind + Radix)
- react-three-fiber + drei (OrbitControls)
- SparkJS (`SparkRenderer`) for splat rendering

## Local run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## How to load a local file

1. Put your file into `frontend/public/` (for example `sample.sog` or `sample.ply`).
2. In the UI, enter the filename and click **Load**.

The app resolves it as `/<filename>` from Next.js public assets.

## Architecture rule used

- Non-React three.js definitions live in `three-core/`
- React wrappers live in `three-react/`
- React hooks live in `hooks/`
