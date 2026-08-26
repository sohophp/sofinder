<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Command\UsageRecalculateCommand;
use SohoPHP\SoFinder\Contract\UsageTrackerInterface;
use SohoPHP\SoFinder\Maintenance\MaintenanceRunner;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

final class UsageRecalculateCommandTest extends TestCase
{
    public function testDryRunReportsStorageBytesWithoutCallingTracker(): void
    {
        $directory = sys_get_temp_dir() . '/sofinder-usage-command-' . bin2hex(random_bytes(8));
        mkdir($directory, 0775, true);
        file_put_contents($directory . '/example.txt', '12345');
        $resource = new ResourceStorage(new ResourceType('Files', $directory, ''), new LocalStorageAdapter($directory));
        $usage = new class implements UsageTrackerInterface {
            public int $calls = 0;
            public function usage(ResourceStorage $resource): int { ++$this->calls; return 0; }
            public function recalculate(ResourceStorage $resource): int { ++$this->calls; return 0; }
            public function mutate(ResourceStorage $resource, callable $operation): mixed { ++$this->calls; return null; }
        };
        /** @var MaintenanceRunner $runner */
        $runner = (new \ReflectionClass(MaintenanceRunner::class))->newInstanceWithoutConstructor();
        $tester = new CommandTester(new UsageRecalculateCommand(new ResourceRegistry([$resource]), $usage, $runner));

        $status = $tester->execute(['--dry-run' => true, '--json' => true]);
        $payload = json_decode($tester->getDisplay(), true, 512, JSON_THROW_ON_ERROR);

        self::assertSame(Command::SUCCESS, $status);
        self::assertTrue($payload['dryRun']);
        self::assertSame(5, $payload['resources']['Files']);
        self::assertSame(0, $usage->calls);
        unlink($directory . '/example.txt');
        rmdir($directory);
    }
}
