<?php

declare(strict_types=1);

namespace SoFinderExample;

use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Psr15\HostServices;
use SohoPHP\SoFinder\Psr15\LocalApplicationFactory;
use SohoPHP\SoFinder\Psr15\NativeSessionCsrfTokenProvider;
use SohoPHP\SoFinder\Psr15\SoFinderApplication;
use SohoPHP\SoFinder\Value\ResourceType;

final class RuntimeFactory
{
    public static function create(
        ResponseFactoryInterface $responses,
        StreamFactoryInterface $streams,
        string $prefix = '/sofinder',
    ): SoFinderApplication {
        // Deliberately deny protected operations until the host replaces this
        // with its authenticated authorization service.
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return false; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return false; }
        };
        $actor = new class implements ActorProviderInterface {
            public function actorId(): string { return 'anonymous-example'; }
        };
        $events = new class implements EventDispatcherInterface {
            public function dispatch(object $event): object { return $event; }
        };
        $services = new HostServices(
            $authorization,
            $actor,
            new NativeSessionCsrfTokenProvider(),
            $events,
        );

        return (new LocalApplicationFactory(
            $responses,
            $streams,
            $services,
            [],
            dirname(__DIR__) . '/var/state',
            dirname(__DIR__) . '/var/files',
            dirname(__DIR__, 3),
            $prefix,
        ))->create();
    }
}
