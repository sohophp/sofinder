<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Upload;

use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;

final readonly class ChunkUploadManager
{
    public function __construct(
        private string $root,
        private ActorProviderInterface $actors,
        private int $maximumChunkBytes = 5_242_880,
        private int $maximumChunks = 200,
    ) {
    }

    /**
     * @param resource $stream
     * @return array{complete:bool,path?:string,size?:int}
     */
    public function accept(string $id, int $index, int $total, mixed $stream, int $maximumFileBytes): array
    {
        $directory = $this->directory($id, true);
        if ($index < 0 || $total < 1 || $total > $this->maximumChunks || $index >= $total || !is_resource($stream)) {
            throw new SoFinderException('The chunk upload coordinates are invalid.', 'invalid_upload_chunk', 400);
        }
        $lock = @fopen($directory . '/session.lock', 'c+b');
        if ($lock === false || !flock($lock, LOCK_EX)) {
            if (is_resource($lock)) fclose($lock);
            throw new SoFinderException('The chunk upload session is busy.', 'chunk_session_unavailable', 503);
        }
        try {
            $part = $directory . '/part-' . $index;
            $temporary = $part . '.tmp-' . bin2hex(random_bytes(6));
            $output = @fopen($temporary, 'wb');
            if ($output === false) {
                throw new SoFinderException('Unable to stage the upload chunk.', 'chunk_write_failed', 500);
            }
            $written = 0;
            try {
                while (!feof($stream)) {
                    $chunk = fread($stream, 65_536);
                    if ($chunk === false) throw new SoFinderException('Unable to read the upload chunk.', 'invalid_upload_chunk', 400);
                    if ($chunk === '') break;
                    $written += strlen($chunk);
                    if ($written > $this->maximumChunkBytes || $written > $maximumFileBytes) {
                        throw new SoFinderException('The upload chunk exceeds the configured limit.', 'upload_chunk_too_large', 413);
                    }
                    if (fwrite($output, $chunk) !== strlen($chunk)) throw new SoFinderException('Unable to save the upload chunk.', 'chunk_write_failed', 500);
                }
            } finally {
                fclose($output);
            }
            if (!@rename($temporary, $part)) {
                @unlink($temporary);
                throw new SoFinderException('Unable to publish the upload chunk.', 'chunk_write_failed', 500);
            }
            @touch($directory);

            $size = 0;
            for ($partIndex = 0; $partIndex < $total; ++$partIndex) {
                $candidate = $directory . '/part-' . $partIndex;
                if (!is_file($candidate)) return ['complete' => false];
                $size += (int) filesize($candidate);
                if ($size > $maximumFileBytes) {
                    throw new SoFinderException('The assembled upload exceeds the configured file size.', 'file_too_large', 413);
                }
            }
            $assembled = $directory . '/assembled';
            $combined = @fopen($assembled . '.tmp', 'wb');
            if ($combined === false) throw new SoFinderException('Unable to assemble the upload.', 'chunk_assembly_failed', 500);
            try {
                for ($partIndex = 0; $partIndex < $total; ++$partIndex) {
                    $input = @fopen($directory . '/part-' . $partIndex, 'rb');
                    if ($input === false) throw new SoFinderException('An upload chunk disappeared during assembly.', 'chunk_assembly_failed', 500);
                    try {
                        if (stream_copy_to_stream($input, $combined) === false) throw new SoFinderException('Unable to assemble the upload.', 'chunk_assembly_failed', 500);
                    } finally { fclose($input); }
                }
            } finally { fclose($combined); }
            if (!@rename($assembled . '.tmp', $assembled)) throw new SoFinderException('Unable to publish the assembled upload.', 'chunk_assembly_failed', 500);

            return ['complete' => true, 'path' => $assembled, 'size' => $size];
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    public function discard(string $id): void
    {
        $directory = $this->directory($id, false);
        if (!is_dir($directory)) return;
        foreach (new \FilesystemIterator($directory, \FilesystemIterator::SKIP_DOTS) as $file) {
            if ($file->isFile() && !$file->isLink()) @unlink($file->getPathname());
        }
        @rmdir($directory);
    }

    public function cleanupExpired(): void
    {
        $actor = $this->actorRoot(false);
        if (!is_dir($actor)) return;
        foreach (new \FilesystemIterator($actor, \FilesystemIterator::SKIP_DOTS) as $directory) {
            if ($directory->isDir() && !$directory->isLink() && $directory->getMTime() < time() - 86_400) $this->discard($directory->getFilename());
        }
    }

    private function directory(string $id, bool $create): string
    {
        if (preg_match('/^[a-zA-Z0-9_-]{16,80}$/D', $id) !== 1) {
            throw new SoFinderException('The chunk upload identifier is invalid.', 'invalid_upload_chunk', 400);
        }
        $directory = $this->actorRoot($create) . '/' . $id;
        if ($create && !is_dir($directory) && !@mkdir($directory, 0770) && !is_dir($directory)) {
            throw new SoFinderException('Unable to create the chunk upload session.', 'chunk_session_unavailable', 503);
        }

        return $directory;
    }

    private function actorRoot(bool $create): string
    {
        $directory = rtrim($this->root, '/') . '/' . hash('sha256', $this->actors->actorId());
        if ($create && !is_dir($directory) && !@mkdir($directory, 0770, true) && !is_dir($directory)) {
            throw new SoFinderException('Unable to access the private chunk upload directory.', 'chunk_session_unavailable', 503);
        }

        return $directory;
    }
}
