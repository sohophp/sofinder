<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Console;

use SohoPHP\SoFinder\Maintenance\MaintenanceTask;

final class CleanupTrashCommand extends AbstractMaintenanceCommand
{
    protected $signature = 'sofinder:trash:cleanup {--limit=} {--json}';
    protected $description = 'Permanently remove expired SoFinder recycle-bin entries.';
    protected function task(): MaintenanceTask { return MaintenanceTask::Trash; }
}
