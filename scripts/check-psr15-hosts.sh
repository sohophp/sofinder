#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
example_dir="$repository_root/examples/psr15"
server_pid=''

cleanup() {
    if [[ -n "$server_pid" ]]; then
        kill "$server_pid" 2>/dev/null || true
        wait "$server_pid" 2>/dev/null || true
    fi
}
trap cleanup EXIT

(cd "$example_dir" && ../../scripts/composer.sh validate --strict)
(cd "$example_dir" && ../../scripts/composer.sh install --no-interaction --prefer-dist --no-progress)

for specification in 'slim 18080' 'mezzio 18081' 'plain 18082'; do
    read -r host port <<< "$specification"
    "$repository_root/scripts/php-bin.sh" -S "127.0.0.1:$port" "$example_dir/public/$host.php" >/dev/null 2>&1 &
    server_pid=$!
    response=''
    for _attempt in {1..10}; do
        response=$(curl -si "http://127.0.0.1:$port/sofinder/live" 2>/dev/null || true)
        [[ -n "$response" ]] && break
        sleep 1
    done
    cleanup
    server_pid=''

    grep -Eq '^HTTP/1\.[01] 200' <<< "$response"
    grep -Eiq '^X-Content-Type-Options: nosniff' <<< "$response"
    grep -Fq '"status":"ready"' <<< "$response"
    echo "$host PSR-15 host smoke passed."
done
