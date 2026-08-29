<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Console;

use Illuminate\Console\Command;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;

abstract class AbstractMaintenanceCommand extends Command
{
    public function __construct(private readonly MaintenanceRunner $runner)
    {
        parent::__construct();
    }

    abstract protected function task(): MaintenanceTask;

    public function handle(): int
    {
        $limit = $this->option('limit');
        $result = $this->runner->run($this->task(), is_numeric($limit) ? max(1, (int) $limit) : null);
        $payload = ['task' => $result->task->value, 'executed' => $result->executed, 'processed' => $result->processed, 'details' => $result->details];
        if ((bool) $this->option('json')) {
            $this->line(json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
        } else {
            $this->info($result->executed
                ? sprintf('SoFinder %s maintenance processed %d item(s).', $result->task->value, $result->processed)
                : sprintf('SoFinder %s maintenance is already running; skipped.', $result->task->value));
        }

        return self::SUCCESS;
    }
}
