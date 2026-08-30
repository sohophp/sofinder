---
title: 框架集成
description: 在 Symfony、Laravel、Slim、Mezzio 或纯 PHP 中安装并集成 SoFinder。
---

# 框架集成

SoFinder 1.1 为下列宿主提供完整浏览器界面和 HTTP API。所有 Bridge 共用相同的 Core、
端点清单、校验、安全规则和前端资源。

| 宿主 | Composer 包 | 支持的 Runtime |
| --- | --- | --- |
| Symfony 6.4 | `sohophp/sofinder-symfony` | PHP 8.1～8.5 |
| Symfony 7.4 | `sohophp/sofinder-symfony` | PHP 8.2～8.5 |
| Laravel 12 | `sohophp/sofinder-laravel` | PHP 8.2～8.5 |
| Laravel 13 | `sohophp/sofinder-laravel` | PHP 8.3～8.5 |
| Slim 4、Mezzio 3、纯 PHP | `sohophp/sofinder-psr15` | PHP 8.1～8.5 |

Symfony 请直接阅读 [Symfony 集成指南](/zh-CN/symfony)。以下章节说明 Laravel 和
PSR-15 宿主的接入方法。

## Laravel 12 和 13

### 安装并发布配置

```bash
composer require sohophp/sofinder-laravel:^1.1
php artisan vendor:publish --tag=sofinder-config
```

Laravel Package Discovery 会自动注册 `SoFinderServiceProvider`，不需要手动添加 Provider。
默认配置把浏览器挂载到 `/sofinder/browser`，使用 `web` 和 `auth` Middleware，并把文件
存放在 `storage/app/sofinder` 下。

需要调整挂载点、Middleware 或资源时，编辑 `config/sofinder.php`：

```php
return [
    'enabled' => true,
    'prefix' => 'sofinder',
    'domain' => null,
    'middleware' => ['web'],
    'auth_middleware' => ['auth'],
    'cache_store' => null,
    'core' => [
        'resources' => [
            'Files' => [
                'root' => storage_path('app/sofinder/files'),
                'delivery_mode' => 'proxy',
                'allowed_extensions' => ['jpg', 'png', 'pdf', 'docx', 'xlsx'],
            ],
        ],
    ],
];
```

Laravel Cache Store 必须支持原子锁；无法安全协调上传和维护任务时，SoFinder 会拒绝启动。

### 定义授权规则

通过身份认证不等于拥有文件权限。每个受保护操作都会检查名为
`sofinder.<operation>` 的 Laravel Gate Ability，并把资源和路径作为参数传入。
如果仅允许管理员使用，可以统一授权整个 SoFinder Namespace：

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::before(static function (User $user, string $ability): ?bool {
    if (str_starts_with($ability, 'sofinder.')) {
        return $user->is_file_manager_admin;
    }

    return null;
});

Gate::define('ROLE_ADMIN', static fn (User $user): bool =>
    $user->is_file_manager_admin
);
```

细粒度策略可以分别定义 `sofinder.list`、`sofinder.read`、`sofinder.upload`、
`sofinder.overwrite`、`sofinder.create_folder`、`sofinder.rename`、`sofinder.copy`、
`sofinder.move`、`sofinder.delete` 和 `sofinder.metadata.update`。返回 `false` 即拒绝
操作；生产环境不得使用无条件放行的 `Gate::before`。

SoFinder 会自动使用 Laravel 的已认证 Actor、Session CSRF Token、Event Dispatcher、
URL Generator、Cache 和 Queue Adapter。共享 HTTP 层负责写操作的 CSRF 校验，并返回
与其他 Bridge 一致的 JSON 错误契约。

### 完成并验证

```bash
php artisan config:cache
php artisan route:cache
php artisan route:list --name=sofinder
php artisan sofinder:security:audit
```

以已认证且已授权的用户打开 `/sofinder/browser`。Bridge 默认可以直接提供同步发布的前端
资源；只有 Web Server 必须直接提供资源副本时，才需要执行
`php artisan vendor:publish --tag=sofinder-assets`。

完整可执行宿主位于
[`examples/laravel`](https://github.com/sohophp/sofinder/tree/main/examples/laravel)。

## 共享 PSR-15 Runtime

Slim、Mezzio 和纯 PHP 共用同一个 Application Factory。每种宿主都必须安装 Bridge 和
自己使用的 PSR-7／PSR-17 实现。请直接使用对应宿主章节中的完整命令，不要混合示例。

然后建立四个必须由宿主提供的 Service。它们必须连接应用真实的身份、权限和 Session；
缺失任何一项都会在构造阶段失败。

```php
use SohoPHP\SoFinder\Psr15\HostServices;
use SohoPHP\SoFinder\Psr15\LocalApplicationFactory;

