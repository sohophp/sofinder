<?php

declare(strict_types=1);

if ($argc < 4 || $argc > 5) {
    fwrite(STDERR, "Usage: build-observation-evidence.php RELEASE_JSON ISSUES_JSON OUTPUT_JSON [--fail-on-defects]\n");
    exit(2);
}

[$script, $releaseFile, $issuesFile, $outputFile] = $argv;
$failOnDefects = ($argv[4] ?? null) === '--fail-on-defects';
$release = json_decode((string) file_get_contents($releaseFile), true, 32, JSON_THROW_ON_ERROR);
$issues = json_decode((string) file_get_contents($issuesFile), true, 32, JSON_THROW_ON_ERROR);

if (!is_array($release) || ($release['tag_name'] ?? null) !== 'v1.0.0') {
    throw new InvalidArgumentException('Observation requires the immutable v1.0.0 GitHub release.');
}
if (!is_string($release['published_at'] ?? null) || !is_string($release['html_url'] ?? null)) {
    throw new InvalidArgumentException('Release evidence requires published_at and html_url.');
}
if (!is_array($issues)) {
    throw new InvalidArgumentException('Priority issue evidence must be a JSON array.');
}

$releasedAt = new DateTimeImmutable($release['published_at']);
$observedAtValue = getenv('SOFINDER_OBSERVED_AT');
$observedAt = $observedAtValue !== false && $observedAtValue !== ''
    ? new DateTimeImmutable($observedAtValue)
    : new DateTimeImmutable('now', new DateTimeZone('UTC'));
if ($observedAt < $releasedAt) {
    throw new InvalidArgumentException('Observation timestamp cannot precede the 1.0.0 release.');
}

$priorityIssues = [];
foreach ($issues as $issue) {
    if (!is_array($issue) || !is_int($issue['number'] ?? null)) {
        throw new InvalidArgumentException('Every priority issue record requires an integer number.');
    }
    $createdAt = new DateTimeImmutable((string) ($issue['createdAt'] ?? ''));
    if ($createdAt < $releasedAt) {
        continue;
    }
    $labels = array_map(
        static fn (mixed $label): string => is_array($label) ? strtolower((string) ($label['name'] ?? '')) : '',
        is_array($issue['labels'] ?? null) ? $issue['labels'] : [],
    );
    if (!array_intersect(['priority:p0', 'priority:p1'], $labels)) {
        continue;
    }
    $priorityIssues[$issue['number']] = [
        'number' => $issue['number'],
        'title' => (string) ($issue['title'] ?? ''),
        'state' => strtolower((string) ($issue['state'] ?? 'unknown')),
        'createdAt' => $createdAt->setTimezone(new DateTimeZone('UTC'))->format(DATE_ATOM),
        'closedAt' => isset($issue['closedAt']) && is_string($issue['closedAt']) ? $issue['closedAt'] : null,
        'url' => (string) ($issue['url'] ?? ''),
        'labels' => array_values(array_filter($labels)),
    ];
}
ksort($priorityIssues, SORT_NUMERIC);
$open = count(array_filter($priorityIssues, static fn (array $issue): bool => $issue['state'] === 'open'));
$eligibleAt = $releasedAt->modify('+30 days');
$coveredSeconds = max(0, min($observedAt->getTimestamp(), $eligibleAt->getTimestamp()) - $releasedAt->getTimestamp());

$evidence = [
    'schemaVersion' => 1,
    'release' => [
        'version' => '1.0.0',
        'url' => $release['html_url'],
        'publishedAt' => $releasedAt->setTimezone(new DateTimeZone('UTC'))->format(DATE_ATOM),
    ],
    'observation' => [
        'observedAt' => $observedAt->setTimezone(new DateTimeZone('UTC'))->format(DATE_ATOM),
        'eligibleAt' => $eligibleAt->setTimezone(new DateTimeZone('UTC'))->format(DATE_ATOM),
        'coveredDays' => intdiv($coveredSeconds, 86400),
        'periodComplete' => $observedAt >= $eligibleAt,
    ],
    'priorityLabels' => ['priority:p0', 'priority:p1'],
    'openP0P1Defects' => $open,
    'observedP0P1Defects' => count($priorityIssues),
    'issues' => array_values($priorityIssues),
];

file_put_contents($outputFile, json_encode($evidence, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . "\n");
fwrite(STDOUT, sprintf(
    "Symfony observation evidence: %d covered days, %d observed P0/P1 defects (%d open).\n",
    $evidence['observation']['coveredDays'],
    $evidence['observedP0P1Defects'],
    $evidence['openP0P1Defects'],
));

if ($failOnDefects && $evidence['observedP0P1Defects'] !== 0) {
    exit(1);
}
