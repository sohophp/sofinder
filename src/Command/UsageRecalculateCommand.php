<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
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
        $this->addArgument('resource', InputArgument::OPTIONAL, 'Resource name; omit to recalculate all resources.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $name = $input->getArgument('resource');
        if (!is_string($name) || $name === '') {
            $result = $this->runner->run(MaintenanceTask::Usage);
            if (!$result->executed) {
                $io->note('SoFinder usage recalculation is already running; skipped.');
                return Command::SUCCESS;
            }
            foreach ($result->details as $resource => $bytes) {
                $io->writeln(sprintf('%s: %d bytes', $resource, $bytes));
            }
            $io->success(sprintf('Recalculated %d SoFinder resource(s).', $result->processed));
            return Command::SUCCESS;
        }
        $items = [$this->resources->get($name)];
        foreach ($items as $item) {
            $bytes = $this->usage->recalculate($item);
            $io->writeln(sprintf('%s: %d bytes', $item->resource->name, $bytes));
        }
        $io->success(sprintf('Recalculated %d SoFinder resource(s).', count($items)));

        return Command::SUCCESS;
    }
}
