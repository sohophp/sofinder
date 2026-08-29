---
title: 框架支持
description: 框架支持级别、无框架核心入口及 PHP 7.2 隔离策略。
---

# 框架支持

当前发布线支持 PHP 8.2～8.5。Symfony 6.4 LTS／7.4 LTS 是浏览器界面、HTTP
API、命令、安全和依赖注入的完整稳定目标。

| 宿主 | 当前级别 | 发布门槛 |
| --- | --- | --- |
| Symfony 6.4／7.4 | 完整、稳定 | PHP 8.2～8.5 CI 矩阵全部通过 |
| 纯 PHP／任意容器 | 实验性 headless HTTP Bridge | 宿主显式提供授权、CSRF、Actor、事件与 PSR Factory |
| Laravel | 可使用核心；完整桥接待实现 | Symfony 基线稳定后增加 Service Provider、路由和授权测试 |
| Slim／Mezzio | 实验性 PSR-15 API Bridge | 可执行宿主示例及 Symfony 1.0 观察期门禁 |
| 其他框架 | 仅 headless 核心 | 实现公开契约，不继承内部 Controller |

实验性 PSR-15 包现已提供 Middleware 和 `RouteRegistrar`，可在 Slim 或 Mezzio 中注册
全部 51 个非展示端点的中央路径与约束；`/browser` 仍由宿主渲染。当前只有 Symfony
属于完整支持的安装方式；PSR Bridge 必须在可执行示例和发布门禁通过后才能升级为完整支持。

门禁证据记录在 `config/framework-support.json` 并由 CI 校验。只有记录的主线版本为
`1.0.0`、UTC 发布日期已满 30 天且未关闭的 P0/P1 缺陷数为零时，才允许设为 eligible。
同时必须记录最终 Symfony 矩阵的 Commit 与 Workflow URL、观察起止日期，以及安全的
P0/P1 缺陷审计链接。
`1.0.0` 发布后，每日 `Symfony 1.0 observation` Workflow 会记录观察期内建立且带有
精确 `priority:p0` 或 `priority:p1` Label 的所有 Issue。已关闭缺陷仍保留在证据中，
不能通过关闭 Issue 伪造连续无缺陷的观察期。

```php
$registrar = new RouteRegistrar($endpointDispatcher, '/sofinder');
$registrar->registerSlim($slimApp);
// 或：$registrar->registerMezzio($mezzioApp);
```

Dispatcher 必须注入已启用功能所需的共享 Handler。缺少 Handler 会返回
`501 endpoint_not_implemented`；缺少授权或 CSRF Provider 则必须令应用启动失败。

## 不限框架的核心入口

`Storage\ResourceRegistryFactory` 不依赖框架请求或容器，并允许桥接层处理挂载路径：

```php
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Storage\ResourceRegistryFactory;

$registry = (new ResourceRegistryFactory(
    publicUrlResolver: static fn (string $url): string => '/admin' . $url,
))->create([
    'Files' => [
        'root' => __DIR__ . '/storage/files',
        'public_url' => '/files',
        'allowed_extensions' => ['jpg', 'png', 'pdf'],
    ],
]);

$files = new FileManager($registry, $authorization, $eventDispatcher);
```

`$authorization` 实现 `AuthorizationInterface`，`$eventDispatcher` 实现
PSR-14 `EventDispatcherInterface`。宿主路由仍必须完成认证、写操作 CSRF、异常到
HTTP JSON 的映射以及受 ACL 保护的文件流输出。Symfony 桥接也委托给同一个构建器，
只额外处理 Request base path；后续桥接必须沿用这一模式，避免安全配置产生差异。

## 实施顺序

1. 保持 Symfony 6.4／7.4 在 PHP 8.2、8.3、8.4、8.5 及可运行示例中全部稳定。
2. 固化与框架无关的请求、响应、上传、Actor 和 Workspace 边界，把完整栈代码移到桥接包。
3. 首先增加 Laravel 完整桥接、可执行示例和共用 HTTP 契约测试。
4. 增加可执行 Slim／Mezzio 示例并运行同一契约套件，再将共用 PSR-7／PSR-15 Bridge 从实验性升级。
5. 其他框架只有通过相同 HTTP、安全和存储契约测试后才列为完整支持。

## PHP 7.2 必须使用独立产品线

PHP 7.2 已停止维护，不能加入 `main` 或 1.x 的 Composer 约束。当前代码使用 PHP
8.1／8.2 语法，现行 Symfony、PHPUnit 和 PSR 依赖也无法直接形成安全的 PHP 7.2
矩阵。

Symfony／PHP 8.2～8.5 稳定之后，可以在独立仓库和独立 Composer 包（例如
`sohophp/sofinder-legacy`）评估移植；它必须拥有自己的版本空间、lock file、CI
和安全政策，不能与 `sohophp/sofinder` 1.x 共用 tag 或依赖解析。只有找到仍受支持
的依赖组合和可持续的安全更新路径，才应发布 PHP 7.2 版本。所有 PHP 8 包都声明了
与 `sohophp/sofinder-legacy` 的 Composer 冲突，因此依赖解析阶段就会拒绝 PHP 7／PHP 8
产品线混装。
