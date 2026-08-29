<?php

declare(strict_types=1);

if ($argc !== 4) {
    fwrite(STDERR, "Usage: check-promotion-run-evidence.php POLICY MATRIX_RUN_JSON AUDIT_RUN_JSON\n");
    exit(2);
}

[, $policyFile, $matrixRunFile, $auditRunFile] = $argv;
$policy = json_decode((string) file_get_contents($policyFile), true, 32, JSON_THROW_ON_ERROR);
$gate = is_array($policy['promotionGate'] ?? null) ? $policy['promotionGate'] : [];

if (($gate['eligible'] ?? false) !== true) {
    fwrite(STDOUT, "Live promotion evidence is not required while the gate is closed.\n");
    exit(0);
}

$evidence = is_array($gate['evidence'] ?? null) ? $gate['evidence'] : [];
$matrixRun = json_decode((string) file_get_contents($matrixRunFile), true, 32, JSON_THROW_ON_ERROR);
$auditRun = json_decode((string) file_get_contents($auditRunFile), true, 32, JSON_THROW_ON_ERROR);
$errors = [];

$date = static function (mixed $value, string $label) use (&$errors): ?DateTimeImmutable {
    if (!is_string($value)) {
        $errors[] = sprintf('%s must be a UTC date.', $label);

        return null;
    }
    $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('UTC'));
    if (!$parsed instanceof DateTimeImmutable || $parsed->format('Y-m-d') !== $value) {
        $errors[] = sprintf('%s must use YYYY-MM-DD.', $label);

        return null;
    }

    return $parsed;
};

$validateRun = static function (
    mixed $run,
    mixed $url,
    string $expectedWorkflow,
    string $label,
) use (&$errors): ?DateTimeImmutable {
    if (!is_array($run)) {
        $errors[] = sprintf('%s run evidence must be an object.', $label);

        return null;
    }
    if (!is_string($url)
        || preg_match('#^https://github\.com/sohophp/sofinder/actions/runs/([1-9][0-9]*)$#D', $url, $match) !== 1) {
        $errors[] = sprintf('%s URL must identify a SoFinder Actions run.', $label);

        return null;
    }

    $runId = (string) ($run['id'] ?? '');
    if ($runId !== $match[1] || ($run['html_url'] ?? null) !== $url) {
        $errors[] = sprintf('%s run does not match its recorded URL.', $label);
    }
    if (($run['repository']['full_name'] ?? null) !== 'sohophp/sofinder') {
        $errors[] = sprintf('%s run belongs to the wrong repository.', $label);
    }
    if (($run['status'] ?? null) !== 'completed' || ($run['conclusion'] ?? null) !== 'success') {
        $errors[] = sprintf('%s run must have completed successfully.', $label);
    }
    if (($run['path'] ?? null) !== $expectedWorkflow) {
        $errors[] = sprintf('%s run used an unexpected workflow.', $label);
    }
    if (($run['head_branch'] ?? null) !== 'main') {
        $errors[] = sprintf('%s run must verify the main branch.', $label);
    }

    try {
        return is_string($run['run_started_at'] ?? null)
            ? new DateTimeImmutable($run['run_started_at'])
            : throw new RuntimeException();
    } catch (Throwable) {
        $errors[] = sprintf('%s run requires a valid run_started_at.', $label);

        return null;
    }
};

$completedAt = $date($evidence['observationCompletedAt'] ?? null, 'observationCompletedAt');
$matrixVerifiedAt = $date($evidence['symfonyMatrixVerifiedAt'] ?? null, 'symfonyMatrixVerifiedAt');
$matrixStartedAt = $validateRun(
    $matrixRun,
    $evidence['symfonyMatrixWorkflowUrl'] ?? null,
    '.github/workflows/ci.yml',
    'Symfony matrix',
);
$auditStartedAt = $validateRun(
    $auditRun,
    $evidence['priorityDefectAuditUrl'] ?? null,
    '.github/workflows/symfony-observation.yml',
    'Priority defect audit',
);

if (($matrixRun['head_sha'] ?? null) !== ($evidence['symfonyMatrixCommit'] ?? null)) {
    $errors[] = 'Symfony matrix run commit does not match the recorded commit.';
}
if ($completedAt instanceof DateTimeImmutable
    && $matrixStartedAt instanceof DateTimeImmutable
    && $matrixStartedAt < $completedAt) {
    $errors[] = 'Symfony matrix run must start after the observation period completes.';
}
if ($matrixVerifiedAt instanceof DateTimeImmutable
    && $matrixStartedAt instanceof DateTimeImmutable
    && $matrixStartedAt < $matrixVerifiedAt) {
    $errors[] = 'Symfony matrix run predates its recorded verification date.';
}
if ($completedAt instanceof DateTimeImmutable
    && $auditStartedAt instanceof DateTimeImmutable
    && $auditStartedAt < $completedAt) {
    $errors[] = 'Priority defect audit must run after the observation period completes.';
}

if ($errors !== []) {
    fwrite(STDERR, implode("\n", $errors) . "\n");
    exit(1);
}

fwrite(STDOUT, "Live framework promotion evidence is valid.\n");
