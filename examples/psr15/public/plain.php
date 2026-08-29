<?php

declare(strict_types=1);

use Laminas\Diactoros\ResponseFactory;
use Laminas\Diactoros\ServerRequestFactory;
use Laminas\Diactoros\StreamFactory;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SoFinderExample\RuntimeFactory;

require dirname(__DIR__) . '/vendor/autoload.php';

$responses = new ResponseFactory();
$fallback = new class($responses) implements RequestHandlerInterface {
    public function __construct(private ResponseFactory $responses) {}
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return $this->responses->createResponse(404);
    }
};
$runtime = RuntimeFactory::create($responses, new StreamFactory());
$response = $runtime->middleware()->process(ServerRequestFactory::fromGlobals(), $fallback);

(new SapiEmitter())->emit($response);
