---
title: 設定參考
description: SoFinder 全域、UI、維護、圖片、請求限制與資源設定參考。
---

# 設定參考

所有設定都位於 `so_finder` 鍵下。Symfony 會在編譯 Container 時驗證每個值，因此拼錯的鍵名及超出範圍的值都會提早失敗。

## 全域路徑與上傳 Session

| 選項 | 預設值 | 用途 |
| --- | --- | --- |
| `route_prefix` | `/admin/sofinder` | 保留的相容設定；目前 HTTP URL 由匯入的 Symfony 路由 prefix 控制。 |
| `cache_dir` | `%kernel.cache_dir%/sofinder` | 縮圖及其他可重新產生的快取資料。 |
| `metadata_file` | `%kernel.project_dir%/var/sofinder/metadata.json` | 預設的收藏、標籤及最近項目 Metadata Store。 |
| `quarantine_dir` | `%kernel.cache_dir%/sofinder/quarantine` | 私有上傳檢查區。 |
| `chunk_dir` | `%kernel.cache_dir%/sofinder/chunks` | 進行中的分塊上傳。 |
| `usage_dir` | `%kernel.project_dir%/var/sofinder/usage` | 持久化資源使用量計數器。 |
| `chunk_size` | `5242880` | 分塊大小（byte）；允許範圍為 256 KiB–16 MiB。 |
| `max_upload_chunks` | `200` | 單次上傳的分塊上限；允許範圍為 1–1000。 |

這些工作目錄必須允許 PHP 寫入，而且不可經由 Web 直接存取。

## 叢集 Service

`cluster.state_service` 可指定實作 `AtomicStateStoreInterface` 的宿主 Symfony Service，
自動將 metadata、請求 Gate 與 Usage 切換為共享原子 Store。
`cluster.chunk_upload_store_service` 可指定共享 `ChunkUploadStoreInterface`。預設皆為
`null`，保留單節點檔案實作。多節點非同步 Office 預覽還必須共享掛載
`cache_dir/document-previews`，完成後設定 `cluster.shared_preview_cache: true`；
`sofinder:security:audit` 會檢查此確認項。詳見[正式環境運作](/zh-TW/production)。

## 臨時簽章 URL

```yaml
so_finder:
  signed_urls:
    enabled: true
    secret: '%kernel.secret%'
    default_ttl_seconds: 300
    max_ttl_seconds: 3600
```

Secret 至少 32 Byte。簽章 URL 綁定檔案版本且僅適用於 `proxy` 資源。需要匿名存取時，
在通用 SoFinder Firewall 規則前為 `/sofinder/signed/` 設定嚴格範圍的 `PUBLIC_ACCESS`。

## 資產目錄、圖片變體與 Workspace

三項能力預設關閉，既有專案維持路徑資產與單一空間行為：

```yaml
so_finder:
  asset_catalog: { enabled: false, store_service: null, register_existing: lazy }
  image_variants:
    enabled: false
    widths: [320, 640, 960, 1280, 1920]
    formats: [original, webp]
    quality: 82
    mode: on_demand
    max_variants_per_asset: 10
    cache_ttl_seconds: 2592000
  workspaces: { enabled: false, default: main, resolver_service: null }
```

資產使用懶註冊隨機 UUID；重新命名、移動、覆寫和資源回收筒還原保留 ID，上傳及複製建立新 ID。啟用叢集狀態後會自動使用共享目錄。圖片變體只接受白名單尺寸與格式、不放大，並繼承資源授權。Workspace 必須由宿主可信的 `WorkspaceResolverInterface` 從登入上下文解析，不能直接信任查詢參數；實際儲存隔離仍由宿主資源映射負責。

## 檔案系統權限

```yaml
so_finder:
  filesystem_permissions:
    directory_mode: '0775'
    file_mode: '0664'
```

這些模式套用於新建的本機儲存項目和縮圖快取。必須使用加上引號的八進位字串，避免 YAML 解讀成十進位。PHP-FPM 與部署程序使用共享群組時，可設定 `directory_mode: '2775'` 保持群組繼承。SoFinder 不會修改 owner，也不會修復歷史項目。

## CKEditor 4 上傳

```yaml
so_finder:
  ckeditor4:
    overwrite_on_upload: false
```

安全預設值會把快速上傳的同名檔案自動改名為 `photo(1).jpg` 這類名稱。啟用 `overwrite_on_upload` 後，也只有目前使用者擁有資源獨立的 `overwrite` 權限時才會取代原檔案。

## 病毒掃描

```yaml
so_finder:
  malware_scanning:
    enabled: true
    endpoint: 'unix:///run/clamav/clamd.ctl'
    timeout_seconds: 8
    history_limit: 100
    status_roles: [ROLE_ADMIN]
```

啟用後，SoFinder 會自動將內建 ClamAV Client 註冊為同步、fail-closed 的上傳掃描器和
就緒檢查。只有管理員角色能開啟「安全狀態」，其中會明確顯示 clamd 是否可用，以及有界的
通過、攔截、失敗和待掃描記錄；記錄不儲存檔案內容。

## 回收站

| 選項 | 預設值 |
| --- | ---: |
| `trash_dir` | `%kernel.project_dir%/var/sofinder/trash` |
| `trash_retention_days` | `30` |
| `trash_max_items` | `1000` |
| `trash_max_bytes` | `1073741824` |

本機儲存可使用回收站。對 SoFinder 而言，物件儲存刪除是永久操作；需要復原能力時應啟用供應商版本控制。

## UI

