<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Http\Action\DocumentPreviewAction;
use SohoPHP\SoFinder\Http\Action\ImageThumbnailAction;
use SohoPHP\SoFinder\Http\Action\ImageVariantAction;
use SohoPHP\SoFinder\Http\Action\SignedContentAction;
use SohoPHP\SoFinder\Http\CachedFileResponseBuilder;
use SohoPHP\SoFinder\Http\ContentController;
use SohoPHP\SoFinder\Http\DocumentPreviewController;
use SohoPHP\SoFinder\Http\EntryStreamResponseBuilder;
use SohoPHP\SoFinder\Http\ImageController;
use SohoPHP\SoFinder\Http\ImageStreamActions;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Http\SignedUrlController;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Security\SignedUrlManager;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class SharedDerivedStreamActionTest extends TestCase
{
    /** @var list<string> */ private array $directories = [];

    protected function tearDown(): void
    {
        foreach (array_reverse($this->directories) as $directory) {
            if (!is_dir($directory)) continue;
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
            foreach ($iterator as $entry) $entry->isDir() ? @rmdir($entry->getPathname()) : @unlink($entry->getPathname());
            @rmdir($directory);
        }
    }

    public function testSymfonyAndPsrImageStreamsMatch(): void
    {
        if (!extension_loaded('gd')) self::markTestSkipped('GD is not installed.');
        $directory = $this->directory('images'); $image = imagecreatetruecolor(100, 50); imagepng($image, $directory . '/source.png');
        [$files, $authorization] = $this->files(new ResourceType('Images', $directory, '/images', allowedExtensions: ['png'], allowedMimeTypes: ['image/png']));
        $images = new ImageManager($files, new GdImageProcessor(), $directory . '/cache', variantsEnabled: true, variantWidths: [50], variantFormats: ['original']);
        $builder = new CachedFileResponseBuilder(); $actions = new ImageStreamActions(new ImageThumbnailAction($images, $builder), new ImageVariantAction($images, $builder));
        $tokens = $this->createMock(CsrfTokenManagerInterface::class); $controller = new ImageController($images, new CsrfGuard($tokens, $authorization), streamActions: $actions);
        $factory = new Psr17Factory();
        foreach ([['thumbnail', '/api/images/thumbnail?resource=Images&path=source.png&width=40&height=40'], ['variant', '/api/images/variant?resource=Images&path=source.png&width=50&format=original']] as [$method, $uri]) {
            $symfony = $method === 'thumbnail' ? $controller->thumbnail(Request::create($uri)) : $controller->variant(Request::create($uri)); ob_start(); $symfony->sendContent(); $body = ob_get_clean();
            $action = $method === 'thumbnail' ? $actions->thumbnail : $actions->variant; $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle(new ServerRequest('GET', $uri));
            self::assertSame($symfony->getStatusCode(), $psr->getStatusCode()); self::assertSame($body, (string) $psr->getBody()); self::assertSame($symfony->headers->get('Content-Type'), $psr->getHeaderLine('Content-Type'));
        }
    }

    public function testSymfonyAndPsrDocumentPreviewStreamsMatch(): void
    {
        $directory = $this->directory('documents'); $cache = $this->directory('document-cache'); file_put_contents($directory . '/manual.pdf', "%PDF-1.4\npreview\n");
        [$files] = $this->files(new ResourceType('Files', $directory, '/files', ['pdf'])); $previews = new DocumentPreviewManager($files, $cache); $action = new DocumentPreviewAction($previews, new FeaturePolicy()); $controller = new DocumentPreviewController($previews, action: $action);
        $uri = '/api/preview/document?resource=Files&path=manual.pdf'; $symfony = $controller(Request::create($uri)); ob_start(); $symfony->sendContent(); $body = ob_get_clean();
        $factory = new Psr17Factory(); $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle(new ServerRequest('GET', $uri));
        self::assertSame('application/pdf', $psr->getHeaderLine('Content-Type')); self::assertSame($body, (string) $psr->getBody()); self::assertStringStartsWith('%PDF-', (string) $psr->getBody());
    }

    public function testSignedContentPreservesRangeAndPublicCacheContract(): void
    {
        $directory = $this->directory('signed-content'); file_put_contents($directory . '/private.txt', '0123456789'); $resource = new ResourceType('Private', $directory, '', ['txt'], deliveryMode: 'proxy');
        [$files, , $registry] = $this->files($resource); $manager = new SignedUrlManager($files, $registry, new PathGuard(), true, str_repeat('s', 32), 60, 300); $issued = $manager->issue('Private', 'private.txt', 60); $action = new SignedContentAction($manager, new EntryStreamResponseBuilder());
        $router = $this->createMock(RouterInterface::class); $controller = new SignedUrlController($manager, new ContentController($files), $router, contentAction: $action); $request = Request::create('/signed/' . $issued['token'], server: ['HTTP_RANGE' => 'bytes=2-5']); $symfony = $controller->consume($request, $issued['token']); ob_start(); $symfony->sendContent(); $body = ob_get_clean();
        $factory = new Psr17Factory(); $psrRequest = (new ServerRequest('GET', '/signed/' . $issued['token']))->withAttribute('token', $issued['token'])->withHeader('Range', 'bytes=2-5'); $psr = (new PsrEndpointHandler($action, $factory, $factory))->handle($psrRequest);
        self::assertSame(206, $psr->getStatusCode()); self::assertSame('2345', $body); self::assertSame($body, (string) $psr->getBody()); self::assertStringStartsWith('public, max-age=', $psr->getHeaderLine('Cache-Control')); self::assertSame('no-referrer', $psr->getHeaderLine('Referrer-Policy'));
    }

    /** @return array{FileManager,AuthorizationInterface,ResourceRegistry} */
    private function files(ResourceType $resource): array
    {
        $authorization = new class implements AuthorizationInterface { public function isAuthenticated(): bool { return true; } public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; } };
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($resource->root, ''))]); return [new FileManager($registry, $authorization, new EventDispatcher()), $authorization, $registry];
    }
    private function directory(string $name): string { $directory = sys_get_temp_dir() . '/sofinder-shared-' . $name . '-' . bin2hex(random_bytes(8)); mkdir($directory, 0775, true); $this->directories[] = $directory; return $directory; }
}
