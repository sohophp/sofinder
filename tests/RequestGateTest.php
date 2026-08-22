<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Security\RequestGate;
use SohoPHP\SoFinder\Security\LocalRequestGateStore;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;

final class RequestGateTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-gate-' . bin2hex(random_bytes(8));
    }

    protected function tearDown(): void
    {
        foreach (glob($this->directory . '/*') ?: [] as $file) {
            @unlink($file);
        }
        @rmdir($this->directory);
    }

    public function testConcurrentOperationsAreRejectedUntilLeaseIsReleased(): void
    {
        $gate = new RequestGate(new LocalRequestGateStore($this->directory), $this->actor(), [
            'upload' => ['max_requests' => 0, 'interval' => 60, 'max_concurrent' => 1],
        ]);
        $kernel = $this->createMock(HttpKernelInterface::class);
        $first = $this->request('sofinder_api_upload');
        $gate->acquire(new ControllerEvent($kernel, static fn (): Response => new Response(), $first, HttpKernelInterface::MAIN_REQUEST));

        $second = $this->request('sofinder_api_upload');
        try {
            $gate->acquire(new ControllerEvent($kernel, static fn (): Response => new Response(), $second, HttpKernelInterface::MAIN_REQUEST));
            self::fail('A concurrent upload should have been rejected.');
        } catch (SoFinderException $exception) {
            self::assertSame('concurrency_limit_exceeded', $exception->errorCode);
        }

        $gate->release(new ResponseEvent($kernel, $first, HttpKernelInterface::MAIN_REQUEST, new Response()));
        $gate->acquire(new ControllerEvent($kernel, static fn (): Response => new Response(), $second, HttpKernelInterface::MAIN_REQUEST));
        self::assertIsArray($second->attributes->get('_sofinder_gate'));
    }

    public function testRequestRateIsCountedEvenAfterResponseCompletes(): void
    {
        $gate = new RequestGate(new LocalRequestGateStore($this->directory), $this->actor(), [
            'normal' => ['max_requests' => 1, 'interval' => 60, 'max_concurrent' => 2],
        ]);
        $kernel = $this->createMock(HttpKernelInterface::class);
        $first = $this->request('sofinder_api_config');
        $gate->acquire(new ControllerEvent($kernel, static fn (): Response => new Response(), $first, HttpKernelInterface::MAIN_REQUEST));
        $gate->release(new ResponseEvent($kernel, $first, HttpKernelInterface::MAIN_REQUEST, new Response()));

        $this->expectException(SoFinderException::class);
        $gate->acquire(new ControllerEvent($kernel, static fn (): Response => new Response(), $this->request('sofinder_api_config'), HttpKernelInterface::MAIN_REQUEST));
    }

    public function testThumbnailsUseASeparateRateLimitFromImageEditing(): void
    {
        $gate = new RequestGate(new LocalRequestGateStore($this->directory), $this->actor(), [
            'image' => ['max_requests' => 1, 'interval' => 60, 'max_concurrent' => 2],
            'thumbnail' => ['max_requests' => 2, 'interval' => 60, 'max_concurrent' => 2],
        ]);
        $kernel = $this->createMock(HttpKernelInterface::class);

        foreach (range(1, 2) as $_) {
            $thumbnail = $this->request('sofinder_image_thumbnail');
            $gate->acquire(new ControllerEvent($kernel, static fn (): Response => new Response(), $thumbnail, HttpKernelInterface::MAIN_REQUEST));
            $gate->release(new ResponseEvent($kernel, $thumbnail, HttpKernelInterface::MAIN_REQUEST, new Response()));
        }

        try {
            $gate->acquire(new ControllerEvent($kernel, static fn (): Response => new Response(), $this->request('sofinder_image_thumbnail'), HttpKernelInterface::MAIN_REQUEST));
            self::fail('The thumbnail limit should have been enforced.');
        } catch (SoFinderException $exception) {
            self::assertSame('rate_limit_exceeded', $exception->errorCode);
        }

        $edit = $this->request('sofinder_image_edit');
        $gate->acquire(new ControllerEvent($kernel, static fn (): Response => new Response(), $edit, HttpKernelInterface::MAIN_REQUEST));
        self::assertIsArray($edit->attributes->get('_sofinder_gate'));
    }

    private function request(string $route): Request
    {
        $request = Request::create('/sofinder');
        $request->attributes->set('_sofinder', true);
        $request->attributes->set('_route', $route);

        return $request;
    }

    private function actor(): ActorProviderInterface
    {
        return new class implements ActorProviderInterface {
            public function actorId(): string
            {
                return 'test-actor';
            }
        };
    }
}
