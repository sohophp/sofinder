---
title: 更新紀錄
description: SoFinder 每個公開版本的重要變更。
---

# 更新紀錄

## 尚未發佈

- Laravel 的分塊 Session、維護鎖、Metrics、惡意軟體狀態和文件預覽工作現在預設使用
  Host 設定的 Cache Repository 與原子鎖；不支援安全鎖的 Cache Driver 會在啟動時直接失敗。
- 發布受門禁保護的 Bridge 前，線上驗證成功的 GitHub Actions 記錄，匹配 Symfony Matrix
  Commit、Workflow 路徑、`main` Branch 及觀察期後的執行日期，不再只信任 URL 文字。
- 將 Framework 晉級版本視為穩定最低版本而非完全相同的 Tag，使政策可如實記錄 1.0.1，
  同時不重設以不可變 1.0.0 Release 為起點的觀察時鐘。
- 將三種語言文件與 Repository README 中已退役的 Beta 安裝命令替換為穩定 Symfony
  Bridge 1.x Package，同時明確保留原 Package 名稱作為相容選項。
- 在 30 天觀察期內持續以 PHP 8.2 與 8.5 將五個不可變的穩定 1.0.0 Package 由
  Packagist 安裝到使用獨立 Cache 的乾淨專案，並驗證 Repository 來源、Framework 邊界與相依稽核狀態。
- 未來 PSR-15 拆分 Package 現在會安裝到無框架的乾淨 Consumer，明確斷言不會帶入
  Symfony 或 Laravel，並分別使用 Nyholm 與 Guzzle PSR-7 Factory 啟動完整瀏覽器／資源 Runtime。
- 發佈演練現在會把未來 Laravel 拆分 Repository 安裝到全新的 Laravel 12／PHP 8.2 與
  Laravel 13／PHP 8.5 應用，並針對安裝後的 Package 執行自動發現、設定／Route Cache、全部 52 Route、Artisan、瀏覽器、
  CSRF、上傳下載、Range 與前端資源驗證。
- PSR-15 本地應用 Factory 現在會自動發現發佈 Package 內的前端資源，並在未來拆分
  Repository 的乾淨 Composer Consumer 中實際啟動 `/browser`、讀取真實資源，避免使用者傳入 Repository 內部路徑。
- 將框架無關 Browser Action 加入 PSR-15 本地 Runtime，預設註冊全部 52 條中央 Route，
  並在 PHP Matrix 兩端透過 Chromium 分別啟動 Slim 4、Mezzio 3 與純 PHP 的真實 React UI。
- 將 `sohophp/sofinder-s3` 收緊為框架無關的 Core Adapter Library，並將維持類名
  相容的 Bundle 與 DI Extension 移入 Symfony Bridge，使 Headless S3 安裝不再攜帶
  或暴露 Symfony 整合。
- Symfony Route 集合現在直接由框架無關的中央端點清單產生，同時維持原有 Bundle YAML
  匯入方式、Route 名稱、參數約束與 Host Prefix 行為；Symfony 的 `/browser` 繼續由 Host 呈現，其餘
  51 個 HTTP 操作統一通過共用 PSR Dispatcher，不再由各功能 Controller 重複解析 Request。
- 中央端點清單與 OpenAPI 文件現在執行雙向校驗，在發佈任何框架 Bridge 前同時阻止
  未記錄的 Runtime Route 和不存在的文件端點。

## 0.1.0-beta.31 - 2026-08-29

- 新增 Jodit 4 選擇器與原生上傳 Adapter、型別宣告、體積檢查、測試、文件及可執行的 Symfony 示範頁籤。

## 0.1.0-beta.30 - 2026-08-28

- 新增 wangEditor 5 選擇器與上傳 Adapter、型別宣告、體積檢查、整合測試、文件及可執行的 Symfony 示範頁籤。

## 0.1.0-beta.29 - 2026-08-28

- 桌面浮水印拖曳改用滑鼠事件，觸控和手寫筆繼續使用指標事件，使自由定位在 Chromium、Firefox 和 WebKit 中保持一致。

## 0.1.0-beta.28 - 2026-08-28

- 將自由拖曳浮水印的指標追蹤提升到視窗層級，修正 Firefox 中指標離開浮水印元素後拖曳中斷的問題。

## 0.1.0-beta.27 - 2026-08-28

