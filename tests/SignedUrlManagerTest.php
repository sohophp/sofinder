<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\AuthorizationInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\PathGuard;
use SohoPHP\SoFinder\Security\SignedUrlManager;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class SignedUrlManagerTest extends TestCase
{
    private string $directory;
    private int $now = 1_800_000_000;

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/sofinder-signed-url-' . bin2hex(random_bytes(8));
        mkdir($this->directory, 0775, true);
        file_put_contents($this->directory . '/private.txt', 'private content');
    }

    protected function tearDown(): void
    {
        @unlink($this->directory . '/private.txt');
        @rmdir($this->directory);
    }

    public function testIssuesAndOpensARevisionBoundPrivateUrl(): void
    {
        $manager = $this->manager();
        $issued = $manager->issue('Private', 'private.txt', 60, 'attachment');
        $opened = $manager->open($issued['token']);
        try {
            self::assertSame($this->now + 60, $issued['expiresAt']);
            self::assertSame('private.txt', $opened['entry']->path);
            self::assertSame('private content', stream_get_contents($opened['stream']));
        } finally {
            fclose($opened['stream']);
        }
    }

    public function testRejectsTamperingExpiryAndChangedFiles(): void
    {
        $manager = $this->manager();
        $issued = $manager->issue('Private', 'private.txt', 30);

        [$payload, $signature] = explode('.', $issued['token'], 2);
        $replacement = $signature[0] === 'A' ? 'B' : 'A';
        $tampered = $payload . '.' . $replacement . substr($signature, 1);
        try { $manager->open($tampered); self::fail('A tampered token must fail.'); }
        catch (SoFinderException $exception) { self::assertSame('signed_url_invalid', $exception->errorCode); }

        file_put_contents($this->directory . '/private.txt', 'changed and longer');
        try { $manager->open($issued['token']); self::fail('A changed file must invalidate its token.'); }
        catch (SoFinderException $exception) { self::assertSame('signed_url_stale', $exception->errorCode); }

        file_put_contents($this->directory . '/private.txt', 'private content');
        $issued = $manager->issue('Private', 'private.txt', 30);
        $this->now += 31;
        try { $manager->open($issued['token']); self::fail('An expired token must fail.'); }
        catch (SoFinderException $exception) { self::assertSame('signed_url_expired', $exception->errorCode); }
    }

    public function testRejectsPublicResourcesAndUnsafeLifetimes(): void
    {
        $manager = $this->manager('public');
        try { $manager->issue('Private', 'private.txt'); self::fail('Public files do not need signed URLs.'); }
        catch (SoFinderException $exception) { self::assertSame('signed_url_public_resource', $exception->errorCode); }

        $manager = $this->manager();
        try { $manager->issue('Private', 'private.txt', 301); self::fail('The maximum TTL must be enforced.'); }
        catch (SoFinderException $exception) { self::assertSame('signed_url_ttl_invalid', $exception->errorCode); }
    }

    private function manager(string $deliveryMode = 'proxy'): SignedUrlManager
    {
        $resource = new ResourceType('Private', $this->directory, '', ['txt'], deliveryMode: $deliveryMode);
        $registry = new ResourceRegistry([new ResourceStorage($resource, new LocalStorageAdapter($this->directory))]);
        $authorization = new class implements AuthorizationInterface {
            public function isAuthenticated(): bool { return true; }
            public function isGranted(string $operation, ResourceType $resource, string $path): bool { return true; }
        };
        $files = new FileManager($registry, $authorization, new EventDispatcher());

        return new SignedUrlManager($files, $registry, new PathGuard(), true, str_repeat('s', 32), 60, 300, function (): int { return $this->now; });
    }
}
