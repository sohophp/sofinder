<?php

declare(strict_types=1);

if ($argc !== 4) {
    fwrite(STDERR, "Usage: verify-published-composer-package.php <package> <version> <source-url>\n");
    exit(2);
}

[, $expectedPackage, $expectedVersion, $expectedSourceUrl] = $argv;
$installedFile = getcwd() . '/vendor/composer/installed.json';

if (!is_file($installedFile)) {
    fwrite(STDERR, sprintf("Missing Composer installation metadata: %s\n", $installedFile));
    exit(1);
}

$installed = json_decode(
    (string) file_get_contents($installedFile),
    true,
    512,
    JSON_THROW_ON_ERROR,
);
$packages = isset($installed['packages']) && is_array($installed['packages'])
    ? $installed['packages']
    : $installed;
$package = null;

foreach ($packages as $candidate) {
    if (is_array($candidate) && ($candidate['name'] ?? null) === $expectedPackage) {
        $package = $candidate;
        break;
    }
}

if (!is_array($package)) {
    fwrite(STDERR, sprintf("Package %s is absent from the clean installation.\n", $expectedPackage));
    exit(1);
}

$normalizeVersion = static fn (string $version): string => ltrim($version, 'v');
$normalizeUrl = static function (string $url): string {
    $url = preg_replace('/\.git$/D', '', rtrim($url, '/')) ?? $url;

    return strtolower($url);
};
$actualVersion = (string) ($package['pretty_version'] ?? $package['version'] ?? '');
$actualSourceUrl = is_array($package['source'] ?? null)
    ? (string) ($package['source']['url'] ?? '')
    : (string) ($package['source_url'] ?? '');

if ($normalizeVersion($actualVersion) !== $normalizeVersion($expectedVersion)) {
    fwrite(STDERR, sprintf(
        "Package %s resolved to %s instead of %s.\n",
        $expectedPackage,
        $actualVersion,
        $expectedVersion,
    ));
    exit(1);
}

if ($normalizeUrl($actualSourceUrl) !== $normalizeUrl($expectedSourceUrl)) {
    fwrite(STDERR, sprintf(
        "Package %s came from %s instead of %s.\n",
        $expectedPackage,
        $actualSourceUrl !== '' ? $actualSourceUrl : '(missing source URL)',
        $expectedSourceUrl,
    ));
    exit(1);
}

fwrite(STDOUT, sprintf(
    "Verified %s %s from %s.\n",
    $expectedPackage,
    $actualVersion,
    $actualSourceUrl,
));
