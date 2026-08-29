---
title: 框架支援
description: 框架支援層級、無框架核心入口及 PHP 7.2 隔離策略。
---

# 框架支援

目前發布線支援 PHP 8.2～8.5。Symfony 6.4 LTS／7.4 LTS 是瀏覽器介面、HTTP
API、命令、安全及依賴注入的完整穩定目標。

| Host | 目前層級 | 發布門檻 |
| --- | --- | --- |
| Symfony 6.4／7.4 | 完整、穩定 | PHP 8.2～8.5 CI Matrix 全部通過 |
| 純 PHP／任意 Container | 實驗性 headless HTTP Bridge | Host 明確提供授權、CSRF、Actor、事件及 PSR Factory |
| Laravel 12/13 | 實驗性 Bridge：Provider、51 條 API Route、Auth/Gate、Session CSRF 與 PSR 轉換 | 其餘共用 Handler、瀏覽器/命令、完整一致性及 Symfony 觀察門禁 |
| Slim／Mezzio | 含可執行 Host 的實驗性 PSR-15 API Bridge | 完整 Endpoint 一致性及 Symfony 1.0 觀察期門禁 |
| 其他框架 | 僅 headless 核心 | 實作公開契約，不繼承內部 Controller |

實驗性 PSR-15 Package 現已提供 Middleware 與 `RouteRegistrar`，可在 Slim 或 Mezzio
註冊全部 51 個非展示 Endpoint 的中央路徑及約束；`/browser` 仍由 Host 呈現。真實 Slim 4、
Mezzio 3 與純 PHP Front Controller 已在 PHP 8.2 和 8.5 上運行。目前只有 Symfony 屬於
完整支援的安裝方式；PSR Bridge 必須通過完整 Contract Suite 及發布門禁後才能升級。

受門禁保護的 Laravel Package 已在真實 Laravel 12/13 Application 透過自動探索啟動，
註冊中央 51 個非展示 Route，並經共用 PSR Dispatcher 執行 Liveness Endpoint。Laravel
Auth/Gate、Session CSRF、Event Dispatcher 與統一設定 Normalizer Adapter 已完成；其餘
共用 Action Graph、瀏覽器外殼、命令和完整契約仍在接入，因此維持實驗性。

門禁證據記錄於 `config/framework-support.json` 並由 CI 驗證。只有記錄的主線版本為
`1.0.0`、UTC 發布日期已滿 30 天且未關閉的 P0/P1 缺陷數為零時，才能設為 eligible。
同時必須記錄最終 Symfony Matrix 的 Commit 與 Workflow URL、觀察起訖日期，以及安全的
P0/P1 缺陷稽核連結。
`1.0.0` 發布後，每日 `Symfony 1.0 observation` Workflow 會記錄觀察期內建立且帶有
精確 `priority:p0` 或 `priority:p1` Label 的所有 Issue。已關閉缺陷仍保留於證據中，
不能藉由關閉 Issue 偽造連續無缺陷的觀察期。

```php
$registrar = new RouteRegistrar($endpointDispatcher, '/sofinder');
$registrar->registerSlim($slimApp);
// 或：$registrar->registerMezzio($mezzioApp);
```

Dispatcher 必須注入啟用功能所需的共用 Handler。缺少 Handler 會回傳
`501 endpoint_not_implemented`；缺少授權或 CSRF Provider 則必須令應用啟動失敗。

## 不限框架的核心入口

`Storage\ResourceRegistryFactory` 不依賴框架 Request 或 Container，並允許 Bridge
處理掛載路徑。建立 Registry 後，以實作 `AuthorizationInterface` 的授權物件及實作
PSR-14 `EventDispatcherInterface` 的事件 Dispatcher 建立 `FileManager`。

Host Route 仍必須完成認證、寫入操作 CSRF、Exception 到 HTTP JSON 的映射，以及受
ACL 保護的檔案串流輸出。Symfony Bridge 亦委託給同一 Builder，只額外處理 Request
base path；後續 Bridge 必須沿用此模式，避免安全設定產生差異。

## 實作順序

1. 保持 Symfony 6.4／7.4 在 PHP 8.2、8.3、8.4、8.5 及可執行範例中全部穩定。
2. 固化與框架無關的 Request、Response、Upload、Actor 及 Workspace 邊界。
3. 先加入 Laravel 完整 Bridge、可執行範例及共用 HTTP 契約測試。
4. 加入可執行 Slim／Mezzio 範例並執行相同 Contract Suite，再將共用 PSR-7／PSR-15 Bridge 自實驗性升級。
5. 其他框架通過相同 HTTP、安全及儲存契約測試後才列為完整支援。

## PHP 7.2 必須使用獨立產品線

PHP 7.2 已停止維護，不能加入 `main` 或 1.x Composer 約束。待 Symfony／PHP
8.2～8.5 穩定後，可在獨立 Repository 及獨立 Composer Package（例如
`sohophp/sofinder-legacy`）評估移植。它必須有自己的版本空間、lock file、CI 及
安全政策，不得與 `sohophp/sofinder` 1.x 共用 tag 或依賴解析。只有能證明依賴仍受
支援且具可持續安全更新路徑時才發布。所有 PHP 8 Package 都聲明了與
`sohophp/sofinder-legacy` 的 Composer 衝突，因此依賴解析階段便會拒絕 PHP 7／PHP 8
產品線混裝。
