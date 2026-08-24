<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use SohoPHP\SoFinder\Event\OperationEvent;
use SohoPHP\SoFinder\Contract\EntryUrlContextProviderInterface;
use SohoPHP\SoFinder\Symfony\OperationAuditSubscriber;
use SohoPHP\SoFinder\Symfony\SymfonyAuthorization;
use SohoPHP\SoFinder\Symfony\SymfonyEntryUrlGenerator;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Routing\RouterInterface;

final class SymfonyIntegrationServicesTest extends TestCase
{
    public function testResourceAndOperationRolesAreEnforced(): void
    {
        $checker = $this->createMock(AuthorizationCheckerInterface::class);
        $checker->method('isGranted')->willReturnCallback(
            static fn (mixed $attribute): bool => in_array($attribute, ['IS_AUTHENTICATED_FULLY', 'ROLE_EDITOR'], true),
        );
        $authorization = new SymfonyAuthorization($checker);
        $resource = new ResourceType(
            'Files',
            '/tmp/files',
            '/files',
            requiredRoles: ['ROLE_EDITOR'],
            operationRoles: ['delete' => ['ROLE_FILE_ADMIN']],
        );

        self::assertTrue($authorization->isGranted('list', $resource, ''));
        self::assertFalse($authorization->isGranted('delete', $resource, 'one.txt'));
    }

    public function testCompletedOperationIsWrittenToStructuredLog(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects(self::once())->method('info')->with(
            'SoFinder operation completed.',
            self::callback(static fn (array $context): bool => $context['operation'] === 'upload'
                && $context['resource'] === 'Files'
                && $context['path'] === 'one.txt'
                && $context['request_ip'] === '127.0.0.1'),
        );
        $requests = new RequestStack();
        $requests->push(Request::create('https://example.test/sofinder', server: ['REMOTE_ADDR' => '127.0.0.1']));
        $subscriber = new OperationAuditSubscriber($logger, $requests);

        $subscriber->onOperation(new OperationEvent(
            'after.upload',
            new ResourceType('Files', '/tmp/files', '/files'),
            'one.txt',
            ['size' => 10, 'entry' => new \stdClass()],
        ));
    }

    public function testMostSpecificPathAclIsInheritedAndRoleAware(): void
    {
        $checker = $this->createMock(AuthorizationCheckerInterface::class);
        $checker->method('isGranted')->willReturnCallback(
            static fn (mixed $attribute): bool => in_array($attribute, ['IS_AUTHENTICATED_FULLY', 'ROLE_EDITOR'], true),
        );
        $authorization = new SymfonyAuthorization($checker);
        $resource = new ResourceType(
            'Files',
            '/tmp/files',
            '/files',
            pathAcl: [
                ['path' => 'private', 'operations' => ['*'], 'roles' => ['ROLE_ADMIN'], 'allow' => true],
                ['path' => 'private/shared', 'operations' => ['read', 'list'], 'roles' => ['ROLE_EDITOR'], 'allow' => true],
                ['path' => 'private/shared/locked', 'operations' => ['delete'], 'roles' => [], 'allow' => false],
            ],
        );

        self::assertFalse($authorization->isGranted('read', $resource, 'private/secret.txt'));
        self::assertTrue($authorization->isGranted('read', $resource, 'private/shared/file.txt'));
        self::assertFalse($authorization->isGranted('delete', $resource, 'private/shared/locked/file.txt'));
    }

    public function testProxyResourcesReceiveAuthenticatedContentUrls(): void
    {
        $router = $this->createMock(RouterInterface::class);
        $router->expects(self::once())->method('generate')->with('sofinder_api_content', [
            'resource' => 'Private',
            'path' => 'photo.jpg',
            'disposition' => 'inline',
        ])->willReturn('/sofinder/api/content?resource=Private&amp;path=photo.jpg');
        $generator = new SymfonyEntryUrlGenerator($router);
        $resource = new ResourceType('Private', '/tmp/private', '', deliveryMode: 'proxy');

        self::assertStringStartsWith('/sofinder/api/content', (string) $generator->generate(
            $resource,
            new Entry('photo.jpg', 'photo.jpg', false, 10, 1, 'image/jpeg'),
        ));
    }

    public function testResourceEntryUrlsCanUseAHostRouteAndCustomContext(): void
    {
        $router = $this->createMock(RouterInterface::class);
        $router->expects(self::once())->method('generate')->with(
            'file.download',
            ['id' => 42, 'name' => 'report.pdf', 'source' => 'S3Files/archive/report.pdf'],
            RouterInterface::ABSOLUTE_URL,
        )->willReturn('https://example.test/file/download/42-report.pdf');
        $provider = new class implements EntryUrlContextProviderInterface {
            public function context(ResourceType $resource, Entry $entry): array
            {
                return ['id' => 42];
            }
        };
        $generator = new SymfonyEntryUrlGenerator($router, [$provider]);
        $resource = new ResourceType(
            'S3Files',
            'archive',
            '',
            deliveryMode: 'proxy',
            entryUrlRoute: 'file.download',
            entryUrlParameters: [
                'id' => '{id}',
                'name' => '{name}',
                'source' => '{resource}/{path}',
            ],
            entryUrlAbsolute: true,
        );

        self::assertSame('https://example.test/file/download/42-report.pdf', $generator->generate(
            $resource,
            new Entry('archive/report.pdf', 'report.pdf', false, 10, 1, 'application/pdf'),
        ));
    }
}
