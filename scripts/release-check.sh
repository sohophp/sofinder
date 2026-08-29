#!/usr/bin/env bash
set -euo pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
php_bin="$project_dir/scripts/php-bin.sh"
composer_bin="$project_dir/scripts/composer.sh"

cd "$project_dir"
mkdir -p "$project_dir/var"
"$composer_bin" validate --strict
"$php_bin" vendor/bin/phpunit
"$php_bin" vendor/bin/phpstan analyse --no-progress --memory-limit=512M
"$composer_bin" audit

cd "$project_dir/frontend"
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test:unit
pnpm build
pnpm check:size
git -C "$project_dir" diff --exit-code -- dist
diff -qr "$project_dir/dist" "$project_dir/packages/sofinder-symfony/dist"
pnpm audit --audit-level=high --registry=https://registry.npmjs.org
pnpm test:e2e

cd "$project_dir/docs"
pnpm install --frozen-lockfile
pnpm check

cd "$project_dir/examples/symfony"
"$php_bin" bin/console cache:clear --env=prod --no-debug --no-interaction
"$php_bin" bin/console sofinder:image:capabilities --env=prod --no-debug --json
"$php_bin" bin/console sofinder:security:audit --env=prod --no-debug

cd "$project_dir"
bash scripts/check-symfony-example-http.sh
cd "$project_dir/frontend"
pnpm exec playwright test --config playwright.symfony.config.ts

cd "$project_dir"
bash scripts/check-package-install.sh
release_archive_dir=$(mktemp -d "$project_dir/var/release-archives.XXXXXX")
bash scripts/build-release-archives.sh 1.0.0-rc.1 WORKTREE "$release_archive_dir"
"$php_bin" scripts/check-framework-release-gate.php
bash scripts/check-framework-release-gate-fixtures.sh
bash scripts/check-observation-evidence-fixtures.sh
bash scripts/check-promotion-run-evidence-fixtures.sh
bash scripts/check-live-promotion-evidence.sh
bash scripts/check-gated-bridge-release-artifacts.sh
git diff --check
echo "SoFinder release checks passed."
