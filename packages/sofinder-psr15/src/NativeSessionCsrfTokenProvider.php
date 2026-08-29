<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Value\RequestContext;

final readonly class NativeSessionCsrfTokenProvider implements CsrfTokenProviderInterface
{
    public function __construct(
        private string $sessionKey = '_sofinder_csrf',
        private bool $startSession = true,
    ) {
        if ($sessionKey === '') {
            throw new \InvalidArgumentException('The CSRF session key cannot be empty.');
        }
    }

    public function token(RequestContext $context): string
    {
        $this->openSession();
        $token = $_SESSION[$this->sessionKey] ?? null;
        if (!is_string($token) || preg_match('/^[a-f0-9]{64}$/D', $token) !== 1) {
            $token = bin2hex(random_bytes(32));
            $_SESSION[$this->sessionKey] = $token;
        }

        return $token;
    }

    public function isValid(RequestContext $context, string $token): bool
    {
        $this->openSession();
        $expected = $_SESSION[$this->sessionKey] ?? null;

        return is_string($expected) && $token !== '' && hash_equals($expected, $token);
    }

    private function openSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }
        if (!$this->startSession) {
            if (!isset($_SESSION)) {
                throw new \RuntimeException('A native PHP session is required for CSRF protection.');
            }

            return;
        }
        if (headers_sent($file, $line)) {
            throw new \RuntimeException(sprintf('Cannot start the CSRF session after headers were sent at %s:%d.', $file, $line));
        }
        if (!session_start([
            'cookie_httponly' => true,
            'cookie_samesite' => 'Lax',
            'use_strict_mode' => true,
            'use_only_cookies' => true,
        ])) {
            throw new \RuntimeException('Unable to start the native PHP session for CSRF protection.');
        }
    }
}
