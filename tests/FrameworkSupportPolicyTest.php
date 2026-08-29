<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;

final class FrameworkSupportPolicyTest extends TestCase
{
    public function testPublishedPolicyKeepsLegacyAndMainLinesSeparated(): void
    {
        $policy = json_decode((string) file_get_contents(__DIR__ . '/../config/framework-support.json'), true, 32, JSON_THROW_ON_ERROR);

        self::assertSame(['8.2', '8.3', '8.4', '8.5'], $policy['stable']['symfony']['php']);
        self::assertSame(['6.4', '7.4'], $policy['stable']['symfony']['versions']);
        self::assertSame(['laravel', 'psr15'], $policy['promotionGate']['targets']);
        self::assertSame('1.0.0', $policy['promotionGate']['requiresMainVersion']);
        self::assertSame(30, $policy['promotionGate']['minimumStableDays']);
        self::assertTrue($policy['promotionGate']['requiresZeroOpenPriorityDefects']);
        self::assertNull($policy['promotionGate']['releasedMainVersion']);
        self::assertNull($policy['promotionGate']['releaseDate']);
        self::assertNull($policy['promotionGate']['openP0P1Defects']);
        self::assertSame([
            'symfonyMatrixCommit',
            'symfonyMatrixWorkflowUrl',
            'symfonyMatrixVerifiedAt',
            'observationStartedAt',
            'observationCompletedAt',
            'priorityDefectAuditUrl',
        ], array_keys($policy['promotionGate']['evidence']));
        self::assertSame([], array_filter($policy['promotionGate']['evidence'], static fn (mixed $value): bool => $value !== null));
        self::assertFalse($policy['promotionGate']['eligible']);
        self::assertSame(30, $policy['gated']['laravel']['minimumStableDays']);
        self::assertSame('1.0.0', $policy['gated']['laravel']['requiresMainVersion']);
        self::assertSame('sohophp/sofinder-legacy', $policy['legacy']['package']);
        self::assertSame('7.2.x', $policy['legacy']['branch']);
        self::assertSame('>=7.2.5 <8.0', $policy['legacy']['php']);
        self::assertSame('^5.4', $policy['legacy']['symfony']);
        self::assertTrue($policy['legacy']['repositoryMustBeSeparate']);
        self::assertSame('best-effort', $policy['legacy']['support']);
    }
}
