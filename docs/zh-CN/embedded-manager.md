---
title: 嵌入式管理器
description: 在同源管理界面中嵌入与宿主品牌无关的 SoFinder 管理器。
---

# 嵌入式管理器

为同源管理界面的 iframe 使用 `uiProfile=embedded`。专用嵌入外观隐藏
SoFinder 品牌，以紧凑、轻边框的文件操作区与宿主管理后台衔接。搜索、排序、视图、
上传及文件操作均保留，所有请求继续经过宿主的身份验证和权限检查。

```html
<iframe src="/sofinder/browser?uiProfile=embedded"
        title="文件管理" style="width:100%;height:640px;border:0;display:block"
        allow="clipboard-write" referrerpolicy="same-origin"></iframe>
```

由宿主决定 iframe 的高度。SoFinder 将工具栏、文件滚动区和分页限制在给定空间内。
`uiProfile=embedded` 只改变展示，不授予权限；旧的 `uiMode=manager&uiEmbedded=1`
地址继续兼容。内嵌仍遵守同源 frame 安全策略，不开放任意外部站点嵌入。
