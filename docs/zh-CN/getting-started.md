---
title: 安装与快速开始
description: 根据 Symfony、Laravel、Slim、Mezzio 或无框架 PHP 应用选择并安装 SoFinder。
---

# 安装与快速开始

请根据承载 SoFinder 的应用选择软件包。框架 Bridge 提供浏览器和 HTTP API；单独安装
Core 不会提供这两项功能。

| 你的应用 | 安装包 | 详细步骤 |
| --- | --- | --- |
| Symfony 6.4 或 7.4 | `sohophp/sofinder-symfony:^1.1` | 继续阅读本页 |
| Laravel 12 或 13 | `sohophp/sofinder-laravel:^1.1` | [Laravel 集成](/zh-CN/framework-integrations#laravel-12-和-13) |
| Slim 4 | `sohophp/sofinder-psr15:^1.1` | [Slim 集成](/zh-CN/framework-integrations#slim-4) |
| Mezzio 3 | `sohophp/sofinder-psr15:^1.1` | [Mezzio 集成](/zh-CN/framework-integrations#mezzio-3) |
| 不使用框架 | `sohophp/sofinder-psr15:^1.1` | [纯 PHP 集成](/zh-CN/framework-integrations#纯-php) |
| 只需领域服务，不要浏览器/API | `sohophp/sofinder-core:^1.1` | [仅 Core 集成](/zh-CN/framework-integrations#仅使用-core-和其他框架) |

Laravel 或 PSR-15 应用不要安装 Symfony 兼容 Meta Package：`sohophp/sofinder`
会解析到 Symfony Bridge。采用文档默认值时，所有完整集成都通过
`/sofinder/browser` 打开。

## Symfony 快速开始

以下步骤建立一个使用私有本机目录、需要登录验证的文件浏览器。ACL、交付方式和 UI 的
高级配置请继续阅读[完整 Symfony 集成指南](/zh-CN/symfony)。

### 系统需求

- PHP 8.2–8.5
- Symfony 6.4 或 7.4
- `ext-fileinfo`、`ext-json` 与 `ext-mbstring`
- 可验证 SoFinder 用户的 Symfony Security firewall
- 可选 GD 或 Imagick，提供缩略图与图片编辑功能
- 可选 `ext-zip`，提供 ZIP 下载功能

### 1. 安装软件包

```bash
composer require sohophp/sofinder-symfony:^1.1
```

现有应用可以继续使用兼容 Meta Package `sohophp/sofinder:^1.1`；两个包名都公开相同的
namespace 与 Bundle 入口。变更现有安装版本前先阅读[升级指南](/zh-CN/upgrading)。

### 2. 注册 Bundle

若应用程序未自动注册，请将 Bundle 加入 `config/bundles.php`：

```php
<?php

return [
    // ...
    SohoPHP\SoFinder\SoFinderBundle::class => ['all' => true],
];
```

### 3. 导入路由

建立 `config/routes/so_finder.yaml`：

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

文件浏览器现在位于 `/sofinder/browser`；JSON、上传、内容与资产路由使用相同前缀。

### 4. 配置私有本机资源

建立 `config/packages/so_finder.yaml`：

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

建立目录，并让 PHP 执行用户拥有写入权限：

```bash
mkdir -p var/sofinder/documents
```

<SecurityCallout title="安全">
绝不能直接暴露私有存储路径。请将私有资源放在 `public/` 以外；使用
`delivery_mode: proxy` 时，SoFinder 会先验证用户及其访问权限，再流式传输文件。
</SecurityCallout>

这份推荐白名单覆盖常用文本、PDF、Microsoft Office、OpenDocument、图片、
压缩包、音频和视频文件。用途更单一的资源应进一步缩小范围。PHP、脚本、
HTML 和可执行格式仍在默认拒绝列表中；`allowed_extensions` 为空表示“允许所有
未被拒绝的扩展名”，并非“不允许任何扩展名”。

### 5. 保护路由

SoFinder 默认要求通过完整验证的 Symfony 用户。宿主应用程序必须确保路由前缀受适当的 firewall 与存取规则保护，例如：

```yaml
# config/packages/security.yaml
security:
  access_control:
    - { path: '^/sofinder/live$', roles: PUBLIC_ACCESS }
    - { path: '^/sofinder', roles: ROLE_USER }
```

宿主应用程序仍负责登录流程与用户 provider。

### 6. 验证安装

```bash
bin/console cache:warmup
bin/console sofinder:security:audit
bin/console sofinder:image:capabilities
```

以已登录用户开启 `/sofinder/browser`，确认可以建立文件夹、上传允许的文件、下载文件及移至回收站。

## 下一步

- 先为内容编辑者提供 [CMS 快速指南](/zh-CN/cms-user-guide)。需要深入了解时，再提供
  [完整文件管理指南](/zh-CN/user-guide)、[图片管理](/zh-CN/image-guide)和
  [编辑器集成指南](/zh-CN/editor-integrations)。
- 查看[配置参考](/zh-CN/configuration)的所有选项。
- 选择正确的[公开或代理传递模式](/zh-CN/symfony#宿主应用程序入口路由)。
- 通过独立软件包加入 [S3 兼容存储](/zh-CN/s3)，不让 AWS 相依软件包进入核心。
- 配置[维护模式](/zh-CN/maintenance)与正式环境的[安全控制](/zh-CN/security)。
- 使用可执行的 [`examples/symfony`](https://github.com/sohophp/sofinder/tree/main/examples/symfony) 应用程序，验证 Symfony 6.4 与 7.4 整合。
- 使用[开发者指南](/zh-CN/developer-guide)和 [HTTP API 参考](/zh-CN/api-reference)构建自定义集成。
