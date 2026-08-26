<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:maintenance:status', description: 'Show queued, running, successful and failed SoFinder maintenance tasks.')]
final class MaintenanceStatusCommand extends Command
{
    public function __construct(private readonly MaintenanceRunner $runner)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('json', null, InputOption::VALUE_NONE, 'Output machine-readable JSON.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $tasks = $this->runner->status();
        $failed = count(array_filter($tasks, static fn (array $task): bool => ($task['status'] ?? '') === 'failed'));
        if ($input->getOption('json')) {
            $output->writeln(json_encode(['status' => $failed > 0 ? 'failed' : 'ready', 'failed' => $failed, 'tasks' => $tasks], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
            return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
        }
        $io = new SymfonyStyle($input, $output);
        $rows = [];
        foreach ($tasks as $name => $task) {
            $rows[] = [$name, (string) ($task['status'] ?? 'unknown'), (string) ($task['processed'] ?? '—'), (string) ($task['updatedAt'] ?? '—'), (string) ($task['error']['code'] ?? '—')];
        }
        $io->table(['Task', 'Status', 'Processed', 'Updated', 'Error'], $rows);
        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
