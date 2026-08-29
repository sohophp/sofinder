<?php

declare(strict_types=1);

return [
    'enabled' => true,
    'prefix' => 'sofinder',
    'domain' => null,
    'middleware' => ['web'],
    'auth_middleware' => [],
    'core' => [
        // Keep the executable contract host aligned with the Symfony example.
        // Library defaults remain conservative and are tested separately.
        'signed_urls' => ['enabled' => true],
        'asset_catalog' => ['enabled' => true],
        'image_variants' => ['enabled' => true],
        'resources' => [
            'Files' => ['delivery_mode' => 'public'],
        ],
    ],
];
