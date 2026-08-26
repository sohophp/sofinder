---
title: Plugin 开发
description: 通过 Tagged Plugin Descriptor 与前端整合契约扩充 SoFinder。
---

# Plugin 开发

SoFinder Plugin 是实现 `SohoPHP\SoFinder\Contract\PluginInterface` 的一般 Symfony Service。启用 Autoconfiguration 时，Bundle 会自动加入 `sofinder.plugin` Tag；否则请明确加入该 Tag。

```php
final class VirusScanPlugin implements \SohoPHP\SoFinder\Contract\PluginInterface
{
    public function descriptor(): array
    {
        return [
            'name' => 'acme-virus-scan',
            'version' => '1.0.0',
            'capabilities' => ['virus-scan'],
            'uiActions' => [[
                'id' => 'scan-report',
                'label' => ['en' => 'Scan report', 'zh-cn' => '扫描报告', 'zh-tw' => '掃描報告'],
                'slot' => 'context',
                'url' => '/admin/security/scan-report',
                'selection' => 'file',
                'requires' => 'read',
            ]],
        ];
    }
}
```

Descriptor 只能包含 Browser-safe Metadata。名称在全局范围内必须唯一，而且 Symfony 建立 Service Container 时会验证所有 Field。公开 Config Endpoint 会列出启用的 Descriptor，让宿主应用程序在不暴露 Service Configuration 的前提下诊断安装状态。
Descriptor 可声明 `resourceTypes`（`any`、`file`、`image`、`directory`）、
`requiredOperations` 和不含秘密的 `configurationKeys`，但绝不公开配置值或凭证。

Plugin 行为应通过订阅 `OperationEvent`，或替换 `AuthorizationInterface`、`ImageProcessorInterface`、`MetadataStoreInterface` 等公开 Contract 实现。Storage 整合应实现 `StorageAdapterInterface`，并在发布前执行共用 Storage Contract Test Suite。Plugin 不得依赖 SoFinder Internal，也不得复制第三方文件管理器的 Asset 或实现细节。

`uiActions` 是可选的声明式扩展槽，`slot` 可为 `utility`、`toolbar`、`context` 或 `details`，
`selection` 可为 `none`、`any`、`file` 或 `image`。SoFinder 只接受同源绝对路径并以
`noopener` 打开；Host Route 必须重新授权。Descriptor 不能注入脚本、HTML、React
Component 或远程 URL。

这是 1.0 冻结的 UI Plugin 边界。SoFinder 不加载 Descriptor 指定的第三方 JavaScript
或 CSS，即使它是本地文件。复杂界面应放在重新鉴权的同源 Host Route 中，再由 Action
或 Previewer 打开；因此安装 Plugin 不会变成绕过默认 CSP 的隐式代码执行。

`previewers` 声明 ID、同源 URL，以及有界的 `mimeTypes` 和／或 `extensions`。SoFinder
会加入已鉴权的 `resource` 和逻辑 `path` Query，并在 CSP 限制的同源 iframe 内显示 Response。
预览端点必须重新授权并返回严格安全 Header。参考内置的 [PDF 与 Office 预览](/zh-CN/document-preview)。

仓库中的 `examples/symfony/src/Plugin/FileInspectorPlugin.php` 及配套
`PluginInspectorController` 是可直接运行的参考实现，覆盖自动注册、右键动作、通过
`FileManager` 重新授权、转义输出、限制性响应头和健康检查。实际扩展应以此为起点，
绝不能信任浏览器传入的路径。

上传扫描器实现 `UploadScannerInterface`，健康检查实现 `HealthCheckInterface`，两者会
自动配置 Tag。内置 `ClamAvScanner` 见[生产与多节点运行](/zh-CN/production)。
