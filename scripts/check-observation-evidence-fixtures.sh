#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
php_bin="$repository_root/scripts/php-bin.sh"
mkdir -p "$repository_root/var"
fixture_dir=$(mktemp -d "$repository_root/var/observation-fixtures.XXXXXX")
trap 'rm -rf -- "$fixture_dir"' EXIT

"$php_bin" -r 'file_put_contents($argv[1], json_encode([
    "tag_name" => "v1.0.0",
    "published_at" => "2026-01-01T00:00:00Z",
    "html_url" => "https://github.com/sohophp/sofinder/releases/tag/v1.0.0",
], JSON_THROW_ON_ERROR));' "$fixture_dir/release.json"
"$php_bin" -r 'file_put_contents($argv[1], "[]");' "$fixture_dir/issues.json"

SOFINDER_OBSERVED_AT=2026-02-01T00:00:00Z "$php_bin" "$repository_root/scripts/build-observation-evidence.php" \
    "$fixture_dir/release.json" "$fixture_dir/issues.json" "$fixture_dir/evidence.json" --fail-on-defects
"$php_bin" -r '$e=json_decode(file_get_contents($argv[1]), true, 16, JSON_THROW_ON_ERROR); exit(
    $e["observation"]["coveredDays"] === 30
    && $e["observation"]["periodComplete"] === true
    && $e["openP0P1Defects"] === 0
    && $e["observedP0P1Defects"] === 0 ? 0 : 1
);' "$fixture_dir/evidence.json"

"$php_bin" -r 'file_put_contents($argv[1], json_encode([[
    "number" => 7,
    "title" => "Data loss during move",
    "state" => "CLOSED",
    "createdAt" => "2026-01-10T00:00:00Z",
    "closedAt" => "2026-01-11T00:00:00Z",
    "url" => "https://github.com/sohophp/sofinder/issues/7",
    "labels" => [["name" => "priority:p0"]],
]], JSON_THROW_ON_ERROR));' "$fixture_dir/issues.json"
if SOFINDER_OBSERVED_AT=2026-02-01T00:00:00Z "$php_bin" "$repository_root/scripts/build-observation-evidence.php" \
    "$fixture_dir/release.json" "$fixture_dir/issues.json" "$fixture_dir/evidence.json" --fail-on-defects; then
    echo 'Observation evidence unexpectedly accepted a closed P0 defect.' >&2
    exit 1
fi
"$php_bin" -r '$e=json_decode(file_get_contents($argv[1]), true, 16, JSON_THROW_ON_ERROR); exit(
    $e["openP0P1Defects"] === 0 && $e["observedP0P1Defects"] === 1 ? 0 : 1
);' "$fixture_dir/evidence.json"

echo 'Symfony observation evidence positive and negative fixtures passed.'
