<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'sofinder:trash:cleanup', description: 'Permanently remove expired SoFinder recycle-bin entries.')]
final class TrashCleanupCommand extends Command
{
    public function __construct(private readonly MaintenanceRunner $runner)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $result = $this->runner->run(MaintenanceTask::Trash);
        $output->writeln($result->executed
            ? sprintf('Purged %d expired SoFinder trash item(s).', $result->processed)
            : 'SoFinder trash cleanup is already running; skipped.');

        return Command::SUCCESS;
    }
}
