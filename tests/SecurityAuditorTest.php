<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\SecurityAuditor;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;

final class SecurityAuditorTest extends TestCase
{
    public function testFrameworkNeutralAuditResultKeepsStableMachineReadableShape(): void
    {
        $base = sys_get_temp_dir() . '/sofinder-core-security-audit-' . bin2hex(random_bytes(8));
        foreach (['project', 'storage', 'quarantine', 'chunks', 'trash'] as $directory) {
            mkdir($base . '/' . $directory, 0775, true);
        }
        file_put_contents($base . '/storage/danger.php', '<?php');
        $resource = new ResourceType('Files', $base . '/storage', '', deliveryMode: 'proxy');
        $auditor = new SecurityAuditor(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($base . '/storage', ''))]),
            $base . '/project',
            $base . '/quarantine',
            $base . '/chunks',
            $base . '/trash',
        );

        try {
            $result = $auditor->audit();
            self::assertSame('critical', $result->status());
            self::assertSame(1, $result->criticalCount());
            self::assertSame(1, $result->warningCount());
            self::assertSame(['status', 'critical', 'warnings', 'findings'], array_keys($result->toArray()));
            self::assertNotEmpty(array_filter(
                $result->findings,
                static fn (array $finding): bool => $finding['scope'] === 'Files' && str_contains($finding['message'], 'danger.php'),
            ));
        } finally {
            @unlink($base . '/storage/danger.php');
            foreach (['project', 'storage', 'quarantine', 'chunks', 'trash'] as $directory) {
                @rmdir($base . '/' . $directory);
            }
            @rmdir($base);
        }
    }
}
