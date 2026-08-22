<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Image;

use SohoPHP\SoFinder\Contract\ImageProcessorInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;

final readonly class GdImageProcessor implements ImageProcessorInterface
{
    private const MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

    public function __construct(private int $maximumPixels = 50_000_000)
    {
    }

    public function supports(string $mimeType): bool
    {
        return extension_loaded('gd') && in_array(strtolower($mimeType), self::MIME_TYPES, true);
    }

    public function dimensions(string $source): array
    {
        $info = @getimagesize($source);
        if (!is_array($info)) {
            throw new SoFinderException('The selected file is not a valid image.', 'invalid_image', 415);
        }
        $width = (int) $info[0];
        $height = (int) $info[1];
        $mimeType = strtolower((string) $info['mime']);
        if (!$this->supports($mimeType) || $width < 1 || $height < 1 || $width * $height > $this->maximumPixels) {
            throw new SoFinderException('The image format or dimensions are not supported.', 'unsupported_image', 415);
        }
        if ($mimeType === 'image/jpeg' && function_exists('exif_read_data')) {
            $exif = @exif_read_data($source);
            $orientation = is_array($exif) ? (int) ($exif['Orientation'] ?? 1) : 1;
            if (in_array($orientation, [5, 6, 7, 8], true)) {
                [$width, $height] = [$height, $width];
            }
        }

        return ['width' => $width, 'height' => $height];
    }

    public function validate(string $source): array
    {
        [$image] = $this->load($source);
        try {
            return ['width' => imagesx($image), 'height' => imagesy($image)];
        } finally {
            unset($image);
        }
    }

    public function isAnimated(string $source): bool
    {
        $contents = @file_get_contents($source);
        if ($contents === false) {
            throw new SoFinderException('Unable to inspect the image animation.', 'invalid_image', 415);
        }
        $info = @getimagesize($source);
        if (!is_array($info)) {
            throw new SoFinderException('The selected file is not a valid image.', 'invalid_image', 415);
        }
        $mime = strtolower((string) $info['mime']);
        if ($mime === 'image/gif') {
            return preg_match_all('/\x00\x21\xF9\x04/s', $contents) > 1;
        }
        if ($mime === 'image/webp') {
            return str_contains($contents, 'ANIM') || substr_count($contents, 'ANMF') > 1;
        }

        return false;
    }

    public function thumbnail(string $source, string $destination, int $width, int $height): void
    {
        [$image, $mimeType] = $this->load($source);
        try {
            $this->resizeAndSave($image, $mimeType, $destination, $width, $height, false);
        } finally {
            unset($image);
        }
    }

    public function transform(string $source, string $destination, int $rotation, int $width, int $height, int $quality = 88): void
    {
        if (!in_array($rotation, [0, 90, 180, 270], true)) {
            throw new SoFinderException('Image rotation must be 0, 90, 180 or 270 degrees.', 'invalid_image_operation', 422);
        }
        [$image, $mimeType] = $this->load($source);
        try {
            if ($rotation !== 0) {
                $rotated = imagerotate($image, -$rotation, imagecolorallocatealpha($image, 0, 0, 0, 127));
                if (!$rotated instanceof \GdImage) {
                    throw new SoFinderException('Unable to rotate the image.', 'image_processing_failed', 500);
                }
                unset($image);
                $image = $rotated;
            }
            $this->resizeAndSave($image, $mimeType, $destination, $width, $height, true, $quality);
        } finally {
            unset($image);
        }
    }

    public function crop(string $source, string $destination, int $x, int $y, int $width, int $height, int $quality = 88): void
    {
        [$image, $mimeType] = $this->load($source);
        try {
            if ($x < 0 || $y < 0 || $width < 1 || $height < 1 || $width > 4096 || $height > 4096 || $x + $width > imagesx($image) || $y + $height > imagesy($image)) {
                throw new SoFinderException('The crop rectangle is outside the image.', 'invalid_crop', 422);
            }
            $cropped = imagecrop($image, ['x' => $x, 'y' => $y, 'width' => $width, 'height' => $height]);
            if (!$cropped instanceof \GdImage) {
                throw new SoFinderException('Unable to crop the image.', 'image_processing_failed', 500);
            }
            try {
                $this->resizeAndSave($cropped, $mimeType, $destination, 0, 0, true, $quality);
            } finally {
                unset($cropped);
            }
        } finally {
            unset($image);
        }
    }

    /** @return array{\GdImage, string} */
    private function load(string $source): array
    {
        $this->dimensions($source);
        $info = @getimagesize($source);
        if (!is_array($info)) {
            throw new SoFinderException('The selected file is not a valid image.', 'invalid_image', 415);
        }
        $mimeType = strtolower((string) $info['mime']);
        $image = match ($mimeType) {
            'image/jpeg' => @imagecreatefromjpeg($source),
            'image/png' => @imagecreatefrompng($source),
            'image/gif' => @imagecreatefromgif($source),
            'image/webp' => @imagecreatefromwebp($source),
            'image/bmp' => @imagecreatefrombmp($source),
            default => false,
        };
        if (!$image instanceof \GdImage) {
            throw new SoFinderException('Unable to decode the image.', 'invalid_image', 415);
        }

        return [$this->orient($image, $source, $mimeType), $mimeType];
    }

    private function orient(\GdImage $image, string $source, string $mimeType): \GdImage
    {
        if ($mimeType !== 'image/jpeg' || !function_exists('exif_read_data')) {
            return $image;
        }
        $exif = @exif_read_data($source);
        $orientation = is_array($exif) ? (int) ($exif['Orientation'] ?? 1) : 1;
        if (in_array($orientation, [2, 4, 5, 7], true)) {
            imageflip($image, in_array($orientation, [2, 5], true) ? IMG_FLIP_HORIZONTAL : IMG_FLIP_VERTICAL);
        }
        $angle = match ($orientation) {
            3 => 180,
            5, 6 => -90,
            7, 8 => 90,
            default => 0,
        };
        if ($angle === 0) {
            return $image;
        }
        $rotated = imagerotate($image, $angle, 0);
        if (!$rotated instanceof \GdImage) {
            throw new SoFinderException('Unable to apply the image orientation.', 'image_processing_failed', 500);
        }
        unset($image);

        return $rotated;
    }

    private function resizeAndSave(\GdImage $source, string $mimeType, string $destination, int $width, int $height, bool $allowOriginalSize, int $quality = 88): void
    {
        if ($quality < 1 || $quality > 100) {
            throw new SoFinderException('Image quality must be between 1 and 100.', 'invalid_image_quality', 422);
        }
        if ($width < 0 || $height < 0 || $width > 4096 || $height > 4096 || ($width === 0 && $height === 0 && !$allowOriginalSize)) {
            throw new SoFinderException('Image dimensions must be between 1 and 4096 pixels.', 'invalid_image_dimensions', 422);
        }
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $scale = min($width > 0 ? $width / $sourceWidth : INF, $height > 0 ? $height / $sourceHeight : INF);
        if (!is_finite($scale)) {
            $scale = 1.0;
        }
        $scale = min(1.0, $scale);
        $targetWidth = max(1, (int) round($sourceWidth * $scale));
        $targetHeight = max(1, (int) round($sourceHeight * $scale));
        $target = imagecreatetruecolor($targetWidth, $targetHeight);
        if (!$target instanceof \GdImage) {
            throw new SoFinderException('Unable to allocate the resized image.', 'image_processing_failed', 500);
        }
        try {
            if (in_array($mimeType, ['image/png', 'image/gif', 'image/webp'], true)) {
                imagealphablending($target, false);
                imagesavealpha($target, true);
                imagefill($target, 0, 0, imagecolorallocatealpha($target, 0, 0, 0, 127));
            }
            imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $sourceWidth, $sourceHeight);
            $saved = match ($mimeType) {
                'image/jpeg' => imagejpeg($target, $destination, $quality),
                'image/png' => imagepng($target, $destination, (int) round((100 - $quality) * 9 / 99)),
                'image/gif' => imagegif($target, $destination),
                'image/webp' => imagewebp($target, $destination, $quality),
                'image/bmp' => imagebmp($target, $destination),
                default => false,
            };
            if (!$saved) {
                throw new SoFinderException('Unable to save the processed image.', 'image_processing_failed', 500);
            }
        } finally {
            unset($target);
        }
    }
}