```yaml
so_finder:
  uploads:
    naming:
      lowercase_extensions: true
  ui:
    mode: auto
    header: true
    logo: true
    search: true
    language_switcher: true
    view_switcher: true
    folder_tree: false
    scale: standard
    upload_conflict_strategy: ask
```

`mode` 可設為 `auto`、`manager` 或 `picker`。啟用 `logo` 時，左側顯示 Logo 和可選品牌文字，搜尋置中，麵包屑位於檔案清單或網格上方；關閉 `logo` 時，麵包屑占用原 Logo 位置，寬螢幕搜尋框向右移動。啟用 Logo 時，設定 `header: false` 只隱藏品牌文字。`scale` 可設為 `compact`、`standard`、`large` 或 `xlarge`。`upload_conflict_strategy` 可設為 `ask`、`rename`、`overwrite` 或 `skip`；預設 `ask`，遇到同名檔案時顯示自動重新命名、覆寫與略過三種選擇。`uploads.naming.lowercase_extensions` 預設為 `true`，因此 `Report.XLSX` 會上傳為 `Report.xlsx`；服務端會統一約束一般、分塊和編輯器上傳。舊的 `ui.lowercase_upload_extensions` 設定仍相容。瀏覽器偏好和 `uiTools=common|full` 只能改變顯示方式，不會授予伺服器能力。

Host 可為選用功能設定不可越過的上限。關閉後，瀏覽器設定不再顯示該功能，專用 HTTP
Endpoint 統一回傳 `feature_disabled` 404：

```yaml
so_finder:
  features:
    folder_tree: true
    recent: true
    favorites: true
    quick_access: true
    quick_access_files: true
    tags: true
    archive: true
    trash: true
    qr_code: true
```

`quick_access` 獨立控制快速存取，不再依賴收藏功能。`quick_access_files` 是「檔案加入快速存取」的 Host 上限。啟用後，使用者仍可在設定中自行關閉；Host 關閉後會隱藏使用者開關並拒絕新增檔案快速項目，但既有項目仍可移除。

## 主題

```yaml
so_finder:
  theme:
    accent: '#276ef1'
    background: '#f4f6f9'
    panel: '#ffffff'
    text: '#1c2735'
    muted: '#667282'
    danger: '#c13a43'
    radius: '10px'
```

色彩只接受三位或六位十六進位值；圓角接受 `0px` 至 `32px`。

## 維護

```yaml
so_finder:
  maintenance:
    mode: inline
    min_interval_seconds: 300
    max_items_per_run: 50
```

模式包括 `inline`、`messenger`、`external` 及 `disabled`。改變預設值前請閱讀[維護模式](/zh-TW/maintenance)。

## 請求與並行限制

`limits` 群組包括 `normal`、`upload`、`image`、`thumbnail`、`archive` 及 `transfer`。每個群組都接受：

| 鍵 | 意義 |
| --- | --- |
| `max_requests` | 設定時間區間內允許的請求數；`0` 表示停用此計數。 |
| `interval` | 滑動時間區間，單位為秒。 |
| `max_concurrent` | 允許的同時操作數；`0` 表示停用此計數。 |

上傳、圖片異動及壓縮檔的預設限制刻意比瀏覽與縮圖更嚴格。

## 圖片處理

`image_processing.driver` 可設為 `auto`、`gd` 或 `imagick`。全域界線涵蓋尺寸、像素、Frame、Memory、Map、Disk、Thread 及 Timeout；個別資源可設定更嚴格的圖片寬度、高度及像素限制。Runtime Codec 需求請參考[圖片格式](/zh-TW/image-formats)。

Preset 是具名稱及界線的輸出尺寸：

```yaml
so_finder:
  image_presets:
    content: { width: 1200, height: 1200, quality: 88 }
    thumbnail: { width: 400, height: 400, quality: 82 }
```

## 資源

至少必須定義一個具名稱的資源。

| 鍵 | 預設值 | 說明 |
| --- | --- | --- |
| `adapter` | `local` | Adapter Factory 名稱，例如 `local` 或選用的 `s3`。 |
| `root` | 必填 | 本機路徑或 Object Key 的安全邊界。 |
| `public_url` | 空字串 | 只供公開 Delivery 使用的 Base URL。 |
| `delivery_mode` | `public` | `public` 或經驗證的 `proxy`。 |
| `allowed_extensions` | 空清單 | 空清單表示不使用 Allowlist；Denylist 仍然生效。 |
| `denied_extensions` | 可執行／主動內容格式 | 預設包括 PHP、Phar、CGI、Shell、HTML 及 JavaScript。 |
| `allowed_mime_types` | 空清單 | 上傳時檢查的選用 MIME Allowlist。 |
| `max_size` | 20 MiB | 檔案大小上限。 |
| `read_only` | `false` | 啟用時禁止異動。 |
| `quota` | `0` | Byte；零表示無上限。 |
| `roles` | 空清單 | 必要 Symfony Role；空清單維持已登入使用者行為。 |
| `operation_roles` | 空清單 | 覆寫特定操作所需的 Role。 |
| `path_acl` | 空清單 | 資源相對路徑下可繼承的 Allow 或 Deny 規則。 |

資源也支援 Unicode 檔名／資料夾名稱長度、資料夾深度、批次大小、遞迴操作、壓縮檔項目／Byte，以及圖片尺寸／像素限制。[Symfony 整合指南](/zh-TW/symfony)提供包含 ACL、宿主路由及顯示選項的完整範例。

## 檢查有效設定

使用 Symfony 標準設定工具：

```bash
bin/console config:dump-reference so_finder
bin/console debug:config so_finder
```

`config:dump-reference` 說明可接受的鍵及預設值；`debug:config` 顯示目前環境編譯後的值。
