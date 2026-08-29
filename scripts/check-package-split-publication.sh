#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
split_dir=${1:-}
if [[ -z "$split_dir" || ! -s "$split_dir/SPLIT_MANIFEST.tsv" ]]; then
    echo 'Usage: check-package-split-publication.sh SPLIT_DIRECTORY' >&2
    exit 2
fi
split_dir=$(cd "$split_dir" && pwd)
mkdir -p "$repository_root/var"
happy_dir=$(mktemp -d "$repository_root/var/package-publish-happy.XXXXXX")
conflict_dir=$(mktemp -d "$repository_root/var/package-publish-conflict.XXXXXX")
trap 'rm -rf -- "$happy_dir" "$conflict_dir"' EXIT

initialize_remotes()
{
    local root=$1
    while IFS=$'\t' read -r _package repository _commit _tag _bundle; do
        local bare="$root/$repository.git"
        mkdir -p "$(dirname "$bare")"
        git init --bare --quiet "$bare"
    done < "$split_dir/SPLIT_MANIFEST.tsv"
}

initialize_remotes "$happy_dir"
happy_url=$(cd "$happy_dir" && pwd)
GH_TOKEN=test-only SOFINDER_PACKAGE_REPOSITORY_BASE_URL="file://$happy_url" \
    bash "$repository_root/scripts/publish-package-splits.sh" "$split_dir"
while IFS=$'\t' read -r _package repository commit tag _bundle; do
    bare="$happy_dir/$repository.git"
    test "$(git -C "$bare" rev-parse refs/heads/main)" = "$commit"
    test "$(git -C "$bare" rev-parse "refs/tags/$tag^{commit}")" = "$commit"
done < "$split_dir/SPLIT_MANIFEST.tsv"

branch_only_dir=$(mktemp -d "$repository_root/var/package-publish-branch-only.XXXXXX")
trap 'rm -rf -- "$happy_dir" "$conflict_dir" "$branch_only_dir"' EXIT
initialize_remotes "$branch_only_dir"
branch_only_url=$(cd "$branch_only_dir" && pwd)
GH_TOKEN=test-only SOFINDER_PACKAGE_REPOSITORY_BASE_URL="file://$branch_only_url" \
    bash "$repository_root/scripts/publish-package-splits.sh" "$split_dir" --branch-only
while IFS=$'\t' read -r _package repository commit tag _bundle; do
    bare="$branch_only_dir/$repository.git"
    test "$(git -C "$bare" rev-parse refs/heads/main)" = "$commit"
    test -z "$(git -C "$bare" for-each-ref --format='%(refname)' "refs/tags/$tag")"
done < "$split_dir/SPLIT_MANIFEST.tsv"

