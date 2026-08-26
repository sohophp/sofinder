<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewJobManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewMessage;
use SohoPHP\SoFinder\Preview\DocumentPreviewMessageHandler;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class DocumentPreviewJobTest extends TestCase
{
    private string $directory;
    private string $cache;
    private DocumentPreviewManager $previews;
    private ActorProviderInterface $actor;

    protected function setUp(): void
    {
        $suffix = bin2hex(random_bytes(8));
        $this->directory = sys_get_temp_dir() . '/sofinder-document-job-' . $suffix;
        $this->cache = sys_get_temp_dir() . '/sofinder-document-job-cache-' . $suffix;
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/report.docx', 'test office bytes');
        file_put_contents($this->directory . '/manual.pdf', "%PDF-1.4\n% test\n");
        $resource = new ResourceType('Files', $this->directory, '/files', ['docx', 'pdf']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]), $authorization, new EventDispatcher());
        $this->previews = new DocumentPreviewManager($files, $this->cache, officeEnabled: true, officeBinary: __DIR__ . '/fixtures/fake-libreoffice');
        $this->actor = new class implements ActorProviderInterface { public function actorId(): string { return 'actor-1'; } };
    }

    protected function tearDown(): void
    {
        $this->remove($this->directory);
        $this->remove($this->cache);
    }

    public function testAutoModeQueuesOnceAndBecomesReadyAfterTheMessageRuns(): void
    {
        $bus = new class { /** @var list<object> */ public array $messages = []; public function dispatch(object $message): object { $this->messages[] = $message; return $message; } };
        $jobs = $this->jobs($bus);

        $first = $jobs->prepare('Files', 'report.docx');
        $duplicate = $jobs->prepare('Files', 'report.docx');
        self::assertSame('queued', $first['status']);
        self::assertSame($first['id'], $duplicate['id']);
        self::assertCount(1, $bus->messages);
        self::assertInstanceOf(DocumentPreviewMessage::class, $bus->messages[0]);

        (new DocumentPreviewMessageHandler($jobs))($bus->messages[0]);
        (new DocumentPreviewMessageHandler($jobs))($bus->messages[0]);
        self::assertSame('ready', $jobs->status($first['id'])['status']);
        self::assertStringStartsWith('%PDF-', (string) file_get_contents($this->previews->preview('Files', 'report.docx')['file']));
    }

    public function testInlineFallbackAndPdfReturnReadyWithoutAQueue(): void
    {
        $jobs = $this->jobs(null, 'auto');
        self::assertFalse($jobs->asynchronous());
        self::assertSame('ready', $jobs->prepare('Files', 'report.docx')['status']);
        self::assertSame('ready', $jobs->prepare('Files', 'manual.pdf')['status']);
    }

    public function testExpiredJobIsVisibleAndCanBeRetried(): void
    {
        $now = 1_000;
        $bus = new class { /** @var list<object> */ public array $messages = []; public function dispatch(object $message): object { $this->messages[] = $message; return $message; } };
        $jobs = $this->jobs($bus, 'messenger', static function () use (&$now): int { return $now; });
        $job = $jobs->prepare('Files', 'report.docx');
        $now += 61;

        $expired = $jobs->status($job['id']);
        self::assertSame('expired', $expired['status']);
        self::assertSame('document_preview_expired', $expired['error']['code'] ?? null);
        self::assertSame('expired', $jobs->prepare('Files', 'report.docx')['status']);
        self::assertSame('queued', $jobs->prepare('Files', 'report.docx', true)['status']);
        self::assertCount(2, $bus->messages);
    }

    public function testFailedConversionIsRecordedAndPrepareRetriesIt(): void
    {
        $bus = new class { /** @var list<object> */ public array $messages = []; public function dispatch(object $message): object { $this->messages[] = $message; return $message; } };
        $jobs = $this->jobs($bus);
        $job = $jobs->prepare('Files', 'report.docx');
        foreach (glob($this->cache . '/document-previews/jobs/' . $job['id'] . '/source.*') ?: [] as $file) unlink($file);
        $failed = false;
        try { $jobs->run($job['id']); } catch (\Throwable) { $failed = true; }

        self::assertTrue($failed, 'The missing staged document was converted.');
        self::assertSame('failed', $jobs->status($job['id'])['status']);
        self::assertSame('failed', $jobs->prepare('Files', 'report.docx')['status']);
        self::assertSame('queued', $jobs->prepare('Files', 'report.docx', true)['status']);
        self::assertCount(2, $bus->messages);
    }

    public function testExplicitRetryDoesNotDuplicateAnOutstandingJob(): void
    {
        $bus = new class { /** @var list<object> */ public array $messages = []; public function dispatch(object $message): object { $this->messages[] = $message; return $message; } };
        $jobs = $this->jobs($bus);
        $first = $jobs->prepare('Files', 'report.docx');
        $retry = $jobs->prepare('Files', 'report.docx', true);

        self::assertSame($first['id'], $retry['id']);
        self::assertSame('queued', $retry['status']);
        self::assertCount(1, $bus->messages);
    }

    private function jobs(?object $bus, string $mode = 'auto', ?\Closure $clock = null): DocumentPreviewJobManager
    {
        return new DocumentPreviewJobManager($this->previews, $this->actor, $this->cache . '/jobs.json', $mode, 60, 60, $bus, clock: $clock);
    }

    private function remove(string $directory): void
    {
        if (!is_dir($directory)) return;
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $entry) $entry->isDir() ? @rmdir($entry->getPathname()) : @unlink($entry->getPathname());
        @rmdir($directory);
    }
}
