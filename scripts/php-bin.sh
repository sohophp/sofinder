#!/usr/bin/env sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

if [ "${PHP_BIN:-}" != "" ]; then
  if ! "$PHP_BIN" -r 'exit(PHP_VERSION_ID >= 80200 ? 0 : 1);' >/dev/null 2>&1; then
    echo "PHP_BIN must point to PHP 8.2 or newer." >&2
    exit 1
  fi
  exec "$PHP_BIN" "$@"
fi

version_file="$project_dir/.php-version"
if [ ! -r "$version_file" ]; then
  echo "Missing $version_file; declare the repository PHP version before running commands." >&2
  exit 1
fi

requested=$(sed -e 's/[[:space:]]//g' -e 's/#.*//' "$version_file" | sed -n '1p')
case "$requested" in
  *.*) ;;
  *)
    echo "Invalid PHP version '$requested' in $version_file; expected major.minor." >&2
    exit 1
    ;;
esac
major=${requested%%.*}
remainder=${requested#*.}
minor=${remainder%%.*}
case "$major.$minor" in
  *[!0-9.]*|.*|*.)
    echo "Invalid PHP version '$requested' in $version_file; expected major.minor." >&2
    exit 1
    ;;
esac

for candidate in "php${major}${minor}" "php${major}.${minor}" php; do
  if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -r "exit(PHP_MAJOR_VERSION === $major && PHP_MINOR_VERSION === $minor ? 0 : 1);" >/dev/null 2>&1; then
    exec "$candidate" "$@"
  fi
done

echo "SoFinder development requires PHP $major.$minor from .php-version, but no matching executable was found. Install it or set PHP_BIN explicitly for a compatibility run." >&2
exit 1
