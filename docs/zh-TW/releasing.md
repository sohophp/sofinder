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

目前 beta 的確切 Composer 版本限制是 `sohophp/sofinder:0.1.0-beta.23`。已發布的標籤不得移動。

S3 adapter 位於 `packages/sofinder-s3`，會在相符的核心預發布版本之後，以獨立 repository 發布。目前 adapter 版本為 `v0.1.0-beta.2`：

1. 從核心發布的確切 commit 拆分套件目錄：`git subtree split --prefix=packages/sofinder-s3 -b release/sofinder-s3-beta.2`。
2. 將該 branch 推送到 `https://github.com/sohophp/sofinder-s3` 的 `main`。
3. 執行套件自己的 MinIO CI，再建立不可變更的 `v0.1.0-beta.2` 標籤，不得移動核心標籤。
4. 確認 Packagist 已索引新的 adapter 標籤。
5. 在全新的 Symfony 專案驗證安裝後，才啟用宿主資源。切勿將憑證複製到任何 repository 或發布記錄中。
