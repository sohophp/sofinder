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
$waiver = is_array($gate['observationWaiver'] ?? null) ? $gate['observationWaiver'] : [];
$waiverEnabled = ($waiver['enabled'] ?? false) === true;
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
if (!is_bool($waiver['enabled'] ?? null)) {
    $errors[] = 'promotionGate.observationWaiver.enabled must be boolean.';
}
$waiverApprovedAt = $date($waiver['approvedAt'] ?? null);
if ($waiverEnabled) {
    if (!$waiverApprovedAt instanceof \DateTimeImmutable) {
        $errors[] = 'An observation waiver requires a valid UTC approvedAt date.';
    }
    if (!is_string($waiver['approvedBy'] ?? null) || trim($waiver['approvedBy']) === '') {
        $errors[] = 'An observation waiver requires approvedBy.';
    }
    if (!is_string($waiver['reason'] ?? null) || mb_strlen(trim($waiver['reason'])) < 20) {
        $errors[] = 'An observation waiver requires a substantive reason.';
    }
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
        if (!$waiverEnabled && $today < $eligibleAt) {
            $errors[] = sprintf('The %d-day Symfony observation period has not elapsed.', $minimumDays);
        }

        $observationStartedAt = $date($evidence['observationStartedAt'] ?? null);
        $observationCompletedAt = $date($evidence['observationCompletedAt'] ?? null);
        $matrixVerifiedAt = $date($evidence['symfonyMatrixVerifiedAt'] ?? null);
        if (!$observationStartedAt instanceof \DateTimeImmutable || $observationStartedAt > $releasedAt) {
            $errors[] = 'Observation evidence must start no later than the 1.0.0 release date.';
        }
        if ($waiverEnabled) {
            if ($observationCompletedAt !== false) {
                $errors[] = 'A waived observation period must not be recorded as completed.';
            }
            if (!$waiverApprovedAt instanceof \DateTimeImmutable
                || $waiverApprovedAt < $releasedAt
                || $waiverApprovedAt > $today) {
                $errors[] = 'The observation waiver approval date must fall between the release date and today.';
            }
            if (!$matrixVerifiedAt instanceof \DateTimeImmutable
                || !$waiverApprovedAt instanceof \DateTimeImmutable
                || $matrixVerifiedAt < $waiverApprovedAt) {
                $errors[] = 'The Symfony compatibility matrix must be verified on or after the observation waiver.';
            }
        } else {
            if (!$observationCompletedAt instanceof \DateTimeImmutable || $observationCompletedAt < $eligibleAt) {
                $errors[] = 'Observation evidence must cover the full minimum stable period.';
            }
            if (!$matrixVerifiedAt instanceof \DateTimeImmutable || $matrixVerifiedAt < $observationCompletedAt) {
                $errors[] = 'The Symfony compatibility matrix must be verified after the observation period.';
            }
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
