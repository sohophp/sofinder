<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Framework\CallbackCsrfTokenProvider;
use SohoPHP\SoFinder\Http\Action\ImageBatchAction;
use SohoPHP\SoFinder\Http\Action\ImageEditAction;
use SohoPHP\SoFinder\Http\ImageController;
use SohoPHP\SoFinder\Http\ImageMutationActions;
use SohoPHP\SoFinder\Http\ImageMutationService;
use SohoPHP\SoFinder\Http\MutationGuard;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;

final class SharedImageMutationActionTest extends TestCase
{
    /** @var list<string> */
    private array $directories = [];

    protected function setUp(): void
    {
        if (!extension_loaded('gd')) {
            self::markTestSkipped('GD is not installed.');
        }
    }

    protected function tearDown(): void
    {
        foreach (array_reverse($this->directories) as $directory) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::CHILD_FIRST,
            );
            foreach ($iterator as $entry) {
                $entry->isDir() ? @rmdir($entry->getPathname()) : @unlink($entry->getPathname());
            }
            @rmdir($directory);
        }
    }

    public function testSymfonyAndPsrImageEditAndBatchContractsMatch(): void
    {
        [$symfonyController, $symfonyActions] = $this->stack();
        [, $psrActions] = $this->stack();
        $factory = new Psr17Factory();

        $edit = [
            'resource' => 'Images',
            'path' => 'sample.png',
            'actions' => [['type' => 'resize', 'width' => 20, 'height' => 10]],
            'save' => ['mode' => 'overwrite'],
        ];
        $symfonyEdit = $symfonyController->edit($this->symfonyRequest('/api/images/edit', 'PATCH', $edit));
        $psrEdit = (new PsrEndpointHandler($psrActions->edit, $factory, $factory))->handle($this->psrRequest('/api/images/edit', 'PATCH', $edit));

        self::assertSame($symfonyEdit->getStatusCode(), $psrEdit->getStatusCode());
        self::assertSame($this->stablePayload((string) $symfonyEdit->getContent()), $this->stablePayload((string) $psrEdit->getBody()));
        $editResult = $this->stablePayload((string) $psrEdit->getBody())['data']['result'];
        self::assertSame(20, $editResult['width']);
        self::assertSame(10, $editResult['height']);

        $batch = [
            'resource' => 'Images',
            'paths' => ['sample.png'],
            'actions' => [['type' => 'rotate', 'degrees' => 180]],
            'save' => ['mode' => 'copy'],
        ];
        $symfonyBatch = $symfonyController->batch($this->symfonyRequest('/api/images/batch', 'PATCH', $batch));
        $psrBatch = (new PsrEndpointHandler($psrActions->batch, $factory, $factory))->handle($this->psrRequest('/api/images/batch', 'PATCH', $batch));

        self::assertSame($symfonyBatch->getStatusCode(), $psrBatch->getStatusCode());
        self::assertSame($this->stablePayload((string) $symfonyBatch->getContent()), $this->stablePayload((string) $psrBatch->getBody()));
        self::assertSame(1, $this->stablePayload((string) $psrBatch->getBody())['data']['succeeded']);
    }

    public function testLegacyEditFieldsExposeTheSameDeprecationHeader(): void
    {
        [$controller] = $this->stack();
        [, $actions] = $this->stack();
        $body = ['resource' => 'Images', 'path' => 'sample.png', 'rotation' => 0, 'width' => 20, 'height' => 10];
        $symfony = $controller->edit($this->symfonyRequest('/api/images/edit', 'PATCH', $body));
        $factory = new Psr17Factory();
        $psr = (new PsrEndpointHandler($actions->edit, $factory, $factory))->handle($this->psrRequest('/api/images/edit', 'PATCH', $body));

        self::assertSame('operation,rotation,width,height,x,y', $symfony->headers->get('X-SoFinder-Deprecated-Fields'));
        self::assertSame($symfony->headers->get('X-SoFinder-Deprecated-Fields'), $psr->getHeaderLine('X-SoFinder-Deprecated-Fields'));
    }

    /** @return array{ImageController,ImageMutationActions} */
    private function stack(): array
    {
        $directory = sys_get_temp_dir() . '/sofinder-shared-image-mutation-' . bin2hex(random_bytes(8));
        mkdir($directory, 0775, true);
        $this->directories[] = $directory;
        $image = imagecreatetruecolor(40, 20);
        imagepng($image, $directory . '/sample.png');
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $resource = new ResourceType('Images', $directory, '/images', allowedExtensions: ['png'], allowedMimeTypes: ['image/png']);
        $files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($directory, '/images'))]), $authorization, new EventDispatcher());
        $images = new ImageManager($files, new GdImageProcessor(), $directory . '/cache');
        $csrf = new CallbackCsrfTokenProvider(static fn (): string => 'valid', static fn ($context, string $token): bool => $token === 'valid');
        $guard = new MutationGuard($authorization, $csrf);
        $operations = new ImageMutationService();
        $actions = new ImageMutationActions(
            new ImageEditAction($images, $guard, new FeaturePolicy(), $operations),
            new ImageBatchAction($images, $guard, new FeaturePolicy(), $operations),
        );
        $unusedCsrf = (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor();

        return [new ImageController($images, $unusedCsrf, mutationActions: $actions), $actions];
    }

    /** @param array<string,mixed> $body */
    private function symfonyRequest(string $uri, string $method, array $body): Request
    {
        return Request::create($uri, $method, server: ['CONTENT_TYPE' => 'application/json', 'HTTP_X_CSRF_TOKEN' => 'valid'], content: json_encode($body, JSON_THROW_ON_ERROR));
    }

    /** @param array<string,mixed> $body */
    private function psrRequest(string $uri, string $method, array $body): ServerRequest
    {
        return new ServerRequest($method, $uri, ['Content-Type' => 'application/json', 'X-CSRF-TOKEN' => 'valid'], json_encode($body, JSON_THROW_ON_ERROR));
    }

    /** @return array<string,mixed> */
    private function stablePayload(string $json): array
    {
        $payload = json_decode($json, true, 64, JSON_THROW_ON_ERROR);
        $removeModifiedAt = static function (array &$value) use (&$removeModifiedAt): void {
            unset($value['modifiedAt']);
            foreach ($value as &$child) {
                if (is_array($child)) {
                    $removeModifiedAt($child);
                }
            }
        };
        $removeModifiedAt($payload);

        return $payload;
    }
}
