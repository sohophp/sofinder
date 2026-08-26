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
連線憑證、TLS 與重試策略由 Host 管理。將狀態物件註冊為 Symfony Service 後設定：

```yaml
so_finder:
  cluster:
    state_service: 'app.sofinder_shared_state'
    chunk_upload_store_service: 'app.sofinder_shared_chunks' # 選用
```

`state_service` 自動替換 metadata、請求限流與配額 Store；`/health` 會執行原子讀寫探針。
兩個 Service 分別實作 `AtomicStateStoreInterface` 與 `ChunkUploadStoreInterface`。
分塊檔案仍須使用共享私有檔案系統或自訂 `ChunkUploadStoreInterface`；共享狀態
不能取代物件儲存的版本復原能力。

## ClamAV

在 SoFinder 設定中啟用內建 ClamAV 整合。它透過 clamd `INSTREAM` 協議傳送隔離檔案，
不執行 Shell，並採用 fail-closed 策略。

```yaml
so_finder:
  malware_scanning:
    enabled: true
    endpoint: 'unix:///run/clamav/clamd.ctl'
    timeout_seconds: 8
    history_limit: 100
    status_roles: [ROLE_ADMIN]
```

病毒檔案回傳 `malware_detected`；掃描器無法使用或回應不確定時回傳
`malware_scanner_unavailable`，隔離檔案隨後刪除。
「安全狀態」和 `GET /api/security/status` 會顯示設定狀態、clamd 即時就緒結果、有界的
最近掃描記錄及數量。Prometheus 也會依結果輸出掃描次數、掃描 Byte 與累計耗時 Counter。

## 健康檢查與指標

- `GET /health` 檢查私有執行目錄、建置資源、全部 Storage 及 Plugin Check；`down`
  回傳 HTTP 503，`degraded` 仍回傳 200。
- `GET /metrics` 輸出有界的 Prometheus Counter 及 `sofinder_ready`。
- 所有 SoFinder Response 帶有 `X-Request-ID`；安全的傳入值會保留，否則自動產生，
  Audit 與失敗 Log 會記錄相同 ID。

健康及指標路由應置於內部防火牆或監控專用 Role 後。專案內 Symfony 範例可用
`demo` / `demo` 測試 `/integrations`、`/sofinder/health` 及 `/sofinder/metrics`。
