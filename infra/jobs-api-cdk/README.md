# Jobs API + Frontend Runtime CDK Stack

This module deploys public routing for Splatmaker via a **single CloudFront distribution**:

- `/*` -> Next.js server runtime in AWS Lambda (Function URL origin)
- `/api/*` -> Jobs API Lambda (Function URL origin)
- `/media/*` -> S3 result bucket (OAC)

This architecture supports dynamic routes (for example `/jobs/<jobId>`) without static export workarounds.

## Runtime approach

Frontend runtime uses **Next.js standalone output** packaged into a Lambda zip and executed as a Node.js Lambda function exposed by Function URL.

In production, frontend calls `/api/*` and `/media/*` on the same CloudFront domain (no `FRONTEND_API_PROXY_BASE_URL` injection for Lambda runtime).

> Build prerequisite: frontend must be built before CDK synth/deploy so `.next/standalone` exists.

---

## Prerequisites

- Node.js 20+
- npm
- AWS CLI configured with credentials
- CDK bootstrap permissions
- Existing AWS resources:
  - DynamoDB table with jobs
  - S3 bucket with result files

---

## 1) Build frontend runtime artifact

```bash
cd frontend
npm ci
npm run build
```

## 2) Install infra dependencies

```bash
cd infra/jobs-api-cdk
npm ci
```

## 3) Configure environment

```bash
cp .env.example .env
```

Set values in `.env`:

- `JOBS_TABLE_NAME` (required)
- `RESULT_BUCKET_NAME` (required)
- `PRESIGN_TTL_SECONDS` (optional, default `3600`)

## 4) Build + synth + deploy

```bash
npm run build
npm run cdk:synth
npm run cdk:deploy
```

---

## CloudFront behaviors and caching

- Default `/*` (Next runtime): caching disabled for HTML/SSR safety.
- `/_next/static/*`: optimized static caching policy.
- `/api/*`: caching disabled.
- `/media/*`: optimized caching policy + rewrite function.

CloudFront stays the only public entry point for frontend + API + media.

---

## Post-deploy checks

1. Open `https://<cloudfront-domain>/jobs/<jobId>` (path-based details route).
2. Verify API:
   - `https://<cloudfront-domain>/api/healthz`
   - `https://<cloudfront-domain>/api/v1/jobs`
3. Verify media links under:
   - `https://<cloudfront-domain>/media/...`
4. Verify no query-only workaround is needed for job details routing.

---

## Notes on cost and limits

- Next runtime on Lambda can have cold starts (especially after idle periods).
- Keep HTML/SSR caching conservative to avoid stale page/document issues.
- Keep static assets aggressively cached to reduce Lambda load and latency.
