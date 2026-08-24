---
title: 版本與相容性
description: SoFinder Semantic Versioning、Beta 相容性及公開契約政策。
---

# 版本與相容性

SoFinder 遵循 Semantic Versioning。1.0 前的 Release 可變更 PHP Extension Interface，但 Changelog 及 `UPGRADING.md` 必須提供 Migration。beta.3 的 Storage Contract 變更是 1.0 前最後一項計畫中的 Breaking Change。

從 1.0 開始：

- HTTP Route、文件化 JSON Field 與公開 PHP Contract 在整個 1.x 期間保持向後相容。
- Minor Release 可以新增選用 Field、Capability Flag、Event 及 Interface；Client 必須忽略未知 JSON Field。
- Deprecation 至少保留一個 Minor Release，並在下一個 Major Version 移除前列入 Changelog。
- Security Fix 及 Data-integrity Fix 可在沒有 Deprecation Period 的情況下收緊驗證。
- 已發布的 Composer Tag 不可變。

1.0 Support Matrix 為 PHP 8.2–8.5 搭配 Symfony 6.4 LTS 或 7.4 LTS。內建 Local Adapter 是唯一納入 1.0 Support Promise 的 Storage Backend。React Application 是 Composer Package 隨附的私有 Build Input；1.0 不發布 npm Package。
