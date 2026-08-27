---
title: Plugin development
description: Extend SoFinder through its tagged plugin descriptor and frontend integration contract.
---

# Plugin development

SoFinder plugins are ordinary Symfony services that implement
`SohoPHP\SoFinder\Contract\PluginInterface`. With autoconfiguration enabled,
the bundle adds the `sofinder.plugin` tag automatically. Otherwise, add that
tag explicitly.

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

Descriptors contain browser-safe metadata only. Names are globally unique and
all fields are validated while Symfony builds the service container. The
public config endpoint lists active descriptors so host applications can
diagnose their installation without exposing service configuration.
Descriptors may declare `resourceTypes` (`any`, `file`, `image`, `directory`),
`requiredOperations` and non-secret `configurationKeys`. They never publish
configuration values or credentials.

Plugin behaviour should be implemented by subscribing to `OperationEvent` or
by replacing one of the public contracts such as `AuthorizationInterface`,
`ImageProcessorInterface`, or `MetadataStoreInterface`. Storage integrations
implement `StorageAdapterInterface` and should run the common storage contract
test suite before release. Plugins must not depend on SoFinder internals or
copy assets or implementation details from third-party file managers.

`uiActions` are optional declaration-only extension slots. `slot` is `utility`,
`toolbar`, `context` or `details`; selection is `none`, `any`, `file` or `image`. SoFinder
accepts only same-origin absolute paths and opens them with `noopener`. The host
route must repeat authorization. Descriptors cannot inject scripts, HTML, React
components or remote URLs.

This declaration-only boundary is the frozen 1.0 UI plugin contract. SoFinder
does not load third-party JavaScript or CSS, including local files named by a
descriptor. Rich interfaces belong in an authorized same-origin host route
opened by an action or previewer. This keeps plugin installation compatible
with the default CSP and avoids turning package discovery into code execution.

`previewers` declare an ID, same-origin URL and bounded `mimeTypes` and/or
`extensions`. SoFinder adds the authorized `resource` and logical `path` query
parameters and embeds the response in a CSP-restricted same-origin frame. Preview endpoints must
repeat authorization and return restrictive response headers. See the bundled
[PDF and Office preview](/document-preview) plugin.

The repository includes a runnable reference in
`examples/symfony/src/Plugin/FileInspectorPlugin.php` with its matching
`PluginInspectorController`. It demonstrates autoconfiguration, a context action,
repeat authorization through `FileManager`, escaped output, restrictive response
headers and a plugin health check. The example registers both the action and its
route only in `APP_ENV=dev`; installing SoFinder in another application never
registers this demo plugin. Use that pair as the starting point for a real
extension rather than trusting the path supplied by the browser.

Uploads can add fail-closed scanners through `UploadScannerInterface`; health
providers implement `HealthCheckInterface`. Both are autoconfigured. The bundled
`ClamAvScanner` is documented in [production operation](/production).
