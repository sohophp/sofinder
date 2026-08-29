<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use SohoPHP\SoFinder\Configuration\ConfigurationNormalizer;
use SohoPHP\SoFinder\Contract\MaintenanceDispatcherInterface;
use SohoPHP\SoFinder\Contract\StorageAdapterFactoryInterface;
use SohoPHP\SoFinder\Framework\ScopedRequestContextProvider;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\LocalRuntime;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;

final readonly class LocalApplicationFactory
{
    private ScopedRequestContextProvider $contexts;
    /**
     * @param array<string,mixed> $configuration
     * @param iterable<StorageAdapterFactoryInterface> $storageFactories
     */
    public function __construct(
        private ResponseFactoryInterface $responses,
        private StreamFactoryInterface $streams,
        private HostServices $services,
        private array $configuration,
        private string $stateDirectory,
        private string $resourceRoot,
        private string $packageDirectory,
        private string $prefix = '/sofinder',
        private string $baseUrl = '',
        private iterable $storageFactories = [],
        private ?MaintenanceDispatcherInterface $maintenanceDispatcher = null,
    ) {
        $this->contexts = new ScopedRequestContextProvider();
    }

    public function create(): SoFinderApplication
    {
        $runtime = $this->runtime();
        $handlers = array_map(
            fn ($action): PsrEndpointHandler => new PsrEndpointHandler($action, $this->responses, $this->streams, scope: $this->contexts),
            $runtime->actions(),
        );

        return new SoFinderApplication(
            new EndpointDispatcher($this->responses, $this->streams, $handlers),
            $this->services,
            $this->prefix,
        );
    }

    /** @return list<\SohoPHP\SoFinder\Http\EndpointActionInterface> */
    public function actions(): array
    {
        return $this->runtime()->actions();
    }

    private function runtime(): LocalRuntime
    {
        $state = rtrim($this->stateDirectory, '/');
        $configuration = (new ConfigurationNormalizer())->normalize($this->configuration, [
            'route_prefix' => '/' . trim($this->prefix, '/'),
            'cache_dir' => $state . '/cache',
            'metadata_file' => $state . '/metadata.json',
            'quarantine_dir' => $state . '/quarantine',
            'chunk_dir' => $state . '/chunks',
            'usage_dir' => $state . '/usage',
            'trash_dir' => $state . '/trash',
            'signed_urls' => ['secret' => hash('sha256', $state . '|' . $this->resourceRoot)],
            'resources' => ['Files' => ['root' => $this->resourceRoot, 'delivery_mode' => 'proxy']],
        ]);
        if (($configuration['maintenance']['mode'] ?? null) === 'messenger' && $this->maintenanceDispatcher === null) {
            throw new \InvalidArgumentException('PSR-15 local runtime requires an explicit maintenance dispatcher for messenger mode.');
        }
        $urls = new CatalogUrlGenerator($this->prefix, $this->baseUrl);
        return new LocalRuntime(
            $configuration,
            $this->services->authorization,
            $this->services->actor,
            $this->services->csrf,
            $this->services->roles ?? new DenyRoleAuthorization(),
            $this->services->events,
            $urls,
            new CatalogEntryUrlGenerator($urls),
            $this->contexts,
            $this->packageDirectory,
            $this->storageFactories,
            $this->maintenanceDispatcher,
        );
    }
}