- 已固定資料夾、收藏檔案、最近使用和資料夾導覽現在可拖曳到左右側欄並調整順序；版面會持久儲存，也支援方向鍵操作。
- 明確拆分側欄儲存功能：收藏僅接受檔案，快速存取改為「已固定資料夾」且僅接受資料夾；舊設定和可清理的失效 Metadata 保持相容。
- 將單圖裁切、旋轉、縮放、預設尺寸、最佳化和浮水印統一到響應式圖片編輯器，並支援自由拖曳浮水印位置。
- 新增介面黑體、清晰黑體和典雅宋體三種浮水印字型；缺少字型時可依設定下載經過 SHA-256 驗證的固定 Noto CJK 字型並快取。
- 圖片編輯器每次開啟及儲存後都會重新整理原圖，避免再次編輯時載入加浮水印前的舊快取；僅加浮水印時使用 100 品質輸出。
- 新增統一的檢視與排序選單，提供多種圖示／清單顯示、緊湊密度、窗格、欄位、排序方向及自適應左右彈出的分組選項。
- 修正批次重新命名視窗版面，並讓右側資料夾導覽的圖示、縮排、緊湊列及選取回饋與左側一致。

## 0.1.0-beta.26 - 2026-08-28

- CKEditor 5 上傳 Factory 現在回傳相容新版 `plugins` 與 `extraPlugins` 初始化方式的
  可建構 Plugin，同時繼續由 Host 專案自行託管 CKEditor。

## 0.1.0-beta.25 - 2026-08-28

- 重新設計文件站首頁與指南版面，補充深色、行動版、無障礙及視覺回歸檢查。
- 修正簡體與繁體中文導覽、側欄及上下頁錯誤跳轉英文頁面的問題，並新增建置期跨語言連結檢查。
- 移除首頁窄程式碼框的內部水平捲軸，同時保留正文長程式碼區塊的正常捲動。
- 將檔案管理器的選取操作選單移出水平捲動工具列，確保「全部選取」「全部取消」與「反向選取」在桌面及窄螢幕皆可見、可操作。

## 0.1.0-beta.24 - 2026-08-28

- 新增有掃描上限的跨目錄/Workspace 資產搜尋、欄位及類型等篩選、URL 狀態、最近搜尋和可編輯資產屬性側欄。
- 新增預設關閉的本機/共享資產使用追蹤、授權 API、遞迴刪除預檢警告，以及 CKEditor 穩定 ID 取代和可設定上傳資源路由。
- 新增可撤銷、綁定檔案版本的私有資產存取工作階段，以及冪等、支援 Dry-run/JSON 的 `sofinder:assets:migrate` 移轉命令。
- 發佈選用 `AssetVersionProviderInterface` 和僅提供建議的 `AssetEnrichmentProviderInterface`，核心不啟用版本保存或 AI 處理。
- 改善資產中繼資料視窗版面，新增有數量限制的多語言替代文字及編輯器語言回退，並維持原資產目錄介面相容。
- 補齊 Picker／上傳編輯器整合中的圖片替代文字，詳細資料、預覽及右鍵均可編輯資產中繼資料，並新增獨立的 `metadata.update` 寫入權限。
- 將續傳 Session 綁定可信 Workspace，新增可擴充的跨 Workspace 可寫儲存目錄安全稽核。
- Symfony 示範啟用資產目錄與響應式變體，收緊相關 OpenAPI 回傳契約，並維持 Picker 單檔獨立建置。
- 新增宿主控制的 Workspace 切換器，依 CKEditor 公開上傳契約封裝響應式 URL，並將文件建置固定到已修復安全問題的 Vite 6.4.3。

## 0.1.0-beta.23 - 2026-08-27

- 新增可選的宿主 Workspace 解析與資源邊界，隔離檔案、資產及使用者中繼資料。
- 新增含 Schema 版本、操作 ID 與安全失敗碼的資產事件，同時保留舊事件相容。
- 凍結外掛描述子 1.0，拒絕未知欄位與路徑穿越，並提供 `sofinder:plugin:validate --json`。

## 0.1.0-beta.22 - 2026-08-27

- 新增預設關閉的延遲資產目錄、本機／共享儲存、穩定 UUID 與樂觀並行中繼資料。
- 新增圖片替代文字、資產標題、共享標籤及詳細資料面板編輯入口。
- 新增受授權、尺寸白名單與原子快取保護的按需回應式圖片變體。

## 0.1.0-beta.21 - 2026-08-27