core_record=$(awk -F '\t' '$1 == "sohophp/sofinder-core" {print $4 "\t" $5}' "$split_dir/SPLIT_MANIFEST.tsv")
IFS=$'\t' read -r release_tag core_bundle <<< "$core_record"
consumer_dir="$happy_dir/consumer"
mkdir -p "$consumer_dir"
cd "$consumer_dir"
"$repository_root/scripts/composer.sh" init --name=sohophp/package-split-consumer --no-interaction
"$repository_root/scripts/composer.sh" config minimum-stability RC
"$repository_root/scripts/composer.sh" config prefer-stable true
while IFS=$'\t' read -r package_name repository _commit _tag _bundle; do
    package=${package_name#sohophp/}
    "$repository_root/scripts/composer.sh" config "repositories.$package" \
        "{\"type\":\"vcs\",\"url\":\"$happy_url/$repository.git\"}"
done < "$split_dir/SPLIT_MANIFEST.tsv"
release_version=${release_tag#v}
consumer_packages=("sohophp/sofinder-symfony:$release_version" "sohophp/sofinder-s3:$release_version")
with_bridges=false
if grep -Fq $'sohophp/sofinder-laravel\t' "$split_dir/SPLIT_MANIFEST.tsv"; then
    grep -Fq $'sohophp/sofinder-psr15\t' "$split_dir/SPLIT_MANIFEST.tsv"
    consumer_packages+=("sohophp/sofinder-laravel:$release_version" "sohophp/sofinder-psr15:$release_version")
    with_bridges=true
fi
"$repository_root/scripts/composer.sh" require "${consumer_packages[@]}" --no-interaction --prefer-dist
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; $withBridges=$argv[1]==="true"; exit(
    class_exists("SohoPHP\\SoFinder\\SoFinderBundle")
    && class_exists("SohoPHP\\SoFinder\\Http\\EndpointDispatcher")
    && class_exists("SohoPHP\\SoFinderS3\\S3StorageAdapter")
    && class_exists("SohoPHP\\SoFinderS3\\SoFinderS3Bundle")
    && class_exists("SohoPHP\\SoFinder\\Configuration\\ConfigurationNormalizer")
    && (!$withBridges || (class_exists("SohoPHP\\SoFinder\\Laravel\\SoFinderServiceProvider")
        && class_exists("SohoPHP\\SoFinder\\Psr15\\SoFinderMiddleware"))) ? 0 : 1
);' "$with_bridges"
if [[ "$with_bridges" == true ]]; then
    test -s vendor/sohophp/sofinder-laravel/dist/manifest.json
    test -s vendor/sohophp/sofinder-psr15/dist/manifest.json
    runtime_dir="$consumer_dir/var/psr15-runtime"
    mkdir -p "$runtime_dir/state" "$runtime_dir/files"
    "$repository_root/scripts/php-bin.sh" "$repository_root/tests/fixtures/verify-installed-psr-browser.php" "$runtime_dir"

    laravel_major=${SOFINDER_LARAVEL_CONSUMER_MAJOR:-13}
    case "$laravel_major" in
        12|13) ;;
        *)
            echo "SOFINDER_LARAVEL_CONSUMER_MAJOR must be 12 or 13, got: $laravel_major" >&2
            exit 2
            ;;
    esac
    laravel_dir="$happy_dir/laravel-consumer"
    mkdir -p "$laravel_dir/bootstrap/cache" "$laravel_dir/storage/app" \
        "$laravel_dir/storage/framework/cache" "$laravel_dir/storage/framework/sessions" \
        "$laravel_dir/storage/framework/views" "$laravel_dir/storage/logs"
    cp -R "$repository_root/examples/laravel/app" "$laravel_dir/app"
    cp -R "$repository_root/examples/laravel/config" "$laravel_dir/config"
    cp -R "$repository_root/examples/laravel/public" "$laravel_dir/public"
    cp -R "$repository_root/examples/laravel/routes" "$laravel_dir/routes"
    cp "$repository_root/examples/laravel/bootstrap/app.php" "$laravel_dir/bootstrap/app.php"
    cp "$repository_root/examples/laravel/bootstrap/providers.php" "$laravel_dir/bootstrap/providers.php"
    cp "$repository_root/examples/laravel/artisan" "$laravel_dir/artisan"
    cp "$repository_root/examples/laravel/.env.example" "$laravel_dir/.env.example"
    cp "$repository_root/examples/laravel/README.md" "$laravel_dir/README.md"
    cp "$repository_root/examples/laravel/composer-$laravel_major.json" "$laravel_dir/composer.json"
    cd "$laravel_dir"
    "$repository_root/scripts/composer.sh" config --unset repositories
    while IFS=$'\t' read -r package_name repository _commit _tag _bundle; do
        package=${package_name#sohophp/}
        "$repository_root/scripts/composer.sh" config "repositories.$package" \
            "{\"type\":\"vcs\",\"url\":\"$happy_url/$repository.git\"}"
    done < "$split_dir/SPLIT_MANIFEST.tsv"
    "$repository_root/scripts/composer.sh" config minimum-stability RC
    stable_version=${release_version%%-*}
    release_minor=${stable_version%.*}
    "$repository_root/scripts/composer.sh" require --no-update \
        "laravel/framework:$laravel_major.*" "sohophp/sofinder-laravel:^$release_minor@RC"
    "$repository_root/scripts/composer.sh" update --no-interaction --prefer-dist --no-progress
    "$repository_root/scripts/composer.sh" show "sohophp/sofinder-laravel" "$release_version" --no-interaction >/dev/null
    cd "$repository_root"
    SOFINDER_LARAVEL_EXAMPLE_DIR="$laravel_dir" SOFINDER_LARAVEL_PORT=18088 \
        bash "$repository_root/scripts/check-laravel-example-http.sh"
fi
cd "$repository_root"

initialize_remotes "$conflict_dir"
conflict_url=$(cd "$conflict_dir" && pwd)
git clone --quiet --branch package-release-main "$split_dir/$core_bundle" "$conflict_dir/source"
git -C "$conflict_dir/source" push --quiet "$conflict_url/sohophp/sofinder-http.git" "refs/tags/$release_tag"
if GH_TOKEN=test-only SOFINDER_PACKAGE_REPOSITORY_BASE_URL="file://$conflict_url" \
    bash "$repository_root/scripts/publish-package-splits.sh" "$split_dir"; then
    echo 'Package publisher unexpectedly accepted a conflicting immutable tag.' >&2
    exit 1
fi
test -z "$(git -C "$conflict_dir/sohophp/sofinder-core.git" for-each-ref --format='%(refname)')"

echo 'Package split publication happy-path and cross-repository preflight fixtures passed.'
