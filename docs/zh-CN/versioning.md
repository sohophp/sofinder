---
title: 版本与兼容性
description: SoFinder Semantic Versioning、Beta 兼容性及公开契约政策。
---

# 版本与兼容性

SoFinder 遵循 Semantic Versioning。1.0 前的 Release 可变更 PHP Extension Interface，但 Changelog 及 `UPGRADING.md` 必须提供 Migration。beta.3 的 Storage Contract 变更是 1.0 前最后一项计划中的 Breaking Change。

从 1.0 开始：

- HTTP Route、文件化 JSON Field 与公开 PHP Contract 在整个 1.x 期间保持向后兼容。
- Minor Release 可以新建可选 Field、Capability Flag、Event 及 Interface；Client 必须忽略未知 JSON Field。
- Deprecation 至少保留一个 Minor Release，并在下一个 Major Version 移除前列入 Changelog。
- Security Fix 及 Data-integrity Fix 可在没有 Deprecation Period 的情况下收紧验证。
- 已发布的 Composer Tag 不可变。

当前 1.x Support Matrix 为 PHP 8.1–8.5。Symfony 6.4 LTS 支持完整范围，Symfony 7.4 LTS 从 PHP 8.2 开始支持。内建 Local Adapter 纳入 Support Promise。React Application 是 Composer Package 随附的私有 Build Input；不发布 npm Package。

PHP 7.2 不属于此矩阵，也不会加入 `main` 或 1.x Composer 约束。Symfony 支持矩阵
稳定之后，如果移植具备可维护性，仍必须使用独立仓库、Composer 包、版本空间、依赖
锁定、CI 矩阵和安全政策。详见[框架支持](framework-support.md)。
