<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Value\OperationResult;
use SohoPHP\SoFinder\Maintenance\MaintenanceCoordinator;
use SohoPHP\SoFinder\Maintenance\MaintenanceTask;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;
use SohoPHP\SoFinder\Asset\AssetReferenceFactory;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;

final readonly class ChunkUploadController
{
    public function __construct(
        private FileManager $files,
        private ChunkUploadStoreInterface $chunks,
        private CsrfGuard $csrf,
        private ?MaintenanceCoordinator $maintenance = null,
        private UploadNamePolicy $uploadNames = new UploadNamePolicy(),
        private ?AssetReferenceFactory $assetReferences = null,
        private ?WorkspaceProvider $workspaces = null,
        private ?ChunkUploadActions $actions = null,
    )
    {
    }

    public function upload(Request $request): JsonResponse
    {
        if ($this->actions?->upload !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $input = $request->request->all();
            $this->actions->upload->assertAllowed($context, $input);
            $uploaded = $request->files->get('chunk');
            $input['chunk'] = $uploaded instanceof UploadedFile && $uploaded->isValid()
                ? UploadedFileInput::fromPath($uploaded->getPathname(), $uploaded->getClientOriginalName(), (int) $uploaded->getSize(), $uploaded->getError())
                : null;
            $result = $this->actions->upload->execute($context, $input);

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertMutation($request);
        $uploaded = $request->files->get('chunk');
        if (!$uploaded instanceof UploadedFile || !$uploaded->isValid()) {
            throw new SoFinderException('No valid upload chunk was received.', 'invalid_upload_chunk', 400);
        }
        $id = (string) $request->request->get('uploadId', '');
        $resource = (string) $request->request->get('resource', 'Files');
        $path = (string) $request->request->get('path', '');
        $name = $this->uploadNames->normalize((string) $request->request->get('name', ''));
        $limit = $this->files->uploadLimit($resource, $path, $name);
        $stream = @fopen($uploaded->getPathname(), 'rb');
        if ($stream === false) throw new SoFinderException('Unable to read the upload chunk.', 'invalid_upload_chunk', 400);
        try {
            $state = $this->chunks->accept(
                $id,
                $request->request->getInt('index', -1),
                $request->request->getInt('total'),
                $stream,
                $limit,
                [
                    'resource' => $resource,
                    'path' => $path,
                    'name' => $name,
                    'overwrite' => $request->request->getBoolean('overwrite'),
                    'autoRename' => $request->request->getBoolean('autoRename'),
                    'workspace' => $this->workspaceId(),
                ],
            );
        } finally { fclose($stream); }
        if (!$state['complete']) return new JsonResponse(OperationResult::success(['complete' => false]));
        if (!isset($state['path'], $state['size'])) {
            throw new SoFinderException('The completed upload session is missing its assembled file.', 'chunk_assembly_failed', 500);
        }
        $session = $this->chunks->status($id);
        $this->assertSessionWorkspace($session);

        $assembled = @fopen((string) $state['path'], 'rb');
        if ($assembled === false) throw new SoFinderException('Unable to read the assembled upload.', 'chunk_assembly_failed', 500);
        try {
            $entry = $this->files->upload(
                $session['resource'],
                $session['path'],
                $session['name'],
                (int) $state['size'],
                $assembled,
                $session['overwrite'],
                $session['autoRename'],
            );
        } finally {
            fclose($assembled);
            $this->chunks->discard($id);
        }
        $this->maintenance?->trigger(MaintenanceTask::Uploads);

        return new JsonResponse(OperationResult::success(['complete' => true, 'entry' => $entry, 'asset' => $this->assetReferences?->create($session['resource'], $entry)]), 201);
    }

    public function cancel(Request $request, string $id): JsonResponse
    {
        if ($this->actions !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->actions->cancel->assertAllowed($context, $request->request->all());
            $result = $this->actions->cancel->execute($context, ['id' => $id]);

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertMutation($request);
        $this->assertSessionWorkspace($this->chunks->status($id));
        $this->chunks->discard($id);

        return new JsonResponse(OperationResult::success());
    }

    public function status(string $id): JsonResponse
    {
        if ($this->actions !== null) {
            $result = $this->actions->status->execute(new \SohoPHP\SoFinder\Value\RequestContext(attributes: ['id' => $id]));

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $state = $this->chunks->status($id);
        $this->assertSessionWorkspace($state);
        $this->files->uploadLimit($state['resource'], $state['path'], $state['name']);

        return new JsonResponse(OperationResult::success($state));
    }

    private function workspaceId(): string
    {
        return $this->workspaces?->current()->id ?? '';
    }

    /** @param array<string,mixed> $state */
    private function assertSessionWorkspace(array $state): void
    {
        if ((string) ($state['workspace'] ?? '') !== $this->workspaceId()) {
            throw new SoFinderException('The upload session does not belong to the current workspace.', 'upload_session_not_found', 404);
        }
    }
}
