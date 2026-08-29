<?php

declare(strict_types=1);

use GuzzleHttp\Psr7\HttpFactory as GuzzleFactory;
use Nyholm\Psr7\Factory\Psr17Factory as NyholmFactory;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Psr15\HostServices;
use SohoPHP\SoFinder\Psr15\LocalApplicationFactory;
use SohoPHP\SoFinder\Value\RequestContext;
use SohoPHP\SoFinder\Value\ResourceType;

require getcwd() . '/vendor/autoload.php';

$runtimeDirectory = $argv[1] ?? '';
$implementation = $argv[2] ?? 'nyholm';
if ($runtimeDirectory === '') {
    fwrite(STDERR, "Usage: verify-installed-psr-browser.php RUNTIME_DIRECTORY [nyholm|guzzle]\n");
    exit(2);
}
$psr17 = match ($implementation) {
    'nyholm' => new NyholmFactory(),
    'guzzle' => new GuzzleFactory(),
    default => throw new InvalidArgumentException(sprintf('Unknown PSR-7 implementation: %s', $implementation)),
};

$authorization = new class implements AuthorizationInterface {
    public function isAuthenticated(): bool { return true; }
    public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
};
$actor = new class implements ActorProviderInterface {
    public function actorId(): string { return 'split-package-test'; }
};
$csrf = new class implements CsrfTokenProviderInterface {
    public function token(RequestContext $context): string { return 'split-package-csrf'; }
    public function isValid(RequestContext $context, string $token): bool { return hash_equals($this->token($context), $token); }
};
$events = new class implements EventDispatcherInterface {
    public function dispatch(object $event): object { return $event; }
};
$services = new HostServices($authorization, $actor, $csrf, $events);
$application = (new LocalApplicationFactory(
    $psr17,
    $psr17,
    $services,
    [],
    $runtimeDirectory . '/state',
    $runtimeDirectory . '/files',
))->create();
$fallback = new class($psr17) implements RequestHandlerInterface {
    public function __construct(private ResponseFactoryInterface $responses) {}
    public function handle(ServerRequestInterface $request): ResponseInterface { return $this->responses->createResponse(404); }
};

$browser = $application->middleware()->process($psr17->createServerRequest('GET', '/sofinder/browser'), $fallback);
$body = (string) $browser->getBody();
if ($browser->getStatusCode() !== 200 || !str_contains($body, '/sofinder/assets/sofinder.js?v=')) {
    fwrite(STDERR, "Installed PSR-15 browser did not bootstrap from packaged assets.\n");
    exit(1);
}

$asset = $application->middleware()->process($psr17->createServerRequest('GET', '/sofinder/assets/sofinder.css'), $fallback);
if ($asset->getStatusCode() !== 200 || $asset->getHeaderLine('Content-Type') !== 'text/css; charset=UTF-8') {
    fwrite(STDERR, "Installed PSR-15 frontend asset was not served from the split package.\n");
    exit(1);
}

printf("Installed PSR-15 browser and frontend assets passed with %s.\n", $implementation);
