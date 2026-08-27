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
            'descriptorVersion' => '1.0',
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

正式契約請見 [Plugin Descriptor Schema 1.0](/schema/plugin-descriptor.schema.json)。除 `extensions` 外會拒絕未知欄位；動作 ID 不可重複；URL 必須是沒有編碼路徑穿越的同源絕對路徑。CI 應執行：

```bash
./scripts/php-bin.sh bin/console sofinder:plugin:validate --json
```

新 Plugin 應訂閱帶版本的 `AssetOperationEvent`；它提供固定操作/階段、同一操作 ID、Workspace 與不含憑證、絕對路徑或例外堆疊的安全屬性。相容期間舊 `OperationEvent` 仍會同步派發。

Descriptor 只能包含 Browser-safe Metadata。名稱在全域範圍內必須唯一，而且 Symfony 建立 Service Container 時會驗證所有 Field。公開 Config Endpoint 會列出啟用的 Descriptor，讓宿主應用程式在不暴露 Service Configuration 的前提下診斷安裝狀態。

Plugin 行為應透過訂閱 `OperationEvent`，或替換 `AuthorizationInterface`、`ImageProcessorInterface`、`MetadataStoreInterface` 等公開 Contract 實作。Storage 整合應實作 `StorageAdapterInterface`，並在發布前執行共用 Storage Contract Test Suite。Plugin 不得依賴 SoFinder Internal，也不得複製第三方檔案管理器的 Asset 或實作細節。

`uiActions` 是可選的宣告式擴充槽，`slot` 可為 `utility`、`toolbar`、`context` 或 `details`，
`selection` 可為 `none`、`any`、`file` 或 `image`。SoFinder 僅接受同源絕對路徑並以
`noopener` 開啟；Host Route 必須重新授權。Descriptor 不能注入 Script、HTML、React
Component 或遠端 URL。

`previewers` 宣告 ID、同源 URL，以及有界的 `mimeTypes` 和／或 `extensions`。SoFinder
會加入已鑑權的 `resource` 和邏輯 `path` Query，並在 CSP 限制的同源 iframe 內顯示 Response。
預覽端點必須重新授權並回傳嚴格安全 Header。參考內建的 [PDF 與 Office 預覽](/zh-TW/document-preview)。

Repository 中的 `examples/symfony/src/Plugin/FileInspectorPlugin.php` 及配套
`PluginInspectorController` 是可直接執行的參考實作，涵蓋自動註冊、右鍵動作、透過
`FileManager` 重新授權、轉義輸出、限制性 Response Header 和健康檢查。實際擴充應以此
為起點，絕不能信任瀏覽器傳入的路徑。範例只在 `APP_ENV=dev` 時註冊該動作及路由；其他
專案安裝 SoFinder 時不會註冊這個示範 Plugin。

上傳掃描器實作 `UploadScannerInterface`，健康檢查實作 `HealthCheckInterface`，兩者會
自動設定 Tag。內建 `ClamAvScanner` 見[正式環境與多節點執行](/zh-TW/production)。
