---
title: 包架构
description: 多框架 Composer 拆包边界及分阶段发布状态。
---

# 包架构

SoFinder 正从 1.0 前的 Symfony Bundle 迁移为同步版本的多个 Composer 包。只有当
一个包所需源码全部位于可发布子目录、并且独立安装测试通过后，才会把它标记为可安装；
不会用引用仓库外路径的占位 `composer.json` 冒充拆包完成。

| 包 | 职责 | 当前状态 |
| --- | --- | --- |
| `sofinder-core` | Domain、Storage、Value 和宿主 Contract | 已完成物理拆分和独立安装验证 |
| `sofinder-http` | Endpoint Catalog、PSR Dispatcher 和共享 Handler | 51 个非展示端点均已有共享 Action；`/browser` 保留为宿主 Bridge 页面 |
| `sofinder-symfony` | Bundle、HttpFoundation、Console、Messenger | 已完成物理拆分、发布资源和独立安装验证 |
| `sofinder-laravel` | Laravel 12/13 Provider、授权、CSRF、路由、命令 | 全部共享 Handler、维护命令和安全审计已通过真实应用测试；正式发布仍受门禁约束 |
| `sofinder-psr15` | Slim、Mezzio 和纯 PHP Middleware | 已完成独立安装、真实宿主冒烟及路由/Action 覆盖；完整端点一致性仍受门禁约束 |

`FrameworkBoundaryTest` 会禁止物理 Core 包引入 Symfony、Illuminate、Slim 或 Mezzio；
Symfony 现在直接从框架无关的中央清单生成 52 条路由，兼容 YAML 文件只负责导入该集合，
测试会核对路径、方法、参数约束、Controller 和特殊默认值。

兼容矩阵保留已提交的 PHP 8.2 Composer Platform 作为最低解析目标，执行 PHP 8.2／
Symfony 6.4 `prefer-lowest`；PHP 8.5／Symfony 7.4 最新依赖则使用不带 Platform Override
的临时清单，绝不改写仓库中的最低版本配置。

Core、HTTP 和 PSR-15 已通过不安装 Symfony 的 Composer 独立安装验证。Symfony Bridge
也已从物理子目录完成独立安装验证，并携带自己的发布资源。`sohophp/sofinder` 现已转为
依赖 `sohophp/sofinder-symfony` 的兼容 Meta Package，在不保留根目录重复源码的情况下
维持原包名与 `SohoPHP\\SoFinder` namespace。
每个 Split Repository 都携带包内 PHP／Composer 包装脚本及锁定 Action 版本的 CI，
分别验证 PHP 8.2 最低依赖和 PHP 8.5 稳定依赖；这些开发文件会从使用者 Distribution
Archive 中排除。

可执行的 Slim 4、Mezzio 3 和纯 PHP Front Controller 会在 PHP 8.2 与 8.5 上调用真实
Router 和 Response Emitter；它们与 Symfony、Laravel 在 CI 中执行同一真实上传、
Range/ETag Stream、文件变更与回收站生命周期。正式入口要求构造时显式提供 Authorization、Actor、CSRF
及 Event Dispatcher；示例对受保护操作默认拒绝，不提供匿名全放行配置。

Core 中的 `ConfigurationNormalizer` 是框架配置数组的统一入口，负责默认值、列表替换、
旧上传命名别名及安全范围。Symfony 解析后的 YAML 也必须经过同一 Normalizer；Laravel
与纯 PHP Adapter 可提供各自的路径／密钥默认值，而无需引入 Symfony Config。

Mutation Action 必须显式注入 `AuthorizationInterface` 和
`CsrfTokenProviderInterface`；认证与 CSRF 校验发生在 JSON 解析之前，宿主不能通过
遗漏安全依赖获得匿名放行默认值。

目前全部 51 个非展示端点都通过框架无关 Action 执行，其中包含 Metadata、内容读取、
Range/ETag 流式下载、图片缩略图与变体、文档预览、Prometheus Metrics、标准/分块/兼容上传、
资产访问会话、归档、完整资产 API、签名 URL 和安全状态。剩余 `/browser` 是由完整框架 Bridge
渲染的 HTML 外壳，刻意不下沉到无框架 HTTP 用例。
端点 URL 与角色授权使用 Core
契约并由 Symfony Adapter 实现；功能开关、显式 Workspace 隔离和 Mutation 校验不在
Bridge 中重复实现。
