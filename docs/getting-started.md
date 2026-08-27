---
title: Installation and quick start
description: Install SoFinder in Symfony 6.4 or 7.4 and configure a secure local file resource.
---

# Installation and quick start

This guide creates an authenticated file browser at `/sofinder/browser` backed by a local directory outside the public web root.

## Requirements

- PHP 8.2 through 8.5
- Symfony 6.4 or 7.4
- `ext-fileinfo`, `ext-json` and `ext-mbstring`
- A Symfony security firewall that authenticates users accessing SoFinder
- Optional `ext-gd` or `ext-imagick` for thumbnails and image editing
- Optional `ext-zip` for ZIP downloads

## 1. Install the package

```bash
composer require sohophp/sofinder:^0.1@beta
```

During the beta period, keep the beta constraint explicit and review the [upgrade guide](/upgrading) before changing versions.

## 2. Register the bundle

Add the bundle to `config/bundles.php` if your application does not register it automatically:

```php
<?php

return [
    // ...
    SohoPHP\SoFinder\SoFinderBundle::class => ['all' => true],
];
```

## 3. Import the routes

Create `config/routes/so_finder.yaml`:

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

The browser is now routed at `/sofinder/browser`; JSON, upload, content and asset routes share the same prefix.

## 4. Configure a private local resource

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

Do not put a private resource below `public/`. With `delivery_mode: proxy`, SoFinder authenticates and authorizes content requests before streaming the file.

This recommended allowlist covers common text, PDF, Microsoft Office,
OpenDocument, image, archive, audio and video files. Reduce it for resources
with a narrower purpose. PHP, scripts, HTML and executable formats remain on
the default denylist; an empty `allowed_extensions` list means “allow every
extension not denied”, not “allow nothing”.

## 5. Protect the route

SoFinder's default authorization requires a fully authenticated Symfony user. Your application must ensure that the route prefix is covered by an appropriate firewall and access policy. For example:

```yaml
# config/packages/security.yaml
security:
  access_control:
    - { path: '^/sofinder', roles: ROLE_USER }
```

The host application remains responsible for its login flow and user provider.

## 6. Validate the installation

```bash
bin/console cache:warmup
bin/console sofinder:security:audit
bin/console sofinder:image:capabilities
```

Then open `/sofinder/browser` as an authenticated user. Confirm that you can create a folder, upload an allowed file, download it and move it to the recycle bin.

## Next steps

- Give users the [file manager](/user-guide), [image](/image-guide) and [CKEditor 4](/ckeditor4) guides.
- Review every option in [configuration](/configuration).
- Choose the correct [public or proxy delivery model](/symfony#host-application-entry-routes).
- Add [S3-compatible storage](/s3) without pulling AWS dependencies into the core package.
- Configure [maintenance](/maintenance) and production [security controls](/security).
- Use the runnable applications in [`examples/symfony`](https://github.com/sohophp/sofinder/tree/main/examples/symfony) to verify Symfony 6.4 and 7.4 integration.
- Build custom integrations with the [developer guide](/developer-guide) and [HTTP API reference](/api-reference).
