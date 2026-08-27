<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class ExampleAllowedExtensionsTest extends TestCase
{
    private const COMMON_EXTENSIONS = [
        'txt', 'md', 'csv', 'tsv', 'rtf', 'pdf',
        'doc', 'docx', 'odt', 'xls', 'xlsx', 'ods', 'ppt', 'pptx', 'odp',
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'ico', 'heic', 'heif', 'tif', 'tiff',
        'zip', '7z', 'rar', 'tar', 'gz', 'tgz',
        'mp3', 'wav', 'ogg', 'm4a', 'flac', 'mp4', 'webm', 'mov',
    ];

    private const DANGEROUS_EXTENSIONS = ['php', 'phtml', 'phar', 'cgi', 'pl', 'exe', 'sh', 'html', 'htm', 'js'];

    /** @return iterable<string, array{string, string}> */
    public static function resourceProvider(): iterable
    {
        yield 'local public files' => ['examples/symfony/config/packages/so_finder.yaml', 'Files'];
        yield 'local private files' => ['examples/symfony/config/packages/so_finder.yaml', 'Private'];
        yield 's3 environment local files' => ['examples/symfony/config/packages/s3/so_finder.yaml', 'Files'];
        yield 'single s3 provider' => ['examples/symfony/config/packages/s3/so_finder.yaml', 'S3Files'];
        yield 'optional second s3 provider' => ['examples/symfony/config/packages/s3_dual/so_finder.yaml', 'S3Files2'];
    }

    #[DataProvider('resourceProvider')]
    public function testGeneralFileResourcesUseTheCommonSafeAllowlist(string $relativeFile, string $resource): void
    {
        $extensions = $this->extensionsFor($relativeFile, $resource);

        foreach (self::COMMON_EXTENSIONS as $extension) {
            self::assertContains($extension, $extensions, sprintf('%s in %s must allow .%s files.', $resource, $relativeFile, $extension));
        }
        foreach (self::DANGEROUS_EXTENSIONS as $extension) {
            self::assertNotContains($extension, $extensions, sprintf('%s in %s must not allow .%s files.', $resource, $relativeFile, $extension));
        }
    }

    /** @return list<string> */
    private function extensionsFor(string $relativeFile, string $resource): array
    {
        $contents = file_get_contents(dirname(__DIR__) . '/' . $relativeFile);
        self::assertIsString($contents);
        $pattern = sprintf('/^    %s:\R(?<resource>(?:(?!^    \S)[\s\S])*)/m', preg_quote($resource, '/'));
        self::assertSame(1, preg_match($pattern, $contents, $resourceMatch), sprintf('Unable to find resource %s in %s.', $resource, $relativeFile));
        self::assertSame(1, preg_match('/^      allowed_extensions: \[(?<extensions>[^]]+)]$/m', $resourceMatch['resource'], $extensionMatch));

        return array_values(array_filter(array_map('trim', explode(',', $extensionMatch['extensions']))));
    }
}
