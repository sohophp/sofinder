<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Contract\LocalPathProviderInterface;
use SohoPHP\SoFinder\Contract\StorageAuditProviderInterface;
use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\Contract\WorkspaceStorageAuditProviderInterface;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:security:audit', description: 'Audit SoFinder storage and private working-directory security.')]
final class SecurityAuditCommand extends Command
{
    /** @var list<string> */
    private const EXECUTABLE_EXTENSIONS = ['cgi', 'html', 'htm', 'js', 'mjs', 'phar', 'php', 'php3', 'php4', 'php5', 'phtml', 'pl', 'py', 'sh'];

    public function __construct(
        private readonly ResourceRegistry $resources,
        private readonly string $projectDirectory,
        private readonly string $quarantineDirectory,
        private readonly string $chunkDirectory,
        private readonly string $trashDirectory,
        private readonly ?ImageCapabilityProviderInterface $images = null,
        private readonly ?ImageFormatRegistry $imageFormats = null,
        private readonly bool $malwareScanningEnabled = false,
        private readonly ?HealthCheckInterface $malwareScanner = null,
        private readonly bool $clusterStateConfigured = false,
        private readonly bool $sharedPreviewCache = false,
        private readonly string $documentPreviewMode = 'inline',
        private readonly bool $officePreviewEnabled = false,
        /** @var iterable<WorkspaceStorageAuditProviderInterface> */
        private readonly iterable $workspaceStorageAuditProviders = [],
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('json', null, InputOption::VALUE_NONE, 'Write a machine-readable result.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $findings = [];
        /** @var array<string,list<array{name:string,delivery:string}>> $localRoots */
        $localRoots = [];
        $publicRoot = realpath($this->projectDirectory . '/public') ?: rtrim($this->projectDirectory, '/') . '/public';
        foreach ($this->resources->all() as $item) {
            $resource = $item->resource;
            if ($resource->deliveryMode === 'proxy' && $resource->publicUrl !== '') {
                $findings[] = ['critical', $resource->name, 'Proxy delivery is configured with a public URL; remove the web-server alias as well.'];
            }
            if ($resource->deliveryMode === 'public' && $resource->publicUrl === '') {
                $findings[] = ['warning', $resource->name, 'Public delivery has no public URL.'];
            }
            if ($item->storage instanceof LocalPathProviderInterface) {
                $root = realpath($item->storage->absolutePath(''));
                if ($root === false || !is_dir($root)) {
                    $findings[] = ['critical', $resource->name, 'Storage root does not exist or cannot be resolved.'];
                    continue;
                }
                if (!is_readable($root) || ($resource->readOnly === false && !is_writable($root))) {
                    $findings[] = ['critical', $resource->name, 'Storage root permissions do not match the configured access mode.'];
                }
                $permissions = fileperms($root);
                if ($permissions !== false && ($permissions & 0002) !== 0) {
                    $findings[] = ['warning', $resource->name, 'Storage root is world-writable.'];
                }
                if ($this->contains($publicRoot, $root) && $resource->deliveryMode === 'proxy') {
                    $findings[] = ['critical', $resource->name, 'Proxy storage is physically located under the public document root.'];
                }
                $localRoots[$this->normalizeAbsolute($root)][] = ['name' => $resource->name, 'delivery' => $resource->deliveryMode];
                $this->scan($root, $resource->name, $findings);
            } elseif ($item->storage instanceof StorageAuditProviderInterface) {
                foreach ($item->storage->auditStorage() as $finding) {
                    $findings[] = [$finding['severity'], $resource->name, $finding['message']];
                }
            } else {
                $findings[] = ['warning', $resource->name, 'Remote storage does not provide adapter-specific security audit results.'];
            }
            if ($this->images !== null && $this->imageFormats !== null) {
                foreach ($resource->allowedExtensions as $extension) {
                    if ($this->imageFormats->formatForExtension($extension) !== null && !$this->images->supportsExtension($extension)) {
                        $findings[] = ['critical', $resource->name, sprintf('Configured image extension .%s has no available decoder.', strtolower($extension))];
                    }
                }
            }
        }
        foreach ($localRoots as $items) {
            $deliveryModes = array_values(array_unique(array_column($items, 'delivery')));
            if (count($items) < 2 || !in_array('public', $deliveryModes, true) || !in_array('proxy', $deliveryModes, true)) continue;
            $findings[] = ['critical', implode(', ', array_column($items, 'name')), 'Public and proxy resources share the same physical storage root. Separate them to prevent private files from being publicly reachable.'];
        }
        /** @var array<string,list<array{workspace:string,resource:string}>> $workspaceRoots */
        $workspaceRoots = [];
        foreach ($this->workspaceStorageAuditProviders as $provider) {
            foreach ($provider->workspaceStorageMappings() as $mapping) {
                if (($mapping['writable'] ?? true) !== true || trim($mapping['root'] ?? '') === '') continue;
                $root = realpath($mapping['root']) ?: $this->normalizeAbsolute($mapping['root']);
                $workspaceRoots[$root][] = ['workspace' => (string) $mapping['workspace'], 'resource' => (string) $mapping['resource']];
            }
        }
        foreach ($workspaceRoots as $items) {
            if (count(array_unique(array_column($items, 'workspace'))) < 2) continue;
            $scope = implode(', ', array_map(static fn (array $item): string => $item['workspace'] . ':' . $item['resource'], $items));
            $findings[] = ['critical', $scope, 'Writable resources from different workspaces share the same physical storage root.'];
        }
        foreach (['quarantine' => $this->quarantineDirectory, 'chunks' => $this->chunkDirectory, 'trash' => $this->trashDirectory] as $name => $privateDirectory) {
            $resolved = realpath($privateDirectory) ?: $this->normalizeAbsolute($privateDirectory);
            if ($this->contains($publicRoot, $resolved)) {
                $findings[] = ['critical', $name, 'Private working directory is under the public document root.'];
            }
            foreach ($this->resources->all() as $item) {
                if (!$item->storage instanceof LocalPathProviderInterface) {
                    continue;
                }
                $storageRoot = $item->storage->absolutePath('');
                $root = realpath($storageRoot) ?: $this->normalizeAbsolute($storageRoot);
                if ($this->contains($root, $resolved)) {
                    $findings[] = ['critical', $name, 'Private working directory is inside a resource storage root.'];
                }
            }
        }
        if (!$this->malwareScanningEnabled) {
            $findings[] = ['warning', 'malware-scanning', 'Malware scanning is disabled.'];
        } elseif ($this->malwareScanner === null) {
            $findings[] = ['critical', 'malware-scanning', 'Malware scanning is enabled but no scanner service is registered.'];
        } else {
            try {
                $scanHealth = $this->malwareScanner->check();
                if ($scanHealth->status !== 'ready') {
                    $findings[] = ['critical', 'malware-scanning', 'The configured malware scanner is unavailable.'];
                }
            } catch (\Throwable) {
                $findings[] = ['critical', 'malware-scanning', 'The configured malware scanner health check failed.'];
            }
        }
        if ($this->clusterStateConfigured && $this->officePreviewEnabled && $this->documentPreviewMode !== 'inline' && !$this->sharedPreviewCache) {
            $findings[] = ['critical', 'document-preview', 'Multi-node asynchronous Office preview requires a shared document preview cache directory; set cluster.shared_preview_cache only after mounting it on every node.'];
        }

        $critical = count(array_filter($findings, static fn (array $finding): bool => $finding[0] === 'critical'));
        if ($input->getOption('json') === true) {
            $output->writeln(json_encode([
                'status' => $critical > 0 ? 'critical' : ($findings === [] ? 'ready' : 'warning'),
                'critical' => $critical,
                'warnings' => count($findings) - $critical,
                'findings' => array_map(static fn (array $finding): array => ['severity' => $finding[0], 'scope' => $finding[1], 'message' => $finding[2]], $findings),
            ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
            return $critical > 0 ? Command::FAILURE : Command::SUCCESS;
        }

        if ($findings === []) {
            $io->success('No SoFinder storage security problems were detected.');

            return Command::SUCCESS;
        }
        $io->table(['Severity', 'Scope', 'Finding'], $findings);
        if ($critical > 0) {
            $io->error(sprintf('%d critical SoFinder security finding(s) require attention.', $critical));

            return Command::FAILURE;
        }
        $io->warning('The audit completed with warnings.');

        return Command::SUCCESS;
    }

    /** @param list<array{string,string,string}> $findings */
    private function scan(string $root, string $resource, array &$findings): void
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST,
        );
        foreach ($iterator as $entry) {
            if ($entry->isLink()) {
                $findings[] = ['critical', $resource, 'Symbolic link found: ' . $entry->getFilename()];
                continue;
            }
            if ($entry->isFile() && in_array(strtolower($entry->getExtension()), self::EXECUTABLE_EXTENSIONS, true)) {
                $findings[] = ['critical', $resource, 'Potentially executable file found: ' . $entry->getFilename()];
            }
        }
    }

    private function contains(string $parent, string $child): bool
    {
        $parent = rtrim($this->normalizeAbsolute($parent), '/');
        $child = $this->normalizeAbsolute($child);

        return $child === $parent || str_starts_with($child, $parent . '/');
    }

    private function normalizeAbsolute(string $path): string
    {
        return str_replace('\\', '/', rtrim($path, '/'));
    }
}
