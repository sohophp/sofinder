<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Routing;

use SohoPHP\SoFinder\Http\EndpointCatalog;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

/** Builds the Symfony route surface from the framework-neutral endpoint catalog. */
final class SymfonyRouteCollectionFactory
{
    /** @var array<string, string> */
    private const CONTROLLERS = [
        'sofinder_browser' => 'SohoPHP\\SoFinder\\Http\\BrowserController',
        'sofinder_asset' => 'SohoPHP\\SoFinder\\Http\\AssetController',
        'sofinder_api_config' => 'SohoPHP\\SoFinder\\Http\\ApiController::config',
        'sofinder_api_capabilities' => 'SohoPHP\\SoFinder\\Http\\CapabilityController',
        'sofinder_health' => 'SohoPHP\\SoFinder\\Http\\HealthController',
        'sofinder_liveness' => 'SohoPHP\\SoFinder\\Http\\LivenessController',
        'sofinder_metrics' => 'SohoPHP\\SoFinder\\Http\\MetricsController',
        'sofinder_security_status' => 'SohoPHP\\SoFinder\\Http\\SecurityStatusController',
        'sofinder_api_entries' => 'SohoPHP\\SoFinder\\Http\\ApiController::entries',
        'sofinder_api_asset_resolve' => 'SohoPHP\\SoFinder\\Http\\AssetApiController::resolve',
        'sofinder_api_asset_search' => 'SohoPHP\\SoFinder\\Http\\AssetSearchController',
        'sofinder_api_asset_get' => 'SohoPHP\\SoFinder\\Http\\AssetApiController::get',
        'sofinder_api_asset_update' => 'SohoPHP\\SoFinder\\Http\\AssetApiController::update',
        'sofinder_api_asset_usage_list' => 'SohoPHP\\SoFinder\\Http\\AssetUsageController::list',
        'sofinder_api_asset_usage_put' => 'SohoPHP\\SoFinder\\Http\\AssetUsageController::put',
        'sofinder_api_asset_usage_remove' => 'SohoPHP\\SoFinder\\Http\\AssetUsageController::remove',
        'sofinder_api_asset_delete_check' => 'SohoPHP\\SoFinder\\Http\\AssetUsageController::deleteCheck',
        'sofinder_api_asset_session_create' => 'SohoPHP\\SoFinder\\Http\\AssetAccessSessionController::create',
        'sofinder_api_asset_session_revoke' => 'SohoPHP\\SoFinder\\Http\\AssetAccessSessionController::revoke',
        'sofinder_asset_session_content' => 'SohoPHP\\SoFinder\\Http\\AssetAccessSessionController::consume',
        'sofinder_api_folder' => 'SohoPHP\\SoFinder\\Http\\ApiController::createFolder',
        'sofinder_api_upload' => 'SohoPHP\\SoFinder\\Http\\ApiController::upload',
        'sofinder_api_chunk_upload' => 'SohoPHP\\SoFinder\\Http\\ChunkUploadController::upload',
        'sofinder_api_chunk_cancel' => 'SohoPHP\\SoFinder\\Http\\ChunkUploadController::cancel',
        'sofinder_api_chunk_status' => 'SohoPHP\\SoFinder\\Http\\ChunkUploadController::status',
        'sofinder_api_rename' => 'SohoPHP\\SoFinder\\Http\\ApiController::rename',
        'sofinder_api_copy' => 'SohoPHP\\SoFinder\\Http\\ApiController::transfer',
        'sofinder_api_move' => 'SohoPHP\\SoFinder\\Http\\ApiController::transfer',
        'sofinder_api_delete' => 'SohoPHP\\SoFinder\\Http\\ApiController::delete',
        'sofinder_api_batch' => 'SohoPHP\\SoFinder\\Http\\ApiController::batch',
        'sofinder_api_batch_rename' => 'SohoPHP\\SoFinder\\Http\\ApiController::batchRename',
        'sofinder_api_download' => 'SohoPHP\\SoFinder\\Http\\ContentController::download',
        'sofinder_api_content' => 'SohoPHP\\SoFinder\\Http\\ContentController::content',
        'sofinder_api_signed_url' => 'SohoPHP\\SoFinder\\Http\\SignedUrlController::issue',
        'sofinder_signed_content' => 'SohoPHP\\SoFinder\\Http\\SignedUrlController::consume',
        'sofinder_api_checksum' => 'SohoPHP\\SoFinder\\Http\\ContentController::checksum',
        'sofinder_api_text_preview' => 'SohoPHP\\SoFinder\\Http\\ContentController::textPreview',
        'sofinder_document_preview' => 'SohoPHP\\SoFinder\\Http\\DocumentPreviewController',
        'sofinder_document_preview_job_create' => 'SohoPHP\\SoFinder\\Http\\DocumentPreviewJobController::create',
        'sofinder_document_preview_job_status' => 'SohoPHP\\SoFinder\\Http\\DocumentPreviewJobController::status',
        'sofinder_api_trash' => 'SohoPHP\\SoFinder\\Http\\ApiController::trash',
        'sofinder_api_trash_restore' => 'SohoPHP\\SoFinder\\Http\\ApiController::restoreTrash',
        'sofinder_api_trash_delete' => 'SohoPHP\\SoFinder\\Http\\ApiController::permanentlyDeleteTrash',
        'sofinder_image_thumbnail' => 'SohoPHP\\SoFinder\\Http\\ImageController::thumbnail',
        'sofinder_image_info' => 'SohoPHP\\SoFinder\\Http\\ImageController::info',
        'sofinder_image_variant' => 'SohoPHP\\SoFinder\\Http\\ImageController::variant',
        'sofinder_image_edit' => 'SohoPHP\\SoFinder\\Http\\ImageController::edit',
        'sofinder_image_batch' => 'SohoPHP\\SoFinder\\Http\\ImageController::batch',
        'sofinder_archive_download' => 'SohoPHP\\SoFinder\\Http\\ArchiveController',
        'sofinder_metadata_get' => 'SohoPHP\\SoFinder\\Http\\MetadataController::get',
        'sofinder_metadata_update' => 'SohoPHP\\SoFinder\\Http\\MetadataController::update',
        'sofinder_quick_upload' => 'SohoPHP\\SoFinder\\Http\\QuickUploadController',
    ];

    public static function create(): RouteCollection
    {
        $endpoints = EndpointCatalog::all();
        $endpointNames = array_map(static fn ($endpoint): string => $endpoint->name, $endpoints);
        $controllerNames = array_keys(self::CONTROLLERS);
        sort($endpointNames);
        sort($controllerNames);
        if ($endpointNames !== $controllerNames) {
            throw new \LogicException('Every canonical endpoint must have exactly one Symfony controller mapping.');
        }

        $routes = new RouteCollection();
        foreach ($endpoints as $endpoint) {
            $defaults = [
                '_controller' => self::CONTROLLERS[$endpoint->name],
                '_sofinder' => true,
            ];
            if ($endpoint->name === 'sofinder_api_copy' || $endpoint->name === 'sofinder_api_move') {
                $defaults['operation'] = substr($endpoint->name, strlen('sofinder_api_'));
            }
            if ($endpoint->name === 'sofinder_signed_content') {
                $defaults['_sofinder_signed_public'] = true;
            }

            $routes->add($endpoint->name, new Route(
                path: $endpoint->path,
                defaults: $defaults,
                requirements: $endpoint->requirements,
                methods: $endpoint->methods,
            ));
        }

        return $routes;
    }
}
