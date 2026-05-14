#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/cdk-common.sh"

cdk deploy "${PARAMS[@]}"
