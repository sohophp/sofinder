---
layout: home
title: SoFinder 文件
titleTemplate: PHP 與 Symfony 安全檔案管理
description: 安裝、設定及擴充適用於 PHP 8.2–8.5 和 Symfony 6.4/7.4 的 SoFinder。

hero:
  name: SoFinder
  text: PHP 與 Symfony 安全檔案管理
  tagline: 支援本機與 S3 相容儲存、細緻權限、可靠上傳及圖片工具的 MIT 授權檔案管理器。
  image:
    src: /logo.svg
    alt: SoFinder 標誌
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
    details: 路徑沙箱、私有隔離區、CSRF 保護、繼承式 ACL、操作門禁及有界圖片與壓縮檔處理。
  - title: 完整檔案瀏覽器
    details: 跨目錄資產搜尋、上傳、資料夾、複製移動、回收站、多語言資產中繼資料、圖片編輯及主流編輯器整合。
  - title: 彈性儲存
    details: 使用本機儲存，或透過選用套件連接 AWS S3、Cloudflare R2、MinIO 等相容服務。
  - title: 適合正式環境
    details: 穩定資產 ID、使用關係刪除預檢、私有存取工作階段、配額、排程維護、部署安全稽核及 public/proxy delivery。
---

## 安裝

```bash
composer require sohophp/sofinder:^0.1@beta
```

接著註冊 Bundle、匯入路由並建立至少一個儲存資源。請從[安裝與快速開始](/zh-TW/getting-started)開始，完整選項可參考[設定參考](/zh-TW/configuration)。

::: warning Beta 版本
SoFinder 目前是公開 Beta。請明確指定 Beta 版本條件，升級前閱讀[更新紀錄](/zh-TW/changelog)及[升級指南](/zh-TW/upgrading)。
:::

已經在使用 SoFinder？請閱讀[檔案管理器指南](/zh-TW/user-guide)、[圖片管理](/zh-TW/image-guide)和[主流編輯器整合](/zh-TW/editor-integrations)。開發整合請查看[開發者指南](/zh-TW/developer-guide)及 [HTTP API 參考](/zh-TW/api-reference)。
