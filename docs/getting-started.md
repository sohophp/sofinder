---
title: Installation and quick start
description: Choose and install SoFinder for Symfony, Laravel, Slim, Mezzio or framework-free PHP.
---

# Installation and quick start

Choose the package for the application that will host SoFinder. Framework
bridges provide the browser and HTTP API; Core by itself provides neither.

| Your application | Install | Detailed steps |
| --- | --- | --- |
| Symfony 6.4 or 7.4 | `sohophp/sofinder-symfony:^1.1` | Continue below |
| Laravel 12 or 13 | `sohophp/sofinder-laravel:^1.1` | [Laravel integration](/framework-integrations#laravel-12-and-13) |
| Slim 4 | `sohophp/sofinder-psr15:^1.1` | [Slim integration](/framework-integrations#slim-4) |
| Mezzio 3 | `sohophp/sofinder-psr15:^1.1` | [Mezzio integration](/framework-integrations#mezzio-3) |
| No framework | `sohophp/sofinder-psr15:^1.1` | [Plain PHP integration](/framework-integrations#plain-php) |
| Domain services only, no browser/API | `sohophp/sofinder-core:^1.1` | [Core-only integration](/framework-integrations#core-only-and-other-frameworks) |

Do not install the Symfony compatibility Meta Package in Laravel or PSR-15
applications: `sohophp/sofinder` resolves the Symfony bridge. With the
documented defaults, every full integration opens at `/sofinder/browser`.

## Symfony quick start

The following steps create an authenticated browser backed by a private local
directory. For advanced ACL, delivery and UI options, continue with the
[complete Symfony integration guide](/symfony).

### Requirements

- PHP 8.1 through 8.5 with Symfony 6.4
- PHP 8.2 through 8.5 with Symfony 7.4
- `ext-fileinfo`, `ext-json` and `ext-mbstring`
- A Symfony security firewall that authenticates users accessing SoFinder
- Optional `ext-gd` or `ext-imagick` for thumbnails and image editing
- Optional `ext-zip` for ZIP downloads

### 1. Install the package

```bash
composer require sohophp/sofinder-symfony:^1.1
```

Existing applications may keep the compatible `sohophp/sofinder:^1.1` Meta
Package. Both package names expose the same namespace and Bundle entry point.
Review the [upgrade guide](/upgrading) before changing an existing installation.

### 2. Register the bundle

Add the bundle to `config/bundles.php` if your application does not register it automatically:

```php
<?php

return [
    // ...
    SohoPHP\SoFinder\SoFinderBundle::class => ['all' => true],
];
```

### 3. Import the routes

Create `config/routes/so_finder.yaml`:

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

The browser is now routed at `/sofinder/browser`; JSON, upload, content and asset routes share the same prefix.

### 4. Configure a private local resource

Create `config/packages/so_finder.yaml`:

```yaml
so_finder:
  resources:
    Documents:
      adapter: local
      root: '%kernel.project_dir%/var/sofinder/documents'
      public_url: ''
      delivery_mode: proxy
      allowed_extensions: [txt, md, csv, tsv, rtf, pdf, doc, docx, odt, xls, xlsx, ods, ppt, pptx, odp, jpg, jpeg, png, gif, webp, avif, bmp, ico, heic, heif, tif, tiff, zip, 7z, rar, tar, gz, tgz, mp3, wav, ogg, m4a, flac, mp4, webm, mov]
      max_size: 20971520
      roles: [ROLE_USER]
```

Create the directory and make it writable by the PHP runtime user:

```bash
mkdir -p var/sofinder/documents
```

<SecurityCallout title="Security">
Never expose private storage paths directly. Keep private resources outside
`public/`; with `delivery_mode: proxy`, SoFinder authenticates and authorizes
every content request before streaming the file.
</SecurityCallout>

This recommended allowlist covers common text, PDF, Microsoft Office,
OpenDocument, image, archive, audio and video files. Reduce it for resources
with a narrower purpose. PHP, scripts, HTML and executable formats remain on
the default denylist; an empty `allowed_extensions` list means “allow every
extension not denied”, not “allow nothing”.

### 5. Protect the route

SoFinder's default authorization requires a fully authenticated Symfony user. Your application must ensure that the route prefix is covered by an appropriate firewall and access policy. For example:

```yaml
# config/packages/security.yaml
security:
  access_control:
    - { path: '^/sofinder/live$', roles: PUBLIC_ACCESS }
    - { path: '^/sofinder', roles: ROLE_USER }
```

The host application remains responsible for its login flow and user provider.

### 6. Validate the installation

```bash
bin/console cache:warmup
bin/console sofinder:security:audit
bin/console sofinder:image:capabilities
```

Then open `/sofinder/browser` as an authenticated user. Confirm that you can create a folder, upload an allowed file, download it and move it to the recycle bin.

## Next steps

- Give content editors the [CMS editor guide](/cms-user-guide) first. Use the
  [complete file manager guide](/user-guide), [image guide](/image-guide) and
  [editor integration guides](/editor-integrations) as deeper references.
- Review every option in [configuration](/configuration).
- Choose the correct [public or proxy delivery model](/symfony#host-application-entry-routes).
- Add [S3-compatible storage](/s3) without pulling AWS dependencies into the core package.
- Configure [maintenance](/maintenance) and production [security controls](/security).
- Use the runnable applications in [`examples/symfony`](https://github.com/sohophp/sofinder/tree/main/examples/symfony) to verify Symfony 6.4 and 7.4 integration.
- Build custom integrations with the [developer guide](/developer-guide) and [HTTP API reference](/api-reference).
