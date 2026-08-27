<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Asset\JsonAssetCatalog;
use SohoPHP\SoFinder\Command\AssetMigrateCommand;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

final class AssetMigrateCommandTest extends TestCase
{
    public function testDryRunDoesNotRegisterAndMigrationIsIdempotent(): void
    {
        $directory = sys_get_temp_dir() . '/sofinder-migrate-' . bin2hex(random_bytes(5)); mkdir($directory . '/files/nested', 0777, true); file_put_contents($directory . '/files/nested/manual.txt', 'manual');
        try {
            $catalog = new JsonAssetCatalog($directory . '/catalog.json'); $resource = new ResourceStorage(new ResourceType('Files', $directory . '/files', '/files'), new LocalStorageAdapter($directory . '/files', '/files')); $command = new AssetMigrateCommand(new ResourceRegistry([$resource]), $catalog);
            $dry = new CommandTester($command); self::assertSame(Command::SUCCESS, $dry->execute(['--dry-run' => true, '--json' => true])); self::assertNull($catalog->resolve('main', 'Files', 'nested/manual.txt'));
            $run = new CommandTester($command); self::assertSame(Command::SUCCESS, $run->execute(['--json' => true])); $record = $catalog->resolve('main', 'Files', 'nested/manual.txt'); self::assertNotNull($record);
            $again = new CommandTester($command); self::assertSame(Command::SUCCESS, $again->execute(['--json' => true])); $payload = json_decode($again->getDisplay(), true, 32, JSON_THROW_ON_ERROR); self::assertSame(1, $payload['existing']); self::assertSame($record->id, $catalog->resolve('main', 'Files', 'nested/manual.txt')?->id);
        } finally {
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST); foreach ($iterator as $item) $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname()); @rmdir($directory);
        }
    }
}
