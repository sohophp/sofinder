#!/usr/bin/env bash

set -euo pipefail

version=${1:-}
if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo 'A stable semantic version is required.' >&2
    exit 2
fi

command -v gh >/dev/null 2>&1 || {
    echo 'GitHub CLI is required to verify synchronized package tags.' >&2
    exit 2
}

repositories=(
    sofinder
    sofinder-core
    sofinder-http
    sofinder-symfony
    sofinder-s3
    sofinder-psr15
    sofinder-laravel
)

missing=()
for repository in "${repositories[@]}"; do
    if ! gh api "repos/sohophp/$repository/git/ref/tags/v$version" >/dev/null 2>&1; then
        missing+=("sohophp/$repository@v$version")
    fi
done

if (( ${#missing[@]} > 0 )); then
    printf 'Synchronized release tag is missing: %s\n' "${missing[@]}" >&2
    exit 1
fi

echo "All synchronized SoFinder v$version repository tags are available."
