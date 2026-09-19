#!/bin/bash
set -e

pnpm install \
  --filter @workspace/crypto-dashboard... \
  --filter @workspace/api-server... \
  --frozen-lockfile

if [[ -n "${DATABASE_URL:-}" ]]; then
  pnpm --filter @workspace/db run push-force
fi
