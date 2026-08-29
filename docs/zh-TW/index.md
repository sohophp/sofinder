---
layout: home
markdownStyles: false
title: SoFinder 文件
titleTemplate: PHP 與 Symfony 安全檔案管理
description: 安裝、設定及擴充適用於 PHP 8.2–8.5 和 Symfony 6.4/7.4 的 SoFinder。

hero:
  name: 安全的檔案管理
  text: 面向 PHP 與 Symfony
  tagline: MIT 授權，支援本機與 S3 相容儲存、細緻權限控制、可靠上傳及圖片工具。
  actions:
    - theme: brand
      text: 開始使用
      link: /zh-TW/getting-started
    - theme: alt
      text: Symfony 整合
      link: /zh-TW/symfony
    - theme: alt
      text: GitHub
      link: https://github.com/sohophp/sofinder

features:
  - title: 以安全為設計核心
    icon: { src: /feature-security.svg, alt: '' }
    details: 路徑沙箱、私有隔離區、CSRF 保護、繼承式 ACL 與操作門禁。
    link: /zh-TW/security
    linkText: 瞭解安全設計
  - title: 完整檔案瀏覽器
    icon: { src: /feature-browser.svg, alt: '' }
    details: 響應式檔案瀏覽器，支援目錄、預覽、搜尋、拖放、批次操作與回收站。
    link: /zh-TW/user-guide
    linkText: 瀏覽介面能力
  - title: 彈性儲存
    icon: { src: /feature-storage.svg, alt: '' }
    details: 支援本機儲存及 AWS S3、Cloudflare R2、MinIO 等 S3 相容儲存。
    link: /zh-TW/storage-adapters
    linkText: 比較儲存方案
  - title: 適合框架整合
    icon: { src: /feature-framework.svg, alt: '' }
    details: Symfony Bundle、公開 PHP 契約、事件、Tagged Service 與可擴充 API。
    link: /zh-TW/developer-guide
    linkText: 整合 SoFinder
  - title: 面向真實應用
    icon: { src: /feature-ready.svg, alt: '' }
    details: 圖片處理、可靠上傳、Picker 模式、穩定資產 ID 與私有交付。
    link: /zh-TW/image-guide
    linkText: 探索產品能力
  - title: 適合正式環境
    icon: { src: /feature-operations.svg, alt: '' }
    details: 配額、分頁、限流、維護命令與部署時安全稽核。
    link: /zh-TW/production
    linkText: 正式環境運維
---

## 安裝

```bash
composer require sohophp/sofinder-symfony:^1.0
```

既有應用程式可以繼續使用相容 Meta Package `sohophp/sofinder:^1.0`；兩個 Package 名稱
都公開相同的 namespace。接著註冊 Bundle、匯入路由並建立至少一個儲存資源。請從
[安裝與快速開始](/zh-TW/getting-started)開始，完整選項可參考[設定參考](/zh-TW/configuration)。

::: tip 正式支援的 Framework 版本線
Symfony 6.4／7.4、Laravel 12／13 與共用 PSR-15 Host 均為正式支援的 Full-stack
整合。Laravel、Slim、Mezzio 和純 PHP 的可執行接入步驟見[框架整合指南](/zh-TW/framework-integrations)，
具體 PHP 8 組合詳見[Framework 支援策略](/zh-TW/framework-support)。PHP 8 主線
絕不為 PHP 7.2 降級；Legacy 可行性始終獨立評估。
:::

已經在使用 SoFinder？請閱讀[檔案管理器指南](/zh-TW/user-guide)、[圖片管理](/zh-TW/image-guide)和[主流編輯器整合](/zh-TW/editor-integrations)。開發整合請查看[開發者指南](/zh-TW/developer-guide)及 [HTTP API 參考](/zh-TW/api-reference)。
