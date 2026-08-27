---
title: 安裝與快速開始
description: 在 Symfony 6.4 或 7.4 安裝 SoFinder，並設定安全的本機檔案資源。
---

# 安裝與快速開始

本指南會建立一個位於 `/sofinder/browser`、需要登入驗證的檔案瀏覽器，並使用網站公開根目錄以外的本機目錄作為儲存空間。

## 系統需求

- PHP 8.2–8.5
- Symfony 6.4 或 7.4
- `ext-fileinfo`、`ext-json` 與 `ext-mbstring`
- 可驗證 SoFinder 使用者的 Symfony Security firewall
- 選用 GD 或 Imagick，提供縮圖與圖片編輯功能
- 選用 `ext-zip`，提供 ZIP 下載功能

## 1. 安裝套件

```bash
composer require sohophp/sofinder:^0.1@beta
```

Beta 期間請明確保留 beta 版本限制；變更版本前先閱讀[升級指南](/zh-TW/upgrading)。

## 2. 註冊 Bundle

若應用程式未自動註冊，請將 Bundle 加入 `config/bundles.php`：

```php
<?php

return [
    // ...
    SohoPHP\SoFinder\SoFinderBundle::class => ['all' => true],
];
```

## 3. 匯入路由

建立 `config/routes/so_finder.yaml`：

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

檔案瀏覽器現在位於 `/sofinder/browser`；JSON、上傳、內容與資產路由使用相同前綴。

## 4. 設定私有本機資源

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

## 5. 保護路由

SoFinder 預設要求通過完整驗證的 Symfony 使用者。宿主應用程式必須確保路由前綴受適當的 firewall 與存取規則保護，例如：

```yaml
# config/packages/security.yaml
security:
  access_control:
    - { path: '^/sofinder/live$', roles: PUBLIC_ACCESS }
    - { path: '^/sofinder', roles: ROLE_USER }
```

宿主應用程式仍負責登入流程與使用者 provider。

## 6. 驗證安裝

```bash
bin/console cache:warmup
bin/console sofinder:security:audit
bin/console sofinder:image:capabilities
```

以已登入使用者開啟 `/sofinder/browser`，確認可以建立資料夾、上傳允許的檔案、下載檔案及移至回收站。

## 下一步

- 為一般使用者提供[檔案管理](/zh-TW/user-guide)、[圖片管理](/zh-TW/image-guide)和 [CKEditor 4](/zh-TW/ckeditor4) 指南。
- 查看[設定參考](/zh-TW/configuration)的所有選項。
- 選擇正確的[公開或代理傳遞模式](/zh-TW/symfony#宿主應用程式入口路由)。
- 透過獨立套件加入 [S3 相容儲存](/zh-TW/s3)，不讓 AWS 相依套件進入核心。
- 設定[維護模式](/zh-TW/maintenance)與正式環境的[安全控制](/zh-TW/security)。
- 使用可執行的 [`examples/symfony`](https://github.com/sohophp/sofinder/tree/main/examples/symfony) 應用程式，驗證 Symfony 6.4 與 7.4 整合。
- 使用[開發者指南](/zh-TW/developer-guide)和 [HTTP API 參考](/zh-TW/api-reference)建置自訂整合。
