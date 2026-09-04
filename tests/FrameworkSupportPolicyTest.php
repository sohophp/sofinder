<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;

final class FrameworkSupportPolicyTest extends TestCase
{
    public function testPublishedPolicyKeepsLegacyAndMainLinesSeparated(): void
    {
        $policy = json_decode((string) file_get_contents(__DIR__ . '/../config/framework-support.json'), true, 32, JSON_THROW_ON_ERROR);

        self::assertSame(['6.4', '7.4'], $policy['stable']['symfony']['versions']);
        self::assertSame([
            '6.4' => ['8.1', '8.2', '8.3', '8.4', '8.5'],
            '7.4' => ['8.2', '8.3', '8.4', '8.5'],
        ], $policy['stable']['symfony']['phpByVersion']);
        self::assertSame(['laravel', 'psr15'], $policy['promotionGate']['targets']);
        self::assertSame('1.0.0', $policy['promotionGate']['requiresMainVersion']);
        self::assertSame(30, $policy['promotionGate']['minimumStableDays']);
        self::assertTrue($policy['promotionGate']['requiresZeroOpenPriorityDefects']);
        self::assertSame([
            'enabled' => true,
            'approvedAt' => '2026-08-29',
            'approvedBy' => 'project-maintainer',
            'reason' => 'The maintainer approved immediate bridge promotion after the complete compatibility, security, split-publication and clean-consumer matrices passed.',
        ], $policy['promotionGate']['observationWaiver']);
        self::assertSame('1.1.0', $policy['promotionGate']['releasedMainVersion']);
        self::assertSame('2026-08-29', $policy['promotionGate']['releaseDate']);
        self::assertSame(0, $policy['promotionGate']['openP0P1Defects']);
        self::assertSame([
            'symfonyMatrixCommit',
            'symfonyMatrixWorkflowUrl',
            'symfonyMatrixVerifiedAt',
            'observationStartedAt',
            'observationCompletedAt',
            'priorityDefectAuditUrl',
        ], array_keys($policy['promotionGate']['evidence']));
        self::assertSame('35a27b9db8900930b097abc48ad0e59d4da8b579', $policy['promotionGate']['evidence']['symfonyMatrixCommit']);
        self::assertSame('https://github.com/sohophp/sofinder/actions/runs/33264304546', $policy['promotionGate']['evidence']['symfonyMatrixWorkflowUrl']);
        self::assertSame('2026-08-29', $policy['promotionGate']['evidence']['symfonyMatrixVerifiedAt']);
        self::assertSame('2026-08-29', $policy['promotionGate']['evidence']['observationStartedAt']);
        self::assertNull($policy['promotionGate']['evidence']['observationCompletedAt']);
        self::assertSame('https://github.com/sohophp/sofinder/actions/runs/33263613569', $policy['promotionGate']['evidence']['priorityDefectAuditUrl']);
        self::assertTrue($policy['promotionGate']['eligible']);
        self::assertArrayNotHasKey('experimental', $policy);
        self::assertArrayNotHasKey('gated', $policy);
        self::assertSame('sohophp/sofinder-legacy', $policy['legacy']['package']);
        self::assertSame('https://github.com/sohophp/sofinder-legacy', $policy['legacy']['repository']);
        self::assertSame('7.2.x', $policy['legacy']['branch']);
        self::assertSame('>=7.2.5 <8.0', $policy['legacy']['php']);
        self::assertSame('^5.4', $policy['legacy']['symfony']);
        self::assertTrue($policy['legacy']['repositoryMustBeSeparate']);
        self::assertSame('best-effort', $policy['legacy']['support']);
        self::assertSame('paused-unreleased', $policy['legacy']['status']);
        self::assertSame([
            '12' => ['8.2', '8.3', '8.4', '8.5'],
            '13' => ['8.3', '8.4', '8.5'],
        ], $policy['stable']['laravel']['phpByVersion']);
        self::assertSame(['slim-4', 'mezzio-3', 'plain-php'], $policy['stable']['psr15']['hosts']);
        self::assertSame(['8.1', '8.2', '8.3', '8.4', '8.5'], $policy['stable']['psr15']['php']);
        self::assertSame(['8.1', '8.2', '8.3', '8.4', '8.5'], $policy['stable']['headless-core']['php']);
    }

    public function testPublishedPackageCheckSupportsAnExactStableVersion(): void
    {
        $script = (string) file_get_contents(__DIR__ . '/../scripts/check-published-package-install.sh');

        self::assertStringContainsString('config/framework-support.json', $script);
        self::assertStringContainsString('releasedMainVersion', $script);
        self::assertStringNotContainsString('SOFINDER_PUBLISHED_VERSION:-1.', $script);
    }

