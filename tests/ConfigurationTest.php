<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\DependencyInjection\Configuration;
use Symfony\Component\Config\Definition\Processor;

final class ConfigurationTest extends TestCase
{
    public function testLogoAndBrandNameAreEnabledByDefault(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'resources' => [
                'Files' => ['root' => '/tmp/sofinder'],
            ],
        ]]);

        self::assertTrue($config['ui']['logo']);
        self::assertTrue($config['ui']['header']);
        self::assertSame('ask', $config['ui']['upload_conflict_strategy']);
        self::assertFalse($config['ckeditor4']['overwrite_on_upload']);
        self::assertFalse($config['malware_scanning']['enabled']);
        self::assertSame('tcp://127.0.0.1:3310', $config['malware_scanning']['endpoint']);
        self::assertTrue($config['document_preview']['pdf']);
        self::assertFalse($config['document_preview']['office']);
        self::assertSame('0775', $config['filesystem_permissions']['directory_mode']);
        self::assertSame('0664', $config['filesystem_permissions']['file_mode']);
        self::assertSame([
            'folder_tree' => true,
            'recent' => true,
            'favorites' => true,
            'tags' => true,
            'archive' => true,
            'trash' => true,
            'batch_rename' => true,
            'image_editing' => true,
            'image_processing' => true,
            'document_preview' => true,
            'security_status' => true,
            'folder_upload' => true,
            'text_preview' => true,
            'checksum' => true,
        ], $config['features']);
    }

    public function testUploadConflictDefaultCanBeConfigured(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'ui' => ['upload_conflict_strategy' => 'rename'],
            'resources' => ['Files' => ['root' => '/tmp/sofinder']],
        ]]);

        self::assertSame('rename', $config['ui']['upload_conflict_strategy']);
    }

    public function testFilesystemPermissionsAcceptQuotedOctalModes(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'filesystem_permissions' => [
                'directory_mode' => '2775',
                'file_mode' => '0664',
            ],
            'resources' => [
                'Files' => ['root' => '/tmp/sofinder'],
            ],
        ]]);

        self::assertSame('2775', $config['filesystem_permissions']['directory_mode']);
        self::assertSame('0664', $config['filesystem_permissions']['file_mode']);
    }

    public function testCkeditorUploadOverwriteCanBeEnabledExplicitly(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'ckeditor4' => ['overwrite_on_upload' => true],
            'resources' => [
                'Files' => ['root' => '/tmp/sofinder'],
            ],
        ]]);

        self::assertTrue($config['ckeditor4']['overwrite_on_upload']);
    }

    public function testOptionalFeaturesCanBeDisabledByTheHost(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'features' => ['tags' => false, 'archive' => false],
            'resources' => ['Files' => ['root' => '/tmp/sofinder']],
        ]]);

        self::assertFalse($config['features']['tags']);
        self::assertFalse($config['features']['archive']);
        self::assertTrue($config['features']['recent']);
    }

    public function testMalwareScanningCanBeConfigured(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'malware_scanning' => [
                'enabled' => true,
                'endpoint' => 'unix:///run/clamav/clamd.ctl',
                'timeout_seconds' => 8.5,
                'history_limit' => 250,
            ],
            'resources' => ['Files' => ['root' => '/tmp/sofinder']],
        ]]);

        self::assertTrue($config['malware_scanning']['enabled']);
        self::assertSame('unix:///run/clamav/clamd.ctl', $config['malware_scanning']['endpoint']);
        self::assertSame(8.5, $config['malware_scanning']['timeout_seconds']);
        self::assertSame(250, $config['malware_scanning']['history_limit']);
    }

    public function testDocumentPreviewCanEnableOfficeConversion(): void
    {
        $config = (new Processor())->processConfiguration(new Configuration(), [[
            'document_preview' => ['pdf' => true, 'office' => true, 'office_binary' => '/opt/libreoffice/program/soffice', 'timeout_seconds' => 45, 'max_bytes' => 10485760],
            'resources' => ['Files' => ['root' => '/tmp/sofinder']],
        ]]);

        self::assertTrue($config['document_preview']['office']);
        self::assertSame('/opt/libreoffice/program/soffice', $config['document_preview']['office_binary']);
        self::assertSame(45, $config['document_preview']['timeout_seconds']);
        self::assertSame(10485760, $config['document_preview']['max_bytes']);
    }
}