- 新增相容的 Asset Reference 1.0 回傳契約，並保留 Entry 與 Picker 1.0。
- 新增無 React 上傳工作 SDK，支援進度、取消、重試、續傳及四種同名策略。
- 新增獨立 CKEditor 5、TinyMCE、TipTap、Quill 上傳適配器、型別宣告、體積門檻與示範。

- 圖片原圖預覽依需求載入，支援符合視窗、25/50/100/200%、置中、鍵盤與 Ctrl/Command 滾輪縮放、失敗重試和大圖記憶體提示。
- 上傳副檔名預設自動轉為小寫，僅允許 Host 設定，並在一般、分塊和編輯器上傳中統一由伺服器執行。
- 快速存取僅在明確確認不存在後刪除，利用 metadata 存在狀態，變更失敗時保留連結，並處理舊回應、背景重新整理和多分頁同步。
- 強化本機目錄並行刪除、替換、權限和符號連結競態；發佈流程也執行 Chromium、Firefox、WebKit 全套回歸。
- 修正大型介面縮放下設定區塊被壓縮到只剩標題的問題；視窗統一捲動且區塊內容維持完整高度。

## 0.1.0-beta.20 - 2026-08-27

- 修正 LibreOffice 轉換後的 Office 文件在全螢幕模式下仍保留一般預覽高度的問題。
- 細分 Office 預覽的提交、排隊、轉換及 PDF 載入狀態，快取命中不再閃爍，並在管理員
  安全狀態中顯示轉換器、快取與工作診斷資訊。
- 將快速存取與收藏徹底解耦；保留相容的路徑陣列，同時增加檔案、資料夾及失效項描述，
  開啟失效項時可安全清理。
- 依工作重新組織偏好設定，獨立提供「還原系統預設值」，且使用者偏好無法覆蓋 Host 關閉的能力。
- 語言包改為按需載入，初始應用程式入口門檻降至 95 KiB gzip，並精確固定瀏覽器回歸工具版本。
- `/live` 維持匿名且僅回傳最小狀態，深度 `/health` 繼續受保護；Chromium、Firefox、
  WebKit 均涵蓋暗色、行動版、長名稱與 Windows 縮放版面。
- 快速存取預設跨根目錄顯示，新增「全部／目前根目錄」偏好，並支援檔案或資料夾透過右鍵加入、移除。
- 新增瀏覽器級命名偏好方案，可儲存、覆寫、選擇套用或刪除整套介面設定。
- 將「左側目錄樹」更名為「資料夾導覽」，並支援每位使用者放置於左側或右側邊欄。
- 將單一檔案交付整合為「下載、分享」：下載於新瀏覽情境開啟，分享統一提供複製網址與選用 QR Code。
- 收藏啟用後在側邊欄顯示有界收藏區，並連結至可搜尋、定位及取消收藏的獨立頁面。
- 將全選、清除及反向選取歸入統一選單，並新增名稱、類型、大小、日期、標籤分組與類型篩選。
- 優化清單 Padding、欄寬邊界與文字溢出；可選面板及語言包延遲載入，維持 95 KiB gzip 門檻。
- 持久化有上下限的使用者級網格／清單大小與清單欄寬；表頭分隔線支援指標拖曳、
  鍵盤調整及按兩下依內容自動適配。
- 將 Symfony 參考「檢查檔案」動作及其宿主路由限制在開發展示環境，正式環境與
  一般整合專案不再顯示或公開它。
- 清單中每個可見表頭均可觸發伺服器端排序；重複點擊切換方向，並新增 MIME 類型
  排序以及不同的升冪／降冪圖示。
- 點擊選單外部時關閉右上角「更多操作」選單；選單內部控制項維持可操作，並支援
  按 `Esc` 關閉後將焦點返回選單按鈕。

## 0.1.0-beta.19 - 2026-08-27

- 擴充 Symfony 展示環境與快速開始的檔案 Resource 白名單，預設涵蓋常用
  Microsoft Office／OpenDocument、文字、圖片、壓縮檔、音訊和視訊格式，
  同時保留主動內容與可執行副檔名的預設拒絕清單。

## 0.1.0-beta.18 - 2026-08-27

- 一般 Symfony `s3` 展示環境只需設定一個 Provider 即可啟動；選用的第二個 Provider 移至明確啟用的 `s3_dual` 環境。
- 為選用的 S3 Prefix、公開 URL、Session Token 與 Path-Style 設定提供安全預設值，同時繼續強制設定 Endpoint、Bucket 與憑據。
- CI 新增單 Provider S3 展示環境預熱測試，確保未設定第二套變數時檔案瀏覽器仍可啟動。

