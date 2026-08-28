---
title: SoFinder trademark release gate
description: Project naming and trademark clearance notes for SoFinder maintainers.
---

# SoFinder trademark release gate

This is an engineering release gate, not legal advice. Before publishing a
tag, record dated searches for `SoFinder`, `SO FINDER` and confusingly similar
names in WIPO Global Brand Database, CNIPA, USPTO and EUIPO. Review Nice classes
9 and 42 first, with secondary checks of 35 and 38. Also check GitHub,
Packagist, npm and sustained commercial use in file-management or SaaS.

A live or pending similar mark, or established commercial use, in software,
file management, SaaS or online-service fields is a blocking conflict. In that
case do not rename automatically and do not publish: retain the evidence and
ask the project owner to choose a name. Unrelated appliance or machinery marks
are recorded but do not automatically block release.

## 2026-08-22 preliminary check

- The intended Composer vendor/package was not present in the Packagist vendor
  listing checked during preparation.
- Preliminary web results showed unrelated appliance uses, with no confirmed
  blocking file-manager or SaaS mark.
- Formal registry searches and a legal review remain required before public
  commercial promotion. The package name remains `sohophp/sofinder` unless the
  blocking-conflict rule is triggered.

## 2026-08-22 beta.2 engineering recheck

- Exact-name web searches scoped to WIPO, USPTO, EUIPO and CNIPA did not expose
  a live or pending class 9, 35, 38 or 42 file-management/software mark.
- USPTO serial 97045626 uses `SOFINDER` for class 7 household cleaning and
  kitchen machinery. It is recorded as an unrelated goods category rather
  than a blocking software conflict.
- `sofinder.me` was found as a social-profile link application. No evidence of
  file-management use, a matching software trademark, or likely source
  confusion with this PHP/Symfony package was identified in this check.
- `sohophp/sofinder` and `@sohophp/sofinder-ui` were absent from the public
  Packagist and npm registry endpoints immediately before release.

No blocking conflict was confirmed under the engineering gate, so the project
name is retained for the beta. This check is not a legal clearance opinion;
formal registry review remains required before broader commercial promotion.

## 2026-08-24 beta.9 engineering recheck

- Exact-name searches were repeated against the public WIPO, USPTO, EUIPO and
  CNIPA search surfaces, with classes 9 and 42 treated as the primary risk.
- The searches did not surface a new file-management or SaaS result that
  changes the beta.2 assessment. USPTO serial 97045626 remains the known
  unrelated class 7 result recorded above.
- Public web and package-registry searches did not identify a newly established
  confusingly similar file-manager package or service requiring the release to
  stop.

No blocking conflict was identified by this engineering recheck, so beta.9 may
retain the project name. Dynamic registry search interfaces can omit results
from ordinary web indexing; this record is not a legal clearance opinion and
does not replace a formal registry or counsel review before broader commercial
promotion.

## 2026-08-25 beta.12 engineering recheck

- Exact-name searches scoped to the WIPO, USPTO, EUIPO and CNIPA public search surfaces did not return a class 9, 35, 38 or 42 file-management/software mark in indexed results.
- USPTO serial 97045626 remains an unrelated class 7 household-machinery filing; serial 97046433 is an unrelated class 11 appliance registration.
- `sofinder.me` remains a social-profile link service. A recent automotive promotion uses “SOFINDER” as a vehicle-matching feature, but no file-management product, PHP package or developer-tool source confusion was identified.
- Public GitHub, Packagist and npm searches did not identify another file-manager package using the intended `sohophp/sofinder` or `@sohophp/sofinder-ui` identities before the release check.

No blocking software/file-management conflict was identified by this engineering recheck, so beta.12 retains the name. Dynamic registry interfaces and ordinary indexing are incomplete; this is not a legal clearance opinion.

## 2026-08-25 beta.13 engineering recheck

