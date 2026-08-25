---
title: 更新紀錄
description: SoFinder 每個公開版本的重要變更。
---

# 更新紀錄

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
