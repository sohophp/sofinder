---
title: 发布流程
description: SoFinder 维护者测试、建立标签与发布软件包的检查列表。
---

# 发布流程

在仓库根目录运行完整本地门禁。`.php-version` 会通过
`scripts/php-bin.sh` 选择开发解释器；仅在有意运行兼容性测试时使用
`PHP_BIN`：

```bash
./scripts/release-check.sh
```

1. 确认 `composer validate --strict`、PHPUnit、前端型别检查与构建、浏览器测试、无障碍检查和原创性扫描全部通过。
2. 检查相依软件包审计结果与 `THIRD_PARTY_NOTICES.md`。
3. 完成 `trademark-clearance.md` 中的商标检查关卡。
4. 推送 `main`、建立附注且不可变更的标签，再建立相符的 GitHub Release。
5. 将 `https://github.com/sohophp/sofinder` 提交至 Packagist，并配置 GitHub 更新 hook。
6. 在全新的 Symfony 项目安装确切版本，执行安全审计后才宣布发布。

当前 beta 的确切 Composer 版本限制是 `sohophp/sofinder:0.1.0-beta.31`。已发布的标签不得移动。

## 同步发布 1.x 软件包

1.x 发布必须从同一 Release Commit 拆分每个可发布子目录，并给本次参与发布的所有软件包
建立完全相同的版本标签。内部依赖使用 `self.version`，因此按 Core、HTTP、Symfony、S3、
兼容 Meta Package 的顺序发布并等待索引。PSR-15 和 Laravel 只有在
`config/framework-support.json` 的 1.0 观察门禁 eligible 后，才能加入同步 Minor。

建立标签前运行 `scripts/check-package-install.sh`；它会使用镜像副本而不是 Symlink 安装，
并校验每个归档的 README、License、运行时 Autoload 边界及 Symfony 前端第三方声明。
不得发布依靠 Monorepo 根目录残留文件才能运行的子目录。

可用 `scripts/build-release-archives.sh 1.0.0-rc.1 WORKTREE <output>` 在本地预览
五个归档。Tag Workflow 会从不可变 Git Object 重新构建，而非直接打包 Checkout；随后校验
包身份与运行时内容，并发布排序后的统一 `SHA256SUMS`。`v1.0.0-rc.1` 等带连字符 Tag
自动成为 Prerelease，`v1.0.0` 自动成为最新正式版。

首次建立 1.x Tag 前，必须创建 `sohophp/sofinder-core`、`sohophp/sofinder-http`、
`sohophp/sofinder-symfony` 和 `sohophp/sofinder-s3` Repository，将各 Composer 包
登记到 Packagist，并配置对这些 Repository 有写权限的 Actions Secret
`SOFINDER_PACKAGE_PUSH_TOKEN`。发布任务会构建可复现的子目录历史 Bundle，校验包身份与
Checksum，再以一次原子 Push 建立 `main` 和不可变版本 Tag，且不会 Force Push。Repository／
Token 缺失或分支无法 Fast-forward 时，会在建立 GitHub Release 前停止。PSR-15 与 Laravel
只在晋级门禁 eligible 后加入。

CI 还会使用隔离的“仅测试 eligible 策略”运行
`scripts/check-gated-bridge-release-artifacts.sh`。它会预先生成 Laravel 与 PSR-15 归档及拆分仓库，
把六个包原子发布到本地裸仓库，并在干净消费者中安装同一 RC 版本。策略覆盖若未显式启用测试模式
会被拒绝，Tag 发布工作流也不会使用该覆盖，因此这项预演无法打开生产门禁。

Split 只是发布边界，并不改变 Monorepo 开发模式：[Packagist 要求每个包的 `composer.json`
位于所提交 VCS Repository 的顶层](https://packagist.org/about)，权威开发来源仍是本
Monorepo。

由于同步包使用 `self.version`，安装 RC 的项目必须允许传递 RC 依赖：在根项目设置
`minimum-stability: RC` 并启用 `prefer-stable: true`，或者等待正式版 Tag。稳定 1.x
使用者无需这个覆盖。

每日 `Symfony 1.0 observation` Workflow 只会在不可变的 `1.0.0` GitHub Release
存在后开始。除了收集缺陷证据，它还会在 PHP 8.2 与 8.5 的空项目中从 Packagist 安装精确的
Core、HTTP 与 Symfony 版本，校验拆分仓库来源、运行时边界，并审计 Symfony 消费项目的
依赖锁。维护者必须为符合条件的 Issue 加上精确 `priority:p0` 或 `priority:p1` Label。
每次运行都会上传保留 90 天的 JSON Artifact，包含发布时间、覆盖天数、未关闭数量以及观察期内
建立的全部 P0/P1 Issue；即使 Issue 已关闭也会令运行失败。开启框架晋级门禁时，使用包含两个
公开包安装任务的最终成功 Workflow Run 作为缺陷审计 URL。本地可运行
`scripts/check-published-package-install.sh`，以独立 Composer 缓存重复 Registry 校验。

S3 Adapter 位于 `packages/sofinder-s3`，由同步 Workflow 发布到独立 Repository。
其历史预发布版本为 `v0.1.0-beta.2`；1.x 与 Core 使用相同版本。启用宿主资源前必须确认
Packagist Tag 及全新项目安装，并且不得把凭证写入 Repository 或发布日志。
