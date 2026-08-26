<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use Symfony\Component\HttpFoundation\HeaderUtils;

/** Builds RFC 6266 dispositions with a safe ASCII fallback for Unicode names. */
final class ContentDisposition
{
    public static function make(string $disposition, string $fileName): string
    {
        return HeaderUtils::makeDisposition($disposition, $fileName, self::fallback($fileName));
    }

    private static function fallback(string $fileName): string
    {
        if (preg_match('/^[\x20-\x7E]+$/D', $fileName) === 1
            && !str_contains($fileName, '%')
            && !str_contains($fileName, '/')
            && !str_contains($fileName, '\\')
        ) {
            return $fileName;
        }

        $extension = strtolower((string) pathinfo($fileName, PATHINFO_EXTENSION));
        $extension = preg_match('/^[a-z0-9]{1,16}$/D', $extension) === 1 ? '.' . $extension : '';
        $stem = (string) pathinfo($fileName, PATHINFO_FILENAME);
        $stem = preg_replace('/[^\x20-\x7E]+/u', '-', $stem) ?? '';
        $stem = preg_replace('/[^A-Za-z0-9._ -]+/', '-', $stem) ?? '';
        $stem = trim(preg_replace('/[ ._-]+/', '-', $stem) ?? '', '-');
        if ($stem === '') $stem = 'download';

        return substr($stem, 0, 96) . $extension;
    }
}
