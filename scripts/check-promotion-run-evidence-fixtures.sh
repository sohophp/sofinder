#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
php_bin="$repository_root/scripts/php-bin.sh"
mkdir -p "$repository_root/var"
fixture_dir=$(mktemp -d "$repository_root/var/promotion-run-fixtures.XXXXXX")
trap 'rm -rf -- "$fixture_dir"' EXIT

"$php_bin" -r '
    $today=new DateTimeImmutable("today", new DateTimeZone("UTC"));
    $completed=$today->modify("-1 day");
    $policy=json_decode(file_get_contents($argv[1]), true, 32, JSON_THROW_ON_ERROR);
    $gate=&$policy["promotionGate"];
    $gate["eligible"]=true;
    $gate["releasedMainVersion"]="1.0.1";
    $gate["releaseDate"]=$today->modify("-31 days")->format("Y-m-d");
    $gate["openP0P1Defects"]=0;
    $gate["evidence"]=[
        "symfonyMatrixCommit" => str_repeat("a", 40),
        "symfonyMatrixWorkflowUrl" => "https://github.com/sohophp/sofinder/actions/runs/101",
        "symfonyMatrixVerifiedAt" => $today->format("Y-m-d"),
        "observationStartedAt" => $today->modify("-31 days")->format("Y-m-d"),
        "observationCompletedAt" => $completed->format("Y-m-d"),
        "priorityDefectAuditUrl" => "https://github.com/sohophp/sofinder/actions/runs/102",
    ];
    file_put_contents($argv[2], json_encode($policy, JSON_THROW_ON_ERROR));
    $base=[
        "status" => "completed",
        "conclusion" => "success",
        "head_branch" => "main",
        "repository" => ["full_name" => "sohophp/sofinder"],
        "run_started_at" => $today->format(DATE_ATOM),
    ];
    file_put_contents($argv[3], json_encode($base + [
        "id" => 101,
        "html_url" => "https://github.com/sohophp/sofinder/actions/runs/101",
        "path" => ".github/workflows/ci.yml",
        "head_sha" => str_repeat("a", 40),
    ], JSON_THROW_ON_ERROR));
    file_put_contents($argv[4], json_encode($base + [
        "id" => 102,
        "html_url" => "https://github.com/sohophp/sofinder/actions/runs/102",
        "path" => ".github/workflows/symfony-observation.yml",
        "head_sha" => str_repeat("b", 40),
    ], JSON_THROW_ON_ERROR));
' "$repository_root/config/framework-support.json" "$fixture_dir/policy.json" "$fixture_dir/matrix.json" "$fixture_dir/audit.json"

"$php_bin" "$repository_root/scripts/check-framework-release-gate.php" "$fixture_dir/policy.json" >/dev/null
"$php_bin" "$repository_root/scripts/check-promotion-run-evidence.php" \
    "$fixture_dir/policy.json" "$fixture_dir/matrix.json" "$fixture_dir/audit.json" >/dev/null

"$php_bin" -r '$d=json_decode(file_get_contents($argv[1]), true, 32, JSON_THROW_ON_ERROR); $d["conclusion"]="failure"; file_put_contents($argv[1], json_encode($d, JSON_THROW_ON_ERROR));' "$fixture_dir/matrix.json"
if "$php_bin" "$repository_root/scripts/check-promotion-run-evidence.php" \
    "$fixture_dir/policy.json" "$fixture_dir/matrix.json" "$fixture_dir/audit.json" >/dev/null 2>&1; then
    echo 'Live evidence unexpectedly accepted a failed matrix run.' >&2
    exit 1
fi

echo 'Promotion run evidence positive and negative fixtures passed.'
