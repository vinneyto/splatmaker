#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

ACCOUNT="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text)}"
REGION="${AWS_REGION:-${CDK_DEFAULT_REGION:-$(aws configure get region)}}"

if [[ -z "${ACCOUNT:-}" || -z "${REGION:-}" ]]; then
  echo "Missing AWS account/region. Set AWS_ACCOUNT_ID/AWS_REGION in .env or configure AWS CLI."
  exit 1
fi

cdk bootstrap "aws://${ACCOUNT}/${REGION}"
