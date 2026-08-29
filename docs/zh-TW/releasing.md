---
title: 發布流程
description: SoFinder 維護者測試、建立標籤與發布套件的檢查清單。
---

# 發布流程

在 Repository 根目錄執行完整本機門禁。`.php-version` 會透過
`scripts/php-bin.sh` 選擇開發解譯器；只有刻意執行相容性測試時才使用
`PHP_BIN`：

```bash
./scripts/release-check.sh
```

1. 確認 `composer validate --strict`、PHPUnit、前端型別檢查與建置、瀏覽器測試、無障礙檢查和原創性掃描全部通過。
2. 檢查相依套件稽核結果與 `THIRD_PARTY_NOTICES.md`。
3. 完成 `trademark-clearance.md` 中的商標檢查關卡。
4. 推送 `main`、建立附註且不可變更的標籤，再建立相符的 GitHub Release。
5. 將 `https://github.com/sohophp/sofinder` 提交至 Packagist，並設定 GitHub 更新 hook。
6. 在全新的 Symfony 專案安裝確切版本，執行安全稽核後才宣布發布。

目前穩定 Symfony Bridge 的確切 Composer 版本限制是
`sohophp/sofinder-symfony:1.1.0`；既有應用程式可以使用相容 Meta Package
`sohophp/sofinder:1.1.0`。已發布的標籤不得移動。

## 同步發布 1.x Package

1.x 發布必須從同一 Release Commit 拆分每個可發布子目錄，並為本次參與發布的所有
Package 建立完全相同的版本標籤。內部相依使用 `self.version`，因此先發布 Core、HTTP，
再發布 Symfony、S3、PSR-15、Laravel，並驗證相容 Meta Package。晉級政策已 eligible，
自 1.1.0 起七個 Package 全部同步發布。

建立標籤前執行 `scripts/check-package-install.sh`；它會使用鏡像副本而非 Symlink 安裝，
並驗證每個 Archive 的 README、License、Runtime Autoload 邊界及 Symfony 前端第三方聲明。
不得發布依賴 Monorepo 根目錄殘留檔案才能執行的子目錄。

可用 `scripts/build-release-archives.sh 1.1.0-rc.1 WORKTREE <output>` 在本機預覽
七個 Archive。Tag Workflow 會從不可變 Git Object 重新建置，而非直接封裝 Checkout；
接著驗證 Package 身分與 Runtime 內容，並發布排序後的統一 `SHA256SUMS`。
`v1.0.0-rc.1` 等帶連字號 Tag 自動成為 Prerelease，`v1.0.0` 自動成為最新正式版。

首次建立 1.x Tag 前，必須建立 `sohophp/sofinder-core`、`sohophp/sofinder-http`、
`sohophp/sofinder-symfony`、`sohophp/sofinder-s3`、`sohophp/sofinder-psr15` 及
`sohophp/sofinder-laravel` Repository，將各 Composer Package
登記至 Packagist，並設定對這些 Repository 有寫入權限的 Actions Secret
`SOFINDER_PACKAGE_PUSH_TOKEN`。發布工作會建置可重現的子目錄歷史 Bundle，驗證 Package
身分與 Checksum，再以一次 Atomic Push 建立 `main` 及不可變版本 Tag，且不會 Force Push。
Repository／Token 缺少或 Branch 無法 Fast-forward 時，會在建立 GitHub Release 前停止。

CI 亦會使用隔離的「僅測試 eligible 策略」執行
`scripts/check-gated-bridge-release-artifacts.sh`。它會預先產生 Laravel 與 PSR-15 Archive 及拆分
Repository，把六個 Package 原子發布到本地 Bare Repository，並在乾淨 Consumer 中安裝同一 RC
版本。策略覆寫若未明確啟用測試模式便會被拒絕，Tag 發布 Workflow 亦不會使用該覆寫，因此這項
預演無法開啟正式門禁。

Split 只是發布邊界，並不改變 Monorepo 開發模式：[Packagist 要求每個 Package 的
`composer.json` 位於所提交 VCS Repository 頂層](https://packagist.org/about)，權威
開發來源仍是本 Monorepo。

由於同步 Package 使用 `self.version`，安裝 RC 的專案必須允許傳遞 RC 相依：在 Root
Project 設定 `minimum-stability: RC` 並啟用 `prefer-stable: true`，或等待正式版 Tag。
穩定 1.x 使用者不需要此 Override。

每日 `Symfony 1.0 observation` Workflow 只會在不可變的 `1.0.0` GitHub Release
存在後開始。除了收集缺陷證據，它也會在 PHP 8.2 與 8.5 的空白專案中由 Packagist 安裝
精確的 Core、HTTP、Symfony、相容 Meta 與 S3 版本，驗證 Repository 來源、Runtime 邊界，
並稽核 Symfony 與 S3 Consumer 的相依鎖。維護者必須為符合條件的 Issue 加上精確
`priority:p0` 或 `priority:p1` Label。每次執行都會上傳保留 90 天的 JSON Artifact，包含發布時間、覆蓋日數、
未關閉數量及觀察期內建立的全部 P0/P1 Issue；即使 Issue 已關閉也會令執行失敗。開啟
Framework 晉級門禁時，使用包含兩個公開 Package 安裝工作的最終成功 Workflow Run 作為
缺陷稽核 URL。本機可執行 `scripts/check-published-package-install.sh`，以獨立 Composer Cache
重複 Registry 驗證。

政策標記 eligible 後，`scripts/check-live-promotion-evidence.sh` 還會透過 GitHub API 解析
兩個已記錄的 Actions URL。Symfony Matrix 必須是成功的 `main` CI，其 SHA 與記錄的 Commit
一致；觀察工作亦必須成功，且兩者不得早於各自記錄的晉級檢查點。隨後 Script 會從該觀察
執行下載唯一且未過期的 `symfony-observation-<audit-run-id>` Artifact，並驗證其中的
`observation-evidence.json`：不可變的 1.0.0 Release、政策日期、精確的優先級 Label，以及
觀察期內零個已關閉或未關閉的 P0/P1 缺陷必須全部一致。正常路徑要求完整 30 日覆蓋；明確的
豁免路徑則要求記錄批准日期、批准者及充分原因，並保留 Artifact 中「觀察未完成」的真實狀態。
Release Workflow 會在
發布 Laravel 或 PSR-15 Split Repository 前執行此驗證。Artifact 保留 90 日，因此必須在所選
證據過期前完成晉級。

S3 Adapter 位於 `packages/sofinder-s3`，由同步 Workflow 發布至獨立 Repository。
其歷史預發布版本為 `v0.1.0-beta.2`；1.x 與 Core 使用相同版本。啟用 Host Resource 前
必須確認 Packagist Tag 及全新專案安裝，且不得將憑證寫入 Repository 或發布 Log。
