<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$policyFile = $argv[1] ?? $root . '/config/framework-support.json';
$policy = json_decode(
    (string) file_get_contents($policyFile),
    true,
    32,
    JSON_THROW_ON_ERROR,
);
$gate = $policy['promotionGate'] ?? null;

if (!is_array($gate)) {
    fwrite(STDERR, "Missing promotionGate policy.\n");
    exit(1);
}

$errors = [];
$requiredVersion = $gate['requiresMainVersion'] ?? null;
$releasedVersion = $gate['releasedMainVersion'] ?? null;
$releaseDate = $gate['releaseDate'] ?? null;
$defects = $gate['openP0P1Defects'] ?? null;
$eligible = $gate['eligible'] ?? null;
$minimumDays = $gate['minimumStableDays'] ?? null;
$evidence = is_array($gate['evidence'] ?? null) ? $gate['evidence'] : [];
$date = static function (mixed $value): \DateTimeImmutable|false {
    return is_string($value)
        ? \DateTimeImmutable::createFromFormat('!Y-m-d', $value, new \DateTimeZone('UTC'))
        : false;
};
$stableVersion = static fn (mixed $value): bool => is_string($value)
    && preg_match('/^[0-9]+\.[0-9]+\.[0-9]+$/D', $value) === 1;

if (!is_bool($eligible)) {
    $errors[] = 'promotionGate.eligible must be boolean.';
}
if (!is_int($minimumDays) || $minimumDays < 30) {
    $errors[] = 'promotionGate.minimumStableDays must be at least 30.';
}
if (!$stableVersion($requiredVersion)) {
    $errors[] = 'promotionGate.requiresMainVersion must be a stable semantic version.';
}
if ($releasedVersion !== null && !$stableVersion($releasedVersion)) {
    $errors[] = 'promotionGate.releasedMainVersion must be null or a stable semantic version.';
}
if ($eligible === true) {
    if (!$stableVersion($requiredVersion)
        || !$stableVersion($releasedVersion)
        || version_compare($releasedVersion, $requiredVersion, '<')) {
        $errors[] = 'The recorded released main version is older than the promotion gate minimum.';
    }
    if (!is_int($defects) || $defects !== 0) {
        $errors[] = 'Promotion requires zero open P0/P1 defects.';
    }
    $releasedAt = $date($releaseDate);
    if (!$releasedAt instanceof \DateTimeImmutable) {
        $errors[] = 'An eligible gate requires a valid UTC releaseDate.';
    } elseif (is_int($minimumDays)) {
        $eligibleAt = $releasedAt->modify(sprintf('+%d days', $minimumDays));
        $today = new \DateTimeImmutable('today', new \DateTimeZone('UTC'));
        if ($today < $eligibleAt) {
            $errors[] = sprintf('The %d-day Symfony observation period has not elapsed.', $minimumDays);
        }

        $observationStartedAt = $date($evidence['observationStartedAt'] ?? null);
        $observationCompletedAt = $date($evidence['observationCompletedAt'] ?? null);
        $matrixVerifiedAt = $date($evidence['symfonyMatrixVerifiedAt'] ?? null);
        if (!$observationStartedAt instanceof \DateTimeImmutable || $observationStartedAt > $releasedAt) {
            $errors[] = 'Observation evidence must start no later than the 1.0.0 release date.';
        }
        if (!$observationCompletedAt instanceof \DateTimeImmutable || $observationCompletedAt < $eligibleAt) {
            $errors[] = 'Observation evidence must cover the full minimum stable period.';
        }
        if (!$matrixVerifiedAt instanceof \DateTimeImmutable || $matrixVerifiedAt < $observationCompletedAt) {
            $errors[] = 'The Symfony compatibility matrix must be verified after the observation period.';
        }
    }
    if (!is_string($evidence['symfonyMatrixCommit'] ?? null) || preg_match('/^[a-f0-9]{40}$/D', $evidence['symfonyMatrixCommit']) !== 1) {
        $errors[] = 'Promotion requires the verified 40-character Symfony matrix commit.';
    }
    foreach (['symfonyMatrixWorkflowUrl', 'priorityDefectAuditUrl'] as $urlKey) {
        $url = $evidence[$urlKey] ?? null;
        if (!is_string($url) || filter_var($url, FILTER_VALIDATE_URL) === false || !str_starts_with($url, 'https://')) {
            $errors[] = sprintf('Promotion requires a secure %s evidence URL.', $urlKey);
        }
    }
}

if ($errors !== []) {
    fwrite(STDERR, implode("\n", $errors) . "\n");
    exit(1);
}

fwrite(STDOUT, $eligible === true
    ? "Laravel/PSR-15 promotion gate is eligible.\n"
    : "Laravel/PSR-15 promotion gate remains closed.\n");
