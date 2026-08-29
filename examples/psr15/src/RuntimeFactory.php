<?php

declare(strict_types=1);

namespace SoFinderExample;

use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\RoleAuthorizationInterface;
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
        // Deliberately deny protected operations unless the executable contract
        // fixture explicitly opts into its isolated test identity.
        $authorized = getenv('SOFINDER_EXAMPLE_AUTHORIZED') === '1';
        $authorization = new class($authorized) implements AuthorizationInterface {
            public function __construct(private readonly bool $authorized) {}
            public function isAuthenticated(): bool { return $this->authorized; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return $this->authorized; }
        };
        $actor = new class implements ActorProviderInterface {
            public function actorId(): string { return 'anonymous-example'; }
        };
        $events = new class implements EventDispatcherInterface {
            public function dispatch(object $event): object { return $event; }
        };
        $roles = new class($authorized) implements RoleAuthorizationInterface {
            public function __construct(private readonly bool $authorized) {}
            public function isGranted(string $role): bool { return $this->authorized; }
        };
        $csrf = $authorized
            ? new class implements CsrfTokenProviderInterface {
                public function token(\SohoPHP\SoFinder\Value\RequestContext $context): string { return 'sofinder-host-contract-token'; }
                public function isValid(\SohoPHP\SoFinder\Value\RequestContext $context, string $token): bool { return hash_equals($this->token($context), $token); }
            }
            : new NativeSessionCsrfTokenProvider();
        $services = new HostServices(
            $authorization,
            $actor,
            $csrf,
            $events,
            $roles,
        );

        return (new LocalApplicationFactory(
            $responses,
            $streams,
            $services,
            [
                // Match the Symfony example for executable cross-host
                // contracts; framework-neutral defaults remain disabled.
                'signed_urls' => ['enabled' => true],
                'asset_catalog' => ['enabled' => true],
                'image_variants' => ['enabled' => true],
                'document_preview' => [
                    'pdf' => true,
                    'office' => true,
                    'office_binary' => '/usr/bin/libreoffice',
                ],
                'resources' => [
                    'Files' => ['delivery_mode' => 'public'],
                ],
            ],
            dirname(__DIR__) . '/var/state',
            dirname(__DIR__) . '/var/files',
            dirname(__DIR__, 3),
            $prefix,
        ))->create();
    }
}
