# Symfony 整合

英文原文：[symfony.md](symfony.md)

在應用程式 Kernel 註冊 Bundle：

```php
yield new \SohoPHP\SoFinder\SoFinderBundle();
```

以應用程式專用 prefix 匯入明確路由：

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

設定儲存資源。每個 root 都是安全邊界；SoFinder 不允許向父層穿越或使用 symbolic link：

```yaml
so_finder:
  theme:
    accent: '#276ef1'
    radius: '10px'
  trash_dir: '%kernel.project_dir%/var/sofinder/trash'
  usage_dir: '%kernel.project_dir%/var/sofinder/usage'
  trash_retention_days: 30
  trash_max_items: 1000
  trash_max_bytes: 1073741824
  ui:
    mode: auto          # auto、manager 或 picker
    header: false       # 選用、只顯示品牌的頁首
    logo: false
    search: true
    language_switcher: true
    view_switcher: true
    folder_tree: false # 初始偏好；每個瀏覽器可在設定中自行開啟。
    scale: standard    # compact、standard、large、xlarge；瀏覽器偏好優先。
  maintenance:
    mode: inline       # inline、messenger、external、disabled
    min_interval_seconds: 300
    max_items_per_run: 50
  image_presets:
    content: { width: 1200, height: 1200, quality: 88 }
  resources:
    Images:
      adapter: local
      root: '%kernel.project_dir%/uploads/editor/images'
      public_url: '/uploads/editor/images'
      delivery_mode: public
      max_size: 20971520
      quota: 1073741824
      max_file_name_length: 120
      max_folder_name_length: 50
      max_folder_depth: 5
      max_image_pixels: 50000000
      max_batch_items: 100
      max_recursive_items: 10000
      max_archive_items: 1000
      max_archive_bytes: 536870912
      allowed_extensions: [avif, bmp, gif, ico, jpeg, jpg, png, webp]
      allowed_mime_types: [image/avif, image/bmp, image/gif, image/jpeg, image/png, image/vnd.microsoft.icon, image/x-bmp, image/x-icon, image/webp]
      roles: [ROLE_EDITOR]
      operation_roles:
        delete: [ROLE_FILE_ADMIN]
      path_acl:
        - { path: private, operations: ['*'], roles: [ROLE_FILE_ADMIN] }
        - { path: shared, operations: [read, list], roles: [ROLE_EDITOR] }
        - { path: shared/locked, operations: [delete], roles: [], allow: false }
```

預設 Symfony Authorization adapter 要求 `IS_AUTHENTICATED_FULLY`。需要資源層或操作層 ACL 的應用程式，可替換 `AuthorizationInterface` service alias。空的 `roles` 清單維持「已登入使用者」行為；`operation_roles` 可針對 `upload`、`rename`、`copy`、`move`、`delete`、`read`、`list` 等操作覆寫資源 roles。

Path rule 會繼承到子目錄，最明確的匹配路徑優先，適用的 deny 優先於 allow。瀏覽器取得的 capabilities 只供 UI 參考；伺服器會再次授權最終路徑。Quota 設為零表示不限制。

`delivery_mode: public` 可保留直接 URL，但直接請求不經 SoFinder，因此不能套用讀取 ACL。敏感資源必須使用 `proxy`、移除 Web Server 對 storage root 的 alias，並留空 `public_url`。Proxy 支援 Range、ETag 與條件式請求，只有安全 raster image MIME 可使用 inline 顯示。

主題色只接受三位或六位 hexadecimal；圓角只接受 `0px` 至 `32px`，避免設定值變成任意 CSS。公開 Plugin 契約請見 `plugins.md`。

瀏覽器齒輪選單會將圖片工具顯示偏好存在該瀏覽器的 local storage，不會授予 capability 或改變伺服器 ACL。Resize、crop、rotation 與預設尺寸預設隱藏，可在設定中開啟。複製／移動目的地只會顯示資源 API 回傳的資料夾；伺服器仍會正規化並重新授權最終路徑。

`mode: auto` 會在 CKEditor 與 `select=1` 請求使用 `picker`，其他入口使用
`manager`。瀏覽器 URL 只能以 `uiMode=auto|manager|picker`，以及值為 `0`
或 `1` 的 `uiHeader`、`uiLogo`、`uiSearch`、`uiLanguage`、`uiView` 覆寫外觀；
無效值回退到宿主設定，且這些參數不會授予操作權限或略過伺服器授權。

名稱限制以 Unicode 字元數計算，而非 byte。資源 root 是第零層，因此 `max_folder_depth: 5` 允許檔案位於第五層資料夾，但不允許再新增第六層。複製、移動或重新命名資料夾時會檢查完整子樹。名稱支援範圍為 1–255 字元，資料夾深度為 1–100 層。

所有異動 API 都要求 `X-CSRF-TOKEN` header。Browser route 會把 token 注入 React 應用程式。CKEditor 4 相容上傳必須透過 `_token` 傳入同一 token；Origin 與 Referer 只是附加檢查，不能取代 CSRF 驗證。

## CKEditor 4

```javascript
CKEDITOR.replace("editor", {
  filebrowserBrowseUrl: "/sofinder/browser",
  filebrowserUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Files&_token=" + encodeURIComponent(soFinderCsrfToken)
});
```

使用外部排程時，每日安排 `sofinder:trash:cleanup`，部署時執行 `sofinder:security:audit`。第一次部署後及每日執行 `sofinder:usage:recalculate`，以校準 SoFinder 以外的檔案異動。一般請求使用具鎖的持久化計數器，不會遞迴掃描資源；任何 critical audit 結果都應阻擋發布。
