# Jobs API CDK Stack

This module deploys a public Jobs API and media routing layer for Splatmaker.

It is designed as an add-on for:

- https://github.com/aws-solutions-library-samples/guidance-for-open-source-3d-reconstruction-toolbox-for-gaussian-splats-on-aws

With this stack you can:

- fetch a list of reconstruction jobs,
- fetch job details,
- open reconstruction result files through CloudFront.

---

## What gets deployed

- Lambda (Hono) API endpoint for:
  - `GET /api/healthz`
  - `GET /api/v1/jobs`
  - `GET /api/v1/jobs/:jobId`
- CloudFront distribution:
  - `/` -> static frontend from S3 (deployed during stack deployment)
  - `/api/*` -> Lambda Function URL origin
  - `/media/*` -> S3 origin
- CloudFront Functions for:
  - `/media/*` path rewrite
  - forwarding public host/proto headers for `/api/*`

---

## Prerequisites

- Node.js 20+
- npm
- Docker (required to build/export frontend bundle during `cdk deploy`)
- AWS CLI configured with credentials
- CDK bootstrap permissions
- Existing AWS resources:
  - DynamoDB table with jobs
  - S3 bucket with result files

---

## 1) Install dependencies

```bash
cd infra/jobs-api-cdk
npm install
```

## 2) Configure environment

Create `.env` from template:

```bash
cp .env.example .env
```

Set values in `.env`:

- `JOBS_TABLE_NAME` (required)
- `RESULT_BUCKET_NAME` (required)
- `PRESIGN_TTL_SECONDS` (optional, default `3600`)
- `AWS_ACCOUNT_ID` and `AWS_REGION` (optional for bootstrap script)

## 3) Build

```bash
npm run build
```

## 4) Bootstrap CDK (first time per account/region)

```bash
npm run cdk:bootstrap
```

## 5) Review changes

```bash
npm run cdk:diff
```

## 6) Deploy

```bash
npm run cdk:deploy
```

---

## Post-deploy checks

1. Read stack outputs and note CloudFront domain.
2. Check health endpoint:

```bash
curl https://<cloudfront-domain>/api/healthz
```

3. Check jobs list:

```bash
curl https://<cloudfront-domain>/api/v1/jobs
```

4. Check one job details response includes media URLs via CloudFront:

```text
https://<cloudfront-domain>/media/...
```

---

## Important: imported S3 bucket policy

If your S3 bucket is imported (for example via `fromBucketName`), CDK does not automatically update bucket policy for OAC access.

You must add an explicit `Allow` statement in the bucket policy for CloudFront distribution access, otherwise `/media/*` can return `403`.

Use condition `AWS:SourceArn` with your distribution ARN:

```text
arn:aws:cloudfront::<account-id>:distribution/<distribution-id>
```

---

## Notes

- Root path `/` serves the frontend UI from the same CloudFront distribution.
- API and media are public by design in this setup.
