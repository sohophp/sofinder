#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
php_bin="$repository_root/scripts/php-bin.sh"
version=${1:-}
source_ref=${2:-WORKTREE}
output_dir=${3:-$repository_root/var/release-archives}

if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z]+([.-][0-9A-Za-z]+)*)?$ ]]; then
    printf '%s\n' 'Usage: build-release-archives.sh VERSION [GIT_REF|WORKTREE] [OUTPUT_DIR]' >&2
    exit 2
fi

mkdir -p "$output_dir"
output_dir=$(cd "$output_dir" && pwd)

archive_root()
{
    local archive="$output_dir/sofinder-$version.tar.gz"
    local prefix="sofinder-$version"
    local files=(composer.json LICENSE README.md README.zh-CN.md README.zh-TW.md CHANGELOG.md UPGRADING.md)
    if [[ "$source_ref" == WORKTREE ]]; then
        tar -czf "$archive" --transform "s#^#$prefix/#" -C "$repository_root" "${files[@]}"
    else
        git -C "$repository_root" archive --format=tar.gz --prefix="$prefix/" --output="$archive" "$source_ref" "${files[@]}"
    fi
    verify_archive "$archive" "$prefix" 'sohophp/sofinder' metapackage
}

archive_package()
{
    local directory=$1
    local package_name=$2
    local short_name=${package_name#sohophp/}
    local prefix="$short_name-$version"
    local archive="$output_dir/$short_name-$version.tar.gz"
    local files=(composer.json README.md LICENSE src)

    if [[ "$directory" == sofinder-symfony ]]; then
        files+=(THIRD_PARTY_NOTICES.md dist)
    elif [[ "$directory" == sofinder-s3 ]]; then
        files+=(CHANGELOG.md THIRD_PARTY_NOTICES.md)
    elif [[ "$directory" == sofinder-laravel ]]; then
        files+=(config)
    fi

    if [[ "$source_ref" == WORKTREE ]]; then
        tar -czf "$archive" --transform "s#^#$prefix/#" -C "$repository_root/packages/$directory" "${files[@]}"
    else
        git -C "$repository_root" archive --format=tar.gz --prefix="$prefix/" --output="$archive" "$source_ref:packages/$directory"
    fi
    verify_archive "$archive" "$prefix" "$package_name" package

    if [[ "$directory" == sofinder-symfony ]]; then
        local listing
        listing=$(tar -tzf "$archive")
        grep -Fxq "$prefix/dist/manifest.json" <<< "$listing"
        grep -Fxq "$prefix/THIRD_PARTY_NOTICES.md" <<< "$listing"
    fi
}

verify_archive()
{
    local archive=$1
    local prefix=$2
    local expected_name=$3
    local expected_type=$4
    local listing

    listing=$(tar -tzf "$archive")
    grep -Fxq "$prefix/composer.json" <<< "$listing"
    grep -Fxq "$prefix/LICENSE" <<< "$listing"
    grep -Fxq "$prefix/README.md" <<< "$listing"
    if grep -Eq "^$prefix/(vendor|tests|var)/" <<< "$listing"; then
        printf 'Release archive contains development/runtime files: %s\n' "$archive" >&2
        exit 1
    fi
    tar -xOzf "$archive" "$prefix/composer.json" | "$php_bin" -r '
        $composer = json_decode(stream_get_contents(STDIN), true, 32, JSON_THROW_ON_ERROR);
        [$name, $type] = array_slice($argv, 1);
        if (($composer["name"] ?? null) !== $name) exit(1);
        if ($type === "metapackage" && ($composer["type"] ?? null) !== "metapackage") exit(1);
    ' "$expected_name" "$expected_type"
}

archive_root
archive_package sofinder-core sohophp/sofinder-core
archive_package sofinder-http sohophp/sofinder-http
archive_package sofinder-symfony sohophp/sofinder-symfony
archive_package sofinder-s3 sohophp/sofinder-s3

psr15_eligible=$("$php_bin" -r '
    $policy = json_decode(file_get_contents($argv[1]), true, 32, JSON_THROW_ON_ERROR);
    echo ($policy["promotionGate"]["eligible"] ?? false) === true ? "yes" : "no";
' "$repository_root/config/framework-support.json")
if [[ "$psr15_eligible" == yes ]]; then
    archive_package sofinder-psr15 sohophp/sofinder-psr15
    archive_package sofinder-laravel sohophp/sofinder-laravel
fi

(
    cd "$output_dir"
    sha256sum ./*.tar.gz | sed 's#  \./#  #' | sort -k2 > SHA256SUMS
)

printf 'Built synchronized SoFinder %s archives in %s.\n' "$version" "$output_dir"
