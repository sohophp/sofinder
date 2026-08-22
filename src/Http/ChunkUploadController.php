<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final readonly class ChunkUploadController
{
    public function __construct(private FileManager $files, private ChunkUploadStoreInterface $chunks, private CsrfGuard $csrf)
    {
    }

    public function upload(Request $request): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $uploaded = $request->files->get('chunk');
        if (!$uploaded instanceof UploadedFile || !$uploaded->isValid()) {
            throw new SoFinderException('No valid upload chunk was received.', 'invalid_upload_chunk', 400);
        }
        $id = (string) $request->request->get('uploadId', '');
        $resource = (string) $request->request->get('resource', 'Files');
        $path = (string) $request->request->get('path', '');
        $name = (string) $request->request->get('name', '');
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
                ['resource' => $resource, 'path' => $path, 'name' => $name, 'overwrite' => $request->request->getBoolean('overwrite')],
            );
        } finally { fclose($stream); }
        if (!$state['complete']) return new JsonResponse(OperationResult::success(['complete' => false]));
        if (!isset($state['path'], $state['size'])) {
            throw new SoFinderException('The completed upload session is missing its assembled file.', 'chunk_assembly_failed', 500);
        }

        $assembled = @fopen((string) $state['path'], 'rb');
        if ($assembled === false) throw new SoFinderException('Unable to read the assembled upload.', 'chunk_assembly_failed', 500);
        try {
            $entry = $this->files->upload($resource, $path, $name, (int) $state['size'], $assembled, $request->request->getBoolean('overwrite'));
        } finally {
            fclose($assembled);
            $this->chunks->discard($id);
        }
        $this->chunks->cleanupExpired();

        return new JsonResponse(OperationResult::success(['complete' => true, 'entry' => $entry]), 201);
    }

    public function cancel(Request $request, string $id): JsonResponse
    {
        $this->csrf->assertMutation($request);
        $this->chunks->discard($id);

        return new JsonResponse(OperationResult::success());
    }

    public function status(string $id): JsonResponse
    {
        $state = $this->chunks->status($id);
        $this->files->uploadLimit($state['resource'], $state['path'], $state['name']);

        return new JsonResponse(OperationResult::success($state));
    }
}
