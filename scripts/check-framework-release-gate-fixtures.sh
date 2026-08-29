#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
php_bin="$repository_root/scripts/php-bin.sh"
mkdir -p "$repository_root/var"
fixture=$(mktemp "$repository_root/var/framework-gate.XXXXXX.json")
trap 'rm -f -- "$fixture"' EXIT
cp "$repository_root/config/framework-support.json" "$fixture"

"$php_bin" -r '
    $file = $argv[1];
    $policy = json_decode(file_get_contents($file), true, 32, JSON_THROW_ON_ERROR);
    $today = new DateTimeImmutable("today", new DateTimeZone("UTC"));
    $releasedAt = $today->modify("-31 days");
    $completedAt = $releasedAt->modify("+30 days");
    $gate = &$policy["promotionGate"];
    $gate["releasedMainVersion"] = "1.0.1";
    $gate["releaseDate"] = $releasedAt->format("Y-m-d");
    $gate["openP0P1Defects"] = 0;
    $gate["eligible"] = true;
    $gate["observationWaiver"]["enabled"] = false;
    $gate["evidence"] = [
        "symfonyMatrixCommit" => str_repeat("a", 40),
        "symfonyMatrixWorkflowUrl" => "https://github.com/sohophp/sofinder/actions/runs/1",
        "symfonyMatrixVerifiedAt" => $today->format("Y-m-d"),
        "observationStartedAt" => $releasedAt->format("Y-m-d"),
        "observationCompletedAt" => $completedAt->format("Y-m-d"),
        "priorityDefectAuditUrl" => "https://github.com/sohophp/sofinder/actions/runs/2",
    ];
    file_put_contents($file, json_encode($policy, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
' "$fixture"

"$php_bin" "$repository_root/scripts/check-framework-release-gate.php" "$fixture" > /dev/null

"$php_bin" -r '
    $file = $argv[1];
    $policy = json_decode(file_get_contents($file), true, 32, JSON_THROW_ON_ERROR);
    $policy["promotionGate"]["releasedMainVersion"] = "0.9.9";
    file_put_contents($file, json_encode($policy, JSON_THROW_ON_ERROR));
' "$fixture"

if "$php_bin" "$repository_root/scripts/check-framework-release-gate.php" "$fixture" > /dev/null 2>&1; then
    printf '%s\n' 'The promotion gate accepted a release older than its minimum.' >&2
    exit 1
fi

"$php_bin" -r '
    $file = $argv[1];
    $policy = json_decode(file_get_contents($file), true, 32, JSON_THROW_ON_ERROR);
    $policy["promotionGate"]["releasedMainVersion"] = "1.0.1";
    $policy["promotionGate"]["evidence"]["priorityDefectAuditUrl"] = null;
    file_put_contents($file, json_encode($policy, JSON_THROW_ON_ERROR));
' "$fixture"

if "$php_bin" "$repository_root/scripts/check-framework-release-gate.php" "$fixture" > /dev/null 2>&1; then
    printf '%s\n' 'The promotion gate accepted missing defect evidence.' >&2
    exit 1
fi

"$php_bin" -r '
    $file = $argv[1];
    $policy = json_decode(file_get_contents($file), true, 32, JSON_THROW_ON_ERROR);
    $today = new DateTimeImmutable("today", new DateTimeZone("UTC"));
    $gate = &$policy["promotionGate"];
    $gate["releasedMainVersion"] = "1.0.2";
    $gate["releaseDate"] = $today->format("Y-m-d");
    $gate["openP0P1Defects"] = 0;
    $gate["observationWaiver"] = [
        "enabled" => true,
        "approvedAt" => $today->format("Y-m-d"),
        "approvedBy" => "fixture-maintainer",
        "reason" => "The fixture explicitly approves immediate promotion after all required matrices pass.",
    ];
    $gate["evidence"] = [
        "symfonyMatrixCommit" => str_repeat("b", 40),
        "symfonyMatrixWorkflowUrl" => "https://github.com/sohophp/sofinder/actions/runs/3",
        "symfonyMatrixVerifiedAt" => $today->format("Y-m-d"),
        "observationStartedAt" => $today->format("Y-m-d"),
        "observationCompletedAt" => null,
        "priorityDefectAuditUrl" => "https://github.com/sohophp/sofinder/actions/runs/4",
    ];
    file_put_contents($file, json_encode($policy, JSON_THROW_ON_ERROR));
' "$fixture"

"$php_bin" "$repository_root/scripts/check-framework-release-gate.php" "$fixture" > /dev/null

"$php_bin" -r '
    $policy = json_decode(file_get_contents($argv[1]), true, 32, JSON_THROW_ON_ERROR);
    $policy["promotionGate"]["observationWaiver"]["reason"] = "too short";
    file_put_contents($argv[1], json_encode($policy, JSON_THROW_ON_ERROR));
' "$fixture"
if "$php_bin" "$repository_root/scripts/check-framework-release-gate.php" "$fixture" > /dev/null 2>&1; then
    printf '%s\n' 'The promotion gate accepted an undocumented observation waiver.' >&2
    exit 1
fi

printf '%s\n' 'Framework release gate positive and negative fixtures passed.'
