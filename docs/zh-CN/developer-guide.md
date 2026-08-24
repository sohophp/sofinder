---
title: 开发者集成指南
description: 在 Symfony 应用中嵌入 SoFinder、接收选择结果、调用服务并安全扩展。
---

# 开发者集成指南

请先完成[安装](/zh-CN/getting-started)和 [Symfony 配置](/zh-CN/symfony)。本指南说明 Bundle、路由和资源正常工作后的应用集成。

## 选择集成方式

| 需求 | 推荐方式 |
| --- | --- |
| 完整文件管理 | manager 模式的 `/sofinder/browser` |
| 选择一个文件／图片 | picker 模式和 `sofinder:select` Event |
| CKEditor 4 | [CKEditor 指南](/zh-CN/ckeditor4)中的 Callback 和快速上传 |
| 自定义前端 | 经过认证的 [HTTP API](/zh-CN/api-reference) |
| 服务端业务逻辑 | 注入 `FileManager` 和公开 Contract |
| 新存储后端 | `StorageAdapterFactoryInterface` 和[存储 Adapter Contract](/zh-CN/storage-adapters) |

## 嵌入 manager 或 picker

可使用经过验证的显示参数：

```text
/sofinder/browser?uiMode=manager
/sofinder/browser?select=1&type=Images&selection=image&uiMode=picker
```

`uiMode` 可以是 `auto`、`manager`、`picker`；`type` 选择初始资源；`selection` 为 `any`、`file`、`image`，图片必须可嵌入浏览器。`uiTools=common|full` 可在保留 picker 选择行为的同时，选择是否显示全部受 ACL 控制的管理、详情和图片工具。`uiHeader`、`uiLogo`、`uiSearch`、`uiLanguage`、`uiView` 只接受 `0` 或 `1`。这些参数不会增加权限。

不使用 CKEditor 的同窗口或 iframe 选择器可监听：

```javascript
window.addEventListener("sofinder:select", (event) => {
  const entry = event.detail;
  console.log(entry.path, entry.url, entry.mimeType);
});
```

Event 在 picker 所在 Window 触发。iframe 可在加载完成后监听 `iframe.contentWindow`，或由严格同源的 Wrapper 转发。SoFinder 不提供不受限制的跨域 `postMessage`。

## 调用 HTTP API

读取请求使用当前 Symfony Session；写请求还需要 Browser Bootstrap 中注入的 Token：

```javascript
const response = await fetch("/sofinder/api/folders", {
  method: "POST",
  credentials: "same-origin",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": csrfToken
  },
  body: JSON.stringify({ resource: "Files", path: "manuals", name: "2026" })
});
const payload = await response.json();
if (!response.ok || !payload.success) throw new Error(payload.error?.message);
```

不要把前端 Capability 当作鉴权结果。客户端必须处理 `total: null`、不透明 Cursor、批量部分失败、`409 conflict`、`413` 策略限制、`415` 媒体拒绝和带 `Retry-After` 的 `429`。详见[完整 API 参考](/zh-CN/api-reference)。

## 服务端使用 FileManager

将 `SohoPHP\SoFinder\FileManager` 注入应用服务。始终传入已配置资源名和逻辑规范化路径，不要传绝对存储路径。

```php
use SohoPHP\SoFinder\FileManager;

final readonly class DocumentService
{
    public function __construct(private FileManager $files) {}

    public function openManual(string $path)
    {
        return $this->files->read('Documents', $path);
    }
}
```

`FileManager` 会执行资源查找、路径规范化、鉴权、配额、Operation Gate、存储 Capability、Audit Event 和用量记账。不要绕过它直接解析 Adapter。读取结果是 Stream，由调用方负责关闭。

## 稳定的文件入口 URL

资源的 `entry_url` 可以把 Storage Key 转成应用 URL。Route Template 支持 `{resource}`、`{path}`、`{name}`、`{stem}`、`{extension}`、`{storage_url}`。实现 `EntryUrlContextProviderInterface` 可添加 `{id}` 等宿主数据库值。最终 Route Controller 负责自己的访问策略，可通过 `FileManager::read()` 输出，也可重定向公开 Provider URL。

## Event 与业务策略

订阅 `OperationEvent` 的 `before.<operation>` 和 `after.<operation>`。Before Subscriber 可抛出 Domain Exception 拒绝操作；After Event 在存储变更后触发，通知、索引和数据库同步必须可重试且幂等。应忽略未知 Context Key。

业务级资源、操作和规范化路径判断可替换 `AuthorizationInterface`，未知操作必须返回 false。`ActorProviderInterface` 必须返回稳定、不透明的 ID，用于隔离上传 Session、Metadata 和回收站归属。

## 扩展点

- 存储：`StorageAdapterInterface`、可选 Capability Interface、带 Tag 的 Factory。
- 状态：`ChunkUploadStoreInterface`、`MetadataStoreInterface`、`RequestGateStoreInterface`、`UsageTrackerInterface`、`RecycleBinInterface`。
- 安全：`FileInspectorInterface`、`AuthorizationInterface`。
- 图片：`ImageProcessorInterface`、`ImageCapabilityProviderInterface`。
- UI 描述：使用 `sofinder.plugin` Tag 的 `PluginInterface`。
- URL 与审计：`EntryUrlContextProviderInterface`、`StorageAuditProviderInterface`、Operation Event。

完整列表参见 [PHP Contract](/zh-CN/php-contracts)。实现必须支持并发，不在异常中暴露存储路径或密钥，并为可预期的 Domain Failure 抛出带稳定 Machine Code 的 `SoFinderException`。

## 集成测试列表

至少自动化验证：

1. 路由导入和登录访问；
2. 每类资源的列表、新建、上传、读取、重命名、复制、移动、删除、恢复；
3. CSRF、Role、Path ACL 拒绝；
4. 上传扩展名、MIME、大小、配额和冲突；
5. public 与 proxy 入口 URL；
6. 远程 Adapter 的 Cursor 分页和批量部分失败；
7. CKEditor Callback 或自定义 picker；
8. 接近生产环境的 Security Audit 和用量重算。

可使用 `examples/symfony` 作为集成 Fixture。部署期间必须执行 `sofinder:security:audit`，Critical 结果应阻止发布。
