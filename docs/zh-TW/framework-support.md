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
| 純 PHP／任意 Container | 完整瀏覽器/API Runtime | Host 明確提供授權、CSRF、Actor、事件及 PSR Factory |
| Laravel 12/13 | 全棧支援：瀏覽器、51 個共用 Handler、Artisan/Queue、Auth/Gate 與 Session CSRF | 完整相容 Matrix 與黑盒一致性 Matrix |
| Slim／Mezzio | 透過 PSR-15 提供全棧支援及全部 52 個共用 Handler | 完整相容 Matrix 與黑盒一致性 Matrix |
| 其他框架 | 僅 headless 核心 | 實作公開契約，不繼承內部 Controller |

正式支援的 PSR-15 Package 提供 Middleware、`RouteRegistrar` 及完整 52 Route 瀏覽器/API
的本地 Runtime Factory。真實 Slim 4、Mezzio 3 與純 PHP Front Controller 已在 PHP 8.2 和
8.5 上提供共用 `/browser` 外殼及前端資源，並執行全部 51 條非展示 Route，以及 Liveness、
Capabilities、Health、拒絕及寫入路徑；Chromium 會在三個真實 Host 啟動 React UI 且不得
產生 Runtime Error，共用 API 清單會把狀態／錯誤 Contract 與安全 Response Header 跟 Symfony 比較。
每次同步發布前都會執行完整黑盒 Suite。

受門禁保護的 Laravel Package 已在真實 Laravel 12/13 Application 透過自動探索啟動，
註冊中央 51 個非瀏覽器 Route，並把全部 Route 經 PSR Dispatcher 接到共用 HTTP Action。
Laravel Auth/Gate、Session CSRF、Event Dispatcher、Request Context、Route URL 與統一設定
Adapter 已完成；分塊 Session、維護鎖、Metrics、惡意軟體狀態與預覽工作預設使用 Laravel
Cache 和原子鎖，無法提供安全鎖的 Cache Driver 會在啟動時失敗。瀏覽器外殼、四個 Artisan 維護命令、以框架無關 Auditor 實作的 Artisan
安全稽核命令、維護與非同步文件預覽的 Laravel Queue Dispatcher 及同步發布資源也已接入。Laravel Host 啟用惡意軟體
掃描後，上傳及安全稽核會接入共用的 Fail-closed ClamAV Scanner。可執行的
Laravel 12/13 Application 現已覆蓋全部支援組合（Laravel 12 × PHP 8.2～8.5；Laravel 13 ×
PHP 8.3～8.5），並驗證自動探索、設定與 Route Cache、
瀏覽器啟動、CSRF、上傳、下載、Range 及前端資源；Chromium 亦會載入真實 Laravel 12／13
瀏覽器外殼，驗證共用 API Bootstrap 且不產生 Runtime Error。真實 Host Suite 亦執行全部 51 條非展示
Route，並與 Symfony 比較狀態／錯誤及安全 Response Header Contract；同時在五個 Host 執行真實
multipart 上傳、完整／Range 內容、ETag 重新驗證、Range 下載、重新命名、複製、移動、回收筒還原
及永久刪除生命週期。該 Suite 亦驗證 Symfony 原生未認證 401 Challenge，並比較 Laravel、Slim、
Mezzio 與純 PHP 在未認證及「已認證但未授權」兩種狀態下共用的 403 `access_denied` Response Body
與安全 Response Header Contract。

門禁證據記錄於 `config/framework-support.json` 並由 CI 驗證。預設政策要求主線版本不低於
`1.0.0`、穩定滿 30 日且 P0/P1 缺陷為零。本次在完整相容、安全、拆分發布及乾淨 Consumer
Matrix 通過後，由維護者明確批准立即晉級豁免；政策如實記錄批准日期、批准者及原因，不會聲稱
30 日觀察已完成。穩定 Patch 版本符合版本下限；目前記錄的穩定版本為 `1.0.2`，依據仍錨定
不可變的 `1.0.0` Release。
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
無框架 Host 選擇非同步文件預覽時必須提供 `DocumentPreviewDispatcherInterface`；Dispatcher
缺少或不可用時，Messenger 模式必須啟動失敗。

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
4. 只有可執行 Slim／Mezzio 範例持續通過相同 Contract Suite 時，才維持共用 PSR-7／PSR-15 Bridge 的正式支援。
5. 其他框架通過相同 HTTP、安全及儲存契約測試後才列為完整支援。

## PHP 7.2 必須使用獨立產品線

PHP 7.2 已停止維護，不能加入 `main` 或 1.x Composer 約束。獨立的
[`sohophp/sofinder-legacy`](https://github.com/sohophp/sofinder-legacy) Repository
現已建立 `7.2.x` 相容基線，並有獨立 lock file、PHP 7.2.5／7.3／7.4 CI 與安全政策。
Runtime 移植目前暫停，尚無 `7.2.0` Release 或 Packagist Package；它不會與
`sohophp/sofinder` 1.x 共用 tag 或相依解析。只有證明相依組合及安全更新路徑可維護後
才會發布。所有 PHP 8 Package 都聲明與 `sohophp/sofinder-legacy` 衝突，因此 Composer
會拒絕混裝。
