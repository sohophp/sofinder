<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Event\AssetOperationEvent;
use SohoPHP\SoFinder\Value\ResourceType;
use SohoPHP\SoFinder\Value\WorkspaceContext;

final class AssetOperationEventTest extends TestCase
{
    public function testEventHasStableSafeSerializableShape(): void
    {
        $event = new AssetOperationEvent(
            str_repeat('a', 32),
            'metadata.update',
            'after',
            new WorkspaceContext('tenant-a', 'actor-secret', ['Images']),
            new ResourceType('Images', '/private/storage', '/images'),
            'photo.jpg',
            null,
            '550e8400-e29b-41d4-a716-446655440000',
            ['metadataVersion' => 2],
        );

        $serialized = $event->jsonSerialize();
        self::assertSame('1.0', $serialized['schemaVersion']);
        self::assertSame('tenant-a', $serialized['workspace']);
        self::assertSame('Images', $serialized['resource']);
        self::assertArrayNotHasKey('actor', $serialized);
        self::assertStringNotContainsString('/private/storage', json_encode($serialized, JSON_THROW_ON_ERROR));
    }

    public function testUnknownOperationAndNestedAttributesAreRejected(): void
    {
        foreach ([['unknown', []], ['upload', ['entry' => ['path' => 'secret']]]] as [$operation, $attributes]) {
            try {
                new AssetOperationEvent(str_repeat('a', 32), $operation, 'before', new WorkspaceContext('main', 'actor'), new ResourceType('Files', '/files', '/files'), 'a.txt', null, null, $attributes);
                self::fail('An unsafe event must be rejected.');
            } catch (\InvalidArgumentException) {
                self::addToAssertionCount(1);
            }
        }
    }
}
