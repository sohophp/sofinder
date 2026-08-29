<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Console;

use SohoPHP\SoFinder\Maintenance\MaintenanceTask;

final class CleanupUploadsCommand extends AbstractMaintenanceCommand
{
    protected $signature = 'sofinder:uploads:cleanup {--limit=} {--json}';
    protected $description = 'Remove expired SoFinder chunk-upload sessions.';
    protected function task(): MaintenanceTask { return MaintenanceTask::Uploads; }
}
