<p align="center">
	<a href="https://sofinder.sohophp.app/">
		<img src="docs/public/logo.svg" width="96" height="96" alt="SoFinder logo">
	</a>
</p>

<h1 align="center">SoFinder</h1>

<p align="center"><strong>Secure, extensible file management for modern PHP applications.</strong></p>

<p align="center">
	<a href="https://github.com/sohophp/sofinder/actions/workflows/ci.yml"><img src="https://github.com/sohophp/sofinder/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
	<a href="https://packagist.org/packages/sohophp/sofinder-symfony"><img src="https://img.shields.io/packagist/v/sohophp/sofinder-symfony.svg?label=stable" alt="Latest stable version"></a>
	<a href="https://packagist.org/packages/sohophp/sofinder-symfony"><img src="https://img.shields.io/packagist/dt/sohophp/sofinder-symfony.svg" alt="Total downloads"></a>
	<a href="https://packagist.org/packages/sohophp/sofinder-symfony"><img src="https://img.shields.io/packagist/dependency-v/sohophp/sofinder-symfony/php.svg" alt="PHP requirement"></a>
	<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-16865c.svg" alt="MIT License"></a>
</p>

<p align="center">
	<a href="https://sofinder.sohophp.app/">Documentation</a> ·
	<a href="https://sofinder.sohophp.app/getting-started">Getting started</a> ·
	<a href="https://sofinder.sohophp.app/api-reference">API reference</a> ·
	<a href="README.zh-CN.md">简体中文</a> ·
	<a href="README.zh-TW.md">繁體中文</a>
</p>

SoFinder is an MIT-licensed web file manager for PHP 8.1–8.5. It combines a
framework-independent core, first-party Symfony, Laravel, and PSR-15
integrations, and a responsive React interface.

The project is independently designed and contains no code, artwork,
translations, styles, or other assets from proprietary file managers. Runtime
dependency notices are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Preview

<p align="center">
	<a href="docs/public/screenshots/browser.png">
		<img src="docs/public/screenshots/browser.png" alt="SoFinder file manager with navigation, thumbnails, and file details" width="100%">
	</a>
	<br>
	<sub><strong>File workspace</strong> — Resource navigation, visual browsing, favorites, and file details.</sub>
</p>

<table>
	<tr>
		<td width="50%" align="center">
			<a href="docs/public/screenshots/image-editor.png"><img src="docs/public/screenshots/image-editor.png" alt="SoFinder image crop editor"></a>
			<br><sub><strong>Image editor</strong> — Crop, rotate, resize, optimize, and watermark.</sub>
		</td>
		<td width="50%" align="center">
			<a href="docs/public/screenshots/security-status.png"><img src="docs/public/screenshots/security-status.png" alt="SoFinder security and document preview status"></a>
			<br><sub><strong>Operational status</strong> — Malware scanning and document preview readiness.</sub>
		</td>
	</tr>
</table>

## Highlights

- **Complete file workflows** — Browse, search, upload, download, rename,
	copy, move, batch-process, and recover deleted files.
- **Secure by default** — Sandboxed paths, private upload quarantine, inherited
	ACLs, operation gates, quotas, audit logs, and bounded resource usage.
- **Image tooling** — Cached thumbnails, EXIF-aware rotation, proportional
	resize, Canvas cropping, presets, and format-preserving edits.
- **Flexible storage** — Local filesystems and optional S3-compatible object
	storage with public, CDN, or private proxy delivery.
- **Application integration** — Symfony, Laravel, Slim, Mezzio, plain PSR-15,
	CKEditor, TinyMCE, TipTap, Quill, wangEditor, Jodit, and form fields.
- **Production operations** — Readiness checks, Prometheus metrics, request IDs,
	security audits, maintenance commands, and optional PDO or Redis state.

## Platform Support

| Runtime or framework | Supported versions | Package |
| --- | --- | --- |
| PHP | 8.1–8.5 | — |
| Symfony | 6.4 on PHP 8.1–8.5; 7.4 on PHP 8.2–8.5 | `sohophp/sofinder-symfony` |
| Laravel | 12 on PHP 8.2–8.5; 13 on PHP 8.3–8.5 | `sohophp/sofinder-laravel` |
| Slim | 4 on PHP 8.1–8.5 | `sohophp/sofinder-psr15` |
| Mezzio | 3 on PHP 8.1–8.5 | `sohophp/sofinder-psr15` |
| Framework-free PSR-15 | PHP 8.1–8.5, PSR-7/15 compatible | `sohophp/sofinder-psr15` |

See the [framework support policy](docs/framework-support.md) for the tested PHP
matrix and exact support levels. A future PHP 7.2 port, if provided, will use a
separate package and release line.

## Installation

### Symfony

New Symfony applications should install the stable bridge directly:

```bash
composer require sohophp/sofinder-symfony:^1.1
```

Existing applications may keep using the compatible
`sohophp/sofinder:^1.1` Meta Package. Both package names expose the same
`SohoPHP\SoFinder` namespace.

