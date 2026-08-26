---
title: 正式環境與多節點執行
description: 設定共享狀態、病毒掃描、健康檢查、指標及請求關聯。
---

# 正式環境與多節點執行

預設檔案型狀態適用於單一 PHP 節點。多節點部署必須共享物件儲存及執行狀態；各節點
使用獨立 Metadata、Quota 或限流檔案會產生不一致。

## 資料庫或 Redis 狀態

`PdoAtomicStateStore` 支援本機測試用 SQLite，以及共享部署的 MySQL/PostgreSQL；
`RedisAtomicStateStore` 使用 ext-redis 及有時限的獨占鎖。兩者皆實作
`AtomicStateStoreInterface`，可組合為：

- `SharedMetadataStore`：收藏、標籤與最近檔案；
- `SharedRequestGateStore`：跨節點請求及並行限制；
- `SharedUsageTracker`：原子 Quota 統計。

```php
$state = new PdoAtomicStateStore($pdo);
$metadata = new SharedMetadataStore($state);
$gates = new SharedRequestGateStore($state);
$usage = new SharedUsageTracker($state);

// Redis
$state = new RedisAtomicStateStore($redis, 'myapp:sofinder:');
```

PDO Store 會建立可攜的 `sofinder_state` 資料表，也能在部署階段明確執行 `install()`。
連線憑證、TLS 與重試策略由 Host 管理，並在 Symfony Container 覆寫對應 Contract
Alias。分塊檔案仍須使用共享私有檔案系統或自訂 `ChunkUploadStoreInterface`；共享狀態
不能取代物件儲存的版本復原能力。

## ClamAV

將 `ClamAvScanner` 註冊為 Symfony Service，Autoconfiguration 會同時加入上傳掃描及
健康檢查 Tag。它透過 clamd `INSTREAM` 協議傳送隔離檔案，不執行 Shell，並採用
fail-closed 策略。

```yaml
services:
  SohoPHP\SoFinder\Security\ClamAvScanner:
    arguments:
      $endpoint: 'unix:///run/clamav/clamd.ctl'
      $timeoutSeconds: 8
```

病毒檔案回傳 `malware_detected`；掃描器無法使用或回應不確定時回傳
`malware_scanner_unavailable`，隔離檔案隨後刪除。

## 健康檢查與指標

- `GET /health` 檢查私有執行目錄、建置資源、全部 Storage 及 Plugin Check；`down`
  回傳 HTTP 503，`degraded` 仍回傳 200。
- `GET /metrics` 輸出有界的 Prometheus Counter 及 `sofinder_ready`。
- 所有 SoFinder Response 帶有 `X-Request-ID`；安全的傳入值會保留，否則自動產生，
  Audit 與失敗 Log 會記錄相同 ID。

健康及指標路由應置於內部防火牆或監控專用 Role 後。專案內 Symfony 範例可用
`demo` / `demo` 測試 `/integrations`、`/sofinder/health` 及 `/sofinder/metrics`。
