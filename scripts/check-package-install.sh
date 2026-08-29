#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
case "${SOFINDER_COMPOSER_PREFERENCE:-stable}" in
    lowest) preference_args=(--prefer-lowest) ;;
    stable) preference_args=(--prefer-stable) ;;
    *) echo 'SOFINDER_COMPOSER_PREFERENCE must be lowest or stable.' >&2; exit 2 ;;
esac
mkdir -p "$repository_root/var"
core_test_dir=$(mktemp -d "$repository_root/var/core-install.XXXXXX")
package_test_dir=$(mktemp -d "$repository_root/var/package-install.XXXXXX")
symfony_test_dir=$(mktemp -d "$repository_root/var/symfony-install.XXXXXX")
meta_test_dir=$(mktemp -d "$repository_root/var/meta-install.XXXXXX")
s3_test_dir=$(mktemp -d "$repository_root/var/s3-install.XXXXXX")
laravel_test_dir=$(mktemp -d "$repository_root/var/laravel-install.XXXXXX")
legacy_conflict_test_dir=$(mktemp -d "$repository_root/var/legacy-conflict-install.XXXXXX")
trap 'rm -rf -- "$core_test_dir" "$package_test_dir" "$symfony_test_dir" "$meta_test_dir" "$s3_test_dir" "$laravel_test_dir" "$legacy_conflict_test_dir"' EXIT

cd "$core_test_dir"
"$repository_root/scripts/composer.sh" init --name=sohophp/core-install-test --no-interaction
"$repository_root/scripts/composer.sh" config repositories.core '{"type":"path","url":"../../packages/sofinder-core","options":{"symlink":false,"versions":{"sohophp/sofinder-core":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" require sohophp/sofinder-core:1.0.0 --no-interaction --prefer-dist "${preference_args[@]}"
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\FileManager") && class_exists("SohoPHP\\SoFinder\\Configuration\\ConfigurationNormalizer") && class_exists("SohoPHP\\SoFinder\\Security\\SecurityAuditor") && !class_exists("Symfony\\Component\\HttpFoundation\\Request") ? 0 : 1);'
test -s vendor/sohophp/sofinder-core/LICENSE
test -s vendor/sohophp/sofinder-core/README.md

