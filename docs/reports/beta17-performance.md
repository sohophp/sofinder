# beta.17 performance report

Measured on 2026-08-27 in the release workspace with PHP 8.5.9 and Node 22.
These are diagnostic observations, not release time limits; the first beta.17
run deliberately avoids environment-sensitive duration gates.

| Scenario | Workload | Local result |
| --- | ---: | --- |
| Local directory paging | 10,000 empty files, two 137-entry pages | passed inside the 6.16 s grouped run; peak growth below the existing 128 MiB guard |
| Concurrent thumbnail cache | 8 PHP processes requesting one 160×120 thumbnail | passed; all workers exited successfully and exactly one valid PNG remained |
| Upload queue rendering | 100 independently addressable tasks | passed in the 22-test frontend suite (3.14 s Vitest duration) |
| S3 cursor pagination | 1,001 MinIO objects, pages of 500/500/1 | covered by `S3MinioIntegrationTest`; final duration is reported by the pinned MinIO CI job |

The release report also records `sofinder.js` at 97,750 gzip bytes, below the
100 KiB initial-entry limit. Future RC runs should compare the same scenarios
and investigate regressions before introducing a stable time threshold.
