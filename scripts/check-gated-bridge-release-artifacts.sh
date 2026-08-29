#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
policy="$repository_root/tests/fixtures/framework-support-bridges-eligible.json"
version=1.1.0-rc.1
mkdir -p "$repository_root/var"
archive_dir=$(mktemp -d "$repository_root/var/gated-release-archives.XXXXXX")
split_dir=$(mktemp -d "$repository_root/var/gated-package-splits.XXXXXX")
denied_dir=$(mktemp -d "$repository_root/var/gated-policy-denied.XXXXXX")
trap 'rm -rf -- "$archive_dir" "$split_dir" "$denied_dir"' EXIT

# A policy override must never work unless the caller explicitly opts into the
# non-release fixture mode.
if SOFINDER_RELEASE_TEST_POLICY="$policy" \
    bash "$repository_root/scripts/build-release-archives.sh" "$version" WORKTREE "$denied_dir" >/dev/null 2>&1; then
    echo 'Release archives accepted a test policy outside explicit test mode.' >&2
    exit 1
fi
if SOFINDER_RELEASE_TEST_POLICY="$policy" \
    bash "$repository_root/scripts/prepare-package-splits.sh" "$version" HEAD "$denied_dir" >/dev/null 2>&1; then
    echo 'Package splits accepted a test policy outside explicit test mode.' >&2
    exit 1
fi
if RELEASE_TAG="v$version" SOFINDER_RELEASE_TEST_MODE=1 SOFINDER_RELEASE_TEST_POLICY="$policy" \
    bash "$repository_root/scripts/build-release-archives.sh" "$version" WORKTREE "$denied_dir" >/dev/null 2>&1; then
    echo 'Tag release context accepted a test-only eligible policy.' >&2
    exit 1
fi

SOFINDER_RELEASE_TEST_MODE=1 SOFINDER_RELEASE_TEST_POLICY="$policy" \
    bash "$repository_root/scripts/build-release-archives.sh" "$version" WORKTREE "$archive_dir"
(cd "$archive_dir" && sha256sum -c SHA256SUMS)
for package in sofinder sofinder-core sofinder-http sofinder-symfony sofinder-s3 sofinder-psr15 sofinder-laravel; do
    test -s "$archive_dir/$package-$version.tar.gz"
done
for package in sofinder-psr15 sofinder-laravel; do
    archive_listing=$(tar -tzf "$archive_dir/$package-$version.tar.gz")
    grep -Fxq "$package-$version/THIRD_PARTY_NOTICES.md" <<< "$archive_listing"
done
test "$(find "$archive_dir" -maxdepth 1 -type f -name '*.tar.gz' | wc -l)" = 7

SOFINDER_RELEASE_TEST_MODE=1 SOFINDER_RELEASE_TEST_POLICY="$policy" \
    bash "$repository_root/scripts/prepare-package-splits.sh" "$version" HEAD "$split_dir"
(cd "$split_dir" && sha256sum -c SPLIT_SHA256SUMS)
test "$(wc -l < "$split_dir/SPLIT_MANIFEST.tsv")" = 6
for package in sofinder-core sofinder-http sofinder-symfony sofinder-s3 sofinder-psr15 sofinder-laravel; do
    grep -Fq "sohophp/$package" "$split_dir/SPLIT_MANIFEST.tsv"
done
relative_split_dir=${split_dir#"$repository_root/"}
(cd "$repository_root" && bash scripts/check-package-split-publication.sh "$relative_split_dir")

echo 'Gated Laravel and PSR-15 release archive, split and clean-consumer fixtures passed.'