- Exact-name indexed searches scoped to the WIPO, USPTO, EUIPO and CNIPA public surfaces did not expose a class 9, 35, 38 or 42 file-management/software mark that changes the beta.12 assessment.
- USPTO serials 97045626 and 97046433 remain the known unrelated class 7 household-machinery and class 11 appliance records.
- `sofinder.me` remains a social-profile link service, while the recent automotive “Sofinder” feature remains unrelated to PHP, developer tooling or file management.
- GitHub and Packagist identify this project at `sohophp/sofinder`; Packagist listed releases through beta.12 immediately before this release. The `@sohophp/sofinder-ui` npm endpoint remained unclaimed/private (HTTP 404).

No blocking software/file-management conflict was identified by this engineering recheck, so beta.13 retains the name. Dynamic registry interfaces and ordinary indexing are incomplete; this is not a legal clearance opinion.

## 2026-08-26 beta.14 engineering delta check

- This patch release changes filesystem permission handling and does not change the project name, package identity, positioning or visual branding.
- GitHub still identifies the canonical project as `sohophp/sofinder`; Packagist listed the immutable releases through beta.13 immediately before publication.
- The `@sohophp/sofinder-ui` npm registry endpoint still returned HTTP 404.

No new package-identity conflict was identified in this release delta check, so beta.14 retains the name. The limitations and non-legal nature of the beta.13 engineering recheck remain unchanged.

## 2026-08-26 beta.16 engineering recheck

- Exact-name indexed searches scoped to the WIPO, USPTO, EUIPO and CNIPA
  public surfaces did not expose a class 9, 35, 38 or 42 file-management or
  software mark that changes the previous assessment.
- USPTO serials 97045626 and 97046433 remain the known unrelated household
  machinery and appliance records. `sofinder.me` remains a social-profile link
  service, and the automotive “Sofinder” feature remains outside file management
  and developer tooling.
- GitHub continues to identify this repository as `sohophp/sofinder`. The
  `@sohophp/sofinder-ui` npm endpoint returned HTTP 404 immediately before this
  release. Packagist's live API was temporarily unavailable during the check;
  its indexed vendor listing did not expose a conflicting package identity.

No blocking software/file-management conflict was identified by this engineering
recheck, so beta.16 retains the name. Dynamic registry interfaces and ordinary
indexing are incomplete; this is not a legal clearance opinion.

## 2026-08-28 beta.24 engineering delta check

- This release extends asset discovery, metadata, usage tracking and private
  delivery without changing the project name, package identities, positioning or
  visual branding.
- GitHub continues to identify the canonical public repository as
  `sohophp/sofinder`; Packagist lists this same repository through beta.23.
- The `@sohophp/sofinder-ui` npm registry endpoint returned HTTP 404 immediately
  before publication and is not published by this release.

No new package-identity conflict was identified in this release delta check, so
beta.24 retains the name. The limitations and non-legal nature of the earlier
engineering rechecks remain unchanged.

## 2026-08-28 beta.27 engineering delta check

- This release improves image editing, watermarks, view/sort controls and
  sidebar organization without changing the project name, package identities,
  positioning or visual branding.
- The configured Git remote continues to identify the canonical repository as
  `github.com/sohophp/sofinder`, and exact-name public searches did not expose a
  conflicting file-manager package identity.
- The public `@sohophp/sofinder-ui` npm registry endpoint returned HTTP 404
  immediately before publication. The Packagist package endpoint was not
  reachable from the release environment, so registry indexing must be
  confirmed after the GitHub tag is published.

No new package-identity conflict was identified in this release delta check, so
beta.27 retains the name. The limitations and non-legal nature of the earlier
engineering rechecks remain unchanged.

## 2026-08-28 beta.28 engineering delta check

- This release only makes watermark pointer tracking consistent in Firefox and
  does not change the project name, package identities, positioning or visual
  branding.
- The beta.27 identity checks above remain current for this same-day corrective
  release.

No new package-identity conflict was introduced, so beta.28 retains the name.
