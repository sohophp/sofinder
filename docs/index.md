---
layout: home
markdownStyles: false
title: SoFinder documentation
titleTemplate: Secure file management for PHP and Symfony
description: Install, configure and extend SoFinder, a secure web file manager for PHP 8.2–8.5 and Symfony 6.4/7.4.

hero:
  name: Secure file management
  text: for PHP and Symfony
  tagline: An MIT-licensed file manager with local and S3-compatible storage, granular access control, resilient uploads and image tools.
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
    icon: { src: /feature-security.svg, alt: '' }
    details: Sandboxed paths, private quarantine, CSRF protection, inherited ACLs and operation gates.
    link: /security
    linkText: Learn about security
  - title: Productive file browser
    icon: { src: /feature-browser.svg, alt: '' }
    details: Responsive file browser with folders, previews, search, drag and drop, bulk operations and recycle bin.
    link: /cms-user-guide
    linkText: Start as a content editor
  - title: Flexible storage
    icon: { src: /feature-storage.svg, alt: '' }
    details: Local and S3-compatible storage including AWS S3, Cloudflare R2 and MinIO.
    link: /storage-adapters
    linkText: Storage options
  - title: Framework-friendly core
    icon: { src: /feature-framework.svg, alt: '' }
    details: Symfony bundle, public PHP contracts, events, tagged services and extensible APIs.
    link: /developer-guide
    linkText: Integrate SoFinder
  - title: Ready for real applications
    icon: { src: /feature-ready.svg, alt: '' }
    details: Image processing, resilient uploads, picker mode, stable asset IDs and private delivery.
    link: /image-guide
    linkText: Explore capabilities
  - title: Operationally bounded
    icon: { src: /feature-operations.svg, alt: '' }
    details: Quotas, pagination, rate limits, maintenance commands and deploy-time security audits.
    link: /production
    linkText: Production operations
---

## Install in a Symfony application

```bash
composer require sohophp/sofinder-symfony:^1.1
```

Existing applications may keep `sohophp/sofinder:^1.1`, the compatible Meta
Package. Both package names expose the same namespace. Register the bundle,
import its routes and define at least one storage resource. The [installation
guide](/getting-started) provides a working minimal configuration; the
[Symfony guide](/symfony) covers authorization, delivery modes, UI options and
host-generated URLs.

::: tip Supported framework lines
Symfony 6.4/7.4, Laravel 12/13 and the shared PSR-15 hosts are supported
full-stack integrations on their documented PHP 8 matrix. Follow the
[framework integration guide](/framework-integrations) for installable Laravel,
Slim, Mezzio and plain PHP examples, and see the [framework support
policy](/framework-support) for the compatibility matrix. The PHP 8 main line is never
downgraded for PHP 7.2; Legacy feasibility is evaluated independently.
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

Using SoFinder inside a CMS? Start with the [CMS editor guide](/cms-user-guide).
For every file-management control, continue with the [complete user guide](/user-guide)
and [image guide](/image-guide). Building an integration? See the [developer
guide](/developer-guide) and [HTTP API reference](/api-reference).
