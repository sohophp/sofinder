---
title: 发布流程
description: SoFinder 维护者测试、建立标签与发布软件包的检查列表。
---

# 发布流程

在仓库根目录运行完整本地门禁（默认 PHP 低于 8.2 时设置 `PHP_BIN`）：

```bash
PHP_BIN=/opt/remi/php85/root/usr/bin/php ./scripts/release-check.sh
```

1. 确认 `composer validate --strict`、PHPUnit、前端型别检查与构建、浏览器测试、无障碍检查和原创性扫描全部通过。
2. 检查相依软件包审计结果与 `THIRD_PARTY_NOTICES.md`。
3. 完成 `trademark-clearance.md` 中的商标检查关卡。
4. 推送 `main`、建立附注且不可变更的标签，再建立相符的 GitHub Release。
5. 将 `https://github.com/sohophp/sofinder` 提交至 Packagist，并配置 GitHub 更新 hook。
6. 在全新的 Symfony 项目安装确切版本，执行安全审计后才宣布发布。

当前 beta 的确切 Composer 版本限制是 `sohophp/sofinder:0.1.0-beta.16`。已发布的标签不得移动。

S3 adapter 位于 `packages/sofinder-s3`，会在相符的核心预发布版本之后，以独立 repository 发布。当前 adapter 版本为 `v0.1.0-beta.2`：

1. 从核心发布的确切 commit 拆分软件包目录：`git subtree split --prefix=packages/sofinder-s3 -b release/sofinder-s3-beta.2`。
2. 将该 branch 推送到 `https://github.com/sohophp/sofinder-s3` 的 `main`。
3. 执行软件包自己的 MinIO CI，再建立不可变更的 `v0.1.0-beta.2` 标签，不得移动核心标签。
4. 确认 Packagist 已索引新的 adapter 标签。
5. 在全新的 Symfony 项目验证安装后，才启用宿主资源。切勿将凭证复制到任何 repository 或发布记录中。
