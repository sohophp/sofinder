<?php

declare(strict_types=1);

return [
    'enabled' => true,
    'prefix' => 'sofinder',
    'domain' => null,
    'middleware' => ['web'],
    'auth_middleware' => ['auth'],
    'cache_store' => null,
    'cache_prefix' => 'sofinder:',
    'cache_lock_seconds' => 60,
    'cache_lock_wait_seconds' => 2,
    'core' => [],
];