Register `SohoPHP\SoFinder\SoFinderBundle`, import
`@SoFinderBundle/Resources/config/routes.yaml`, and configure one or more
resource types under `so_finder.resources`. Follow the
[installation guide](https://sofinder.sohophp.app/getting-started) or see
[`docs/symfony.md`](docs/symfony.md) for the complete Symfony reference.

### Laravel

```bash
composer require sohophp/sofinder-laravel:^1.1
```

### PSR-15

For Slim, Mezzio, and framework-free PSR-15 applications:

```bash
composer require sohophp/sofinder-psr15:^1.1
```

See the [framework integration guide](docs/framework-integrations.md) for
complete host-specific setup instructions.

## Capabilities

### File management

Implemented capabilities include authenticated browsing, search, upload,
download, folder creation, rename, recoverable deletion, copy/move with automatic
conflict names, server-bounded pagination, name/size/date sorting, grid/list
views, multi-select and bounded batch copy/move/delete with per-entry results,
folder-tree navigation, context/long-press menus, clipboard and targeted drag
and drop, per-file/chunked upload progress, cancellation, explicit conflict
replacement, cached thumbnails, EXIF-aware image rotation and proportional
resize, Canvas-based cropping, derived-image presets, bounded ZIP downloads,
responsive layout, English, Simplified Chinese, Traditional Chinese, CKEditor 4
browse/upload adapters, and a popup SDK for CKEditor 5, TinyMCE, TipTap, Quill, wangEditor, Jodit
and ordinary form fields. Folder upload, deterministic batch rename, bounded
text preview and SHA-256 checksums are available in the standalone manager.

### Metadata and extensibility

Resources may define byte quotas, required Symfony roles and operation-specific
role overrides. Completed mutations emit structured PSR-3 audit log entries.
Per-user favorites, tags, and 50 recent entries are stored atomically through a
replaceable metadata store interface.
The optional asset catalog adds stable IDs, localized alternative text, titles,
shared tags, responsive variants, bounded cross-folder search, editable asset
properties, host-registered usage references with delete preflight, revocable
private access sessions and an explicit migration command.
The Symfony integration also includes a validated theme configuration, a
tagged plugin descriptor registry, keyboard file navigation, visible focus,
and screen-reader selection announcements. See `docs/plugins.md` for the
public extension contract.

### Production operations

Production integrations can add same-origin plugin UI actions and tagged upload
scanners without weakening core authorization. Optional PDO/Redis atomic state,
readiness and Prometheus endpoints, request IDs and JSON security audits support
multi-node operation; see `docs/production.md` and the OpenAPI document at
`docs/public/openapi.json`.

### Image workflows

Image details report decoded pixel dimensions. Image edits default to an
automatically named copy; overwrite is explicit. Cropping supports zoom, pan,
eight handles, ratios, keyboard/numeric tuning, undo/redo and comparison. A
per-browser gear menu controls optional
image tools; rotation and preset sizes are hidden by default. Copy and move use
a folder picker that can navigate the complete configured resource while the
server continues to enforce its path sandbox and ACLs.
Each resource can independently limit Unicode file-name length, folder-name
length, and folder depth. These limits are enforced for upload, folder
creation, rename, copy, and move, including the descendants of transferred
folder trees.

## Security

Uploads use a private quarantine, actual-byte limits, active-content inspection
and full image decoding before atomic publication. SoFinder also provides
inherited path ACLs, public/proxy delivery, Range/ETag responses, operation
gates, structured failure audits and a private 30-day recycle bin. Run
`sofinder:security:audit` during deployment and schedule
`sofinder:trash:cleanup` and `sofinder:uploads:cleanup` when using an external
scheduler. Bounded inline maintenance is the default; see
`docs/maintenance.md` and `docs/security.md`.

## Runtime Limits

Image processing supports web-embeddable JPEG, PNG, GIF, WebP, AVIF, BMP and
ICO, using GD when available and an optional Imagick ICO fallback. Decoded
images are limited to 50 million pixels and edits preserve the original file
format and extension. HEIC, HEIF and TIFF may be stored in a general file
resource but are not decoded, previewed or edited.
Thumbnail cache entries expire after 30 days and are capped at 5,000 files.
ZIP downloads accept at most 100 selected roots, 1,000 total entries and 512 MB.

## Documentation

| Topic | Guide |
| --- | --- |
| Using the file manager | [User guide](docs/user-guide.md) · [Image guide](docs/image-guide.md) |
| Installation and configuration | [Getting started](docs/getting-started.md) · [Configuration](docs/configuration.md) |
| Framework integration | [Symfony](docs/symfony.md) · [All integrations](docs/framework-integrations.md) |
| Storage | [Storage adapters](docs/storage-adapters.md) · [S3](docs/s3.md) |
| APIs and extension points | [HTTP API](docs/http-api.md) · [PHP contracts](docs/php-contracts.md) · [Plugins](docs/plugins.md) |
| Operations | [Production](docs/production.md) · [Maintenance](docs/maintenance.md) · [Security](docs/security.md) |
| Compatibility and upgrades | [Versioning](docs/versioning.md) · [Upgrading](docs/upgrading.md) |

## Development

```bash
./scripts/composer.sh install
./scripts/php-bin.sh vendor/bin/phpunit
./scripts/composer.sh phpstan
cd frontend
corepack pnpm install
corepack pnpm build
corepack pnpm test:unit
cd ../docs
corepack pnpm install
corepack pnpm build
```

Runnable Symfony 6.4 and 7.4 installation variants are available in
[`examples/symfony`](examples/symfony).

S3-compatible object storage is available as the optional
`sohophp/sofinder-s3` Composer package. It keeps AWS SDK dependencies out of the
core install and supports private proxy delivery or an explicitly configured
public/CDN URL. See `packages/sofinder-s3/README.md` in the source distribution.

## License

SoFinder is released under the [MIT License](LICENSE).
