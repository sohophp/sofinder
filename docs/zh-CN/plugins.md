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
        ];
    }
}
```

Descriptor 只能包含 Browser-safe Metadata。名称在全局范围内必须唯一，而且 Symfony 建立 Service Container 时会验证所有 Field。公开 Config Endpoint 会列出启用的 Descriptor，让宿主应用程序在不暴露 Service Configuration 的前提下诊断安装状态。

Plugin 行为应通过订阅 `OperationEvent`，或替换 `AuthorizationInterface`、`ImageProcessorInterface`、`MetadataStoreInterface` 等公开 Contract 实现。Storage 整合应实现 `StorageAdapterInterface`，并在发布前执行共用 Storage Contract Test Suite。Plugin 不得依赖 SoFinder Internal，也不得复制第三方文件管理器的 Asset 或实现细节。
