<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Value\RequestContext;

final class NativeSessionCsrfTokenProvider implements CsrfTokenProviderInterface
{
    public function __construct(
        private readonly string $sessionKey = '_sofinder_csrf',
        private readonly bool $startSession = true,
        private readonly ?bool $secureCookie = null,
    ) {
        if ($sessionKey === '') {
            throw new \InvalidArgumentException('The CSRF session key cannot be empty.');
        }
    }

    public function token(RequestContext $context): string
    {
        $this->openSession($context);
        $token = $_SESSION[$this->sessionKey] ?? null;
        if (!is_string($token) || preg_match('/^[a-f0-9]{64}$/D', $token) !== 1) {
            $token = bin2hex(random_bytes(32));
            $_SESSION[$this->sessionKey] = $token;
        }

        return $token;
    }

    public function isValid(RequestContext $context, string $token): bool
    {
        $this->openSession($context);
        $expected = $_SESSION[$this->sessionKey] ?? null;

        return is_string($expected) && $token !== '' && hash_equals($expected, $token);
    }

    private function openSession(RequestContext $context): void
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
            'cookie_secure' => $this->secureCookie === true || ((bool) session_get_cookie_params()['secure']
                || strtolower((string) parse_url($context->schemeAndHost, PHP_URL_SCHEME)) === 'https'
                || (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off')),
            'cookie_httponly' => true,
            'cookie_samesite' => 'Lax',
            'use_strict_mode' => true,
            'use_only_cookies' => true,
        ])) {
            throw new \RuntimeException('Unable to start the native PHP session for CSRF protection.');
        }
    }
}
