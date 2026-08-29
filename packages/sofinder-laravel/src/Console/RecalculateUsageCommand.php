<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Console;

use SohoPHP\SoFinder\Maintenance\MaintenanceTask;

final class RecalculateUsageCommand extends AbstractMaintenanceCommand
{
    protected $signature = 'sofinder:usage:recalculate {--json} {--limit=}';
    protected $description = 'Recalculate SoFinder resource quota usage.';
    protected function task(): MaintenanceTask { return MaintenanceTask::Usage; }
}
