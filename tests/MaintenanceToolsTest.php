<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Maintenance\CacheCleaner;
use SohoPHP\SoFinder\Maintenance\MetadataRepairer;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;

final class MaintenanceToolsTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-maintenance-tools-' . bin2hex(random_bytes(8));
        mkdir($this->directory . '/cache/thumbnails', 0775, true);
        mkdir($this->directory . '/cache/document-previews', 0775, true);
        mkdir($this->directory . '/storage', 0775, true);
    }

    protected function tearDown(): void
    {
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $entry) $entry->isDir() ? @rmdir($entry->getPathname()) : @unlink($entry->getPathname());
        @rmdir($this->directory);
    }

    public function testCacheCleanupDryRunDoesNotDeleteAndApplyIsScoped(): void
    {
        $thumbnail = $this->directory . '/cache/thumbnails/old.png';
        $preview = $this->directory . '/cache/document-previews/old.pdf';
        $status = $this->directory . '/cache/metrics.json';
        file_put_contents($thumbnail, '123');
        file_put_contents($preview, '4567');
        file_put_contents($status, '{}');
        touch($thumbnail, time() - 7200);
        touch($preview, time() - 7200);
        $cleaner = new CacheCleaner($this->directory . '/cache');

        $dry = $cleaner->clean(3600, true);
        self::assertSame(2, $dry['matched']);
        self::assertSame(7, $dry['bytes']);
        self::assertFileExists($thumbnail);

        $applied = $cleaner->clean(3600, false);
        self::assertSame(2, $applied['removed']);
        self::assertFileDoesNotExist($thumbnail);
        self::assertFileDoesNotExist($preview);
        self::assertFileExists($status);
    }

    public function testMetadataRepairDryRunThenRemovesInvalidReferences(): void
    {
        file_put_contents($this->directory . '/storage/kept.txt', 'ok');
        $metadataFile = $this->directory . '/metadata.json';
        $original = [
            'version' => 9,
            'users' => [
                'actor' => [
                    'Files' => [
                        'favorites' => ['kept.txt', 'missing.txt', 'kept.txt'],
                        'tags' => ['kept.txt' => ['Docs', 'docs', "bad\n"], 'missing.txt' => ['gone']],
                        'recent' => [['path' => 'missing.txt', 'touchedAt' => 1], ['path' => 'kept.txt', 'touchedAt' => 2]],
                    ],
                    'MissingResource' => ['favorites' => ['x']],
                ],
            ],
        ];
        file_put_contents($metadataFile, json_encode($original, JSON_THROW_ON_ERROR));
        $resource = new ResourceType('Files', $this->directory . '/storage', '', ['txt']);
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory . '/storage'))]);
        $repairer = new MetadataRepairer($metadataFile, $registry);

        $dry = $repairer->repair(true);
        self::assertTrue($dry['changed']);
        self::assertSame($original, json_decode((string) file_get_contents($metadataFile), true, 512, JSON_THROW_ON_ERROR));

        $applied = $repairer->repair(false);
        $stored = json_decode((string) file_get_contents($metadataFile), true, 512, JSON_THROW_ON_ERROR);
        self::assertTrue($applied['changed']);
        self::assertSame(1, $stored['version']);
        self::assertSame(['kept.txt'], $stored['users']['actor']['Files']['favorites']);
        self::assertSame(['docs', 'bad'], $stored['users']['actor']['Files']['tags']['kept.txt']);
        self::assertSame([['path' => 'kept.txt', 'touchedAt' => 2]], $stored['users']['actor']['Files']['recent']);
        self::assertArrayNotHasKey('MissingResource', $stored['users']['actor']);
    }
}
