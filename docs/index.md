---
layout: home
title: SoFinder documentation
titleTemplate: Secure file management for PHP and Symfony
description: Install, configure and extend SoFinder, a secure web file manager for PHP 8.2–8.5 and Symfony 6.4/7.4.

hero:
  name: SoFinder
  text: Secure file management for PHP and Symfony
  tagline: An MIT-licensed file manager with local and S3-compatible storage, granular access control, resilient uploads and image tools.
  image:
    src: /logo.svg
    alt: SoFinder logo
  actions:
    - theme: brand
      text: Get started
      link: /getting-started
    - theme: alt
      text: Configuration
      link: /configuration
    - theme: alt
      text: View on GitHub
      link: https://github.com/sohophp/sofinder

features:
  - title: Secure by design
    details: Sandboxed paths, private quarantine, CSRF protection, inherited ACLs, operation gates and bounded archive and image processing.
  - title: Productive file browser
    details: Search, grid and list views, uploads, folders, copy and move, recycle bin, metadata, image editing and CKEditor integration.
  - title: Flexible storage
    details: Use local storage or the optional S3 adapter with AWS S3, Cloudflare R2, MinIO and compatible providers.
  - title: Framework-friendly core
    details: Public PHP contracts, tagged storage and UI plugins, PSR-3 audit events and a Symfony 6.4/7.4 bundle.
  - title: Ready for real applications
    details: Responsive React interface, English, Simplified and Traditional Chinese UI, picker mode and public or authenticated delivery.
  - title: Operationally bounded
    details: Quotas, pagination, request and concurrency limits, scheduled maintenance commands and deploy-time security audits.
---

## Install in a Symfony application

```bash
composer require sohophp/sofinder:^0.1@beta
```

Register the bundle, import its routes and define at least one storage resource. The [installation guide](/getting-started) provides a working minimal configuration; the [Symfony guide](/symfony) covers authorization, delivery modes, UI options and host-generated URLs.

::: warning Beta release
SoFinder is currently in public beta. Pin an explicit beta constraint, read the [changelog](/changelog) before upgrading and treat public extension interfaces according to the [versioning policy](/versioning).
:::

## Choose a storage model

| Requirement | Recommended setup |
| --- | --- |
| Public website images | Local or S3 storage with `delivery_mode: public` and an explicit public/CDN URL |
| Private documents | Local or S3 storage with `delivery_mode: proxy` |
| Recoverable local deletion | Local adapter with the built-in private recycle bin |
| Recoverable S3 deletion | Provider-side bucket versioning and lifecycle protection |
| Database-owned download URLs | Configure `entry_url` and provide host application context |

Start with the [storage adapter guide](/storage-adapters), or go directly to [S3-compatible storage](/s3).

Using an existing installation? Start with the [file manager user guide](/user-guide), [image guide](/image-guide) or [CKEditor 4 guide](/ckeditor4). Building an integration? See the [developer guide](/developer-guide) and [HTTP API reference](/api-reference).