cd "$package_test_dir"
"$repository_root/scripts/composer.sh" init --name=sohophp/package-install-test --no-interaction
"$repository_root/scripts/composer.sh" config repositories.core '{"type":"path","url":"../../packages/sofinder-core","options":{"symlink":false,"versions":{"sohophp/sofinder-core":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.http '{"type":"path","url":"../../packages/sofinder-http","options":{"symlink":false,"versions":{"sohophp/sofinder-http":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.psr15 '{"type":"path","url":"../../packages/sofinder-psr15","options":{"symlink":false,"versions":{"sohophp/sofinder-psr15":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" require sohophp/sofinder-psr15:1.0.0 --no-interaction --prefer-dist "${preference_args[@]}"
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\Http\\Action\\MetricsAction") ? 0 : 1);'
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\Psr15\\RouteRegistrar") && class_exists("SohoPHP\\SoFinder\\Psr15\\EndpointRouteHandler") ? 0 : 1);'
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\Http\\Action\\UploadAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\ChunkUploadAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\QuickUploadAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\ArchiveDownloadAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\AssetSessionContentAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\FrontendAssetAction") && class_exists("SohoPHP\\SoFinder\\Http\\UploadedFileInput") && class_exists("SohoPHP\\SoFinder\\Http\\CleanupStream") ? 0 : 1);'
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\Psr15\\SoFinderMiddleware") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\EntriesAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\BatchAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\RestoreTrashAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\MetadataUpdateAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\TextPreviewAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\ChunkStatusAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\ImageInfoAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\AssetSearchAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\AssetDeleteCheckAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\AssetUpdateAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\DocumentPreviewJobCreateAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\SignedUrlIssueAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\SecurityStatusAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\ContentAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\ImageThumbnailAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\DocumentPreviewAction") && class_exists("SohoPHP\\SoFinder\\Http\\Action\\SignedContentAction") && class_exists("SohoPHP\\SoFinder\\Http\\StreamEndpointResult") && class_exists("SohoPHP\\SoFinder\\Asset\\AssetReferenceBuilder") && class_exists("SohoPHP\\SoFinder\\Http\\MutationGuard") && !class_exists("Symfony\\Component\\HttpFoundation\\Request") ? 0 : 1);'
test -s vendor/sohophp/sofinder-http/README.md
test -s vendor/sohophp/sofinder-psr15/LICENSE
test -s vendor/sohophp/sofinder-psr15/README.md

cd "$symfony_test_dir"
"$repository_root/scripts/composer.sh" init --name=sohophp/symfony-install-test --no-interaction
"$repository_root/scripts/composer.sh" config repositories.core '{"type":"path","url":"../../packages/sofinder-core","options":{"symlink":false,"versions":{"sohophp/sofinder-core":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.http '{"type":"path","url":"../../packages/sofinder-http","options":{"symlink":false,"versions":{"sohophp/sofinder-http":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.symfony '{"type":"path","url":"../../packages/sofinder-symfony","options":{"symlink":false,"versions":{"sohophp/sofinder-symfony":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" require sohophp/sofinder-symfony:1.0.0 --no-interaction --prefer-dist "${preference_args[@]}"
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; $class = new ReflectionClass("SohoPHP\\SoFinder\\SoFinderBundle"); $package = dirname((string) $class->getFileName(), 2); $routes = SohoPHP\SoFinder\Routing\SymfonyRouteCollectionFactory::create(); exit(is_file($package . "/dist/manifest.json") && is_file($package . "/src/Resources/config/routes.php") && count($routes) === 52 && str_contains((string) $class->getFileName(), "/vendor/sohophp/sofinder-symfony/src/") ? 0 : 1);'
test -s vendor/sohophp/sofinder-symfony/LICENSE
test -s vendor/sohophp/sofinder-symfony/README.md
test -s vendor/sohophp/sofinder-symfony/THIRD_PARTY_NOTICES.md

cd "$meta_test_dir"
"$repository_root/scripts/composer.sh" init --name=sohophp/meta-install-test --no-interaction
"$repository_root/scripts/composer.sh" config repositories.core '{"type":"path","url":"../../packages/sofinder-core","options":{"symlink":false,"versions":{"sohophp/sofinder-core":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.http '{"type":"path","url":"../../packages/sofinder-http","options":{"symlink":false,"versions":{"sohophp/sofinder-http":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.symfony '{"type":"path","url":"../../packages/sofinder-symfony","options":{"symlink":false,"versions":{"sohophp/sofinder-symfony":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.meta '{"type":"path","url":"../..","options":{"symlink":false,"versions":{"sohophp/sofinder":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" require sohophp/sofinder:1.0.0 --no-interaction --prefer-dist "${preference_args[@]}"
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\SoFinderBundle") ? 0 : 1);'

cd "$s3_test_dir"
"$repository_root/scripts/composer.sh" init --name=sohophp/s3-install-test --no-interaction
"$repository_root/scripts/composer.sh" config repositories.core '{"type":"path","url":"../../packages/sofinder-core","options":{"symlink":false,"versions":{"sohophp/sofinder-core":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.s3 '{"type":"path","url":"../../packages/sofinder-s3","options":{"symlink":false,"versions":{"sohophp/sofinder-s3":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" require sohophp/sofinder-s3:1.0.0 --no-interaction --prefer-dist "${preference_args[@]}"
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinderS3\\S3StorageAdapter") && !class_exists("Symfony\\Component\\HttpFoundation\\Request") ? 0 : 1);'
test -s vendor/sohophp/sofinder-s3/LICENSE
test -s vendor/sohophp/sofinder-s3/README.md

cd "$laravel_test_dir"
"$repository_root/scripts/composer.sh" init --name=sohophp/laravel-install-test --no-interaction
"$repository_root/scripts/composer.sh" config repositories.core '{"type":"path","url":"../../packages/sofinder-core","options":{"symlink":false,"versions":{"sohophp/sofinder-core":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.http '{"type":"path","url":"../../packages/sofinder-http","options":{"symlink":false,"versions":{"sohophp/sofinder-http":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.laravel '{"type":"path","url":"../../packages/sofinder-laravel","options":{"symlink":false,"versions":{"sohophp/sofinder-laravel":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" require sohophp/sofinder-laravel:1.0.0 --no-interaction --prefer-dist "${preference_args[@]}"
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\Laravel\\SoFinderServiceProvider") && class_exists("SohoPHP\\SoFinder\\Laravel\\Console\\SecurityAuditCommand") && class_exists("SohoPHP\\SoFinder\\Http\\EndpointDispatcher") ? 0 : 1);'
test -s vendor/sohophp/sofinder-laravel/LICENSE
test -s vendor/sohophp/sofinder-laravel/README.md
test -s vendor/sohophp/sofinder-laravel/config/sofinder.php

cd "$legacy_conflict_test_dir"
"$repository_root/scripts/composer.sh" init --name=sohophp/legacy-conflict-install-test --no-interaction
"$repository_root/scripts/composer.sh" config repositories.core '{"type":"path","url":"../../packages/sofinder-core","options":{"symlink":false,"versions":{"sohophp/sofinder-core":"1.0.0"}}}'
"$repository_root/scripts/composer.sh" config repositories.legacy '{"type":"package","package":{"name":"sohophp/sofinder-legacy","version":"7.2.0","type":"metapackage"}}'
"$repository_root/scripts/composer.sh" require sohophp/sofinder-core:1.0.0 --no-update --no-interaction
"$repository_root/scripts/composer.sh" require sohophp/sofinder-legacy:7.2.0 --no-update --no-interaction
if "$repository_root/scripts/composer.sh" update --no-interaction --dry-run >/dev/null 2>&1; then
    echo 'Composer unexpectedly allowed SoFinder PHP 8 and legacy packages to coexist.' >&2
    exit 1
fi
