<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Security;

use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\Contract\UploadScannerInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Value\HealthCheckResult;
use SohoPHP\SoFinder\Value\InspectedFile;
use SohoPHP\SoFinder\Value\ResourceType;

/** Streams quarantine files to clamd without invoking a shell command. */
final readonly class ClamAvScanner implements UploadScannerInterface, HealthCheckInterface
{
    /** @param (\Closure(string,float):mixed)|null $connector Testable stream connector; omit in applications. */
    public function __construct(
        private string $endpoint = 'tcp://127.0.0.1:3310',
        private float $timeoutSeconds = 5.0,
        private ?\Closure $connector = null,
    ) {
        if (preg_match('#^(?:tcp://[A-Za-z0-9.:-]+|unix:///[^\x00-\x1F]+)$#D', $endpoint) !== 1 || $timeoutSeconds <= 0 || $timeoutSeconds > 60) {
            throw new \InvalidArgumentException('The ClamAV endpoint or timeout is invalid.');
        }
    }

    public function scan(string $path, string $fileName, ResourceType $resource, InspectedFile $inspection): void
    {
        $socket = $this->connect();
        $input = @fopen($path, 'rb');
        if ($input === false) {
            fclose($socket);
            throw new SoFinderException('The quarantined upload cannot be scanned.', 'malware_scanner_unavailable', 503);
        }
        try {
            $this->write($socket, "zINSTREAM\0");
            while (!feof($input)) {
                $chunk = fread($input, 8192);
                if ($chunk === false) throw new SoFinderException('The quarantined upload cannot be scanned.', 'malware_scanner_unavailable', 503);
                if ($chunk !== '') $this->write($socket, pack('N', strlen($chunk)) . $chunk);
            }
            $this->write($socket, pack('N', 0));
            $response = $this->response($socket);
        } finally {
            fclose($input);
            fclose($socket);
        }
        if (str_contains($response, ' FOUND')) {
            throw new SoFinderException('The upload was rejected by malware scanning.', 'malware_detected', 415);
        }
        if (!str_ends_with($response, ' OK')) {
            throw new SoFinderException('The malware scanner could not verify the upload.', 'malware_scanner_unavailable', 503);
        }
    }

    public function check(): HealthCheckResult
    {
        try {
            $socket = $this->connect();
            try {
                $this->write($socket, "zPING\0");
                $ready = trim($this->response($socket)) === 'PONG';
            } finally { fclose($socket); }
            return new HealthCheckResult('clamav-' . substr(hash('sha256', $this->endpoint), 0, 8), $ready ? 'ready' : 'down', $ready ? 'ClamAV responded.' : 'ClamAV returned an unexpected response.');
        } catch (\Throwable) {
            return new HealthCheckResult('clamav-' . substr(hash('sha256', $this->endpoint), 0, 8), 'down', 'ClamAV is unavailable.');
        }
    }

    /** @return resource */
    private function connect(): mixed
    {
        if ($this->connector !== null) $socket = ($this->connector)($this->endpoint, $this->timeoutSeconds);
        else $socket = @stream_socket_client($this->endpoint, $errorCode, $errorMessage, $this->timeoutSeconds, STREAM_CLIENT_CONNECT);
        if (!is_resource($socket)) throw new SoFinderException('The malware scanner is unavailable.', 'malware_scanner_unavailable', 503);
        stream_set_timeout($socket, (int) $this->timeoutSeconds, (int) (($this->timeoutSeconds - (int) $this->timeoutSeconds) * 1_000_000));
        return $socket;
    }

    /** @param resource $stream */
    private function write(mixed $stream, string $data): void
    {
        $offset = 0;
        while ($offset < strlen($data)) {
            $written = fwrite($stream, substr($data, $offset));
            if ($written === false || $written === 0) throw new SoFinderException('The malware scanner connection failed.', 'malware_scanner_unavailable', 503);
            $offset += $written;
        }
    }

    /** @param resource $stream */
    private function response(mixed $stream): string
    {
        $response = '';
        while (!feof($stream) && strlen($response) < 1024) {
            $chunk = fread($stream, 256);
            if ($chunk === false) throw new SoFinderException('The malware scanner connection failed.', 'malware_scanner_unavailable', 503);
            $response .= $chunk;
            if (str_contains($response, "\0") || str_contains($response, "\n")) break;
        }
        $meta = stream_get_meta_data($stream);
        if ($meta['timed_out'] === true) throw new SoFinderException('The malware scanner timed out.', 'malware_scanner_unavailable', 503);
        return trim($response, "\0\r\n ");
    }
}
