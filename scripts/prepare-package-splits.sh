#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
php_bin="$repository_root/scripts/php-bin.sh"
version=${1:-}
source_ref=${2:-}
output_dir=${3:-$repository_root/var/package-splits}

if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z]+([.-][0-9A-Za-z]+)*)?$ ]] || [[ -z "$source_ref" ]]; then
    echo 'Usage: prepare-package-splits.sh VERSION GIT_REF [OUTPUT_DIR]' >&2
    exit 2
fi
git -C "$repository_root" rev-parse --verify "$source_ref^{commit}" >/dev/null
mkdir -p "$repository_root/var"
mkdir -p "$output_dir"
output_dir=$(cd "$output_dir" && pwd)
tag="v$version"
tag_date=$(git -C "$repository_root" show -s --format=%cI "$source_ref^{commit}")
temporary_dir=$(mktemp -d "$repository_root/var/package-split-work.XXXXXX")
trap 'rm -rf -- "$temporary_dir"' EXIT

manifest="$output_dir/SPLIT_MANIFEST.tsv"
: > "$manifest"

prepare_split()
{
    local directory=$1
    local package_name=$2
    local target_repository=$3
    local short_name=${package_name#sohophp/}
    local bundle_name="$short_name-$tag.bundle"
    local split_repository="$temporary_dir/$short_name"
    local split_commit

    git -C "$repository_root" cat-file -e "$source_ref:$directory/composer.json"
    git clone --quiet --no-local "$repository_root" "$split_repository"
    git -C "$split_repository" config user.name 'SoFinder Release Automation'
    git -C "$split_repository" config user.email 'release@sofinder.sohophp.app'
    git -C "$split_repository" checkout --quiet -B source-release "$source_ref"
    FILTER_BRANCH_SQUELCH_WARNING=1 git -C "$split_repository" filter-branch --force --prune-empty \
        --subdirectory-filter "$directory" -- source-release >/dev/null
    split_commit=$(git -C "$split_repository" rev-parse source-release)
    git -C "$split_repository" show "$split_commit:composer.json" | "$php_bin" -r '
        $composer = json_decode(stream_get_contents(STDIN), true, 32, JSON_THROW_ON_ERROR);
        exit(($composer["name"] ?? null) === $argv[1] ? 0 : 1);
    ' "$package_name"
    git -C "$split_repository" branch -f package-release-main "$split_commit" >/dev/null
    GIT_COMMITTER_DATE="$tag_date" git -C "$split_repository" tag -a "$tag" "$split_commit" -m "$package_name $version" >/dev/null
    git -C "$split_repository" -c pack.threads=1 bundle create "$output_dir/$bundle_name" \
        refs/heads/package-release-main "refs/tags/$tag"
    printf '%s\t%s\t%s\t%s\t%s\n' "$package_name" "$target_repository" "$split_commit" "$tag" "$bundle_name" >> "$manifest"
}

prepare_split packages/sofinder-core sohophp/sofinder-core sohophp/sofinder-core
prepare_split packages/sofinder-http sohophp/sofinder-http sohophp/sofinder-http
prepare_split packages/sofinder-symfony sohophp/sofinder-symfony sohophp/sofinder-symfony
prepare_split packages/sofinder-s3 sohophp/sofinder-s3 sohophp/sofinder-s3

bridge_eligible=$("$php_bin" -r '
    $policy = json_decode(file_get_contents($argv[1]), true, 32, JSON_THROW_ON_ERROR);
    echo ($policy["promotionGate"]["eligible"] ?? false) === true ? "yes" : "no";
' "$repository_root/config/framework-support.json")
if [[ "$bridge_eligible" == yes ]]; then
    prepare_split packages/sofinder-psr15 sohophp/sofinder-psr15 sohophp/sofinder-psr15
    prepare_split packages/sofinder-laravel sohophp/sofinder-laravel sohophp/sofinder-laravel
fi

(
    cd "$output_dir"
    sha256sum ./*.bundle | sed 's#  \./#  #' | sort -k2 > SPLIT_SHA256SUMS
)
echo "Prepared synchronized package split bundles for $version in $output_dir."
