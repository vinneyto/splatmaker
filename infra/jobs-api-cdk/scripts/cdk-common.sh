#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

PARAMS=(
  --parameters "JobsTableName=${JOBS_TABLE_NAME:?JOBS_TABLE_NAME is required (set in .env)}"
  --parameters "ResultBucketName=${RESULT_BUCKET_NAME:?RESULT_BUCKET_NAME is required (set in .env)}"
  --parameters "ResultPublicBaseUrl=${RESULT_PUBLIC_BASE_URL:-}"
  --parameters "PresignTtlSeconds=${PRESIGN_TTL_SECONDS:-3600}"
)
