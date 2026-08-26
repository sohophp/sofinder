<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Security\ClamAvScanner;
use SohoPHP\SoFinder\Value\InspectedFile;
use SohoPHP\SoFinder\Value\ResourceType;

final class ClamAvScannerTest extends TestCase
{
    private string $file;

    protected function setUp(): void
    {
        $this->file = tempnam(sys_get_temp_dir(), 'sofinder-clamav-') ?: throw new \RuntimeException();
        file_put_contents($this->file, 'safe upload');
    }

    protected function tearDown(): void { @unlink($this->file); }

    public function testAcceptsClamdOkResponse(): void
    {
        [$scanner, $peer] = $this->scanner("stream: OK\0");
        try {
            $scanner->scan($this->file, 'safe.txt', new ResourceType('Files', '/tmp', '/files'), new InspectedFile(11, 'text/plain'));
            self::assertTrue(true);
        } finally { fclose($peer); }
    }

    public function testReportsClamdHealth(): void
    {
        [$scanner, $peer] = $this->scanner("PONG\0");
        try { self::assertSame('ready', $scanner->check()->status); }
        finally { fclose($peer); }
    }

    public function testRejectsClamdFoundResponse(): void
    {
        [$scanner, $peer] = $this->scanner("stream: Eicar-Test-Signature FOUND\0");
        try {
            $this->expectException(SoFinderException::class);
            $this->expectExceptionMessage('malware');
            $scanner->scan($this->file, 'unsafe.txt', new ResourceType('Files', '/tmp', '/files'), new InspectedFile(11, 'text/plain'));
        } finally { fclose($peer); }
    }

    /** @return array{ClamAvScanner,resource} */
    private function scanner(string $response): array
    {
        $pair = stream_socket_pair(STREAM_PF_UNIX, STREAM_SOCK_STREAM, STREAM_IPPROTO_IP);
        self::assertIsArray($pair);
        [$client, $peer] = $pair;
        fwrite($peer, $response);
        return [new ClamAvScanner(connector: static fn (): mixed => $client), $peer];
    }
}
