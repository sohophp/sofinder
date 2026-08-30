<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Configuration\ConfigurationNormalizer;
use SohoPHP\SoFinder\DependencyInjection\Configuration;
use Symfony\Component\Config\Definition\Processor;

final class ConfigurationNormalizerTest extends TestCase
{
    public function testPlainArrayAndSymfonyYamlSemanticsResolveToTheSameConfiguration(): void
    {
        $input = [
            'route_prefix' => '/sofinder',
            'image_variants' => ['widths' => [640]],
            'resources' => [
                'Files' => [
                    'root' => '/srv/files',
                    'allowed_extensions' => ['jpg'],
                    'delivery_mode' => 'proxy',
                ],
            ],
        ];
        $normalizer = new ConfigurationNormalizer();
        $plain = $normalizer->normalize($input);
        $symfony = $normalizer->normalizeResolved(
            (new Processor())->processConfiguration(new Configuration(), [$input]),
            [$input],
        );

        self::assertEquals($symfony, $plain);
        self::assertSame([640], $plain['image_variants']['widths']);
        self::assertSame(['jpg'], $plain['resources']['Files']['allowed_extensions']);
        self::assertTrue($plain['picker']['lock_resource']);
        self::assertSame(['php', 'phtml', 'phar', 'cgi', 'pl', 'exe', 'sh', 'html', 'htm', 'js'], $plain['resources']['Files']['denied_extensions']);
    }

    public function testLegacyUploadNamingAliasHasTheSamePrecedenceAsSymfonyBridge(): void
    {
        $normalizer = new ConfigurationNormalizer();
        $config = $normalizer->normalize([
            'uploads' => ['naming' => ['lowercase_extensions' => true]],
            'ui' => ['lowercase_upload_extensions' => false],
            'resources' => ['Files' => ['root' => '/srv/files']],
        ]);

        self::assertFalse($config['uploads']['naming']['lowercase_extensions']);
        self::assertFalse($config['ui']['lowercase_upload_extensions']);
    }

    public function testUnsafeCrossFieldLimitsAreRejectedWithoutAFramework(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('default_ttl_seconds cannot exceed max_ttl_seconds');

        (new ConfigurationNormalizer())->normalize([
            'signed_urls' => ['default_ttl_seconds' => 600, 'max_ttl_seconds' => 300],
            'resources' => ['Files' => ['root' => '/srv/files']],
        ]);
    }

    public function testPlainConfigurationRequiresAResource(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('at least one resource');

        (new ConfigurationNormalizer())->normalize([]);
    }

    /** @return iterable<string, array{array<string, mixed>, string}> */
    public static function invalidPlainConfigurationProvider(): iterable
    {
        $resource = ['resources' => ['Files' => ['root' => '/srv/files']]];

        yield 'unknown key' => [$resource + ['routePrefix' => '/files'], 'Unknown SoFinder configuration key routePrefix'];
        yield 'origin with path' => [$resource + ['picker' => ['allowed_origins' => ['https://example.test/path']]], 'exact HTTP(S) origin'];
        yield 'duplicate locales' => [$resource + ['asset_catalog' => ['alt_locales' => ['en', 'en']]], '1 to 20 unique language tags'];
        yield 'unsafe variant width' => [$resource + ['image_variants' => ['widths' => [16]]], 'between 32 and 8192'];
        yield 'oversized file name limit' => [[
            'resources' => ['Files' => ['root' => '/srv/files', 'max_file_name_length' => 256]],
        ], 'max_file_name_length must be between 1 and 255'];
        yield 'invalid scanner endpoint' => [$resource + ['malware_scanning' => ['endpoint' => 'http://scanner.test']], 'tcp:// host or absolute unix:/// socket'];
    }

    /** @param array<string, mixed> $config */
    #[DataProvider('invalidPlainConfigurationProvider')]
    public function testPlainConfigurationRejectsFrameworkIndependentSafetyViolations(array $config, string $message): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage($message);

        (new ConfigurationNormalizer())->normalize($config);
    }

    public function testPlainConfigurationAcceptsUnixScannerSocket(): void
    {
        $config = (new ConfigurationNormalizer())->normalize([
            'malware_scanning' => ['endpoint' => 'unix:///run/clamav/clamd.sock'],
            'resources' => ['Files' => ['root' => '/srv/files']],
        ]);

        self::assertSame('unix:///run/clamav/clamd.sock', $config['malware_scanning']['endpoint']);
    }
}
