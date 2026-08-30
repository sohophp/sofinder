<p align="center">
	<a href="https://sofinder.sohophp.app/zh-TW/">
		<img src="docs/public/logo.svg" width="96" height="96" alt="SoFinder 標誌">
	</a>
</p>

<h1 align="center">SoFinder</h1>

<p align="center"><strong>適用於現代 PHP 應用程式的安全、可擴充檔案管理器。</strong></p>

<p align="center">
	<a href="https://github.com/sohophp/sofinder/actions/workflows/ci.yml"><img src="https://github.com/sohophp/sofinder/actions/workflows/ci.yml/badge.svg" alt="持續整合狀態"></a>
	<a href="https://packagist.org/packages/sohophp/sofinder-symfony"><img src="https://img.shields.io/packagist/v/sohophp/sofinder-symfony.svg?label=stable" alt="最新穩定版本"></a>
	<a href="https://packagist.org/packages/sohophp/sofinder-symfony"><img src="https://img.shields.io/packagist/dt/sohophp/sofinder-symfony.svg" alt="總下載量"></a>
	<a href="https://packagist.org/packages/sohophp/sofinder-symfony"><img src="https://img.shields.io/packagist/dependency-v/sohophp/sofinder-symfony/php.svg" alt="PHP 版本需求"></a>
	<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-16865c.svg" alt="MIT 授權條款"></a>
</p>

<p align="center">
	<a href="https://sofinder.sohophp.app/zh-TW/">完整文件</a> ·
	<a href="https://sofinder.sohophp.app/zh-TW/getting-started">快速開始</a> ·
	<a href="https://sofinder.sohophp.app/zh-TW/api-reference">API 參考</a> ·
	<a href="README.md">English</a> ·
	<a href="README.zh-CN.md">简体中文</a>
</p>

SoFinder 是原創、採 MIT 授權的網頁檔案管理器，支援 PHP 8.2 至 8.5，包含與框架無關的核心、Symfony 6.4／7.4 Bundle，以及 React 使用者介面。

本專案採獨立設計，不包含專有檔案管理器的程式碼、美術、翻譯、樣式或其他資產。Runtime 相依套件聲明記錄於 `THIRD_PARTY_NOTICES.md`。

## 介面預覽

<p align="center">
	<a href="docs/public/screenshots/browser.png">
		<img src="docs/public/screenshots/browser.png" alt="包含資源導覽、縮圖與檔案詳細資訊的 SoFinder 檔案管理器" width="100%">
	</a>
	<br>
	<sub><strong>檔案工作區</strong> — 資源導覽、視覺化瀏覽、收藏與檔案詳細資訊。</sub>
</p>

<table>
	<tr>
		<td width="50%" align="center">
			<a href="docs/public/screenshots/image-editor.png"><img src="docs/public/screenshots/image-editor.png" alt="SoFinder 圖片裁剪編輯器"></a>
			<br><sub><strong>圖片編輯器</strong> — 裁剪、旋轉、縮放、最佳化與浮水印。</sub>
		</td>
		<td width="50%" align="center">
			<a href="docs/public/screenshots/security-status.png"><img src="docs/public/screenshots/security-status.png" alt="SoFinder 安全與文件預覽狀態"></a>
			<br><sub><strong>運行狀態</strong> — 病毒掃描與文件預覽就緒狀態。</sub>
		</td>
	</tr>
</table>

完整支援的 Host 包含 Symfony 6.4／7.4、Laravel 12／13，以及供 Slim 4、Mezzio 3 與
純 PHP 使用的共用 PSR-15 Bridge；同時保留已測試且不依賴框架 Request／Container
的 Registry 與 `FileManager` headless 入口。準確支援層級請見
[`docs/zh-TW/framework-support.md`](docs/zh-TW/framework-support.md)。PHP 7.2
移植只能使用獨立 Package 及獨立發布線，不進入目前 Branch 或 1.x 依賴圖。

一般使用者可閱讀[檔案管理器指南](https://sofinder.sohophp.app/zh-TW/user-guide)、[圖片管理](https://sofinder.sohophp.app/zh-TW/image-guide)和[編輯器整合](https://sofinder.sohophp.app/zh-TW/editor-integrations)。開發者請使用[整合指南](https://sofinder.sohophp.app/zh-TW/developer-guide)及 [HTTP API 參考](https://sofinder.sohophp.app/zh-TW/api-reference)。

## 安裝

請依 Host Framework 選擇套件：

| 應用程式 | Composer 套件 | 完整步驟 |
| --- | --- | --- |
| Symfony 6.4／7.4 | `sohophp/sofinder-symfony:^1.1` | [Symfony 安裝](https://sofinder.sohophp.app/zh-TW/getting-started) |
| Laravel 12／13 | `sohophp/sofinder-laravel:^1.1` | [Laravel 整合](https://sofinder.sohophp.app/zh-TW/framework-integrations#laravel-12-和-13) |
| Slim 4／Mezzio 3／純 PHP | `sohophp/sofinder-psr15:^1.1` | [PSR-15 整合](https://sofinder.sohophp.app/zh-TW/framework-integrations#共用-psr-15-runtime) |
| 僅領域服務，無瀏覽器/API | `sohophp/sofinder-core:^1.1` | [Core 整合](https://sofinder.sohophp.app/zh-TW/framework-integrations#僅使用-core-和其他框架) |

### Symfony

新的 Symfony 應用程式應直接安裝穩定 Bridge：

```bash
composer require sohophp/sofinder-symfony:^1.1
```

既有應用程式可以繼續使用相容 Meta Package `sohophp/sofinder:^1.1`；兩個 Package 名稱都公開相同的
`SohoPHP\SoFinder` namespace。

完整文件站位於 <https://sofinder.sohophp.app/zh-TW/>。註冊 `SohoPHP\SoFinder\SoFinderBundle`，匯入 `@SoFinderBundle/Resources/config/routes.yaml`，並在 `so_finder.resources` 設定一個或多個資源類型。完整範例請見[繁體中文 Symfony 整合](https://sofinder.sohophp.app/zh-TW/symfony)。

已實作功能包含：登入後瀏覽、搜尋、上傳、資料夾上傳、下載、新增資料夾、重新命名、批次重新命名、可復原刪除、自動衝突命名的複製／移動、伺服器限制的分頁、名稱／大小／日期排序、網格／清單檢視、多選、具數量上限及逐項結果的批次操作、資料夾樹、右鍵／長按選單、文字預覽、SHA-256、一般／分塊上傳、圖片處理、ZIP 下載、響應式三語介面，以及 CKEditor 4 與適用於 CKEditor 5、TinyMCE、TipTap、Quill、wangEditor、Jodit、一般表單的彈窗 SDK。

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
