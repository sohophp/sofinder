#!/usr/bin/env bash
set -euo pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
php_bin=${PHP_BIN:-php}
composer_bin=${COMPOSER_BIN:-$(command -v composer)}

cd "$project_dir"
"$php_bin" "$composer_bin" validate --strict
"$php_bin" vendor/bin/phpunit
"$php_bin" vendor/bin/phpstan analyse --no-progress --memory-limit=512M
"$php_bin" "$composer_bin" audit

cd "$project_dir/frontend"
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test:unit
pnpm build
git -C "$project_dir" diff --exit-code -- dist
pnpm audit --audit-level=high --registry=https://registry.npmjs.org
pnpm test:e2e

cd "$project_dir/docs"
pnpm install --frozen-lockfile
pnpm check

cd "$project_dir/examples/symfony"
"$php_bin" bin/console cache:warmup --env=prod --no-interaction
"$php_bin" bin/console sofinder:image:capabilities --env=prod --json
"$php_bin" bin/console sofinder:security:audit --env=prod

cd "$project_dir"
git diff --check
echo "SoFinder release checks passed."
