#!/usr/bin/env bash
# Isolated S3 test server built from the official immutable MinIO source release.
set -euo pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
runtime_dir="$project_dir/var/ci-minio"
# RELEASE.2025-10-15T17-29-55Z. Community images are no longer distributed.
minio_commit=9e49d5e7a648f00e26f2246f4dc28e6b07f8c84a
mkdir -p "$runtime_dir/bin" "$runtime_dir/data"
GOTOOLCHAIN=local GOBIN="$runtime_dir/bin" go install "github.com/minio/minio@$minio_commit"
MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin \
  nohup "$runtime_dir/bin/minio" server "$runtime_dir/data" --address 127.0.0.1:9000 \
  > "$runtime_dir/minio.log" 2>&1 &
server_pid=$!
printf '%s\n' "$server_pid" > "$runtime_dir/minio.pid"
for attempt in {1..30}; do
  if curl --fail --silent http://127.0.0.1:9000/minio/health/ready; then
    exit 0
  fi
  kill -0 "$server_pid" 2>/dev/null || break
  sleep 1
done
cat "$runtime_dir/minio.log" >&2
kill "$server_pid" 2>/dev/null || true
exit 1
