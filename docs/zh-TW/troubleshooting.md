---
title: 疑難排解
description: 診斷常見的 SoFinder 路由、授權、上傳、圖片、儲存與部署問題。
---

# 疑難排解

## 檔案瀏覽器路由回傳 404

確認 Bundle 已註冊且路由資源已匯入：

```bash
bin/console debug:router | grep sofinder
```

匯入路由的前綴決定公開 URL。保留作相容用途的 `so_finder.route_prefix` 設定不能取代路由匯入。

## 檔案瀏覽器回傳 401 或 403

- 確認請求由已驗證使用者的 Symfony firewall 處理。
- 檢查資源的 `roles`、`operation_roles` 與 `path_acl`。
- 請記住，適用的 deny 規則優先於 allow。
- 前端顯示的 capability 僅供參考；伺服器會再次授權最終操作與路徑。

## 上傳遭到拒絕

依序檢查：

1. PHP／Web Server 的 request body 大小與 timeout 限制。
2. 資源的 `max_size`、副檔名及 MIME allowlist。
3. 檔名長度與目的地資料夾深度。
4. 資源 quota 與檔案系統可用空間。
5. 隔離區、分段上傳、儲存與用量目錄的寫入權限。
6. 稽核記錄是否有主動式內容或解碼後圖片遭拒絕的資訊。

## 圖片沒有預覽或編輯器

```bash
bin/console sofinder:image:capabilities
```

安裝具備所需 coder 的 GD 或 Imagick，再重新啟動 PHP 執行環境。HEIC、HEIF 與 TIFF 可儲存在一般檔案資源中，但刻意不提供瀏覽器預覽或編輯。詳見[圖片格式](/zh-TW/image-formats)。

## 未驗證即可存取私有檔案

`delivery_mode: public` 會刻意略過 SoFinder 的讀取授權。請將儲存根目錄移至 Web 根目錄以外、移除 Web Server alias、清空 `public_url`，並改用 `delivery_mode: proxy`。

## 產生的連結使用錯誤前綴

Symfony 匯入路由的前綴才是最終依據。修正 `config/routes/so_finder.yaml`，再清除正式環境的路由與應用程式快取。

## 外部匯入後 quota 不正確

```bash
bin/console sofinder:usage:recalculate
```

重新計算期間，不要從 SoFinder 以外修改受管理的儲存空間。

## S3 相容供應商連線失敗

- 除非是明確受信任的本機 MinIO 網路，否則請使用 HTTPS。
- 分別確認 region、endpoint 與 bucket。
- MinIO 啟用 path-style endpoint；AWS S3、R2 與 B2 通常保持停用。
- Cloudflare R2 使用 `region: auto`。
- 若供應商不支援有條件的 Put Object，只有在接受文件所述的並行建立競爭後，才設定 `conditional_writes: false`。
- 使用套件的供應商 smoke test、非正式環境 bucket，以及限制前綴的憑證。

## 收集有用的診斷資料

請提供版本、移除機密後的有效設定、路由輸出、失敗操作及相關應用程式記錄。切勿在公開 issue 貼上憑證、簽署 URL、session 識別碼或私有檔案內容。安全漏洞請透過 [GitHub 私密漏洞回報](https://github.com/sohophp/sofinder/security/advisories/new)通報。
