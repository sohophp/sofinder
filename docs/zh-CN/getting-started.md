---
title: 安装与快速开始
description: 在 Symfony 6.4 或 7.4 安装 SoFinder，并配置安全的本机文件资源。
---

# 安装与快速开始

本指南会建立一个位于 `/sofinder/browser`、需要登录验证的文件浏览器，并使用网站公开根目录以外的本机目录作为存储空间。

## 系统需求

- PHP 8.2–8.5
- Symfony 6.4 或 7.4
- `ext-fileinfo`、`ext-json` 与 `ext-mbstring`
- 可验证 SoFinder 用户的 Symfony Security firewall
- 可选 GD 或 Imagick，提供缩略图与图片编辑功能
- 可选 `ext-zip`，提供 ZIP 下载功能

## 1. 安装软件包

```bash
composer require sohophp/sofinder:^0.1@beta
```

Beta 期间请明确保留 beta 版本限制；变更版本前先阅读[升级指南](/zh-CN/upgrading)。

## 2. 注册 Bundle

若应用程序未自动注册，请将 Bundle 加入 `config/bundles.php`：

```php
<?php

return [
    // ...
    SohoPHP\SoFinder\SoFinderBundle::class => ['all' => true],
];
```

## 3. 导入路由

建立 `config/routes/so_finder.yaml`：

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

文件浏览器现在位于 `/sofinder/browser`；JSON、上传、内容与资产路由使用相同前缀。

## 4. 配置私有本机资源

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

私有资源不可放在 `public/` 下。使用 `delivery_mode: proxy` 时，SoFinder 会先验证用户及其存取权限，再流式传输文件。

这份推荐白名单覆盖常用文本、PDF、Microsoft Office、OpenDocument、图片、
压缩包、音频和视频文件。用途更单一的资源应进一步缩小范围。PHP、脚本、
HTML 和可执行格式仍在默认拒绝列表中；`allowed_extensions` 为空表示“允许所有
未被拒绝的扩展名”，并非“不允许任何扩展名”。

## 5. 保护路由

SoFinder 默认要求通过完整验证的 Symfony 用户。宿主应用程序必须确保路由前缀受适当的 firewall 与存取规则保护，例如：

```yaml
# config/packages/security.yaml
security:
  access_control:
    - { path: '^/sofinder', roles: ROLE_USER }
```

宿主应用程序仍负责登录流程与用户 provider。

## 6. 验证安装

```bash
bin/console cache:warmup
bin/console sofinder:security:audit
bin/console sofinder:image:capabilities
```

以已登录用户开启 `/sofinder/browser`，确认可以建立文件夹、上传允许的文件、下载文件及移至回收站。

## 下一步

- 为普通用户提供[文件管理](/zh-CN/user-guide)、[图片管理](/zh-CN/image-guide)和 [CKEditor 4](/zh-CN/ckeditor4) 指南。
- 查看[配置参考](/zh-CN/configuration)的所有选项。
- 选择正确的[公开或代理传递模式](/zh-CN/symfony#宿主应用程序入口路由)。
- 通过独立软件包加入 [S3 兼容存储](/zh-CN/s3)，不让 AWS 相依软件包进入核心。
- 配置[维护模式](/zh-CN/maintenance)与正式环境的[安全控制](/zh-CN/security)。
- 使用可执行的 [`examples/symfony`](https://github.com/sohophp/sofinder/tree/main/examples/symfony) 应用程序，验证 Symfony 6.4 与 7.4 整合。
- 使用[开发者指南](/zh-CN/developer-guide)和 [HTTP API 参考](/zh-CN/api-reference)构建自定义集成。
