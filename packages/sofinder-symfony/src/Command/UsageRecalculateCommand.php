<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\Contract\StorageUsageProviderInterface;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:usage:recalculate', description: 'Recalculate persisted SoFinder resource usage.')]
final class UsageRecalculateCommand extends Command
{
    public function __construct(
        private readonly ResourceRegistry $resources,
        private readonly UsageTrackerInterface $usage,
        private readonly MaintenanceRunner $runner,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('resource', InputArgument::OPTIONAL, 'Resource name; omit to recalculate all resources.')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Scan storage and report the values without changing persisted usage.')
            ->addOption('json', null, InputOption::VALUE_NONE, 'Write a machine-readable result.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $name = $input->getArgument('resource');
        $dryRun = (bool) $input->getOption('dry-run');
        $json = (bool) $input->getOption('json');
        if ($dryRun) {
            $items = is_string($name) && $name !== '' ? [$this->resources->get($name)] : $this->resources->all();
            $values = [];
            foreach ($items as $item) {
                if (!$item->storage instanceof StorageUsageProviderInterface) {
                    if ($json) {
                        $output->writeln(json_encode([
                            'status' => 'unsupported',
                            'dryRun' => true,
                            'resource' => $item->resource->name,
                        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
                    } else {
                        $io->error(sprintf('Resource %s cannot calculate storage usage.', $item->resource->name));
                    }
                    return Command::FAILURE;
                }
                $values[$item->resource->name] = $item->storage->usage();
            }
            if ($json) {
                $output->writeln(json_encode([
                    'status' => 'ok',
                    'dryRun' => true,
                    'resources' => $values,
                ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
            } else {
                foreach ($values as $resource => $bytes) $io->writeln(sprintf('%s: %d bytes', $resource, $bytes));
                $io->success(sprintf('Dry run scanned %d SoFinder resource(s); persisted usage was not changed.', count($values)));
            }
            return Command::SUCCESS;
        }
        if (!is_string($name) || $name === '') {
            $result = $this->runner->run(MaintenanceTask::Usage);
            if (!$result->executed) {
                $io->note('SoFinder usage recalculation is already running; skipped.');
                return Command::SUCCESS;
            }
            if ($json) {
                $output->writeln(json_encode([
                    'status' => 'ok',
                    'dryRun' => false,
                    'executed' => $result->executed,
                    'resources' => $result->details,
                ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
                return Command::SUCCESS;
            }
            foreach ($result->details as $resource => $bytes) $io->writeln(sprintf('%s: %d bytes', $resource, $bytes));
            $io->success(sprintf('Recalculated %d SoFinder resource(s).', $result->processed));
            return Command::SUCCESS;
        }
        $items = [$this->resources->get($name)];
        foreach ($items as $item) {
            $bytes = $this->usage->recalculate($item);
            if ($json) {
                $output->writeln(json_encode([
                    'status' => 'ok',
                    'dryRun' => false,
                    'resources' => [$item->resource->name => $bytes],
                ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
                return Command::SUCCESS;
            }
            $io->writeln(sprintf('%s: %d bytes', $item->resource->name, $bytes));
        }
        $io->success(sprintf('Recalculated %d SoFinder resource(s).', count($items)));

        return Command::SUCCESS;
    }
}
