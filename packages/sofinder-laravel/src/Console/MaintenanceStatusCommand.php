<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Console;

use Illuminate\Console\Command;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;

final class MaintenanceStatusCommand extends Command
{
    protected $signature = 'sofinder:maintenance:status {--json}';
    protected $description = 'Show SoFinder maintenance task status.';

    public function __construct(private readonly MaintenanceRunner $runner)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $tasks = $this->runner->status();
        $failed = count(array_filter($tasks, static fn (array $task): bool => ($task['status'] ?? '') === 'failed'));
        if ((bool) $this->option('json')) {
            $this->line(json_encode(['status' => $failed > 0 ? 'failed' : 'ready', 'failed' => $failed, 'tasks' => $tasks], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
        } else {
            $rows = [];
            foreach ($tasks as $name => $task) {
                $rows[] = [$name, (string) ($task['status'] ?? 'unknown'), (string) ($task['processed'] ?? '—'), (string) ($task['updatedAt'] ?? '—'), (string) ($task['error']['code'] ?? '—')];
            }
            $this->table(['Task', 'Status', 'Processed', 'Updated', 'Error'], $rows);
        }

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
