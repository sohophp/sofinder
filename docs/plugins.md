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
        ];
    }
}
```

Descriptors contain browser-safe metadata only. Names are globally unique and
all fields are validated while Symfony builds the service container. The
public config endpoint lists active descriptors so host applications can
diagnose their installation without exposing service configuration.

Plugin behaviour should be implemented by subscribing to `OperationEvent` or
by replacing one of the public contracts such as `AuthorizationInterface`,
`ImageProcessorInterface`, or `MetadataStoreInterface`. Storage integrations
implement `StorageAdapterInterface` and should run the common storage contract
test suite before release. Plugins must not depend on SoFinder internals or
copy assets or implementation details from third-party file managers.
