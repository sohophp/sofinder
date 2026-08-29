<?php

declare(strict_types=1);

return [
    'defaults' => ['guard' => 'web', 'passwords' => 'users'],
    'guards' => ['web' => ['driver' => 'sofinder-demo', 'provider' => null]],
    'providers' => [],
    'passwords' => [],
    'password_timeout' => 10800,
];
