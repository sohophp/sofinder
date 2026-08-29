<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'sofinder:uploads:cleanup', description: 'Remove expired SoFinder chunk-upload sessions.')]
final class UploadCleanupCommand extends Command
{
    public function __construct(private readonly MaintenanceRunner $runner)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $result = $this->runner->run(MaintenanceTask::Uploads);
        $output->writeln($result->executed
            ? sprintf('Purged %d expired SoFinder upload session(s).', $result->processed)
            : 'SoFinder upload cleanup is already running; skipped.');

        return Command::SUCCESS;
    }
}
