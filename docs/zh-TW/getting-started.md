---
title: 安裝與快速開始
description: 根據 Symfony、Laravel、Slim、Mezzio 或無框架 PHP 應用程式選擇並安裝 SoFinder。
---

# 安裝與快速開始

請根據承載 SoFinder 的應用程式選擇套件。框架 Bridge 提供瀏覽器和 HTTP API；單獨安裝
Core 不會提供這兩項功能。

| 你的應用程式 | 安裝套件 | 詳細步驟 |
| --- | --- | --- |
| Symfony 6.4 或 7.4 | `sohophp/sofinder-symfony:^1.1` | 繼續閱讀本頁 |
| Laravel 12 或 13 | `sohophp/sofinder-laravel:^1.1` | [Laravel 整合](/zh-TW/framework-integrations#laravel-12-和-13) |
| Slim 4 | `sohophp/sofinder-psr15:^1.1` | [Slim 整合](/zh-TW/framework-integrations#slim-4) |
| Mezzio 3 | `sohophp/sofinder-psr15:^1.1` | [Mezzio 整合](/zh-TW/framework-integrations#mezzio-3) |
| 不使用框架 | `sohophp/sofinder-psr15:^1.1` | [純 PHP 整合](/zh-TW/framework-integrations#純-php) |
| 只需領域服務，不要瀏覽器/API | `sohophp/sofinder-core:^1.1` | [僅 Core 整合](/zh-TW/framework-integrations#僅使用-core-和其他框架) |

Laravel 或 PSR-15 應用程式不要安裝 Symfony 相容 Meta Package：`sohophp/sofinder`
會解析到 Symfony Bridge。採用文件預設值時，所有完整整合都透過
`/sofinder/browser` 開啟。

## Symfony 快速開始

以下步驟建立一個使用私有本機目錄、需要登入驗證的檔案瀏覽器。ACL、交付方式和 UI 的
進階設定請繼續閱讀[完整 Symfony 整合指南](/zh-TW/symfony)。

### 系統需求

- Symfony 6.4 搭配 PHP 8.1–8.5
- Symfony 7.4 搭配 PHP 8.2–8.5
- `ext-fileinfo`、`ext-json` 與 `ext-mbstring`
- 可驗證 SoFinder 使用者的 Symfony Security firewall
- 選用 GD 或 Imagick，提供縮圖與圖片編輯功能
- 選用 `ext-zip`，提供 ZIP 下載功能

### 1. 安裝套件

```bash
composer require sohophp/sofinder-symfony:^1.1
```

既有應用程式可以繼續使用相容 Meta Package `sohophp/sofinder:^1.1`；兩個 Package 名稱
都公開相同的 namespace 與 Bundle 入口。變更既有安裝版本前先閱讀[升級指南](/zh-TW/upgrading)。

### 2. 註冊 Bundle

若應用程式未自動註冊，請將 Bundle 加入 `config/bundles.php`：

```php
<?php

return [
    // ...
    SohoPHP\SoFinder\SoFinderBundle::class => ['all' => true],
];
```

### 3. 匯入路由

建立 `config/routes/so_finder.yaml`：

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

檔案瀏覽器現在位於 `/sofinder/browser`；JSON、上傳、內容與資產路由使用相同前綴。

### 4. 設定私有本機資源

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

建立目錄，並讓 PHP 執行使用者擁有寫入權限：

```bash
mkdir -p var/sofinder/documents
```

<SecurityCallout title="安全">
絕不能直接公開私有儲存路徑。請將私有資源放在 `public/` 以外；使用
`delivery_mode: proxy` 時，SoFinder 會先驗證使用者及其存取權限，再串流檔案。
</SecurityCallout>

這份建議白名單涵蓋常用文字、PDF、Microsoft Office、OpenDocument、圖片、
壓縮檔、音訊和視訊檔案。用途更單一的資源應進一步縮小範圍。PHP、腳本、
HTML 和可執行格式仍在預設拒絕清單中；`allowed_extensions` 為空表示「允許所有
未被拒絕的副檔名」，並非「不允許任何副檔名」。

### 5. 保護路由

SoFinder 預設要求通過完整驗證的 Symfony 使用者。宿主應用程式必須確保路由前綴受適當的 firewall 與存取規則保護，例如：

```yaml
# config/packages/security.yaml
security:
  access_control:
    - { path: '^/sofinder/live$', roles: PUBLIC_ACCESS }
    - { path: '^/sofinder', roles: ROLE_USER }
```

宿主應用程式仍負責登入流程與使用者 provider。

### 6. 驗證安裝

```bash
bin/console cache:warmup
bin/console sofinder:security:audit
bin/console sofinder:image:capabilities
```

以已登入使用者開啟 `/sofinder/browser`，確認可以建立資料夾、上傳允許的檔案、下載檔案及移至回收站。

## 下一步

- 先為內容編輯者提供 [CMS 快速指南](/zh-TW/cms-user-guide)。需要深入瞭解時，再提供
  [完整檔案管理指南](/zh-TW/user-guide)、[圖片管理](/zh-TW/image-guide)和
  [編輯器整合指南](/zh-TW/editor-integrations)。
- 查看[設定參考](/zh-TW/configuration)的所有選項。
- 選擇正確的[公開或代理傳遞模式](/zh-TW/symfony#宿主應用程式入口路由)。
- 透過獨立套件加入 [S3 相容儲存](/zh-TW/s3)，不讓 AWS 相依套件進入核心。
- 設定[維護模式](/zh-TW/maintenance)與正式環境的[安全控制](/zh-TW/security)。
- 使用可執行的 [`examples/symfony`](https://github.com/sohophp/sofinder/tree/main/examples/symfony) 應用程式，驗證 Symfony 6.4 與 7.4 整合。
- 使用[開發者指南](/zh-TW/developer-guide)和 [HTTP API 參考](/zh-TW/api-reference)建置自訂整合。
