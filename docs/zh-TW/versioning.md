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

目前 1.x Support Matrix 為 PHP 8.1–8.5。Symfony 6.4 LTS 支援完整範圍，Symfony 7.4 LTS 從 PHP 8.2 開始支援。內建 Local Adapter 納入 Support Promise。React Application 是 Composer Package 隨附的私有 Build Input；不發布 npm Package。

PHP 7.2 不屬於此 Matrix，也不會加入 `main` 或 1.x Composer 約束。Symfony 支援
Matrix 穩定後，若移植具可維護性，仍必須使用獨立 Repository、Composer Package、
版本空間、依賴鎖定、CI Matrix 及安全政策。詳見[框架支援](framework-support.md)。
