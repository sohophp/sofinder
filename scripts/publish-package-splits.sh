#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
split_dir=${1:-}
publish_mode=${2:-}
repository_base_url=${SOFINDER_PACKAGE_REPOSITORY_BASE_URL:-https://github.com}

if [[ -z "$split_dir" || ! -s "$split_dir/SPLIT_MANIFEST.tsv" || ! -s "$split_dir/SPLIT_SHA256SUMS" ]]; then
    echo 'Usage: publish-package-splits.sh SPLIT_DIRECTORY [--branch-only]' >&2
    exit 2
fi
if [[ -n "$publish_mode" && "$publish_mode" != '--branch-only' ]]; then
    echo 'Usage: publish-package-splits.sh SPLIT_DIRECTORY [--branch-only]' >&2
    exit 2
fi
if [[ -z "${GH_TOKEN:-}" ]]; then
    echo 'GH_TOKEN with write access to every SoFinder package repository is required.' >&2
    exit 2
fi

(cd "$split_dir" && sha256sum -c SPLIT_SHA256SUMS)
mkdir -p "$repository_root/var"
temporary_dir=$(mktemp -d "$repository_root/var/package-publish-work.XXXXXX")
trap 'rm -rf -- "$temporary_dir"' EXIT

# Validate every remote before publishing any package, minimizing partial
# synchronized releases when a repository, permission or immutable tag differs.
while IFS=$'\t' read -r package_name target_repository expected_commit tag bundle_name; do
    checkout="$temporary_dir/${package_name#sohophp/}"
    git clone --quiet --branch package-release-main "$split_dir/$bundle_name" "$checkout"
    test "$(git -C "$checkout" rev-parse "refs/tags/$tag^{commit}")" = "$expected_commit"
    test "$(git -C "$checkout" rev-parse refs/heads/package-release-main)" = "$expected_commit"
    git -C "$checkout" remote add publish "$repository_base_url/$target_repository.git"
    remote_refs=$(git -C "$checkout" ls-remote publish)
    if [[ "$publish_mode" != '--branch-only' ]]; then
        remote_tag=$(awk -v ref="refs/tags/$tag" '$2 == ref {print $1}' <<< "$remote_refs")
        remote_tag_commit=$(awk -v ref="refs/tags/$tag^{}" '$2 == ref {print $1}' <<< "$remote_refs")
        if [[ -n "$remote_tag" && "$remote_tag_commit" != "$expected_commit" ]]; then
            echo "Remote $target_repository already has a different immutable $tag." >&2
            exit 1
        fi
    fi
    remote_main=$(awk '$2 == "refs/heads/main" {print $1}' <<< "$remote_refs")
    publish_commit=$expected_commit
    if [[ -n "$remote_main" ]]; then
        git -C "$checkout" fetch --quiet publish refs/heads/main:refs/remotes/publish/main
        if git -C "$checkout" merge-base --is-ancestor "$remote_main" "$expected_commit"; then
            :
        elif git -C "$checkout" merge-base --is-ancestor "$expected_commit" "$remote_main" \
            && [[ "$(git -C "$checkout" rev-parse "$remote_main^{tree}")" == "$(git -C "$checkout" rev-parse "$expected_commit^{tree}")" ]]; then
            # A previous publication may already have joined an injected dist
            # commit to the package history. Preserve that merge on retries.
            publish_commit=$remote_main
        elif [[ "$package_name" == sohophp/sofinder-psr15 || "$package_name" == sohophp/sofinder-laravel ]]; then
            while IFS= read -r changed_path; do
                case "$changed_path" in
                    dist/*|THIRD_PARTY_NOTICES.md) ;;
                    *)
                        echo "Remote $target_repository has non-generated divergence at $changed_path." >&2
                        exit 1
                        ;;
                esac
            done < <(git -C "$checkout" diff --name-only "$remote_main" "$expected_commit")
            tag_date=$(git -C "$checkout" show -s --format=%cI "$expected_commit")
            publish_commit=$(printf '%s\n' "Merge $tag synchronized frontend distribution" | \
                GIT_AUTHOR_NAME='SoFinder Release Automation' \
                GIT_AUTHOR_EMAIL='release@sofinder.sohophp.app' \
                GIT_AUTHOR_DATE="$tag_date" \
                GIT_COMMITTER_NAME='SoFinder Release Automation' \
                GIT_COMMITTER_EMAIL='release@sofinder.sohophp.app' \
                GIT_COMMITTER_DATE="$tag_date" \
                git -C "$checkout" commit-tree "$expected_commit^{tree}" -p "$remote_main" -p "$expected_commit")
        else
            echo "Remote $target_repository main cannot fast-forward to $expected_commit." >&2
            exit 1
        fi
    fi
    git -C "$checkout" branch -f package-publish-main "$publish_commit" >/dev/null
done < "$split_dir/SPLIT_MANIFEST.tsv"

while IFS=$'\t' read -r package_name target_repository expected_commit tag bundle_name; do
    checkout="$temporary_dir/${package_name#sohophp/}"
    if [[ "$publish_mode" == '--branch-only' ]]; then
        git -C "$checkout" push publish refs/heads/package-publish-main:refs/heads/main
        echo "Published $package_name main to $target_repository without a release tag."
    else
        git -C "$checkout" push --atomic publish \
            refs/heads/package-publish-main:refs/heads/main \
            "refs/tags/$tag:refs/tags/$tag"
        echo "Published $package_name $tag to $target_repository."
    fi
done < "$split_dir/SPLIT_MANIFEST.tsv"