## 0.1.0-beta.17 - 2026-08-27

- 將展示用 `Private` Resource 隔離到新的空白 Proxy 目錄，並由安全稽核阻止公開與 Proxy Resource 共用實體根目錄。
- 新增自動 Inline／Messenger Office 預覽工作，包含冪等排隊、完整狀態、重試、逾期、共享狀態、快取清理及僅在轉換就緒後建立 PDF Frame 的進度 UI。
- 新增跨節點病毒掃描狀態、陳舊 Pending 復原、`/live`、可插拔 Storage／Queue Probe，以及 Office、Queue 與 ClamAV 逾時指標。
- 將選用前端面板拆為 Manifest Allowlist Lazy Chunk，並強制初始入口 gzip 不超過 100 KiB，同時保留輕量 Picker。
- 完善 Office Job、OpenAPI 與 Plugin Descriptor 契約，固定 CI Action 與服務 Image，並為 Tag 觸發的預發佈產生 SBOM、SHA-256 與 Provenance。

- 新增 Host 強制開關，涵蓋批次重新命名、圖片編輯／處理、文件預覽及安全狀態的 UI 與 HTTP Endpoint。
- 新增 Markdown Picker Adapter 與精確 Origin Allowlist 跨域握手，不使用萬用字元 `postMessage`。
- 新增 Redis/PDO 共享指標、維護 Lease／狀態及官方多節點分塊 Session 協調。
- 新增 Upload、Overwrite、Quota、Trash 與續傳領域並行測試，以及原子 Restore／永久刪除鎖。
- 新增圖片與維護健康檢查、Storage 耗時、Upload／限流專用指標及版本化 Capability Endpoint。
- 新增 Runtime Config Schema 與 API Snapshot；凍結 1.0 Plugin UI 為宣告式同源 Action/Previewer。
- 透過 `.php-version` 固定本機開發版本，PHP 與 Composer Command 統一使用 Repository Launcher，並保留 `PHP_BIN` 供相容性測試覆寫。

## 0.1.0-beta.16 - 2026-08-26

- 新增需鑑權的 PDF 預覽及選用 LibreOffice Office 轉換預覽，使用私有版本快取、健康檢查與安全 inline 回應。
- 新增可見的病毒掃描狀態及記錄、失敗時關閉的 ClamAV 整合，以及通過、隔離、失敗、待掃描狀態。
- 新增短期簽名私有網址、可設定的穩定 Host Controller 網址、強化的 Unicode 下載回應標頭及瀏覽器安全政策。
- 新增有界批次圖片壓縮、格式轉換、文字浮水印與圖片浮水印，並公開 Runtime 能力。
- 新增輕量檔案類型圖示、分別持久化的網格項目與清單列大小；批次重新命名、壓縮／浮水印改為使用者主動啟用。
- 新增維護狀態、快取清理及 metadata 修復命令，支援 JSON、dry-run 與機器可讀失敗狀態。
- 擴充 plugin 預覽和 UI 契約、API Schema、錯誤目錄、模糊測試及新公開行為的發布驗證。

## 0.1.0-beta.15 - 2026-08-26

- 新增帶版本的彈窗 Picker SDK、深層連結，以及 CKEditor 5、TinyMCE、TipTap、Quill 和一般表單 adapter，並提供可執行的本機整合矩陣。
- 新增資料夾上傳、確定性批次重新命名、有界 UTF-8 文字預覽與 SHA-256 校驗值。
- 深層連結指向已刪除或失效目錄時自動返回資源根目錄，資料夾樹不再重複請求該失效路徑。
- 新增 Host 強制功能策略、失效最近項目清理、目標資料夾復原和資料夾上傳預覽確認。
- 新增安全的 plugin UI Action、上傳掃描器與健康檢查契約，並提供可執行的授權參考 plugin 和失敗時關閉的 clamd `INSTREAM` 掃描器。
- 新增 PDO／Redis 原子狀態後端，可共享 metadata、配額及 request gate，並加入多程序 SQLite、Redis、MySQL 與 PostgreSQL 整合測試。
- 新增受驗證的 readiness、Prometheus、request correlation、機器可讀安全稽核及逐路由驗證的 OpenAPI 3.1 契約。
- 完成並驗證編輯器整合、plugin 及多節點正式部署的英文、簡體中文與繁體中文文件。

## 0.1.0-beta.14 - 2026-08-26