$services = new HostServices(
    $authorization, // AuthorizationInterface
    $actor,         // ActorProviderInterface
    $csrf,          // CsrfTokenProviderInterface
    $events,        // PSR-14 EventDispatcherInterface
    $roles,         // 可选 RoleAuthorizationInterface
);

$sofinder = (new LocalApplicationFactory(
    $responseFactory,
    $streamFactory,
    $services,
    [
        'resources' => [
            'Files' => [
                'root' => __DIR__ . '/var/files',
                'delivery_mode' => 'proxy',
            ],
        ],
    ],
    __DIR__ . '/var/state',
    __DIR__ . '/var/files',
    prefix: '/sofinder',
))->create();
```

纯 PHP Session 可以使用 `NativeSessionCsrfTokenProvider`，但必须先启动 Session。自定义
Provider 必须把 Token 绑定到可信宿主 Session 并进行安全比较，不能提供匿名放行的回退。
若 `document_preview.mode` 或 `maintenance.mode` 设为 `messenger`，还必须向
`LocalApplicationFactory` 传入对应且可用的 Dispatcher。

### Slim 4

安装 Slim 及其 PSR-7 实现，并在运行应用前注册中央路由清单：

```bash
composer require sohophp/sofinder-psr15:^1.1 slim/slim:^4.15 slim/psr7:^1.7
```

```php
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ResponseFactory;
use Slim\Psr7\Factory\StreamFactory;

$responses = new ResponseFactory();
$app = AppFactory::create($responses);
$sofinder = createSofinderApplication($responses, new StreamFactory());
$sofinder->routes()->registerSlim($app);
$app->run();
```

此处 `createSofinderApplication()` 表示上一节的共享 Factory Bootstrap。路由名称和路径
来自中央端点清单，不应在应用中复制定义。

### Mezzio 3

安装 Mezzio 和 Router，建立共享 Runtime，并在常规路由与 Dispatch Middleware 运行前注册：

```bash
composer require sohophp/sofinder-psr15:^1.1 mezzio/mezzio:^3.24 mezzio/mezzio-fastroute:^3.13 laminas/laminas-diactoros:^3.6
```

```php
$sofinder = createSofinderApplication($responseFactory, $streamFactory);
$sofinder->routes()->registerMezzio($app);

$app->pipe(new RouteMiddleware($router));
$app->pipe(new DispatchMiddleware());
```

### 纯 PHP

安装 Bridge、PSR-7 Factory 和下例使用的 SAPI Response Emitter：

```bash
composer require sohophp/sofinder-psr15:^1.1 laminas/laminas-diactoros:^3.6 laminas/laminas-httphandlerrunner:^2.13
```

无框架 Front Controller 可以把请求交给 Bridge 的 Middleware，再发送 PSR-7 Response：

```php
use Laminas\Diactoros\ServerRequestFactory;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter;

$sofinder = createSofinderApplication($responseFactory, $streamFactory);
$response = $sofinder->middleware()->process(
    ServerRequestFactory::fromGlobals(),
    $fallbackHandler,
);

(new SapiEmitter())->emit($response);
```

`/sofinder` 以外及无法匹配的请求会交给 `$fallbackHandler`。共享 Factory 和三种 Front
Controller 的可运行实现位于
[`examples/psr15`](https://github.com/sohophp/sofinder/tree/main/examples/psr15)。

对每种 PSR-15 宿主，都要确保 PHP Runtime 可写状态目录和文件目录，并由 Web Server 把应用
请求转发到 Front Controller。然后检查 `/sofinder/live`、`/sofinder/health` 和
`/sofinder/browser`。出现 `403 access_denied` 表示路由有效，但宿主 Actor 或授权 Service
拒绝了访问；不要改成匿名放行来消除错误。

## 仅使用 Core 和其他框架

应用只需要领域服务、不需要 SoFinder 浏览器/API 时，安装
`sohophp/sofinder-core:^1.1`。接入其他框架时，应在公开 PSR 边界转换 Request 和
Response，并复用中央端点清单；不要复制 Controller，也不要绕过授权、CSRF、路径、上传
或流式响应校验。新宿主在通过共享黑盒 HTTP 契约套件前，只能标记为 Headless Supported。

上线前还应阅读[生产安全](/zh-CN/security)、[配置参考](/zh-CN/configuration)和
[生产检查清单](/zh-CN/production)。
