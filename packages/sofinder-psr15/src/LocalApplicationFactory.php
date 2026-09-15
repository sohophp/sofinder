<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use SohoPHP\SoFinder\Configuration\ConfigurationNormalizer;
use SohoPHP\SoFinder\Contract\MaintenanceDispatcherInterface;
use SohoPHP\SoFinder\Contract\DocumentPreviewDispatcherInterface;
use SohoPHP\SoFinder\Contract\StorageAdapterFactoryInterface;
use SohoPHP\SoFinder\Framework\ScopedRequestContextProvider;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\LocalRuntime;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;

final class LocalApplicationFactory
{
    private readonly ScopedRequestContextProvider $contexts;
    /**
     * @param array<string,mixed> $configuration
     * @param iterable<StorageAdapterFactoryInterface> $storageFactories
     */
    public function __construct(
        private readonly ResponseFactoryInterface $responses,
        private readonly StreamFactoryInterface $streams,
        private readonly HostServices $services,
        private readonly array $configuration,
        private readonly string $stateDirectory,
        private readonly string $resourceRoot,
        private readonly ?string $packageDirectory = null,
        private readonly string $prefix = '/sofinder',
        private readonly string $baseUrl = '',
        private readonly iterable $storageFactories = [],
        private readonly ?MaintenanceDispatcherInterface $maintenanceDispatcher = null,
        private readonly ?DocumentPreviewDispatcherInterface $documentPreviewDispatcher = null,
    ) {
        $this->contexts = new ScopedRequestContextProvider();
    }

    public function create(): SoFinderApplication
    {
        $configuration = $this->normalizedConfiguration();
        $runtime = $this->runtime($configuration);
        $handlers = array_map(
            fn ($action): PsrEndpointHandler => new PsrEndpointHandler($action, $this->responses, $this->streams, scope: $this->contexts),
            $runtime->actions(),
        );

        return new SoFinderApplication(
            new EndpointDispatcher(
                $this->responses,
                $this->streams,
                $handlers,
                (bool) $configuration['security']['production_strict'],
                $this->allowedImageOrigins($configuration),
            ),
            $this->services,
            $this->prefix,
        );
    }

    /** @return list<\SohoPHP\SoFinder\Http\EndpointActionInterface> */
    public function actions(): array
    {
        return $this->runtime($this->normalizedConfiguration())->actions();
    }

    /** @param array<string,mixed> $configuration */
    private function runtime(array $configuration): LocalRuntime
    {
        if (($configuration['maintenance']['mode'] ?? null) === 'messenger' && $this->maintenanceDispatcher === null) {
            throw new \InvalidArgumentException('PSR-15 local runtime requires an explicit maintenance dispatcher for messenger mode.');
        }
        if (($configuration['document_preview']['mode'] ?? null) === 'messenger'
            && $this->documentPreviewDispatcher?->available() !== true) {
            throw new \InvalidArgumentException('PSR-15 local runtime requires an available document preview dispatcher for messenger mode.');
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
            $this->resolvePackageDirectory(),
            $this->storageFactories,
            $this->maintenanceDispatcher,
            $this->documentPreviewDispatcher,
        );
    }

    /** @return array<string,mixed> */
    private function normalizedConfiguration(): array
    {
        $state = rtrim($this->stateDirectory, '/');
        return (new ConfigurationNormalizer())->normalize($this->configuration, [
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
    }

    /**
     * @param array<string,mixed> $configuration
     * @return list<string>
     */
    private function allowedImageOrigins(array $configuration): array
    {
        $origins = $configuration['security']['allowed_image_origins'] ?? null;
        if (!is_array($origins)) {
            throw new \InvalidArgumentException('security.allowed_image_origins must be a list of origins.');
        }

        $result = [];
        foreach ($origins as $origin) {
            if (!is_string($origin)) {
                throw new \InvalidArgumentException('security.allowed_image_origins must contain only strings.');
            }
            $result[] = $origin;
        }

        return $result;
    }

    private function resolvePackageDirectory(): string
    {
        if ($this->packageDirectory !== null && trim($this->packageDirectory) !== '') {
            return rtrim($this->packageDirectory, '/');
        }

        $packageRoot = dirname(__DIR__);
        if (is_file($packageRoot . '/dist/manifest.json')) {
            return $packageRoot;
        }

        // The source monorepo keeps the shared distribution at its root. A
        // published split package carries the same directory at $packageRoot.
        $monorepoRoot = dirname(__DIR__, 3);
        if (is_file($monorepoRoot . '/dist/manifest.json')) {
            return $monorepoRoot;
        }

        return $packageRoot;
    }
}
