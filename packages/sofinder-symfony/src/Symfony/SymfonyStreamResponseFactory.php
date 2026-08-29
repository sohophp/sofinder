<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Symfony;

use SohoPHP\SoFinder\Http\StreamEndpointResult;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class SymfonyStreamResponseFactory
{
    public static function create(StreamEndpointResult $result): Response
    {
        if ($result->stream === null) {
            if ($result->cleanup !== null) {
                ($result->cleanup)();
            }
            return new Response('', $result->status, $result->headers);
        }
        $stream = $result->stream;
        $cleanup = $result->cleanup;
        return new StreamedResponse(static function () use ($stream, $cleanup): void {
            try {
                fpassthru($stream);
            } finally {
                fclose($stream);
                if ($cleanup !== null) {
                    $cleanup();
                }
            }
        }, $result->status, $result->headers);
    }
}
