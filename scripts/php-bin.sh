#!/usr/bin/env sh
set -eu

if [ "${PHP_BIN:-}" != "" ]; then
  exec "$PHP_BIN" "$@"
fi

for candidate in php85 php84 php83 php82 php; do
  if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -r 'exit(PHP_VERSION_ID >= 80200 ? 0 : 1);' >/dev/null 2>&1; then
    exec "$candidate" "$@"
  fi
done

echo "SoFinder requires PHP 8.2 or newer. Set PHP_BIN to the intended executable." >&2
exit 1