- 新增經驗證的 `filesystem_permissions.directory_mode` 與 `file_mode` 設定，供本機儲存及縮圖快取使用。
- 原子發布縮圖後統一其權限，避免 `tempnam()` 工作檔案的 `0600` 權限進入共享部署目錄。

## 0.1.0-beta.13 - 2026-08-25

- CKEditor 4 快速上傳遇到同名檔案時使用 CKFinder 風格後綴自動改名，返回實際 URL 與成功提示；只有明確設定並通過獨立覆蓋權限檢查後才取代原檔案。

## 0.1.0-beta.12 - 2026-08-25

- 新增 `uiTools=full`，讓 picker 保留選擇回呼的同時顯示完整且受 ACL 控制的管理、詳細資訊和圖片工具。
- 未啟用 Logo 時，把麵包屑移到原品牌位置並將桌面搜尋框右移；行動版使用精簡的兩列命令列。
- 對重新命名、裁切副本、複製／移動目標和資源回收筒自動改名統一執行可攜名稱、長度、副檔名鎖定及資源副檔名檢查，並提供明確提示。
- 每頁數量可輸入或選擇常用值，記住瀏覽器偏好，並在前後端限制為 10–500。
- 預設在命令列顯示精簡 Logo；`ui.header` 控制相鄰品牌文字，不再新增獨立 Header。
- Picker 保留新增資料夾、上傳、拖放及貼上上傳等常用工具。
- 裁切副本保留或推斷正確圖片副檔名，避免二進位圖片誤觸指令碼簽名，並在編輯器內顯示儲存錯誤。
- 裁切副本的副檔名在介面和伺服器端都不可修改，儲存時驗證名稱、MIME、尺寸和內容安全。
- 恢復清晰的 Logo 和品牌文字大小，搜尋置中、操作靠右，麵包屑位於檔案清單或網格正上方。
- 新增完整的英文、簡體中文、繁體中文檔案管理、圖片、CKEditor 4、開發整合和 HTTP API 文件。

## 0.1.0-beta.11 - 2026-08-24

- 在共用設定中定義本機 `Files` 資源，讓使用即時原始碼的 Symfony 範例可在正式模式運作。

## 0.1.0-beta.10 - 2026-08-24

- 切換至載入失敗的資源時清除過時的目錄項目，並忽略已被取代的非同步列表 response。
- 複製連結與下載單一檔案時使用已設定的公開／CDN 項目 URL；私有資源繼續使用通過驗證的 API URL。
- 允許每個資源透過設定的 Symfony 路由與參數樣板產生項目 URL，並可選用宿主提供的資料庫 context。
- 擴充使用即時原始碼的 Symfony 範例，無須發布中間套件版本即可直接測試本機與多資源 S3 瀏覽器。
- 靜止時只顯示一道淡色 panel 分隔線；只有 hover、鍵盤 focus 或拖曳中才顯示較寬的雙線調整控制。

## 0.1.0-beta.9 - 2026-08-24

- 圖片縮圖完整限制在固定高度的列表列中。
- 直向與特別高的縮圖完整限制在固定高度的網格預覽格中。
- 直向詳細資料縮圖完整顯示，不再被預覽 panel 裁切。
- 無須啟用選用的 tag 管理 UI，即可切換名稱與 tag 搜尋。
- 合併前端 stylesheet 入口，並加入窄版 manager／picker、鍵盤、圖片比例及無障礙回歸測試。
- 沒有已儲存偏好時，使用預定的 270px 詳細資料 panel 寬度。
- 將自製 crop overlay 改為 CropperJS 1.6.2，提供對齊的 handle、可靠的角落／邊緣縮放及更流暢的選取繪製。
- 使用未變更的預設副本名稱儲存裁切結果時，由伺服器選擇不衝突的名稱。
- 說明不發布版本時的本機前端與 Symfony 整合測試方式。

## 0.1.0-beta.8 - 2026-08-24

- 以對角角落 handle 與方向性邊緣 handle 改善 crop box 縮放。
- 鎖定長寬比縮放時，保持對角位置固定。
- 防止 crop box 漂移，並確保縮放後的選取範圍留在圖片邊界內。
- 加入裁切幾何與四捨五入行為的 unit test。

## 0.1.0-beta.7 - 2026-08-24

