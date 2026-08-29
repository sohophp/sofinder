<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\ServerRequest;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Health\HealthManager;
use SohoPHP\SoFinder\Http\Action\CapabilityAction;
use SohoPHP\SoFinder\Http\Action\EntriesAction;
use SohoPHP\SoFinder\Http\Action\HealthAction;
use SohoPHP\SoFinder\Http\Action\LivenessAction;
use SohoPHP\SoFinder\Http\ApiController;
use SohoPHP\SoFinder\Http\CapabilityController;
use SohoPHP\SoFinder\Http\EndpointActionInterface;
use SohoPHP\SoFinder\Http\EndpointDispatcher;
use SohoPHP\SoFinder\Http\HealthController;
use SohoPHP\SoFinder\Http\LivenessController;
use SohoPHP\SoFinder\Http\PsrEndpointHandler;
use SohoPHP\SoFinder\Plugin\PluginRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\CapabilityCatalog;
use SohoPHP\SoFinder\Value\HealthCheckResult;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final class SharedEndpointActionTest extends TestCase
{
    public function testLivenessHasIdenticalSymfonyAndPsrPayloads(): void
    {
        $action = new LivenessAction();

        $this->assertParity($action, (new LivenessController($action))());
    }

    public function testCapabilitiesHaveIdenticalSymfonyAndPsrPayloads(): void
    {
        $action = new CapabilityAction(new CapabilityCatalog());

        $this->assertParity($action, (new CapabilityController($action))());
    }

    public function testUnavailableHealthHasIdenticalSymfonyAndPsrPayloads(): void
    {
        $check = new class implements HealthCheckInterface {
            public function check(): HealthCheckResult
            {
                return new HealthCheckResult('storage', 'down', 'Unavailable.');
            }
        };
        $action = new HealthAction(new HealthManager([$check]));

        $this->assertParity($action, (new HealthController($action))());
    }

    public function testEntryListingUsesPsrQueryContextWithSymfonyParity(): void
    {
        $directory = sys_get_temp_dir() . '/sofinder-entry-action-' . bin2hex(random_bytes(8));
        mkdir($directory, 0775, true);
        file_put_contents($directory . '/alpha.txt', 'alpha');
        file_put_contents($directory . '/beta.txt', 'beta');
        try {
            $resource = new ResourceType('Files', $directory, '/files', ['txt']);
            $authorization = new class implements AuthorizationInterface {
                public function isAuthenticated(): bool { return true; }
                public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
            };
            $files = new FileManager(
                new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($directory, '/files'))]),
                $authorization,
                new EventDispatcher(),
            );
            $action = new EntriesAction($files);
            $csrf = (new \ReflectionClass(CsrfGuard::class))->newInstanceWithoutConstructor();
            $controller = new ApiController($files, $csrf, new PluginRegistry([]), entriesAction: $action);
            $symfony = $controller->entries(Request::create('/api/entries?resource=Files&search=alpha&limit=10'));

            $factory = new Psr17Factory();
            $dispatcher = new EndpointDispatcher($factory, $factory, [new PsrEndpointHandler($action, $factory, $factory)]);
            $request = (new ServerRequest('GET', 'https://example.test/api/entries'))
                ->withQueryParams(['resource' => 'Files', 'search' => 'alpha', 'limit' => '10']);
            $psr = $dispatcher->dispatch($action->endpoint(), $request);

            self::assertSame($symfony->getStatusCode(), $psr->getStatusCode());
            self::assertSame(
                json_decode((string) $symfony->getContent(), true, 32, JSON_THROW_ON_ERROR),
                json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR),
            );
            self::assertSame('alpha.txt', json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR)['data']['entries'][0]['name']);
        } finally {
            @unlink($directory . '/alpha.txt');
            @unlink($directory . '/beta.txt');
            @rmdir($directory);
        }
    }

    private function assertParity(EndpointActionInterface $action, JsonResponse $symfony): void
    {
        $factory = new Psr17Factory();
        $dispatcher = new EndpointDispatcher($factory, $factory, [new PsrEndpointHandler($action, $factory, $factory)]);
        $psr = $dispatcher->dispatch($action->endpoint(), new ServerRequest('GET', '/'));

        self::assertSame($symfony->getStatusCode(), $psr->getStatusCode());
        self::assertSame(
            json_decode((string) $symfony->getContent(), true, 32, JSON_THROW_ON_ERROR),
            json_decode((string) $psr->getBody(), true, 32, JSON_THROW_ON_ERROR),
        );
        self::assertSame('application/json; charset=utf-8', $psr->getHeaderLine('Content-Type'));
        self::assertSame('no-store', $psr->getHeaderLine('Cache-Control'));
    }
}
