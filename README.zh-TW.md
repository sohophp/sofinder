# SoFinder

其他語言：[English](README.md) · [简体中文](README.zh-CN.md)

SoFinder 是原創、採 MIT 授權的網頁檔案管理器，支援 PHP 8.2 至 8.5，包含與框架無關的核心、Symfony 6.4／7.4 Bundle，以及 React 使用者介面。

本專案採獨立設計，不包含專有檔案管理器的程式碼、美術、翻譯、樣式或其他資產。Runtime 相依套件聲明記錄於 `THIRD_PARTY_NOTICES.md`。

一般使用者可閱讀[檔案管理器指南](https://sofinder.sohophp.app/zh-TW/user-guide)、[圖片管理](https://sofinder.sohophp.app/zh-TW/image-guide)和[編輯器整合](https://sofinder.sohophp.app/zh-TW/editor-integrations)。開發者請使用[整合指南](https://sofinder.sohophp.app/zh-TW/developer-guide)及 [HTTP API 參考](https://sofinder.sohophp.app/zh-TW/api-reference)。

## Symfony 安裝

完整文件站位於 <https://sofinder.sohophp.app/zh-TW/>。註冊 `SohoPHP\SoFinder\SoFinderBundle`，匯入 `@SoFinderBundle/Resources/config/routes.yaml`，並在 `so_finder.resources` 設定一個或多個資源類型。完整範例請見[繁體中文 Symfony 整合](https://sofinder.sohophp.app/zh-TW/symfony)。

已實作功能包含：登入後瀏覽、搜尋、上傳、資料夾上傳、下載、新增資料夾、重新命名、批次重新命名、可復原刪除、自動衝突命名的複製／移動、伺服器限制的分頁、名稱／大小／日期排序、網格／清單檢視、多選、具數量上限及逐項結果的批次操作、資料夾樹、右鍵／長按選單、文字預覽、SHA-256、一般／分塊上傳、圖片處理、ZIP 下載、響應式三語介面，以及 CKEditor 4 與適用於 CKEditor 5、TinyMCE、TipTap、Quill、一般表單的彈窗 SDK。

資源可設定 byte 配額、必要 Symfony roles 及各操作專用 roles。成功異動會產生結構化 PSR-3 audit log。每位使用者的收藏、標籤及最近 50 筆記錄會透過可替換的 metadata store 原子保存。

選用資產目錄提供穩定 ID、多語言替代文字、標題、共享標籤及回應式變體。beta.24 新增有界跨目錄資產搜尋、可編輯資產屬性、由 Host 登記的使用關係與刪除預檢、可撤銷私有存取工作階段及明確的資產移轉命令。

Symfony 整合亦提供經驗證的主題設定、tagged plugin descriptor registry、鍵盤檔案導覽、可見焦點及螢幕閱讀器選取提示。公開擴充契約請見 `docs/plugins.md`。

正式環境可加入同源 plugin UI Action 與 tagged 上傳掃描器。選用 PDO／Redis 原子狀態、readiness、Prometheus、request ID 與 JSON 安全稽核支援多節點部署，詳見 `docs/production.md` 與 `docs/public/openapi.json`。

圖片詳細資訊會顯示實際解碼尺寸。圖片編輯預設自動命名並另存副本；覆蓋必須明確選擇。裁剪支援縮放、平移、八方向控制點、比例、鍵盤／數值微調、復原／重做及前後比較。瀏覽器齒輪選單可控制選用圖片工具，旋轉和預設尺寸預設關閉。複製與移動可從完整授權資源選取資料夾，伺服器仍會執行路徑沙箱及 ACL。

每個資源可分別限制 Unicode 檔名長度、資料夾名稱長度與資料夾深度。上傳、新增資料夾、重新命名、複製及移動都會檢查，包含被移動資料夾的完整子樹。

上傳流程使用私有隔離區、實際 byte 限制、活動內容檢查及完整圖片解碼，再原子發布。SoFinder 也提供繼承式路徑 ACL、public／proxy delivery、Range／ETag、操作門禁、結構化失敗 audit 及私有 30 天回收站。部署時執行 `sofinder:security:audit`；使用外部排程時安排 `sofinder:trash:cleanup` 與 `sofinder:uploads:cleanup`。預設為有上限的 inline 維護，詳見[維護模式](https://sofinder.sohophp.app/zh-TW/maintenance)與[安全部署](https://sofinder.sohophp.app/zh-TW/security)。

圖片管線支援可嵌入網頁的 JPEG、PNG、GIF、WebP、AVIF、BMP、ICO。可用時優先使用 GD，ICO 可選用 Imagick fallback。解碼圖片上限為五千萬像素，編輯會保留原始格式與副檔名。HEIC、HEIF、TIFF 可放在一般檔案資源，但不解碼、不預覽、不編輯。縮圖 Cache 保留 30 天並限制最多 5,000 個檔案；ZIP 最多接受 100 個選取根、總計 1,000 個項目及 512 MB。

## 開發

```bash
./scripts/composer.sh install
./scripts/php-bin.sh vendor/bin/phpunit
./scripts/composer.sh phpstan
cd frontend
corepack pnpm install
corepack pnpm build
corepack pnpm test:unit
```

儲存擴充契約請見 `docs/storage-adapters.md`；公開 PHP 契約、HTTP 相容性與版本政策請見 `docs/php-contracts.md`、`docs/http-api.md`、`docs/versioning.md`。圖片 Runtime 需求請見[圖片格式支援](https://sofinder.sohophp.app/zh-TW/image-formats)。可執行的 Symfony 6.4／7.4 安裝範例位於 `examples/symfony`。

S3 相容物件儲存由選用的 `sohophp/sofinder-s3` Composer 套件提供，使核心
安裝不必承擔 AWS SDK 相依；可使用私有 proxy delivery，或明確設定公開／CDN
網址。原始碼發行內容請見 `packages/sofinder-s3/README.md`。
