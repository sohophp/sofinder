---
title: Embedded manager
description: Embed the host-neutral SoFinder manager in a same-origin administration interface.
---

# Embedded manager

Use `uiProfile=embedded` when SoFinder runs inside a same-origin administration iframe. This profile removes the standalone branding and uses a compact manager layout while retaining search, sorting, views, uploads and every operation allowed by server capabilities and ACLs.

```html
<iframe src="/sofinder/browser?uiProfile=embedded"
        title="File manager" style="width:100%;height:640px;border:0;display:block"
        allow="clipboard-write" referrerpolicy="same-origin"></iframe>
```

The host owns the iframe height. SoFinder adapts to the available width and can report its content height through the existing same-origin integration. The profile changes presentation only and never grants permissions. Legacy `uiMode=manager&uiEmbedded=1` URLs remain supported.
