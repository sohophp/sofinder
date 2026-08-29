<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class PackageReleaseMetadataTest extends TestCase
{
    /** @return iterable<string, array{string,string}> */
    public static function packageProvider(): iterable
    {
        yield 'Core' => ['packages/sofinder-core', 'sohophp/sofinder-core'];
        yield 'HTTP' => ['packages/sofinder-http', 'sohophp/sofinder-http'];
        yield 'PSR-15' => ['packages/sofinder-psr15', 'sohophp/sofinder-psr15'];
        yield 'Laravel' => ['packages/sofinder-laravel', 'sohophp/sofinder-laravel'];
        yield 'Symfony' => ['packages/sofinder-symfony', 'sohophp/sofinder-symfony'];
        yield 'S3' => ['packages/sofinder-s3', 'sohophp/sofinder-s3'];
    }

    #[DataProvider('packageProvider')]
    public function testPublishablePackageContainsIndependentReleaseMetadata(string $directory, string $name): void
    {
        $root = dirname(__DIR__);
        $package = $root . '/' . $directory;
        $composer = json_decode((string) file_get_contents($package . '/composer.json'), true, 32, JSON_THROW_ON_ERROR);

        self::assertSame($name, $composer['name']);
        self::assertSame('MIT', $composer['license']);
        self::assertSame('1.x-dev', $composer['extra']['branch-alias']['dev-main']);
        self::assertNotEmpty($composer['support']['issues']);
        self::assertNotEmpty($composer['support']['source']);
        self::assertFileExists($package . '/LICENSE');
        self::assertFileExists($package . '/README.md');
        self::assertFileExists($package . '/.php-version');
        self::assertFileExists($package . '/.github/workflows/ci.yml');
        self::assertTrue(is_executable($package . '/scripts/php-bin.sh'));
        self::assertTrue(is_executable($package . '/scripts/composer.sh'));
        self::assertGreaterThan(100, filesize($package . '/LICENSE'));
        self::assertGreaterThan(100, filesize($package . '/README.md'));

        $workflow = (string) file_get_contents($package . '/.github/workflows/ci.yml');
        self::assertStringContainsString('./scripts/composer.sh validate --strict', $workflow);
        self::assertStringContainsString('./scripts/composer.sh audit', $workflow);
        self::assertDoesNotMatchRegularExpression('/run:\s+(?:php|composer|vendor\/bin\/phpunit)(?:\s|$)/m', $workflow);
    }

    public function testSynchronizedPackagesUseTheReleaseVersionForInternalDependencies(): void
    {
        $root = dirname(__DIR__);
        $requirements = [
            'composer.json' => ['sohophp/sofinder-symfony'],
            'packages/sofinder-http/composer.json' => ['sohophp/sofinder-core'],
            'packages/sofinder-psr15/composer.json' => ['sohophp/sofinder-http'],
            'packages/sofinder-laravel/composer.json' => ['sohophp/sofinder-http'],
            'packages/sofinder-symfony/composer.json' => ['sohophp/sofinder-core', 'sohophp/sofinder-http'],
            'packages/sofinder-s3/composer.json' => ['sohophp/sofinder-core'],
        ];

        foreach ($requirements as $manifest => $dependencies) {
            $composer = json_decode((string) file_get_contents($root . '/' . $manifest), true, 32, JSON_THROW_ON_ERROR);
            foreach ($dependencies as $dependency) {
                self::assertSame('self.version', $composer['require'][$dependency] ?? null, "$manifest must synchronize $dependency.");
            }
        }
    }

    public function testFrameworkBridgesDeclareTheirDirectInteropDependencies(): void
    {
        $root = dirname(__DIR__);
        $requirements = [
            'packages/sofinder-psr15/composer.json' => [
                'psr/event-dispatcher',
                'psr/http-factory',
                'psr/http-message',
                'psr/http-server-handler',
                'psr/http-server-middleware',
            ],
            'packages/sofinder-laravel/composer.json' => [
                'illuminate/bus',
                'illuminate/cache',
                'psr/event-dispatcher',
                'psr/http-factory',
                'psr/log',
                'symfony/http-foundation',
                'symfony/psr-http-message-bridge',
            ],
        ];

        foreach ($requirements as $manifest => $dependencies) {
            $composer = json_decode((string) file_get_contents($root . '/' . $manifest), true, 32, JSON_THROW_ON_ERROR);
            foreach ($dependencies as $dependency) {
                self::assertArrayHasKey($dependency, $composer['require'], "$manifest must directly require $dependency.");
            }
        }

        $laravel = json_decode((string) file_get_contents($root . '/packages/sofinder-laravel/composer.json'), true, 32, JSON_THROW_ON_ERROR);
        self::assertStringContainsString('^8.0', $laravel['require']['symfony/http-foundation']);
        self::assertStringContainsString('^8.0', $laravel['require']['symfony/psr-http-message-bridge']);
    }

    public function testPhp8PackagesRejectLegacyProductLineCoInstallation(): void
    {
        $root = dirname(__DIR__);
        $manifests = [
            'composer.json',
            'packages/sofinder-core/composer.json',
            'packages/sofinder-http/composer.json',
            'packages/sofinder-psr15/composer.json',
            'packages/sofinder-laravel/composer.json',
            'packages/sofinder-symfony/composer.json',
            'packages/sofinder-s3/composer.json',
        ];

        foreach ($manifests as $manifest) {
            $composer = json_decode((string) file_get_contents($root . '/' . $manifest), true, 32, JSON_THROW_ON_ERROR);
            self::assertSame('*', $composer['conflict']['sohophp/sofinder-legacy'] ?? null, "$manifest must reject the PHP 7 legacy product line.");
        }
    }

    public function testCompatibilityPackageIsASourceFreeMetaPackage(): void
    {
        $composer = json_decode((string) file_get_contents(dirname(__DIR__) . '/composer.json'), true, 32, JSON_THROW_ON_ERROR);

        self::assertSame('metapackage', $composer['type']);
        self::assertArrayNotHasKey('autoload', $composer);
        self::assertDirectoryDoesNotExist(dirname(__DIR__) . '/src');
    }

    public function testSymfonyReleaseIncludesCompiledAssetsAndNotices(): void
    {
        $package = dirname(__DIR__) . '/packages/sofinder-symfony';
        self::assertFileExists($package . '/dist/manifest.json');
        self::assertFileExists($package . '/THIRD_PARTY_NOTICES.md');
        self::assertGreaterThan(100, filesize($package . '/THIRD_PARTY_NOTICES.md'));
    }

    public function testS3RuntimePackageIsFrameworkNeutral(): void
    {
        $root = dirname(__DIR__);
        $s3Composer = json_decode((string) file_get_contents($root . '/packages/sofinder-s3/composer.json'), true, 32, JSON_THROW_ON_ERROR);
        $symfonyComposer = json_decode((string) file_get_contents($root . '/packages/sofinder-symfony/composer.json'), true, 32, JSON_THROW_ON_ERROR);

        self::assertSame('library', $s3Composer['type']);
        self::assertArrayNotHasKey('symfony/http-kernel', $s3Composer['require']);
        self::assertFileDoesNotExist($root . '/packages/sofinder-s3/src/SoFinderS3Bundle.php');
        self::assertFileDoesNotExist($root . '/packages/sofinder-s3/src/DependencyInjection/SoFinderS3Extension.php');
        self::assertSame('src/S3/', $symfonyComposer['autoload']['psr-4']['SohoPHP\\SoFinderS3\\'] ?? null);
        self::assertFileExists($root . '/packages/sofinder-symfony/src/S3/SoFinderS3Bundle.php');
        self::assertFileExists($root . '/packages/sofinder-symfony/src/S3/DependencyInjection/SoFinderS3Extension.php');
    }

    public function testDocumentPreviewQueueMessageLivesInFrameworkNeutralCore(): void
    {
        $root = dirname(__DIR__);
        $message = new \ReflectionClass(\SohoPHP\SoFinder\Preview\DocumentPreviewMessage::class);

        self::assertStringContainsString('/packages/sofinder-core/src/Preview/', (string) $message->getFileName());
        self::assertFileDoesNotExist($root . '/packages/sofinder-symfony/src/Preview/DocumentPreviewMessage.php');
    }
}
