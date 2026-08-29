<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel\Console;

use Illuminate\Console\Command;
use SohoPHP\SoFinder\Security\SecurityAuditor;

final class SecurityAuditCommand extends Command
{
    protected $signature = 'sofinder:security:audit {--json}';
    protected $description = 'Audit SoFinder storage and private working-directory security.';

    public function __construct(private readonly SecurityAuditor $auditor)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $result = $this->auditor->audit();
        if ((bool) $this->option('json')) {
            $this->line(json_encode($result->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return $result->criticalCount() > 0 ? self::FAILURE : self::SUCCESS;
        }

        if ($result->findings === []) {
            $this->info('No SoFinder storage security problems were detected.');

            return self::SUCCESS;
        }
        $this->table(['Severity', 'Scope', 'Finding'], array_map(
            static fn (array $finding): array => [$finding['severity'], $finding['scope'], $finding['message']],
            $result->findings,
        ));
        if ($result->criticalCount() > 0) {
            $this->error(sprintf('%d critical SoFinder security finding(s) require attention.', $result->criticalCount()));

            return self::FAILURE;
        }
        $this->warn('The audit completed with warnings.');

        return self::SUCCESS;
    }
}
