<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\ResourceRegistry;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
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
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $findings = [];
        $publicRoot = realpath($this->projectDirectory . '/public') ?: rtrim($this->projectDirectory, '/') . '/public';
        foreach ($this->resources->all() as $item) {
            $resource = $item->resource;
            $root = realpath($resource->root);
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
            if ($resource->deliveryMode === 'proxy' && $resource->publicUrl !== '') {
                $findings[] = ['critical', $resource->name, 'Proxy delivery is configured with a public URL; remove the web-server alias as well.'];
            }
            if ($resource->deliveryMode === 'public' && $resource->publicUrl === '') {
                $findings[] = ['warning', $resource->name, 'Public delivery has no public URL.'];
            }
            if ($this->contains($publicRoot, $root) && $resource->deliveryMode === 'proxy') {
                $findings[] = ['critical', $resource->name, 'Proxy storage is physically located under the public document root.'];
            }
            $this->scan($root, $resource->name, $findings);
        }
        foreach (['quarantine' => $this->quarantineDirectory, 'chunks' => $this->chunkDirectory, 'trash' => $this->trashDirectory] as $name => $privateDirectory) {
            $resolved = realpath($privateDirectory) ?: $this->normalizeAbsolute($privateDirectory);
            if ($this->contains($publicRoot, $resolved)) {
                $findings[] = ['critical', $name, 'Private working directory is under the public document root.'];
            }
            foreach ($this->resources->all() as $item) {
                $root = realpath($item->resource->root) ?: $this->normalizeAbsolute($item->resource->root);
                if ($this->contains($root, $resolved)) {
                    $findings[] = ['critical', $name, 'Private working directory is inside a resource storage root.'];
                }
            }
        }

        if ($findings === []) {
            $io->success('No SoFinder storage security problems were detected.');

            return Command::SUCCESS;
        }
        $io->table(['Severity', 'Scope', 'Finding'], $findings);
        $critical = count(array_filter($findings, static fn (array $finding): bool => $finding[0] === 'critical'));
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
