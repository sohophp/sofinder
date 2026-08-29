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
    capabilities=$(curl -si "http://127.0.0.1:$port/sofinder/api/capabilities")
    health=$(curl -si "http://127.0.0.1:$port/sofinder/health")
    denied=$(curl -si "http://127.0.0.1:$port/sofinder/api/config")
    cleanup
    server_pid=''

    grep -Eq '^HTTP/1\.[01] 200' <<< "$response"
    grep -Eiq '^X-Content-Type-Options: nosniff' <<< "$response"
    grep -Fq '"status":"ready"' <<< "$response"
    grep -Eq '^HTTP/1\.[01] 200' <<< "$capabilities"
    grep -Fq '"success":true' <<< "$capabilities"
    grep -Eq '^HTTP/1\.[01] 200' <<< "$health"
    grep -Eq '^HTTP/1\.[01] 403' <<< "$denied"
    grep -Fq '"code":"access_denied"' <<< "$denied"

    SOFINDER_EXAMPLE_AUTHORIZED=1 "$repository_root/scripts/php-bin.sh" -S "127.0.0.1:$port" "$example_dir/public/$host.php" >/dev/null 2>&1 &
    server_pid=$!
    browser=''
    for _attempt in {1..10}; do
        browser=$(curl -si "http://127.0.0.1:$port/sofinder/browser" 2>/dev/null || true)
        grep -Eq '^HTTP/1\.[01] 200' <<< "$browser" && break
        sleep 1
    done
    asset=$(curl -si "http://127.0.0.1:$port/sofinder/assets/sofinder.css")
    config=$(curl -si "http://127.0.0.1:$port/sofinder/api/config")
    cleanup
    server_pid=''

    grep -Eq '^HTTP/1\.[01] 200' <<< "$browser"
    grep -Eiq '^Content-Type: text/html; charset=UTF-8' <<< "$browser"
    grep -Eiq '^Content-Security-Policy:.*default-src' <<< "$browser"
    grep -Eiq '^X-SoFinder-API-Version: 1.0' <<< "$browser"
    grep -Fq 'id="sofinder-root"' <<< "$browser"
    grep -Fq '&quot;apiBase&quot;:&quot;/sofinder/api/config&quot;' <<< "$browser"
    grep -Fq '&quot;csrfToken&quot;:&quot;sofinder-host-contract-token&quot;' <<< "$browser"
    grep -Eq '^HTTP/1\.[01] 200' <<< "$asset"
    grep -Eiq '^Content-Type: text/css; charset=UTF-8' <<< "$asset"
    grep -Eq '^HTTP/1\.[01] 200' <<< "$config"
    grep -Fq '"success":true' <<< "$config"
    echo "$host PSR-15 API and browser smoke passed."
done
