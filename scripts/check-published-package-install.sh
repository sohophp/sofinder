#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
version=${SOFINDER_PUBLISHED_VERSION:-1.0.0}

if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]; then
    echo 'SOFINDER_PUBLISHED_VERSION must be an exact Composer version.' >&2
    exit 2
fi

mkdir -p "$repository_root/var"
test_root=$(mktemp -d "$repository_root/var/published-install.XXXXXX")
trap 'rm -rf -- "$test_root"' EXIT
export COMPOSER_CACHE_DIR="$test_root/composer-cache"
export COMPOSER_NO_INTERACTION=1

create_consumer() {
    local directory=$1
    local name=$2

    mkdir -p "$directory"
    cd "$directory"
    "$repository_root/scripts/composer.sh" init --name="$name" --no-interaction
}

verify_package() {
    "$repository_root/scripts/php-bin.sh" \
        "$repository_root/scripts/verify-published-composer-package.php" "$@"
}

core_dir="$test_root/core"
create_consumer "$core_dir" sohophp/published-core-install-test
"$repository_root/scripts/composer.sh" require "sohophp/sofinder-core:$version" --prefer-dist --no-interaction
verify_package sohophp/sofinder-core "$version" https://github.com/sohophp/sofinder-core
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\FileManager") && class_exists("SohoPHP\\SoFinder\\Configuration\\ConfigurationNormalizer") && !class_exists("Symfony\\Component\\HttpFoundation\\Request") && !class_exists("Illuminate\\Foundation\\Application") ? 0 : 1);'

http_dir="$test_root/http"
create_consumer "$http_dir" sohophp/published-http-install-test
"$repository_root/scripts/composer.sh" require "sohophp/sofinder-http:$version" --prefer-dist --no-interaction
verify_package sohophp/sofinder-core "$version" https://github.com/sohophp/sofinder-core
verify_package sohophp/sofinder-http "$version" https://github.com/sohophp/sofinder-http
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; exit(class_exists("SohoPHP\\SoFinder\\Http\\EndpointDispatcher") && class_exists("SohoPHP\\SoFinder\\Http\\EndpointDefinition") && !class_exists("Symfony\\Component\\HttpFoundation\\Request") && !class_exists("Illuminate\\Foundation\\Application") ? 0 : 1);'

symfony_dir="$test_root/symfony"
create_consumer "$symfony_dir" sohophp/published-symfony-install-test
"$repository_root/scripts/composer.sh" require "sohophp/sofinder-symfony:$version" --prefer-dist --no-interaction
verify_package sohophp/sofinder-core "$version" https://github.com/sohophp/sofinder-core
verify_package sohophp/sofinder-http "$version" https://github.com/sohophp/sofinder-http
verify_package sohophp/sofinder-symfony "$version" https://github.com/sohophp/sofinder-symfony
"$repository_root/scripts/php-bin.sh" -r 'require "vendor/autoload.php"; $class = new ReflectionClass("SohoPHP\\SoFinder\\SoFinderBundle"); $package = dirname((string) $class->getFileName(), 2); $routes = (string) file_get_contents($package . "/src/Resources/config/routes.yaml"); $routeCount = preg_match_all("/^sofinder[^:\\r\\n]*:/m", $routes); exit(is_file($package . "/dist/manifest.json") && class_exists("SohoPHP\\SoFinder\\Http\\ApiController") && class_exists("SohoPHP\\SoFinder\\Http\\BrowserController") && $routeCount === 52 && str_contains((string) $class->getFileName(), "/vendor/sohophp/sofinder-symfony/src/") ? 0 : 1);'
"$repository_root/scripts/composer.sh" audit --locked --no-interaction

echo "Published SoFinder $version Core, HTTP and Symfony packages passed clean-project installation."
