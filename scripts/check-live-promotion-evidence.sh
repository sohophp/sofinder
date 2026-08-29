#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
policy_file=${1:-$repository_root/config/framework-support.json}
php_bin="$repository_root/scripts/php-bin.sh"

eligible=$(
    "$php_bin" -r '$p=json_decode(file_get_contents($argv[1]), true, 32, JSON_THROW_ON_ERROR); echo ($p["promotionGate"]["eligible"] ?? false) === true ? "yes" : "no";' "$policy_file"
)
if [[ "$eligible" != yes ]]; then
    echo 'Live promotion evidence is not required while the gate is closed.'
    exit 0
fi

command -v gh >/dev/null 2>&1 || { echo 'GitHub CLI is required to verify live promotion evidence.' >&2; exit 1; }

mapfile -t run_ids < <(
    "$php_bin" -r '
        $p=json_decode(file_get_contents($argv[1]), true, 32, JSON_THROW_ON_ERROR);
        $e=$p["promotionGate"]["evidence"] ?? [];
        foreach (["symfonyMatrixWorkflowUrl", "priorityDefectAuditUrl"] as $key) {
            $url=$e[$key] ?? null;
            if (!is_string($url) || preg_match("#^https://github\\.com/sohophp/sofinder/actions/runs/([1-9][0-9]*)$#D", $url, $m) !== 1) exit(1);
            echo $m[1], PHP_EOL;
        }
    ' "$policy_file"
)
[[ ${#run_ids[@]} -eq 2 ]] || { echo 'Promotion policy does not contain two valid Actions run URLs.' >&2; exit 1; }

mkdir -p "$repository_root/var"
evidence_dir=$(mktemp -d "$repository_root/var/live-promotion.XXXXXX")
trap 'rm -rf -- "$evidence_dir"' EXIT
gh api "repos/sohophp/sofinder/actions/runs/${run_ids[0]}" > "$evidence_dir/matrix.json"
gh api "repos/sohophp/sofinder/actions/runs/${run_ids[1]}" > "$evidence_dir/audit.json"

"$php_bin" "$repository_root/scripts/check-promotion-run-evidence.php" \
    "$policy_file" "$evidence_dir/matrix.json" "$evidence_dir/audit.json"
