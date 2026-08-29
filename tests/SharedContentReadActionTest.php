<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Http\Action\ChecksumAction;
use SohoPHP\SoFinder\Http\Action\TextPreviewAction;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\Http\ContentReadActions;
use SohoPHP\SoFinder\Http\EndpointActionInterface;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;

final class SharedContentReadActionTest extends TestCase
{
    private string $directory;
    private FileManager $files;
    private ContentReadActions $actions;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-shared-content-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/sample.txt', '0123456789');
        $resource = new ResourceType('Files', $this->directory, '/files', ['txt']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $this->files = new FileManager(
            new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]),
            $authorization,
            new EventDispatcher(),
        );
        $features = new FeaturePolicy();
        $this->actions = new ContentReadActions(new ChecksumAction($this->files, $features), new TextPreviewAction($this->files, $features));
    }

    protected function tearDown(): void
    {
        @unlink($this->directory . '/sample.txt');
        @rmdir($this->directory);
    }

    /** @return iterable<string, array{string, string}> */
    public static function endpointProvider(): iterable
    {
        yield 'checksum' => ['checksum', '/api/checksum?resource=Files&path=sample.txt'];
        yield 'text preview' => ['textPreview', '/api/preview/text?resource=Files&path=sample.txt'];
    }

    #[DataProvider('endpointProvider')]
    public function testSymfonyAndPsrReadEndpointsHaveIdenticalContracts(string $property, string $uri): void
    {
        $controller = new ContentController($this->files, new ImageFormatRegistry(), new FeaturePolicy(), $this->actions);
        $symfonyResponse = $property === 'checksum'
            ? $controller->checksum(Request::create($uri))
            : $controller->textPreview(Request::create($uri));
        $action = $this->actions->{$property};
        self::assertInstanceOf(EndpointActionInterface::class, $action);

        $factory = new Psr17Factory();
        $psrResponse = (new PsrEndpointHandler($action, $factory, $factory))->handle(new ServerRequest('GET', $uri));

        self::assertSame($symfonyResponse->getStatusCode(), $psrResponse->getStatusCode());
        self::assertSame(
            json_decode((string) $symfonyResponse->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psrResponse->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
    }

    public function testFeaturePolicyStillFailsClosedInSharedAction(): void
    {
        $action = new TextPreviewAction($this->files, new FeaturePolicy(['text_preview' => false]));

        $this->expectException(\SohoPHP\SoFinder\Exception\SoFinderException::class);
        $this->expectExceptionMessage('disabled');
        $action->execute(new \SohoPHP\SoFinder\Value\RequestContext(query: ['resource' => 'Files', 'path' => 'sample.txt']));
    }
}
