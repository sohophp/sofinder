---
title: 安裝與快速開始
description: 在 Symfony 6.4 或 7.4 安裝 SoFinder 並設定安全的本機檔案資源。
---

# 安裝與快速開始

## 系統需求

- PHP 8.2–8.5
- Symfony 6.4 或 7.4
- `ext-fileinfo`、`ext-json`、`ext-mbstring`
- 涵蓋 SoFinder 路徑的 Symfony 登入與防火牆
- 圖片功能可選用 GD 或 Imagick；ZIP 下載需要 `ext-zip`

## 安裝套件

```bash
composer require sohophp/sofinder:^0.1@beta
```

在 `config/bundles.php` 註冊 Bundle：

```php
SohoPHP\SoFinder\SoFinderBundle::class => ['all' => true],
```

建立 `config/routes/so_finder.yaml`：

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

建立 `config/packages/so_finder.yaml`：

```yaml
so_finder:
  resources:
    Documents:
      adapter: local
      root: '%kernel.project_dir%/var/sofinder/documents'
      public_url: ''
      delivery_mode: proxy
      allowed_extensions: [jpg, jpeg, png, webp, pdf, txt, zip]
      max_size: 20971520
      roles: [ROLE_USER]
```

`proxy` 模式會先驗證使用者及路徑權限，再串流檔案。私有資源根目錄不可放在 `public/` 下。

## 驗證安裝

```bash
bin/console cache:warmup
bin/console sofinder:security:audit
bin/console sofinder:image:capabilities
```

以已登入使用者開啟 `/sofinder/browser`，測試建立資料夾、上傳、下載及移至回收站。正式環境部署前請繼續閱讀[安全部署](/zh-TW/security)。
