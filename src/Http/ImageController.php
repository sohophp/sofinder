<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final readonly class ImageController
{
    public function __construct(
        private ImageManager $images,
        private CsrfGuard $csrf,
    ) {
    }

    public function thumbnail(Request $request): BinaryFileResponse
    {
        $thumbnail = $this->images->thumbnail(
            (string) $request->query->get('resource', 'Images'),
            (string) $request->query->get('path', ''),
            $request->query->getInt('width', 240),
            $request->query->getInt('height', 180),
        );
        $response = new BinaryFileResponse($thumbnail['path']);
        $response->headers->set('Content-Type', $thumbnail['mimeType']);
        $response->headers->set('Cache-Control', 'private, no-store');
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }

    public function info(Request $request): JsonResponse
    {
        return new JsonResponse(OperationResult::success($this->images->info(
            (string) $request->query->get('resource', 'Images'),
            (string) $request->query->get('path', ''),
        )));
    }

    public function edit(Request $request): JsonResponse
    {
        $this->csrf->assertMutation($request);
        try {
            $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400);
        }
        if (!is_array($data)) {
            throw new SoFinderException('The JSON request body must be an object.', 'invalid_json', 400);
        }
        $resource = (string) ($data['resource'] ?? 'Images');
        $path = (string) ($data['path'] ?? '');
        if (isset($data['actions'])) {
            if (!is_array($data['actions']) || array_filter($data['actions'], static fn (mixed $action): bool => !is_array($action)) !== []) {
                throw new SoFinderException('Image actions must be an array of objects.', 'invalid_image_actions', 400);
            }
            $save = $data['save'] ?? [];
            if (!is_array($save)) {
                throw new SoFinderException('Image save settings must be an object.', 'invalid_image_save', 400);
            }
            $result = $this->images->applyActions($resource, $path, array_values($data['actions']), $save);

            return new JsonResponse(OperationResult::success($result));
        }
        $entry = ($data['operation'] ?? 'transform') === 'crop'
            ? $this->images->crop(
                $resource,
                $path,
                (int) ($data['x'] ?? -1),
                (int) ($data['y'] ?? -1),
                (int) ($data['width'] ?? 0),
                (int) ($data['height'] ?? 0),
            )
            : $this->images->edit(
                $resource,
                $path,
                (int) ($data['rotation'] ?? 0),
                (int) ($data['width'] ?? 0),
                (int) ($data['height'] ?? 0),
            );

        return new JsonResponse(OperationResult::success(['entry' => $entry]));
    }
}
