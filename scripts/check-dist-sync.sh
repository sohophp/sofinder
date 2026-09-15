#!/usr/bin/env bash
set -euo pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
source_dist="$project_dir/dist"
symfony_dist="$project_dir/packages/sofinder-symfony/dist"

[[ -d "$source_dist" && -d "$symfony_dist" ]] || {
    echo 'SoFinder distribution directories are missing. Build and sync the frontend assets.' >&2
    exit 1
}

if ! diff -qr "$source_dist" "$symfony_dist" >/dev/null; then
    echo 'SoFinder frontend assets are not synchronized with packages/sofinder-symfony/dist.' >&2
    echo 'Run: rsync -a --delete dist/ packages/sofinder-symfony/dist/' >&2
    exit 1
fi

echo 'SoFinder frontend and Symfony package assets are synchronized.'
