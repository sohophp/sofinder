---
title: 框架整合
description: 在 Symfony、Laravel、Slim、Mezzio 或純 PHP 中安裝並整合 SoFinder。
---

# 框架整合

SoFinder 1.1 為下列 Host 提供完整瀏覽器介面和 HTTP API。所有 Bridge 共用相同的 Core、
端點清單、驗證、安全規則和前端資源。

| Host | Composer Package | 支援的 Runtime |
| --- | --- | --- |
| Symfony 6.4／7.4 | `sohophp/sofinder-symfony` | PHP 8.2～8.5 |
| Laravel 12 | `sohophp/sofinder-laravel` | PHP 8.2～8.5 |
| Laravel 13 | `sohophp/sofinder-laravel` | PHP 8.3～8.5 |
| Slim 4、Mezzio 3、純 PHP | `sohophp/sofinder-psr15` | PHP 8.2～8.5 |

Symfony 請直接閱讀 [Symfony 整合指南](/zh-TW/symfony)。以下章節說明 Laravel 和
PSR-15 Host 的接入方式。

## Laravel 12 和 13

### 安裝並發布設定

```bash
composer require sohophp/sofinder-laravel:^1.1
php artisan vendor:publish --tag=sofinder-config
```

Laravel Package Discovery 會自動註冊 `SoFinderServiceProvider`，不需要手動加入 Provider。
預設設定把瀏覽器掛載到 `/sofinder/browser`，使用 `web` 和 `auth` Middleware，並把檔案
存放在 `storage/app/sofinder` 下。

需要調整掛載點、Middleware 或資源時，編輯 `config/sofinder.php`：

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

Laravel Cache Store 必須支援原子鎖；無法安全協調上傳和維護工作時，SoFinder 會拒絕啟動。

### 定義授權規則

通過身分驗證不等於擁有檔案權限。每個受保護操作都會檢查名為
`sofinder.<operation>` 的 Laravel Gate Ability，並把資源和路徑作為參數傳入。
如果僅允許管理員使用，可以統一授權整個 SoFinder Namespace：

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

細緻策略可以分別定義 `sofinder.list`、`sofinder.read`、`sofinder.upload`、
`sofinder.overwrite`、`sofinder.create_folder`、`sofinder.rename`、`sofinder.copy`、
`sofinder.move`、`sofinder.delete` 和 `sofinder.metadata.update`。回傳 `false` 即拒絕
操作；正式環境不得使用無條件放行的 `Gate::before`。

SoFinder 會自動使用 Laravel 的已驗證 Actor、Session CSRF Token、Event Dispatcher、
URL Generator、Cache 和 Queue Adapter。共用 HTTP 層負責寫入操作的 CSRF 驗證，並回傳
與其他 Bridge 一致的 JSON 錯誤契約。

### 完成並驗證

```bash
php artisan config:cache
php artisan route:cache
php artisan route:list --name=sofinder
php artisan sofinder:security:audit
```

以已驗證且已授權的使用者開啟 `/sofinder/browser`。Bridge 預設可以直接提供同步發布的前端
資源；只有 Web Server 必須直接提供資源副本時，才需要執行
`php artisan vendor:publish --tag=sofinder-assets`。

完整可執行 Host 位於
[`examples/laravel`](https://github.com/sohophp/sofinder/tree/main/examples/laravel)。

## 共用 PSR-15 Runtime

Slim、Mezzio 和純 PHP 共用同一個 Application Factory。每種 Host 都必須安裝 Bridge 和
自己使用的 PSR-7／PSR-17 實作。請直接使用對應 Host 章節中的完整指令，不要混合範例。

然後建立四個必須由 Host 提供的 Service。它們必須連接應用程式真實的身分、權限和 Session；
缺少任何一項都會在建構階段失敗。

```php
use SohoPHP\SoFinder\Psr15\HostServices;
use SohoPHP\SoFinder\Psr15\LocalApplicationFactory;

$services = new HostServices(
    $authorization, // AuthorizationInterface
    $actor,         // ActorProviderInterface
    $csrf,          // CsrfTokenProviderInterface
    $events,        // PSR-14 EventDispatcherInterface
    $roles,         // 選用 RoleAuthorizationInterface
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

純 PHP Session 可以使用 `NativeSessionCsrfTokenProvider`，但必須先啟動 Session。自訂
Provider 必須把 Token 綁定到可信 Host Session 並進行安全比較，不能提供匿名放行的回退。
若 `document_preview.mode` 或 `maintenance.mode` 設為 `messenger`，還必須向
`LocalApplicationFactory` 傳入對應且可用的 Dispatcher。

### Slim 4

安裝 Slim 及其 PSR-7 實作，並在執行應用程式前註冊中央路由清單：

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

此處 `createSofinderApplication()` 代表上一節的共用 Factory Bootstrap。路由名稱和路徑
來自中央端點清單，不應在應用程式中複製定義。

### Mezzio 3

安裝 Mezzio 和 Router，建立共用 Runtime，並在一般路由與 Dispatch Middleware 執行前註冊：

```bash
composer require sohophp/sofinder-psr15:^1.1 mezzio/mezzio:^3.24 mezzio/mezzio-fastroute:^3.13 laminas/laminas-diactoros:^3.6
```

```php
$sofinder = createSofinderApplication($responseFactory, $streamFactory);
$sofinder->routes()->registerMezzio($app);

$app->pipe(new RouteMiddleware($router));
$app->pipe(new DispatchMiddleware());
```

### 純 PHP

安裝 Bridge、PSR-7 Factory 和下例使用的 SAPI Response Emitter：

```bash
composer require sohophp/sofinder-psr15:^1.1 laminas/laminas-diactoros:^3.6 laminas/laminas-httphandlerrunner:^2.13
```

無框架 Front Controller 可以把 Request 交給 Bridge 的 Middleware，再送出 PSR-7 Response：

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

`/sofinder` 以外及無法匹配的 Request 會交給 `$fallbackHandler`。共用 Factory 和三種 Front
Controller 的可執行實作位於
[`examples/psr15`](https://github.com/sohophp/sofinder/tree/main/examples/psr15)。

對每種 PSR-15 Host，都要確保 PHP Runtime 可寫入狀態目錄和檔案目錄，並由 Web Server 把
應用程式 Request 轉發到 Front Controller。然後檢查 `/sofinder/live`、
`/sofinder/health` 和 `/sofinder/browser`。出現 `403 access_denied` 表示路由有效，但 Host
Actor 或授權 Service 拒絕了存取；不要改成匿名放行來消除錯誤。

## 僅使用 Core 和其他框架

應用程式只需要領域服務、不需要 SoFinder 瀏覽器/API 時，安裝
`sohophp/sofinder-core:^1.1`。接入其他框架時，應在公開 PSR 邊界轉換 Request 和
Response，並重用中央端點清單；不要複製 Controller，也不要繞過授權、CSRF、路徑、上傳
或串流回應驗證。新 Host 在通過共用黑箱 HTTP 契約 Suite 前，只能標記為 Headless Supported。

上線前還應閱讀[安全部署](/zh-TW/security)、[設定參考](/zh-TW/configuration)和
[正式環境檢查清單](/zh-TW/production)。
