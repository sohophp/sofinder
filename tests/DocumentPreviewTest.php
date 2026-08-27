<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Health\DocumentPreviewHealthCheck;
use SohoPHP\SoFinder\Http\DocumentPreviewController;
use SohoPHP\SoFinder\Preview\DocumentPreviewManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;

final class DocumentPreviewTest extends TestCase
{
    private string $directory;
    private string $cache;
    private FileManager $files;

    protected function setUp(): void
    {
        $suffix = bin2hex(random_bytes(8));
        $this->directory = sys_get_temp_dir() . '/sofinder-document-' . $suffix;
        $this->cache = sys_get_temp_dir() . '/sofinder-document-cache-' . $suffix;
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/manual.pdf', "%PDF-1.4\n% test\n");
        file_put_contents($this->directory . '/未命名 1.pdf', "%PDF-1.4\n% unicode test\n");
        file_put_contents($this->directory . '/report.docx', 'test office bytes');
        $resource = new ResourceType('Files', $this->directory, '/files', ['pdf', 'docx']);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $this->files = new FileManager(new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory, '/files'))]), $authorization, new EventDispatcher());
    }

    protected function tearDown(): void
    {
        $this->remove($this->directory);
        $this->remove($this->cache);
    }

    public function testPdfIsServedInlineThroughTheAuthorizedPreviewEndpoint(): void
    {
        $controller = new DocumentPreviewController(new DocumentPreviewManager($this->files, $this->cache));
        $response = $controller(Request::create('/api/preview/document?resource=Files&path=manual.pdf'));

        self::assertSame('application/pdf', $response->headers->get('Content-Type'));
        self::assertStringStartsWith('inline;', (string) $response->headers->get('Content-Disposition'));
        self::assertStringContainsString('sandbox', (string) $response->headers->get('Content-Security-Policy'));
        self::assertFileExists($response->getFile()->getPathname());
    }

    public function testOfficeDocumentIsConvertedByTheFixedBinaryWithoutAShell(): void
    {
        $binary = __DIR__ . '/fixtures/fake-libreoffice';
        self::assertTrue(is_executable($binary));
        $preview = (new DocumentPreviewManager($this->files, $this->cache, officeEnabled: true, officeBinary: $binary))->preview('Files', 'report.docx');

        self::assertSame('office', $preview['source']);
        self::assertStringStartsWith('%PDF-', (string) file_get_contents($preview['file']));
    }

    public function testAdministratorDiagnosticsDescribeConverterAndCache(): void
    {
        $binary = __DIR__ . '/fixtures/fake-libreoffice';
        $manager = new DocumentPreviewManager($this->files, $this->cache, officeEnabled: true, officeBinary: $binary);
        $manager->preview('Files', 'report.docx');

        $diagnostics = $manager->diagnostics();
        self::assertTrue($diagnostics['officeEnabled']);
        self::assertTrue($diagnostics['available']);
        self::assertTrue($diagnostics['cacheWritable']);
        self::assertSame(1, $diagnostics['cacheCount']);
        self::assertNotNull($diagnostics['lastSuccessfulAt']);
    }

    public function testUnicodeDocumentNameUsesAnAsciiFallbackAndUtf8Filename(): void
    {
        $controller = new DocumentPreviewController(new DocumentPreviewManager($this->files, $this->cache));
        $response = $controller(Request::create('/api/preview/document?resource=Files&path=' . rawurlencode('未命名 1.pdf')));
        $disposition = (string) $response->headers->get('Content-Disposition');

        self::assertStringStartsWith('inline;', $disposition);
        self::assertStringContainsString('filename=1.pdf', $disposition);
        self::assertStringContainsString("filename*=utf-8''%E6%9C%AA%E5%91%BD%E5%90%8D%201.pdf", $disposition);
    }

    public function testHealthReportsMissingOfficeConverter(): void
    {
        self::assertSame('down', (new DocumentPreviewHealthCheck(true, true, '/missing/libreoffice'))->check()->status);
        self::assertSame('ready', (new DocumentPreviewHealthCheck(true, false, '/missing/libreoffice'))->check()->status);
    }

    public function testRealLibreOfficeConversionWhenConfigured(): void
    {
        $binary = getenv('SOFINDER_LIBREOFFICE_BINARY');
        if (!is_string($binary) || $binary === '' || !is_executable($binary)) {
            self::markTestSkipped('SOFINDER_LIBREOFFICE_BINARY does not point to an executable converter.');
        }
        if (!class_exists(\ZipArchive::class)) self::markTestSkipped('ZIP is required to build the live DOCX fixture.');
        $this->writeDocx($this->directory . '/report.docx');

        $preview = (new DocumentPreviewManager($this->files, $this->cache, officeEnabled: true, officeBinary: $binary, timeoutSeconds: 60))->preview('Files', 'report.docx');

        self::assertSame('office', $preview['source']);
        self::assertStringStartsWith('%PDF-', (string) file_get_contents($preview['file']));
        self::assertGreaterThan(500, filesize($preview['file']));
    }

    private function writeDocx(string $path): void
    {
        $zip = new \ZipArchive();
        self::assertTrue($zip->open($path, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true);
        $zip->addFromString('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
        $zip->addFromString('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
        $zip->addFromString('word/document.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>SoFinder Office preview live test</w:t></w:r></w:p><w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr></w:body></w:document>');
        self::assertTrue($zip->close());
    }

    private function remove(string $directory): void
    {
        if (!is_dir($directory)) return;
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $entry) $entry->isDir() ? @rmdir($entry->getPathname()) : @unlink($entry->getPathname());
        @rmdir($directory);
    }
}
