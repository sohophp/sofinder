<?php

declare(strict_types=1);

use SohoPHP\SoFinder\Http\EndpointCatalog;

$repositoryRoot = dirname(__DIR__);
$autoload = null;
foreach (array_filter([
    getenv('SOFINDER_CONTRACT_AUTOLOAD') ?: null,
    $repositoryRoot . '/vendor/autoload.php',
    $repositoryRoot . '/examples/psr15/vendor/autoload.php',
    $repositoryRoot . '/examples/symfony/vendor/autoload.php',
    $repositoryRoot . '/examples/laravel/vendor/autoload.php',
]) as $candidate) {
    if (is_file($candidate)) {
        $autoload = $candidate;
        break;
    }
}
if ($autoload === null) {
    throw new RuntimeException('Install one SoFinder example before exporting cross-host contract cases.');
}
require $autoload;

$manifest = json_decode((string) file_get_contents($repositoryRoot . '/dist/manifest.json'), true, 32, JSON_THROW_ON_ERROR);
$assetFile = null;
foreach ($manifest as $entry) {
    $candidate = $entry['file'] ?? null;
    if (is_string($candidate) && preg_match('/\.(?:js|css)$/', $candidate) === 1) {
        $assetFile = $candidate;
        break;
    }
}
if ($assetFile === null) {
    throw new RuntimeException('The frontend manifest does not contain a routable JS or CSS asset.');
}

$defaultPathValues = [
    'file' => $assetFile,
    'referenceId' => 'contract-reference',
    'token' => 'a.a',
    'assetId' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
];
$idByEndpoint = [
    'sofinder_api_asset_get' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'sofinder_api_asset_update' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'sofinder_api_asset_usage_list' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'sofinder_api_asset_usage_put' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'sofinder_api_asset_usage_remove' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'sofinder_api_asset_session_revoke' => str_repeat('a', 32),
    'sofinder_api_chunk_cancel' => str_repeat('a', 16),
    'sofinder_api_chunk_status' => str_repeat('a', 16),
    'sofinder_document_preview_job_status' => str_repeat('a', 48),
    'sofinder_api_trash_restore' => str_repeat('a', 32),
    'sofinder_api_trash_delete' => str_repeat('a', 32),
];
$queryByEndpoint = [
    'sofinder_api_entries' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__'],
    'sofinder_api_asset_resolve' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.txt'],
    'sofinder_api_asset_search' => ['resource' => 'Files', 'query' => '__sofinder_contract_missing__'],
    'sofinder_api_download' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.txt'],
    'sofinder_api_content' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.txt'],
    'sofinder_api_signed_url' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.txt'],
    'sofinder_api_checksum' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.txt'],
    'sofinder_api_text_preview' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.txt'],
    'sofinder_document_preview' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.pdf'],
    'sofinder_api_trash' => ['resource' => 'Files'],
    'sofinder_image_thumbnail' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.png'],
    'sofinder_image_info' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.png'],
    'sofinder_image_variant' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.png'],
    'sofinder_metadata_get' => ['resource' => 'Files', 'path' => '__sofinder_contract_missing__.txt'],
];

foreach (EndpointCatalog::all() as $endpoint) {
    if ($endpoint->name === 'sofinder_browser') {
        continue;
    }
    $path = preg_replace_callback('/\{([^}]+)\}/', static function (array $match) use ($endpoint, $defaultPathValues, $idByEndpoint): string {
        $name = $match[1];
        if ($name === 'id') {
            return $idByEndpoint[$endpoint->name]
                ?? throw new RuntimeException('No contract ID for ' . $endpoint->name);
        }
        if ($name === 'token' && $endpoint->name === 'sofinder_asset_session_content') {
            return str_repeat('a', 76);
        }

        return $defaultPathValues[$name]
            ?? throw new RuntimeException('No contract path value for ' . $name);
    }, $endpoint->path);
    if (!is_string($path)) {
        throw new RuntimeException('Unable to render endpoint path for ' . $endpoint->name);
    }

    // Requests are intentionally semantically invalid or point at missing
    // fixtures, so the inventory cannot mutate persistent example data.
    $query = $queryByEndpoint[$endpoint->name] ?? [];
    if ($query !== []) {
        $path .= '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
    }
    echo implode("\t", [$endpoint->name, $endpoint->methods[0], $path]), "\n";
}
