---
title: 安全部署
description: SoFinder 正式環境的驗證、授權、儲存、上傳與維護安全檢查表。
---

# 安全部署

## 上線前檢查

- SoFinder 路由必須位於 Symfony 防火牆後方。
- 每個資源均設定符合需求的 `roles`、`operation_roles` 與 `path_acl`。
- 私有資源放在 Web Root 外，使用 `delivery_mode: proxy`，且沒有 Web Server alias。
- quarantine、chunk、trash、metadata 及 usage 路徑不可被 HTTP 直接存取。
- PHP Runtime 只擁有必要目錄的最小讀寫權限。
- 明確設定允許的副檔名、MIME、檔案大小、配額與圖片像素上限。
- 執行安全稽核及圖片能力檢查。

```bash
bin/console sofinder:security:audit
bin/console sofinder:image:capabilities
```

## 維護

使用 `external` 模式時必須排程：

```bash
bin/console sofinder:trash:cleanup
bin/console sofinder:uploads:cleanup
```

S3 刪除對 SoFinder 而言是永久的；依照復原需求啟用供應商版本控制及 Lifecycle Policy。

## 回報弱點

請勿在公開 Issue 揭露安全問題。使用 [GitHub 私有弱點回報](https://github.com/sohophp/sofinder/security/advisories/new)，並提供受影響版本、已遮蔽機密的設定、重現方式及影響。

更完整的威脅與控制說明請閱讀[英文安全指南](/security)及[威脅模型](/threat-model)。
