<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Preview;

use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;

final readonly class DocumentPreviewManager
{
    private const OFFICE_EXTENSIONS = ['doc', 'docx', 'odt', 'rtf', 'xls', 'xlsx', 'ods', 'ppt', 'pptx', 'odp'];

    public function __construct(
        private FileManager $files,
        private string $cacheDirectory,
        private bool $pdfEnabled = true,
        private bool $officeEnabled = false,
        private string $officeBinary = '/usr/bin/libreoffice',
        private int $timeoutSeconds = 30,
        private int $maximumBytes = 52_428_800,
    ) {
    }

    /** @return array{file:string,name:string,source:string} */
    public function preview(string $resource, string $path): array
    {
        $entry = $this->files->entry($resource, $path);
        if ($entry->directory) throw new SoFinderException('Folders cannot be previewed as documents.', 'document_preview_unsupported', 415);
        if ($entry->size > $this->maximumBytes) throw new SoFinderException('The document is too large for interactive preview.', 'document_preview_too_large', 413);
        $extension = strtolower(pathinfo($entry->name, PATHINFO_EXTENSION));
        $isPdf = $extension === 'pdf' && strtolower($entry->mimeType ?? '') === 'application/pdf';
        $isOffice = in_array($extension, self::OFFICE_EXTENSIONS, true);
        if (($isPdf && !$this->pdfEnabled) || ($isOffice && !$this->officeEnabled) || (!$isPdf && !$isOffice)) {
            throw new SoFinderException('This document type does not have an enabled previewer.', 'document_preview_unsupported', 415);
        }
        if ($isOffice && (!is_file($this->officeBinary) || !is_executable($this->officeBinary) || !function_exists('proc_open'))) {
            throw new SoFinderException('The Office preview converter is unavailable.', 'office_preview_unavailable', 503);
        }
        $directory = rtrim($this->cacheDirectory, '/') . '/document-previews';
        if (!is_dir($directory) && !@mkdir($directory, 0770, true) && !is_dir($directory)) {
            throw new SoFinderException('Unable to create the document preview cache.', 'document_preview_failed', 500);
        }
        $key = hash('sha256', implode("\0", [$resource, $entry->path, (string) $entry->size, (string) $entry->modifiedAt]));
        $target = $directory . '/' . $key . '.pdf';
        $lock = @fopen($target . '.lock', 'c+b');
        if ($lock === false || !flock($lock, LOCK_EX)) {
            if (is_resource($lock)) fclose($lock);
            throw new SoFinderException('Unable to lock the document preview.', 'document_preview_failed', 500);
        }
        try {
            if (!is_file($target) || filesize($target) === 0) {
                $workspace = $directory . '/work-' . bin2hex(random_bytes(12));
                if (!@mkdir($workspace, 0700)) throw new SoFinderException('Unable to create the document preview workspace.', 'document_preview_failed', 500);
                try {
                    $source = $workspace . '/source.' . $extension;
                    $this->copySource($resource, $entry->path, $source);
                    if ($isPdf) {
                        if (!@rename($source, $target)) throw new SoFinderException('Unable to cache the PDF preview.', 'document_preview_failed', 500);
                    } else {
                        $converted = $this->convertOffice($source, $workspace);
                        if (!@rename($converted, $target)) throw new SoFinderException('Unable to cache the Office preview.', 'document_preview_failed', 500);
                    }
                    @chmod($target, 0660);
                } finally {
                    $this->removeDirectory($workspace);
                }
            }
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }

        return ['file' => $target, 'name' => pathinfo($entry->name, PATHINFO_FILENAME) . '.pdf', 'source' => $isPdf ? 'pdf' : 'office'];
    }

    private function copySource(string $resource, string $path, string $destination): void
    {
        $input = $this->files->read($resource, $path);
        $output = @fopen($destination, 'wb');
        if ($output === false) {
            fclose($input);
            throw new SoFinderException('Unable to prepare the document preview source.', 'document_preview_failed', 500);
        }
        try {
            $copied = stream_copy_to_stream($input, $output, $this->maximumBytes + 1);
            if ($copied === false || $copied > $this->maximumBytes) throw new SoFinderException('The document is too large for interactive preview.', 'document_preview_too_large', 413);
        } finally {
            fclose($input);
            fclose($output);
        }
    }

    private function convertOffice(string $source, string $workspace): string
    {
        $profile = $workspace . '/profile';
        $command = [$this->officeBinary, '--headless', '--nologo', '--nodefault', '--nolockcheck', '--norestore', '-env:UserInstallation=file://' . $profile, '--convert-to', 'pdf', '--outdir', $workspace, $source];
        $pipes = [];
        $process = @proc_open($command, [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, $workspace, null, ['bypass_shell' => true]);
        if (!is_resource($process)) throw new SoFinderException('Unable to start the Office preview converter.', 'office_preview_unavailable', 503);
        fclose($pipes[0]);
        stream_set_blocking($pipes[1], false);
        stream_set_blocking($pipes[2], false);
        $deadline = microtime(true) + $this->timeoutSeconds;
        $exitCode = null;
        try {
            do {
                $status = proc_get_status($process);
                if (!$status['running']) { $exitCode = $status['exitcode']; break; }
                if (microtime(true) >= $deadline) {
                    proc_terminate($process, 9);
                    throw new SoFinderException('The Office preview conversion timed out.', 'document_preview_failed', 503);
                }
                usleep(50_000);
            } while (true);
            stream_get_contents($pipes[1], 4096);
            stream_get_contents($pipes[2], 4096);
        } finally {
            fclose($pipes[1]);
            fclose($pipes[2]);
            proc_close($process);
        }
        $converted = $workspace . '/' . pathinfo($source, PATHINFO_FILENAME) . '.pdf';
        if ($exitCode !== 0 || !is_file($converted) || filesize($converted) === 0) {
            throw new SoFinderException('The Office document could not be converted safely.', 'document_preview_failed', 422);
        }

        return $converted;
    }

    private function removeDirectory(string $directory): void
    {
        if (!is_dir($directory)) return;
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS), \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $entry) {
            if ($entry->isLink() || $entry->isFile()) @unlink($entry->getPathname());
            elseif ($entry->isDir()) @rmdir($entry->getPathname());
        }
        @rmdir($directory);
    }
}
