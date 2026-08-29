<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use Illuminate\Contracts\Events\Dispatcher;
use Psr\EventDispatcher\EventDispatcherInterface;

final readonly class LaravelEventDispatcher implements EventDispatcherInterface
{
    public function __construct(private Dispatcher $events)
    {
    }

    public function dispatch(object $event): object
    {
        $this->events->dispatch($event);

        return $event;
    }
}
