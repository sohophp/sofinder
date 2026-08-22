<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\GdImageProcessor;
use SohoPHP\SoFinder\Security\DefaultFileInspector;
use SohoPHP\SoFinder\Security\UploadPipeline;
use SohoPHP\SoFinder\Value\ResourceType;

final class UploadPipelineTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-quarantine-test-' . bin2hex(random_bytes(8));
    }

    protected function tearDown(): void
    {
        if (!is_dir($this->directory)) {
            return;
        }
        foreach (new \FilesystemIterator($this->directory, \FilesystemIterator::SKIP_DOTS) as $file) {
            @unlink($file->getPathname());
        }
        @rmdir($this->directory);
    }

    public function testCountsActualStreamBytesInsteadOfReportedMetadata(): void
    {
        $stream = fopen('php://temp', 'w+b');
        fwrite($stream, 'four');
        rewind($stream);

        try {
            $this->expectException(SoFinderException::class);
            $this->expectExceptionMessage('size limit');
            $this->pipeline()->quarantine($stream, 'file.txt', new ResourceType('Files', '/tmp', '/files', ['txt'], maxSize: 3));
        } finally {
            fclose($stream);
        }
    }

    public function testRejectsActiveScriptSignature(): void
    {
        $stream = fopen('php://temp', 'w+b');
        fwrite($stream, "safe prefix <?php echo 'unsafe';");
        rewind($stream);

        try {
            $this->expectException(SoFinderException::class);
            $this->expectExceptionMessage('active script');
            $this->pipeline()->quarantine($stream, 'file.txt', new ResourceType('Files', '/tmp', '/files', ['txt']));
        } finally {
            fclose($stream);
        }
    }

    public function testRejectsActiveSignatureBeyondInitialSample(): void
    {
        $stream = fopen('php://temp', 'w+b');
        fwrite($stream, str_repeat('a', 70_000) . '<script>alert(1)</script>');
        rewind($stream);

        try {
            $this->expectException(SoFinderException::class);
            $this->expectExceptionMessage('active script');
            $this->pipeline()->quarantine($stream, 'file.txt', new ResourceType('Files', '/tmp', '/files', ['txt']));
        } finally {
            fclose($stream);
        }
    }

    public function testRejectsFakeImageEvenWithoutAMimeAllowList(): void
    {
        $stream = fopen('php://temp', 'w+b');
        fwrite($stream, 'not an image');
        rewind($stream);

        try {
            $this->expectException(SoFinderException::class);
            $this->expectExceptionMessage('extension does not match');
            $this->pipeline()->quarantine($stream, 'photo.jpg', new ResourceType('Images', '/tmp', '/images', ['jpg']));
        } finally {
            fclose($stream);
        }
    }

    private function pipeline(): UploadPipeline
    {
        return new UploadPipeline(new DefaultFileInspector(new GdImageProcessor()), $this->directory);
    }
}
