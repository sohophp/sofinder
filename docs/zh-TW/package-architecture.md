---
title: Package 架構
description: 多框架 Composer 拆包邊界及分階段發布狀態。
---

# Package 架構

SoFinder 正從 1.0 前的 Symfony Bundle 遷移為同步版本的多個 Composer Package。
只有當 Package 所需 Source 全部位於可發布子目錄，且獨立安裝測試通過後，才標示為
可安裝；不會以引用 Repository 外路徑的 `composer.json` 冒充拆包完成。

Core、HTTP 與 PSR-15 已完成實體子目錄，並通過不安裝 Symfony 的獨立 Composer
安裝驗證。Symfony Bridge 也已完成實體拆分、發佈資源與獨立安裝驗證。
`FrameworkBoundaryTest` 會禁止 Core 引入 Symfony、Illuminate、Slim 或 Mezzio，
中央 Catalog 則鎖定 Symfony 的 52 條 Route。

相容 Matrix 保留已提交的 PHP 8.2 Composer Platform 作為最低解析目標，執行 PHP 8.2／
Symfony 6.4 `prefer-lowest`；PHP 8.5／Symfony 7.4 最新依賴則使用不含 Platform Override
的暫時清單，絕不改寫 Repository 中的最低版本設定。

設定、檔案列表、健康、存活與能力 Endpoint 已使用 Symfony 和 PSR-7 共用 Action；
建立資料夾、重新命名、複製、移動與刪除也已使用共用 Mutation Action。Mutation
Action 必須明確注入授權與 CSRF Provider，並在解析 JSON 前完成安全檢查。

批次操作、批次重新命名，以及回收站列表、還原與永久刪除也共用同一套 Action 與
FeaturePolicy 規則。

目前全部 51 個非展示 Endpoint 都經由框架無關 Action 執行，其中包含 Metadata、內容讀取、
Range/ETag 串流下載、圖片縮圖與變體、文件預覽、Prometheus Metrics、標準/分塊/相容上傳、
資產存取 Session、封存下載、完整資產 API、簽名 URL 與安全狀態。剩餘 `/browser` 是由完整框架
Bridge 呈現的 HTML 外殼，刻意不下沉至無框架 HTTP Use Case。Endpoint URL 與
角色授權使用 Core Contract 並由 Symfony Adapter 實作；功能開關、明確 Workspace
隔離和 Mutation 驗證不在 Bridge 重複實作。

`sohophp/sofinder` 現已轉為依賴 `sohophp/sofinder-symfony` 的相容 Meta Package，
在不保留根目錄重複原始碼的情況下維持原套件名稱與 `SohoPHP\\SoFinder` namespace。
Laravel 與 PSR-15 正式發佈仍受 1.0 觀察期門禁約束。
每個 Split Repository 都攜帶 Package 內 PHP／Composer Wrapper 及鎖定 Action 版本的
CI，分別驗證 PHP 8.2 最低相依與 PHP 8.5 穩定相依；這些開發檔案會從使用者
Distribution Archive 排除。

Core 中的 `ConfigurationNormalizer` 是 Framework 設定陣列的統一入口，負責預設值、
List 替換、舊 Upload Naming 別名及安全範圍。Symfony 解析後的 YAML 也必須經過相同
Normalizer；Laravel 與純 PHP Adapter 可提供各自的 Path／Secret 預設值，而不需引入
Symfony Config。
