#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
example_dir="$repository_root/examples/symfony"
php_bin="$repository_root/scripts/php-bin.sh"
mkdir -p "$repository_root/var"
test_dir=$(mktemp -d "$repository_root/var/symfony-http.XXXXXX")
port=${SOFINDER_E2E_PORT:-18080}
base_url="http://127.0.0.1:$port"
server_pid=''
csrf_token=''
upload_name="sofinder-e2e-$RANDOM-$RANDOM.txt"
upload_created=false

fail()
{
    printf '%s\n' "$1" >&2
    exit 1
}

cleanup_upload()
{
    if [[ "$upload_created" != true || -z "$csrf_token" ]]; then
        return
    fi

    local delete_response="$test_dir/delete.json"
    local trash_id
    curl --silent --show-error --fail \
        --user demo:demo \
        --cookie "$test_dir/cookies.txt" \
        --header "X-CSRF-TOKEN: $csrf_token" \
        --header 'Content-Type: application/json' \
        --request DELETE \
        --data "{\"resource\":\"Files\",\"path\":\"$upload_name\"}" \
        "$base_url/sofinder/api/entries" > "$delete_response" || return
    trash_id=$("$php_bin" -r '$payload = json_decode(stream_get_contents(STDIN), true, 32, JSON_THROW_ON_ERROR); echo $payload["data"]["trash"]["item"]["id"] ?? "";' < "$delete_response")
    if [[ "$trash_id" =~ ^[a-f0-9]{32}$ ]]; then
        curl --silent --show-error --fail \
            --user demo:demo \
            --cookie "$test_dir/cookies.txt" \
            --header "X-CSRF-TOKEN: $csrf_token" \
            --header 'Content-Type: application/json' \
            --request DELETE \
            --data '{"resource":"Files"}' \
            "$base_url/sofinder/api/trash/$trash_id" > /dev/null || true
    fi
    upload_created=false
}

cleanup()
{
    cleanup_upload || true
    if [[ -n "$server_pid" ]]; then
        kill "$server_pid" 2>/dev/null || true
        wait "$server_pid" 2>/dev/null || true
    fi
    rm -rf -- "$test_dir"
}
trap cleanup EXIT

cd "$example_dir"
APP_ENV=prod APP_DEBUG=0 "$php_bin" -S "127.0.0.1:$port" -t public public/index.php \
    > "$test_dir/server.log" 2>&1 &
server_pid=$!

ready=false
for _attempt in {1..50}; do
    if curl --silent --fail "$base_url/sofinder/live" > "$test_dir/live.json"; then
        ready=true
        break
    fi
    if ! kill -0 "$server_pid" 2>/dev/null; then
        cat "$test_dir/server.log" >&2
        fail 'The Symfony example server exited before becoming ready.'
    fi
    sleep 0.2
done
[[ "$ready" == true ]] || fail 'The Symfony example server did not become ready.'

status=$(curl --silent --output "$test_dir/anonymous.html" --write-out '%{http_code}' "$base_url/sofinder/browser")
[[ "$status" == 401 ]] || fail "Expected anonymous browser request to return 401, got $status."

status=$(curl --silent --show-error \
    --dump-header "$test_dir/browser.headers" \
    --cookie-jar "$test_dir/cookies.txt" \
    --user demo:demo \
    --output "$test_dir/browser.html" \
    --write-out '%{http_code}' \
    "$base_url/sofinder/browser")
[[ "$status" == 200 ]] || fail "Expected authenticated browser request to return 200, got $status."
grep -qi '^Content-Security-Policy:' "$test_dir/browser.headers" || fail 'Browser response is missing Content-Security-Policy.'
grep -qi '^X-SoFinder-API-Version: 1.0' "$test_dir/browser.headers" || fail 'Browser response is missing the API version header.'
grep -q 'data-config=' "$test_dir/browser.html" || fail 'Browser response is missing its runtime configuration.'

csrf_token=$(sed -n 's/.*csrfToken&quot;:&quot;\([^&]*\)&quot;.*/\1/p' "$test_dir/browser.html")
[[ -n "$csrf_token" ]] || fail 'Unable to read the Symfony session CSRF token.'

status=$(curl --silent --show-error \
    --user demo:demo \
    --cookie "$test_dir/cookies.txt" \
    --form 'resource=Files' \
    --form 'path=' \
    --form "upload=@$test_dir/live.json;filename=csrf-must-fail.txt;type=text/plain" \
    --output "$test_dir/csrf-failure.json" \
    --write-out '%{http_code}' \
    "$base_url/sofinder/api/uploads")
[[ "$status" == 403 ]] || fail "Expected upload without CSRF to return 403, got $status."
grep -q '"code":"access_denied"' "$test_dir/csrf-failure.json" || fail 'CSRF failure did not use the stable error code.'

printf '%s' 'symfony-http-contract' > "$test_dir/upload.txt"
status=$(curl --silent --show-error \
    --user demo:demo \
    --cookie "$test_dir/cookies.txt" \
    --header "X-CSRF-TOKEN: $csrf_token" \
    --form 'resource=Files' \
    --form 'path=' \
    --form "upload=@$test_dir/upload.txt;filename=$upload_name;type=text/plain" \
    --output "$test_dir/upload.json" \
    --write-out '%{http_code}' \
    "$base_url/sofinder/api/uploads")
[[ "$status" == 201 ]] || fail "Expected valid upload to return 201, got $status."
grep -q '"success":true' "$test_dir/upload.json" || fail 'Upload response did not use the success envelope.'
grep -q "\"path\":\"$upload_name\"" "$test_dir/upload.json" || fail 'Upload response path differs from the requested filename.'
upload_created=true

status=$(curl --silent --show-error \
    --user demo:demo \
    --cookie "$test_dir/cookies.txt" \
    --dump-header "$test_dir/download.headers" \
    --output "$test_dir/download.txt" \
    --write-out '%{http_code}' \
    "$base_url/sofinder/api/download?resource=Files&path=$upload_name")
[[ "$status" == 200 ]] || fail "Expected download to return 200, got $status."
cmp "$test_dir/upload.txt" "$test_dir/download.txt" || fail 'Downloaded bytes differ from the upload.'
grep -qi '^X-Content-Type-Options: nosniff' "$test_dir/download.headers" || fail 'Download response is missing security headers.'

status=$(curl --silent --show-error \
    --user demo:demo \
    --cookie "$test_dir/cookies.txt" \
    --header 'Range: bytes=0-6' \
    --output "$test_dir/range.txt" \
    --write-out '%{http_code}' \
    "$base_url/sofinder/api/download?resource=Files&path=$upload_name")
[[ "$status" == 206 ]] || fail "Expected Range download to return 206, got $status."
[[ "$(< "$test_dir/range.txt")" == 'symfony' ]] || fail 'Range response contains unexpected bytes.'

status=$(curl --silent --show-error \
    --user demo:demo \
    --cookie "$test_dir/cookies.txt" \
    --output "$test_dir/asset.js" \
    --write-out '%{http_code}' \
    "$base_url/sofinder/assets/sofinder.js")
[[ "$status" == 200 ]] || fail "Expected compiled frontend asset to return 200, got $status."
[[ -s "$test_dir/asset.js" ]] || fail 'Compiled frontend asset is empty.'

cleanup_upload
printf '%s\n' 'Symfony example HTTP smoke passed: auth, CSRF, upload, download, Range and assets.'
