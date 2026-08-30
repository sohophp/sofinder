<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Http\Action\ImageInfoAction;
use SohoPHP\SoFinder\Image\ImageManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use SohoPHP\SoFinder\Asset\AssetOperationPublisher;

final class ImageController
{
    public function __construct(
        private readonly ImageManager $images,
        private readonly CsrfGuard $csrf,
        private readonly ?FeaturePolicy $features = null,
        private readonly ?AssetOperationPublisher $events = null,
        private readonly ?ImageInfoAction $infoAction = null,
        private readonly ?ImageStreamActions $streamActions = null,
        private readonly ?ImageMutationActions $mutationActions = null,
    ) {
    }

    public function thumbnail(Request $request): Response
    {
        if ($this->streamActions !== null) return SymfonyStreamResponseFactory::create($this->streamActions->thumbnail->execute(SymfonyRequestContextProvider::fromRequest($request)));
        $thumbnail = $this->images->thumbnail(
            (string) $request->query->get('resource', 'Images'),
            (string) $request->query->get('path', ''),
            $request->query->getInt('width', 240),
            $request->query->getInt('height', 180),
        );
        $response = new BinaryFileResponse($thumbnail['path']);
        $response->headers->set('Content-Type', $thumbnail['mimeType']);
        $response->setPrivate();
        $response->setMaxAge(86400);
        $response->setAutoEtag();
        $response->isNotModified($request);
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }

    public function info(Request $request): JsonResponse
    {
        if ($this->infoAction !== null) {
            $result = $this->infoAction->execute(SymfonyRequestContextProvider::fromRequest($request));

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        return new JsonResponse(OperationResult::success($this->images->info(
            (string) $request->query->get('resource', 'Images'),
            (string) $request->query->get('path', ''),
        )));
    }

    public function variant(Request $request): Response
    {
        if ($this->streamActions !== null) return SymfonyStreamResponseFactory::create($this->streamActions->variant->execute(SymfonyRequestContextProvider::fromRequest($request)));
        $variant = $this->images->variant($request->query->getString('resource', 'Images'), $request->query->getString('path'), $request->query->getInt('width'), strtolower($request->query->getString('format', 'original')));
        $response = new BinaryFileResponse($variant['path']); $response->headers->set('Content-Type', $variant['mimeType']); $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->setPrivate()->setMaxAge(2592000)->setAutoEtag(); $response->isNotModified($request); return $response;
    }

    public function edit(Request $request): JsonResponse
    {
        if ($this->mutationActions !== null) {
            return $this->mutation($this->mutationActions->edit, $request);
        }
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
            ($this->features ?? new FeaturePolicy())->assertEnabled('image_processing');
            if (!is_array($data['actions']) || array_filter($data['actions'], static fn (mixed $action): bool => !is_array($action)) !== []) {
                throw new SoFinderException('Image actions must be an array of objects.', 'invalid_image_actions', 400);
            }
            $save = $data['save'] ?? [];
            if (!is_array($save)) {
                throw new SoFinderException('Image save settings must be an object.', 'invalid_image_save', 400);
            }
            $result = $this->process($resource, $path, fn (): array => $this->images->applyActions($resource, $path, array_values($data['actions']), $save));

            return new JsonResponse(OperationResult::success($result));
        }
        ($this->features ?? new FeaturePolicy())->assertEnabled('image_editing');
        $entry = $this->process($resource, $path, fn () => ($data['operation'] ?? 'transform') === 'crop'
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
            ));

        $request->attributes->set('_sofinder_deprecated_fields', 'operation,rotation,width,height,x,y');

        return new JsonResponse(OperationResult::success(['entry' => $entry]));
    }

    public function batch(Request $request): JsonResponse
    {
        if ($this->mutationActions !== null) {
            return $this->mutation($this->mutationActions->batch, $request);
        }
        ($this->features ?? new FeaturePolicy())->assertEnabled('image_processing');
        $this->csrf->assertMutation($request);
        try {
            $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400);
        }
        if (!is_array($data) || !is_array($data['paths'] ?? null) || !is_array($data['actions'] ?? null) || !is_array($data['save'] ?? [])) {
            throw new SoFinderException('Batch image paths, actions and save settings are invalid.', 'invalid_image_batch', 400);
        }
        if (array_filter($data['actions'], static fn (mixed $action): bool => !is_array($action)) !== []) {
            throw new SoFinderException('Image actions must be an array of objects.', 'invalid_image_actions', 400);
        }

        $resource = (string) ($data['resource'] ?? 'Images'); $paths = array_values($data['paths']);
        return new JsonResponse(OperationResult::success($this->process($resource, (string) ($paths[0] ?? ''), fn (): array => $this->images->applyBatch(
            $resource, $paths, array_values($data['actions']), $data['save'],
        ), ['batchItems' => count($paths)])));
    }

    /**
     * @param \Closure():mixed $operation
     * @param array<string,mixed> $attributes
     */
    private function process(string $resource, string $path, \Closure $operation, array $attributes = []): mixed
    {
        $id = $this->events?->operationId();
        if ($id !== null) $this->events?->dispatch($id, 'image.process', 'before', $resource, $path, attributes: $attributes);
        try { $result = $operation(); }
        catch (\Throwable $error) { if ($id !== null) $this->events?->dispatch($id, 'image.process', 'failed', $resource, $path, attributes: ['errorCode' => $this->events?->errorCode($error) ?? 'operation_failed'] + $attributes); throw $error; }
        if ($id !== null) $this->events?->dispatch($id, 'image.process', 'after', $resource, $path, attributes: $attributes);
        return $result;
    }

    private function mutation(MutationActionInterface $action, Request $request): JsonResponse
    {
        $context = SymfonyRequestContextProvider::fromRequest($request);
        $action->assertAllowed($context, $request->request->all());
        try {
            $input = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new SoFinderException('The JSON request body is invalid.', 'invalid_json', 400);
        }
        if (!is_array($input)) {
            throw new SoFinderException('The JSON request body must be an object.', 'invalid_json', 400);
        }
        $result = $action->execute($context, $input);

        return new JsonResponse($result->payload, $result->status, $result->headers);
    }
}
