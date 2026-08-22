<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Exception\AccessDeniedException;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class FileManagerTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-manager-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
    }

    protected function tearDown(): void
    {
        $this->removeDirectory($this->directory);
    }

    public function testRequiresAuthentication(): void
    {
        $manager = $this->manager(false);
        $this->expectException(AccessDeniedException::class);
        $manager->resources();
    }

    public function testEveryReplacementRequiresTheIndependentOverwritePermission(): void
    {
        file_put_contents($this->directory . '/target.txt', 'original');
        file_put_contents($this->directory . '/source.txt', 'source');
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool
            {
                return $operation !== 'overwrite';
            }
        };
        $manager = new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]),
            $authorization,
            new EventDispatcher(),
        );

        $stream = fopen('php://temp', 'w+b');
        self::assertIsResource($stream);
        fwrite($stream, 'replacement');
        rewind($stream);
        try {
            $manager->upload('Files', '', 'target.txt', 11, $stream, true);
            self::fail('An upload replacement must require overwrite permission.');
        } catch (AccessDeniedException) {
            self::assertSame('original', file_get_contents($this->directory . '/target.txt'));
        } finally {
            fclose($stream);
        }

        try {
            $manager->rename('Files', 'source.txt', 'target.txt', true);
            self::fail('A rename replacement must require overwrite permission.');
        } catch (AccessDeniedException) {
            self::assertFileExists($this->directory . '/source.txt');
            self::assertSame('original', file_get_contents($this->directory . '/target.txt'));
        }
    }

    public function testCreatesAndListsFolder(): void
    {
        $manager = $this->manager(true);
        $manager->createFolder('Files', '', 'Docs');
        $result = $manager->list('Files');
        self::assertSame(1, $result['total']);
        self::assertSame('Docs', $result['entries'][0]->name);
    }

    public function testCreateFolderEnforcesNameAndDepthLimits(): void
    {
        $manager = $this->manager(true, maxFolderNameLength: 4, maxFolderDepth: 1);
        $manager->createFolder('Files', '', 'root');

        try {
            $manager->createFolder('Files', '', '12345');
            self::fail('The folder name limit should be enforced.');
        } catch (SoFinderException $exception) {
            self::assertSame('folder_name_too_long', $exception->errorCode);
        }

        try {
            $manager->createFolder('Files', 'root', 'kid');
            self::fail('The folder depth limit should be enforced.');
        } catch (SoFinderException $exception) {
            self::assertSame('folder_depth_exceeded', $exception->errorCode);
        }
    }

    public function testTransferChecksTheDepthOfTheWholeFolderTree(): void
    {
        mkdir($this->directory . '/tree/child', 0775, true);
        mkdir($this->directory . '/target');

        try {
            $this->manager(true, maxFolderDepth: 2)->transfer('move', 'Files', 'tree', 'target');
            self::fail('Moving the directory tree should exceed the configured depth.');
        } catch (SoFinderException $exception) {
            self::assertSame('folder_depth_exceeded', $exception->errorCode);
        }

        self::assertDirectoryExists($this->directory . '/tree/child');
        self::assertDirectoryDoesNotExist($this->directory . '/target/tree');
    }

    public function testListsAStableSortedPageAndClampsAnInvalidOffset(): void
    {
        file_put_contents($this->directory . '/small.txt', '1');
        file_put_contents($this->directory . '/large.txt', '12345');
        file_put_contents($this->directory . '/medium.txt', '123');
        $manager = $this->manager(true);

        $firstPage = $manager->list('Files', '', '', 'size', 'desc', 0, 2);
        self::assertSame(3, $firstPage['total']);
        self::assertSame(0, $firstPage['offset']);
        self::assertSame(2, $firstPage['limit']);
        self::assertSame(['large.txt', 'medium.txt'], array_column($firstPage['entries'], 'name'));

        $lastPage = $manager->list('Files', '', '', 'size', 'desc', 999, 2);
        self::assertSame(2, $lastPage['offset']);
        self::assertSame(['small.txt'], array_column($lastPage['entries'], 'name'));
    }

    public function testFallsBackToSafeListOptions(): void
    {
        file_put_contents($this->directory . '/file.txt', '1');

        $result = $this->manager(true)->list('Files', '', '', 'unknown', 'sideways', -5, 9999);

        self::assertSame('name', $result['sort']);
        self::assertSame('asc', $result['direction']);
        self::assertSame(0, $result['offset']);
        self::assertSame(500, $result['limit']);
    }

    public function testAuthorizationFilteringHappensBeforePagination(): void
    {
        foreach (['hidden.txt', 'visible-a.txt', 'visible-b.txt'] as $name) {
            file_put_contents($this->directory . '/' . $name, '1');
        }
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool
            {
                return $operation !== 'read' || $path !== 'hidden.txt';
            }
        };
        $manager = new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]),
            $authorization,
            new EventDispatcher(),
        );

        $result = $manager->list('Files', limit: 2);

        self::assertSame(2, $result['total']);
        self::assertSame(['visible-a.txt', 'visible-b.txt'], array_column($result['entries'], 'name'));
    }

    public function testRenamesFileWithoutChangingItsExtension(): void
    {
        file_put_contents($this->directory . '/photo.jpg', 'image');

        $entry = $this->manager(true)->rename('Files', 'photo.jpg', 'renamed.jpg');

        self::assertSame('renamed.jpg', $entry->name);
        self::assertFileDoesNotExist($this->directory . '/photo.jpg');
        self::assertFileExists($this->directory . '/renamed.jpg');
    }

    #[DataProvider('changedExtensionProvider')]
    public function testRejectsChangingOrRemovingAFileExtension(string $newName): void
    {
        file_put_contents($this->directory . '/photo.jpg', 'image');

        try {
            $this->manager(true)->rename('Files', 'photo.jpg', $newName);
            self::fail('Changing a file extension should have been rejected.');
        } catch (SoFinderException $exception) {
            self::assertSame('extension_change_not_allowed', $exception->errorCode);
            self::assertSame(422, $exception->httpStatus);
        }

        self::assertFileExists($this->directory . '/photo.jpg');
        self::assertFileDoesNotExist($this->directory . '/' . $newName);
    }

    /** @return iterable<string, array{string}> */
    public static function changedExtensionProvider(): iterable
    {
        yield 'extension is appended' => ['photo.jpg123'];
        yield 'extension is removed' => ['photo'];
        yield 'extension is replaced' => ['photo.png'];
        yield 'extension case is changed' => ['photo.JPG'];
    }

    public function testRejectsDeniedIntermediateExtensionDuringRename(): void
    {
        file_put_contents($this->directory . '/photo.jpg', 'image');

        try {
            $this->manager(true)->rename('Files', 'photo.jpg', 'payload.php.jpg');
            self::fail('A denied intermediate extension should have been rejected.');
        } catch (SoFinderException $exception) {
            self::assertSame('invalid_extension', $exception->errorCode);
        }

        self::assertFileExists($this->directory . '/photo.jpg');
        self::assertFileDoesNotExist($this->directory . '/payload.php.jpg');
    }

    public function testBatchDeleteIsolatesFailuresAndReportsEveryResult(): void
    {
        file_put_contents($this->directory . '/first.txt', '1');
        file_put_contents($this->directory . '/second.txt', '2');

        $result = $this->manager(true)->batch('delete', 'Files', ['first.txt', 'missing.txt', 'second.txt']);

        self::assertSame(3, $result['total']);
        self::assertSame(2, $result['succeeded']);
        self::assertSame(1, $result['failed']);
        self::assertSame([true, false, true], array_column($result['results'], 'success'));
        self::assertSame('not_found', $result['results'][1]['error']['code']);
        self::assertFileDoesNotExist($this->directory . '/first.txt');
        self::assertFileDoesNotExist($this->directory . '/second.txt');
    }

    public function testBatchCopyUsesConflictSafeNames(): void
    {
        mkdir($this->directory . '/one');
        mkdir($this->directory . '/two');
        mkdir($this->directory . '/destination');
        file_put_contents($this->directory . '/one/file.txt', 'one');
        file_put_contents($this->directory . '/two/file.txt', 'two');

        $result = $this->manager(true)->batch('copy', 'Files', ['one/file.txt', 'two/file.txt'], 'destination');

        self::assertSame(2, $result['succeeded']);
        self::assertSame(0, $result['failed']);
        self::assertFileExists($this->directory . '/destination/file.txt');
        self::assertFileExists($this->directory . '/destination/file (1).txt');
    }

    public function testBatchRejectsOverlappingFolderPaths(): void
    {
        mkdir($this->directory . '/folder');
        file_put_contents($this->directory . '/folder/file.txt', 'content');

        $this->expectException(SoFinderException::class);
        $this->expectExceptionMessage('A batch cannot contain both a folder and one of its descendants.');
        $this->manager(true)->batch('delete', 'Files', ['folder', 'folder/file.txt']);
    }

    public function testBatchHasAHardEntryLimit(): void
    {
        $paths = array_map(static fn (int $index): string => sprintf('file-%d.txt', $index), range(1, 101));

        try {
            $this->manager(true)->batch('delete', 'Files', $paths);
            self::fail('An oversized batch should have been rejected.');
        } catch (SoFinderException $exception) {
            self::assertSame('batch_limit_exceeded', $exception->errorCode);
            self::assertSame(413, $exception->httpStatus);
        }
    }

    public function testUploadConflictCanOnlyOverwriteWhenExplicitlyRequested(): void
    {
        file_put_contents($this->directory . '/document.txt', 'old');
        $manager = $this->manager(true);
        $first = fopen('php://temp', 'w+b');
        fwrite($first, 'new');
        rewind($first);

        try {
            $manager->upload('Files', '', 'document.txt', 3, $first);
            self::fail('An upload must not overwrite a file by default.');
        } catch (\SohoPHP\SoFinder\Exception\ConflictException) {
            self::assertSame('old', file_get_contents($this->directory . '/document.txt'));
        } finally {
            fclose($first);
        }

        $replacement = fopen('php://temp', 'w+b');
        fwrite($replacement, 'new');
        rewind($replacement);
        try {
            $entry = $manager->upload('Files', '', 'document.txt', 3, $replacement, true);
        } finally {
            fclose($replacement);
        }

        self::assertSame('document.txt', $entry->name);
        self::assertSame('new', file_get_contents($this->directory . '/document.txt'));
    }

    public function testQuotaRejectsUploadWithoutChangingExistingFiles(): void
    {
        file_put_contents($this->directory . '/existing.txt', '1234');
        $stream = fopen('php://temp', 'w+b');
        fwrite($stream, '12');
        rewind($stream);

        try {
            $this->manager(true, 5)->upload('Files', '', 'new.txt', 2, $stream);
            self::fail('The upload should exceed the configured quota.');
        } catch (SoFinderException $exception) {
            self::assertSame('quota_exceeded', $exception->errorCode);
            self::assertSame(413, $exception->httpStatus);
        } finally {
            fclose($stream);
        }

        self::assertSame('1234', file_get_contents($this->directory . '/existing.txt'));
        self::assertFileDoesNotExist($this->directory . '/new.txt');
    }

    public function testQuotaAllowsReplacingExistingBytes(): void
    {
        file_put_contents($this->directory . '/existing.txt', '1234');
        $stream = fopen('php://temp', 'w+b');
        fwrite($stream, '12345');
        rewind($stream);
        try {
            $entry = $this->manager(true, 5)->upload('Files', '', 'existing.txt', 5, $stream, true);
        } finally {
            fclose($stream);
        }

        self::assertSame(5, $entry->size);
        self::assertSame('12345', file_get_contents($this->directory . '/existing.txt'));
    }

    public function testResourceSummaryIncludesQuotaUsage(): void
    {
        file_put_contents($this->directory . '/existing.txt', '1234');

        $resources = $this->manager(true, 100)->resources();

        self::assertSame(100, $resources[0]['quotaBytes']);
        self::assertSame(4, $resources[0]['usedBytes']);
    }

    public function testListingDoesNotRevealEntriesDeniedByChildPathAcl(): void
    {
        file_put_contents($this->directory . '/visible.txt', 'ok');
        file_put_contents($this->directory . '/secret.txt', 'hidden');
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool
            {
                return !($operation === 'read' && $path === 'secret.txt');
            }
        };
        $manager = new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]),
            $authorization,
            new EventDispatcher(),
        );

        self::assertSame(['visible.txt'], array_column($manager->list('Files')['entries'], 'name'));
    }

    private function manager(
        bool $authenticated,
        int $quota = 0,
        int $maxFileNameLength = 120,
        int $maxFolderNameLength = 80,
        int $maxFolderDepth = 20,
    ): FileManager
    {
        $resource = new ResourceType(
            'Files',
            $this->directory,
            '/uploads/editor',
            ['txt', 'jpg'],
            ['php'],
            [],
            20_971_520,
            false,
            $quota,
            maxFileNameLength: $maxFileNameLength,
            maxFolderNameLength: $maxFolderNameLength,
            maxFolderDepth: $maxFolderDepth,
        );
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/uploads/editor'))]);
        $authorization = new class($authenticated) implements AuthorizationInterface {
            public function __construct(private readonly bool $authenticated) {}
            public function isAuthenticated(): bool { return $this->authenticated; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return $this->authenticated; }
        };

        return new FileManager($registry, $authorization, new EventDispatcher());
    }

    private function removeDirectory(string $directory): void
    {
        if (!is_dir($directory)) {
            return;
        }
        foreach (new \FilesystemIterator($directory, \FilesystemIterator::SKIP_DOTS) as $entry) {
            if ($entry->isDir() && !$entry->isLink()) {
                $this->removeDirectory($entry->getPathname());
            } else {
                @unlink($entry->getPathname());
            }
        }
        @rmdir($directory);
    }
}