    public function testObservationChecksTheLatestSynchronizedStableRelease(): void
    {
        $workflow = (string) file_get_contents(__DIR__ . '/../.github/workflows/symfony-observation.yml');
        $tagCheck = (string) file_get_contents(__DIR__ . '/../scripts/check-synchronized-package-tags.sh');

        self::assertStringContainsString('name: Stable release observation', $workflow);
        self::assertStringContainsString('releases/latest', $workflow);
        self::assertStringContainsString('check-synchronized-package-tags.sh', $workflow);
        self::assertStringNotContainsString('SOFINDER_PUBLISHED_VERSION: 1.', $workflow);
        foreach (['sofinder', 'sofinder-core', 'sofinder-http', 'sofinder-symfony', 'sofinder-s3', 'sofinder-psr15', 'sofinder-laravel'] as $repository) {
            self::assertStringContainsString($repository, $tagCheck);
        }
    }

    public function testPrivateFrontendVersionCannotDriftWithComposerReleases(): void
    {
        $manifest = json_decode((string) file_get_contents(__DIR__ . '/../frontend/package.json'), true, 16, JSON_THROW_ON_ERROR);

        self::assertTrue($manifest['private']);
        self::assertSame('0.0.0-private', $manifest['version']);
    }

    public function testLaravelCiCoversEveryPublishedCompatibilityPair(): void
    {
        $policy = json_decode((string) file_get_contents(__DIR__ . '/../config/framework-support.json'), true, 32, JSON_THROW_ON_ERROR);
        $expected = [];
        foreach ($policy['stable']['laravel']['phpByVersion'] as $laravel => $versions) {
            foreach ($versions as $php) {
                $expected[] = $php . '|laravel-' . $laravel;
            }
        }
        sort($expected);

        $root = __DIR__ . '/../.github/workflows/ci.yml';
        self::assertSame($expected, $this->workflowMatrixPairs($root, 'laravel-bridge', 'laravel'));
        self::assertSame($expected, $this->workflowMatrixPairs($root, 'laravel-example', 'composer'));
        self::assertSame($expected, $this->workflowMatrixPairs(
            __DIR__ . '/../packages/sofinder-laravel/.github/workflows/ci.yml',
            'dependencies',
            'laravel',
        ));
    }

    public function testLaravelPackageCiExercisesBothSymfonyInteropLines(): void
    {
        self::assertSame([
            '8.2|laravel-12|symfony-7',
            '8.3|laravel-12|symfony-7',
            '8.3|laravel-13|symfony-7',
            '8.4|laravel-12|symfony-7',
            '8.4|laravel-13|symfony-8',
            '8.5|laravel-12|symfony-7',
            '8.5|laravel-13|symfony-8',
        ], $this->laravelPackageInteropPairs());
    }

    /**
     * @return list<string>
     */
    private function workflowMatrixPairs(string $path, string $job, string $versionField): array
    {
        $workflow = (string) file_get_contents($path);
        self::assertMatchesRegularExpression('/^  ' . preg_quote($job, '/') . ':$/m', $workflow);
        preg_match('/^  ' . preg_quote($job, '/') . ":\n(?<job>(?:(?!^  [a-zA-Z0-9_-]+:\n).)*)/ms", $workflow, $jobMatch);
        $field = $versionField === 'composer'
            ? 'composer: composer-(?<laravel>[0-9]+)\\.json'
            : "laravel: '(?<laravel>[0-9]+)'";
        preg_match_all("/^          - php: '(?<php>[^']+)'\\n            $field$/m", (string) ($jobMatch['job'] ?? ''), $matches, PREG_SET_ORDER);
        $pairs = array_map(
            static fn (array $match): string => $match['php'] . '|laravel-' . $match['laravel'],
            $matches,
        );
        sort($pairs);

        return $pairs;
    }

    /** @return list<string> */
    private function laravelPackageInteropPairs(): array
    {
        $workflow = (string) file_get_contents(__DIR__ . '/../packages/sofinder-laravel/.github/workflows/ci.yml');
        preg_match_all(
            "/^          - php: '(?<php>[^']+)'\n            laravel: '(?<laravel>[0-9]+)'\n            symfony: '(?<symfony>[0-9]+)'$/m",
            $workflow,
            $matches,
            PREG_SET_ORDER,
        );
        $pairs = array_map(
            static fn (array $match): string => sprintf(
                '%s|laravel-%s|symfony-%s',
                $match['php'],
                $match['laravel'],
                $match['symfony'],
            ),
            $matches,
        );
        sort($pairs);

        return $pairs;
    }
}
