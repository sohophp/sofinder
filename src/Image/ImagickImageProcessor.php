<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Image;

use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Value\ImageProcessingLimits;

/** Optional processor that only permits raster coders declared by ImageFormatRegistry. */
final readonly class ImagickImageProcessor implements ImageProcessorInterface
{
    public function __construct(
        private ImageFormatRegistry $formats = new ImageFormatRegistry(),
        private ImageProcessingLimits $limits = new ImageProcessingLimits(),
    ) {
    }

    public function supports(string $mimeType): bool
    {
        $format = $this->formats->formatForMime($mimeType);
        $coder = $format === null ? null : $this->formats->coder($format);

        return $coder !== null && extension_loaded('imagick') && \Imagick::queryFormats($coder) !== [];
    }

    public function dimensions(string $source): array
    {
        return $this->withResourceLimits(function () use ($source): array {
            $probe = $this->probe($source);
            $image = $this->read($source, $probe['coder'], true);
            try {
                $this->orient($image);

                return ['width' => $image->getImageWidth(), 'height' => $image->getImageHeight()];
            } finally {
                $this->release($image);
            }
        });
    }

    public function validate(string $source): array
    {
        return $this->withResourceLimits(function () use ($source): array {
            $probe = $this->probe($source);
            $image = $this->read($source, $probe['coder']);
            try {
                $width = 0;
                $height = 0;
                foreach ($image as $frame) {
                    $this->orient($frame);
                    $this->assertDimensions($frame->getImageWidth(), $frame->getImageHeight());
                    $frame->getImageSignature();
                    $width = max($width, $frame->getImageWidth());
                    $height = max($height, $frame->getImageHeight());
                }

                return ['width' => $width, 'height' => $height];
            } catch (\ImagickException $exception) {
                throw new SoFinderException('Unable to decode the image.', 'invalid_image', 415, $exception);
            } finally {
                $this->release($image);
            }
        });
    }

    public function isAnimated(string $source): bool
    {
        return $this->withResourceLimits(fn (): bool => $this->probe($source)['frames'] > 1);
    }

    public function thumbnail(string $source, string $destination, int $width, int $height): void
    {
        if ($width < 1 || $height < 1 || $width > 4096 || $height > 4096) {
            throw new SoFinderException('Image dimensions must be between 1 and 4096 pixels.', 'invalid_image_dimensions', 422);
        }
        $this->withResourceLimits(function () use ($source, $destination, $width, $height): void {
            $probe = $this->probe($source);
            $image = $this->read($source, $probe['coder'], true);
            try {
                $this->orient($image);
                $image->thumbnailImage($width, $height, true, false);
                $image->setImagePage(0, 0, 0, 0);
                $image->setImageFormat('PNG');
                $image->stripImage();
                $this->write($image, $destination);
            } finally {
                $this->release($image);
            }
        });
    }

    public function transform(string $source, string $destination, int $rotation, int $width, int $height, int $quality = 88): void
    {
        if (!in_array($rotation, [0, 90, 180, 270], true)) {
            throw new SoFinderException('Image rotation must be 0, 90, 180 or 270 degrees.', 'invalid_image_operation', 422);
        }
        $this->assertQuality($quality);
        $this->withResourceLimits(function () use ($source, $destination, $rotation, $width, $height, $quality): void {
            $probe = $this->probe($source);
            $this->assertEditableFrames($probe['frames']);
            $image = $this->read($source, $probe['coder'], true);
            try {
                $format = $image->getImageFormat();
                $this->orient($image);
                if ($rotation !== 0) {
                    $image->rotateImage(new \ImagickPixel('transparent'), $rotation);
                }
                $this->resize($image, $width, $height);
                $image->setImageFormat($format);
                $image->setImageCompressionQuality($quality);
                $image->stripImage();
                $this->write($image, $destination);
            } finally {
                $this->release($image);
            }
        });
    }

    public function crop(string $source, string $destination, int $x, int $y, int $width, int $height, int $quality = 88): void
    {
        $this->assertQuality($quality);
        $this->withResourceLimits(function () use ($source, $destination, $x, $y, $width, $height, $quality): void {
            $probe = $this->probe($source);
            $this->assertEditableFrames($probe['frames']);
            $image = $this->read($source, $probe['coder'], true);
            try {
                $format = $image->getImageFormat();
                $this->orient($image);
                if ($x < 0 || $y < 0 || $width < 1 || $height < 1 || $width > 4096 || $height > 4096 || $x + $width > $image->getImageWidth() || $y + $height > $image->getImageHeight()) {
                    throw new SoFinderException('The crop rectangle is outside the image.', 'invalid_crop', 422);
                }
                $image->cropImage($width, $height, $x, $y);
                $image->setImagePage(0, 0, 0, 0);
                $image->setImageFormat($format);
                $image->setImageCompressionQuality($quality);
                $image->stripImage();
                $this->write($image, $destination);
            } finally {
                $this->release($image);
            }
        });
    }

    /** @return array{format:string,coder:string,frames:int,totalPixels:int} */
    private function probe(string $source): array
    {
        if (!extension_loaded('imagick')) {
            throw new SoFinderException('Imagick is not installed.', 'unsupported_image', 415);
        }
        $format = $this->formats->detectFormat($source);
        $coder = $format === null ? null : $this->formats->coder($format);
        $mime = $format === null ? null : $this->formats->canonicalMime($format);
        if ($format === null || $coder === null || $mime === null || !$this->supports($mime)) {
            throw new SoFinderException('The image format is not supported.', 'unsupported_image', 415);
        }

        $probe = new \Imagick();
        try {
            $probe->pingImage($this->sourceSpecifier($coder, $source));
            $frames = $probe->getNumberImages();
            if ($frames < 1 || $frames > $this->limits->maxFrames) {
                throw new SoFinderException('The image contains too many frames.', 'image_frame_limit_exceeded', 413);
            }
            $totalPixels = 0;
            foreach ($probe as $frame) {
                $width = $frame->getImageWidth();
                $height = $frame->getImageHeight();
                $this->assertDimensions($width, $height);
                $totalPixels += $width * $height;
                if ($totalPixels > $this->limits->maxTotalPixels) {
                    throw new SoFinderException('The image exceeds the total decoded pixel limit.', 'image_pixel_limit_exceeded', 413);
                }
            }

            return ['format' => $format, 'coder' => $coder, 'frames' => $frames, 'totalPixels' => $totalPixels];
        } catch (SoFinderException $exception) {
            throw $exception;
        } catch (\ImagickException $exception) {
            throw new SoFinderException('Unable to inspect the image.', 'invalid_image', 415, $exception);
        } finally {
            $this->release($probe);
        }
    }

    private function read(string $source, string $coder, bool $firstFrameOnly = false): \Imagick
    {
        try {
            $image = new \Imagick();
            $image->readImage($this->sourceSpecifier($coder, $source, $firstFrameOnly));

            return $image;
        } catch (\ImagickException $exception) {
            throw new SoFinderException('Unable to decode the image.', 'invalid_image', 415, $exception);
        }
    }

    private function sourceSpecifier(string $coder, string $source, bool $firstFrameOnly = false): string
    {
        return $coder . ':' . $source . ($firstFrameOnly ? '[0]' : '');
    }

    private function resize(\Imagick $image, int $width, int $height): void
    {
        if ($width < 0 || $height < 0 || $width > 4096 || $height > 4096) {
            throw new SoFinderException('Image dimensions must be between 1 and 4096 pixels.', 'invalid_image_dimensions', 422);
        }
        if ($width === 0 && $height === 0) {
            return;
        }
        $scale = min($width > 0 ? $width / $image->getImageWidth() : INF, $height > 0 ? $height / $image->getImageHeight() : INF, 1.0);
        $image->resizeImage(max(1, (int) round($image->getImageWidth() * $scale)), max(1, (int) round($image->getImageHeight() * $scale)), \Imagick::FILTER_LANCZOS, 1);
    }

    private function orient(\Imagick $image): void
    {
        $orientation = $image->getImageOrientation();
        if ($orientation === 2) {
            $image->flopImage();
        } elseif ($orientation === 3) {
            $image->rotateImage(new \ImagickPixel('transparent'), 180);
        } elseif ($orientation === 4) {
            $image->flipImage();
        } elseif ($orientation === 5) {
            $image->rotateImage(new \ImagickPixel('transparent'), 90);
            $image->flopImage();
        } elseif ($orientation === 6) {
            $image->rotateImage(new \ImagickPixel('transparent'), 90);
        } elseif ($orientation === 7) {
            $image->rotateImage(new \ImagickPixel('transparent'), 90);
            $image->flipImage();
        } elseif ($orientation === 8) {
            $image->rotateImage(new \ImagickPixel('transparent'), -90);
        }
        $image->setImagePage(0, 0, 0, 0);
    }

    private function write(\Imagick $image, string $destination): void
    {
        try {
            if (!$image->writeImage($destination)) {
                throw new SoFinderException('Unable to save the processed image.', 'image_processing_failed', 500);
            }
        } catch (\ImagickException $exception) {
            throw new SoFinderException('Unable to save the processed image.', 'image_processing_failed', 500, $exception);
        }
    }

    private function assertDimensions(int $width, int $height): void
    {
        if ($width < 1 || $height < 1 || $width > $this->limits->maxWidth || $height > $this->limits->maxHeight || $width * $height > $this->limits->maxSingleFramePixels) {
            throw new SoFinderException('The image format or dimensions are not supported.', 'unsupported_image', 415);
        }
    }

    private function assertEditableFrames(int $frames): void
    {
        if ($frames > 1) {
            throw new SoFinderException('Animated or multi-page images cannot be edited without losing content.', 'animated_image_edit_unsupported', 415);
        }
    }

    private function assertQuality(int $quality): void
    {
        if ($quality < 1 || $quality > 100) {
            throw new SoFinderException('Image quality must be between 1 and 100.', 'invalid_image_quality', 422);
        }
    }

    /**
     * @template T
     * @param callable():T $operation
     * @return T
     */
    private function withResourceLimits(callable $operation): mixed
    {
        if (!extension_loaded('imagick')) {
            throw new SoFinderException('Imagick is not installed.', 'unsupported_image', 415);
        }
        $limits = [
            \Imagick::RESOURCETYPE_MEMORY => $this->limits->memoryBytes,
            \Imagick::RESOURCETYPE_MAP => $this->limits->mapBytes,
            \Imagick::RESOURCETYPE_DISK => $this->limits->diskBytes,
            \Imagick::RESOURCETYPE_THREAD => $this->limits->threads,
            \Imagick::RESOURCETYPE_TIME => $this->limits->timeoutSeconds,
        ];
        $previous = [];
        foreach ($limits as $type => $value) {
            $original = \Imagick::getResourceLimit($type);
            $maximumRestorable = $type === \Imagick::RESOURCETYPE_TIME ? 2_147_483_647 : PHP_INT_MAX;
            $previous[$type] = $this->restorableLimit($original, $maximumRestorable);
            \Imagick::setResourceLimit($type, $value);
        }
        try {
            return $operation();
        } finally {
            foreach ($previous as $type => $value) {
                \Imagick::setResourceLimit($type, $value);
            }
        }
    }

    private function release(\Imagick $image): void
    {
        $image->clear();
        $image->destroy();
    }

    private function restorableLimit(mixed $value, int $maximum): int
    {
        if ((is_float($value) || is_int($value)) && $value >= $maximum) {
            return $maximum;
        }

        return is_numeric($value) ? max(0, (int) $value) : $maximum;
    }
}
