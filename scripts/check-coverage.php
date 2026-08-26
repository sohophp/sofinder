<?php

declare(strict_types=1);

$file = $argv[1] ?? '';
$minimum = isset($argv[2]) ? (float) $argv[2] : 72.0;
$classes = array_slice($argv, 3);
if ($file === '' || !is_file($file)) {
    fwrite(STDERR, "Usage: check-coverage.php clover.xml [global-percent] [path:percent ...]\n");
    exit(2);
}
$xml = simplexml_load_file($file);
if (!$xml instanceof SimpleXMLElement) throw new RuntimeException('The Clover report is invalid.');

/** @return float */
$percentage = static function (SimpleXMLElement $metrics): float {
    $statements = (int) $metrics['statements'];
    return $statements > 0 ? 100.0 * (int) $metrics['coveredstatements'] / $statements : 100.0;
};
$projectMetrics = $xml->xpath('/coverage/project/metrics')[0] ?? null;
if (!$projectMetrics instanceof SimpleXMLElement) throw new RuntimeException('The Clover project metrics are missing.');
$global = $percentage($projectMetrics);
printf("Global line coverage: %.2f%% (minimum %.2f%%)\n", $global, $minimum);
$failed = $global + 0.00001 < $minimum;

foreach ($classes as $requirement) {
    $separator = strrpos($requirement, ':');
    if ($separator === false) throw new InvalidArgumentException('Class coverage requirements use path:percentage.');
    $path = substr($requirement, 0, $separator);
    $required = (float) substr($requirement, $separator + 1);
    $match = null;
    foreach ($xml->xpath('//file') ?: [] as $candidate) {
        $name = str_replace('\\', '/', (string) $candidate['name']);
        if ($name === $path || str_ends_with($name, '/' . ltrim($path, '/'))) { $match = $candidate; break; }
    }
    if (!$match instanceof SimpleXMLElement) { fwrite(STDERR, "Coverage file missing: $path\n"); $failed = true; continue; }
    $actual = $percentage($match->metrics);
    printf("%s: %.2f%% (minimum %.2f%%)\n", $path, $actual, $required);
    if ($actual + 0.00001 < $required) $failed = true;
}
exit($failed ? 1 : 0);
