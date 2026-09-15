---
title: 嵌入式管理器
description: 在同源管理介面中嵌入與宿主品牌無關的 SoFinder 管理器。
---

# 嵌入式管理器

在同源管理介面的 iframe 中使用 `uiProfile=embedded`。嵌入外觀會隱藏 SoFinder
品牌，並使用緊湊、輕邊框的檔案操作區。搜尋、排序、檢視、上傳及檔案操作均會保留，
所有請求仍受伺服器 Capability 與 ACL 限制。

```html
<iframe src="/sofinder/browser?uiProfile=embedded"
        title="檔案管理" style="width:100%;height:640px;border:0;display:block"
        allow="clipboard-write" referrerpolicy="same-origin"></iframe>
```

iframe 高度由宿主決定。`uiProfile=embedded` 只改變顯示，不授予權限；舊的
`uiMode=manager&uiEmbedded=1` 網址繼續相容。嵌入仍遵守同源 frame 安全策略。
