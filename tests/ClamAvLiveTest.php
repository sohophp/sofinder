<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Security\ClamAvScanner;
use SohoPHP\SoFinder\Value\InspectedFile;
use SohoPHP\SoFinder\Value\ResourceType;

final class ClamAvLiveTest extends TestCase
{
    public function testLiveDaemonAcceptsCleanDataAndRejectsTheStandardTestSignature(): void
    {
        $endpoint = getenv('SOFINDER_CLAMAV_ENDPOINT');
        if (!is_string($endpoint) || $endpoint === '') {
            self::markTestSkipped('SOFINDER_CLAMAV_ENDPOINT is not configured.');
        }
        $scanner = new ClamAvScanner($endpoint, 15.0);
        self::assertSame('ready', $scanner->check()->status);
        $resource = new ResourceType('Files', sys_get_temp_dir(), '/files');
        $clean = tempnam(sys_get_temp_dir(), 'sofinder-clam-clean-') ?: throw new \RuntimeException();
        $signature = tempnam(sys_get_temp_dir(), 'sofinder-clam-test-') ?: throw new \RuntimeException();
        try {
            file_put_contents($clean, 'SoFinder clean integration test.');
            $scanner->scan($clean, 'clean.txt', $resource, new InspectedFile((int) filesize($clean), 'text/plain'));
            file_put_contents($signature, 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$' . 'EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
            try {
                $scanner->scan($signature, 'scanner-test.txt', $resource, new InspectedFile((int) filesize($signature), 'text/plain'));
                self::fail('The standard antivirus test signature was accepted.');
            } catch (SoFinderException $exception) {
                self::assertSame('malware_detected', $exception->errorCode);
            }
        } finally {
            @unlink($clean);
            @unlink($signature);
        }
    }
}
