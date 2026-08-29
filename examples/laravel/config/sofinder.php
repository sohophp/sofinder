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
        'document_preview' => [
            'pdf' => true,
            'office' => (bool) env('SOFINDER_EXAMPLE_OFFICE', false),
            'office_binary' => (string) env('SOFINDER_EXAMPLE_OFFICE_BINARY', '/usr/bin/libreoffice'),
        ],
        'resources' => [
            'Files' => ['delivery_mode' => 'public'],
        ],
    ],
];
