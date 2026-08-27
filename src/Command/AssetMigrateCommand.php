<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Contract\AssetCatalogInterface;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Value\ListQuery;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:assets:migrate', description: 'Preview or register existing path-based files in the stable asset catalog.')]
final class AssetMigrateCommand extends Command
{
    public function __construct(private readonly ResourceRegistry $resources, private readonly AssetCatalogInterface $catalog) { parent::__construct(); }

    protected function configure(): void
    {
        $this->addArgument('resource', InputArgument::OPTIONAL, 'Resource name; omit to inspect all resources.')
            ->addOption('workspace', null, InputOption::VALUE_REQUIRED, 'Trusted target Workspace ID.', 'main')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Report path-to-ID migration without registering files.')
            ->addOption('limit', null, InputOption::VALUE_REQUIRED, 'Maximum files to inspect.', '10000')
            ->addOption('json', null, InputOption::VALUE_NONE, 'Write a machine-readable result.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $workspace = trim((string) $input->getOption('workspace')); if (preg_match('/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/D', $workspace) !== 1) return Command::INVALID;
        $limit = max(1, min(100000, (int) $input->getOption('limit'))); $dryRun = (bool) $input->getOption('dry-run'); $requested = $input->getArgument('resource');
        $resources = is_string($requested) && $requested !== '' ? [$this->resources->get($requested)] : $this->resources->all(); $items = []; $scanned = 0; $registered = 0; $existing = 0; $truncated = false;
        foreach ($resources as $resource) {
            $directories = [''];
            while ($directories !== []) {
                $directory = array_shift($directories); if (!is_string($directory)) continue; $offset = 0; $cursor = null;
                do {
                    $page = $resource->storage->list(new ListQuery($directory, offset: $offset, limit: 500, cursor: $cursor));
                    foreach ($page->entries as $entry) {
                        if ($entry->directory) { $directories[] = $entry->path; continue; }
                        if (++$scanned > $limit) { $truncated = true; break 4; }
                        $record = $this->catalog->resolve($workspace, $resource->resource->name, $entry->path); $wasExisting = $record !== null;
                        if (!$wasExisting && !$dryRun) { $record = $this->catalog->register($workspace, $resource->resource->name, $entry); ++$registered; } elseif ($wasExisting) ++$existing;
                        $items[] = ['workspace' => $workspace, 'resource' => $resource->resource->name, 'path' => $entry->path, 'assetId' => $record?->id, 'action' => $wasExisting ? 'existing' : ($dryRun ? 'register' : 'registered')];
                    }
                    $offset += count($page->entries); $cursor = $page->nextCursor;
                } while ($cursor !== null || ($page->total !== null && $offset < $page->total));
            }
        }
        $result = ['status' => 'ok', 'dryRun' => $dryRun, 'workspace' => $workspace, 'scanned' => min($scanned, $limit), 'registered' => $registered, 'existing' => $existing, 'truncated' => $truncated, 'items' => $items];
        if ($input->getOption('json')) $output->writeln(json_encode($result, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        else { $io = new SymfonyStyle($input, $output); $io->success(sprintf('%s %d file(s); %d registered, %d existing%s.', $dryRun ? 'Inspected' : 'Migrated', $result['scanned'], $registered, $existing, $truncated ? ', limit reached' : '')); }
        return $truncated ? Command::FAILURE : Command::SUCCESS;
    }
}
