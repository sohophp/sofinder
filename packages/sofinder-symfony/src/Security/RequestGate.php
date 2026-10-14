<?php
declare(strict_types=1);
namespace SohoPHP\SoFinder\Security;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\RequestGateStoreInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
final class RequestGate implements EventSubscriberInterface
{
    private readonly RequestBudget $budget;
    /** @param array<string,array{max_requests:int,interval:int,max_concurrent:int}> $limits */
    public function __construct(RequestGateStoreInterface $store, ActorProviderInterface $actors, array $limits, ?\SohoPHP\SoFinder\Contract\AuthorizationInterface $authorization = null) { $this->budget = new RequestBudget($store, $actors, $limits, $authorization); }
    public function acquire(ControllerEvent $event): void
    {
        $request = $event->getRequest();
        if (!$request->attributes->getBoolean('_sofinder')) return;
        $peer = $request->server->get('REMOTE_ADDR');
        $source = is_string($peer) && filter_var($peer, FILTER_VALIDATE_IP) !== false ? $peer : 'unknown';
        $request->attributes->set('_sofinder_gate', $this->budget->acquire((string) $request->attributes->get('_route', ''), $source));
        \SohoPHP\SoFinder\Http\RequestInput::validate($request->request->all());
        \SohoPHP\SoFinder\Http\RequestInput::validate($request->query->all());
        if (str_starts_with(strtolower((string) $request->headers->get('Content-Type')), 'application/json')) {
            $stream = $request->getContent(true);
            if (!is_resource($stream)) \SohoPHP\SoFinder\Http\RequestInput::tooLarge();
            $body = stream_get_contents($stream, \SohoPHP\SoFinder\Http\RequestInput::MAX_BYTES + 1);
            rewind($stream);
            if (!is_string($body)) \SohoPHP\SoFinder\Http\RequestInput::tooLarge();
            if ($body !== '') \SohoPHP\SoFinder\Http\RequestInput::json($body);
        }
    }
    public function release(ResponseEvent $event): void
    {
        $lease = $event->getRequest()->attributes->get('_sofinder_gate');
        if (is_array($lease) && count($lease) === 3 && is_string($lease[0] ?? null) && is_string($lease[1] ?? null) && is_string($lease[2] ?? null)) $this->budget->release([$lease[0], $lease[1], $lease[2]]);
    }
    public static function getSubscribedEvents(): array { return [KernelEvents::CONTROLLER => ['acquire', 64], KernelEvents::RESPONSE => ['release', -64]]; }
}
