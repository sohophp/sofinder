---
title: Plugin 開發
description: 透過 Tagged Plugin Descriptor 與前端整合契約擴充 SoFinder。
---

# Plugin 開發

SoFinder Plugin 是實作 `SohoPHP\SoFinder\Contract\PluginInterface` 的一般 Symfony Service。啟用 Autoconfiguration 時，Bundle 會自動加入 `sofinder.plugin` Tag；否則請明確加入該 Tag。

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

Descriptor 只能包含 Browser-safe Metadata。名稱在全域範圍內必須唯一，而且 Symfony 建立 Service Container 時會驗證所有 Field。公開 Config Endpoint 會列出啟用的 Descriptor，讓宿主應用程式在不暴露 Service Configuration 的前提下診斷安裝狀態。

Plugin 行為應透過訂閱 `OperationEvent`，或替換 `AuthorizationInterface`、`ImageProcessorInterface`、`MetadataStoreInterface` 等公開 Contract 實作。Storage 整合應實作 `StorageAdapterInterface`，並在發布前執行共用 Storage Contract Test Suite。Plugin 不得依賴 SoFinder Internal，也不得複製第三方檔案管理器的 Asset 或實作細節。