- 以可感知模式的 manager 與 picker 外殼、情境檔案操作、精簡工具和 picker 確認列，取代預設品牌頁首。
- 加入經驗證的宿主與瀏覽器顯示設定，不變更 ACL。
- 完整保留可為 null 的目錄總數與不透明 cursor 分頁。
- 讓非本機 adapter 可選擇加入安全稽核與永久刪除，而不呼叫本機回收站。
- 加入選用的 `sohophp/sofinder-s3` 套件，支援 AWS S3、R2 與 MinIO endpoint 設定、前綴隔離及有界遞迴操作。

## 0.1.0-beta.6 - 2026-08-23

- 加入繁體中文專案 README。
- 加入繁體中文 Symfony 整合、維護模式與圖片格式指南。
- 從每份英文來源文件連結至其翻譯指南。
- 保持所有 PHP、HTTP、儲存與前端執行期契約不變。

## 0.1.0-beta.5 - 2026-08-23

- 加入有界 `inline`、選用 `messenger`、外部排程與停用等維護模式，同時保留同步回收站容量安全機制。
- 使用 non-blocking lock 序列化清理入口，並限制 Web request 清理頻率，不需要 daemon 或 cron 服務。
- 加入 compact、standard、large 與 extra-large 介面密度設定，提供宿主預設值及瀏覽器本機使用者偏好。

## 0.1.0-beta.4 - 2026-08-23

- 將圖片 pipeline 與 CKEditor 圖片選取限制為可嵌入 Web 的 raster 格式：JPEG、PNG、GIF、WebP、AVIF、BMP 與 ICO。
- 當 `Files` 資源允許其副檔名時，將 HEIC、HEIF 與 TIFF 視為一般檔案；不再解碼、預覽或編輯。
- 無須遷移即可保留現有非 Web 檔案，同時拒絕向 Winstar 的 `Images` 資源新上傳 HEIC／HEIF／TIFF。
- 說明 1.0 支援政策、發布流程與 Winstar 維護排程，不變更路由、公開 URL 或 PHP 契約。

## 0.1.0-beta.3 - 2026-08-23

- 透過 CI 相容性矩陣支援 PHP 8.2–8.5 與 Symfony 6.4／7.4。
- 加入分頁儲存查詢、支援 cursor 的列表結果、儲存 capability 宣告與帶 tag 的 adapter factory。
- 將本機路徑、完整用量掃描、回收站、上傳 session 與 request gate 狀態分離至可替換契約。
- 加入可恢復分段上傳 session 狀態、過期 session 排程清理及明確的還原衝突對話框。
- 將內容傳遞與主要瀏覽器 panel 拆分成專注模組，不變更既有 HTTP 路由或 JSON field。
- 加入中央圖片格式 registry，以及每種格式優先使用 GD、fallback 至 Imagick 的 AVIF、HEIC／HEIF、TIFF 與 ICO capability 偵測。
- 使用固定 allowlist coder、解碼前 frame／pixel budget、有限資源限制及瀏覽器安全 PNG 縮圖強化 Imagick。
- 透過 API 與 console 發布有效圖片 capability；防止在 CKEditor 圖片模式選取或 QuickUpload 插入 HEIC／HEIF／TIFF。
- 加入 PHPStan、coverage CI、Range／ETag HTTP 契約檢查、component test 與 10,000 個項目的目錄回歸測試。

所有重要變更都記錄於此。專案遵循 Semantic Versioning；預發布版本仍可能調整公開擴充介面。

## 0.1.0-beta.2 - 2026-08-22

- 為唯讀縮圖提供獨立 request limit，避免大型圖片目錄耗盡更嚴格的圖片編輯 quota。
- 私下快取帶版本的縮圖 response，並重試暫時性預覽失敗，不在檔案瀏覽器留下損壞圖片控制項。
- 將 context menu 預覽改為獨立無障礙對話框，不再呼叫編輯器的檔案選取 callback。
- 改善預覽配置，將 URL 複製移至精簡圖示與點擊複製對話框，並加入持久化語言切換。
- 為檔案詳細資料與預覽對話框加入一致的 responsive padding 與在地化修改時間。
- 加入完整繁體中文（`zh-tw`）UI 文字、依 locale 顯示日期及自動偵測繁體中文瀏覽器語言。

## 0.1.0-beta.1 - 2026-08-22

- 首次公開 beta，包含不依賴 framework 的核心與 Symfony 7.4 Bundle。
- 提供本機儲存、安全上傳、ACL、回收站、公開／proxy 傳遞、持久化 quota 計算及 CKEditor 4 整合。
- React 檔案瀏覽器具備 responsive 網格／列表檢視、選用工具、tag、資料夾樹、上傳佇列及 Canvas 圖片裁切編輯器。
