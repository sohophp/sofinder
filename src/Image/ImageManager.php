<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Image;

use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Value\Entry;

final readonly class ImageManager
{
    public function __construct(
        private FileManager $files,
        private ImageProcessorInterface $processor,
        private string $cacheDirectory,
        /** @var array<string, array{width:int,height:int,quality:int}> */
        private array $presets = [],
        private ImageFormatRegistry $formats = new ImageFormatRegistry(),
    ) {
    }

    /** @return array{path:string,mimeType:string} */
    public function thumbnail(string $resource, string $path, int $width, int $height): array
    {
        $entry = $this->imageEntry($resource, $path);
        $width = max(32, min($width, 512));
        $height = max(32, min($height, 512));
        $directory = rtrim($this->cacheDirectory, DIRECTORY_SEPARATOR) . '/thumbnails';
        if (!is_dir($directory) && !@mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new SoFinderException('Unable to create the thumbnail cache.', 'image_processing_failed', 500);
        }
        $this->maintainCache($directory);
        $processorVersion = $this->processor instanceof ImageCapabilityProviderInterface ? $this->processor->cacheVersion() : get_debug_type($this->processor);
        $cachePath = $directory . '/' . hash('sha256', implode('|', [$processorVersion, $resource, $entry->path, $entry->modifiedAt, $entry->size, $width, $height])) . '.png';
        if (!is_file($cachePath)) {
            $temporary = tempnam($directory, '.sofinder-thumbnail-');
            if ($temporary === false) {
                throw new SoFinderException('Unable to create a thumbnail work file.', 'image_processing_failed', 500);
            }
            try {
                $this->process($resource, $path, static fn (ImageProcessorInterface $processor, string $source, string $destination) => $processor->thumbnail($source, $destination, $width, $height), $temporary);
                if (!@rename($temporary, $cachePath) && !is_file($cachePath)) {
                    throw new SoFinderException('Unable to store the thumbnail.', 'image_processing_failed', 500);
                }
            } finally {
                @unlink($temporary);
            }
        }

        return ['path' => $cachePath, 'mimeType' => 'image/png'];
    }

    public function edit(string $resource, string $path, int $rotation, int $width, int $height): Entry
    {
        $entry = $this->imageEntry($resource, $path);
        $destination = tempnam(sys_get_temp_dir(), 'sofinder-image-output-');
        if ($destination === false) {
            throw new SoFinderException('Unable to create an image work file.', 'image_processing_failed', 500);
        }
        try {
            $this->process($resource, $path, static fn (ImageProcessorInterface $processor, string $source, string $output) => $processor->transform($source, $output, $rotation, $width, $height), $destination);
            $stream = fopen($destination, 'rb');
            if ($stream === false) {
                throw new SoFinderException('Unable to read the processed image.', 'image_processing_failed', 500);
            }
            try {
                $directory = dirname($entry->path);

                return $this->files->upload($resource, $directory === '.' ? '' : $directory, $entry->name, (int) filesize($destination), $stream, true);
            } finally {
                fclose($stream);
            }
        } finally {
            @unlink($destination);
        }
    }

    /** @return array{width: int, height: int} */
    public function info(string $resource, string $path): array
    {
        $this->imageEntry($resource, $path);

        return $this->withSource(
            $resource,
            $path,
            fn (string $source): array => $this->processor->dimensions($source),
        );
    }

    public function crop(string $resource, string $path, int $x, int $y, int $width, int $height): Entry
    {
        return $this->rewrite(
            $resource,
            $path,
            static fn (ImageProcessorInterface $processor, string $source, string $output) => $processor->crop($source, $output, $x, $y, $width, $height),
        );
    }

    /**
     * @param list<array<string, mixed>> $actions
     * @param array{mode?:string,name?:string} $save
     * @return array{entry:Entry,original:array{width:int,height:int,size:int},result:array{width:int,height:int,size:int}}
     */
    public function applyActions(string $resource, string $path, array $actions, array $save = []): array
    {
        if ($actions === [] || count($actions) > 10) {
            throw new SoFinderException('An image edit requires between 1 and 10 actions.', 'invalid_image_actions', 422);
        }
        $entry = $this->imageEntry($resource, $path);
        $mode = (string) ($save['mode'] ?? 'copy');
        if (!in_array($mode, ['copy', 'overwrite'], true)) {
            throw new SoFinderException('The image save mode must be copy or overwrite.', 'invalid_save_mode', 422);
        }
        $source = tempnam(sys_get_temp_dir(), 'sofinder-image-source-');
        if ($source === false) {
            throw new SoFinderException('Unable to create an image work file.', 'image_processing_failed', 500);
        }
        $working = $source;
        try {
            $this->copySource($resource, $path, $source);
            if ($this->processor->isAnimated($source)) {
                throw new SoFinderException('Animated or multi-page images cannot be edited without losing content.', 'animated_image_edit_unsupported', 415);
            }
            $originalDimensions = $this->processor->dimensions($source);
            foreach ($actions as $action) {
                $output = tempnam(sys_get_temp_dir(), 'sofinder-image-action-');
                if ($output === false) {
                    throw new SoFinderException('Unable to create an image action file.', 'image_processing_failed', 500);
                }
                try {
                    $type = (string) ($action['type'] ?? '');
                    $quality = (int) ($action['quality'] ?? 88);
                    if ($type === 'crop') {
                        $this->processor->crop($working, $output, (int) ($action['x'] ?? -1), (int) ($action['y'] ?? -1), (int) ($action['width'] ?? 0), (int) ($action['height'] ?? 0), $quality);
                    } elseif ($type === 'rotate') {
                        $this->processor->transform($working, $output, (int) ($action['degrees'] ?? 0), 0, 0, $quality);
                    } elseif ($type === 'resize') {
                        $this->processor->transform($working, $output, 0, (int) ($action['width'] ?? 0), (int) ($action['height'] ?? 0), $quality);
                    } elseif ($type === 'preset') {
                        $name = (string) ($action['name'] ?? '');
                        $preset = $this->presets[$name] ?? null;
                        if ($preset === null) {
                            throw new SoFinderException('The requested image preset does not exist.', 'unknown_image_preset', 404);
                        }
                        $this->processor->transform($working, $output, 0, $preset['width'], $preset['height'], $preset['quality']);
                    } else {
                        throw new SoFinderException('The image action is not supported.', 'invalid_image_action', 422);
                    }
                } catch (\Throwable $exception) {
                    @unlink($output);
                    throw $exception;
                }
                if ($working !== $source) {
                    @unlink($working);
                }
                $working = $output;
            }

            $resultDimensions = $this->processor->dimensions($working);
            $directory = dirname($entry->path);
            $directory = $directory === '.' ? '' : $directory;
            $name = $mode === 'overwrite'
                ? $entry->name
                : trim((string) ($save['name'] ?? ''));
            if ($mode === 'copy' && $name === '') {
                $name = $this->suggestCopyName($resource, $directory, $entry);
            } elseif ($mode === 'copy' && pathinfo($name, PATHINFO_EXTENSION) === '') {
                $extension = $this->outputExtension($entry);
                if ($extension !== '') {
                    $name .= '.' . $extension;
                }
            } elseif ($mode === 'copy') {
                $extension = $this->outputExtension($entry);
                $requestedExtension = (string) pathinfo($name, PATHINFO_EXTENSION);
                if ($extension !== '' && $requestedExtension !== $extension) {
                    throw new SoFinderException(
                        sprintf('The edited image must keep its original .%s file extension.', $extension),
                        'image_extension_change_not_allowed',
                        422,
                    );
                }
            }
            $stream = fopen($working, 'rb');
            if ($stream === false) {
                throw new SoFinderException('Unable to read the processed image.', 'image_processing_failed', 500);
            }
            try {
                $result = $this->files->upload($resource, $directory, $name, (int) filesize($working), $stream, $mode === 'overwrite');
            } finally {
                fclose($stream);
            }

            return [
                'entry' => $result,
                'original' => $originalDimensions + ['size' => $entry->size],
                'result' => $resultDimensions + ['size' => $result->size],
            ];
        } finally {
            if ($working !== $source) {
                @unlink($working);
            }
            @unlink($source);
        }
    }

    /** @return array<string, array{width:int,height:int,quality:int}> */
    public function presets(): array
    {
        return $this->presets;
    }

    private function imageEntry(string $resource, string $path): Entry
    {
        $entry = $this->files->entry($resource, $path);
        if ($entry->directory || $entry->mimeType === null || !$this->processor->supports($entry->mimeType)) {
            throw new SoFinderException('The selected entry is not a supported image.', 'unsupported_image', 415);
        }

        return $entry;
    }

    /** @param callable(ImageProcessorInterface, string, string):void $operation */
    private function rewrite(string $resource, string $path, callable $operation): Entry
    {
        $entry = $this->imageEntry($resource, $path);
        $destination = tempnam(sys_get_temp_dir(), 'sofinder-image-output-');
        if ($destination === false) {
            throw new SoFinderException('Unable to create an image work file.', 'image_processing_failed', 500);
        }
        try {
            $this->process($resource, $path, $operation, $destination);
            $stream = fopen($destination, 'rb');
            if ($stream === false) {
                throw new SoFinderException('Unable to read the processed image.', 'image_processing_failed', 500);
            }
            try {
                $directory = dirname($entry->path);

                return $this->files->upload($resource, $directory === '.' ? '' : $directory, $entry->name, (int) filesize($destination), $stream, true);
            } finally {
                fclose($stream);
            }
        } finally {
            @unlink($destination);
        }
    }

    /** @param callable(ImageProcessorInterface, string, string):void $operation */
    private function process(string $resource, string $path, callable $operation, string $destination): void
    {
        $this->withSource($resource, $path, function (string $source) use ($operation, $destination): void {
            $operation($this->processor, $source, $destination);
        });
    }

    /**
     * @template T
     * @param \Closure(string): T $operation
     * @return T
     */
    private function withSource(string $resource, string $path, \Closure $operation): mixed
    {
        $source = tempnam(sys_get_temp_dir(), 'sofinder-image-source-');
        if ($source === false) {
            throw new SoFinderException('Unable to create an image work file.', 'image_processing_failed', 500);
        }
        $input = null;
        try {
            $input = $this->files->read($resource, $path);
            $output = fopen($source, 'wb');
            if ($output === false) {
                throw new SoFinderException('Unable to prepare the image.', 'image_processing_failed', 500);
            }
            try {
                if (stream_copy_to_stream($input, $output) === false) {
                    throw new SoFinderException('Unable to prepare the image.', 'image_processing_failed', 500);
                }
            } finally {
                fclose($output);
            }
            return $operation($source);
        } finally {
            if (is_resource($input)) {
                fclose($input);
            }
            @unlink($source);
        }
    }

    private function copySource(string $resource, string $path, string $destination): void
    {
        $input = $this->files->read($resource, $path);
        $output = @fopen($destination, 'wb');
        if ($output === false) {
            fclose($input);
            throw new SoFinderException('Unable to prepare the image.', 'image_processing_failed', 500);
        }
        try {
            if (stream_copy_to_stream($input, $output) === false) {
                throw new SoFinderException('Unable to prepare the image.', 'image_processing_failed', 500);
            }
        } finally {
            fclose($input);
            fclose($output);
        }
    }

    private function suggestCopyName(string $resource, string $directory, Entry $entry): string
    {
        $extension = $this->outputExtension($entry);
        $originalExtension = (string) pathinfo($entry->name, PATHINFO_EXTENSION);
        $stem = $originalExtension === '' ? $entry->name : substr($entry->name, 0, -(strlen($originalExtension) + 1));
        for ($index = 0; $index <= 999; ++$index) {
            $candidate = $stem . '-edited' . ($index === 0 ? '' : '-' . $index) . ($extension === '' ? '' : '.' . $extension);
            $path = ($directory === '' ? '' : $directory . '/') . $candidate;
            try {
                $this->files->entry($resource, $path);
            } catch (\SohoPHP\SoFinder\Exception\NotFoundException) {
                return $candidate;
            }
        }

        throw new SoFinderException('Unable to find an available edited image name.', 'conflict', 409);
    }

    private function outputExtension(Entry $entry): string
    {
        $extension = (string) pathinfo($entry->name, PATHINFO_EXTENSION);
        $mimeFormat = $entry->mimeType === null ? null : $this->formats->formatForMime($entry->mimeType);
        if ($extension !== '' && $this->formats->formatForExtension(strtolower($extension)) === $mimeFormat) {
            return $extension;
        }

        return $entry->mimeType === null ? '' : (string) $this->formats->preferredExtensionForMime($entry->mimeType);
    }

    private function maintainCache(string $directory): void
    {
        static $maintained = false;
        if ($maintained) {
            return;
        }
        $maintained = true;
        $files = [];
        $expiry = time() - 2_592_000;
        foreach (new \FilesystemIterator($directory, \FilesystemIterator::SKIP_DOTS | \FilesystemIterator::CURRENT_AS_FILEINFO) as $file) {
            if (!$file instanceof \SplFileInfo) {
                continue;
            }
            if (!$file->isFile() || $file->isLink()) {
                continue;
            }
            if ($file->getMTime() < $expiry) {
                @unlink($file->getPathname());
                continue;
            }
            $files[] = [$file->getMTime(), $file->getPathname()];
        }
        if (count($files) <= 5_000) {
            return;
        }
        usort($files, static fn (array $left, array $right): int => $left[0] <=> $right[0]);
        foreach (array_slice($files, 0, count($files) - 5_000) as [, $file]) {
            @unlink($file);
        }
    }
}
