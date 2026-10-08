<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') { http_response_code(404); exit(1); }
$bootstrap = getenv('SOFINDER_CHUNK_TEST_BOOTSTRAP') ?: dirname(__DIR__) . '/bootstrap.php';
if (!str_starts_with($bootstrap, '/') || !is_file($bootstrap)) throw new RuntimeException('An absolute test bootstrap is required.');
require $bootstrap;

use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Upload\ChunkUploadManager;

final class PausedChunkInput
{
    public mixed $context;
    private bool $read = false;
    public function stream_open(string $path, string $mode, int $options, ?string &$openedPath): bool { return true; }
    public function stream_read(int $count): string
    {
        if ($this->read) return '';
        echo "reading\n"; fflush(STDOUT);
        if (trim((string) fgets(STDIN)) !== 'continue') throw new RuntimeException('Missing test barrier.');
        $this->read = true;
        return 'abc';
    }
    public function stream_eof(): bool { return $this->read; }
    public function stream_stat(): array { return []; }
}

$actor = new class implements ActorProviderInterface { public function actorId(): string { return 'actor'; } };
$manager = new ChunkUploadManager($argv[1], $actor, 10, 2);
$id = 'concurrent-session-01';
$authorization = new class implements \SohoPHP\SoFinder\Contract\AuthorizationInterface {
    public function isAuthenticated(): bool { return true; }
    public function isGranted(string $operation, \SohoPHP\SoFinder\Value\ResourceType $resource, string $path): bool { return true; }
};
$csrf = new class implements \SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface {
    public function token(\SohoPHP\SoFinder\Value\RequestContext $context): string { return 'valid'; }
    public function isValid(\SohoPHP\SoFinder\Value\RequestContext $context, string $token): bool { return $token === 'valid'; }
};
$guard = new \SohoPHP\SoFinder\Http\MutationGuard($authorization, $csrf);
try {
    if (in_array($argv[2], ['publish', 'reject'], true)) {
        $root = $argv[1] . '/files'; mkdir($root, 0700);
        $inspector = new class($argv[2] === 'reject') implements \SohoPHP\SoFinder\Contract\FileInspectorInterface {
            public function __construct(private readonly bool $reject) {}
            public function inspect(string $path, string $fileName, \SohoPHP\SoFinder\Value\ResourceType $resource): \SohoPHP\SoFinder\Value\InspectedFile
            {
                echo "publishing\n"; fflush(STDOUT);
                if (trim((string) fgets(STDIN)) !== 'continue') throw new RuntimeException('Missing publication barrier.');
                if ($this->reject) throw new \SohoPHP\SoFinder\Exception\SoFinderException('Test rejection.', 'test_rejected', 415);
                return (new \SohoPHP\SoFinder\Security\DefaultFileInspector(new \SohoPHP\SoFinder\Image\GdImageProcessor()))->inspect($path, $fileName, $resource);
            }
        };
        $events = new class implements \Psr\EventDispatcher\EventDispatcherInterface { public function dispatch(object $event): object { return $event; } };
        $resource = new \SohoPHP\SoFinder\Value\ResourceType('Files', $root, '/files', ['txt']);
        $files = new \SohoPHP\SoFinder\FileManager(new \SohoPHP\SoFinder\ResourceRegistry([
            new \SohoPHP\SoFinder\Value\ResourceStorage($resource, new \SohoPHP\SoFinder\Storage\LocalStorageAdapter($root, '/files'))]),
            $authorization, $events, uploads: new \SohoPHP\SoFinder\Security\UploadPipeline($inspector, $argv[1] . '/quarantine'),
            usage: new \SohoPHP\SoFinder\Usage\PersistentUsageTracker($argv[1] . '/usage'));
        $input = $argv[1] . '/input'; file_put_contents($input, 'abc');
        (new \SohoPHP\SoFinder\Http\Action\ChunkUploadAction($files, $manager, $guard, new \SohoPHP\SoFinder\Upload\UploadNamePolicy()))
            ->execute(new \SohoPHP\SoFinder\Value\RequestContext(headers: ['X-CSRF-TOKEN' => 'valid']),
                ['resource' => 'Files', 'name' => 'published.txt', 'uploadId' => $id, 'index' => 0, 'total' => 1,
                    'chunk' => \SohoPHP\SoFinder\Http\UploadedFileInput::fromPath($input, 'part', 3)]);
        echo "published\n";
    } elseif ($argv[2] === 'accept') {
        stream_wrapper_register('pausedchunk', PausedChunkInput::class);
        $stream = fopen('pausedchunk://input', 'rb');
        $manager->accept($id, 0, 2, $stream, 20); fclose($stream);
        echo "accepted\n";
    } else {
        echo "starting\n"; fflush(STDOUT);
        if ($argv[2] === 'discard') { $manager->discard($id); echo "discarded\n"; }
        elseif ($argv[2] === 'cancel') {
            (new \SohoPHP\SoFinder\Http\Action\CancelChunkAction($manager, $guard))
                ->execute(new \SohoPHP\SoFinder\Value\RequestContext(headers: ['X-CSRF-TOKEN' => 'valid'], attributes: ['id' => $id]));
            echo "cancelled\n";
        }
        elseif ($argv[2] === 'status') echo json_encode($manager->status($id), JSON_THROW_ON_ERROR) . "\n";
        elseif ($argv[2] === 'cleanup') echo 'purged:' . $manager->cleanupExpired(true) . "\n";
    }
} catch (Throwable $error) {
    echo 'error:' . ($error instanceof \SohoPHP\SoFinder\Exception\SoFinderException ? $error->errorCode : get_class($error)) . "\n";
    exit(1);
}
